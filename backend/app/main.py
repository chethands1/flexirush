from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import redis.asyncio as redis
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from typing import List, Optional, Dict, Any, Union
import random
import uuid
import io
import csv
import datetime
import contextlib
import asyncio
import re

load_dotenv()

# --- GLOBAL SETTINGS ---
ACTIVE_MODEL = "gemini-1.5-flash" 
client = None

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    global client, ACTIVE_MODEL
    
    # 1. Initialize Client
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ CRITICAL ERROR: AI API Key is missing!")
        yield
        return

    try:
        client = genai.Client(api_key=api_key)
        print("✅ AI Client Initialized")

        # 2. AUTO-DISCOVERY
        preferred_order = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.5-pro", "gemini-1.0-pro"]
        found_model = None
        
        try:
            print("🔍 Scanning available AI models...")
            available_models = []
            for m in client.models.list(config={"page_size": 50}):
                 name = m.name.replace("models/", "")
                 available_models.append(name)
            
            for pref in preferred_order:
                if pref in available_models:
                    found_model = pref
                    break
            
            if not found_model:
                for m in available_models:
                    if "gemini" in m:
                        found_model = m
                        break
        except:
            pass
        
        if found_model:
            ACTIVE_MODEL = found_model
            print(f"🚀 LOCKED ON MODEL: {ACTIVE_MODEL}")
        else:
            ACTIVE_MODEL = "gemini-1.5-flash"

    except Exception as e:
        print(f"⚠️ AI Init Failed: {e}")

    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_url = os.getenv("REDIS_URL", "redis://redis:6379")
redis_client = redis.from_url(redis_url, decode_responses=True)

# --- MODELS ---
class VoteRequest(BaseModel):
    value: Union[str, int] 

class QnAPost(BaseModel):
    text: str

class UserAuth(BaseModel):
    email: str
    password: str

class JoinSession(BaseModel):
    name: str

class Poll(BaseModel):
    question: str
    type: str 
    options: Optional[List[Dict[str, Any]]] = []
    correct_option: Optional[int] = None
    words: Optional[Dict[str, int]] = {} 
    responses: Optional[List[str]] = []

class QuizStart(BaseModel):
    title: str
    questions: List[Dict[str, Any]]

class QuizAnswer(BaseModel):
    user_name: str
    option_index: int

class AIRequest(BaseModel):
    prompt: str

class SummarizeRequest(BaseModel):
    responses: List[str]

class BrandingRequest(BaseModel):
    logo_url: Optional[str] = None
    theme_color: Optional[str] = "#3b82f6"

class BanRequest(BaseModel):
    name: str

# --- WEBSOCKET MANAGER ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_code: str, user_id: str):
        await websocket.accept()
        if session_code not in self.active_connections:
            self.active_connections[session_code] = {}
        self.active_connections[session_code][user_id] = websocket

    def disconnect(self, session_code: str, user_id: str):
        if session_code in self.active_connections:
            if user_id in self.active_connections[session_code]:
                del self.active_connections[session_code][user_id]

    async def broadcast(self, session_code: str, message: dict):
        if session_code in self.active_connections:
            txt = json.dumps(message)
            for user_id, connection in list(self.active_connections[session_code].items()):
                try:
                    await connection.send_text(txt)
                except:
                    self.disconnect(session_code, user_id)

manager = ConnectionManager()

# --- HELPERS ---
async def get_session_data(code: str):
    data = await redis_client.get(f"session:{code}")
    return json.loads(data) if data else None

async def save_session_data(code: str, data: dict):
    await redis_client.set(f"session:{code}", json.dumps(data), ex=86400)

def extract_json(text: str) -> str:
    try:
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            return text[start:end+1]
        return text 
    except:
        return text

# --- ROUTES ---

@app.get("/")
async def root():
    return {"status": "ok", "service": "FlexiRush Backend", "model": ACTIVE_MODEL}

@app.post("/register")
async def register(user: UserAuth):
    exists = await redis_client.get(f"user:{user.email}")
    if exists: raise HTTPException(status_code=400, detail="User exists")
    user_data = {"email": user.email, "password": user.password, "id": str(uuid.uuid4())}
    await redis_client.set(f"user:{user.email}", json.dumps(user_data))
    return {"status": "created"}

@app.post("/token")
async def login(user: UserAuth):
    data = await redis_client.get(f"user:{user.email}")
    if not data: raise HTTPException(status_code=401, detail="Invalid credentials")
    stored_user = json.loads(data)
    if stored_user['password'] != user.password: raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": f"fake-jwt-{stored_user['id']}", "user": stored_user}

