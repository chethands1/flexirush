"use client";

import { useState } from "react";
// Removed unused 'useSessionStore' import entirely since setQuiz wasn't used
import { usePowerPoint } from "@/hooks/usePowerPoint"; 

// --- CONFIGURATION ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

interface Props {
  sessionCode: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AIQuizCreator({ sessionCode, onClose, onSuccess }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { isPPT, getSlideContext } = usePowerPoint();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    
    try {
      // 1. Generate Quiz Data
      const res = await fetch(`${API_URL}/api/ai/generate-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      
      if (data.questions && data.questions.length > 0) {
        // 2. Push to Session
        await fetch(`${API_URL}/api/session/${sessionCode}/quiz/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        onSuccess();
        onClose();
      } else {
        alert("AI could not generate a quiz. Try a different topic.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleImportSlide = async () => {
      const text = await getSlideContext();
      if (text) {
          setPrompt((prev) => prev + (prev ? "\n" : "") + "Context from Slide: " + text);
      } else {
          alert("Please select the text on your slide first, then click this button!");
      }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-in fade-in backdrop-blur-sm">
      <div className="bg-slate-900 border border-purple-500/30 p-6 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(168,85,247,0.2)]">
        <div className="flex justify-between items-center mb-6">
            {/* Tailwind v4 Update: bg-linear-to-r */}
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-400">
                ✨ AI Quiz Designer
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                    What is the quiz about?
                </label>
                
                <div className="relative">
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. 'The history of Bangalore' or 'Quantum Physics basics'..."
                        className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white h-32 outline-none focus:border-purple-500 transition resize-none"
                    />
                    
                    {isPPT && (
                        <button 
                            onClick={handleImportSlide}
                            className="absolute bottom-4 right-4 bg-[#D04423] hover:bg-[#B03415] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1 transition animate-in zoom-in"
                            title="Read selected text from PowerPoint slide"
                        >
                            <span className="text-sm">📝</span> Import Slide Text
                        </button>
                    )}
                </div>
            </div>

            <button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                // Tailwind v4 Update: bg-linear-to-r
                className="w-full py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Thinking...
                    </>
                ) : (
                    <>
                        <span>✨ Generate Quiz</span>
                    </>
                )}
            </button>
            
            {isPPT && (
                <p className="text-[10px] text-center text-slate-500">
                    💡 <strong>Pro Tip:</strong> Select text on your slide and click &quot;Import&quot; to generate questions instantly.
                </p>
            )}
        </div>
      </div>
    </div>
  );
}