"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore, Question } from "@/store/sessionStore";

// Derive the quiz state union locally so we don't depend on the store exporting it
type QuizState = "LOBBY" | "QUESTION" | "LEADERBOARD" | "END";
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
  question?: string; // legacy field alias
  time_limit: number; // required — use resolveQuestion() to supply the default
  options: string[] | QuizOption[];
  answers?: string[] | QuizOption[]; // legacy field alias
}

interface SafeQuiz {
  title: string;
  state: "LOBBY" | "QUESTION" | "LEADERBOARD" | "END";
  current_index: number;
  questions: QuizQuestion[];
  answers_count?: number;
}

// ---------------------------------------------------------------------------
// DYNAMIC IMPORTS
// ---------------------------------------------------------------------------

const ReactionOverlay  = dynamic(() => import("@/components/ReactionOverlay"),    { ssr: false });
const CreatePollForm   = dynamic(() => import("@/components/CreatePollForm"),      { ssr: false });
const WinningWheel     = dynamic(() => import("@/components/WinningWheel"),        { ssr: false });
const QuizCreator      = dynamic(() => import("@/components/QuizCreator"),         { ssr: false });
const AIQuizCreator    = dynamic(() => import("@/components/AIQuizCreator"),       { ssr: false });
const MagicMap         = dynamic(() => import("@/components/MagicMap"),            { ssr: false });
const TransientThoughts = dynamic(() => import("@/components/TransientThoughts"),  { ssr: false });

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

// ---------------------------------------------------------------------------
// CUSTOM HOOK: useQuizTimer
// Uses a ref to hold the callback so the interval never captures a stale
// version of handleNextQuizStep, eliminating the stale-closure bug.
// ---------------------------------------------------------------------------

function useQuizTimer(quiz: SafeQuiz | null, onTimeUp: () => void): number {
  const [timeLeft, setTimeLeft] = useState(0);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => { onTimeUpRef.current = onTimeUp; }, [onTimeUp]);

  useEffect(() => {
    if (quiz?.state !== "QUESTION") return;

    const q = quiz.questions[quiz.current_index];
    if (!q) return;

    const duration = q.time_limit ?? 30;
    setTimeLeft(duration);

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
    // Intentionally omit onTimeUp — the ref keeps it fresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz?.state, quiz?.current_index]);

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
    time_limit: q.time_limit,          // already required on QuizQuestion
    options: (q.options ?? q.answers ?? []) as Array<string | QuizOption>,
  };
}