@app.get("/api/session/my-sessions")
async def my_sessions(): return []

@app.post("/api/session/create")
async def create_session():
    import string
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    initial_data = {
        "created_at": str(datetime.datetime.now()),
        "participants": [],
        "current_poll": None,
        "questions": [],
        "poll_results": {},
        "quiz": None,
        "quiz_scores": {},
        "branding": {"theme_color": "#3b82f6", "logo_url": ""},
        "activity_log": [] # ✅ NEW: HISTORY LOG
    }
    await save_session_data(code, initial_data)
    return {"code": code}

@app.get("/api/session/{code}/state")
async def get_state(code: str):
    data = await get_session_data(code)
    if not data: raise HTTPException(status_code=404, detail="Session not found")
    return data

@app.post("/api/session/{code}/join")
async def join_session(code: str, user: JoinSession):
    data = await get_session_data(code)
    if not data: raise HTTPException(status_code=404)
    user_id = str(uuid.uuid4())
    existing = next((p for p in data['participants'] if p['name'] == user.name), None)
    if not existing:
        data['participants'].append({"id": user_id, "name": user.name})
        await save_session_data(code, data)
        await manager.broadcast(code, {"type": "PARTICIPANT_UPDATE", "participants": data['participants']})
        return {"id": user_id, "name": user.name}
    return {"id": existing['id'], "name": existing['name']}

# --- INTERACTION ROUTES ---

@app.post("/api/session/{code}/poll/start")
async def start_poll(code: str, poll: Poll):
    data = await get_session_data(code)
    if not data: return
    data['current_poll'] = poll.dict()
    data['poll_results'] = {} 
    if poll.type == 'multiple_choice':
        for opt in poll.options: data['poll_results'][opt['label']] = 0
    await save_session_data(code, data)
    await manager.broadcast(code, {
        "type": "POLL_START", 
        "payload": poll.dict(),
        "results": data['poll_results']
    })
    return {"status": "ok"}

@app.post("/api/session/{code}/poll/end")
async def end_poll(code: str):
    data = await get_session_data(code)
    if not data: return
    
    # ✅ HISTORY: Save Poll to Log before clearing
    if data['current_poll']:
        if 'activity_log' not in data: data['activity_log'] = []
        data['activity_log'].append({
            "type": "poll",
            "timestamp": str(datetime.datetime.now()),
            "details": data['current_poll'],
            "results": data['poll_results']
        })

    data['current_poll'] = None
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "POLL_UPDATE", "payload": None, "results": {}})
    return {"status": "ended"}

@app.post("/api/session/{code}/vote")
async def vote(code: str, req: VoteRequest): 
    data = await get_session_data(code)
    if not data or not data.get('current_poll'): return {"error": "No poll"}
    
    poll = data['current_poll']
    poll_type = poll['type']
    value = req.value
    
    if poll_type == 'multiple_choice':
        val_str = str(value)
        if val_str in data['poll_results']:
            data['poll_results'][val_str] += 1
        else:
            data['poll_results'][val_str] = 1
    elif poll_type == 'rating':
        val_str = str(value)
        data['poll_results'][val_str] = data['poll_results'].get(val_str, 0) + 1
        total_score = sum(int(k)*v for k,v in data['poll_results'].items())
        total_votes = sum(data['poll_results'].values())
        poll['average'] = round(total_score / total_votes, 1) if total_votes > 0 else 0
    elif poll_type == 'word_cloud':
        val = str(value).strip().lower()
        if val: data['poll_results'][val] = data['poll_results'].get(val, 0) + 1
    elif poll_type == 'open_ended':
        val = str(value).strip()
        if 'responses' not in poll: poll['responses'] = []
        if val: poll['responses'].insert(0, val)

    await save_session_data(code, data)
    await manager.broadcast(code, {
        "type": "POLL_RESULTS_UPDATE", 
        "payload": poll,
        "results": data['poll_results']
    })
    return {"status": "recorded"}

@app.post("/api/session/{code}/question")
async def add_q(code: str, q: QnAPost):
    data = await get_session_data(code)
    new_q = {"id": str(uuid.uuid4()), "text": q.text, "votes": 0, "visible": True}
    if 'questions' not in data: data['questions'] = []
    data['questions'].append(new_q)
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "QNA_UPDATE", "payload": data['questions']})
    return {"status": "ok"}

@app.post("/api/session/{code}/question/{q_id}/toggle")
async def toggle_q(code: str, q_id: str):
    data = await get_session_data(code)
    for q in data['questions']:
        if q['id'] == q_id: q['visible'] = not q.get('visible', True)
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "QNA_UPDATE", "payload": data['questions']})
    return {"status": "ok"}

