"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore, Question } from "@/store/sessionStore";
import { useRealtime } from "@/hooks/useRealtime";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface QuizOption {
  label: string;
  isCorrect?: boolean;
}

interface QuizQuestion {
  text: string;
  question?: string; 
  time_limit: number; 
  options: string[] | QuizOption[];
  answers?: string[] | QuizOption[]; 
}

interface SafeQuiz {
  title: string;
  state: "LOBBY" | "QUESTION" | "LEADERBOARD" | "END";
  current_index: number;
  questions: QuizQuestion[];
  answers_count?: number;
  question_started_at?: number; 
  version?: number;
}

// ---------------------------------------------------------------------------
// DYNAMIC IMPORTS
// ---------------------------------------------------------------------------

const ReactionOverlay   = dynamic(() => import("@/components/ReactionOverlay"),    { ssr: false });
const CreatePollForm    = dynamic(() => import("@/components/CreatePollForm"),      { ssr: false });
const WinningWheel      = dynamic(() => import("@/components/WinningWheel"),        { ssr: false });
const QuizCreator       = dynamic(() => import("@/components/QuizCreator"),         { ssr: false });
const AIQuizCreator     = dynamic(() => import("@/components/AIQuizCreator"),       { ssr: false });
const MagicMap          = dynamic(() => import("@/components/MagicMap"),            { ssr: false });
const TransientThoughts = dynamic(() => import("@/components/TransientThoughts"),  { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

// ---------------------------------------------------------------------------
// CUSTOM HOOK: useServerSyncedTimer
// ---------------------------------------------------------------------------

function useServerSyncedTimer(quiz: SafeQuiz | null, onTimeUp: () => void, isLocked: boolean, timeOffset: number): number {
  const [timeLeft, setTimeLeft] = useState(0);
  const onTimeUpRef = useRef(onTimeUp);
  const isLockedRef = useRef(isLocked);
  const offsetRef = useRef(timeOffset);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { onTimeUpRef.current = onTimeUp; }, [onTimeUp]);
  useEffect(() => { isLockedRef.current = isLocked; }, [isLocked]);
  useEffect(() => { offsetRef.current = timeOffset; }, [timeOffset]);

  useEffect(() => {
    if (quiz?.state !== "QUESTION") {
      const timeoutId = setTimeout(() => setTimeLeft(0), 0);
      return () => clearTimeout(timeoutId);
    }

    const q = quiz.questions[quiz.current_index];
    if (!q || q.time_limit <= 0) {
      const timeoutId = setTimeout(() => setTimeLeft(0), 0);
      return () => clearTimeout(timeoutId);
    }

    const duration = q.time_limit;
    const startedAt = quiz.question_started_at ?? Date.now(); 

    const updateTimer = () => {
      const clientNowSynced = Date.now() + offsetRef.current;
      const elapsed = Math.max(0, Math.floor((clientNowSynced - startedAt) / 1000));
      const remaining = Math.max(0, duration - elapsed);
      
      setTimeLeft(prev => prev === remaining ? prev : remaining);

      if (remaining === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (!isLockedRef.current) {
          onTimeUpRef.current();
        }
      }
    };

    updateTimer(); 
    timerRef.current = setInterval(updateTimer, 500); 

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quiz?.state, quiz?.current_index, quiz?.question_started_at, quiz?.questions, timeOffset]);

  return timeLeft;
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function resolveOption(opt: string | QuizOption): string {
  return typeof opt === "string" ? opt : opt.label;
}

function resolveQuestion(q: QuizQuestion) {
  return {
    text: q.text ?? q.question ?? "Mystery Question",
    time_limit: q.time_limit,
    options: (q.options ?? q.answers ?? []) as Array<string | QuizOption>,
  };
}

const OPTION_COLORS = [
  "bg-red-600/90 border-red-500/50", 
  "bg-blue-600/90 border-blue-500/50", 
  "bg-yellow-500/90 text-slate-900 border-yellow-400/50", 
  "bg-green-600/90 border-green-500/50"
] as const;
const OPTION_LABELS = ["A", "B", "C", "D"] as const;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function PresenterDashboard({ params }: { params: Promise<{ code: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null);
  const searchParams = useSearchParams();
  const isSidebar = searchParams.get("sidebar") === "true";
  const router = useRouter();

  useEffect(() => { params.then(setResolvedParams); }, [params]);
  const code = resolvedParams?.code ?? "";

  // UI STATE
  const [showDebug,        setShowDebug]        = useState(false);
  const [showPollForm,     setShowPollForm]     = useState(false);
  const [showWheel,        setShowWheel]        = useState(false);
  const [showQuizCreator,  setShowQuizCreator]  = useState(false);
  const [showAIModal,      setShowAIModal]      = useState(false);
  const [showMap,          setShowMap]          = useState(false);
  const [showSettings,     setShowSettings]     = useState(false);
  const [viewMode,         setViewMode]         = useState<"poll" | "qna">("poll");
  const [actionLoading,    setActionLoading]    = useState(false);
  
  const [confirmAction, setConfirmAction] = useState<{ msg: string; action: () => Promise<void> | void } | null>(null);

  const [tempLogo,   setTempLogo]   = useState("");
  const [aiSummary,  setAiSummary]  = useState("");
  const [analyzing,  setAnalyzing]  = useState(false);

  // ARCHITECTURE: Distributed System Integrity
  const actionLock = useRef<boolean>(false);
  const lastActionTime = useRef<number>(0);
  const currentVersion = useRef<number>(0);
  const [serverTimeOffset, setServerTimeOffset] = useState<number>(0);

  // STORE
  useRealtime(code, "presenter");
  const {
    token, isConnected, participants,
    currentPoll, pollResults,
    questions, quiz, quizScores, branding,
    setQuiz, setPoll, setQuestions, setPollResults
  } = useSessionStore();

  const safeQuiz = quiz as SafeQuiz | null;

  useEffect(() => {
    if (!token && resolvedParams) router.push("/login");
  }, [token, router, resolvedParams]);

  useEffect(() => {
    if (branding?.logo_url) setTempLogo(branding.logo_url);
  }, [branding]);

  // ARCHITECTURE: Strict Error Bubbling API Call
  const apiCall = useCallback(
    async (endpoint: string, method: "GET" | "POST" = "GET", body?: unknown) => {
      if (!code) return null;
      const res = await fetch(`${API_URL}/api/session/${code}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        throw new Error(JSON.stringify({ status: res.status, message: await res.text() }));
      }
      return await res.json();
    },
    [code]
  );

  // ARCHITECTURE: Strict Versioning & Payload Applier
  const applyStatePayload = useCallback((data: unknown) => {
    if (!data || typeof data !== 'object') return;
    const safeData = data as Record<string, unknown>;
    
    if (typeof safeData.server_now === 'number') {
      const newOffset = safeData.server_now - Date.now();
      // 🛡️ FRONTEND FIX 4: Clock Skew Cutoff
      setServerTimeOffset(prev => {
        if (prev === 0) return newOffset;
        if (Math.abs(prev - newOffset) > 60000) return newOffset;
        return Math.floor(prev * 0.8 + newOffset * 0.2);
      });
    }

    const quizData = safeData.quiz as Record<string, unknown> | undefined;
    const rawVersion = quizData?.version ?? safeData.version;
    
    // 🛡️ FRONTEND FIX 3: Relaxed Version Guard
    if (rawVersion != null) {
      const incomingVersion = Number(rawVersion);
      if (Number.isFinite(incomingVersion)) {
        if (currentVersion.current > 0 && incomingVersion < currentVersion.current) return; 
        if (incomingVersion > currentVersion.current) currentVersion.current = incomingVersion;
      }
    }

    if ('quiz' in safeData) setQuiz(safeData.quiz as Parameters<typeof setQuiz>[0]);
    if ('current_poll' in safeData) setPoll(safeData.current_poll as Parameters<typeof setPoll>[0]);
    if ('questions' in safeData) setQuestions(safeData.questions as Parameters<typeof setQuestions>[0]);
    
    // 🛡️ FRONTEND FIX 2: Added missing poll_results sync for heartbeat
    if ('poll_results' in safeData && setPollResults) setPollResults(safeData.poll_results as Record<string, number>);
  }, [setQuiz, setPoll, setQuestions, setPollResults]);

  const fetchState = useCallback(async (force = false) => {
    if (!force && Date.now() - lastActionTime.current < 2000) return;
    try {
      const data = await apiCall("/state");
      applyStatePayload(data);
    } catch (e) {
      console.error("State sync failed:", e);
    }
  }, [apiCall, applyStatePayload]);

  useEffect(() => { if (code) fetchState(true); }, [code, fetchState]);

  useEffect(() => {
    if (!code) return;
    const ms = isConnected ? 10_000 : 3_000;
    const id = setInterval(() => fetchState(false), ms);
    const onFocus = () => fetchState(true);
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(id); window.removeEventListener("focus", onFocus); };
  }, [code, isConnected, fetchState]);

  const executeAction = useCallback(
    async (fn: () => Promise<unknown>) => {
      if (actionLock.current) return;
      actionLock.current = true;
      setActionLoading(true);
      lastActionTime.current = Date.now();
      try {
        const resultData = await fn();
        const safeResult = resultData as Record<string, unknown> | null;
        
        if (safeResult && (safeResult.quiz !== undefined || safeResult.version != null)) {
          applyStatePayload(safeResult);
        } else {
          await fetchState(true); 
        }
      } catch (e: unknown) {
        console.error("Action execution error:", e);
        try {
          if (e instanceof Error) {
            const errData = JSON.parse(e.message);
            if (errData.status === 409) {
              await fetchState(true); 
              return;
            }
          }
        } catch {
          // Fallback parsing
        }
        alert("Action failed to sync with server. Please check connection and try again.");
      } finally {
        setActionLoading(false);
        actionLock.current = false;
      }
    },
    [fetchState, applyStatePayload]
  );

  // -------------------------------------------------------------------------
  // QUIZ ACTIONS (Hardware Feel - Instant Intent)
  // -------------------------------------------------------------------------
  
  const handleAdvanceQuiz = useCallback(() =>
    executeAction(async () => {
      return await apiCall("/quiz/advance", "POST", {
        expected_state: safeQuiz?.state,
        expected_index: safeQuiz?.current_index
      });
    }),
    [executeAction, safeQuiz, apiCall]
  );

  const handleJumpToLeaderboard = useCallback(() =>
    executeAction(async () => {
      return await apiCall("/quiz/jump_leaderboard", "POST"); 
    }),
    [executeAction, apiCall]
  );

  const handleDestroyQuiz = useCallback(() =>
    executeAction(async () => {
      return await apiCall("/quiz/destroy", "POST");
    }),
    [executeAction, apiCall]
  );

  const endPoll = useCallback(() =>
    executeAction(async () => {
      return await apiCall("/poll/end", "POST");
    }),
    [executeAction, apiCall]
  );

  const timeLeft = useServerSyncedTimer(safeQuiz, handleAdvanceQuiz, actionLoading, serverTimeOffset);

  // -------------------------------------------------------------------------
  // OTHER ACTIONS
  // -------------------------------------------------------------------------
  
  const handleToggleQuestion = (qId: string) => 
    executeAction(async () => {
      return await apiCall(`/question/${qId}/toggle`, "POST");
    });

  const handleBanUser = (userName: string) =>
    setConfirmAction({
      msg: `Kick ${userName} from the session?`,
      action: async () => {
        await executeAction(async () => {
          return await apiCall("/ban", "POST", { name: userName });
        });
      },
    });

  const saveSettings = async () => {
    await executeAction(async () => {
      return await apiCall("/branding", "POST", { logo_url: tempLogo, theme_color: branding?.theme_color });
    });
    setShowSettings(false);
  };

  const handleQuizCreated = () => {
    lastActionTime.current = 0;
    fetchState(true);
  };

  const handleExport = () => window.open(`${API_URL}/api/session/${code}/export`, "_blank");

  const handleAiAnalyze = async () => {
    if (analyzing) return;
    setAnalyzing(true);
    setAiSummary("");
    try {
      const context = safeQuiz
        ? [`Quiz Title: ${safeQuiz.title}`, `Total Answers so far: ${safeQuiz.answers_count ?? 0}`]
        : [`Poll Question: ${currentPoll?.question ?? ""}`, `Results: ${JSON.stringify(pollResults)}`];
        
      const res = await fetch(`${API_URL}/api/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: context }),
      });
      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();
      setAiSummary(data.summary ?? "AI couldn't generate a summary.");
    } catch {
      setAiSummary("Network error during analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  const totalPollVotes = useMemo(() => {
    if (!pollResults) return 0;
    return Object.values(pollResults).reduce((acc, curr) => acc + (curr as number), 0);
  }, [pollResults]);

  const currentQ = safeQuiz?.questions[safeQuiz.current_index]
    ? resolveQuestion(safeQuiz.questions[safeQuiz.current_index])
    : null;

  const progressPercent = useMemo(() => {
    if (!currentQ || currentQ.time_limit <= 0) return 0;
    return Math.max(0, Math.min(100, (timeLeft / currentQ.time_limit) * 100));
  }, [timeLeft, currentQ]);

  const debugPayload = useMemo(() => 
    JSON.stringify({ quiz: safeQuiz, currentPoll, participants, clock_skew: serverTimeOffset, version: currentVersion.current }, null, 2), 
  [safeQuiz, currentPoll, participants, serverTimeOffset]);

  if (!resolvedParams || !token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
          <p className="tracking-widest uppercase text-sm font-bold text-slate-400 animate-pulse">Initializing Interface…</p>
        </div>
      </div>
    );
  }

  const leaderboard = Object.entries(quizScores ?? {}).sort(([, a], [, b]) => (b as number) - (a as number));

  // The Heartbeat State
  const isCritical = safeQuiz?.state === "QUESTION" && timeLeft > 0 && timeLeft <= 5;

  return (
    <div className={`min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-hidden ${isSidebar ? "p-2" : "p-4 sm:p-8"}`}>
      {isSidebar && <Script src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js" strategy="lazyOnload" />}
      {!isSidebar && <ReactionOverlay />}

      {/* HEADER: Premium Command Center Vibe */}
      <header className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-6 sticky top-0 bg-slate-950/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          {branding?.logo_url ? (
            <div className="relative w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              <Image src={branding.logo_url} alt="Logo" fill className="object-contain rounded-lg" />
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-colors ${isConnected ? "bg-blue-600 shadow-blue-500/30" : "bg-red-500 shadow-red-500/30"}`}>FR</div>
          )}
          {!isSidebar && <h1 className="font-black tracking-tight text-2xl bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">FlexiRush</h1>}
        </div>
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700/50 shadow-inner">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Room</span>
          <span className="font-mono font-bold text-white tracking-widest cursor-pointer select-all hover:text-blue-400 transition-colors duration-75" title="Click to copy" onClick={() => navigator.clipboard.writeText(code)}>{code}</span>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-red-500 shadow-[0_0_10px_#ef4444]"}`} />
          <span className="text-sm font-medium">👥 <span className="font-bold">{participants.length}</span></span>
        </div>
      </header>

      {/* SIDEBAR LAYOUT */}
      {isSidebar ? (
        <main className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="space-y-3 shrink-0">
            {safeQuiz ? (
              <div className={`bg-slate-900 border p-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-colors duration-150 ${isCritical ? 'border-red-500/80 bg-red-950/20' : 'border-purple-500/50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isCritical ? 'text-red-400' : 'text-purple-400'}`}>Active Broadcast</span>
                  {safeQuiz.state === "QUESTION" && <span className={`text-xs font-mono px-2 py-1 rounded-md font-bold transition-colors duration-75 ${isCritical ? "bg-red-500 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-purple-900/50 text-white"}`}>{timeLeft}s</span>}
                </div>
                <h3 className="text-sm font-bold text-white mb-4 truncate">{safeQuiz.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {safeQuiz.state !== "END" && (
                    <button onClick={handleAdvanceQuiz} disabled={actionLoading} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-lg active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-transform duration-75">
                      {safeQuiz.state === "LOBBY" ? "Launch ▶" : "Advance ➡"}
                    </button>
                  )}
                  <button onClick={() => setConfirmAction({ msg: "Jump to final results?", action: handleJumpToLeaderboard })} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded-lg border border-slate-700 active:scale-95 transition-transform duration-75">
                    Results 🏆
                  </button>
                </div>
              </div>
            ) : currentPoll ? (
              <div className="bg-slate-900 border border-blue-500/50 p-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live Polling</span>
                  <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">{totalPollVotes} votes</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-4 truncate">{currentPoll.question}</h3>
                <button onClick={() => setConfirmAction({ msg: "Stop poll?", action: endPoll })} className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-lg shadow-lg shadow-red-500/20 active:scale-95 transition-transform duration-75">Stop Collection ⏹</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => { setShowPollForm(true); setViewMode("poll"); }} className="p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95 transition-transform duration-75">📊 Launch Data Poll</button>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setShowAIModal(true)} className="p-3 bg-linear-to-br from-purple-600 to-pink-600 text-white font-bold rounded-xl text-xs flex flex-col items-center justify-center gap-1 shadow-lg shadow-purple-500/25 active:scale-95 transition-transform duration-75"><span className="text-lg">✨</span> AI Core</button>
                  <button onClick={() => setShowQuizCreator(true)} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex flex-col items-center justify-center gap-1 border border-slate-700 active:scale-95 transition-transform duration-75"><span className="text-lg">🏆</span> Studio</button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden relative min-h-50 shadow-inner">
            <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-[9px] text-slate-400 uppercase tracking-widest font-bold backdrop-blur-md z-10 border border-slate-700/50">Output Feed</div>
            <div className="h-full overflow-y-auto p-5 flex flex-col items-center justify-center text-center">
              {safeQuiz ? (
                <div className="w-full">
                  {safeQuiz.state === "LOBBY" && <p className="text-xl font-black text-slate-300 tracking-tight animate-pulse">Awaiting Start…</p>}
                  {safeQuiz.state === "QUESTION" && currentQ && (
                    <div className="w-full">
                      <p className="font-bold text-white mb-5 text-lg leading-tight drop-shadow-md">{currentQ.text}</p>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <div className={`h-full transition-all duration-500 ease-out ${isCritical ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>
                  )}
                  {safeQuiz.state === "LEADERBOARD" && <p className="text-yellow-400 font-black text-xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">🏆 Top Ranks</p>}
                  {safeQuiz.state === "END" && <p className="text-green-400 font-black text-xl drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">🎉 Event Concluded</p>}
                </div>
              ) : currentPoll ? (
                <div className="w-full pt-6">
                  {currentPoll.type === "multiple_choice" && (
                    <div className="space-y-3 w-full">
                      {(currentPoll.options ?? []).map((opt: { label: string }) => {
                        const count = pollResults?.[opt.label] ?? 0;
                        const pct = totalPollVotes > 0 ? (count / totalPollVotes) * 100 : 0;
                        return (
                          <div key={opt.label} className="w-full">
                            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1"><span>{opt.label}</span><span className="text-blue-400">{count}</span></div>
                            <div className="h-1.5 bg-slate-800 rounded-full shadow-inner overflow-hidden">
                              <div className="h-full bg-blue-500 transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {currentPoll.type !== "multiple_choice" && <p className="text-sm font-bold text-slate-400 tracking-wider">Live Visualizer Active</p>}
                </div>
              ) : <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Feed Empty</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 shrink-0">
            <button onClick={() => setShowWheel(true)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 active:scale-95 transition-transform duration-75">🎲 Wheel</button>
            <button onClick={() => setViewMode("qna")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 active:scale-95 transition-transform duration-75">💬 Q&amp;A</button>
            <button onClick={() => setShowSettings(true)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 active:scale-95 transition-transform duration-75">⚙️ Config</button>
          </div>
        </main>

      ) : (
      /* DESKTOP LAYOUT - World Class Authority UI */
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
          {/* LEFT PANEL — Live Canvas */}
          <div className={`lg:col-span-8 bg-slate-900/40 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border flex flex-col shadow-2xl relative overflow-y-auto min-h-[65vh] transition-colors duration-150 ${isCritical ? 'border-red-500/80 shadow-[0_0_50px_rgba(239,68,68,0.2)] bg-red-950/10' : 'border-slate-800/80'}`}>
            {safeQuiz ? (
              <div className="flex flex-col h-full items-center justify-center text-center w-full relative">
                
                {/* Tactical Top Bar */}
                <div className="flex justify-between items-center w-full absolute top-0 px-2 pt-2 z-20">
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-950 border border-slate-700 text-[10px] px-3 py-1.5 rounded-full text-slate-400 font-black uppercase tracking-widest shadow-sm">
                      {safeQuiz.state === "LOBBY" ? "Staging" : safeQuiz.state === "END" ? "Final" : `Phase ${safeQuiz.current_index + 1}`}
                    </span>
                    {safeQuiz.state === "QUESTION" && (
                      <div className="flex gap-2">
                        <span className={`text-sm font-mono font-bold px-3 py-1.5 rounded-full shadow-inner transition-colors duration-75 ${isCritical ? "bg-red-500 text-white animate-pulse border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] scale-110" : "bg-slate-950 border border-slate-700 text-white"}`}>
                          ⏱ {timeLeft}s
                        </span>
                        <span className="text-sm font-mono font-bold px-3 py-1.5 rounded-full bg-blue-900/20 text-blue-400 border border-blue-500/30">
                          📥 {safeQuiz.answers_count ?? 0} / {participants.length}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {safeQuiz.state !== "END" && (
                      <button onClick={handleAdvanceQuiz} disabled={actionLoading} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-bold border border-slate-600 disabled:opacity-50 active:scale-95 transition-transform duration-75 shadow-md">Skip ⏭</button>
                    )}
                    <button onClick={() => setConfirmAction({ msg: "Terminate broadcast entirely?", action: handleDestroyQuiz })} className="px-4 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/50 rounded-full text-xs font-bold active:scale-95 transition-transform duration-75">✕ Terminate</button>
                  </div>
                </div>

                {/* STATE: LOBBY (Hard Cut) */}
                {safeQuiz.state === "LOBBY" && (
                  <div className="space-y-10 mt-12 w-full max-w-2xl">
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-sm tracking-tight">
                      System Ready
                    </h1>
                    <div className="text-2xl text-slate-300 bg-slate-950/60 px-10 py-4 rounded-full inline-block border border-slate-800 shadow-inner">
                      Audience Lock: <span className="font-mono font-black text-blue-400 text-3xl ml-2">{participants.length}</span>
                    </div>
                    <div className="pt-8">
                      <button onClick={handleAdvanceQuiz} disabled={actionLoading} className="px-12 py-5 bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-2xl font-black text-xl shadow-[0_10px_40px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 mx-auto disabled:opacity-50 transition-transform duration-75 border border-blue-400/30">
                        {actionLoading ? "Initializing..." : "Initiate Sequence 🚀"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STATE: QUESTION (The Heartbeat Signature) */}
                {safeQuiz.state === "QUESTION" && (
                  <div className={`w-full max-w-5xl pt-16 transition-all duration-150 ${isCritical ? 'scale-[1.03] drop-shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'scale-100'}`}>
                    {currentQ ? (
                      <>
                        <div className="mb-12 relative">
                          <h3 className={`text-4xl sm:text-5xl font-black leading-tight mb-10 drop-shadow-lg tracking-tight transition-colors duration-150 ${isCritical ? 'text-red-400' : 'text-white'}`}>
                            {currentQ.text}
                          </h3>
                          {/* The Fuse */}
                          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 shadow-inner relative">
                            <div 
                              key={safeQuiz.current_index} 
                              className={`h-full origin-left transition-all duration-500 ease-linear rounded-full relative ${isCritical ? "bg-red-500 shadow-[0_0_25px_rgba(239,68,68,1)]" : "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"}`} 
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full px-4">
                          {currentQ.options.map((opt, i) => (
                            <div key={i} className={`p-8 rounded-2xl text-2xl font-bold flex items-center gap-6 text-white border transition-transform duration-75 ${OPTION_COLORS[i % 4]} ${isCritical ? 'animate-pulse border-red-500/50 bg-red-950/40' : 'border-white/10'}`}>
                              <span className="text-3xl font-black opacity-80 bg-black/20 w-14 h-14 flex items-center justify-center rounded-xl shadow-inner border border-white/5">
                                {OPTION_LABELS[i % 4]}
                              </span>
                              <span className="text-left leading-tight drop-shadow-md">{resolveOption(opt)}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : <div className="animate-pulse flex flex-col items-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" /><p className="font-bold text-slate-500 tracking-widest uppercase">Syncing Grid...</p></div>}
                  </div>
                )}

                {/* STATE: LEADERBOARD (Aggressive Slam) */}
                {safeQuiz.state === "LEADERBOARD" && (
                  <div className="w-full max-w-2xl pt-10 animate-in zoom-in-105 duration-150 ease-out">
                    <h3 className="text-5xl font-black mb-12 text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-amber-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)] tracking-tight">
                      Current Rankings
                    </h3>
                    <div className="space-y-4 mb-12 relative">
                      {leaderboard.slice(0, 5).map(([name, score], i) => (
                        <div key={name} className={`flex justify-between items-center bg-slate-900/80 p-5 rounded-2xl border ${i === 0 ? "border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] scale-105 z-10" : "border-slate-800"}`}>
                          <div className="flex items-center gap-6">
                            <span className={`font-black text-2xl w-10 text-center drop-shadow-md ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-orange-400" : "text-slate-600"}`}>#{i + 1}</span>
                            <span className={`text-xl font-bold ${i === 0 ? "text-white" : "text-slate-300"}`}>{name}</span>
                          </div>
                          <span className={`font-mono font-black tracking-wider ${i === 0 ? "text-yellow-400 text-2xl" : "text-blue-400 text-xl"}`}>{score as number}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleAdvanceQuiz} disabled={actionLoading} className="px-10 py-4 bg-slate-100 hover:bg-white text-slate-900 rounded-2xl font-black text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 disabled:opacity-50 transition-transform duration-75">
                      {actionLoading ? "Processing..." : "Next Phase →"}
                    </button>
                  </div>
                )}

                {/* STATE: END (Hard Cut) */}
                {safeQuiz.state === "END" && (
                  <div className="space-y-10 pt-12 w-full max-w-2xl animate-in zoom-in-[1.02] duration-150">
                    <h1 className="text-7xl font-black text-transparent bg-clip-text bg-linear-to-b from-yellow-300 to-yellow-600 drop-shadow-lg tracking-tighter">
                      VICTORY
                    </h1>
                    <div className="bg-slate-950/80 p-12 rounded-4xl border border-yellow-500/40 shadow-[0_0_50px_rgba(234,179,8,0.2)] relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
                      <p className="text-yellow-500/80 font-black uppercase tracking-[0.3em] text-sm mb-6">Supreme Champion</p>
                      <p className="text-6xl font-black text-white mb-4 drop-shadow-xl">{leaderboard[0]?.[0] ?? "Unknown"}</p>
                      <p className="text-yellow-400 text-3xl font-mono font-bold tracking-widest bg-yellow-900/20 py-2 px-6 rounded-full inline-block border border-yellow-500/20">{(leaderboard[0]?.[1] as number) ?? 0} PTS</p>
                    </div>
                    <div className="flex justify-center gap-6">
                      <button onClick={handleExport} className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-black text-white shadow-[0_0_20px_rgba(22,163,74,0.3)] flex items-center gap-3 active:scale-95 border border-green-400/30 transition-transform duration-75">
                        <span className="text-xl">📥</span> Secure Data
                      </button>
                      <button onClick={() => setConfirmAction({ msg: "Wipe session data from grid?", action: handleDestroyQuiz })} disabled={actionLoading} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-slate-300 disabled:opacity-50 active:scale-95 border border-slate-700 hover:border-slate-500 transition-transform duration-75">
                        Wipe Grid
                      </button>
                    </div>
                  </div>
                )}
              </div>

            ) : (
              <>
                {/* IDLE / POLL VIEW */}
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-800/50">
                  <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                    {viewMode === "poll" ? <><span className="text-blue-500">📊</span> Live Analytics</> : <><span className="text-purple-500">💬</span> Audience Comms</>}
                  </h2>
                  {currentPoll && <button onClick={() => setConfirmAction({ msg: "Halt incoming data?", action: endPoll })} disabled={actionLoading} className="text-xs bg-red-950/50 text-red-400 font-bold border border-red-900/80 px-4 py-2 rounded-full hover:bg-red-900/60 flex items-center gap-2 active:scale-95 shadow-sm transition-transform duration-75"><span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" /> Halt Stream</button>}
                </div>

                {viewMode === "poll" && (
                  !currentPoll ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-900/20 rounded-3xl border border-slate-800/30 border-dashed m-4">
                      <div className="w-20 h-20 mb-6 bg-slate-800/50 rounded-full flex items-center justify-center shadow-inner border border-slate-700/50"><span className="text-4xl grayscale opacity-40">📡</span></div>
                      <p className="font-bold tracking-widest uppercase text-sm mb-6">Telemetry Offline</p>
                      <button onClick={() => setShowPollForm(true)} className="px-8 py-3 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white font-bold rounded-full border border-blue-500/30 shadow-sm active:scale-95 transition-transform duration-75">Deploy Tracker</button>
                    </div>
                  ) : (
                    <div className="space-y-10 w-full max-w-3xl mx-auto">
                      <h3 className="text-4xl font-black text-center leading-tight drop-shadow-md text-white">{currentPoll.question}</h3>
                      {currentPoll.type === "multiple_choice" && (
                        <div className="space-y-6 w-full">
                          {currentPoll.options?.map((opt: { label: string }, idx: number) => {
                            const count = pollResults?.[opt.label] ?? 0;
                            const pct = totalPollVotes > 0 ? (count / totalPollVotes) * 100 : 0;
                            return (
                              <div key={idx} className="relative group">
                                <div className="flex justify-between items-end text-lg font-bold mb-2 px-2">
                                  <span className="text-slate-200">{opt.label}</span>
                                  <div className="flex items-center gap-4">
                                    <span className="text-slate-500 font-mono text-sm">{Math.round(pct)}%</span>
                                    <span className="font-black text-blue-400 text-xl drop-shadow-sm">{count}</span>
                                  </div>
                                </div>
                                <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                                  <div className="h-full bg-linear-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {currentPoll.type === "rating" && (
                        <div className="flex flex-col items-center justify-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
                          <div className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-br from-yellow-300 to-amber-600 drop-shadow-lg tracking-tighter">{currentPoll.average ?? 0}</div>
                          <div className="flex gap-2 mt-8">{[1, 2, 3, 4, 5].map((star) => (<span key={star} className={`text-5xl ${star <= Math.round(currentPoll.average ?? 0) ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" : "text-slate-800"}`}>★</span>))}</div>
                        </div>
                      )}
                      {currentPoll.type === "word_cloud" && (
                        <div className="flex flex-wrap gap-5 justify-center items-center py-12 min-h-80 bg-slate-900/50 rounded-3xl border border-slate-800 px-6">
                          {(() => {
                            const words = pollResults && Object.keys(pollResults).length > 0 ? pollResults : currentPoll.words ?? {};
                            const entries = Object.entries(words);
                            if (entries.length === 0) return <span className="text-slate-600 font-bold uppercase tracking-widest text-sm animate-pulse">Awaiting Signal...</span>;
                            return entries.map(([word, count]) => (
                              <span key={word} className="text-blue-400 font-black" style={{ fontSize: `${Math.min(1.5 + (count as number) * 0.6, 6)}rem`, opacity: Math.min(0.4 + (count as number) * 0.15, 1) }}>{word}</span>
                            ));
                          })()}
                        </div>
                      )}
                      {currentPoll.type === "open_ended" && <TransientThoughts responses={currentPoll.responses ?? []} />}
                    </div>
                  )
                )}

                {viewMode === "qna" && (
                  <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-4 custom-scrollbar">
                    {questions.length === 0 && <div className="text-center py-20 text-slate-600 font-bold tracking-widest uppercase text-sm border border-dashed border-slate-800 rounded-3xl">Comms Channel Clear</div>}
                    {[...questions].sort((a, b) => b.votes - a.votes).map((q: Question) => (
                      <div key={q.id} className={`p-5 rounded-2xl border flex gap-5 ${q.visible !== false ? "bg-slate-900/80 border-slate-700" : "bg-slate-950/50 border-slate-800 opacity-40 grayscale"}`}>
                        <div className="flex flex-col items-center justify-center min-w-14 text-purple-400 bg-slate-950 rounded-xl p-3 h-fit border border-slate-800 shadow-inner">
                          <span className="text-xl font-black mb-1">▲</span>
                          <span className="text-sm font-mono font-bold">{q.votes}</span>
                        </div>
                        <div className="flex-1 flex items-center"><p className={`text-lg leading-relaxed ${q.visible !== false ? "text-slate-200 font-medium" : "text-slate-600 italic line-through"}`}>{q.text}</p></div>
                        <button onClick={() => handleToggleQuestion(q.id)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider h-fit self-center active:scale-95 transition-transform duration-75 ${q.visible !== false ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-purple-900/30 text-purple-400 border border-purple-500/30"}`}>{q.visible !== false ? "Mute" : "Restore"}</button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT PANEL — Authority Control Deck */}
          <div className="space-y-6 lg:col-span-4 h-full overflow-y-auto pr-2 pb-20 custom-scrollbar">
            
            {/* Control Matrix */}
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-700/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <h2 className="text-xs font-black text-slate-500 mb-5 uppercase tracking-[0.2em] flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Command Matrix</h2>
              
              {safeQuiz && (
                <div className="mb-6 p-5 bg-linear-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/40 rounded-2xl shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full mix-blend-screen" />
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <p className="text-[10px] text-blue-300 font-black uppercase tracking-widest">Protocol: {safeQuiz.state}</p>
                    {safeQuiz.state === "QUESTION" && <span className={`text-sm text-white font-mono font-bold px-2 py-0.5 rounded border ${isCritical ? 'bg-red-500 border-red-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-blue-950 border-blue-800'}`}>{timeLeft}s</span>}
                  </div>
                  <div className="flex flex-col gap-3 relative z-10">
                    {safeQuiz.state === "LOBBY" && <button onClick={handleAdvanceQuiz} className="p-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-95 transition-transform duration-75 border border-blue-400/50">Engage Protocol ▶</button>}
                    {safeQuiz.state === "LEADERBOARD" && <button onClick={handleAdvanceQuiz} className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-black text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] active:scale-95 transition-transform duration-75 border border-indigo-400/50">Next Target ➡</button>}
                    {safeQuiz.state !== "END" && <button onClick={() => setConfirmAction({ msg: "Force immediate resolution?", action: handleJumpToLeaderboard })} className="p-3 bg-slate-950/50 hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 active:scale-95 transition-transform duration-75 hover:text-white">Force Resolution ⚡</button>}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => { setShowPollForm(true); setViewMode("poll"); }} className="p-5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-left flex justify-between items-center active:scale-[0.98] transition-transform duration-75 border border-slate-700/50 hover:border-blue-500/50">
                  <span className="tracking-wide">Deploy Analytics</span>
                  <span className="text-blue-400 text-xl">📡</span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setShowQuizCreator(true)} className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-75 border border-slate-700/50 hover:border-yellow-500/50">
                    <span className="text-2xl">🏆</span><span className="text-[10px] uppercase tracking-widest">Studio</span>
                  </button>
                  <button onClick={() => setShowAIModal(true)} className="p-4 bg-linear-to-br from-purple-900/40 to-pink-900/20 hover:from-purple-800/60 hover:to-pink-800/40 text-purple-200 hover:text-white font-bold rounded-2xl flex flex-col items-center justify-center gap-2 border border-purple-500/30 active:scale-[0.98] transition-transform duration-75">
                    <span className="text-2xl">✨</span><span className="text-[10px] uppercase tracking-widest">AI Gen</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button onClick={() => setShowWheel(true)} className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 hover:border-slate-600 rounded-xl text-center text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform duration-75 hover:text-white">Spin 🎲</button>
                  <button onClick={() => setShowMap(true)} className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 hover:border-slate-600 rounded-xl text-center text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform duration-75 hover:text-white">Map 🌍</button>
                </div>
                
                <div className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent my-3 opacity-50" />
                
                <button onClick={() => setViewMode(viewMode === "qna" ? "poll" : "qna")} className={`p-4 font-bold rounded-2xl text-left flex justify-between items-center text-sm border active:scale-[0.98] transition-transform duration-75 ${viewMode === "qna" ? "bg-purple-900/20 text-white border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]" : "bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-700/50"}`}>
                  <span className="tracking-wide">Comms Log</span>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${viewMode === "qna" ? "bg-purple-600 text-white" : "bg-slate-950 border border-slate-700"}`}>{questions.length}</span>
                </button>
                <div className="flex gap-2">
                   <button onClick={handleExport} className="flex-1 p-3 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 hover:border-slate-600 rounded-xl text-center text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform duration-75 hover:text-white">CSV 📥</button>
                   <button onClick={() => setShowSettings(true)} className="flex-1 p-3 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 hover:border-slate-600 rounded-xl text-center text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform duration-75 hover:text-white">Config ⚙️</button>
                </div>
              </div>
            </div>

            {/* AI Insights Engine */}
            <div className="space-y-3">
              <button onClick={handleAiAnalyze} disabled={analyzing} className="w-full p-5 bg-linear-to-r from-indigo-900/60 to-purple-900/40 hover:from-indigo-800/80 text-white font-bold rounded-3xl border border-indigo-500/40 flex justify-between items-center shadow-[0_10px_30px_rgba(79,70,229,0.15)] active:scale-[0.98] transition-transform duration-75 disabled:opacity-50">
                <div className="flex flex-col text-left">
                  <span className="text-sm tracking-wide font-black drop-shadow-sm">Analyze Telemetry</span>
                  <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1">Gemini AI Core</span>
                </div>
                <span className={`text-2xl drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] ${analyzing ? "animate-spin" : ""}`}>{analyzing ? "⚙️" : "🔮"}</span>
              </button>
              {aiSummary && (
                <div className="p-5 bg-slate-900/90 rounded-2xl border border-purple-500/50 shadow-[0_10px_40px_rgba(168,85,247,0.15)] backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-purple-400 to-indigo-500" />
                  <div className="flex items-center gap-3 mb-3 ml-2">
                    <span className="text-xl drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">🤖</span>
                    <h3 className="text-purple-300 text-[10px] font-black uppercase tracking-[0.2em]">Core Analysis</h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed font-medium ml-2 relative z-10">&ldquo;{aiSummary}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Participants Grid */}
            <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-700/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <h2 className="text-xs font-black text-slate-500 flex justify-between items-center mb-4 uppercase tracking-widest">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Connected Nodes</div>
                <span className="bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-white text-[10px]">{participants.length}</span>
              </h2>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                {participants.length === 0 && <p className="text-slate-600 text-xs font-bold uppercase tracking-widest text-center py-6 border border-dashed border-slate-800 rounded-xl">No active connections</p>}
                {participants.map((p) => (
                  <div key={p.id} className="flex justify-between items-center bg-slate-950/50 p-2.5 rounded-xl group border border-slate-800/80 hover:border-red-500/30 hover:bg-slate-900">
                    <span className="text-xs text-slate-300 font-bold truncate max-w-[70%] tracking-wide">{p.name}</span>
                    <button onClick={() => handleBanUser(p.name)} className="text-[9px] bg-red-950/80 text-red-400 border border-red-900/50 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-900 hover:text-white font-black uppercase tracking-wider active:scale-95 transition-transform duration-75 shadow-sm">Eject</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      )}

      {/* MODALS */}
      {showWheel && <WinningWheel participants={participants.map((p) => p.name)} onClose={() => setShowWheel(false)} />}
      {showPollForm && <CreatePollForm sessionCode={code} onClose={() => setShowPollForm(false)} />}
      {showQuizCreator && <QuizCreator sessionCode={code} onClose={() => setShowQuizCreator(false)} />}
      {showAIModal && <AIQuizCreator sessionCode={code} onClose={() => setShowAIModal(false)} onSuccess={handleQuizCreated} />}
      
      {showMap && (
        <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center z-50 p-4 backdrop-blur-xl">
          <div className="w-full max-w-6xl h-[85vh] bg-slate-900 rounded-4xl flex flex-col overflow-hidden border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight">🌍 Global Grid<span className="text-[10px] font-bold text-blue-400 bg-blue-950/50 px-3 py-1 rounded-full border border-blue-900 uppercase tracking-widest">Live</span></h2>
              <button onClick={() => setShowMap(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform duration-75">✕ Close</button>
            </div>
            <div className="flex-1 bg-black relative"><MagicMap /></div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center p-4 z-50 backdrop-blur-xl">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-4xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <h2 className="text-2xl font-black mb-8 text-white tracking-tight">⚙️ System Config</h2>
            <div className="space-y-8">
              <div>
                <label htmlFor="logo-url" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Custom Interface Identity</label>
                <input id="logo-url" type="text" value={tempLogo} onChange={(e) => setTempLogo(e.target.value)} placeholder="https://example.com/logo.png" className="w-full bg-slate-950 border border-slate-700 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-slate-700 text-white font-medium shadow-inner" />
              </div>
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
                <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3 block">Iframe Integration URL</label>
                <div className="flex gap-2">
                  <input readOnly aria-label="Embed Code URL" value={typeof window !== "undefined" ? `${window.location.origin}/embed/presenter/${code}?transparent=true` : ""} className="flex-1 bg-slate-900 border border-slate-700 p-3 rounded-xl text-xs text-slate-400 font-mono select-all focus:outline-none" />
                  <button onClick={() => { const url = `${window.location.origin}/embed/presenter/${code}?transparent=true`; navigator.clipboard.writeText(`<iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>`); }} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-transform duration-75 shadow-md shadow-blue-500/20">Copy</button>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowSettings(false)} className="flex-1 py-4 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 rounded-xl font-bold text-sm active:scale-95 transition-transform duration-75 border border-slate-800">Cancel</button>
                <button onClick={saveSettings} className="flex-1 py-4 bg-white hover:bg-slate-200 text-slate-900 font-black rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 transition-transform duration-75 text-sm uppercase tracking-wider">Save Config</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center p-4 backdrop-blur-xl z-60">
          <div className="bg-slate-900 border border-red-500/30 p-8 rounded-4xl w-full max-w-sm shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center">
            <div className="w-16 h-16 bg-red-950/50 text-red-500 text-3xl rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30 shadow-inner">⚠️</div>
            <h3 className="text-xl font-black text-white mb-8 tracking-tight">{confirmAction.msg}</h3>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-3 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 rounded-xl font-bold text-sm active:scale-95 transition-transform duration-75 border border-slate-800">Abort</button>
              <button onClick={async () => { await confirmAction.action(); setConfirmAction(null); }} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95 transition-transform duration-75 border border-red-400/50">Execute</button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-6 z-50">
        <button onClick={() => setShowDebug(!showDebug)} className="bg-slate-900/80 hover:bg-red-600 text-slate-500 hover:text-white text-xs w-10 h-10 flex items-center justify-center rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.5)] backdrop-blur-md active:scale-95 transition-transform duration-75 border border-slate-700/50 hover:border-red-500 cursor-pointer">🐞</button>
      </div>
      {showDebug && (
        <div className="fixed inset-0 bg-black/95 z-70 p-10 overflow-auto font-mono text-xs text-green-400 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8 border-b border-green-900/50 pb-6">
              <h2 className="text-2xl text-green-500 font-black tracking-widest uppercase flex items-center gap-3"><span className="animate-pulse">🟢</span> System Telemetry</h2>
              <button onClick={() => setShowDebug(false)} className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 px-6 py-2 rounded-full font-black uppercase tracking-widest hover:text-white shadow-md active:scale-95 transition-transform duration-75">Terminate View</button>
            </div>
            <pre className="whitespace-pre-wrap break-all p-6 bg-slate-950/50 rounded-2xl border border-green-900/30 shadow-inner leading-relaxed">
              {debugPayload}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}