const OPTION_COLORS = ["bg-red-600", "bg-blue-600", "bg-yellow-600", "bg-green-600"] as const;
const OPTION_LABELS = ["A", "B", "C", "D"] as const;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function PresenterDashboard({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  // -------------------------------------------------------------------------
  // ROUTE / SEARCH PARAMS
  // -------------------------------------------------------------------------
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null);
  const searchParams = useSearchParams();
  const isSidebar = searchParams.get("sidebar") === "true";
  const router = useRouter();

  useEffect(() => { params.then(setResolvedParams); }, [params]);
  const code = resolvedParams?.code ?? "";

  // -------------------------------------------------------------------------
  // UI STATE
  // -------------------------------------------------------------------------
  const [showDebug,       setShowDebug]       = useState(false);
  const [showPollForm,    setShowPollForm]     = useState(false);
  const [showWheel,       setShowWheel]        = useState(false);
  const [showQuizCreator, setShowQuizCreator]  = useState(false);
  const [showAIModal,     setShowAIModal]      = useState(false);
  const [showMap,         setShowMap]          = useState(false);
  const [showSettings,    setShowSettings]     = useState(false);
  const [viewMode,        setViewMode]         = useState<"poll" | "qna">("poll");
  const [actionLoading,   setActionLoading]    = useState(false);

  // Custom confirm — replaces window.confirm (broken inside iframes / Office)
  const [confirmAction, setConfirmAction] = useState<{ msg: string; action: () => void } | null>(null);

  // Data UI state
  const [tempLogo,   setTempLogo]   = useState("");
  const [aiSummary,  setAiSummary]  = useState("");
  const [analyzing,  setAnalyzing]  = useState(false);

  // -------------------------------------------------------------------------
  // SYNC REF — prevents the safety-poll from clobbering optimistic updates
  // -------------------------------------------------------------------------
  const lastActionTime = useRef<number>(0);

  // -------------------------------------------------------------------------
  // STORE
  // -------------------------------------------------------------------------
  useRealtime(code, "presenter");

  const {
    token, isConnected, participants,
    currentPoll, pollResults,
    questions, quiz, quizScores, branding,
    setQuiz, setPoll, setQuestions,
  } = useSessionStore();

  // Cast once so the rest of the file can use proper types
  const safeQuiz = quiz as SafeQuiz | null;

  // -------------------------------------------------------------------------
  // AUTH / BRANDING SIDE-EFFECTS
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!token && resolvedParams) router.push("/login");
  }, [token, router, resolvedParams]);

  useEffect(() => {
    if (branding?.logo_url) setTempLogo(branding.logo_url);
  }, [branding]);

  // -------------------------------------------------------------------------
  // API HELPER
  // -------------------------------------------------------------------------
  const apiCall = useCallback(
    async (endpoint: string, method: "GET" | "POST" = "GET", body?: unknown) => {
      if (!code) return null;
      try {
        const res = await fetch(`${API_URL}/api/session/${code}${endpoint}`, {
          method,
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
        });
        if (!res.ok) return null;
        return await res.json();
      } catch (err) {
        console.error(`API error (${endpoint}):`, err);
        return null;
      }
    },
    [code]
  );

  // -------------------------------------------------------------------------
  // SYNC STRATEGY: WebSocket (primary) + safety-poll (fallback)
  // Polls at 10 s when the socket is healthy; 3 s when disconnected.
  // Skips the fetch entirely for 2 s after an optimistic action.
  // -------------------------------------------------------------------------
  const fetchState = useCallback(async () => {
    if (Date.now() - lastActionTime.current < 2000) return;
    const data = await apiCall("/state");
    if (!data) return;
    if (data.quiz         !== undefined) setQuiz(data.quiz);
    if (data.current_poll !== undefined) setPoll(data.current_poll);
    if (data.questions    !== undefined) setQuestions(data.questions);
  }, [apiCall, setQuiz, setPoll, setQuestions]);

  // Initial fetch
  useEffect(() => { if (code) fetchState(); }, [code, fetchState]);

  // Safety-poll interval — adaptive frequency
  useEffect(() => {
    if (!code) return;
    const ms = isConnected ? 10_000 : 3_000;
    const id = setInterval(fetchState, ms);
    const onFocus = () => fetchState();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(id); window.removeEventListener("focus", onFocus); };
  }, [code, isConnected, fetchState]);

  // -------------------------------------------------------------------------
  // ACTION EXECUTOR
  // Wrapped in useCallback so dependent useCallbacks don't thrash.
  // -------------------------------------------------------------------------
  const executeAction = useCallback(
    async (fn: () => Promise<void>) => {
      if (actionLoading) return;
      setActionLoading(true);
      lastActionTime.current = Date.now();
      try {
        await fn();
      } catch (e) {
        console.error(e);
      } finally {
        // Give optimistic state a moment to settle, then confirm from server
        setTimeout(() => {
          fetchState();
          setActionLoading(false);
        }, 500);
      }
    },
    [actionLoading, fetchState]
  );

  // -------------------------------------------------------------------------
  // QUIZ ACTIONS
  // -------------------------------------------------------------------------
  const handleNextQuizStep = useCallback(() =>
    executeAction(async () => {
      if (!safeQuiz) return;

      // Optimistic state transition
      const atLast = safeQuiz.current_index + 1 >= safeQuiz.questions.length;
      const nextState: QuizState =
        safeQuiz.state === "LOBBY"       ? "QUESTION"
        : safeQuiz.state === "QUESTION"  ? "LEADERBOARD"
        : safeQuiz.state === "LEADERBOARD" ? (atLast ? "END" : "QUESTION")
        : "END";

      const nextIndex =
        nextState === "QUESTION" && safeQuiz.state !== "LOBBY"
          ? safeQuiz.current_index + 1
          : safeQuiz.current_index;

      // Cast through unknown: our SafeQuiz is structurally compatible with the
      // store's Quiz type at runtime; the cast avoids a compile-time mismatch
      // caused by the store's QuizQuestion requiring time_limit as non-optional.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setQuiz({ ...safeQuiz, state: nextState as QuizState, current_index: nextIndex } as any);
      await apiCall("/quiz/next", "POST");
    }),
    [executeAction, safeQuiz, setQuiz, apiCall]
  );

  const handleCloseQuiz = useCallback(() =>
    executeAction(async () => {
      setQuiz(null);
      await apiCall("/quiz/reset", "POST");
    }),
    [executeAction, setQuiz, apiCall]
  );

  const endPoll = useCallback(() =>
    executeAction(async () => {
      setPoll(null);
      await apiCall("/poll/end", "POST");
    }),
    [executeAction, setPoll, apiCall]
  );

  // -------------------------------------------------------------------------
  // AUTOMATION: timer + auto-advance when everyone has answered
  // useQuizTimer handles the countdown; the effect below handles all-answered.
  // -------------------------------------------------------------------------
  const timeLeft = useQuizTimer(safeQuiz, handleNextQuizStep);

  useEffect(() => {
    if (safeQuiz?.state !== "QUESTION" || participants.length === 0) return;
    const answered = safeQuiz.answers_count ?? 0;
    if (answered < participants.length) return;

    // Brief UX pause so the last vote visually registers
    const id = setTimeout(() => handleNextQuizStep(), 1_500);
    return () => clearTimeout(id);
  }, [safeQuiz?.answers_count, safeQuiz?.state, participants.length, handleNextQuizStep]);

  // Guard: auto-reset a quiz that arrived with no questions (data integrity)
  useEffect(() => {
    if (safeQuiz && safeQuiz.questions.length === 0) {
      console.error("Empty quiz detected — auto-resetting.");
      handleCloseQuiz();
    }
  }, [safeQuiz, handleCloseQuiz]);

  // -------------------------------------------------------------------------
  // OTHER ACTIONS
  // -------------------------------------------------------------------------
  const handleToggleQuestion = (qId: string) =>
    apiCall(`/question/${qId}/toggle`, "POST");

  const handleBanUser = (userName: string) =>
    setConfirmAction({
      msg: `Kick ${userName} from the session?`,
      action: async () => {
        await apiCall("/ban", "POST", { name: userName });
        lastActionTime.current = 0;
        fetchState();
        setConfirmAction(null);
      },
    });

  const saveSettings = async () => {
    await apiCall("/branding", "POST", {
      logo_url: tempLogo,
      theme_color: branding?.theme_color,
    });
    setShowSettings(false);
  };

  const handleQuizCreated = () => {
    lastActionTime.current = 0;
    fetchState();
  };

  const handleExport = () =>
    window.open(`${API_URL}/api/session/${code}/export`, "_blank");

  const handleAiAnalyze = async () => {
    if (analyzing) return;
    setAnalyzing(true);
    setAiSummary("");
    try {
      const context = safeQuiz
        ? [`Quiz: ${safeQuiz.title}`]
        : [`Poll: ${currentPoll?.question ?? ""}`];
      const res = await fetch(`${API_URL}/api/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: context }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSummary(data.summary ?? "AI couldn't generate a summary.");
      }
    } catch {
      setAiSummary("Network error.");
    } finally {
      setAnalyzing(false);
    }
  };

  // -------------------------------------------------------------------------
  // DERIVED VALUES
  // -------------------------------------------------------------------------
  const totalPollVotes = useMemo(() => {
    if (!pollResults) return 0;
    return Object.values(pollResults).reduce(
      (acc, curr) => acc + (curr as number),
      0
    );
  }, [pollResults]);

  const currentQ = safeQuiz?.questions[safeQuiz.current_index]
    ? resolveQuestion(safeQuiz.questions[safeQuiz.current_index])
    : null;

  // -------------------------------------------------------------------------
  // LOADING SCREEN
  // -------------------------------------------------------------------------
  if (!resolvedParams || !token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p>Connecting to Studio…</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // RENDER HELPERS (keep JSX in main return lean)
  // -------------------------------------------------------------------------

  // Leaderboard entries sorted by score
  const leaderboard = Object.entries(quizScores ?? {}).sort(
    ([, a], [, b]) => (b as number) - (a as number)
  );

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <div
      className={`min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-hidden ${
        isSidebar ? "p-2" : "p-4 sm:p-8"
      }`}
    >
      {/* Office.js — only loaded when running inside a PowerPoint sidebar */}
      {isSidebar && (
        <Script
          src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"
          strategy="lazyOnload"
        />
      )}

      {!isSidebar && <ReactionOverlay />}

      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                               */}
      {/* ------------------------------------------------------------------ */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4 sticky top-0 bg-slate-950 z-20">
        <div className="flex items-center gap-3">
          {branding?.logo_url ? (
            <div className="relative w-8 h-8">
              <Image
                src={branding.logo_url}
                alt="Logo"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          ) : (
            <div
              className={`w-8 h-8 rounded flex items-center justify-center font-bold text-white shadow-lg ${
                isConnected ? "bg-blue-600" : "bg-red-500"
              }`}
            >
              FR
            </div>
          )}
          {!isSidebar && (
            <h1 className="font-bold text-lg bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
              FlexiRush
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Code:</span>
          <span
            className="font-mono font-bold text-white cursor-pointer select-all"
            title="Click to copy"
            onClick={() => navigator.clipboard.writeText(code)}
          >
            {code}
          </span>
          <div className="w-px h-3 bg-slate-700 mx-1" />
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected
                ? "bg-green-500 shadow-[0_0_8px_#22c55e]"
                : "bg-red-500"
            }`}
          />
          <span className="text-xs">👥 {participants.length}</span>
        </div>
      </header>

      {/* ================================================================== */}
      {/* SIDEBAR LAYOUT                                                       */}
      {/* ================================================================== */}
      {isSidebar ? (
        <main className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Active activity controls */}
          <div className="space-y-3 shrink-0">
            {safeQuiz ? (
              <div className="bg-slate-900 border border-purple-500/50 p-4 rounded-xl shadow-lg animate-in fade-in">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Active Quiz
                  </span>
                  {safeQuiz.state === "QUESTION" && (
                    <span className="text-xs font-mono bg-purple-900/50 px-2 py-0.5 rounded text-white">
                      {timeLeft}s
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white mb-3 truncate">
                  {safeQuiz.title}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {safeQuiz.state !== "END" && (
                    <button
                      onClick={handleNextQuizStep}
                      disabled={actionLoading}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded transition shadow-lg disabled:opacity-50"
                    >
                      {safeQuiz.state === "LOBBY" ? "Start ▶" : "Next ➡"}
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setConfirmAction({ msg: "End current quiz?", action: handleCloseQuiz })
                    }
                    className="bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold py-2 rounded hover:bg-red-500/20 transition"
                  >
                    Stop ⏹
                  </button>
                </div>
              </div>
            ) : currentPoll ? (
              <div className="bg-slate-900 border border-blue-500/50 p-4 rounded-xl shadow-lg animate-in fade-in">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Active Poll
                  </span>
                  <span className="text-xs text-slate-400">{totalPollVotes} votes</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-3 truncate">
                  {currentPoll.question}
                </h3>
                <button
                  onClick={() =>
                    setConfirmAction({ msg: "Stop poll?", action: endPoll })
                  }
                  className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded transition shadow-lg"
                >
                  Stop Poll ⏹
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => { setShowPollForm(true); setViewMode("poll"); }}
                  className="p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                >
                  📊 Launch Poll
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowAIModal(true)}
                    className="p-3 bg-linear-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg text-xs flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95"
                  >
                    <span className="text-lg">✨</span> AI Quiz
                  </button>
                  <button
                    onClick={() => setShowQuizCreator(true)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs flex flex-col items-center justify-center gap-1 border border-slate-700 active:scale-95"
                  >
                    <span className="text-lg">🏆</span> Manual
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mini live preview */}
          <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden relative min-h-50">
            <div className="absolute top-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-slate-400 uppercase font-bold backdrop-blur-sm z-10">
              Live Output
            </div>
            <div className="h-full overflow-y-auto p-4 flex flex-col items-center justify-center text-center">
              {safeQuiz ? (
                <div className="w-full">
                  {safeQuiz.state === "LOBBY" && (
                    <p className="text-xl font-bold text-white">Waiting…</p>
                  )}
                  {safeQuiz.state === "QUESTION" && currentQ && (
                    <div>
                      <p className="font-bold text-white mb-4 text-lg">{currentQ.text}</p>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-1000"
                          /* webhint: ignore no-inline-styles */
                          style={{ width: `${(timeLeft / currentQ.time_limit) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {safeQuiz.state === "LEADERBOARD" && (
                    <p className="text-yellow-400 font-bold text-xl">🏆 Leaderboard</p>
                  )}
                  {safeQuiz.state === "END" && (
                    <p className="text-green-400 font-bold text-xl">🎉 Finished!</p>
                  )}
                </div>
              ) : currentPoll ? (
                <div className="w-full pt-6">
                  {currentPoll.type === "multiple_choice" && (
                    <div className="space-y-2 w-full">
                      {(currentPoll.options ?? []).map(
                        (opt: { label: string }) => {
                          const count = pollResults?.[opt.label] ?? 0;
                          const pct =
                            totalPollVotes > 0
                              ? (count / totalPollVotes) * 100
                              : 0;
                          return (
                            <div key={opt.label} className="w-full">
                              <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                                <span>{opt.label}</span>
                                <span>{count}</span>
                              </div>
                              <div className="h-1.5 bg-slate-800 rounded-full">
                                <div
                                  className="h-full bg-blue-500 rounded-full transition-all duration-700"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                  {currentPoll.type !== "multiple_choice" && (
                    <p className="text-sm text-slate-400">Visualization active</p>
                  )}
                </div>
              ) : (
                <p className="text-slate-600 text-xs italic">Nothing live.</p>
              )}
            </div>
          </div>

          {/* Footer utilities */}
          <div className="grid grid-cols-3 gap-2 shrink-0">
            <button
              onClick={() => setShowWheel(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-400"
            >
              🎲 Wheel
            </button>
            <button
              onClick={() => setViewMode("qna")}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-400"
            >
              💬 Q&amp;A
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-400"
            >
              ⚙️ Set
            </button>
          </div>
        </main>

      ) : (
      /* ================================================================== */
      /* DESKTOP LAYOUT                                                       */
      /* ================================================================== */
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">

          {/* ---------------------------------------------------------------- */}
          {/* LEFT PANEL — Live view                                            */}
          {/* ---------------------------------------------------------------- */}
          <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm p-4 sm:p-8 rounded-2xl border border-slate-800 flex flex-col shadow-2xl relative overflow-y-auto min-h-[60vh]">

            {safeQuiz ? (
              <div className="flex flex-col h-full items-center justify-center text-center w-full animate-in fade-in zoom-in duration-300 relative">

                {/* Quiz top bar */}
                <div className="flex justify-between items-center w-full absolute top-0 px-2 pt-2 z-20">
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-400 font-bold uppercase tracking-wider">
                      {safeQuiz.state === "LOBBY"
                        ? "Lobby"
                        : safeQuiz.state === "END"
                        ? "Finished"
                        : `Q${safeQuiz.current_index + 1}`}
                    </span>
                    {safeQuiz.state === "QUESTION" && (
                      <div className="flex gap-2">
                        <span
                          className={`text-sm font-mono font-bold px-2 py-1 rounded ${
                            timeLeft < 5
                              ? "bg-red-500/20 text-red-400 animate-pulse"
                              : "bg-slate-800 text-white"
                          }`}
                        >
                          ⏰ {timeLeft}s
                        </span>
                        <span className="text-sm font-mono font-bold px-2 py-1 rounded bg-blue-900/30 text-blue-400 border border-blue-500/30">
                          📥 {safeQuiz.answers_count ?? 0}/{participants.length}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {safeQuiz.state !== "END" && (
                      <button
                        onClick={handleNextQuizStep}
                        disabled={actionLoading}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold transition border border-slate-700 disabled:opacity-50"
                      >
                        Skip ⏭
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setConfirmAction({ msg: "Quit quiz?", action: handleCloseQuiz })
                      }
                      className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/30 rounded text-xs font-bold transition"
                    >
                      ✕ Quit
                    </button>
                  </div>
                </div>

                {/* STATE: LOBBY */}
                {safeQuiz.state === "LOBBY" && (
                  <div className="space-y-8 mt-12">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600">
                      Get Ready!
                    </h1>
                    <div className="text-2xl text-white bg-slate-800/80 px-8 py-3 rounded-full inline-block border border-slate-700">
                      👥{" "}
                      <span className="font-mono font-bold text-blue-400">
                        {participants.length}
                      </span>{" "}
                      players ready
                    </div>
                    <div className="pt-8">
                      <button
                        onClick={handleNextQuizStep}
                        disabled={actionLoading}
                        className="px-8 py-4 bg-green-600 hover:bg-green-500 active:scale-95 rounded-xl font-bold text-xl shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                      >
                        {actionLoading ? "Starting…" : "Start Game 🚀"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STATE: QUESTION */}
                {safeQuiz.state === "QUESTION" && (
                  <div className="w-full max-w-4xl pt-16">
                    {currentQ ? (
                      <>
                        <div className="mb-8">
                          <h3 className="text-3xl sm:text-4xl font-bold leading-tight mb-8 animate-in slide-in-from-right-4 fade-in">
                            {currentQ.text}
                          </h3>
                          {/* CSS-animated progress bar — keyed to question index so it resets */}
                          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                            <div
                              key={safeQuiz.current_index}
                              className="h-full bg-linear-to-r from-green-500 to-yellow-500 origin-left"
                              style={{
                                width: "100%",
                                animation: `width_linear ${currentQ.time_limit}s linear forwards`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                          {currentQ.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`p-6 rounded-xl text-xl font-bold flex items-center gap-4 text-white shadow-lg transition-transform hover:scale-[1.01] ${
                                OPTION_COLORS[i % 4]
                              }`}
                            >
                              <span className="text-2xl opacity-60 bg-black/20 w-10 h-10 flex items-center justify-center rounded-lg">
                                {OPTION_LABELS[i % 4]}
                              </span>
                              <span className="text-left">{resolveOption(opt)}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p>Loading…</p>
                    )}
                  </div>
                )}

                {/* STATE: LEADERBOARD */}
                {safeQuiz.state === "LEADERBOARD" && (
                  <div className="w-full max-w-lg pt-12">
                    <h3 className="text-4xl font-bold mb-8 text-yellow-400 drop-shadow-lg">
                      🏆 Leaderboard
                    </h3>
                    <div className="space-y-3 mb-10">
                      {leaderboard.slice(0, 5).map(([name, score], i) => (
                        <div
                          key={name}
                          className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 animate-in slide-in-from-bottom-2 fade-in"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          <div className="flex items-center gap-4">
                            <span
                              className={`font-black text-xl w-8 text-center ${
                                i === 0
                                  ? "text-yellow-400"
                                  : i === 1
                                  ? "text-slate-300"
                                  : i === 2
                                  ? "text-orange-400"
                                  : "text-slate-500"
                              }`}
                            >
                              {i + 1}
                            </span>
                            <span className="text-lg font-medium">{name}</span>
                          </div>
                          <span className="font-mono font-bold text-blue-400">
                            {score as number} pts
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleNextQuizStep}
                      disabled={actionLoading}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
                    >
                      {actionLoading ? "Loading…" : "Next Question →"}
                    </button>
                  </div>
                )}

                {/* STATE: END */}
                {safeQuiz.state === "END" && (
                  <div className="space-y-8 animate-in zoom-in duration-500 pt-12">
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">
                      GAME OVER
                    </h1>
                    <div className="bg-slate-800/80 p-10 rounded-3xl border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                      <p className="text-slate-400 uppercase tracking-widest text-sm mb-4">
                        The Winner is
                      </p>
                      <p className="text-5xl font-bold text-white mb-2">
                        {leaderboard[0]?.[0] ?? "No one"}
                      </p>
                      <p className="text-yellow-400 text-xl font-mono">
                        {(leaderboard[0]?.[1] as number) ?? 0} pts
                      </p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={handleExport}
                        className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg transition font-bold text-white shadow-lg flex items-center gap-2"
                      >
                        📥 Download Results
                      </button>
                      <button
                        onClick={() =>
                          setConfirmAction({ msg: "Close quiz?", action: handleCloseQuiz })
                        }
                        disabled={actionLoading}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition font-medium text-slate-200 disabled:opacity-50"
                      >
                        Close Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>

            ) : (
              // ---- POLL / Q&A view ----
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {viewMode === "poll" ? "📊 Live Results" : "💬 Audience Q&A"}
                  </h2>
                  {currentPoll && (
                    <button
                      onClick={() =>
                        setConfirmAction({ msg: "Stop poll?", action: endPoll })
                      }
                      disabled={actionLoading}
                      className="text-xs bg-red-900/50 text-red-300 border border-red-900 px-3 py-1 rounded hover:bg-red-900 transition flex items-center gap-1"
                    >
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Stop Poll
                    </button>
                  )}
                </div>

                {viewMode === "poll" && (
                  !currentPoll ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                      <span className="text-6xl mb-4 grayscale opacity-20">📊</span>
                      <p className="opacity-50 text-lg">No active poll</p>
                      <button
                        onClick={() => setShowPollForm(true)}
                        className="mt-4 text-blue-400 hover:text-blue-300 underline"
                      >
                        Launch one now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                      <h3 className="text-3xl font-bold text-center leading-snug">
                        {currentPoll.question}
                      </h3>

                      {currentPoll.type === "multiple_choice" && (
                        <div className="space-y-4 max-w-2xl mx-auto w-full">
                          {currentPoll.options?.map(
                            (opt: { label: string }, idx: number) => {
                              const count = pollResults?.[opt.label] ?? 0;
                              const pct =
                                totalPollVotes > 0
                                  ? (count / totalPollVotes) * 100
                                  : 0;
                              return (
                                <div key={idx} className="relative">
                                  <div className="flex justify-between text-base font-medium mb-1 px-1">
                                    <span>{opt.label}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-slate-400 text-sm">
                                        {Math.round(pct)}%
                                      </span>
                                      <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-white">
                                        {count}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="h-5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                    <div
                                      className="h-full bg-blue-500 transition-all duration-700 ease-out relative overflow-hidden"
                                      style={{ width: `${pct}%` }}
                                    >
                                      <div className="absolute inset-0 bg-white/10 animate-[shimmer_2s_infinite]" />
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}

                      {currentPoll.type === "rating" && (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-br from-yellow-300 to-yellow-600">
                            {currentPoll.average ?? 0}
                          </div>
                          <div className="flex gap-1 mt-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-4xl ${
                                  star <= Math.round(currentPoll.average ?? 0)
                                    ? "text-yellow-400"
                                    : "text-slate-700"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentPoll.type === "word_cloud" && (
                        <div className="flex flex-wrap gap-4 justify-center items-center py-8 min-h-75">
                          {(() => {
                            const words =
                              pollResults && Object.keys(pollResults).length > 0
                                ? pollResults
                                : currentPoll.words ?? {};
                            const entries = Object.entries(words);
                            if (entries.length === 0)
                              return (
                                <span className="text-slate-500">
                                  Waiting for words…
                                </span>
                              );
                            return entries.map(([word, count]) => (
                              <span
                                key={word}
                                className="text-blue-400 font-bold transition-all duration-500 hover:scale-110 cursor-default animate-in zoom-in"
                                style={{
                                  fontSize: `${Math.min(1.5 + (count as number) * 0.5, 5)}rem`,
                                  opacity: Math.min(0.5 + (count as number) * 0.1, 1),
                                }}
                              >
                                {word}
                              </span>
                            ));
                          })()}
                        </div>
                      )}

                      {currentPoll.type === "open_ended" && (
                        <TransientThoughts responses={currentPoll.responses ?? []} />
                      )}
                    </div>
                  )
                )}

                {viewMode === "qna" && (
                  <div className="space-y-3 overflow-y-auto max-h-[65vh] pr-2">
                    {questions.length === 0 && (
                      <div className="text-center py-10 text-slate-500">
                        No questions yet.
                      </div>
                    )}
                    {[...questions]
                      .sort((a, b) => b.votes - a.votes)
                      .map((q: Question) => (
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
                            <p
                              className={`text-base font-medium ${
                                q.visible !== false
                                  ? "text-slate-200"
                                  : "text-slate-500 italic line-through"
                              }`}
                            >
                              {q.text}
                            </p>
                          </div>
                          <button
                            onClick={() => handleToggleQuestion(q.id)}
                            className={`px-3 py-1 rounded text-sm font-bold transition h-fit self-center ${
                              q.visible !== false
                                ? "bg-slate-700 text-slate-300"
                                : "bg-blue-900/30 text-blue-400"
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

          {/* ---------------------------------------------------------------- */}
          {/* RIGHT PANEL — Controls                                            */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-6 h-full overflow-y-auto pr-1 pb-20">

            {/* Participants */}
            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md">
              <h2 className="text-base font-bold text-slate-300 flex justify-between items-center mb-4 uppercase tracking-wider">
                <span>👥 Participants</span>
                <span className="bg-slate-800 px-2 py-1 rounded text-white border border-slate-700">
                  {participants.length}
                </span>
              </h2>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {participants.length === 0 && (
                  <p className="text-slate-500 text-sm italic text-center py-4">
                    Waiting for joiners…
                  </p>
                )}
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center bg-slate-800/30 p-2 rounded hover:bg-slate-800 transition group border border-transparent hover:border-slate-700"
                  >
                    <span className="text-sm text-slate-300 font-medium truncate max-w-[70%]">
                      {p.name}
                    </span>
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

            {/* Control Deck */}
            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md">
              <h2 className="text-base font-bold text-slate-300 mb-4 uppercase tracking-wider">
                Control Deck
              </h2>

              {/* Inline quiz controls when a quiz is active */}
              {safeQuiz && (
                <div className="mb-4 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-blue-300 font-bold uppercase">
                      Quiz: {safeQuiz.state}
                    </p>
                    {safeQuiz.state === "QUESTION" && (
                      <span className="text-xs text-white font-mono">{timeLeft}s</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {safeQuiz.state === "LOBBY" && (
                      <button
                        onClick={handleNextQuizStep}
                        className="p-3 bg-green-600 hover:bg-green-500 rounded font-bold transition"
                      >
                        Start Game ▶
                      </button>
                    )}
                    {safeQuiz.state === "LEADERBOARD" && (
                      <button
                        onClick={handleNextQuizStep}
                        className="p-3 bg-blue-600 hover:bg-blue-500 rounded font-bold transition"
                      >
                        Next Question ➡
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setConfirmAction({ msg: "End quiz?", action: handleCloseQuiz })
                      }
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-xs border border-red-500/20 transition"
                    >
                      End Quiz
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => { setShowPollForm(true); setViewMode("poll"); }}
                  className="p-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition text-left flex justify-between items-center group active:scale-[0.98]"
                >
                  <span>Launch New Poll</span>
                  <span className="group-hover:translate-x-1 transition">🚀</span>
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

                <div className="h-px bg-slate-800 my-1" />

                <button
                  onClick={() => setViewMode(viewMode === "qna" ? "poll" : "qna")}
                  className={`p-3 font-bold rounded-lg transition text-left flex justify-between items-center text-sm ${
                    viewMode === "qna"
                      ? "bg-slate-700 text-white ring-2 ring-blue-500"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  <span>View Q&amp;A Board</span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-xs border border-slate-700">
                    {questions.length}
                  </span>
                </button>

                <button
                  onClick={() => setShowSettings(true)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition text-left flex justify-between items-center text-sm hover:text-white"
                >
                  <span>Settings</span><span>⚙️</span>
                </button>
              </div>
            </div>

            {/* AI Insights */}
            <div className="space-y-3">
              <button
                onClick={handleAiAnalyze}
                disabled={analyzing}
                className="w-full p-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition text-left border border-indigo-400/30 flex justify-between items-center shadow-lg active:scale-[0.98] disabled:opacity-50"
              >
                <div className="flex flex-col">
                  <span className="text-sm">Analyze Room Vibe</span>
                  <span className="text-xs opacity-70 font-normal">
                    Powered by Gemini AI
                  </span>
                </div>
                <span className={analyzing ? "animate-spin text-xl" : "text-xl"}>
                  {analyzing ? "⚙️" : "🔮"}
                </span>
              </button>

              {aiSummary && (
                <div className="p-4 bg-slate-800/90 rounded-xl border border-purple-500/30 animate-in fade-in slide-in-from-top-2 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🤖</span>
                    <h3 className="text-purple-400 text-xs font-bold uppercase tracking-widest">
                      Hive Mind Insights
                    </h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-purple-500 pl-3">
                    &ldquo;{aiSummary}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ================================================================== */}
      {/* MODALS                                                               */}
      {/* ================================================================== */}

      {showWheel && (
        <WinningWheel
          participants={participants.map((p) => p.name)}
          onClose={() => setShowWheel(false)}
        />
      )}
      {showPollForm && (
        <CreatePollForm sessionCode={code} onClose={() => setShowPollForm(false)} />
      )}
      {showQuizCreator && (
        <QuizCreator sessionCode={code} onClose={() => setShowQuizCreator(false)} />
      )}
      {showAIModal && (
        <AIQuizCreator
          sessionCode={code}
          onClose={() => setShowAIModal(false)}
          onSuccess={handleQuizCreated}
        />
      )}

      {showMap && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-in fade-in backdrop-blur-sm">
          <div className="w-full max-w-6xl h-[80vh] bg-slate-900 rounded-2xl flex flex-col overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <h2 className="text-xl font-bold flex items-center gap-2">
                🌍 Magic Map
                <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                  Live Locations
                </span>
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
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6">⚙️ Session Settings</h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="logo-url"
                  className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block"
                >
                  Custom Logo URL
                </label>
                <input
                  id="logo-url"
                  type="text"
                  value={tempLogo}
                  onChange={(e) => setTempLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-600"
                />
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <label className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">
                  Embed in Slides / Notion
                </label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    aria-label="Embed Code URL"
                    value={
                      typeof window !== "undefined"
                        ? `${window.location.origin}/embed/presenter/${code}?transparent=true`
                        : ""
                    }
                    className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded text-xs text-slate-300 font-mono select-all"
                  />
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/embed/presenter/${code}?transparent=true`;
                      navigator.clipboard.writeText(
                        `<iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>`
                      );
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold transition"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition font-bold border border-transparent hover:border-slate-700"
                >
                  Close
                </button>
                <button
                  onClick={saveSettings}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-lg"
                >
                  Save Branding
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal — works in iframes, unlike window.confirm */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-sm shadow-2xl text-center">
            <h3 className="text-lg font-bold text-white mb-6">{confirmAction.msg}</h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-5 py-2 text-slate-400 hover:text-white font-bold hover:bg-slate-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction.action}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold shadow-lg transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug overlay */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white text-xs px-3 py-1 rounded shadow-lg backdrop-blur-md transition"
        >
          🐞
        </button>
      </div>
      {showDebug && (
        <div className="fixed inset-0 bg-black/90 z-50 p-8 overflow-auto font-mono text-xs text-green-400 animate-in fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h2 className="text-xl text-white font-bold">🔍 Live Data Inspector</h2>
              <button
                onClick={() => setShowDebug(false)}
                className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-500"
              >
                CLOSE
              </button>
            </div>
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify({ quiz: safeQuiz, currentPoll, participants }, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}