@app.post("/api/session/{code}/ban")
async def ban(code: str, req: BanRequest):
    data = await get_session_data(code)
    data['participants'] = [p for p in data['participants'] if p['name'] != req.name]
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "USER_KICKED", "target_name": req.name})
    await manager.broadcast(code, {"type": "PARTICIPANT_UPDATE", "participants": data['participants']})
    return {"status": "banned"}

# --- EXPORT ROUTE (UPDATED) ---
@app.get("/api/session/{code}/export")
async def export_results(code: str):
    data = await get_session_data(code)
    if not data: raise HTTPException(status_code=404)
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # 1. HEADER
    writer.writerow(["FLEXIRUSH SESSION REPORT"])
    writer.writerow(["Session Code", code])
    writer.writerow(["Created At", data.get("created_at", "")])
    writer.writerow(["Total Participants", len(data.get("participants", []))])
    writer.writerow([])

    # 2. PARTICIPANTS
    writer.writerow(["--- PARTICIPANT LIST ---"])
    writer.writerow(["Name", "Join ID"])
    for p in data.get("participants", []):
        writer.writerow([p['name'], p['id']])
    writer.writerow([])

    # 3. ACTIVITY LOG (POLLS & QUIZZES)
    writer.writerow(["--- DETAILED ACTIVITY LOG ---"])
    writer.writerow(["Timestamp", "Type", "Question/Title", "Detail/User", "Count/Score"])
    
    # Process Logs
    logs = data.get("activity_log", [])
    
    # Include ACTIVE item if exists
    if data.get("current_poll"):
        logs.append({"type": "poll", "details": data["current_poll"], "results": data["poll_results"], "timestamp": "ACTIVE NOW"})
    if data.get("quiz"):
        logs.append({"type": "quiz", "details": data["quiz"], "results": data["quiz_scores"], "timestamp": "ACTIVE NOW"})

    for item in logs:
        ts = item.get("timestamp", "")
        kind = item.get("type", "").upper()
        
        if kind == "POLL":
            details = item.get("details", {})
            results = item.get("results", {})
            question = details.get("question", "Unknown Question")
            writer.writerow([ts, "POLL", question, "-", "-"])
            
            if details.get("type") == "multiple_choice":
                for opt, count in results.items():
                    writer.writerow(["", "", "Option", opt, count])
            elif details.get("type") == "open_ended":
                for resp in details.get("responses", []):
                    writer.writerow(["", "", "Response", resp, "-"])
            elif details.get("type") == "rating":
                writer.writerow(["", "", "Average Rating", details.get("average", 0), "-"])
                
        elif kind == "QUIZ":
            details = item.get("details", {})
            scores = item.get("results", {})
            title = details.get("title", "Unknown Quiz")
            writer.writerow([ts, "QUIZ", title, "-", "-"])
            
            # Sort scores
            sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
            for i, (user, score) in enumerate(sorted_scores):
                writer.writerow(["", "", f"Rank {i+1}", user, score])
        
        writer.writerow([]) # Spacer

    # 4. Q&A LOG
    writer.writerow(["--- Q&A LOG ---"])
    writer.writerow(["Question Text", "Upvotes", "Status"])
    for q in data.get('questions', []):
        status = "Visible" if q.get('visible', True) else "Hidden"
        writer.writerow([q['text'], q['votes'], status])

    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()), 
        media_type="text/csv", 
        headers={"Content-Disposition": f"attachment; filename=FlexiRush_Report_{code}.csv"}
    )

# --- AI ROUTES ---
@app.post("/api/ai/summarize")
async def summarize(req: SummarizeRequest):
    if not client: return {"summary": "AI Config Missing"}
    try:
        response = client.models.generate_content(
            model=ACTIVE_MODEL, 
            contents=f"Summarize these audience thoughts in one funny sentence: {', '.join(req.responses)}"
        )
        return {"summary": response.text}
    except Exception as e:
        return {"summary": "AI is unavailable right now."}

