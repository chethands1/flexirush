"use client";

import { useState } from "react";

interface CreatePollFormProps {
  sessionCode: string;
  onClose: () => void;
}

export default function CreatePollForm({ sessionCode, onClose }: CreatePollFormProps) {
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("multiple_choice");
  const [options, setOptions] = useState(["Yes", "No"]);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) => setOptions(options.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
      
      // Strict Payload Construction
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        question,
        type,
      };

      if (type === "multiple_choice") {
        payload.options = options.filter(o => o.trim()).map(o => ({ label: o, votes: 0 }));
      } else {
        // IMPORTANT: Backend expects empty list for these types
        payload.options = []; 
      }

      await fetch(`${API_URL}/api/session/${sessionCode}/poll/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to start poll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-in fade-in backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">📊 Create Poll</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition font-bold text-xl">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Question</label>
            <input 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)} 
              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-600" 
              placeholder="What would you like to ask?" 
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Poll Type</label>
            <div className="grid grid-cols-2 gap-2">
                {[
                    {id: 'multiple_choice', label: 'Multiple Choice', icon: '📊'},
                    {id: 'rating', label: 'Star Rating', icon: '⭐'},
                    {id: 'word_cloud', label: 'Word Cloud', icon: '☁️'},
                    {id: 'open_ended', label: 'Open Ended', icon: '💬'}
                ].map(t => (
                    <button 
                        key={t.id}
                        type="button"
                        onClick={()=>setType(t.id)}
                        className={`p-3 rounded-lg border text-sm font-bold flex items-center gap-2 transition ${type===t.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                    >
                        <span>{t.icon}</span> {t.label}
                    </button>
                ))}
            </div>
          </div>

          {type === "multiple_choice" && (
            <div className="space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <label className="text-xs font-bold text-slate-500 uppercase">Options</label>
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input 
                    value={opt} 
                    onChange={(e) => handleOptionChange(i, e.target.value)} 
                    className="flex-1 bg-slate-900 border border-slate-700 p-3 rounded-lg text-sm text-white focus:border-blue-500 outline-none" 
                    placeholder={`Option ${i + 1}`} 
                  />
                  {options.length > 2 && <button type="button" onClick={() => removeOption(i)} className="text-red-500 hover:bg-red-900/20 px-3 rounded">✕</button>}
                </div>
              ))}
              <button type="button" onClick={addOption} className="text-xs text-blue-400 font-bold hover:underline">+ Add Option</button>
            </div>
          )}

          <div className="pt-2">
            <button type="submit" disabled={loading || !question.trim()} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-[0.98]">
                {loading ? "Launching..." : "🚀 Launch Poll"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}