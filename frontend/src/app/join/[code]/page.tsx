"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
// Removed unused 'useRouter' import
import { useSessionStore } from "@/store/sessionStore"; 
import { useRealtime } from "@/hooks/useRealtime";

// --- CONFIGURATION ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null);
  const [guestName, setGuestName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  
  // Voting State
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [pollAnswer, setPollAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const code = resolvedParams?.code || "";
  
  // 1. Connect to Realtime
  useRealtime(code, "participant");

  const { 
    user,
    isConnected,
    currentPoll,
    quiz,
    quizScores,
    branding,
    setUser,
    setToken
  } = useSessionStore();

  // --- RESET STATE ON CHANGE ---
  useEffect(() => {
      setHasVoted(false);
      setSelectedOption(null);
      setPollAnswer("");
  }, [currentPoll?.question, quiz?.current_index, quiz?.state]);

  // --- API HELPER ---
  const apiCall = useCallback(async (endpoint: string, body?: unknown) => {
    if (!code) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(`${API_URL}/api/session/${code}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (res.ok) setHasVoted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [code]);

  // --- HANDLER: JOIN SESSION ---
  const handleJoinSession = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!guestName.trim() || isJoining) return;

      setIsJoining(true);
      try {
          const res = await fetch(`${API_URL}/api/session/${code}/join`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: guestName })
          });

          if (res.ok) {
              const data = await res.json();
              // Save Guest User to Store
              setUser({ id: data.id, email: data.name }); 
              setToken("guest-token"); // Fake token to satisfy auth checks
          } else {
              alert("Failed to join session. Code might be wrong.");
          }
      } catch (error) {
          console.error("Join error:", error);
          alert("Connection error. Please try again.");
      } finally {
          setIsJoining(false);
      }
  };

  const handlePollVote = (value: string | number) => {
      if (hasVoted) return;
      apiCall("/vote", { value });
  };

  const handleQuizAnswer = (index: number) => {
      if (hasVoted || !user) return;
      setSelectedOption(index);
      apiCall("/quiz/answer", { 
          user_name: user.email || "Anonymous", 
          option_index: index 
      });
  };

  // --- 🛡️ SAFETY SHIELD ---
  const safeQuizQuestion = useMemo(() => {
      if (!quiz || !quiz.questions || quiz.questions.length === 0) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q = quiz.questions[quiz.current_index] as any;
      if (!q) return null;
      return {
          text: q.text || q.question || "Question Loading...",
          options: q.options || q.answers || [],
          time_limit: q.time_limit || 30
      };
  }, [quiz]);

  if (!resolvedParams) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  // --- VIEW: GUEST JOIN FORM ---
  if (!user) {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
                  <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-2xl font-bold mb-4">FR</div>
                      <h1 className="text-2xl font-bold">Join Session</h1>
                      <p className="text-slate-400 text-sm mt-2">Enter your name to join the activity.</p>
                  </div>
                  
                  <form onSubmit={handleJoinSession} className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                          <input 
                              type="text" 
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="e.g. John Doe"
                              className="w-full bg-slate-950 border border-slate-700 p-4 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500 transition mt-1"
                              autoFocus
                          />
                      </div>
                      <button 
                          type="submit" 
                          disabled={!guestName.trim() || isJoining}
                          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-lg transition shadow-lg flex justify-center items-center gap-2"
                      >
                          {isJoining ? <span className="animate-spin text-xl">◌</span> : "Join Now 🚀"}
                      </button>
                  </form>
              </div>
          </div>
      );
  }

  // --- VIEW: ACTIVE SESSION ---
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
             {branding?.logo_url ? <Image src={branding.logo_url} alt="Logo" width={32} height={32} className="rounded" /> : <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">FR</div>}
             <span className="font-bold hidden sm:block">FlexiRush</span>
          </div>
          <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500"}`}></div>
              <span className="font-mono bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">{code}</span>
          </div>
      </header>

      <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full justify-center">
            {/* QUIZ VIEW */}
            {quiz && quiz.state !== "END" && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-6">
                        <span className="bg-purple-900/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30 uppercase tracking-widest">
                            {quiz.state === "LOBBY" ? "Quiz Lobby" : `Question ${quiz.current_index + 1}`}
                        </span>
                    </div>

                    {quiz.state === "LOBBY" && (
                        <div className="text-center py-10">
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-br from-purple-400 to-pink-600 mb-4">Get Ready!</h1>
                            <p className="text-slate-400">The quiz will start soon.</p>
                            <div className="mt-8 text-6xl animate-bounce">🚀</div>
                        </div>
                    )}

                    {quiz.state === "QUESTION" && (
                        safeQuizQuestion ? (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-center leading-snug">{safeQuizQuestion.text}</h2>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden w-full">
                                    <div 
                                        key={quiz.current_index} 
                                        className="h-full bg-purple-500 origin-left" 
                                        /* webhint: ignore inline-styles */ 
                                        style={{ animation: `width_linear ${safeQuizQuestion.time_limit}s linear forwards`, width: '100%' }}
                                    ></div>
                                </div>
                                <div className="grid gap-3">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {safeQuizQuestion.options.map((opt: any, i: number) => (
                                        <button key={i} disabled={hasVoted || isSubmitting} onClick={() => handleQuizAnswer(i)} className={`p-4 rounded-xl text-lg font-bold transition-all transform active:scale-95 flex items-center gap-3 text-left border-2 ${hasVoted ? (selectedOption === i ? "bg-purple-600 border-purple-500 text-white" : "bg-slate-800 border-slate-700 text-slate-500 opacity-50") : "bg-slate-800 border-slate-700 hover:border-purple-500 hover:bg-slate-750 text-slate-200"}`}>
                                            <span className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-sm">{['A','B','C','D'][i]}</span>
                                            {typeof opt === 'string' ? opt : opt.label}
                                        </button>
                                    ))}
                                </div>
                                {hasVoted && <p className="text-center text-green-400 font-bold animate-pulse">Answer Sent! 🔒</p>}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500 animate-pulse"><div className="text-4xl mb-4">⏳</div><p>Waiting for question...</p></div>
                        )
                    )}

                    {quiz.state === "LEADERBOARD" && (
                        <div className="text-center py-10 space-y-6">
                            <h2 className="text-3xl font-bold text-yellow-400">Time&apos;s Up!</h2>
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Your Score</p>
                                <p className="text-5xl font-mono font-bold text-white">{quizScores[user.email || "Anonymous"] || 0}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* POLL VIEW */}
            {!quiz && currentPoll && (
                <div className="w-full space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="text-center mb-4">
                        <span className="bg-blue-900/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30 uppercase">Live Poll</span>
                    </div>
                    <h2 className="text-2xl font-bold text-center">{currentPoll.question}</h2>
                    {currentPoll.type === "multiple_choice" && (
                        <div className="grid gap-3">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {currentPoll.options?.map((opt: any, i: number) => (
                                <button key={i} onClick={() => handlePollVote(opt.label)} disabled={hasVoted} className={`p-4 rounded-xl font-bold text-left transition-all ${hasVoted ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-95"}`}>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                    {(currentPoll.type === "word_cloud" || currentPoll.type === "open_ended") && (
                        <div className="space-y-4">
                            <input value={pollAnswer} onChange={(e) => setPollAnswer(e.target.value)} placeholder="Type your answer..." className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder:text-slate-500" disabled={hasVoted}/>
                            <button onClick={() => handlePollVote(pollAnswer)} disabled={!pollAnswer.trim() || hasVoted} className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition">{hasVoted ? "Sent!" : "Submit"}</button>
                        </div>
                    )}
                    {currentPoll.type === "rating" && (
                        <div className="flex justify-center gap-2 py-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => handlePollVote(star)} disabled={hasVoted} className={`text-4xl transition-transform hover:scale-125 ${hasVoted ? "opacity-50 cursor-default" : "cursor-pointer"}`}>★</button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* WAITING VIEW */}
            {!quiz && !currentPoll && (
                <div className="text-center py-20 text-slate-500 animate-pulse">
                    <div className="text-6xl mb-6 grayscale opacity-20">☕</div>
                    <h2 className="text-xl font-bold text-slate-300 mb-2">Waiting for Presenter</h2>
                    <p className="text-sm">Sit back and relax!</p>
                </div>
            )}
      </main>
      <footer className="p-4 text-center text-[10px] text-slate-600">Logged in as <span className="text-slate-400 font-bold">{user.email}</span></footer>
    </div>
  );
}