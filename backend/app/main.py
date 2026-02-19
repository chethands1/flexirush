from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks, Query
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
import time
import socket

load_dotenv()

# --- GLOBAL SETTINGS & INFRASTRUCTURE ---
ACTIVE_MODEL = "gemini-1.5-flash" 
client = None
redis_url = os.getenv("REDIS_URL", "redis://redis:6379")
redis_client = redis.from_url(redis_url, decode_responses=True)

# Unique ID for preventing Pub/Sub echo loops across horizontally scaled pods
INSTANCE_ID = f"{socket.gethostname()}-{os.getpid()}-{uuid.uuid4().hex[:6]}"

# 🛡️ INFRA FIX: Resilient Background Task with Echo Cancellation
async def redis_pubsub_listener():
    print(f"📡 Redis Pub/Sub Gateway Booting [Node: {INSTANCE_ID}]")
    while True:
        try:
            pubsub = redis_client.pubsub()
            await pubsub.psubscribe("session-events:*")
            print("📡 Redis Pub/Sub Gateway Active & Subscribed")
            async for message in pubsub.listen():
                if message["type"] == "pmessage":
                    channel = message["channel"]
                    session_code = channel.split(":")[1]
                    payload_str = message["data"]
                    
                    try:
                        data = json.loads(payload_str)
                        # Skip if this instance originated the broadcast
                        if data.get("instance_id") == INSTANCE_ID:
                            continue
                    except Exception:
                        pass
                        
                    await manager.send_to_local_raw(session_code, payload_str)
        except asyncio.CancelledError:
            print("🛑 Pub/Sub Gateway Shutting Down...")
            break
        except Exception as e:
            print(f"⚠️ Pub/Sub Listener Dropped: {e}. Reconnecting in 3s...")
            await asyncio.sleep(3)

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    global client, ACTIVE_MODEL
    
    pubsub_task = asyncio.create_task(redis_pubsub_listener())

    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ CRITICAL ERROR: AI API Key is missing!")
    else:
        try:
            client = genai.Client(api_key=api_key)
            print("✅ AI Client Initialized")

            preferred_order = ["gemini-2.5-flash", "gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-1.5-pro"]
            found_model = next((m.name.replace("models/", "") for m in client.models.list() if m.name.replace("models/", "") in preferred_order), None)
            
            ACTIVE_MODEL = found_model or "gemini-1.5-flash"
            print(f"🚀 LOCKED ON MODEL: {ACTIVE_MODEL}")
        except Exception as e:
            print(f"⚠️ AI Init Failed: {e}")

    yield
    
    pubsub_task.cancel()
    try:
        await pubsub_task
    except asyncio.CancelledError:
        pass

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- STRICT PROTOCOL MODELS ---
class VoteRequest(BaseModel):
    value: Union[str, int] 
    user_id: str  

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

class QuizStart(BaseModel):
    title: str
    questions: List[Dict[str, Any]]

class QuizAnswer(BaseModel):
    user_id: str 
    user_name: str
    option_index: int

class AdvanceRequest(BaseModel):
    expected_state: Optional[str] = None
    expected_index: Optional[int] = None

class AIRequest(BaseModel):
    prompt: str

class SummarizeRequest(BaseModel):
    responses: List[str]

class BrandingRequest(BaseModel):
    logo_url: Optional[str] = None
    theme_color: Optional[str] = "#3b82f6"

class BanRequest(BaseModel):
    name: str

