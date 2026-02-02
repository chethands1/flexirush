"use client";

import { useState, useEffect, useMemo } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { useRealtime } from "@/hooks/useRealtime";
import { useSearchParams } from "next/navigation"; 

export default function EmbedPresenterPage({ params }: { params: Promise<{ code: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null);
  const searchParams = useSearchParams();
  const isTransparent = searchParams.get("transparent") === "true";

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const code = resolvedParams?.code || "";
  
  useRealtime(code, "presenter");

  const { 
    participants, 
    currentPoll, 
    pollResults,
    quiz, 
    quizScores
  } = useSessionStore();

  // --- RENDERING HELPERS ---
  const totalPollVotes = useMemo(() => {
    if (!currentPoll?.options) return 0;
    return (currentPoll.options as { label: string; votes: number }[]).reduce((acc, curr) => {
        const liveVotes = pollResults?.[curr.label];
        return acc + (liveVotes !== undefined ? liveVotes : (curr.votes || 0));
    }, 0);
  }, [currentPoll, pollResults]);

  if (!code) return null;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center font-sans transition-colors overflow-hidden ${isTransparent ? 'bg-transparent' : 'bg-slate-950 p-4'} text-white`}>
      
      {/* --- IDLE STATE --- */}
      {!quiz && !currentPoll && (
        <div className={`text-center animate-pulse ${isTransparent ? 'opacity-0' : 'opacity-50'}`}>
            <h1 className="text-4xl font-black tracking-widest text-slate-500">WAITING...</h1>
            <p className="text-sm uppercase font-bold text-slate-600 mt-2">Join Code: {code}</p>
        </div>
      )}

      {/* --- POLL VIEW --- */}
      {currentPoll && (
        <div className="w-full h-full flex flex-col items-center justify-center animate-in zoom-in duration-300">
            {/* HIDE QUESTION IN TRANSPARENT MODE TO EMPHASIZE DATA */}
            {!isTransparent && (
                <h2 className="text-3xl sm:text-5xl font-bold text-center mb-8 drop-shadow-lg leading-tight">
                    {currentPoll.question}
                </h2>
            )}

            {currentPoll.type === 'multiple_choice' && (
                <div className="space-y-4 w-full max-w-4xl">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {currentPoll.options?.map((opt: any, idx: number) => {
                        const count = pollResults?.[opt.label] ?? opt.votes ?? 0;
                        const percent = totalPollVotes > 0 ? (count / totalPollVotes) * 100 : 0;
                        return (
                            <div key={idx} className={`relative h-16 w-full rounded-xl overflow-hidden ${isTransparent ? 'bg-black/40 backdrop-blur-md border border-white/10' : 'bg-slate-800/50 border border-slate-700/50'} shadow-xl transition-all`}>
                                <div 
                                    className="absolute top-0 left-0 h-full bg-blue-600/80 transition-all duration-500 ease-out" 
                                    /* webhint: ignore inline-styles */
                                    style={{ width: `${percent}%` }}
                                ></div>
                                <div className="absolute inset-0 flex justify-between items-center px-6 z-10">
                                    <span className="text-xl font-bold text-white shadow-black drop-shadow-md">{opt.label}</span>
                                    <span className="text-2xl font-mono font-bold text-white shadow-black drop-shadow-md">{Math.round(percent)}%</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {currentPoll.type === 'word_cloud' && (
                 <div className="flex flex-wrap gap-6 justify-center items-center py-10 w-full h-full content-center">
                    {Object.entries(pollResults || currentPoll.words || {}).map(([word, count]) => (
                        <span 
                            key={word} 
                            className="text-blue-400 font-bold transition-all duration-300 drop-shadow-lg" 
                            /* webhint: ignore inline-styles */
                            style={{ 
                                fontSize: `${Math.min(3 + (count as number * 1.5), 9)}rem`,
                                textShadow: isTransparent ? '0 4px 15px rgba(0,0,0,0.8)' : 'none',
                                opacity: Math.min(0.6 + (count as number * 0.1), 1)
                            }}
                        >
                            {word}
                        </span>
                    ))}
                 </div>
            )}
            
            {!isTransparent && (
                <div className="text-center mt-6">
                    <span className="bg-slate-800/80 px-4 py-2 rounded-full text-sm font-bold text-slate-300 border border-slate-700">
                        👥 {totalPollVotes} votes | Code: {code}
                    </span>
                </div>
            )}
        </div>
      )}

      {/* --- QUIZ VIEW --- */}
      {quiz && (
        <div className="w-full max-w-4xl text-center animate-in fade-in slide-in-from-bottom-8">
            {quiz.state === "LOBBY" && (
                <div className="transform scale-150">
                    <h1 className="text-6xl font-black text-blue-500 mb-4 drop-shadow-2xl">GET READY</h1>
                    <p className="text-2xl text-white drop-shadow-md">Join at <span className="text-yellow-400 font-mono">flexirush.com</span> code <span className="text-yellow-400 font-mono font-bold">{code}</span></p>
                    <p className="mt-8 text-xl text-slate-300 bg-black/50 px-4 py-1 rounded-full inline-block">{participants.length} players joined</p>
                </div>
            )}

            {quiz.state === "QUESTION" && quiz.questions[quiz.current_index] && (
                <div>
                    <h2 className="text-4xl sm:text-6xl font-bold mb-12 leading-tight drop-shadow-xl text-white">
                        {quiz.questions[quiz.current_index].text}
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                        {quiz.questions[quiz.current_index].options.map((opt: string, i: number) => (
                            <div key={i} className={`p-8 rounded-2xl text-3xl font-bold text-white shadow-2xl ${['bg-red-600', 'bg-blue-600', 'bg-yellow-600', 'bg-green-600'][i % 4]} bg-opacity-90 backdrop-blur-sm border-2 border-white/20`}>
                                {opt}
                            </div>
                        ))}
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-8 w-full bg-slate-800/50 h-4 rounded-full overflow-hidden border border-white/10">
                        <div 
                            className="h-full bg-white origin-left shadow-[0_0_10px_white]" 
                            /* webhint: ignore inline-styles */
                            style={{ width: '100%', animation: `width_linear ${quiz.questions[quiz.current_index].time_limit || 30}s linear forwards` }}
                        ></div>
                    </div>
                </div>
            )}

            {quiz.state === "LEADERBOARD" && (
                <div className={`bg-slate-900/90 p-8 rounded-3xl border border-slate-700 shadow-2xl inline-block ${isTransparent ? 'min-w-150 backdrop-blur-xl' : 'min-w-125'}`}>
                    <h2 className="text-4xl font-bold text-yellow-400 mb-6">🏆 TOP PLAYERS</h2>
                    {Object.entries(quizScores || {}).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 5).map(([name, score], i) => (
                        <div key={name} className="flex justify-between items-center py-4 border-b border-slate-800 last:border-0">
                            <span className="text-2xl font-bold text-white">{i+1}. {name}</span>
                            <span className="text-2xl font-mono text-blue-400">{score as number}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
}