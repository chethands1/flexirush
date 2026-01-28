from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.responses import StreamingResponse
from typing import List, Dict, Optional, Literal
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from better_profanity import profanity
import uuid
import json
import redis
import os
import random
import csv
import io

# Import your DB models and auth utilities
from .. import models, database, auth

# --- CONFIGURATION ---
router = APIRouter(tags=["Session"])
ws_router = APIRouter()

# Initialize the profanity filter
profanity.load_censor_words()

# Redis Connection
redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
db = redis.from_url(redis_url, decode_responses=True)

# --- WEBSOCKET MANAGER ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_code: str):
        if session_code not in self.active_connections:
            self.active_connections[session_code] = []
        self.active_connections[session_code].append(websocket)

    def disconnect(self, websocket: WebSocket, session_code: str):
        if session_code in self.active_connections:
            if websocket in self.active_connections[session_code]:
                self.active_connections[session_code].remove(websocket)
            if not self.active_connections[session_code]:
                del self.active_connections[session_code]

    async def broadcast(self, message: dict, session_code: str):
        if session_code in self.active_connections:
            for connection in self.active_connections[session_code][:]:
                try:
                    await connection.send_json(message)
                except Exception:
                    self.disconnect(connection, session_code)

manager = ConnectionManager()

# --- PYDANTIC MODELS ---
class PollCreate(BaseModel):
    question: str
    type: Literal["multiple_choice", "rating", "word_cloud", "open_ended"] = "multiple_choice"
    options: List[str] = []

class QuestionCreate(BaseModel):
    text: str

class UserJoin(BaseModel):
    name: str

class QuizAnswer(BaseModel):
    user_name: str
    option_index: int

class BrandingUpdate(BaseModel):
    logo_url: Optional[str] = None
    theme_color: Optional[str] = "#3b82f6" 

class SessionResponse(BaseModel):
    code: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- HELPERS ---
def generate_code():
    return ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=6))

def get_session(code: str):
    data = db.get(f"session:{code}")
    return json.loads(data) if data else None

def save_session(code: str, data: dict):
    db.set(f"session:{code}", json.dumps(data), ex=86400) 

# --- API ENDPOINTS ---

@router.post("/create")
async def create_session(
    name: str = "Untitled Session", 
    db_session: Session = Depends(database.get_db),
    current_user: Optional[models.User] = Depends(auth.get_optional_user)
):
    code = generate_code()
    while get_session(code): 
        code = generate_code()
    
    session_data = {
        "code": code,
        "presenter_id": current_user.id if current_user else "anon",
        "created_at": datetime.now().isoformat(),
        "participants": [],
        "current_poll": None,
        "poll_history": [], # Stores past polls
        "questions": [],
        "banned_users": [],
        "quiz": None,
        "quiz_scores": {},
        "locations": [],
        "branding": {"logo_url": None, "theme_color": "#3b82f6"}
    }
    save_session(code, session_data)
    
    if current_user:
        new_db_session = models.Session(code=code, name=name, presenter_id=current_user.id)
        db_session.add(new_db_session)
        db_session.commit()
        
    return {"code": code}