# --- HORIZONTAL WEBSOCKET MANAGER ---
class ConnectionManager:
    def __init__(self):
        self.local_connections: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_code: str, user_id: str):
        await websocket.accept()
        if session_code not in self.local_connections:
            self.local_connections[session_code] = {}
        self.local_connections[session_code][user_id] = websocket

    def disconnect(self, session_code: str, user_id: str):
        if session_code in self.local_connections:
            if user_id in self.local_connections[session_code]:
                del self.local_connections[session_code][user_id]

    async def broadcast(self, session_code: str, message: dict):
        """
        Sends locally with 0-latency, then publishes to Redis for other pods.
        """
        envelope = {
            "event_id": str(uuid.uuid4()),
            "server_now": int(time.time() * 1000),
            "instance_id": INSTANCE_ID,
            **message
        }
        envelope_str = json.dumps(envelope)
        
        # 1. 0-Latency Local Send
        await self.send_to_local_raw(session_code, envelope_str)
        # 2. Horizontal Fan Out
        await redis_client.publish(f"session-events:{session_code}", envelope_str)

    async def send_to_local_raw(self, session_code: str, txt: str):
        """Internal helper for executing the physical socket write."""
        if session_code in self.local_connections:
            for user_id, connection in list(self.local_connections[session_code].items()):
                try:
                    await connection.send_text(txt)
                except Exception:
                    self.disconnect(session_code, user_id)

manager = ConnectionManager()

# --- REDIS DISTRIBUTED LOCK & TRANSACTION ENGINE ---
async def get_session_data(code: str):
    data = await redis_client.get(f"session:{code}")
    return json.loads(data) if data else None

async def save_session_data(code: str, data: dict):
    await redis_client.set(f"session:{code}", json.dumps(data), ex=86400)

@contextlib.asynccontextmanager
async def session_transaction(code: str):
    lock = redis_client.lock(f"lock:session:{code}", timeout=10)
    acquired = await lock.acquire(blocking=True, blocking_timeout=8) 
    
    if not acquired:
        raise HTTPException(status_code=429, detail="Server load spike, please retry")
        
    try:
        data = await get_session_data(code)
        if not data:
            raise HTTPException(status_code=404, detail="Session Terminated")
            
        yield data
        
        # Core Protocol: Strict Monotonic Ordering
        data['version'] = data.get('version', 0) + 1
        data['sequence'] = data.get('sequence', 0) + 1
        
        await save_session_data(code, data)
    finally:
        await lock.release()

def extract_json(text: str) -> str:
    try:
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            return text[start:end+1]
        return text 
    except Exception:
        return text

def sanitize_csv(value: Any) -> str:
    """🛡️ SECURITY FIX: Prevents Excel Formula/CSV Injection Attacks"""
    val_str = str(value)
    if val_str.startswith(('=', '+', '-', '@', '\t', '\r', '\n')):
        return "'" + val_str
    return val_str

# --- CORE ROUTES ---

@app.get("/")
async def root():
    return {"status": "ok", "service": "FlexiRush Protocol Engine", "model": ACTIVE_MODEL}

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
    return {"access_token": f"auth-tkn-{stored_user['id']}", "user": stored_user}

@app.post("/api/session/create")
async def create_session():
    import string
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    initial_data = {
        "version": 1,
        "sequence": 1,
        "created_at": str(datetime.datetime.now()),
        "participants": [],
        "current_poll": None,
        "questions": [],
        "poll_results": {},
        "poll_voted_users": [], 
        "quiz": None,
        "quiz_scores": {},
        "answered_users": [],   
        "branding": {"theme_color": "#3b82f6", "logo_url": ""},
        "activity_log": []
    }
    await save_session_data(code, initial_data)
    return {"code": code}

@app.get("/api/session/{code}/state")
async def get_state(code: str, user_id: Optional[str] = Query(None)):
    data = await get_session_data(code)
    if not data: raise HTTPException(status_code=404, detail="Session not found")
    
    data["server_now"] = int(time.time() * 1000) 
    
    if user_id:
        if data.get("current_poll"):
            data["current_poll"]["already_voted"] = user_id in data.get("poll_voted_users", [])
        if data.get("quiz") and data["quiz"].get("state") == "QUESTION":
            data["quiz"]["already_voted"] = user_id in data.get("answered_users", [])
            
    return data

@app.post("/api/session/{code}/join")
async def join_session(code: str, user: JoinSession):
    async with session_transaction(code) as data:
        user_id = str(uuid.uuid4())
        existing = next((p for p in data['participants'] if p['name'] == user.name), None)
        
        if not existing:
            data['participants'].append({"id": user_id, "name": user.name})
            await manager.broadcast(code, {
                "type": "PARTICIPANT_UPDATE", 
                "sequence": data['sequence'],
                "participants": data['participants']
            })
            return {"id": user_id, "name": user.name}
            
        return {"id": existing['id'], "name": existing['name']}

