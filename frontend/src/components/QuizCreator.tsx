"use client";

import { useState } from "react";

// PATCH: Strict types to eliminate 'any'
interface Question {
  id: string;
  text: string;
  options: string[];
  correct_index: number;
  time_limit: number;
}

export default function QuizCreator({ sessionCode, onClose }: { sessionCode: string; onClose: () => void }) {
  const [title, setTitle] = useState("Fun Quiz");
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "", options: ["", "", "", ""], correct_index: 0, time_limit: 30 }
  ]);
  const [loading, setLoading] = useState(false);

  // PATCH: Typed helper to update question fields safely
  const updateQuestion = <K extends keyof Question>(idx: number, field: K, value: Question[K]) => {
    const newQs = [...questions];
    newQs[idx][field] = value;
    setQuestions(newQs);
  };

  const updateOption = (qIdx: number, oIdx: number, val: string) => {
    const newQs = [...questions];
    // Create a new array for options to ensure React detects the change
    const newOptions = [...newQs[qIdx].options];
    newOptions[oIdx] = val;
    newQs[qIdx].options = newOptions;
    setQuestions(newQs);
  };

  const handleLaunch = async () => {
    // Basic validation
    if (questions.some(q => !q.text.trim() || q.options.some(o => !o.trim()))) {
       alert("Please fill in all questions and options.");
       return;
    }

    setLoading(true);
    try {
        await fetch(`http://localhost:8001/api/session/${sessionCode}/quiz/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, questions })
        });
        onClose();
    } catch (error) {
        console.error(error);
        alert("Failed to start quiz.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 w-full max-w-2xl p-6 rounded-2xl border border-slate-700 animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-bold mb-4 text-white">Create Quiz</h2>
        
        <input 
            aria-label="Quiz Title"
            className="w-full bg-slate-800 p-2 rounded mb-4 text-white border border-slate-700 focus:border-blue-500 outline-none transition" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Enter Quiz Title..."
        />
        
        <div className="space-y-6 max-h-[50vh] overflow-y-auto mb-4 pr-2 custom-scrollbar">
            {questions.map((q, qIdx) => (
                <div key={q.id} className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                    <div className="flex justify-between mb-2">
                        <span className="font-bold text-slate-300">Question {qIdx + 1}</span>
                        
                        <select 
                            aria-label="Time limit per question"
                            className="bg-slate-700 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-white"
                            value={q.time_limit}
                            onChange={(e) => updateQuestion(qIdx, "time_limit", parseInt(e.target.value))}
                        >
                            <option value={10}>10s</option>
                            <option value={20}>20s</option>
                            <option value={30}>30s</option>
                            <option value={60}>60s</option>
                        </select>
                    </div>
                    
                    <input 
                        aria-label={`Question ${qIdx + 1} text`}
                        className="w-full bg-slate-700 p-2 rounded mb-3 text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500 transition" 
                        placeholder="e.g. What is the capital of France?"
                        value={q.text}
                        onChange={(e) => updateQuestion(qIdx, "text", e.target.value)}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-2">
                                <input 
                                    type="radio" 
                                    name={`correct-${q.id}`} 
                                    aria-label={`Mark option ${oIdx + 1} as correct`}
                                    checked={q.correct_index === oIdx}
                                    onChange={() => updateQuestion(qIdx, "correct_index", oIdx)}
                                    className="accent-green-500 w-4 h-4 cursor-pointer"
                                />
                                
                                <input 
                                    aria-label={`Option ${oIdx + 1} text`}
                                    className="w-full bg-slate-700 p-2 rounded text-sm text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500 transition"
                                    placeholder={`Option ${oIdx + 1}`}
                                    value={opt}
                                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        
        <button 
            onClick={() => setQuestions([...questions, { id: Date.now().toString(), text: "", options: ["", "", "", ""], correct_index: 0, time_limit: 30 }])} 
            className="text-blue-400 text-sm mb-6 hover:underline font-bold"
        >
            + Add Question
        </button>

        <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-3 bg-slate-800 rounded hover:bg-slate-700 text-slate-300 transition">Cancel</button>
            <button 
                onClick={handleLaunch} 
                disabled={loading} 
                className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded transition disabled:opacity-50 flex justify-center items-center gap-2"
            >
                {loading ? (
                    <>
                       <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                       Starting...
                    </>
                ) : "Launch Quiz"}
            </button>
        </div>
      </div>
    </div>
  );
}