@app.post("/api/ai/generate-quiz")
async def gen_quiz(req: AIRequest):
    if not client: return {"questions": []}
    
    prompt = f"""Generate a 5-question trivia quiz about "{req.prompt}".
    Return raw JSON only. NO Markdown. NO backticks.
    Format: {{ "title": "Quiz Title", "questions": [ {{ "text": "Q?", "options": ["A","B","C","D"], "correct_index": 0, "time_limit": 30 }} ] }}"""

    for attempt in range(3):
        try:
            res = client.models.generate_content(model=ACTIVE_MODEL, contents=prompt, config=types.GenerateContentConfig(response_mime_type="application/json"))
            raw_text = extract_json(res.text)
            data = json.loads(raw_text)
            if "questions" in data and len(data["questions"]) > 0: return data
        except Exception:
            await asyncio.sleep(1)
    return {"title": "Error", "questions": []}

@app.post("/api/session/{code}/branding")
async def brand(code: str, req: BrandingRequest):
    data = await get_session_data(code)
    data['branding'] = req.dict()
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "BRANDING_UPDATE", "payload": data['branding']})
    return {"status": "ok"}

# --- QUIZ ENDPOINTS (UPDATED FOR LOGGING) ---

@app.post("/api/session/{code}/quiz/start")
async def quiz_start(code: str, quiz: QuizStart):
    data = await get_session_data(code)
    # If a quiz is already active, log it before overwriting
    if data.get('quiz'):
        if 'activity_log' not in data: data['activity_log'] = []
        data['activity_log'].append({
            "type": "quiz",
            "timestamp": str(datetime.datetime.now()),
            "details": data['quiz'],
            "results": data['quiz_scores']
        })

    data['quiz'] = {
        "title": quiz.title, 
        "questions": quiz.questions, 
        "current_index": 0, 
        "state": "LOBBY",
        "answers_count": 0
    }
    data['quiz_scores'] = {}
    data['answered_users'] = []
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "QUIZ_UPDATE", "quiz": data['quiz'], "scores": {}})
    return {"status": "ok"}

@app.post("/api/session/{code}/quiz/next")
async def quiz_next(code: str):
    data = await get_session_data(code)
    quiz = data.get('quiz')
    if not quiz: return
    
    if quiz['state'] == 'LOBBY': 
        quiz['state'] = 'QUESTION'
        quiz['answers_count'] = 0
        data['answered_users'] = []
    elif quiz['state'] == 'QUESTION': 
        quiz['state'] = 'LEADERBOARD'
    elif quiz['state'] == 'LEADERBOARD':
        if quiz['current_index'] + 1 < len(quiz['questions']):
            quiz['current_index'] += 1
            quiz['state'] = 'QUESTION'
            quiz['answers_count'] = 0
            data['answered_users'] = []
        else:
            quiz['state'] = 'END'
            
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "QUIZ_UPDATE", "quiz": quiz, "scores": data['quiz_scores']})
    return {"status": "ok"}

@app.post("/api/session/{code}/quiz/reset")
async def quiz_reset(code: str):
    data = await get_session_data(code)
    
    # ✅ HISTORY: Save Quiz to Log before clearing
    if data.get('quiz'):
        if 'activity_log' not in data: data['activity_log'] = []
        data['activity_log'].append({
            "type": "quiz",
            "timestamp": str(datetime.datetime.now()),
            "details": data['quiz'],
            "results": data['quiz_scores']
        })

    data['quiz'] = None
    data['quiz_scores'] = {} 
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "QUIZ_UPDATE", "quiz": None, "scores": {}})
    return {"status": "reset"}

@app.post("/api/session/{code}/quiz/answer")
async def quiz_ans(code: str, ans: QuizAnswer):
    data = await get_session_data(code)
    quiz = data.get('quiz')
    if quiz and quiz['state'] == 'QUESTION':
        answered_list = data.get('answered_users', [])
        if ans.user_name in answered_list:
            return {"status": "already_answered"}
        
        answered_list.append(ans.user_name)
        data['answered_users'] = answered_list
        quiz['answers_count'] = len(answered_list)

        q = quiz['questions'][quiz['current_index']]
        correct_idx = q.get('correct_index', 0)
        if ans.option_index == correct_idx:
            data['quiz_scores'][ans.user_name] = data['quiz_scores'].get(ans.user_name, 0) + 100
        
        await save_session_data(code, data)
        await manager.broadcast(code, {"type": "QUIZ_UPDATE", "quiz": quiz, "scores": data['quiz_scores']})
        
    return {"status": "ok"}

@app.post("/api/session/{code}/quiz/generate")
async def generate_quiz_session_proxy(code: str, req: AIRequest):
    return await gen_quiz(req)

@app.websocket("/ws/{code}/{user_id}")
async def ws_endpoint(websocket: WebSocket, code: str, user_id: str):
    await manager.connect(websocket, code, user_id)
    try:
        while True: await websocket.receive_text()
    except:
        manager.disconnect(code, user_id)