"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore, Question } from "@/store/sessionStore"; 
import { useRealtime } from "@/hooks/useRealtime";

// --- DYNAMIC IMPORTS ---
const ReactionOverlay = dynamic(() => import("@/components/ReactionOverlay"), { ssr: false });
const CreatePollForm = dynamic(() => import("@/components/CreatePollForm"), { ssr: false });
const WinningWheel = dynamic(() => import("@/components/WinningWheel"), { ssr: false });
const QuizCreator = dynamic(() => import("@/components/QuizCreator"), { ssr: false });
const AIQuizCreator = dynamic(() => import("@/components/AIQuizCreator"), { ssr: false });
const MagicMap = dynamic(() => import("@/components/MagicMap"), { ssr: false });
const TransientThoughts = dynamic(() => import("@/components/TransientThoughts"), { ssr: false });

// --- CONFIGURATION ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

interface PollOption {
  label: string;
  votes: number;
}

export default function PresenterDashboard({ params }: { params: Promise<{ code: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null);
  const searchParams = useSearchParams();
  const isSidebar = searchParams.get("sidebar") === "true";

  // Debug State
  const [showDebug, setShowDebug] = useState(false);
  const lastActionTime = useRef<number>(0);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const code = resolvedParams?.code || "";
  const router = useRouter();

  // 1. Connect to Realtime
  useRealtime(code, "presenter");

  const { 
    token,
    isConnected, 
    participants, 
    currentPoll, 
    pollResults,
    questions, 
    quiz, 
    quizScores, 
    branding,
    setQuiz,        
    setPoll,
    setQuestions
  } = useSessionStore();

  const [showPollForm, setShowPollForm] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [viewMode, setViewMode] = useState<"poll" | "qna">("poll");
  const [tempLogo, setTempLogo] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // --- AUTH CHECK ---
  useEffect(() => {
    if (!token && resolvedParams) router.push("/login");
  }, [token, router, resolvedParams]);

  useEffect(() => {
    if (branding?.logo_url) setTempLogo(branding.logo_url);
  }, [branding]);

  // --- API HELPER ---
  const apiCall = useCallback(async (endpoint: string, method: "GET" | "POST" = "GET", body?: unknown) => {
    if (!code) return;
    try {
      const res = await fetch(`${API_URL}/api/session/${code}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error(`API Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`❌ API Failed (${endpoint}):`, err);
      return null;
    }
  }, [code]);

  // --- SYNC ENGINE (Heartbeat) ---
  const syncState = useCallback(async () => {
      // Throttle: Don't sync if we just clicked a button (prevents UI jumping)
      if (Date.now() - lastActionTime.current < 2000) return;

      const data = await apiCall("/state");
      if (data) {
        if (data.quiz) setQuiz(data.quiz);
        if (data.current_poll) setPoll(data.current_poll);
        if (data.questions) setQuestions(data.questions);
      }
  }, [apiCall, setQuiz, setPoll, setQuestions]);

  // Initial Sync
  useEffect(() => { if(code) syncState(); }, [code, syncState]);

  // Heartbeat (Every 3 seconds)
  useEffect(() => {
      if (!code) return;
      const interval = setInterval(syncState, 3000); 
      return () => clearInterval(interval);
  }, [code, syncState]);


  // --- OPTIMISTIC ACTIONS ---
  
  const handleOptimisticUpdate = (updateFn: () => void) => {
      lastActionTime.current = Date.now(); // Block external sync temporarily
      updateFn(); // Update UI immediately
  };

  // Wrapper to handle loading states systematically
  const handleAction = async (actionFn: () => Promise<void>) => {
    if (actionLoading) return;
    setActionLoading(true); // Using state setter here
    try {
        await actionFn();
        await syncState(); 
    } catch (e) {
        console.error(e);
        alert("Action failed. Check console.");
    } finally {
        setTimeout(() => setActionLoading(false), 500);
    }
  };

  const endPoll = () => handleAction(async () => {
      handleOptimisticUpdate(() => setPoll(null));
      await apiCall("/poll/end", "POST");
  });
  
  const handleNextQuizStep = () => handleAction(async () => {
      if (!quiz) return;
      
      // Optimistic: Advance UI immediately
      handleOptimisticUpdate(() => {
          let nextState = quiz.state;
          let nextIndex = quiz.current_index;

          if (quiz.state === "LOBBY") {
              nextState = "QUESTION";
              nextIndex = 0;
          } else if (quiz.state === "QUESTION") {
              nextState = "LEADERBOARD";
          } else if (quiz.state === "LEADERBOARD") {
              nextState = "QUESTION";
              nextIndex = quiz.current_index + 1;
              if (quiz.questions && nextIndex >= quiz.questions.length) {
                  nextState = "END";
              }
          }
          setQuiz({ ...quiz, state: nextState, current_index: nextIndex });
      });

      // Server Sync
      await apiCall("/quiz/next", "POST");
  });

  const handleCloseQuiz = () => handleAction(async () => {
      handleOptimisticUpdate(() => setQuiz(null)); 
      await apiCall("/quiz/reset", "POST");
  });
  
  const handleToggleQuestion = (qId: string) => apiCall(`/question/${qId}/toggle`, "POST");
  const handleExport = () => window.location.href = `${API_URL}/api/session/${code}/export`;
  
  const handleBanUser = async (userName: string) => {
    if (!confirm(`Are you sure you want to ban ${userName}?`)) return;
    await apiCall("/ban", "POST", { name: userName });
    lastActionTime.current = 0; 
    syncState(); 
  };

  const saveSettings = async () => {
    await apiCall("/branding", "POST", { 
        logo_url: tempLogo, 
        theme_color: branding?.theme_color 
    });
    setShowSettings(false);
  };

  const handleQuizCreated = () => {
      lastActionTime.current = 0; 
      syncState();
  };

  // --- AI ANALYSIS ---
  const handleAiAnalyze = async () => {
    if (analyzing) return;
    setAnalyzing(true);
    setAiSummary("");
    
    let contextData: string[] = [];
    if (quiz) contextData = [`Active Quiz: ${quiz.title}`];
    else if (currentPoll) contextData = [`Poll Question: ${currentPoll.question}`];

    try {
        const res = await fetch(`${API_URL}/api/ai/summarize`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ responses: contextData })
        });
        
        if(res.ok) {
            const data = await res.json();
            setAiSummary(data.summary || "AI couldn't generate a summary.");
        } else {
            setAiSummary("AI Service Unavailable.");
        }
    } catch {
        setAiSummary("Network Error: Could not reach AI service.");
    } finally {
        setAnalyzing(false);
    }
  };

  const totalPollVotes = useMemo(() => {
    if (!currentPoll?.options) return 0;
    return (currentPoll.options as PollOption[]).reduce((acc, curr) => {
        const liveVotes = pollResults?.[curr.label];
        return acc + (liveVotes !== undefined ? liveVotes : (curr.votes || 0));
    }, 0);
  }, [currentPoll, pollResults]);

  if (!resolvedParams || !token) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p>Connecting to Studio...</p>
            </div>
        </div>
      );
  }

  // --- SAFE DATA ACCESS & NORMALIZATION ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawQ: any = (quiz && quiz.questions && quiz.questions[quiz.current_index]) ? quiz.questions[quiz.current_index] : null;
  
  // NORMALIZE: Ensure we always have text and options regardless of what backend sent
  const currentQ = rawQ ? {
      text: rawQ.text || rawQ.question || "Unknown Question",
      options: rawQ.options || rawQ.answers || [],
      time_limit: rawQ.time_limit || 30
  } : null;

  return (
    <div className={`min-h-screen bg-slate-950 text-white transition-all relative overflow-hidden flex flex-col font-sans ${isSidebar ? 'p-2' : 'p-4 sm:p-8'}`}>
      
      {!isSidebar && <ReactionOverlay />}

      {/* --- DEBUGGER TOGGLE --- */}
      <div className="fixed bottom-4 left-4 z-50">
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className="bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white text-xs px-3 py-1 rounded shadow-lg border border-red-500/50 transition backdrop-blur-md"
          >
            {showDebug ? "Hide Debug" : "🐞 Debug Data"}
          </button>
      </div>

      {/* --- DEBUG OVERLAY (THE INSPECTOR) --- */}
      {showDebug && (
          <div className="fixed inset-0 bg-black/90 z-50 p-8 overflow-auto font-mono text-xs text-green-400 animate-in fade-in">
              <div className="max-w-4xl mx-auto">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                      <h2 className="text-xl text-white font-bold">🔍 Live Data Inspector</h2>
                      <button onClick={() => setShowDebug(false)} className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-500">CLOSE</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                          <h3 className="text-yellow-400 font-bold mb-4 text-sm uppercase tracking-wider">Current Quiz State</h3>
                          <pre className="whitespace-pre-wrap wrap-break-word">{JSON.stringify(quiz, null, 2)}</pre>
                      </div>
                      <div className="space-y-6">
                          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                              <h3 className="text-blue-400 font-bold mb-4 text-sm uppercase tracking-wider">Raw Question Data</h3>
                              <pre className="whitespace-pre-wrap wrap-break-word">{JSON.stringify(rawQ, null, 2)}</pre>
                          </div>
                          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                              <h3 className="text-purple-400 font-bold mb-4 text-sm uppercase tracking-wider">Normalized for UI</h3>
                              <pre className="whitespace-pre-wrap wrap-break-word">{JSON.stringify(currentQ, null, 2)}</pre>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- HEADER --- */}
      {!isSidebar && (
        <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6 relative z-10">
            <div className="flex items-center gap-3">
            {branding?.logo_url ? (
                <div className="relative w-10 h-10">
                    <Image src={branding.logo_url} alt="Logo" fill className="object-contain rounded-lg shadow-lg" />
                </div>
            ) : (
                <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-lg text-white"
                /* webhint: ignore inline-styles */
                style={{ backgroundColor: branding?.theme_color || '#3b82f6' }}
                >
                FR
                </div>
            )}
            <h1 className="hidden sm:block text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                FlexiRush Presenter
            </h1>
            </div>

            <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-red-500"} transition-colors duration-300`} />
                <span className="text-2xl sm:text-4xl font-mono font-bold tracking-widest text-white select-all cursor-pointer" title="Click to copy" onClick={() => navigator.clipboard.writeText(code)}>
                    {code}
                </span>
            </div>
            <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold tracking-tighter">Join Code</span>
            </div>
        </header>
      )}

      {/* --- MAIN GRID --- */}
      <main className={`grid gap-6 relative z-10 flex-1 overflow-hidden h-full ${isSidebar ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        
        {/* --- LEFT PANEL (LIVE VIEW) --- */}
        {!isSidebar && (
            <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm p-4 sm:p-8 rounded-2xl border border-slate-800 flex flex-col shadow-2xl relative overflow-y-auto custom-scrollbar min-h-[60vh]">
            
            {quiz ? (
                <div className="flex flex-col h-full items-center justify-center text-center w-full animate-in fade-in zoom-in duration-300">
                    
                    {/* QUIZ HEADER */}
                    <div className="flex justify-between items-center w-full mb-4 absolute top-4 px-6 z-20">
                        <h2 className="text-sm uppercase tracking-widest text-slate-400 font-bold max-w-[50%] truncate">{quiz.title}</h2>
                        <div className="flex gap-2">
                            {quiz.state !== "END" && (
                                <button onClick={handleNextQuizStep} disabled={actionLoading} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold transition border border-slate-700">
                                    Skip ⏭
                                </button>
                            )}
                            <button 
                                onClick={() => {
                                    if(confirm("Are you sure you want to quit the quiz? Progress will be lost.")) handleCloseQuiz();
                                }}
                                disabled={actionLoading}
                                className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/30 rounded text-xs font-bold transition"
                            >
                                ✕ Quit
                            </button>
                        </div>
                    </div>
                    
                    {/* STATE: LOBBY */}
                    {quiz.state === "LOBBY" && (
                        <div className="space-y-8">
                            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600">
                                Get Ready!
                            </h1>
                            <div className="text-2xl text-white bg-slate-800/80 px-8 py-3 rounded-full inline-block border border-slate-700">
                                👥 <span className="font-mono font-bold text-blue-400">{participants.length}</span> players ready
                            </div>
                            <div className="pt-8">
                                <button 
                                    onClick={handleNextQuizStep} 
                                    disabled={actionLoading}
                                    className="px-8 py-4 bg-green-600 hover:bg-green-500 active:scale-95 rounded-xl font-bold text-xl shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all flex items-center gap-2 mx-auto"
                                >
                                    {actionLoading ? "Starting..." : "Start Game 🚀"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STATE: QUESTION (LIVE) */}
                    {quiz.state === "QUESTION" && (
                        <div className="w-full max-w-4xl pt-12">
                            {currentQ ? (
                                <>
                                <div className="mb-8">
                                    <h3 className="text-3xl sm:text-4xl font-bold leading-tight mb-8 animate-in slide-in-from-right-4 fade-in">
                                        {/* NORMALIZED TEXT RENDERING */}
                                        {currentQ.text}
                                    </h3>
                                    <div className="bg-slate-800 h-3 rounded-full overflow-hidden relative w-full">
                                        <div 
                                            key={quiz.current_index} 
                                            className="h-full bg-linear-to-r from-green-500 to-yellow-500 origin-left w-full" 
                                            /* webhint: ignore inline-styles */
                                            style={{ 
                                                animation: `width_linear ${currentQ.time_limit}s linear forwards` 
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {currentQ.options.map((opt: any, i: number) => (
                                        <div 
                                            key={i} 
                                            className={`p-6 rounded-xl text-xl font-bold flex items-center gap-4 text-white shadow-lg transition-transform hover:scale-[1.01] ${
                                                ['bg-red-600', 'bg-blue-600', 'bg-yellow-600', 'bg-green-600'][i % 4]
                                            }`}
                                        >
                                            <span className="text-2xl opacity-60 bg-black/20 w-10 h-10 flex items-center justify-center rounded-lg">
                                                {['▲', '◆', '●', '■'][i]}
                                            </span>
                                            <span className="text-left">
                                                {typeof opt === 'string' ? opt : opt.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-500 gap-4">
                                    <div className="w-8 h-8 border-4 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="italic">Synchronizing Question Data...</p>
                                    <button 
                                        onClick={() => { lastActionTime.current = 0; syncState(); }} 
                                        className="text-xs bg-slate-800 px-4 py-2 rounded text-white hover:bg-slate-700 transition"
                                    >
                                        Force Sync 🔄
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STATE: LEADERBOARD */}
                    {quiz.state === "LEADERBOARD" && (
                        <div className="w-full max-w-lg pt-12">
                            <h3 className="text-4xl font-bold mb-8 text-yellow-400 drop-shadow-lg">🏆 Leaderboard</h3>
                            <div className="space-y-3 mb-10">
                                {Object.entries(quizScores || {})
                                    .sort(([,a], [,b]) => (b as number) - (a as number))
                                    .slice(0, 5)
                                    .map(([name, score], i) => (
                                    <div key={name} className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 animate-in slide-in-from-bottom-2 fade-in" 
                                    /* webhint: ignore inline-styles */
                                    style={{ animationDelay: `${i * 100}ms` }}>
                                            <div className="flex items-center gap-4">
                                                <span className={`font-black text-xl w-8 text-center ${i===0?'text-yellow-400': i===1 ? 'text-slate-300' : i===2 ? 'text-orange-400' : 'text-slate-500'}`}>
                                                    {i+1}
                                                </span>
                                                <span className="text-lg font-medium">{name}</span>
                                            </div>
                                            <span className="font-mono font-bold text-blue-400">{score as number} pts</span>
                                    </div>
                                ))}
                                {Object.keys(quizScores || {}).length === 0 && (
                                    <p className="text-slate-500 italic">Waiting for scores...</p>
                                )}
                            </div>
                            <button 
                                onClick={handleNextQuizStep} 
                                disabled={actionLoading}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition shadow-lg hover:shadow-blue-500/25"
                            >
                                {actionLoading ? "Loading..." : "Next Question →"}
                            </button>
                        </div>
                    )}

                    {/* STATE: END */}
                    {quiz.state === "END" && (
                        <div className="space-y-8 animate-in zoom-in duration-500 pt-12">
                            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500 drop-shadow-sm">
                                GAME OVER
                            </h1>
                            <div className="bg-slate-800/80 p-10 rounded-3xl border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                                <p className="text-slate-400 uppercase tracking-widest text-sm mb-4">The Winner is</p>
                                <p className="text-5xl font-bold text-white mb-2">
                                    {Object.entries(quizScores || {}).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || "No one"}
                                </p>
                                <p className="text-yellow-400 text-xl font-mono">
                                    {Object.entries(quizScores || {}).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[1] || 0} pts
                                </p>
                            </div>
                            <button onClick={handleCloseQuiz} disabled={actionLoading} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition font-medium text-slate-200">
                                Close Quiz & Return to Lobby
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                {/* --- POLL & Q&A VIEW --- */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                    {viewMode === "poll" ? "📊 Live Results" : "💬 Audience Q&A"}
                    </h2>
                    {currentPoll && (
                        <button onClick={endPoll} disabled={actionLoading} className="text-xs bg-red-900/50 text-red-300 border border-red-900 px-3 py-1 rounded hover:bg-red-900 transition flex items-center gap-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Stop Poll
                        </button>
                    )}
                </div>

                {viewMode === "poll" && (
                    !currentPoll ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                        <span className="text-6xl mb-4 grayscale opacity-20">📊</span>
                        <p className="opacity-50 text-lg">No active poll</p>
                        <button onClick={() => setShowPollForm(true)} className="mt-4 text-blue-400 hover:text-blue-300 underline">Launch one now</button>
                    </div>
                    ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-3xl font-bold text-center leading-snug">{currentPoll.question}</h3>
                        
                        {currentPoll.type === "multiple_choice" && (
                        <div className="space-y-4 max-w-2xl mx-auto w-full">
                            {currentPoll.options?.map((opt: { label: string; votes: number }, idx: number) => {
                            const count = pollResults?.[opt.label] ?? opt.votes ?? 0;
                            const percent = totalPollVotes > 0 ? (count / totalPollVotes) * 100 : 0;
                            
                            return (
                                <div key={idx} className="relative group">
                                    <div className="flex justify-between text-base font-medium mb-1 px-1">
                                        <span>{opt.label}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 text-sm">{Math.round(percent)}%</span>
                                            <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-white">{count}</span>
                                        </div>
                                    </div>
                                    <div className="h-5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                        <div 
                                            className="h-full bg-blue-500 transition-all duration-700 ease-out relative overflow-hidden" 
                                            /* webhint: ignore inline-styles */
                                            style={{ width: `${percent}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/10 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                            })}
                            <p className="text-center text-slate-500 text-sm mt-4">{totalPollVotes} total votes</p>
                        </div>
                        )}

                        {currentPoll.type === "rating" && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <div className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-br from-yellow-300 to-yellow-600 flex items-baseline gap-2">
                                    {currentPoll.average || 0.0} 
                                </div>
                            </div>
                            <div className="flex gap-1 mt-4">
                                {[1,2,3,4,5].map(star => (
                                    <span key={star} className={`text-4xl ${star <= Math.round(currentPoll.average || 0) ? 'text-yellow-400' : 'text-slate-700'}`}>★</span>
                                ))}
                            </div>
                            <p className="text-slate-500 mt-4">{Object.values(pollResults || {}).reduce((a:number,b:number)=>a+b, 0)} votes</p>
                        </div>
                        )}

                        {currentPoll.type === "word_cloud" && (
                            <div className="flex flex-wrap gap-4 justify-center items-center py-8 min-h-75">
                            {/* FIX: Correctly prioritize static words if live votes are empty */}
                            {(() => {
                                const wordsToShow = (pollResults && Object.keys(pollResults).length > 0) 
                                    ? pollResults 
                                    : (currentPoll.words || {});
                                
                                const entries = Object.entries(wordsToShow);

                                if (entries.length === 0) return <span className="text-slate-500">Waiting for words...</span>;

                                return entries.map(([word, count]) => (
                                    <span 
                                        key={word} 
                                        className="text-blue-400 font-bold transition-all duration-500 hover:scale-110 cursor-default animate-in zoom-in" 
                                        /* webhint: ignore inline-styles */
                                        style={{ 
                                            fontSize: `${Math.min(1.5 + (count as number * 0.5), 5)}rem`,
                                            opacity: Math.min(0.5 + (count as number * 0.1), 1)
                                        }}
                                    >
                                        {word}
                                    </span>
                                ));
                            })()}
                            </div>
                        )}

                        {currentPoll.type === "open_ended" && (
                            <TransientThoughts responses={currentPoll.responses || []} />
                        )}
                    </div>
                    )
                )}

                {/* VIEW: Q&A */}
                {viewMode === "qna" && (
                    <div className="space-y-3 overflow-y-auto max-h-[65vh] pr-2 custom-scrollbar">
                    {questions.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            <p>No questions yet.</p>
                            <p className="text-sm">Audience can ask questions from their devices.</p>
                        </div>
                    )}
                    {questions.sort((a, b) => b.votes - a.votes).map((q: Question) => (
                        <div 
                            key={q.id} 
                            className={`p-4 rounded-xl border flex gap-4 transition group animate-in slide-in-from-right-2 ${
                                q.visible !== false 
                                ? "bg-slate-800/50 border-slate-700 hover:border-blue-500/30" 
                                : "bg-slate-900/30 border-slate-800 opacity-50 grayscale" 
                            }`}
                        >
                        <div className="flex flex-col items-center justify-center min-w-12 text-blue-400 bg-slate-900/50 rounded-lg p-2 h-fit">
                            <span className="text-lg font-bold">▲</span>
                            <span className="text-sm font-mono font-bold">{q.votes}</span>
                        </div>
                        <div className="flex-1">
                            <div className={`text-base font-medium ${q.visible !== false ? "text-slate-200" : "text-slate-500 italic line-through"}`}>
                                {q.text}
                            </div>
                            {q.visible === false && <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider mt-1 block">Hidden</span>}
                        </div>
                        <button 
                            onClick={() => handleToggleQuestion(q.id)}
                            className={`px-3 py-1 rounded text-sm font-bold transition h-fit self-center ${
                                q.visible !== false 
                                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                : "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                            }`}
                        >
                            {q.visible !== false ? "Hide" : "Show"}
                        </button>
                        </div>
                    ))}
                    </div>
                )}
                </>
            )}
            </div>
        )}

        {/* --- RIGHT PANEL (CONTROLS & LIST) --- */}
        <div className="space-y-6 h-full overflow-y-auto custom-scrollbar pr-1 pb-20">
          
          {/* PARTICIPANTS CARD */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md">
            <h2 className="text-base font-bold text-slate-300 flex justify-between items-center mb-4 uppercase tracking-wider">
                <span>👥 Participants</span>
                <span className="bg-slate-800 px-2 py-1 rounded text-white border border-slate-700">{participants.length}</span>
            </h2>
            <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                {participants.length === 0 && <p className="text-slate-500 text-sm italic text-center py-4">Waiting for joiners...</p>}
                {participants.map((p) => (
                    <div key={p.id} className="flex justify-between items-center bg-slate-800/30 p-2 rounded hover:bg-slate-800 transition group border border-transparent hover:border-slate-700">
                        <span className="text-sm text-slate-300 font-medium truncate max-w-[70%]">{p.name}</span>
                        <button 
                            onClick={() => handleBanUser(p.name)}
                            className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition font-bold"
                        >
                            KICK
                        </button>
                    </div>
                ))}
            </div>
          </div>

          {/* ACTIONS CARD */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md">
            <h2 className="text-base font-bold text-slate-300 mb-4 uppercase tracking-wider">Control Deck</h2>
            
            {/* QUIZ CONTROLS - ALWAYS VISIBLE IF QUIZ ACTIVE */}
            {quiz && (
                <div className="mb-4 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg animate-pulse">
                    <p className="text-xs text-blue-300 font-bold uppercase mb-2">Active Quiz: {quiz.state}</p>
                    <div className="flex flex-col gap-2">
                        {quiz.state === 'LOBBY' && <button onClick={handleNextQuizStep} className="p-3 bg-green-600 hover:bg-green-500 rounded font-bold transition">Start Game ▶</button>}
                        {quiz.state === 'QUESTION' && <div className="text-center text-sm font-bold text-white bg-slate-800 p-2 rounded">Question Live...</div>}
                        {quiz.state === 'LEADERBOARD' && <button onClick={handleNextQuizStep} className="p-3 bg-blue-600 hover:bg-blue-500 rounded font-bold transition">Next Question ➡</button>}
                        <button onClick={handleCloseQuiz} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-xs border border-red-500/20 transition">End Quiz</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => { setShowPollForm(true); setViewMode("poll"); }} 
                className="p-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition text-left flex justify-between items-center group active:scale-[0.98]"
              >
                <span>Launch New Poll</span><span className="group-hover:translate-x-1 transition">🚀</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowQuizCreator(true)} 
                    className="p-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition flex flex-col items-center justify-center gap-1 active:scale-[0.98]"
                  >
                    <span className="text-xl">🏆</span>
                    <span className="text-xs">Manual Quiz</span>
                  </button>
                  <button
                    onClick={() => setShowAIModal(true)}
                    className="p-3 bg-linear-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition flex flex-col items-center justify-center gap-1 shadow-lg active:scale-[0.98]"
                  >
                    <span className="text-xl">✨</span>
                    <span className="text-xs">AI Quiz</span>
                  </button>
              </div>

              <button 
                onClick={() => setShowWheel(true)} 
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition text-left flex justify-between items-center text-sm"
              >
                <span>Spin Wheel</span><span>🎲</span>
              </button>
              
              {/* STREAMALIVE-STYLE CHAT PARSER */}
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 mt-2">
                  <label htmlFor="chat-input" className="text-xs text-slate-400 font-bold uppercase block mb-2">Paste Chat Log (Zoom/Teams)</label>
                  <textarea 
                      id="chat-input"
                      className="w-full bg-slate-900 text-xs text-white p-2 rounded h-16 border border-slate-700 mb-2 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Paste chat here..."
                  ></textarea>
                  <button 
                      onClick={async () => {
                          const text = (document.getElementById('chat-input') as HTMLTextAreaElement).value;
                          if (!text) return;
                          
                          // 1. Reset current state first (Visual feedback)
                          setPoll(null); 
                          
                          // 2. Simple NLP: Filter out short words, count frequency
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const words = text.split(/\s+/).filter(w => w.length > 3).reduce((acc: any, word) => {
                              const clean = word.toLowerCase().replace(/[^a-z]/g, '');
                              if (clean.length > 3) {
                                  acc[clean] = (acc[clean] || 0) + 1;
                              }
                              return acc;
                          }, {});

                          // 3. Send to backend
                          await apiCall("/poll/start", "POST", { 
                              type: "word_cloud", 
                              question: "Chat Insights", 
                              words: words 
                          });

                          // 4. Force a fetch to ensure UI syncs if socket is slow
                          setTimeout(() => {
                              apiCall("/state").then((data) => {
                                  if (data?.current_poll) setPoll(data.current_poll);
                              });
                          }, 300);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 rounded transition"
                  >
                      ✨ Visualize Chat
                  </button>
              </div>

              {!isSidebar && (
                  <>
                    <button 
                        onClick={() => setShowMap(true)} 
                        className="p-3 bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 border border-purple-500/30 rounded-lg transition text-left flex justify-between items-center text-sm"
                    >
                        <span>Magic Map</span><span>🌍</span>
                    </button>
                    
                    <button 
                        onClick={handleExport} 
                        className="p-3 bg-orange-900/20 hover:bg-orange-900/40 text-orange-200 border border-orange-500/20 rounded-lg transition text-left flex justify-between items-center text-sm"
                    >
                        <span>Export CSV</span><span>📥</span>
                    </button>
                  </>
              )}

              <div className="h-px bg-slate-800 my-1"></div>

              <button 
                onClick={() => setViewMode("qna")} 
                className={`p-3 font-bold rounded-lg transition text-left flex justify-between items-center text-sm ${viewMode === 'qna' ? "bg-slate-700 text-white ring-2 ring-blue-500" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
              >
                <span>View Q&A Board</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded text-xs border border-slate-700">{questions.length}</span>
              </button>
              
              {!isSidebar && (
                <button 
                    onClick={() => setShowSettings(true)} 
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition text-left flex justify-between items-center text-sm hover:text-white"
                >
                    <span>Settings</span><span>⚙️</span>
                </button>
              )}
            </div>
          </div>
          
          {/* AI INSIGHTS BUTTON & CARD */}
          <div className="space-y-3">
              <button 
                onClick={handleAiAnalyze} 
                disabled={analyzing} 
                className="w-full p-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition text-left border border-indigo-400/30 flex justify-between items-center shadow-lg active:scale-[0.98]"
              >
                <div className="flex flex-col">
                    <span className="text-sm">Analyze Room Vibe</span>
                    <span className="text-xs opacity-70 font-normal">Powered by Gemini AI</span>
                </div>
                <span className={analyzing ? "animate-spin text-xl" : "text-xl"}>{analyzing ? "⚙️" : "🔮"}</span>
              </button>

              {aiSummary && (
                <div className="p-4 bg-slate-800/90 rounded-xl border border-purple-500/30 animate-in fade-in slide-in-from-top-2 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🤖</span>
                        <h3 className="text-purple-400 text-xs font-bold uppercase tracking-widest">Hive Mind Insights</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-purple-500 pl-3">
                        &quot;{aiSummary}&quot;
                    </p>
                </div>
              )}
          </div>
        </div>
      </main>

      {/* --- MODALS --- */}
      
      {showWheel && (
         <WinningWheel participants={participants.map(p => p.name) || []} onClose={() => setShowWheel(false)} />
      )}

      {showPollForm && <CreatePollForm sessionCode={code} onClose={() => setShowPollForm(false)} />}
      {showQuizCreator && <QuizCreator sessionCode={code} onClose={() => setShowQuizCreator(false)} />}
      {showAIModal && <AIQuizCreator sessionCode={code} onClose={() => setShowAIModal(false)} onSuccess={handleQuizCreated} />}

      {showMap && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
            <div className="w-full max-w-6xl h-[80vh] bg-slate-900 rounded-2xl relative flex flex-col overflow-hidden border border-slate-700 shadow-2xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 z-10">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        🌍 Magic Map <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">Live Locations</span>
                    </h2>
                    <button 
                        onClick={() => setShowMap(false)} 
                        className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded transition font-bold"
                    >
                        ✕ Close
                    </button>
                </div>
                <div className="flex-1 bg-black relative">
                    <MagicMap />
                </div>
            </div>
        </div>
      )}
  
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl scale-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">⚙️ Session Settings</h2>
            <div className="space-y-6">
              
              {/* BRANDING SECTION */}
              <div>
                <label htmlFor="logo-url" className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Custom Logo URL</label>
                <input 
                    id="logo-url"
                    aria-label="Custom Logo URL"
                    type="text" 
                    value={tempLogo} 
                    onChange={(e) => setTempLogo(e.target.value)} 
                    placeholder="https://example.com/logo.png" 
                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-600" 
                />
              </div>

              {/* EMBED SECTION (NEW) */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <label className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">Embed in Slides / Notion</label>
                <p className="text-[10px] text-slate-400 mb-3">
                    Copy this URL into an iframe or the &quot;Web Viewer&quot; add-in for PowerPoint.
                </p>
                <div className="flex gap-2">
                    <input 
                        readOnly 
                        aria-label="Embed Code URL"
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/embed/presenter/${code}?transparent=true`}
                        className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded text-xs text-slate-300 font-mono select-all"
                    />
                    <button 
                        onClick={() => {
                            const url = `${window.location.origin}/embed/presenter/${code}?transparent=true`;
                            navigator.clipboard.writeText(`<iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>`);
                            alert("Iframe code copied to clipboard!");
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold transition"
                    >
                        Copy
                    </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowSettings(false)} className="flex-1 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition font-bold border border-transparent hover:border-slate-700">Close</button>
                <button onClick={saveSettings} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-lg">Save Branding</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}