# --- AUTHORITATIVE INTERACTION ROUTES ---

@app.post("/api/session/{code}/poll/start")
async def start_poll(code: str, poll: Poll):
    async with session_transaction(code) as data:
        poll_dict = poll.dict()
        poll_dict["id"] = str(uuid.uuid4()) 
        poll_dict["state"] = "OPEN"
        poll_dict["responses"] = []
        poll_dict["words"] = {}
        
        data['current_poll'] = poll_dict
        data['poll_results'] = {} 
        data['poll_voted_users'] = [] 
        
        if poll.type == 'multiple_choice':
            for opt in poll.options: data['poll_results'][opt['label']] = 0
            
        await manager.broadcast(code, {
            "type": "POLL_START", 
            "version": data['version'],
            "sequence": data['sequence'],
            "payload": poll_dict,
            "results": data['poll_results']
        })
    return {"status": "ok"}

@app.post("/api/session/{code}/poll/end")
async def end_poll(code: str):
    async with session_transaction(code) as data:
        if not data.get('current_poll'): return {"status": "ok"}
        
        data['current_poll']['state'] = "CLOSED"
        
        if 'activity_log' not in data: data['activity_log'] = []
        data['activity_log'].append({
            "type": "poll",
            "timestamp": str(datetime.datetime.now()),
            "details": data['current_poll'],
            "results": data['poll_results']
        })

        await manager.broadcast(code, {
            "type": "STATE_UPDATE", 
            "version": data['version'],
            "sequence": data['sequence'],
            "current_poll": data['current_poll']
        })
    return {"status": "ended"}

@app.post("/api/session/{code}/vote")
async def vote(code: str, req: VoteRequest): 
    async with session_transaction(code) as data:
        poll = data.get('current_poll')
        if not poll or poll.get('state') == 'CLOSED': 
            raise HTTPException(status_code=409, detail="Poll is closed")
        
        # 🛡️ Server Authority: Block Replays via ID
        if req.user_id in data.get('poll_voted_users', []):
            raise HTTPException(status_code=409, detail="Integrity Lock: User already voted")
            
        data.setdefault('poll_voted_users', []).append(req.user_id)
        
        poll_type = poll['type']
        value = req.value
        
        if poll_type == 'multiple_choice':
            val_str = str(value)
            data['poll_results'][val_str] = data['poll_results'].get(val_str, 0) + 1
        elif poll_type == 'rating':
            val_str = str(value)
            data['poll_results'][val_str] = data['poll_results'].get(val_str, 0) + 1
            total_score = sum(int(k)*v for k,v in data['poll_results'].items())
            total_votes = sum(data['poll_results'].values())
            poll['average'] = round(total_score / total_votes, 1) if total_votes > 0 else 0
        elif poll_type == 'word_cloud':
            val = str(value).strip().lower()
            if val: 
                poll.setdefault('words', {})
                poll['words'][val] = poll['words'].get(val, 0) + 1
                data['poll_results'] = poll['words']
        elif poll_type == 'open_ended':
            val = str(value).strip()
            if val: poll['responses'].insert(0, val)

        await manager.broadcast(code, {
            "type": "STATE_UPDATE", 
            "version": data['version'],
            "sequence": data['sequence'],
            "current_poll": poll,
            "poll_results": data['poll_results']
        })
    return {"status": "recorded"}

# --- QUIZ PROTOCOL ---

