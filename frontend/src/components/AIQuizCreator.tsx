"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

// --- TYPES ---
interface RawOption {
  label?: string;
}

interface RawQuestion {
  text?: string;
  question?: string;
  options?: (string | RawOption)[];
  correct_option?: number;
  answer?: string;
}

interface RawQuizData {
  title?: string;
  questions?: RawQuestion[];
}

interface AIQuizCreatorProps {
  sessionCode: string;
  onClose: () => void;
  onSuccess?: (quizData: Record<string, unknown>) => void; 
}

export default function AIQuizCreator({ sessionCode, onClose, onSuccess }: AIQuizCreatorProps) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
        setError("Please enter a topic.");
        return;
    }
    
    setLoading(true);
    setError("");
    setStatus("🧠 AI is thinking...");

    try {
      // 1. GENERATE
      const genRes = await fetch(`${API_URL}/api/ai/generate-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: topic }),
      });

      if (!genRes.ok) throw new Error("AI Generation Failed");
      
      const responseData = await genRes.json();
      
      // --- SANITIZE DATA ---
      // 1. Unwrap the data safely
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawData = ((responseData as any).quiz || responseData) as RawQuizData;

      // 2. Force it into the correct structure using types
      const questions = (rawData.questions || []).map((q) => {
          const cleanOptions = Array.isArray(q.options) 
            ? q.options.map((o) => {
                if (typeof o === 'object' && o !== null) {
                    return o.label || JSON.stringify(o);
                }
                return String(o);
            }) 
            : ["Yes", "No"];
          
          // Fix Correct Option: Ensure it's an INTEGER Index
          let correctIdx = 0;
          if (typeof q.correct_option === 'number') {
              correctIdx = q.correct_option;
          } else if (typeof q.answer === 'string') {
              const foundIdx = cleanOptions.findIndex((o) => o.toLowerCase() === (q.answer || "").toLowerCase());
              if (foundIdx !== -1) correctIdx = foundIdx;
          }

          return {
              text: q.text || q.question || "Untitled Question",
              options: cleanOptions,
              correct_option: correctIdx
          };
      });

      const payload = {
          title: rawData.title || `Quiz: ${topic}`,
          questions: questions
      };

      setStatus("🚀 Launching Quiz...");

      // 3. START SESSION
      const startRes = await fetch(`${API_URL}/api/session/${sessionCode}/quiz/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
      });

      if (!startRes.ok) {
          const errDetail = await startRes.json();
          const msg = JSON.stringify(errDetail.detail, null, 2);
          alert(`Database Rejected Quiz:\n${msg}`);
          throw new Error("Backend validation failed");
      }

      if (onSuccess) onSuccess(payload);
      onClose();

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition text-xl font-bold p-2">✕</button>

        <div className="text-center mb-8">
            <span className="text-5xl mb-4 block animate-bounce">✨</span>
            {/* UPDATED: Changed bg-gradient-to-r to bg-linear-to-r per linter */}
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-600">AI Quiz Generator</h2>
        </div>

        <div className="space-y-6">
          <input 
              type="text" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              placeholder="e.g. 'Space Exploration'..." 
              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white text-lg outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              autoFocus 
          />
          
          {status && <div className="text-center text-purple-400 font-bold animate-pulse">{status}</div>}
          
          {error && (
              <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm text-center font-bold whitespace-pre-wrap">
                  {error}
              </div>
          )}

          <button 
            onClick={handleGenerate} 
            disabled={loading}
            // UPDATED: Changed bg-gradient-to-r to bg-linear-to-r
            className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${loading ? "bg-slate-800 text-slate-500" : "bg-linear-to-r from-purple-600 to-pink-600 hover:scale-105 text-white"}`}
          >
            {loading ? "Generating..." : "Generate & Launch 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}