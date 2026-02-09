"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useSessionStore } from "@/store/sessionStore"; 
import { useRealtime } from "@/hooks/useRealtime";

// --- CONFIGURATION ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null);
  const [guestName, setGuestName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'activity' | 'qna'>('activity');

  // Voting State
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [pollAnswer, setPollAnswer] = useState("");
  
  // Q&A State
  const [questionText, setQuestionText] = useState("");
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
    questions, // Q&A List from Store
    quiz,
    quizScores,
    branding,
    setUser,
    setToken
  } = useSessionStore();

  // --- PERSISTENCE: CHECK LOCALSTORAGE ---
  useEffect(() => {
      let activityKey = null;

      if (currentPoll) {
          activityKey = `poll_${code}_${currentPoll.question}`;
      } else if (quiz) {
          // Quiz key includes Title to allow resetting quiz with same questions
          activityKey = `quiz_${code}_${quiz.title}_${quiz.current_index}`;
      }

      if (activityKey) {
          const alreadyVoted = localStorage.getItem(activityKey);
          if (alreadyVoted) {
              setHasVoted(true);
              const savedOption = localStorage.getItem(activityKey + "_opt");
              if (savedOption) setSelectedOption(Number(savedOption));
          } else {
              setHasVoted(false);
              setSelectedOption(null);
              setPollAnswer("");
          }
      } else {
          setHasVoted(false);
      }
  }, [currentPoll, quiz, code]); 

  // --- HELPER: MARK AS VOTED ---
  const markAsVoted = (optionIndex?: number) => {
      let activityKey = null;

      if (currentPoll) {
          activityKey = `poll_${code}_${currentPoll.question}`;
      } else if (quiz) {
          activityKey = `quiz_${code}_${quiz.title}_${quiz.current_index}`;
      }
      
      if (activityKey) {
          localStorage.setItem(activityKey, "true");
          if (optionIndex !== undefined) {
              localStorage.setItem(activityKey + "_opt", String(optionIndex));
          }
      }
      setHasVoted(true);
  };

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
      if (res.ok) return true;
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
    return false;
  }, [code]);

  // --- HANDLERS ---
  
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
              setUser({ id: data.id, email: data.name }); 
              setToken("guest-token");
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

  const handlePollVote = async (value: string | number) => {
      if (hasVoted) return;
      const success = await apiCall("/vote", { value });
      if (success) markAsVoted();
  };

  const handleQuizAnswer = async (index: number) => {
      if (hasVoted || !user) return;
      setSelectedOption(index);
      const success = await apiCall("/quiz/answer", { 
          user_name: user.email || "Anonymous", 
          option_index: index 
      });
      if (success) markAsVoted(index);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!questionText.trim()) return;
      
      const success = await apiCall("/question", { text: questionText });
      if (success) {
          setQuestionText("");
      }
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

  if (!resolvedParams) return <div className="min-h-dvh bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  // --- VIEW: GUEST JOIN FORM ---
  if (!user) {
      return (
          <div className="min-h-dvh bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl animate-in zoom-in duration-300">
                  <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-blue-900/50">FR</div>
                      <h1 className="text-3xl font-bold mb-2">Join Session</h1>
                      <p className="text-slate-400 text-sm">Enter your name to join the activity.</p>
                  </div>
                  <form onSubmit={handleJoinSession} className="space-y-6">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Your Name</label>
                          <input 
                              type="text" 
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="e.g. John Doe"
                              className="w-full bg-slate-950 border border-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-600 font-medium text-lg"
                              autoFocus
                          />
                      </div>
                      <button 
                          type="submit" 
                          disabled={!guestName.trim() || isJoining}
                          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition shadow-lg flex justify-center items-center gap-2 transform active:scale-[0.98] text-lg"
                      >
                          {isJoining ? <span className="animate-spin text-xl">◌</span> : "Join Now 🚀"}
                      </button>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-dvh bg-slate-950 text-white font-sans flex flex-col pb-28"> {/* pb-28: Extra padding for bottom fixed nav */}
      
      {/* HEADER - Sticky & Glassmorphic */}
      <header className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
             {branding?.logo_url ? <Image src={branding.logo_url} alt="Logo" width={32} height={32} className="rounded" /> : <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-xs">FR</div>}
             <span className="font-bold hidden sm:block">FlexiRush</span>
          </div>
          <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500"}`}></div>
              <span className="font-mono bg-slate-800 px-3 py-1 rounded-lg text-xs border border-slate-700 font-bold tracking-widest">{code}</span>
          </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full relative">
            
            {/* === TAB 1: LIVE ACTIVITY === */}
            {activeTab === 'activity' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* SCENARIO 1: QUIZ */}
                    {quiz && quiz.state !== "END" && (
                        <div className="w-full">
                            <div className="text-center mb-8">
                                <span className="bg-purple-900/30 text-purple-300 text-xs font-bold px-4 py-1.5 rounded-full border border-purple-500/30 uppercase tracking-widest">
                                    {quiz.state === "LOBBY" ? "Quiz Lobby" : `Question ${quiz.current_index + 1}`}
                                </span>
                            </div>

                            {quiz.state === "LOBBY" && (
                                <div className="text-center py-10">
                                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-purple-400 to-pink-600 mb-6">Get Ready!</h1>
                                    <p className="text-slate-400 text-lg">The quiz will start soon.</p>
                                    <div className="mt-12 text-7xl animate-bounce">🚀</div>
                                </div>
                            )}

                            {quiz.state === "QUESTION" && (
                                safeQuizQuestion ? (
                                    <div className="space-y-8">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-center leading-snug">{safeQuizQuestion.text}</h2>
                                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden w-full shadow-inner">
                                            <div 
                                                key={quiz.current_index} 
                                                className="h-full bg-linear-to-r from-purple-500 to-pink-500 origin-left" 
                                                /* webhint: ignore inline-styles */ 
                                                style={{ animation: `width_linear ${safeQuizQuestion.time_limit}s linear forwards`, width: '100%' }}
                                            ></div>
                                        </div>
                                        <div className="grid gap-3">
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {safeQuizQuestion.options.map((opt: any, i: number) => (
                                                <button 
                                                    key={i} 
                                                    disabled={hasVoted || isSubmitting} 
                                                    onClick={() => handleQuizAnswer(i)} 
                                                    className={`p-5 rounded-2xl text-lg font-bold transition-all transform active:scale-[0.98] flex items-center gap-4 text-left border-2 shadow-lg
                                                        ${hasVoted 
                                                            ? (selectedOption === i 
                                                                ? "bg-purple-600 border-purple-500 text-white shadow-purple-900/50" 
                                                                : "bg-slate-800 border-slate-800 text-slate-500 opacity-50") 
                                                            : "bg-slate-800 border-slate-700 hover:border-purple-500 hover:bg-slate-750 text-slate-200"
                                                        }`}
                                                >
                                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${hasVoted && selectedOption===i ? 'bg-white/20' : 'bg-black/30'}`}>{['A','B','C','D'][i]}</span>
                                                    {typeof opt === 'string' ? opt : opt.label}
                                                </button>
                                            ))}
                                        </div>
                                        {hasVoted && <div className="text-center p-3 bg-green-900/30 text-green-400 font-bold rounded-xl border border-green-500/30 animate-pulse">Answer Sent! 🔒</div>}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-slate-500 animate-pulse"><div className="text-6xl mb-4">⏳</div><p>Loading question...</p></div>
                                )
                            )}

                            {quiz.state === "LEADERBOARD" && (
                                <div className="text-center py-10 space-y-8 animate-in zoom-in">
                                    <h2 className="text-4xl font-black text-yellow-400 drop-shadow-md">Time&apos;s Up!</h2>
                                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                                        <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">Your Current Score</p>
                                        <p className="text-6xl font-mono font-bold text-white tracking-tighter">{quizScores[user.email || "Anonymous"] || 0}</p>
                                        <p className="text-slate-500 text-xs mt-2">pts</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SCENARIO 2: POLL */}
                    {!quiz && currentPoll && (
                        <div className="w-full space-y-8 animate-in fade-in zoom-in duration-300">
                            <div className="text-center mb-4">
                                <span className="bg-blue-900/30 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-500/30 uppercase tracking-widest">Live Poll</span>
                            </div>
                            <h2 className="text-3xl font-bold text-center leading-snug">{currentPoll.question}</h2>
                            
                            {currentPoll.type === "multiple_choice" && (
                                <div className="grid gap-3">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {currentPoll.options?.map((opt: any, i: number) => (
                                        <button 
                                            key={i} 
                                            onClick={() => handlePollVote(opt.label)} 
                                            disabled={hasVoted} 
                                            className={`p-5 rounded-2xl font-bold text-left transition-all shadow-lg active:scale-[0.98] ${hasVoted ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {(currentPoll.type === "word_cloud" || currentPoll.type === "open_ended") && (
                                <div className="space-y-4">
                                    <textarea 
                                        value={pollAnswer} 
                                        onChange={(e) => setPollAnswer(e.target.value)} 
                                        placeholder="Type your answer here..." 
                                        className="w-full p-5 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder:text-slate-500 resize-none h-32 text-lg" 
                                        disabled={hasVoted}
                                    />
                                    <button 
                                        onClick={() => handlePollVote(pollAnswer)} 
                                        disabled={!pollAnswer.trim() || hasVoted} 
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition shadow-lg active:scale-[0.98]"
                                    >
                                        {hasVoted ? "Sent! ✅" : "Submit Answer"}
                                    </button>
                                </div>
                            )}

                            {currentPoll.type === "rating" && (
                                <div className="flex justify-center gap-3 py-10">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            onClick={() => handlePollVote(star)} 
                                            disabled={hasVoted} 
                                            className={`text-5xl transition-transform hover:scale-125 active:scale-90 ${hasVoted ? "opacity-30 cursor-default grayscale" : "cursor-pointer"}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SCENARIO 3: WAITING */}
                    {!quiz && !currentPoll && (
                        <div className="text-center py-20 text-slate-500 animate-pulse">
                            <div className="text-7xl mb-6 grayscale opacity-20">☕</div>
                            <h2 className="text-2xl font-bold text-slate-300 mb-2">Waiting for Presenter</h2>
                            <p className="text-sm">Sit back and relax! The session will resume shortly.</p>
                        </div>
                    )}
                </div>
            )}

            {/* === TAB 2: Q&A === */}
            {activeTab === 'qna' && (
                <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Ask a Question</h2>
                        <p className="text-slate-400 text-sm">Send your questions to the presenter.</p>
                    </div>

                    <form onSubmit={handleAskQuestion} className="mb-8">
                        <textarea 
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder="Type your question..."
                            className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32 mb-4 text-base"
                        />
                        <button 
                            type="submit" 
                            disabled={!questionText.trim() || isSubmitting}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition shadow-lg active:scale-[0.98]"
                        >
                            {isSubmitting ? "Sending..." : "Submit Question"}
                        </button>
                    </form>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Questions</h3>
                        {questions.length === 0 ? (
                            <p className="text-slate-600 italic text-center py-10">No questions yet. Be the first!</p>
                        ) : (
                            <div className="space-y-3">
                                {questions.map((q) => (
                                    <div key={q.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                        <p className="text-slate-200 text-lg">{q.text}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-slate-500">▲ {q.votes} upvotes</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

      </main>

      {/* --- BOTTOM TAB BAR --- */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 p-2 z-30 pb-safe">
          <div className="flex justify-center gap-2 max-w-md mx-auto">
              <button 
                  onClick={() => setActiveTab('activity')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition flex flex-col items-center gap-1 active:scale-95 ${activeTab === 'activity' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
              >
                  <span className="text-xl">📊</span>
                  Activity
              </button>
              <button 
                  onClick={() => setActiveTab('qna')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition flex flex-col items-center gap-1 active:scale-95 ${activeTab === 'qna' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
              >
                  <span className="text-xl">💬</span>
                  Q&A
              </button>
          </div>
      </div>

    </div>
  );
}