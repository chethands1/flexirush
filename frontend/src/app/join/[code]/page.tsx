"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSessionStore } from "@/store/sessionStore";

// Dynamic import for the reaction overlay (emojis floating up)
const ReactionOverlay = dynamic(() => import("@/components/ReactionOverlay"), { ssr: false });

// === CUSTOM HOOK FOR AUDIENCE SOCKET ===
// Manages the WebSocket connection, heartbeat, and state synchronization
function useAudienceSocket(sessionCode: string, myName: string | null, onKick: () => void) {
  const ws = useRef<WebSocket | null>(null);
  
  const { 
    setConnected, 
    setPoll, 
    setQuestions, 
    setParticipants, 
    setQuiz, 
    setQuizScores, 
    setLastReaction, 
    setBranding 
  } = useSessionStore();

  useEffect(() => {
    if (!sessionCode || !myName) return;

    const connect = () => {
      const wsUrl = `ws://localhost:8001/ws/${sessionCode}/${encodeURIComponent(myName)}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setConnected(true);
        // Initial Sync: Fetch state via REST to get immediate data
        fetch(`http://localhost:8001/api/session/${sessionCode}/state`)
          .then(res => res.json())
          .then(data => {
             if(data.current_poll) setPoll(data.current_poll);
             if(data.questions) setQuestions(data.questions);
             if(data.quiz) setQuiz(data.quiz);
             if(data.branding) setBranding(data.branding);
             if(data.participants) setParticipants(data.participants);
          })
          .catch(e => console.error("Sync error:", e));
      };

      ws.current.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            
            // Handle all event types
            switch (data.type) {
                case 'POLL_START':
                case 'POLL_UPDATE':
                    setPoll(data.payload);
                    break;
                case 'QNA_UPDATE':
                    setQuestions(data.payload);
                    break;
                case 'PARTICIPANT_UPDATE':
                    setParticipants(data.participants);
                    break;
                case 'REACTION':
                    setLastReaction(data.emoji);
                    break;
                case 'BRANDING_UPDATE':
                    setBranding(data.payload);
                    break;
                case 'QUIZ_UPDATE':
                    setQuiz(data.quiz);
                    setQuizScores(data.scores);
                    break;
                case 'USER_KICKED':
                    if (data.target_name === myName) onKick();
                    break;
            }
        } catch (e) { 
            console.error("WebSocket Message Error:", e); 
        }
      };

      ws.current.onclose = () => {
          setConnected(false);
          // Simple reconnect logic could go here
      };
    };

    connect();

    return () => {
        ws.current?.close();
    };
  }, [sessionCode, myName, onKick, setConnected, setPoll, setQuestions, setParticipants, setQuiz, setQuizScores, setLastReaction, setBranding]);
}

// === MAIN COMPONENT ===
export default function AudiencePage({ params }: { params: Promise<{ code: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null);
  
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const code = resolvedParams?.code || "";
  
  const { currentPoll, questions, isConnected, quiz, branding, participants } = useSessionStore();
  
  const [name, setName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState<"poll" | "qna">("poll");
  const [newQuestion, setNewQuestion] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); 

  const handleKick = useCallback(() => {
      alert("You have been removed from the session.");
      window.location.href = "/"; 
  }, []);

  useAudienceSocket(code, isJoined ? name : null, handleKick);

  const handleJoin = async () => {
    if (!name.trim()) return;
    setErrorMsg("");
    
    try {
        const res = await fetch(`http://localhost:8001/api/session/${code}/join`, {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name })
        });
        
        if (res.ok) {
            setIsJoined(true);
        } else {
            setErrorMsg("Session not found or closed.");
        }
    } catch (e) {
        setErrorMsg("Connection failed. Is backend running?");
        console.error(e);
    }
  };

  const handleAsk = async () => {
      if(!newQuestion.trim()) return;
      await fetch(`http://localhost:8001/api/session/${code}/question`, {
          method: "POST", 
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ text: newQuestion })
      });
      setNewQuestion("");
  };

  const handleUpvote = async (qId: string) => {
      await fetch(`http://localhost:8001/api/session/${code}/question/${qId}/upvote`, { method: "POST" });
  };

  const sendReaction = (emoji: string) => {
      fetch(`http://localhost:8001/api/session/${code}/react`, {
          method: "POST", 
          headers: {"Content-Type": "application/json"}, 
          body: JSON.stringify({ emoji })
      });
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
  if (quiz && quiz.state !== 'END') {
      return <QuizView quiz={quiz} code={code} name={name} />;
  }

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
                <PollView poll={currentPoll} code={code} />
            )
        ) : (
            <div className="flex flex-col h-[60vh]">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 custom-scrollbar">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {questions.filter((q:any) => q.visible !== false).length === 0 && (
                        <div className="text-center text-slate-500 py-10">No questions yet.</div>
                    )}
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {questions.filter((q:any) => q.visible !== false).sort((a:any,b:any) => b.votes - a.votes).map((q: any) => (
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
// Handles the entire Quiz lifecycle for the audience
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QuizView({ quiz, code, name }: { quiz: any, code: string, name: string }) {
    const [answered, setAnswered] = useState(false);

    const submitAnswer = async (index: number) => {
        if(answered) return;
        setAnswered(true);
        await fetch(`http://localhost:8001/api/session/${code}/quiz/answer`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_name: name, option_index: index })
        });
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
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {quiz.questions[quiz.current_index].options.map((_: any, i: number) => (
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
// Renders specific UI based on poll type (MCQ, Rating, etc)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PollView({ poll, code }: { poll: any, code: string }) {
    const [hasVoted, setHasVoted] = useState(false);
    const [textInput, setTextInput] = useState("");

    const handleVote = async (value: string | number) => {
        // Prevent double voting for static poll types
        if (hasVoted && poll.type !== "word_cloud" && poll.type !== "open_ended") return;
        
        // Optimistic UI update
        if (poll.type !== "word_cloud" && poll.type !== "open_ended") setHasVoted(true);
        
        await fetch(`http://localhost:8001/api/session/${code}/vote?value=${encodeURIComponent(value)}`, { method: 'POST' });
        
        if (poll.type === "word_cloud" || poll.type === "open_ended") setTextInput("");
    };

    return (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 animate-slide-up shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-white text-center">{poll.question}</h2>
            
            {poll.type === "multiple_choice" && (
                <div className="space-y-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {poll.options?.map((opt: any, idx: number) => (
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