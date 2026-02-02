"use client";

import { useState } from "react";

// --- CONFIGURATION ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

interface AIQuizCreatorProps {
  sessionCode: string;
  onClose: () => void;
  // We keep this for compatibility, but we will handle the launch internally
  onSuccess?: (quizData: Record<string, unknown>) => void; 
}

export default function AIQuizCreator({ sessionCode, onClose, onSuccess }: AIQuizCreatorProps) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(""); // Feedback text

  const handleGenerate = async () => {
    if (!topic.trim()) {
        setError("Please enter a topic.");
        return;
    }
    
    setLoading(true);
    setError("");
    setStatus("🧠 AI is thinking...");

    try {
      // 1. GENERATE THE QUIZ
      // We use the specific AI endpoint
      const genRes = await fetch(`${API_URL}/api/ai/generate-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: topic }),
      });

      if (!genRes.ok) {
          const errData = await genRes.json().catch(() => ({}));
          throw new Error(errData.detail || "AI Generation Failed");
      }
      
      const quizData = await genRes.json();
      setStatus("🚀 Launching Quiz...");

      // 2. START THE QUIZ IN THE SESSION
      const startRes = await fetch(`${API_URL}/api/session/${sessionCode}/quiz/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quizData),
      });

      if (!startRes.ok) {
          throw new Error("Failed to start quiz session");
      }

      // 3. SUCCESS
      if (onSuccess) onSuccess(quizData);
      onClose();

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to generate quiz. Try a different topic.");
      }
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition text-xl font-bold p-2"
        >
            ✕
        </button>

        <div className="text-center mb-8">
            <span className="text-5xl mb-4 block animate-bounce">✨</span>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-600">
                AI Quiz Generator
            </h2>
            <p className="text-slate-400 mt-2">
                Powered by Gemini 1.5 Flash
            </p>
        </div>

        <div className="space-y-6">
          <input 
              type="text" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              placeholder="e.g. 'Space Exploration', 'JavaScript'..." 
              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white text-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-600"
              disabled={loading}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              autoFocus 
          />

          {status && (
              <div className="text-center text-purple-400 font-bold animate-pulse">
                  {status}
              </div>
          )}

          {error && (
              <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm text-center font-bold animate-in slide-in-from-top-1">
                  {error}
              </div>
          )}

          <button 
            onClick={handleGenerate} 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${
                loading 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/25 active:scale-95"
            }`}
          >
            {loading ? (
                <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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