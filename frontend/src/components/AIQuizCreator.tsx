"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

interface AIQuizCreatorProps {
  sessionCode: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AIQuizCreator({ sessionCode, onClose, onSuccess }: AIQuizCreatorProps) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");

    try {
      // 1. Generate Quiz Data from AI
      const genRes = await fetch(`${API_URL}/api/ai/generate-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: topic }),
      });

      if (!genRes.ok) throw new Error("AI Service Unreachable");
      const quizData = await genRes.json();

      // --- 🛡️ FRONTEND FIREWALL ---
      // Check if questions actually exist before sending to backend
      if (!quizData.questions || quizData.questions.length === 0) {
          throw new Error("AI returned 0 questions. Please try a different topic.");
      }

      // 2. Start Quiz on Session (Only if valid)
      const startRes = await fetch(`${API_URL}/api/session/${sessionCode}/quiz/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      if (!startRes.ok) throw new Error("Failed to launch quiz on backend.");

      onSuccess();
      onClose();
    } catch (err: unknown) {
        if(err instanceof Error) {
            setError(err.message);
        } else {
            setError("Unknown error occurred");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-purple-500 to-pink-500"></div>

        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
        >
            ✕
        </button>

        <div className="text-center mb-8">
            <div className="text-4xl mb-4 animate-bounce">✨</div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400 mb-2">
                AI Quiz Generator
            </h2>
            <p className="text-slate-400 text-sm">
                Enter a topic, and I&apos;ll build a 5-question quiz instantly.
            </p>
        </div>

        <div className="space-y-4">
            <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. 1980s Pop Music, Quantum Physics, Taylor Swift..." 
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 transition text-lg placeholder:text-slate-600"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />

            {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm text-center font-medium animate-in slide-in-from-top-2">
                    ⚠️ {error}
                </div>
            )}

            <button 
                onClick={handleGenerate} 
                disabled={loading || !topic.trim()}
                className="w-full py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-lg shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generating...
                    </>
                ) : (
                    "Generate & Launch 🚀"
                )}
            </button>
        </div>
      </div>
    </div>
  );
}