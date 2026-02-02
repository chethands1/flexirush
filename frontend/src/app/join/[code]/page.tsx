"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSessionStore } from "@/store/sessionStore";
import { useRealtime } from "@/hooks/useRealtime";
import { api } from "@/lib/api";

// Dynamic import for the reaction overlay
const ReactionOverlay = dynamic(() => import("@/components/ReactionOverlay"), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

// --- TYPES (Fixes 'any' errors) ---
interface Question {
  id: string;
  text: string;
  votes: number;
  visible?: boolean;
}

interface PollOption {
  label: string;
}

interface Poll {
  type: string;
  question: string;
  options?: PollOption[];
}

interface QuizQuestion {
  options: string[];
}

interface Quiz {
  state: string;
  current_index: number;
  questions: QuizQuestion[];
}

// === MAIN COMPONENT ===
export default function AudiencePage({ params }: { params: Promise<{ code: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null);
  
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const code = resolvedParams?.code || "";
  
  // Store State
  const { currentPoll, questions, isConnected, quiz, branding, participants } = useSessionStore();
  
  // Local State
  const [name, setName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState<"poll" | "qna">("poll");
  const [newQuestion, setNewQuestion] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); 

  // --- HOOK: REALTIME CONNECTION ---
  useRealtime(code, isJoined ? name : null);

  const handleJoin = async () => {
    if (!name.trim()) return;
    setErrorMsg("");
    
    try {
        await api.joinSession(code, name);
        setIsJoined(true);
    } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
            setErrorMsg(err.message || "Session not found or connection failed.");
        } else {
            setErrorMsg("An unexpected error occurred.");
        }
    }
  };

  const handleAsk = async () => {
      if(!newQuestion.trim()) return;
      try {
        await api.postQuestion(code, newQuestion);
        setNewQuestion("");
      } catch (e) {
        console.error("Failed to post question", e);
      }
  };

  const handleUpvote = async (qId: string) => {
      try {
        await api.upvoteQuestion(code, qId);
      } catch (e) {
        console.error("Failed to upvote", e);
      }
  };

  const sendReaction = (emoji: string) => {
      fetch(`${API_URL}/api/session/${code}/react`, {
          method: "POST", 
          headers: {"Content-Type": "application/json"}, 
          body: JSON.stringify({ emoji })
      }).catch(err => console.error("Reaction failed", err));
  };

  // --- RENDER: LOADING ---
  if (!code) return <div className="text-white text-center pt-20">Loading...</div>;

  // --- RENDER: LOGIN SCREEN ---
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-full max-w-sm bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
          {branding?.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logo_url} alt="Logo" className="w-16 h-16 mx-auto mb-4 object-contain rounded" />
          )}
          <h1 className="text-2xl font-bold text-center mb-6">Join Session: {code}</h1>
          
          <input 
            className="w-full bg-slate-800 p-4 rounded-xl text-white mb-4 border border-slate-700 focus:border-blue-500 outline-none" 
            placeholder="Your Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
          
          {errorMsg && (
            <p className="text-red-400 text-sm mb-4 text-center bg-red-900/20 p-2 rounded border border-red-900/50">
                {errorMsg}
            </p>
          )}

          <button onClick={handleJoin} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition">
            Enter Room
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: QUIZ MODE (Overrides Dashboard) ---
  if (quiz && (quiz as Quiz).state !== 'END') {
      return <QuizView quiz={quiz as Quiz} code={code} name={name} />;
  }

  // Cast questions safely to avoid 'any' errors in map/filter
  const safeQuestions = (questions as Question[]) || [];

  // --- RENDER: MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center relative overflow-hidden pb-24">
      <ReactionOverlay />
      
      {/* Header Info Bar */}
      <div className="w-full max-w-md flex justify-between text-xs text-slate-500 mb-4 font-bold uppercase tracking-widest">
         <div className="flex items-center gap-2">
             {branding?.logo_url && (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img src={branding.logo_url} alt="Logo" className="w-5 h-5 rounded" />
             )}
             <span>{name}</span>
         </div>
         <div className="flex items-center gap-2">
             <span className="bg-slate-900 px-2 py-1 rounded">👥 {participants.length}</span>
             <span className={isConnected ? "text-green-500" : "text-red-500"}>
                ● {isConnected ? "Live" : "Reconnecting"}
             </span>
         </div>
      </div>

      {/* Tab Switcher */}
      <div className="w-full max-w-md flex bg-slate-900 rounded-lg p-1 mb-6 border border-slate-800">
        <button 
            onClick={() => setActiveTab("poll")} 
            className={`flex-1 py-2 rounded font-bold transition ${activeTab==='poll' ? "bg-blue-600 text-white shadow" : "text-slate-400"}`}
        >
            Interactions
        </button>
        <button 
            onClick={() => setActiveTab("qna")} 
            className={`flex-1 py-2 rounded font-bold transition ${activeTab==='qna' ? "bg-purple-600 text-white shadow" : "text-slate-400"}`}
        >
            Q&A
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-md flex-1">
        {activeTab === 'poll' ? (
            !currentPoll ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse">
                    <h3 className="text-lg font-bold text-slate-400">Waiting for presenter...</h3>
                    <div className="text-4xl mt-2">☕</div>
                </div>
            ) : (
                <PollView poll={currentPoll as Poll} code={code} />
            )
        ) : (
            <div className="flex flex-col h-[60vh]">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 custom-scrollbar">
                    {safeQuestions.filter(q => q.visible !== false).length === 0 && (
                        <div className="text-center text-slate-500 py-10">No questions yet.</div>
                    )}
                    {safeQuestions
                        .filter(q => q.visible !== false)
                        .sort((a, b) => b.votes - a.votes)
                        .map((q) => (
                        <div key={q.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between gap-3">
                            <p className="text-sm text-slate-300">{q.text}</p>
                            <button onClick={() => handleUpvote(q.id)} className="flex flex-col items-center bg-slate-800 px-3 rounded hover:bg-slate-700 transition">
                                <span className="text-blue-400 font-bold">▲</span>
                                <span className="text-xs">{q.votes}</span>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input 
                        className="flex-1 bg-slate-900 border border-slate-700 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500" 
                        value={newQuestion} 
                        onChange={e=>setNewQuestion(e.target.value)} 
                        placeholder="Ask a question..." 
                        onKeyDown={e => e.key === 'Enter' && handleAsk()}
                    />
                    <button onClick={handleAsk} className="bg-purple-600 hover:bg-purple-500 px-4 rounded-lg font-bold transition">Send</button>
                </div>
            </div>
        )}
      </div>

      {/* Floating Reactions Footer */}
      <div className="fixed bottom-6 flex gap-3 bg-slate-900/90 p-3 rounded-full border border-slate-700 shadow-2xl backdrop-blur-md z-50">
          {["❤️", "🔥", "👏", "🎉"].map(e => (
              <button key={e} onClick={() => sendReaction(e)} className="text-2xl hover:scale-125 transition active:scale-90">{e}</button>
          ))}
      </div>
    </div>
  );
}

// === SUB-COMPONENT: QUIZ VIEW ===
function QuizView({ quiz, code, name }: { quiz: Quiz, code: string, name: string }) {
    const [answered, setAnswered] = useState(false);

    const submitAnswer = async (index: number) => {
        if(answered) return;
        setAnswered(true);
        try {
            await api.submitQuizAnswer(code, name, index);
        } catch (e) {
            console.error("Quiz submission failed", e);
        }
    };

    if (quiz.state === "LOBBY") {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-bold mb-4 animate-pulse">Get Ready!</h1>
                <p className="text-xl text-slate-400">Quiz starting soon...</p>
                <div className="mt-8 text-6xl">🚀</div>
            </div>
        );
    }
    
    if (quiz.state === "LEADERBOARD") {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-3xl font-bold mb-4 text-yellow-400">Time&apos;s Up!</h2>
                <p className="text-slate-400">Look at the main screen for results.</p>
                {answered && <div className="mt-4 px-4 py-2 bg-slate-800 rounded text-green-400">Answer Submitted</div>}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center pt-20 p-6">
            <div className="mb-8">
                <span className="bg-slate-800 px-4 py-2 rounded-full text-sm font-bold text-slate-300 border border-slate-700">
                    Question {quiz.current_index + 1} / {quiz.questions.length}
                </span>
            </div>
            {answered ? (
                <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-md animate-fade-in">
                    <h2 className="text-2xl font-bold mb-2 text-green-400">Answer Sent!</h2>
                    <p className="text-slate-400">Waiting for others...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 w-full max-w-md h-[50vh]">
                    {quiz.questions[quiz.current_index].options.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => submitAnswer(i)} 
                            className={`rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center text-4xl font-bold text-white border-b-4 border-black/20 ${
                                ['bg-red-600 hover:bg-red-500', 'bg-blue-600 hover:bg-blue-500', 'bg-yellow-600 hover:bg-yellow-500', 'bg-green-600 hover:bg-green-500'][i]
                            }`}
                        >
                            {['▲', '◆', '●', '■'][i]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// === SUB-COMPONENT: POLL VIEW ===
function PollView({ poll, code }: { poll: Poll, code: string }) {
    const [hasVoted, setHasVoted] = useState(false);
    const [textInput, setTextInput] = useState("");

    const handleVote = async (value: string | number) => {
        if (hasVoted && poll.type !== "word_cloud" && poll.type !== "open_ended") return;
        
        if (poll.type !== "word_cloud" && poll.type !== "open_ended") setHasVoted(true);
        
        try {
            await api.vote(code, value);
        } catch (e) {
            console.error("Voting failed", e);
        }
        
        if (poll.type === "word_cloud" || poll.type === "open_ended") setTextInput("");
    };

    return (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 animate-slide-up shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-white text-center">{poll.question}</h2>
            
            {poll.type === "multiple_choice" && (
                <div className="space-y-3">
                    {poll.options?.map((opt, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => handleVote(idx)} 
                            disabled={hasVoted} 
                            className={`w-full p-4 text-left rounded-xl font-bold transition-all flex justify-between items-center ${
                                hasVoted ? "bg-slate-800 text-slate-500 border border-slate-700" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-95"
                            }`}
                        >
                            <span>{opt.label}</span>
                            {hasVoted && <span>✔️</span>}
                        </button>
                    ))}
                </div>
            )}

            {poll.type === "rating" && (
                <div className="flex justify-center gap-2 py-4">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button 
                            key={star} 
                            onClick={() => handleVote(star)} 
                            className="text-4xl sm:text-5xl hover:scale-110 active:scale-90 transition grayscale hover:grayscale-0"
                        >
                            ⭐
                        </button>
                    ))}
                </div>
            )}

            {(poll.type === "word_cloud" || poll.type === "open_ended") && (
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input 
                            className="flex-1 bg-slate-800 p-3 rounded-lg text-white border border-slate-700 focus:border-blue-500 outline-none" 
                            placeholder={poll.type === "word_cloud" ? "Type one word..." : "Share a thought..."} 
                            value={textInput} 
                            onChange={(e) => setTextInput(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && textInput.trim() && handleVote(textInput)} 
                        />
                        <button 
                            onClick={() => textInput.trim() && handleVote(textInput)} 
                            className="bg-blue-600 hover:bg-blue-500 px-5 rounded-lg font-bold transition active:scale-95 text-white"
                        >
                            Send
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-500 italic text-center">
                        {poll.type === "word_cloud" ? "Results appear in the cloud." : "Your thought will float up!"}
                    </p>
                </div>
            )}
        </div>
    );
}