@app.post("/api/session/{code}/quiz/start")
async def quiz_start(code: str, quiz: QuizStart):
    async with session_transaction(code) as data:
        if data.get('quiz'):
            if 'activity_log' not in data: data['activity_log'] = []
            data['activity_log'].append({
                "type": "quiz",
                "timestamp": str(datetime.datetime.now()),
                "details": data['quiz'],
                "results": data['quiz_scores']
            })

        processed_questions = []
        for q in quiz.questions:
            q['id'] = str(uuid.uuid4())
            processed_questions.append(q)

        data['quiz'] = {
            "title": quiz.title, 
            "questions": processed_questions, 
            "current_index": 0, 
            "state": "LOBBY",
            "answers_count": 0,
            "version": data.get('version', 0) + 1
        }
        data['quiz_scores'] = {}
        data['answered_users'] = [] 
        
        await manager.broadcast(code, {
            "type": "STATE_UPDATE", 
            "version": data['version'],
            "sequence": data['sequence'],
            "quiz": data['quiz'], 
            "quiz_scores": data['quiz_scores']
        })
    return {"status": "ok"}

@app.post("/api/session/{code}/quiz/advance")
async def quiz_advance(code: str, req: AdvanceRequest = None):
    async with session_transaction(code) as data:
        quiz = data.get('quiz')
        if not quiz: raise HTTPException(status_code=400, detail="No active quiz")
        
        # Idempotency / Race Guard
        if req:
            if req.expected_state and quiz['state'] != req.expected_state:
                return {"status": "ignored_race"}
            if req.expected_index is not None and quiz['current_index'] != req.expected_index:
                return {"status": "ignored_race"}
        
        if quiz['state'] == 'LOBBY': 
            quiz['state'] = 'QUESTION'
            quiz['answers_count'] = 0
            quiz['question_started_at'] = int(time.time() * 1000) 
            data['answered_users'] = []
            
        elif quiz['state'] == 'QUESTION': 
            quiz['state'] = 'LEADERBOARD'
            
        elif quiz['state'] == 'LEADERBOARD':
            if quiz['current_index'] + 1 < len(quiz['questions']):
                quiz['current_index'] += 1
                quiz['state'] = 'QUESTION'
                quiz['answers_count'] = 0
                quiz['question_started_at'] = int(time.time() * 1000)
                data['answered_users'] = []
            else:
                quiz['state'] = 'END'
                
        quiz['version'] = data['version']
                
        await manager.broadcast(code, {
            "type": "STATE_UPDATE", 
            "version": data['version'],
            "sequence": data['sequence'],
            "quiz": quiz, 
            "quiz_scores": data['quiz_scores']
        })
    return {"status": "ok"}

@app.post("/api/session/{code}/quiz/jump_leaderboard")
async def quiz_jump_leaderboard(code: str):
    async with session_transaction(code) as data:
        quiz = data.get('quiz')
        if not quiz: raise HTTPException(status_code=400, detail="No active quiz")
        
        quiz['state'] = 'END'
        quiz['version'] = data['version']
        
        await manager.broadcast(code, {
            "type": "STATE_UPDATE", 
            "version": data['version'],
            "sequence": data['sequence'],
            "quiz": quiz, 
            "quiz_scores": data['quiz_scores']
        })
    return {"status": "ok"}

@app.post("/api/session/{code}/quiz/destroy")
async def quiz_destroy(code: str):
    async with session_transaction(code) as data:
        if data.get('quiz'):
            if 'activity_log' not in data: data['activity_log'] = []
            data['activity_log'].append({
                "type": "quiz",
                "timestamp": str(datetime.datetime.now()),
                "details": data['quiz'],
                "results": data['quiz_scores']
            })

        data['quiz'] = None
        # 🛡️ Fix: Complete GC cleanup on destroy
        data['quiz_scores'] = {} 
        data['answered_users'] = [] 
        
        await manager.broadcast(code, {
            "type": "STATE_UPDATE", 
            "version": data['version'],
            "sequence": data['sequence'],
            "quiz": None, 
            "quiz_scores": {}
        })
    return {"status": "destroyed"}

