import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Initialize Client safely
client = None
if GOOGLE_API_KEY:
    try:
        client = genai.Client(api_key=GOOGLE_API_KEY)
        print(f"✅ AI Provider successfully initialized (Gemini 1.5 Flash)")
    except Exception as e:
        print(f"❌ AI Init Error: {e}")
else:
    print("❌ WARNING: GOOGLE_API_KEY not found in .env")

# Standard Model ID
MODEL_ID = "gemini-1.5-flash"

async def generate_quiz_from_topic(topic: str, num_questions: int = 5):
    """
    Generates a quiz using Gemini 1.5 Flash via the new google.genai SDK.
    Enforces Strict JSON output.
    """
    if not client:
        print("❌ AI Error: Client not initialized.")
        return None

    prompt = f"""
    Create a {num_questions}-question quiz about "{topic}".
    
    CRITICAL INSTRUCTION: Output ONLY a raw JSON array. No markdown, no "```json", no explanatory text.
    
    Schema per object:
    - "text": (string) The question
    - "options": (array of 4 strings) distinct answers
    - "correct_index": (int) 0-3 indicating the correct option
    
    Example:
    [
        {{"text": "Is the sky blue?", "options": ["Yes", "No", "Maybe", "Green"], "correct_index": 0}}
    ]
    """

    try:
        # 1. Call API with JSON enforcement
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json", # Forces the model to output valid JSON
                temperature=0.7 
            )
        )
        
        # 2. Parse JSON
        # The model usually returns just the JSON string, but we clean it just in case
        clean_text = response.text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text[7:-3]
            
        quiz_data = json.loads(clean_text)
        return quiz_data

    except Exception as e:
        print(f"❌ AI Generation Error: {e}")
        return None

async def summarize_session(poll_history: list, qna_log: list):
    """
    Generates a quick summary of the session vibe.
    """
    if not client:
        return "AI not configured."

    # Convert complex objects (dates) to strings for the prompt
    data_context = json.dumps({
        "polls": poll_history,
        "questions": qna_log
    }, default=str)

    prompt = f"""
    You are an event analyst. Analyze this raw session data from a presentation.
    
    Data: 
    {data_context}
    
    Task:
    Write a 2-sentence summary of the audience's engagement. 
    - Mention what topic excited them the most (based on polls/questions).
    - Mention the overall sentiment (Curious, Confused, Excited, etc.).
    """

    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"❌ AI Summary Error: {e}")
        return "Could not generate summary."