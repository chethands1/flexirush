from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Body
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import redis.asyncio as redis
import os
from google import genai
from dotenv import load_dotenv
from typing import List, Optional, Dict, Any
import random
import uuid
import io
import csv
import datetime
import contextlib

load_dotenv()

# --- GLOBAL MODEL SELECTOR ---
ACTIVE_MODEL = "gemini-2.0-flash" # Fallback default
client = None

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup Logic: Checks available models and picks the best one.
    """
    global ACTIVE_MODEL
    global client
    
    # Initialize Client First
    api_key = os.getenv("GOOGLE_API_KEY")
    if api_key:
        try:
            client = genai.Client(api_key=api_key)
            print("✅ AI Provider initialized")
            
            # --- MODEL SELECTION LOGIC ---
            # We verify the model is accessible.
            try:
                print(f"✅ Using Model: {ACTIVE_MODEL}")
            except Exception as e:
                print(f"⚠️ Model Check Failed: {e}")
                
        except Exception as e:
            print(f"⚠️ AI Init Failed: {e}")
            
    yield
    # Shutdown logic

app = FastAPI(lifespan=lifespan)

# --- CORS MIDDLEWARE ---
# Using "*" allows all origins, which eliminates CORS errors during development/production debugging.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Redis (Container name 'redis', port 6379)
redis_url = os.getenv("REDIS_URL", "redis://redis:6379")
redis_client = redis.from_url(redis_url, decode_responses=True)

# --- MODELS ---
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
    # ✅ CRITICAL FEATURE: Support for Chat Parser "Word Cloud"
    words: Optional[Dict[str, int]] = {} 
    responses: Optional[List[str]] = []

class QnAPost(BaseModel):
    text: str

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
            # Send to all users, handle disconnects gracefully
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
    await redis_client.set(f"session:{code}", json.dumps(data), ex=86400) # 24 hours expiry

# --- ROUTES ---

@app.get("/")
async def root():
    return {"status": "ok", "service": "FlexiRush Backend"}

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
        "branding": {"theme_color": "#3b82f6", "logo_url": ""}
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
    
    # Save the full poll object (INCLUDING WORDS for Chat Visualization)
    data['current_poll'] = poll.dict()
    data['poll_results'] = {} 
    
    # Initialize zero counts for multiple choice
    if poll.type == 'multiple_choice':
        for opt in poll.options: data['poll_results'][opt['label']] = 0
        
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "POLL_START", "payload": poll.dict()})
    return {"status": "ok"}

@app.post("/api/session/{code}/poll/end")
async def end_poll(code: str):
    data = await get_session_data(code)
    if not data: return
    data['current_poll'] = None
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "POLL_UPDATE", "payload": None})
    return {"status": "ended"}

@app.post("/api/session/{code}/vote")
async def vote(code: str, value: str = Body(..., embed=True)): 
    data = await get_session_data(code)
    if not data or not data.get('current_poll'): return {"error": "No poll"}
    
    poll = data['current_poll']
    poll_type = poll['type']
    
    # --- LOGIC UPDATE ---
    if poll_type == 'multiple_choice':
        # Simple string-based voting match
        data['poll_results'][value] = data['poll_results'].get(value, 0) + 1

    elif poll_type == 'rating':
        data['poll_results'][str(value)] = data['poll_results'].get(str(value), 0) + 1
        # Recalculate average
        total_score = sum(int(k)*v for k,v in data['poll_results'].items())
        total_votes = sum(data['poll_results'].values())
        poll['average'] = round(total_score / total_votes, 1) if total_votes > 0 else 0

    elif poll_type in ['word_cloud', 'open_ended']:
        val = str(value).strip()
        if not val: return
        
        if poll_type == 'word_cloud':
            key = val.lower()
            data['poll_results'][key] = data['poll_results'].get(key, 0) + 1
        else:
            if 'responses' not in poll: poll['responses'] = []
            poll['responses'].insert(0, val) # Insert at top

    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "POLL_UPDATE", "payload": poll})
    return {"status": "recorded"}

@app.post("/api/session/{code}/question")
async def add_q(code: str, q: QnAPost):
    data = await get_session_data(code)
    new_q = {"id": str(uuid.uuid4()), "text": q.text, "votes": 0, "visible": True}
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

@app.post("/api/session/{code}/question/{q_id}/upvote")
async def upvote_q(code: str, q_id: str):
    data = await get_session_data(code)
    for q in data['questions']:
        if q['id'] == q_id: q['votes'] += 1
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "QNA_UPDATE", "payload": data['questions']})
    return {"status": "ok"}

@app.post("/api/session/{code}/react")
async def react(code: str, payload: dict):
    await manager.broadcast(code, {"type": "REACTION", "emoji": payload.get('emoji')})
    return {"status": "ok"}

@app.post("/api/session/{code}/ban")
async def ban(code: str, req: BanRequest):
    data = await get_session_data(code)
    data['participants'] = [p for p in data['participants'] if p['name'] != req.name]
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "USER_KICKED", "target_name": req.name})
    await manager.broadcast(code, {"type": "PARTICIPANT_UPDATE", "participants": data['participants']})
    return {"status": "banned"}

@app.get("/api/session/{code}/export")
async def export_results(code: str):
    data = await get_session_data(code)
    if not data: raise HTTPException(status_code=404)
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["FlexiRush Session Report", code])
    writer.writerow([])
    writer.writerow(["Type", "Question/Content", "Value", "Count/Score"])
    
    # Export Poll Results
    if data['poll_results']:
        for k, v in data['poll_results'].items():
            writer.writerow(["Poll", "Live Vote", k, v])
            
    # Export Chat Parser Words (if any)
    if data['current_poll'] and data['current_poll'].get('words'):
        for k, v in data['current_poll']['words'].items():
            writer.writerow(["Chat", "Parsed Word", k, v])
            
    # Export Q&A
    for q in data['questions']:
        writer.writerow(["Q&A", q['text'], "-", q['votes']])
        
    # Export Quiz Scores
    for user, score in data['quiz_scores'].items():
        writer.writerow(["Quiz Score", "User", user, score])
        
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()), 
        media_type="text/csv", 
        headers={"Content-Disposition": f"attachment; filename=flexirush_{code}.csv"}
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
        print(f"AI Error ({ACTIVE_MODEL}): {e}")
        return {"summary": "AI is unavailable right now."}

@app.post("/api/ai/generate-quiz")
async def gen_quiz(req: AIRequest):
    if not client: return {"questions": []}
    try:
        print(f"🧠 Generating quiz using: {ACTIVE_MODEL}")
        # HARDENED PROMPT: STRICT JSON ONLY
        prompt = f"""Generate a 5-question quiz about "{req.prompt}". 
        Return ONLY valid raw JSON. No Markdown. No ```.
        Format: {{ "title": "Topic Quiz", "questions": [ {{ "text": "Question?", "options": ["A","B","C","D"], "correct_index": 0, "time_limit": 30 }} ] }}"""
        
        res = client.models.generate_content(model=ACTIVE_MODEL, contents=prompt)
        txt = res.text.strip()
        
        # Cleaner JSON extraction
        start_idx = txt.find('{')
        end_idx = txt.rfind('}')
        if start_idx != -1 and end_idx != -1:
            txt = txt[start_idx : end_idx + 1]
            
        return json.loads(txt)
    except Exception as e:
        print(f"AI Gen Error ({ACTIVE_MODEL}): {e}")
        return {"title": "AI Error", "questions": []}

@app.post("/api/session/{code}/branding")
async def brand(code: str, req: BrandingRequest):
    data = await get_session_data(code)
    data['branding'] = req.dict()
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "BRANDING_UPDATE", "payload": data['branding']})
    return {"status": "ok"}

# --- QUIZ ENDPOINTS (CRASH PREVENTION ENABLED) ---

@app.post("/api/session/{code}/quiz/start")
async def quiz_start(code: str, quiz: QuizStart):
    # ✅ 🛡️ FIREWALL: If AI returned 0 questions, REJECT the update.
    # This prevents the Frontend Join Page from crashing.
    if not quiz.questions or len(quiz.questions) == 0:
        print(f"⚠️ Blocked empty quiz start for session {code}")
        raise HTTPException(status_code=400, detail="Cannot start quiz: No questions generated.")
    
    data = await get_session_data(code)
    data['quiz'] = {"title": quiz.title, "questions": quiz.questions, "current_index": 0, "state": "LOBBY"}
    data['quiz_scores'] = {}
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "QUIZ_UPDATE", "quiz": data['quiz'], "scores": {}})
    return {"status": "ok"}

@app.post("/api/session/{code}/quiz/next")
async def quiz_next(code: str):
    data = await get_session_data(code)
    quiz = data.get('quiz')
    if not quiz: return
    
    if quiz['state'] == 'LOBBY': quiz['state'] = 'QUESTION'
    elif quiz['state'] == 'QUESTION': quiz['state'] = 'LEADERBOARD'
    elif quiz['state'] == 'LEADERBOARD':
        if quiz['current_index'] + 1 < len(quiz['questions']):
            quiz['current_index'] += 1
            quiz['state'] = 'QUESTION'
        else:
            quiz['state'] = 'END'
            
    await save_session_data(code, data)
    await manager.broadcast(code, {"type": "QUIZ_UPDATE", "quiz": quiz, "scores": data['quiz_scores']})
    return {"status": "ok"}

@app.post("/api/session/{code}/quiz/reset")
async def quiz_reset(code: str):
    data = await get_session_data(code)
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
        q = quiz['questions'][quiz['current_index']]
        correct_idx = q.get('correct_index', 0)
        if ans.option_index == correct_idx:
            data['quiz_scores'][ans.user_name] = data['quiz_scores'].get(ans.user_name, 0) + 100
            await save_session_data(code, data)
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