from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any
from ..services import ai_gemini 

router = APIRouter()

# --- Pydantic Models ---
class QuizRequest(BaseModel):
    topic: str
    num_questions: Optional[int] = 5

class SummaryRequest(BaseModel):
    poll_history: List[dict]
    qna_log: List[dict]

# --- Endpoints ---

@router.post("/generate-quiz")
async def generate_quiz_endpoint(req: QuizRequest):
    """
    Generates a quiz based on a topic using Gemini.
    """
    # Call the function directly from the module
    quiz_data = await ai_gemini.generate_quiz_from_topic(req.topic, req.num_questions)
    
    if not quiz_data:
        raise HTTPException(status_code=500, detail="Failed to generate quiz from AI.")
        
    return {"questions": quiz_data}

@router.post("/summarize")
async def summarize_session_endpoint(req: SummaryRequest):
    """
    Generates a summary of the session based on polls and Q&A.
    """
    summary_text = await ai_gemini.summarize_session(req.poll_history, req.qna_log)
    return {"summary": summary_text}