@router.get("/my-sessions", response_model=List[SessionResponse])
def get_my_sessions(
    db_session: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db_session.query(models.Session).filter(
        models.Session.presenter_id == current_user.id
    ).order_by(models.Session.created_at.desc()).all()

@router.post("/{session_code}/join")
async def join_session(session_code: str, user: UserJoin):
    session = get_session(session_code)
    if not session: raise HTTPException(404, detail="Session not found")
    
    if user.name in session.get("banned_users", []):
        raise HTTPException(status_code=403, detail="You have been banned.")

    if user.name not in session["participants"]:
        session["participants"].append(user.name)
        
        # Magic Map Logic
        if "locations" not in session: session["locations"] = []
        user_has_location = any(loc["name"] == user.name for loc in session["locations"])
        
        if not user_has_location:
            cities = [
                {"name": "New York", "lat": 40.7128, "lng": -74.0060},
                {"name": "London", "lat": 51.5074, "lng": -0.1278},
                {"name": "Tokyo", "lat": 35.6762, "lng": 139.6503},
                {"name": "Sydney", "lat": -33.8688, "lng": 151.2093},
                {"name": "Mumbai", "lat": 19.0760, "lng": 72.8777},
                {"name": "Paris", "lat": 48.8566, "lng": 2.3522}
            ]
            random_city = random.choice(cities)
            jitter_lat = random_city["lat"] + random.uniform(-0.5, 0.5)
            jitter_lng = random_city["lng"] + random.uniform(-0.5, 0.5)

            new_location = {
                "name": user.name,
                "lat": jitter_lat,
                "lng": jitter_lng,
                "city": random_city["name"]
            }
            session["locations"].append(new_location)

        save_session(session_code, session)
        
        await manager.broadcast({
            "type": "PARTICIPANT_UPDATE", 
            "names": session["participants"],
            "locations": session["locations"]
        }, session_code)
        
    return {"status": "joined"}

@router.get("/{session_code}/state")
async def get_state(session_code: str):
    return get_session(session_code)

@router.post("/{session_code}/poll/start")
async def start_poll(session_code: str, poll: PollCreate):
    session = get_session(session_code)
    if not session: raise HTTPException(404)
    
    # --- ARCHIVE PREVIOUS POLL ---
    if session.get("current_poll"):
        if "poll_history" not in session: session["poll_history"] = []
        # Add timestamp to finished poll
        finished_poll = session["current_poll"]
        finished_poll["ended_at"] = datetime.now().isoformat()
        session["poll_history"].append(finished_poll)
    
    new_poll = {
        "id": str(uuid.uuid4()), 
        "type": poll.type, 
        "question": poll.question, 
        "started_at": datetime.now().isoformat(),
        "is_open": True, 
        "total_responses": 0, 
        "options": [], 
        "counts": {}, 
        "words": {},
        "responses": []
    }
    
    if poll.type == "multiple_choice": 
        new_poll["options"] = [{"label": opt, "votes": 0} for opt in poll.options]
    elif poll.type == "rating": 
        new_poll["average"] = 0.0
        new_poll["counts"] = {str(i): 0 for i in range(1, 6)}
        
    session["current_poll"] = new_poll
    save_session(session_code, session)
    
    await manager.broadcast({"type": "POLL_START", "payload": new_poll}, session_code)
    return new_poll

@router.post("/{session_code}/vote")
async def submit_vote(session_code: str, value: str):
    session = get_session(session_code)
    if not session or not session["current_poll"]: raise HTTPException(400)
    
    poll = session["current_poll"]
    clean_value = value
    if poll["type"] in ["word_cloud", "open_ended"]:
        clean_value = profanity.censor(value)

    poll["total_responses"] += 1
    
    if poll["type"] == "multiple_choice": 
        try: poll["options"][int(clean_value)]["votes"] += 1
        except: pass
    elif poll["type"] == "rating":
        try:
            if str(clean_value) in poll["counts"]: 
                poll["counts"][str(clean_value)] += 1
                poll["average"] = round(sum(int(k)*v for k,v in poll["counts"].items()) / sum(poll["counts"].values()), 1)
        except: pass
    elif poll["type"] == "word_cloud":
        w = clean_value.strip().lower()
        if len(w) > 1: 
            poll["words"][w] = poll["words"].get(w, 0) + 1
    elif poll["type"] == "open_ended":
        text = clean_value.strip()
        if len(text) > 0:
            poll["responses"] = ([text] + poll.get("responses", []))[:50]

    save_session(session_code, session)
    await manager.broadcast({"type": "POLL_UPDATE", "payload": poll}, session_code)
    return {"status": "voted"}

@router.post("/{session_code}/question")
async def ask_question(session_code: str, q: QuestionCreate):
    session = get_session(session_code)
    new_q = {
        "id": str(uuid.uuid4()), 
        "text": q.text, 
        "votes": 0, 
        "visible": True,
        "created_at": datetime.now().isoformat()
    }
    session["questions"].append(new_q)
    save_session(session_code, session)
    await manager.broadcast({"type": "QNA_UPDATE", "payload": session["questions"]}, session_code)
    return new_q

@router.post("/{session_code}/question/{q_id}/upvote")
async def upvote_question(session_code: str, q_id: str):
    session = get_session(session_code)
    for q in session["questions"]:
        if q["id"] == q_id:
            q["votes"] += 1
    save_session(session_code, session)
    await manager.broadcast({"type": "QNA_UPDATE", "payload": session["questions"]}, session_code)
    return {"status": "upvoted"}

@router.post("/{session_code}/question/{q_id}/toggle")
async def toggle_question_visibility(session_code: str, q_id: str):
    session = get_session(session_code)
    if not session: raise HTTPException(404)
    found = False
    for q in session["questions"]:
        if q["id"] == q_id:
            q["visible"] = not q.get("visible", True)
            found = True
            break
    if found:
        save_session(session_code, session)
        await manager.broadcast({"type": "QNA_UPDATE", "payload": session["questions"]}, session_code)
        return {"status": "toggled"}
    raise HTTPException(404, detail="Question not found")

@router.post("/{session_code}/quiz/start")
async def create_quiz(session_code: str, quiz_data: dict):
    session = get_session(session_code)
    if not session: raise HTTPException(404)

    session["quiz"] = {
        "title": quiz_data["title"],
        "questions": quiz_data["questions"], 
        "current_index": 0,
        "state": "LOBBY", 
        "start_time_epoch": 0
    }
    session["quiz_scores"] = {p: 0 for p in session["participants"]} 
    
    save_session(session_code, session)
    await manager.broadcast({
        "type": "QUIZ_UPDATE", 
        "payload": {"quiz": session["quiz"], "scores": session["quiz_scores"]}
    }, session_code)
    return {"status": "quiz_created"}

@router.post("/{session_code}/quiz/next")
async def next_quiz_step(session_code: str):
    session = get_session(session_code)
    if not session or not session.get("quiz"): raise HTTPException(400, detail="No active quiz")
    
    quiz = session["quiz"]
    
    if quiz["state"] == "LOBBY":
        quiz["state"] = "QUESTION"
        quiz["current_index"] = 0
    elif quiz["state"] == "QUESTION":
        quiz["state"] = "LEADERBOARD"
    elif quiz["state"] == "LEADERBOARD":
        if quiz["current_index"] + 1 < len(quiz["questions"]):
            quiz["current_index"] += 1
            quiz["state"] = "QUESTION"
        else:
            quiz["state"] = "END"
            
    save_session(session_code, session)
    await manager.broadcast({
        "type": "QUIZ_UPDATE", 
        "payload": {"quiz": session["quiz"], "scores": session["quiz_scores"]}
    }, session_code)
    return {"status": "updated", "state": quiz["state"]}

@router.post("/{session_code}/quiz/answer")
async def submit_quiz_answer(session_code: str, answer: QuizAnswer):
    session = get_session(session_code)
    if not session or not session.get("quiz"): raise HTTPException(400)
    
    quiz = session["quiz"]
    if quiz["state"] != "QUESTION": return {"status": "ignored"}
    
    current_q = quiz["questions"][quiz["current_index"]]
    
    user_key = answer.user_name.strip()
    if "quiz_scores" not in session: session["quiz_scores"] = {}
    if user_key not in session["quiz_scores"]:
        session["quiz_scores"][user_key] = 0

    try:
        user_ans = int(answer.option_index)
        correct_ans = int(current_q["correct_index"])
        
        if user_ans == correct_ans:
            session["quiz_scores"][user_key] += 100
            save_session(session_code, session)
            
    except ValueError as e:
        print(f"ERROR: Scoring math failed: {e}")

    return {"status": "received"}

@router.post("/{session_code}/ban")
async def ban_user(session_code: str, user: UserJoin):
    session = get_session(session_code)
    if not session: raise HTTPException(404)
    name = user.name
    if "banned_users" not in session: session["banned_users"] = []
    if name not in session["banned_users"]:
        session["banned_users"].append(name)
    if name in session["participants"]:
        session["participants"].remove(name)
    save_session(session_code, session)
    await manager.broadcast({"type": "PARTICIPANT_UPDATE", "names": session["participants"]}, session_code)
    await manager.broadcast({"type": "USER_KICKED", "target_name": name}, session_code)
    return {"status": "banned"}

@router.post("/{session_code}/react")
async def send_reaction(session_code: str, data: dict):
    await manager.broadcast({"type": "REACTION", "emoji": data["emoji"]}, session_code)
    return {"status": "sent"}

@router.post("/{session_code}/branding")
async def update_branding(session_code: str, branding: BrandingUpdate):
    session = get_session(session_code)
    if not session: raise HTTPException(404)
    session["branding"] = branding.dict()
    save_session(session_code, session)
    await manager.broadcast({"type": "BRANDING_UPDATE", "payload": session["branding"]}, session_code)
    return {"status": "updated"}

# --- PROFESSIONAL EXPORT (CSV) ---

@router.get("/{session_code}/export")
async def export_session_data(session_code: str):
    session = get_session(session_code)
    if not session: raise HTTPException(404, detail="Session not found")

    output = io.StringIO()
    writer = csv.writer(output)

    # 1. Metadata Section
    writer.writerow(["[SESSION METADATA]"])
    writer.writerow(["Session Code", session_code])
    writer.writerow(["Created At", session.get("created_at", "N/A")])
    writer.writerow(["Presenter ID", session.get("presenter_id", "N/A")])
    writer.writerow(["Total Participants", len(session.get("participants", []))])
    writer.writerow([])

    # 2. Participants Section
    writer.writerow(["[PARTICIPANT LIST]"])
    writer.writerow(["Name", "Status"])
    for p in session.get("participants", []):
        writer.writerow([p, "Active"])
    for b in session.get("banned_users", []):
        writer.writerow([b, "Banned"])
    writer.writerow([])

    # 3. Quiz Leaderboard
    writer.writerow(["[QUIZ RESULTS]"])
    quiz = session.get("quiz")
    if quiz:
        writer.writerow(["Quiz Title", quiz.get("title", "Untitled")])
        writer.writerow(["Rank", "Participant", "Score"])
        scores = session.get("quiz_scores", {})
        sorted_scores = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        for rank, (name, score) in enumerate(sorted_scores, 1):
            writer.writerow([rank, name, score])
    else:
        writer.writerow(["No quiz conducted."])
    writer.writerow([])

    # 4. Q&A Log
    writer.writerow(["[Q&A LOG]"])
    writer.writerow(["Question Text", "Votes", "Status"])
    for q in session.get("questions", []):
        status = "Visible" if q.get("visible", True) else "Hidden"
        writer.writerow([q["text"], q["votes"], status])
    writer.writerow([])

    # 5. Poll History (Aggregate)
    writer.writerow(["[POLL HISTORY]"])
    
    # Combine active poll and history
    all_polls = session.get("poll_history", [])[:]
    if session.get("current_poll"):
        active_poll = session["current_poll"]
        active_poll["status"] = "Active/Last"
        all_polls.append(active_poll)

    if not all_polls:
        writer.writerow(["No polls conducted."])
    
    for i, poll in enumerate(all_polls, 1):
        writer.writerow([f"--- POLL #{i} ---"])
        writer.writerow(["Question", poll["question"]])
        writer.writerow(["Type", poll["type"]])
        writer.writerow(["Total Votes", poll["total_responses"]])
        writer.writerow(["Timestamp", poll.get("started_at", "N/A")])
        
        if poll["type"] == "multiple_choice":
            writer.writerow(["Option", "Votes", "Percentage"])
            total = poll["total_responses"]
            for opt in poll["options"]:
                percent = f"{(opt['votes']/total*100):.1f}%" if total > 0 else "0%"
                writer.writerow([opt["label"], opt["votes"], percent])
                
        elif poll["type"] == "rating":
            writer.writerow(["Average Rating", poll.get("average", 0)])
            writer.writerow(["Star", "Count"])
            for star, count in poll.get("counts", {}).items():
                writer.writerow([f"{star} Stars", count])
                
        elif poll["type"] == "word_cloud":
            writer.writerow(["Word", "Frequency"])
            for word, count in poll.get("words", {}).items():
                writer.writerow([word, count])
                
        elif poll["type"] == "open_ended":
            writer.writerow(["Responses"])
            for r in poll.get("responses", []):
                writer.writerow([r])
        
        writer.writerow([]) # Spacer between polls

    output.seek(0)
    response = StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv"
    )
    timestamp_str = datetime.now().strftime("%Y-%m-%d_%H-%M")
    response.headers["Content-Disposition"] = f"attachment; filename=FlexiRush_Report_{session_code}_{timestamp_str}.csv"
    return response

# --- WEBSOCKET ENDPOINT ---
@ws_router.websocket("/ws/{session_code}/presenter")
async def websocket_endpoint(websocket: WebSocket, session_code: str):
    await websocket.accept()
    await manager.connect(websocket, session_code)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_code)
    except Exception as e:
        print(f"WS Error: {e}")
        manager.disconnect(websocket, session_code)