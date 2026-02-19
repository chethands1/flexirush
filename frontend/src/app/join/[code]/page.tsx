"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { useSessionStore } from "@/store/sessionStore";
import { useRealtime } from "@/hooks/useRealtime";

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

// ---------------------------------------------------------------------------
// SAFE STORAGE — localStorage throws in iOS private browsing
// ---------------------------------------------------------------------------

const safeStorage = {
  get: (key: string): string | null => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set: (key: string, value: string): void => {
    try { localStorage.setItem(key, value); } catch { /* silent */ }
  },
};

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  // -------------------------------------------------------------------------
  // ROUTE
  // -------------------------------------------------------------------------
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null);

  useEffect(() => { params.then(setResolvedParams); }, [params]);

  const code = resolvedParams?.code ?? "";

  // -------------------------------------------------------------------------
  // UI STATE
  // -------------------------------------------------------------------------
  const [guestName,      setGuestName]      = useState("");
  const [isJoining,      setIsJoining]      = useState(false);
  const [activeTab,      setActiveTab]      = useState<"activity" | "qna">("activity");
  const [hasVoted,       setHasVoted]       = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [pollAnswer,     setPollAnswer]     = useState("");
  const [questionText,   setQuestionText]   = useState("");

  // Separate loading states per action — prevents cross-contamination
  const [isVoting,       setIsVoting]       = useState(false);
  const [isAskingQ,      setIsAskingQ]      = useState(false);

  // -------------------------------------------------------------------------
  // SYNC REF — prevents heartbeat from clobbering optimistic updates
  // -------------------------------------------------------------------------
  const lastSyncTime = useRef<number>(0);

  // -------------------------------------------------------------------------
  // STORE
  // -------------------------------------------------------------------------
  useRealtime(code, "participant");

  const {
    user, isConnected,
    currentPoll, questions, quiz, quizScores, branding,
    setUser, setToken, setQuiz, setPoll, setQuestions,
  } = useSessionStore();

  // -------------------------------------------------------------------------
  // HEARTBEAT
  // Keep refs so syncState's dependency array stays stable and the interval
  // doesn't restart every time quiz/poll state changes.
  // -------------------------------------------------------------------------
  const quizRef       = useRef(quiz);
  const pollRef       = useRef(currentPoll);
  const isConnectedRef = useRef(isConnected);

  useEffect(() => { quizRef.current        = quiz;        }, [quiz]);
  useEffect(() => { pollRef.current        = currentPoll; }, [currentPoll]);
  useEffect(() => { isConnectedRef.current = isConnected; }, [isConnected]);

  const syncState = useCallback(async () => {
    if (Date.now() - lastSyncTime.current < 2000) return;
    try {
      const res = await fetch(`${API_URL}/api/session/${code}/state`);
      if (!res.ok) return;
      const data = await res.json();

      // Only update fields that actually changed to avoid unnecessary re-renders
      if (data.quiz         !== undefined) setQuiz(data.quiz ?? null);
      if (data.current_poll !== undefined) setPoll(data.current_poll ?? null);
      if (data.questions    !== undefined) setQuestions(data.questions ?? []);
    } catch (e) {
      console.error("Heartbeat failed:", e);
    }
  }, [code, setQuiz, setPoll, setQuestions]);

  // Adaptive frequency — poll less aggressively when socket is healthy
  useEffect(() => {
    if (!code || !user) return;
    const ms = isConnected ? 10_000 : 3_000;
    const id = setInterval(syncState, ms);
    const onFocus = () => syncState();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(id); window.removeEventListener("focus", onFocus); };
  }, [code, user, isConnected, syncState]);

  // -------------------------------------------------------------------------
  // VOTING PERSISTENCE
  // -------------------------------------------------------------------------
  useEffect(() => {
    let activityKey: string | null = null;

    if (currentPoll) {
      activityKey = `poll_${code}_${currentPoll.question}`;
    } else if (quiz) {
      activityKey = `quiz_${code}_${quiz.title}_${quiz.current_index}`;
    }

    if (activityKey) {
      const alreadyVoted = safeStorage.get(activityKey);
      if (alreadyVoted) {
        setHasVoted(true);
        const saved = safeStorage.get(activityKey + "_opt");
        if (saved !== null) setSelectedOption(Number(saved));
      } else {
        setHasVoted(false);
        setSelectedOption(null);
        setPollAnswer("");
      }
    } else {
      setHasVoted(false);
    }
  }, [currentPoll, quiz, code]);

  const markAsVoted = (optionIndex?: number) => {
    lastSyncTime.current = Date.now(); // pause heartbeat briefly

    let activityKey: string | null = null;
    if (currentPoll) {
      activityKey = `poll_${code}_${currentPoll.question}`;
    } else if (quiz) {
      activityKey = `quiz_${code}_${quiz.title}_${quiz.current_index}`;
    }

    if (activityKey) {
      safeStorage.set(activityKey, "true");
      if (optionIndex !== undefined) {
        safeStorage.set(activityKey + "_opt", String(optionIndex));
      }
    }
    setHasVoted(true);
    if (optionIndex !== undefined) setSelectedOption(optionIndex);
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
        // The store User type only has { id, email } — we store the display
        // name in email since this is a guest session with no real email.
        // To fix properly: add a `name` field to the User type in sessionStore.
        setUser({ id: data.id, email: data.name ?? data.email ?? guestName });
        setToken(data.token ?? "guest-token");
      } else {
        alert("Failed to join. Check the session code and try again.");
      }
    } catch {
      alert("Connection error. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const handlePollVote = async (value: string | number) => {
    if (hasVoted || isVoting) return;
    setIsVoting(true);
    try {
      const res = await fetch(`${API_URL}/api/session/${code}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (res.ok) markAsVoted();
    } catch (e) {
      console.error(e);
    } finally {
      setIsVoting(false);
    }
  };

  const handleQuizAnswer = async (index: number) => {
    if (hasVoted || isVoting || !user) return;
    setSelectedOption(index); // optimistic
    setIsVoting(true);
    try {
      const res = await fetch(`${API_URL}/api/session/${code}/quiz/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: user.email || "Anonymous",
          option_index: index,
        }),
      });
      if (res.ok) markAsVoted(index);
      else setSelectedOption(null); // revert optimistic on failure
    } catch (e) {
      console.error(e);
      setSelectedOption(null);
    } finally {
      setIsVoting(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || isAskingQ) return;
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
    }
  };

  // -------------------------------------------------------------------------
  // DERIVED VALUES
  // -------------------------------------------------------------------------
  const safeQuizQuestion = useMemo(() => {
    if (!quiz?.questions?.length) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const q = quiz.questions[quiz.current_index] as any;
    if (!q) return null;
    return {
      text:       q.text     ?? q.question ?? "Question Loading...",
      options:    q.options  ?? q.answers  ?? [],
      time_limit: q.time_limit ?? 30,
    };
  }, [quiz]);

  const myScore = quizScores?.[user?.email ?? "Anonymous"] ?? 0;

  // Only show questions the presenter has made visible
  const visibleQuestions = useMemo(
    () => questions.filter((q) => q.visible !== false),
    [questions]
  );

  // -------------------------------------------------------------------------
  // LOADING SCREEN
  // -------------------------------------------------------------------------
  if (!resolvedParams) {
    return (
      <div className="min-h-dvh bg-slate-950 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // JOIN FORM
  // -------------------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-dvh bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl animate-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-blue-900/50">
              FR
            </div>
            <h1 className="text-3xl font-bold mb-2">Join Session</h1>
            <p className="text-slate-400 text-sm">Enter your name to join the activity.</p>
          </div>

          <form onSubmit={handleJoinSession} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Your Name
              </label>
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
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition shadow-lg flex justify-center items-center gap-2 active:scale-[0.98] text-lg"
            >
              {isJoining
                ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : "Join Now 🚀"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // MAIN VIEW
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-dvh bg-slate-950 text-white font-sans flex flex-col pb-28">

      {/* HEADER */}
      <header className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {branding?.logo_url ? (
            <Image src={branding.logo_url} alt="Logo" width={32} height={32} className="rounded" />
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-xs">
              FR
            </div>
          )}
          <span className="font-bold hidden sm:block">FlexiRush</span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              isConnected ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500"
            }`}
          />
          <span className="font-mono bg-slate-800 px-3 py-1 rounded-lg text-xs border border-slate-700 font-bold tracking-widest">
            {code}
          </span>
          <span className="text-xs text-slate-400 hidden sm:block">
            {user.email}
          </span>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">

        {/* ================================================================ */}
        {/* TAB: ACTIVITY                                                      */}
        {/* ================================================================ */}
        {activeTab === "activity" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* SCENARIO 1: QUIZ (active) */}
            {quiz && quiz.state !== "END" && (
              <div className="w-full">
                <div className="text-center mb-8">
                  <span className="bg-purple-900/30 text-purple-300 text-xs font-bold px-4 py-1.5 rounded-full border border-purple-500/30 uppercase tracking-widest">
                    {quiz.state === "LOBBY"
                      ? "Quiz Lobby"
                      : `Question ${quiz.current_index + 1}`}
                  </span>
                </div>

                {/* STATE: LOBBY */}
                {quiz.state === "LOBBY" && (
                  <div className="text-center py-10">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-purple-400 to-pink-600 mb-6">
                      Get Ready!
                    </h1>
                    <p className="text-slate-400 text-lg">The quiz will start soon.</p>
                    <div className="mt-12 text-7xl animate-bounce">🚀</div>
                  </div>
                )}

                {/* STATE: QUESTION */}
                {quiz.state === "QUESTION" && (
                  safeQuizQuestion ? (
                    // key forces full remount (and timer reset) on each new question
                    <div key={quiz.current_index} className="space-y-8 animate-in fade-in">
                      <h2 className="text-2xl sm:text-3xl font-bold text-center leading-snug">
                        {safeQuizQuestion.text}
                      </h2>

                      {/* Timer bar */}
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden w-full shadow-inner">
                        <div
                          className="h-full bg-linear-to-r from-purple-500 to-pink-500 origin-left"
                          /* webhint: ignore no-inline-styles */
                          style={{
                            width: "100%",
                            animation: `width_linear ${safeQuizQuestion.time_limit}s linear forwards`,
                          }}
                        />
                      </div>

                      {/* Options */}
                      <div className="grid gap-3">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {safeQuizQuestion.options.map((opt: any, i: number) => {
                          const isSelected = selectedOption === i;
                          const voted = hasVoted;
                          return (
                            <button
                              key={i}
                              disabled={voted || isVoting}
                              onClick={() => handleQuizAnswer(i)}
                              className={`p-5 rounded-2xl text-lg font-bold transition-all active:scale-[0.98] flex items-center gap-4 text-left border-2 shadow-lg
                                ${voted
                                  ? isSelected
                                    ? "bg-purple-600 border-purple-500 text-white shadow-purple-900/50"
                                    : "bg-slate-800 border-slate-800 text-slate-500 opacity-50"
                                  : "bg-slate-800 border-slate-700 hover:border-purple-500 text-slate-200"
                                }`}
                            >
                              <span
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                                  voted && isSelected ? "bg-white/20" : "bg-black/30"
                                }`}
                              >
                                {["A", "B", "C", "D"][i]}
                              </span>
                              {typeof opt === "string" ? opt : opt.label}
                            </button>
                          );
                        })}
                      </div>

                      {hasVoted && (
                        <div className="text-center p-3 bg-green-900/30 text-green-400 font-bold rounded-xl border border-green-500/30 animate-pulse">
                          Answer Sent! 🔒
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-500 animate-pulse">
                      <div className="text-6xl mb-4">⏳</div>
                      <p>Loading question…</p>
                    </div>
                  )
                )}

                {/* STATE: LEADERBOARD */}
                {quiz.state === "LEADERBOARD" && (
                  <div className="text-center py-10 space-y-8 animate-in zoom-in">
                    <h2 className="text-4xl font-black text-yellow-400 drop-shadow-md">
                      Time&apos;s Up!
                    </h2>
                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                      <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">
                        Your Score
                      </p>
                      <p className="text-6xl font-mono font-bold text-white tracking-tighter">
                        {myScore}
                      </p>
                      <p className="text-slate-500 text-xs mt-2">pts</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SCENARIO 2: QUIZ ENDED */}
            {quiz && quiz.state === "END" && (
              <div className="text-center py-10 space-y-8 animate-in zoom-in duration-500">
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">
                  Game Over!
                </h1>
                <div className="bg-slate-800 p-8 rounded-3xl border border-yellow-500/30 shadow-2xl">
                  <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">
                    Your Final Score
                  </p>
                  <p className="text-6xl font-mono font-bold text-white tracking-tighter">
                    {myScore}
                  </p>
                  <p className="text-slate-500 text-xs mt-2">pts</p>
                </div>
                <p className="text-slate-400">Thanks for playing! 🎉</p>
              </div>
            )}

            {/* SCENARIO 3: POLL */}
            {!quiz && currentPoll && (
              <div
                key={currentPoll.question}
                className="w-full space-y-8 animate-in fade-in zoom-in duration-300"
              >
                <div className="text-center">
                  <span className="bg-blue-900/30 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-500/30 uppercase tracking-widest">
                    Live Poll
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-center leading-snug">
                  {currentPoll.question}
                </h2>

                {/* Multiple choice */}
                {currentPoll.type === "multiple_choice" && (
                  <div className="grid gap-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {currentPoll.options?.map((opt: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => handlePollVote(opt.label)}
                        disabled={hasVoted || isVoting}
                        className={`p-5 rounded-2xl font-bold text-left transition-all shadow-lg active:scale-[0.98] ${
                          hasVoted
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                            : "bg-blue-600 hover:bg-blue-500 text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Word cloud / open ended */}
                {(currentPoll.type === "word_cloud" ||
                  currentPoll.type === "open_ended") && (
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
                      disabled={!pollAnswer.trim() || hasVoted || isVoting}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition shadow-lg active:scale-[0.98]"
                    >
                      {hasVoted ? "Sent! ✅" : isVoting ? "Sending…" : "Submit Answer"}
                    </button>
                  </div>
                )}

                {/* Rating — highlights selected star after voting */}
                {currentPoll.type === "rating" && (
                  <div className="flex justify-center gap-3 py-10">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isChosen = hasVoted && selectedOption === star;
                      return (
                        <button
                          key={star}
                          onClick={() => {
                            setSelectedOption(star);
                            handlePollVote(star);
                          }}
                          disabled={hasVoted || isVoting}
                          className={`text-5xl transition-transform hover:scale-125 active:scale-90 ${
                            hasVoted
                              ? isChosen
                                ? "text-yellow-400 scale-110"
                                : "opacity-30 cursor-default grayscale"
                              : "cursor-pointer text-slate-400 hover:text-yellow-400"
                          }`}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                )}

                {hasVoted && currentPoll.type !== "word_cloud" && currentPoll.type !== "open_ended" && (
                  <div className="text-center p-3 bg-green-900/30 text-green-400 font-bold rounded-xl border border-green-500/30 animate-pulse">
                    Response Recorded! ✅
                  </div>
                )}
              </div>
            )}

            {/* SCENARIO 4: WAITING */}
            {!quiz && !currentPoll && (
              <div className="text-center py-20 text-slate-500">
                <div className="text-7xl mb-6 grayscale opacity-20">☕</div>
                <h2 className="text-2xl font-bold text-slate-300 mb-2">
                  Waiting for Presenter
                </h2>
                <p className="text-sm">Sit back and relax! The session will resume shortly.</p>
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB: Q&A                                                           */}
        {/* ================================================================ */}
        {activeTab === "qna" && (
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
                disabled={!questionText.trim() || isAskingQ}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition shadow-lg active:scale-[0.98]"
              >
                {isAskingQ ? "Sending…" : "Submit Question"}
              </button>
            </form>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Questions ({visibleQuestions.length})
              </h3>

              {visibleQuestions.length === 0 ? (
                <p className="text-slate-600 italic text-center py-10">
                  No questions yet. Be the first!
                </p>
              ) : (
                <div className="space-y-3">
                  {visibleQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50"
                    >
                      <p className="text-slate-200 text-base leading-relaxed">{q.text}</p>
                      <p className="text-xs text-slate-500 mt-2">▲ {q.votes} upvotes</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM TAB BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 p-2 z-30 pb-safe">
        <div className="flex justify-center gap-2 max-w-md mx-auto">
          {(["activity", "qna"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition flex flex-col items-center gap-1 active:scale-95 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              <span className="text-xl">{tab === "activity" ? "📊" : "💬"}</span>
              {tab === "activity" ? "Activity" : "Q&A"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}