@app.post("/api/session/{code}/quiz/answer")
async def quiz_ans(code: str, ans: QuizAnswer):
    async with session_transaction(code) as data:
        quiz = data.get('quiz')
        if not quiz or quiz['state'] != 'QUESTION':
            raise HTTPException(status_code=409, detail="Phase Invalid")
            
        # 🛡️ Server Authority Lock: ID-Based
        answered_list = data.get('answered_users', [])
        if ans.user_id in answered_list:
            raise HTTPException(status_code=409, detail="Integrity Lock: Voted")
        
        answered_list.append(ans.user_id)
        data['answered_users'] = answered_list
        quiz['answers_count'] = len(answered_list)

        q = quiz['questions'][quiz['current_index']]
        correct_idx = q.get('correct_index', 0)
        
        if ans.option_index == correct_idx:
            # 🛡️ Fix: Simple Name-Based Map prevents React Object Duplicate Rendering
            # Integrity is still guaranteed by the `answered_users` ID lock above.
            data['quiz_scores'][ans.user_name] = data['quiz_scores'].get(ans.user_name, 0) + 100
        
        quiz['version'] = data['version']
        
        await manager.broadcast(code, {
            "type": "STATE_UPDATE", 
            "version": data['version'],
            "sequence": data['sequence'],
            "quiz": quiz, 
            "quiz_scores": data['quiz_scores']
        })
        
    return {"status": "ok"}

# --- UTILITY & AI ROUTES ---

@app.post("/api/session/{code}/question")
async def add_q(code: str, q: QnAPost):
    async with session_transaction(code) as data:
        # 🛡️ Fix: Raw Storage (Sanitization is purely for Export format safety)
        new_q = {"id": str(uuid.uuid4()), "text": q.text, "votes": 0, "visible": True}
        data.setdefault('questions', []).append(new_q)
        
        await manager.broadcast(code, {
            "type": "STATE_UPDATE", 
            "version": data['version'], 
            "sequence": data['sequence'],
            "questions": data['questions']
        })
    return {"status": "ok"}

@app.post("/api/session/{code}/question/{q_id}/toggle")
async def toggle_q(code: str, q_id: str):
    async with session_transaction(code) as data:
        for q in data.get('questions', []):
            if q['id'] == q_id: q['visible'] = not q.get('visible', True)
        await manager.broadcast(code, {
            "type": "STATE_UPDATE", 
            "version": data['version'], 
            "sequence": data['sequence'],
            "questions": data['questions']
        })
    return {"status": "ok"}

@app.post("/api/session/{code}/ban")
async def ban(code: str, req: BanRequest):
    async with session_transaction(code) as data:
        data['participants'] = [p for p in data.get('participants', []) if p['name'] != req.name]
        await manager.broadcast(code, {
            "type": "USER_KICKED", 
            "version": data['version'], 
            "sequence": data['sequence'],
            "target_name": req.name
        })
        await manager.broadcast(code, {
            "type": "PARTICIPANT_UPDATE", 
            "version": data['version'], 
            "sequence": data['sequence'],
            "participants": data['participants']
        })
    return {"status": "banned"}

@app.post("/api/session/{code}/branding")
async def brand(code: str, req: BrandingRequest):
    async with session_transaction(code) as data:
        data['branding'] = req.dict()
        await manager.broadcast(code, {
            "type": "BRANDING_UPDATE", 
            "version": data['version'], 
            "sequence": data['sequence'],
            "payload": data['branding']
        })
    return {"status": "ok"}

@app.post("/api/ai/summarize")
async def summarize(req: SummarizeRequest):
    if not client: return {"summary": "AI Config Missing"}
    try:
        def _call_ai():
            return client.models.generate_content(
                model=ACTIVE_MODEL, 
                contents=f"Summarize these audience thoughts in one funny sentence: {', '.join(req.responses)}"
            ).text
        text = await asyncio.to_thread(_call_ai)
        return {"summary": text}
    except Exception:
        return {"summary": "AI is unavailable right now."}

