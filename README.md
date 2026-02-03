🚀 FlexiRush
The World-Class Real-Time Interactive Presentation Platform

FlexiRush is a high-performance audience engagement tool that allows presenters to create live polls, quizzes, and AI-generated interactive sessions. It features instant state synchronization, allowing thousands of participants to interact simultaneously with zero lag.

🏗️ Architecture & "The Sync Engine"
FlexiRush uses an Event-Driven Architecture to ensure that what happens on a participant's phone appears instantly on the presenter's screen.

The "Life of a Vote" Cycle
Trigger (JoinPage): User votes → Sends strict JSON payload via HTTP POST to Backend.

Processing (main.py): FastAPI validates data using Pydantic models, updates Redis, and broadcasts a WebSocket event.

Reception (useRealtime.ts): The custom hook catches the event (POLL_RESULTS_UPDATE) and dispatches it to the Store.

State Update (sessionStore.ts): Zustand updates the pollResults state in memory.

Render (PresenterPage): React instantly re-renders the bar chart or leaderboard with the new data.

📂 Project Structure & Key Files
Frontend (Next.js 15 + Tailwind + Zustand)
src/store/sessionStore.ts: The Single Source of Truth. Holds all live data (participants, votes, quiz state). If data isn't here, it doesn't exist in the UI.

src/hooks/useRealtime.ts: The Nervous System. Manages the WebSocket connection. It listens for server "shouts" (events) and updates the Store.

src/app/presenter/[code]/page.tsx: The Dashboard. Visualizes the Store data (Bar charts, Word Clouds). Logic-less; it only renders what the Store tells it to.

src/app/join/[code]/page.tsx: The Remote. Handles user input. Features "Vote Persistence" (remembers votes after refresh) and "Guest Login".

src/components/AIQuizCreator.tsx: The Brain. Interfaces with Google Gemini 1.5 Flash to generate quizzes on the fly.

Backend (FastAPI + Redis + Google Gemini)
main.py: The Command Center.

HTTP Endpoints: Handle strict data ingestion (/vote, /quiz/start).

WebSocket Manager: Handles real-time broadcasting to connected clients.

AI Integration: Connects to Gemini for smart content generation with retry logic.

Redis: Acts as the high-speed database for session state.

✨ Features
⚡ Instant Sync: WebSocket-based updates for polls, quizzes, and Q&A.

🧠 AI-Powered: Generate full 5-question quizzes on any topic in seconds.

🛡️ Bulletproof Backend: Strict Pydantic validation preventing data corruption (422 errors).

📊 Rich Visualizations:

Live Bar Charts (Multiple Choice)

Dynamic Word Clouds

"Magic Map" Particle Visualization

Floating "Transient Thoughts" Bubbles

💾 Smart Persistence: Participants never lose their session state, even on refresh.

🚀 Getting Started
Prerequisites
Node.js 18+

Python 3.10+

Redis (Local or Cloud)

Google Gemini API Key

1. Backend Setup
Bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Create .env file
echo "GOOGLE_API_KEY=your_key_here" > .env
echo "REDIS_URL=redis://localhost:6379" >> .env

# Run Server
uvicorn app.main:app --reload --port 8001
2. Frontend Setup
Bash
cd frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8001" > .env.local

# Run Client
npm run dev
🛠️ Troubleshooting
Bars not moving? Check useRealtime.ts. Ensure setPollResults is being called in the POLL_RESULTS_UPDATE case.

"Unprocessable Content" (422)? Ensure your Frontend apiCall payload matches the Backend VoteRequest Pydantic model exactly.

AI Quiz failing? The Backend has a 3-try retry loop. Check your API Quota if it persists.

Built with ❤️ using the T3 Stack Philosophy (Typesafe, Tailored, Together).