"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { useSessionStore } from "@/store/sessionStore";
import { useRealtime } from "@/hooks/useRealtime";

// ---------------------------------------------------------------------------
// CONFIG & STORAGE
// ---------------------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

const safeStorage = {
  get: (key: string): string | null => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set: (key: string, value: string): void => {
    try { localStorage.setItem(key, value); } catch { /* silent */ }
  },
};

// ---------------------------------------------------------------------------
// STRICT SCHEMAS & TYPES
// ---------------------------------------------------------------------------

interface QuizOption {
  label: string;
  isCorrect?: boolean;
}

interface QuizQuestion {
  id?: string; 
  text?: string;
  question?: string; 
  time_limit?: number; 
  options?: string[] | QuizOption[];
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

type PollType = "multiple_choice" | "word_cloud" | "open_ended" | "rating";
const VALID_POLL_TYPES = new Set(["multiple_choice", "word_cloud", "open_ended", "rating"]);

interface ActivePoll {
  id: string; 
  question: string;
  type: PollType;
  state?: string;
  status?: string;
  options?: { label: string }[];
  average?: number;
  words?: Record<string, number>;
  responses?: string[];
}

// ---------------------------------------------------------------------------
// CUSTOM HOOK: useServerSyncedTimer
// ---------------------------------------------------------------------------

function useServerSyncedTimer(
  isActive: boolean,
  startedAt: number | undefined,
  duration: number,
  onTimeUp: () => void,
  isLocked: boolean,
  timeOffset: number
): number {
  const [timeLeft, setTimeLeft] = useState(0);
  const onTimeUpRef = useRef(onTimeUp);
  const isLockedRef = useRef(isLocked);
  const offsetRef = useRef(timeOffset);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { onTimeUpRef.current = onTimeUp; }, [onTimeUp]);
  useEffect(() => { isLockedRef.current = isLocked; }, [isLocked]);
  useEffect(() => { offsetRef.current = timeOffset; }, [timeOffset]);

  useEffect(() => {
    if (!isActive || duration <= 0 || startedAt == null) {
      const timeoutId = setTimeout(() => setTimeLeft(startedAt != null ? 0 : duration), 0);
      return () => clearTimeout(timeoutId);
    }

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
  }, [isActive, startedAt, duration]);