@app.post("/api/ai/generate-quiz")
async def gen_quiz(req: AIRequest):
    if not client: return {"questions": []}
    
    prompt = f"""Generate a 5-question trivia quiz about "{req.prompt}".
    Return raw JSON only. NO Markdown. NO backticks.
    Format: {{ "title": "Quiz Title", "questions": [ {{ "text": "Q?", "options": ["A","B","C","D"], "correct_index": 0, "time_limit": 30 }} ] }}"""

    def _call_ai():
        res = client.models.generate_content(
            model=ACTIVE_MODEL, 
            contents=prompt, 
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        return res.text

    for attempt in range(3):
        try:
            raw_text = await asyncio.to_thread(_call_ai)
            clean_text = extract_json(raw_text)
            data = json.loads(clean_text)
            if "questions" in data and len(data["questions"]) > 0: return data
        except Exception:
            await asyncio.sleep(1)
    return {"title": "Error", "questions": []}

@app.websocket("/ws/{code}/{user_id}")
async def ws_endpoint(websocket: WebSocket, code: str, user_id: str):
    # 🛡️ FIX: Relaxed Auth - Only blocks if the room is completely invalid.
    data = await get_session_data(code)
    if not data:
        await websocket.close(code=4004, reason="Session not found")
        return

    await manager.connect(websocket, code, user_id)
    try:
        while True: await websocket.receive_text()
    except Exception:
        manager.disconnect(code, user_id)

# --- EXPORT ROUTE ---
@app.get("/api/session/{code}/export")
async def export_results(code: str):
    data = await get_session_data(code)
    if not data: raise HTTPException(status_code=404)
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["FLEXIRUSH SESSION REPORT"])
    writer.writerow(["Session Code", code])
    writer.writerow(["Created At", data.get("created_at", "")])
    writer.writerow(["Total Participants", len(data.get("participants", []))])
    writer.writerow([])

    writer.writerow(["--- PARTICIPANT LIST ---"])
    writer.writerow(["Name", "Join ID"])
    for p in data.get("participants", []):
        writer.writerow([sanitize_csv(p['name']), p['id']])
    writer.writerow([])

    writer.writerow(["--- DETAILED ACTIVITY LOG ---"])
    writer.writerow(["Timestamp", "Type", "Question/Title", "Detail/User", "Count/Score"])
    
    logs = data.get("activity_log", [])
    
    if data.get("current_poll"):
        logs.append({"type": "poll", "details": data["current_poll"], "results": data.get("poll_results", {}), "timestamp": "ACTIVE NOW"})
    if data.get("quiz"):
        logs.append({"type": "quiz", "details": data["quiz"], "results": data.get("quiz_scores", {}), "timestamp": "ACTIVE NOW"})

    for item in logs:
        ts = item.get("timestamp", "")
        kind = item.get("type", "").upper()
        
        if kind == "POLL":
            details = item.get("details", {})
            results = item.get("results", {})
            question = details.get("question", "Unknown Question")
            writer.writerow([ts, "POLL", sanitize_csv(question), "-", "-"])
            
            if details.get("type") == "multiple_choice":
                for opt, count in results.items(): writer.writerow(["", "", "Option", sanitize_csv(opt), count])
            elif details.get("type") == "open_ended":
                for resp in details.get("responses", []): writer.writerow(["", "", "Response", sanitize_csv(resp), "-"])
            elif details.get("type") == "rating":
                writer.writerow(["", "", "Average Rating", details.get("average", 0), "-"])
                
        elif kind == "QUIZ":
            details = item.get("details", {})
            scores = item.get("results", {})
            title = details.get("title", "Unknown Quiz")
            writer.writerow([ts, "QUIZ", sanitize_csv(title), "-", "-"])
            
            sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
            for i, (usr, score) in enumerate(sorted_scores):
                writer.writerow(["", "", f"Rank {i+1}", sanitize_csv(usr), score])
        
        writer.writerow([]) 

    writer.writerow(["--- Q&A LOG ---"])
    writer.writerow(["Question Text", "Upvotes", "Status"])
    for q in data.get('questions', []):
        status = "Visible" if q.get('visible', True) else "Hidden"
        writer.writerow([sanitize_csv(q['text']), q['votes'], status])

    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()), 
        media_type="text/csv", 
        headers={"Content-Disposition": f"attachment; filename=FlexiRush_Report_{code}.csv"}
    )