  return timeLeft;
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    params.then((p) => {
      if (mounted) setResolvedParams(p);
    });
    return () => { mounted = false; };
  }, [params]);

  const code = resolvedParams?.code ?? "";

  // -------------------------------------------------------------------------
  // UI STATE
  // -------------------------------------------------------------------------
  const [guestName,       setGuestName]      = useState("");
  const [isJoining,       setIsJoining]      = useState(false);
  const [activeTab,       setActiveTab]      = useState<"activity" | "qna">("activity");
  
  // Voting State
  const [hasVoted,           setHasVoted]           = useState(false);
  const [selectedQuizIndex,  setSelectedQuizIndex]  = useState<number | null>(null);
  const [selectedPollValue,  setSelectedPollValue]  = useState<string | null>(null);
  const [selectedRating,     setSelectedRating]     = useState<number | null>(null);
  const [pollAnswer,         setPollAnswer]         = useState("");
  const [questionText,       setQuestionText]       = useState("");

  // Lifecycle States
  const [isVoting,                setIsVoting]               = useState(false);
  const [isAskingQ,               setIsAskingQ]              = useState(false);
  const [sessionEnded,            setSessionEnded]           = useState(false);
  const [isKicked,                setIsKicked]               = useState(false); // 🛡️ NEW: Ejection State
  const [localTimeExpired,        setLocalTimeExpired]       = useState(false);
  const [isRestoringLocalState,   setIsRestoringLocalState]  = useState(false);
  const [transmissionError,       setTransmissionError]      = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // ARCHITECTURE REFS
  // -------------------------------------------------------------------------
  const currentVersion = useRef<number>(0);
  const isSubmittingRef = useRef<boolean>(false);
  const hasJoinedProperly = useRef<boolean>(false); // 🛡️ NEW: Tracks if we were ever successfully in the room
  const fetchAbortController = useRef<AbortController | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [serverTimeOffset, setServerTimeOffset] = useState<number>(0);

  useEffect(() => {
    return () => fetchAbortController.current?.abort();
  }, []);

  const triggerError = useCallback((msg: string) => {
    setTransmissionError(msg);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setTransmissionError(null), 3500);
  }, []);

  // -------------------------------------------------------------------------
  // STORE
  // -------------------------------------------------------------------------
  useRealtime(code, "participant");

  const {
    user, isConnected, participants, // 🛡️ NEW: Extracted participants array
    currentPoll, pollResults, questions, quiz, quizScores, branding,
    setUser, setToken, setQuiz, setPoll, setQuestions, setPollResults
  } = useSessionStore();

  // -------------------------------------------------------------------------
  // 🛡️ EJECTION OBSERVER (Instant Ban Execution)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!user || !participants || participants.length === 0) return;
    
    // Check if the server still recognizes our ID in the live grid
    const amIHere = participants.some((p: { id: string }) => p.id === user.id);
    
    if (amIHere) {
      hasJoinedProperly.current = true;
    } else if (hasJoinedProperly.current && !amIHere) {
      // If we were in the room, but now we aren't, the presenter ejected us.
      setIsKicked(true);
    }
  }, [participants, user]);


  const safeQuiz = quiz as SafeQuiz | null;
  
  const safePoll = useMemo(() => {
    const p = currentPoll as ActivePoll | null;
    if (p && !VALID_POLL_TYPES.has(p.type)) {
      console.error(`System Interface Ignored: Invalid poll type '${p.type}' received from server.`);
      return null;
    }
    return p;
  }, [currentPoll]);

  // -------------------------------------------------------------------------
  // DERIVED VALUES
  // -------------------------------------------------------------------------
  const safeQuizQuestion = useMemo(() => {
    if (!safeQuiz?.questions?.length) return null;
    const q = safeQuiz.questions[safeQuiz.current_index];
    if (!q) return null;
    
    const opts = q.options ?? q.answers;
    if (!Array.isArray(opts)) return null;

    return {
      id: q.id,
      text: q.text ?? q.question ?? "Loading...",
      options: opts,
      time_limit: q.time_limit ?? 30,
    };
  }, [safeQuiz]);

  const totalPollVotes = useMemo(() => {
    if (!pollResults) return 0;
    return Object.values(pollResults).reduce((acc, curr) => acc + (curr as number), 0);
  }, [pollResults]);

  const hasPollResults = Boolean(pollResults && Object.keys(pollResults).length > 0);
  const isPollClosed = Boolean(safePoll?.state === "CLOSED" || safePoll?.status === "CLOSED" || hasPollResults);
  
  const myScore = quizScores?.[user?.email ?? ""] ?? 0;
  
  const visibleQuestions = useMemo(() => questions.filter((q) => q.visible !== false), [questions]);

  useEffect(() => {
    setLocalTimeExpired(false);
  }, [safeQuiz?.current_index]);

  // -------------------------------------------------------------------------
  // API & STATE SYNC
  // -------------------------------------------------------------------------
  const applyStatePayload = useCallback((data: unknown) => {
    if (!data || typeof data !== 'object') return;
    const safeData = data as Record<string, unknown>;

    // EMA Clock Skew
    if (typeof safeData.server_now === 'number') {
      const newOffset = safeData.server_now - Date.now();
      setServerTimeOffset(prev => {
        if (prev === 0) return newOffset;
        if (Math.abs(prev - newOffset) > 60000) return newOffset; 
        return Math.floor(prev * 0.8 + newOffset * 0.2);
      });
    }

    const quizRecord = safeData.quiz as { version?: number } | undefined;
    const rawVersion = safeData.version ?? quizRecord?.version;
    
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
    if ('poll_results' in safeData && setPollResults) setPollResults(safeData.poll_results as Record<string, number>);
  }, [setQuiz, setPoll, setQuestions, setPollResults]);

  const syncState = useCallback(async (force = false) => {
    if (!force && isSubmittingRef.current) return;
    
    if (fetchAbortController.current) {
      fetchAbortController.current.abort();
    }
    fetchAbortController.current = new AbortController();

    try {
      if (!code) return;
      const res = await fetch(`${API_URL}/api/session/${code}/state`, {
        signal: fetchAbortController.current.signal
      });
      
      if (!res.ok) throw new Error(JSON.stringify({ status: res.status, message: await res.text() }));
      const data = await res.json();

      // 🛡️ FALLBACK KICK GUARD: In case the WebSocket missed the ban message
      if (user && data.participants) {
        const amIHere = data.participants.some((p: { id: string }) => p.id === user.id);
        if (hasJoinedProperly.current && !amIHere) {
          setIsKicked(true);
        }
      }

      applyStatePayload(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.name === 'AbortError') return; 
        try {
          const errData = JSON.parse(e.message);
          if (errData.status === 404) setSessionEnded(true); 
        } catch { /* ignore */ }
      }
    }
  }, [code, user, applyStatePayload]);

  useEffect(() => {
    if (!code || !user || sessionEnded || isKicked) return;
    const ms = isConnected ? 30_000 : 3_000;
    const id = setInterval(() => syncState(false), ms);
    const onFocus = () => syncState(true);
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(id); window.removeEventListener("focus", onFocus); };
  }, [code, user, isConnected, sessionEnded, isKicked, syncState]);

  // -------------------------------------------------------------------------
  // TIMER COMPUTATION
  // -------------------------------------------------------------------------
  const handleTimeUp = useCallback(() => {
    setLocalTimeExpired(true);
  }, []);

  const isTimerActive = Boolean(safeQuiz?.state === "QUESTION");
  const timerDuration = safeQuizQuestion?.time_limit ?? 0;
  const timerStartedAt = safeQuiz?.question_started_at; 

  const timeLeft = useServerSyncedTimer(
    isTimerActive, 
    timerStartedAt, 
    timerDuration, 
    handleTimeUp, 
    Boolean(isVoting || isSubmittingRef.current), 
    serverTimeOffset
  );

  const progressPercent = useMemo(() => {
    if (!safeQuizQuestion || (safeQuizQuestion.time_limit ?? 0) <= 0) return 0;
    return Math.max(0, Math.min(100, (timeLeft / (safeQuizQuestion.time_limit ?? 30)) * 100));
  }, [timeLeft, safeQuizQuestion]);

  const isCritical = Boolean(safeQuiz?.state === "QUESTION" && !localTimeExpired && timeLeft > 0 && timeLeft <= 5);

  // -------------------------------------------------------------------------
  // DETERMINISTIC PERSISTENCE ENGINE
  // -------------------------------------------------------------------------
  const getActivityKey = useCallback(() => {
    if (safePoll) {
      if (!safePoll.id) {
        if (process.env.NODE_ENV === 'development') throw new Error("System Integrity Fault: poll.id is mandatory.");
        return null; 
      }
      return `poll_${code}_${safePoll.id}`;
    } 
    
    if (safeQuiz) {
      let qFingerprint = safeQuizQuestion?.id;
      if (!qFingerprint && safeQuizQuestion?.text) {
        try {
          qFingerprint = typeof window !== 'undefined' 
            ? btoa(encodeURIComponent(safeQuizQuestion.text)).substring(0, 32) 
            : "q";
        } catch { /* fallback */ }
      }
      return `quiz_${code}_idx${safeQuiz.current_index}_${qFingerprint || "q"}`;
    }
    
    return null;
  }, [code, safePoll, safeQuiz, safeQuizQuestion]);

  useEffect(() => {
    const activityKey = getActivityKey();

    if (activityKey) {
      setIsRestoringLocalState(true);
      const alreadyVoted = safeStorage.get(activityKey);
      
      if (alreadyVoted) {
        setHasVoted(true);
        const savedOpt = safeStorage.get(activityKey + "_opt");
        if (savedOpt !== null) {
          const numVal = Number(savedOpt);
          const isNum = !Number.isNaN(numVal);
          
          if (safePoll?.type === 'rating' && isNum) setSelectedRating(numVal);
          else if (safePoll) setSelectedPollValue(savedOpt);
          else if (safeQuiz && isNum) setSelectedQuizIndex(numVal);
        }
      } else {
        setHasVoted(false);
        setSelectedQuizIndex(null);
        setSelectedPollValue(null);
        setSelectedRating(null);
        setPollAnswer("");
      }
      setIsRestoringLocalState(false);
    } else {
      setHasVoted(false);
    }
  }, [getActivityKey, safePoll, safeQuiz]);

  const markAsVoted = (type: 'quiz' | 'poll' | 'rating', savedVal?: string | number) => {
    const activityKey = getActivityKey();

    if (activityKey) {
      safeStorage.set(activityKey, "true");
      if (savedVal !== undefined) {
        safeStorage.set(activityKey + "_opt", String(savedVal));
      }
    }
    
    setHasVoted(true);
    if (savedVal !== undefined) {
      if (type === 'quiz') setSelectedQuizIndex(savedVal as number);
      if (type === 'poll') setSelectedPollValue(String(savedVal));
      if (type === 'rating') setSelectedRating(savedVal as number);
    }
  };

  // -------------------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------------------
  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || isJoining) return;
    setIsJoining(true);
    try {
      const res = await fetch(`${API_URL}/api/session/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.id) throw new Error("Server failed to assign identity block.");
        setUser({ id: data.id, email: data.name ?? data.email ?? guestName });
        setToken(data.token ?? "guest-token");
      } else {
        alert("Session inaccessible. Please verify the code.");
      }
    } catch {
      alert("Network error. Please check your connection.");
    } finally {
      setIsJoining(false);
    }
  };

  const handlePollVote = async (value: string | number, isRating = false) => {
    if (isSubmittingRef.current || hasVoted || isVoting || isRestoringLocalState || isPollClosed) return;
    
    isSubmittingRef.current = true;
    setIsVoting(true);
    setTransmissionError(null);
    
    if (isRating) setSelectedRating(value as number);
    else setSelectedPollValue(String(value));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); 

    try {
      const res = await fetch(`${API_URL}/api/session/${code}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, user_id: user?.id }), 
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (res.ok) {
        markAsVoted(isRating ? 'rating' : 'poll', value);
      } else if (res.status === 409) {
        await syncState(true); 
      } else {
        throw new Error("Server rejected transmission");
      }
    } catch (e: unknown) {
      clearTimeout(timeoutId);
      if (isRating) setSelectedRating(null);
      else setSelectedPollValue(null);
      
      if (e instanceof Error && e.name === 'AbortError') {
        triggerError("Network Timeout. Protocol unlocked.");
      } else {
        triggerError("Transmission Failed. Please try again.");
      }
    } finally {
      setIsVoting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleQuizAnswer = async (index: number) => {
    if (isSubmittingRef.current || hasVoted || isVoting || !user || localTimeExpired || isRestoringLocalState) return;
    
    isSubmittingRef.current = true;
    setIsVoting(true);
    setTransmissionError(null);
    setSelectedQuizIndex(index); 
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); 

    try {
      const res = await fetch(`${API_URL}/api/session/${code}/quiz/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id, 
          user_name: user.email || "Anonymous", 
          option_index: index,
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (res.ok) {
        markAsVoted('quiz', index);
      } else if (res.status === 409) {
        await syncState(true); 
      } else {
        throw new Error("Server rejected transmission");
      }
    } catch (e: unknown) {
      clearTimeout(timeoutId);
      setSelectedQuizIndex(null);
      
      if (e instanceof Error && e.name === 'AbortError') {
        triggerError("Network Timeout. Protocol unlocked.");
      } else {
        triggerError("Transmission Failed. Please try again.");
      }
    } finally {
      setIsVoting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || isAskingQ || isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    setIsAskingQ(true);
    try {
      const res = await fetch(`${API_URL}/api/session/${code}/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: questionText }),
      });
      if (res.ok) setQuestionText("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsAskingQ(false);
      isSubmittingRef.current = false;
    }
  };

  // -------------------------------------------------------------------------
  // RENDER: LOADING / FATAL STATES
  // -------------------------------------------------------------------------
  if (!resolvedParams) {
    return (
      <div className="min-h-dvh bg-slate-950 flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
      </div>
    );
  }

  // 🛡️ NEW EJECTION RENDER
  if (isKicked) {
    return (
      <div className="min-h-dvh bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-500">
        <div className="text-6xl mb-6 grayscale opacity-80 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">🚫</div>
        <h1 className="text-3xl font-black mb-2 text-red-500 tracking-tight">Access Revoked</h1>
        <p className="text-slate-400 font-medium max-w-xs">You have been ejected from the session grid by the host.</p>
      </div>
    );
  }

  if (sessionEnded) {
    return (
      <div className="min-h-dvh bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="text-6xl mb-6 grayscale opacity-50 drop-shadow-lg">🔌</div>
        <h1 className="text-3xl font-black mb-2 text-slate-300 tracking-tight">Transmission Terminated</h1>
        <p className="text-slate-500 font-medium max-w-xs">The host has concluded this event. You may safely disconnect.</p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // RENDER: JOIN FORM
  // -------------------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-dvh bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 p-8 rounded-4xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black mb-4 shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/30">
              FR
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Sync Link</h1>
            <p className="text-slate-400 text-sm font-medium">Establish your identity protocol.</p>
          </div>

          <form onSubmit={handleJoinSession} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">
                Display Alias
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-slate-950 border border-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 font-bold text-lg shadow-inner"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={Boolean(!guestName.trim() || isJoining)}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800/50 disabled:text-slate-600 disabled:border-slate-800 text-white font-black tracking-wide py-4 rounded-xl transition-transform duration-75 shadow-[0_5px_20px_rgba(37,99,235,0.3)] disabled:shadow-none flex justify-center items-center gap-2 active:scale-95 text-lg border border-blue-400/50"
            >
              {isJoining ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Enter Grid 🚀"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // RENDER: MAIN VIEW
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-dvh bg-slate-950 text-white font-sans flex flex-col pb-28">

      {/* FLOATING ERROR TOAST */}
      {transmissionError && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-sm text-center p-3 bg-red-950/90 text-red-400 font-bold rounded-xl border border-red-500/50 shadow-[0_10px_40px_rgba(239,68,68,0.4)] text-xs tracking-wider uppercase backdrop-blur-md animate-in slide-in-from-top-4 fade-in">
          {transmissionError}
        </div>
      )}

      {/* HEADER */}
      <header className="px-5 py-4 border-b border-slate-800/80 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-3">
          {branding?.logo_url ? (
            <Image src={branding.logo_url} alt="Logo" width={32} height={32} className="rounded-lg shadow-sm" />
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-xs shadow-[0_0_10px_rgba(37,99,235,0.4)]">FR</div>
          )}
          <span className="font-black tracking-tight hidden sm:block">FlexiRush</span>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full transition-colors duration-150 ${isConnected ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-red-500 shadow-[0_0_10px_#ef4444]"}`} />
          <span className="font-mono bg-slate-900 px-3 py-1.5 rounded-lg text-xs border border-slate-700 font-bold tracking-widest shadow-inner">{code}</span>
          <span className="text-xs font-bold text-slate-400 hidden sm:block truncate max-w-25">{user.email}</span>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col p-5 max-w-md mx-auto w-full">

        {/* TAB: ACTIVITY */}
        {activeTab === "activity" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 w-full">

            {/* SCENARIO 1: QUIZ ACTIVE */}
            {safeQuiz && safeQuiz.state !== "END" && (
              <div className="w-full">
                <div className="text-center mb-8">
                  <span className={`text-[10px] font-black px-4 py-2 rounded-full border uppercase tracking-[0.2em] shadow-sm transition-colors duration-150 ${isCritical ? 'bg-red-950/40 text-red-400 border-red-500/50' : 'bg-slate-900 text-slate-300 border-slate-700/80'}`}>
                    {safeQuiz.state === "LOBBY" ? "Standby Protocol" : `Phase ${safeQuiz.current_index + 1}`}
                  </span>
                </div>

                {/* LOBBY */}
                {safeQuiz.state === "LOBBY" && (
                  <div className="text-center py-16 animate-in zoom-in-95 duration-500">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-b from-blue-300 to-indigo-500 mb-6 drop-shadow-sm tracking-tight">
                      Standby
                    </h1>
                    <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">Awaiting Host Telemetry</p>
                    <div className="mt-12 text-7xl animate-bounce drop-shadow-2xl">🚀</div>
                  </div>
                )}

                {/* QUESTION */}
                {safeQuiz.state === "QUESTION" && (
                  safeQuizQuestion ? (
                    <div key={safeQuiz.current_index} className={`space-y-8 animate-in fade-in duration-300 transition-all ${isCritical ? 'scale-[1.02] drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'scale-100'}`}>
                      <h2 className={`text-2xl sm:text-3xl font-black text-center leading-tight drop-shadow-md tracking-tight transition-colors duration-150 ${isCritical ? 'text-red-400' : 'text-white'}`}>
                        {safeQuizQuestion.text}
                      </h2>

                      {/* Hardware-Grade Fuse Timer */}
                      <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden w-full border border-slate-800 shadow-inner relative">
                        <div
                          className={`h-full origin-left transition-all duration-500 ease-linear w-(--val) ${isCritical ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]" : "bg-linear-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.8)]"}`}
                          style={{ "--val": `${progressPercent}%` } as React.CSSProperties}
                        />
                      </div>

                      {/* Options */}
                      <div className="grid gap-4">
                        {safeQuizQuestion.options.map((opt: unknown, i: number) => {
                          const isSelected = selectedQuizIndex === i;
                          const voted = hasVoted;
                          const labelStr = typeof opt === "string" ? opt : (opt as {label: string}).label;
                          return (
                            <button
                              key={i}
                              disabled={Boolean(voted || isVoting || isSubmittingRef.current || localTimeExpired || isRestoringLocalState)}
                              onClick={() => handleQuizAnswer(i)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleQuizAnswer(i);
                                }
                              }}
                              className={`p-6 rounded-2xl text-lg font-bold transition-all duration-75 active:scale-95 flex items-center gap-5 text-left border-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                                ${voted
                                  ? isSelected
                                    ? "bg-blue-600/90 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                    : "bg-slate-900/50 border-slate-800 text-slate-600 opacity-50 grayscale"
                                  : localTimeExpired
                                    ? "bg-slate-900/50 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed"
                                    : isCritical 
                                      ? "bg-red-950/20 border-red-500/30 text-slate-200 hover:border-red-400" 
                                      : "bg-slate-900/80 border-slate-700 hover:border-blue-500/50 text-slate-200 shadow-lg"
                                }`}
                            >
                              <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-inner transition-colors ${voted && isSelected ? "bg-white/20" : "bg-slate-950 border border-slate-800"}`}>
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className="leading-snug">{labelStr}</span>
                            </button>
                          );
                        })}
                      </div>

                      {hasVoted ? (
                        <div className="text-center p-4 bg-green-950/40 text-green-400 font-black rounded-2xl border border-green-500/30 animate-in slide-in-from-bottom-2 fade-in shadow-[0_0_15px_rgba(34,197,94,0.15)] uppercase tracking-widest text-xs">
                          Signal Locked 🔒
                        </div>
                      ) : localTimeExpired ? (
                         <div className="text-center p-4 bg-red-950/40 text-red-400 font-black rounded-2xl border border-red-500/30 animate-in slide-in-from-bottom-2 fade-in shadow-[0_0_15px_rgba(239,68,68,0.15)] uppercase tracking-widest text-xs">
                          Time Expired ⏱
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="text-center py-20 animate-pulse">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                      <p className="font-black text-slate-500 uppercase tracking-[0.2em] text-xs">Decoding Matrix...</p>
                    </div>
                  )
                )}

                {/* LEADERBOARD */}
                {safeQuiz.state === "LEADERBOARD" && (
                  <div className="text-center py-12 space-y-10 animate-in zoom-in-95 duration-500">
                    <h2 className="text-5xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)] tracking-tighter">
                      Phase Complete
                    </h2>
                    <div className="bg-slate-900/80 p-10 rounded-4xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                      <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] mb-4 font-black">Current Telemetry</p>
                      <p className="text-7xl font-mono font-black text-white tracking-tighter drop-shadow-md">{myScore}</p>
                      <p className="text-blue-500 font-bold text-xs mt-3 uppercase tracking-widest">Points</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SCENARIO 2: QUIZ ENDED */}
            {safeQuiz && safeQuiz.state === "END" && (
              <div className="text-center py-12 space-y-10 animate-in zoom-in-95 duration-700">
                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-yellow-300 to-yellow-600 drop-shadow-lg tracking-tighter">
                  VICTORY
                </h1>
                <div className="bg-slate-900/80 p-10 rounded-4xl border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.15)] relative overflow-hidden">
                  <p className="text-yellow-500/80 text-[10px] uppercase tracking-[0.3em] mb-4 font-black">Final Telemetry</p>
                  <p className="text-7xl font-mono font-black text-white tracking-tighter drop-shadow-md">{myScore}</p>
                  <p className="text-yellow-600 font-bold text-xs mt-3 uppercase tracking-widest">Points</p>
                </div>
                <p className="text-slate-400 font-bold tracking-wide">Event Concluded 🎉</p>
              </div>
            )}

            {/* SCENARIO 3: POLL */}
            {!safeQuiz && safePoll && (
              <div key={safePoll.id || safePoll.question} className="w-full space-y-10 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center">
                  <span className={`text-[10px] font-black px-4 py-2 rounded-full border uppercase tracking-[0.2em] shadow-sm ${isPollClosed ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-900 text-slate-300 border-slate-700/80'}`}>
                    {isPollClosed ? "Collection Concluded" : "Live Data Collection"}
                  </span>
                </div>
                <h2 className={`text-3xl font-black text-center leading-tight tracking-tight drop-shadow-sm ${isPollClosed ? 'text-slate-400' : 'text-white'}`}>
                  {safePoll.question}
                </h2>

                {/* Multiple Choice */}
                {safePoll.type === "multiple_choice" && (
                  <div className="grid gap-4">
                    {safePoll.options?.map((opt: { label: string }, i: number) => {
                      const isSelected = selectedPollValue === opt.label;
                      
                      if (hasVoted || isPollClosed) {
                         const count = pollResults?.[opt.label] ?? 0;
                         const pct = totalPollVotes > 0 ? (count / totalPollVotes) * 100 : 0;
                         return (
                          <div key={i} className="relative group animate-in slide-in-from-left-4 fade-in duration-500">
                            <div className={`flex justify-between items-end text-lg font-bold mb-2 px-2 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                              <span>{opt.label}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-slate-500 font-mono text-sm">{Math.round(pct)}%</span>
                                <span className={`font-black text-xl drop-shadow-sm ${isSelected ? 'text-blue-400' : 'text-slate-500'}`}>{count}</span>
                              </div>
                            </div>
                            <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                              <div className={`h-full rounded-full transition-all duration-1000 w-(--val) ease-out relative ${isSelected ? 'bg-linear-to-r from-blue-600 to-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-700'}`} style={{ "--val": `${pct}%` } as React.CSSProperties}>
                                {isSelected && <div className="absolute inset-0 bg-white/10 animate-[shimmer_2s_infinite]" />}
                              </div>
                            </div>
                          </div>
                         );
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handlePollVote(opt.label, false)}
                          disabled={Boolean(isVoting || isSubmittingRef.current || isRestoringLocalState)}
                          className="p-6 rounded-2xl font-bold text-left transition-transform duration-75 active:scale-95 border-2 shadow-lg bg-slate-900/80 border-slate-700 hover:border-blue-500 text-slate-200"
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Open Ended / Word Cloud */}
                {(safePoll.type === "word_cloud" || safePoll.type === "open_ended") && (
                  <div className="space-y-5">
                    <textarea
                      value={pollAnswer}
                      onChange={(e) => setPollAnswer(e.target.value)}
                      placeholder={isPollClosed ? "Collection Concluded" : "Transmit response..."}
                      className="w-full p-5 bg-slate-900/80 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder:text-slate-600 resize-none h-36 text-lg font-medium shadow-inner disabled:opacity-50 disabled:bg-slate-900/50"
                      disabled={Boolean(hasVoted || isSubmittingRef.current || isRestoringLocalState || isPollClosed)}
                    />
                    <button
                      onClick={() => handlePollVote(pollAnswer, false)}
                      disabled={Boolean(!pollAnswer.trim() || hasVoted || isVoting || isSubmittingRef.current || isRestoringLocalState || isPollClosed)}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800/50 disabled:text-slate-600 disabled:border-slate-800 text-white font-black tracking-wide rounded-xl transition-transform duration-75 shadow-[0_5px_20px_rgba(37,99,235,0.3)] disabled:shadow-none active:scale-95 border border-blue-400/50"
                    >
                      {hasVoted ? "Signal Locked ✅" : isVoting ? "Transmitting…" : isPollClosed ? "Channel Closed" : "Send Data"}
                    </button>
                  </div>
                )}

                {/* Rating */}
                {safePoll.type === "rating" && (
                  <div className="flex justify-center gap-3 py-12 bg-slate-900/40 rounded-4xl border border-slate-800/50">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isChosen = hasVoted && selectedRating === star;
                      return (
                        <button
                          key={star}
                          tabIndex={0}
                          onClick={() => handlePollVote(star, true)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handlePollVote(star, true);
                            }
                          }}
                          disabled={Boolean(hasVoted || isVoting || isSubmittingRef.current || isRestoringLocalState || isPollClosed)}
                          className={`text-5xl transition-all duration-75 active:scale-75 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full ${
                            hasVoted
                              ? isChosen
                                ? "text-yellow-400 scale-125 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
                                : "opacity-20 cursor-default grayscale"
                              : isPollClosed
                                ? "opacity-20 cursor-not-allowed grayscale"
                                : "cursor-pointer text-slate-700 hover:text-yellow-400 hover:scale-110"
                          }`}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                )}

                {hasVoted && safePoll.type !== "word_cloud" && safePoll.type !== "open_ended" && safePoll.type !== "multiple_choice" && (
                  <div className="text-center p-4 bg-green-950/40 text-green-400 font-black rounded-2xl border border-green-500/30 animate-in slide-in-from-bottom-2 fade-in shadow-[0_0_15px_rgba(34,197,94,0.15)] uppercase tracking-widest text-xs">
                    Signal Locked 🔒
                  </div>
                )}
              </div>
            )}

            {/* SCENARIO 4: WAITING */}
            {!safeQuiz && !safePoll && (
              <div className="text-center py-24 text-slate-500">
                <div className="w-24 h-24 mb-8 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto border border-slate-800 shadow-inner">
                  <span className="text-5xl grayscale opacity-30">📡</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Channel Open</h2>
                <p className="text-sm font-medium">Awaiting host telemetry...</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: Q&A */}
        {activeTab === "qna" && (
          <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-150">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Comms Channel</h2>
              <p className="text-slate-400 text-sm font-medium">Transmit inquiries directly to the host.</p>
            </div>

            <form onSubmit={handleAskQuestion} className="mb-8 relative">
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Initialize transmission..."
                className="w-full bg-slate-900/80 border border-slate-700 p-5 rounded-2xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none h-32 mb-4 text-base shadow-inner placeholder:text-slate-600 font-medium"
              />
              <button
                type="submit"
                disabled={Boolean(!questionText.trim() || isAskingQ || isSubmittingRef.current)}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800/50 disabled:text-slate-600 disabled:border-slate-800 text-white font-black tracking-wide rounded-xl transition-transform duration-75 shadow-[0_5px_20px_rgba(168,85,247,0.3)] disabled:shadow-none active:scale-95 border border-purple-400/50"
              >
                {isAskingQ ? "Transmitting…" : "Send Transmission 🚀"}
              </button>
            </form>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-5 border-b border-slate-800 pb-2">
                Active Log ({visibleQuestions.length})
              </h3>

              {visibleQuestions.length === 0 ? (
                <p className="text-slate-600 font-bold tracking-widest uppercase text-xs text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                  Log is Empty
                </p>
              ) : (
                <div className="space-y-4">
                  {visibleQuestions.map((q) => (
                    <div key={q.id} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800/80 shadow-sm flex flex-col gap-3">
                      <p className="text-slate-200 text-base font-medium leading-relaxed">{q.text}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 bg-purple-950/30 px-2 py-1 rounded text-xs font-black border border-purple-900/50">▲ {q.votes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM TAB BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 p-3 z-30 pb-safe">
        <div className="flex justify-center gap-3 max-w-md mx-auto">
          {(["activity", "qna"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-colors duration-75 flex flex-col items-center gap-1.5 active:scale-95 ${
                activeTab === tab
                  ? "bg-slate-800 text-white shadow-inner border border-slate-700"
                  : "text-slate-500 hover:bg-slate-900 hover:text-slate-400 border border-transparent"
              }`}
            >
              <span className={`text-xl drop-shadow-sm ${activeTab === tab && tab === 'activity' ? 'text-blue-400' : activeTab === tab && tab === 'qna' ? 'text-purple-400' : 'grayscale opacity-50'}`}>
                {tab === "activity" ? "📊" : "💬"}
              </span>
              {tab === "activity" ? "Telemetry" : "Comms"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}