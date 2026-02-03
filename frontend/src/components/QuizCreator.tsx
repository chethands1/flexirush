"use client";

import { useState } from "react";

interface Question {
  id: string;
  text: string;
  options: string[];
  correct_index: number;
  time_limit: number;
}

interface QuizCreatorProps {
  sessionCode: string;
  onClose: () => void;
}

export default function QuizCreator({ sessionCode, onClose }: QuizCreatorProps) {
  const [title, setTitle] = useState("Fun Quiz");
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "", options: ["", "", "", ""], correct_index: 0, time_limit: 30 }
  ]);
  const [loading, setLoading] = useState(false);

  const updateQuestion = <K extends keyof Question>(idx: number, field: K, value: Question[K]) => {
    const newQs = [...questions];
    newQs[idx][field] = value;
    setQuestions(newQs);
  };

  const updateOption = (qIdx: number, oIdx: number, val: string) => {
    const newQs = [...questions];
    const newOptions = [...newQs[qIdx].options];
    newOptions[oIdx] = val;
    newQs[qIdx].options = newOptions;
    setQuestions(newQs);
  };

  const handleLaunch = async () => {
    if (questions.some(q => !q.text.trim() || q.options.some(o => !o.trim()))) {
       alert("Please fill in all questions and options.");
       return;
    }

    setLoading(true);
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
        
        const payload = {
            title,
            questions: questions.map(q => ({
                text: q.text,
                options: q.options,
                correct_index: Number(q.correct_index),
                time_limit: Number(q.time_limit)
            }))
        };

        await fetch(`${API_URL}/api/session/${sessionCode}/quiz/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-2xl p-6 rounded-2xl border border-slate-700 animate-in fade-in zoom-in duration-200 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">🏆 Create Quiz</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition">✕</button>
        </div>
        
        <input 
            className="w-full bg-slate-800 p-3 rounded-xl mb-6 text-white border border-slate-700 focus:border-green-500 outline-none transition font-bold text-lg" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Enter Quiz Title..."
            aria-label="Quiz Title"
        />
        
        <div className="space-y-6 max-h-[50vh] overflow-y-auto mb-6 pr-2 custom-scrollbar">
            {questions.map((q, qIdx) => (
                <div key={q.id} className="p-5 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex justify-between mb-3 items-center">
                        <span className="font-bold text-slate-300 text-sm uppercase tracking-wider">Question {qIdx + 1}</span>
                        <select 
                            className="bg-slate-700 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500 text-white border border-slate-600"
                            value={q.time_limit}
                            onChange={(e) => updateQuestion(qIdx, "time_limit", parseInt(e.target.value))}
                            aria-label={`Time limit for question ${qIdx + 1}`}
                            title="Time Limit"
                        >
                            <option value={10}>10s</option>
                            <option value={20}>20s</option>
                            <option value={30}>30s</option>
                            <option value={60}>60s</option>
                        </select>
                    </div>
                    
                    <input 
                        className="w-full bg-slate-900 p-3 rounded-lg mb-4 text-white placeholder-slate-500 outline-none focus:border-blue-500 border border-slate-700 transition" 
                        placeholder="e.g. What is the capital of France?"
                        value={q.text}
                        onChange={(e) => updateQuestion(qIdx, "text", e.target.value)}
                        aria-label={`Question ${qIdx + 1} Text`}
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                        {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-2">
                                <input 
                                    type="radio" 
                                    name={`correct-${q.id}`} 
                                    checked={q.correct_index === oIdx}
                                    onChange={() => updateQuestion(qIdx, "correct_index", oIdx)}
                                    className="accent-green-500 w-4 h-4 cursor-pointer"
                                    aria-label={`Mark option ${oIdx + 1} as correct`}
                                />
                                <input 
                                    className={`w-full bg-slate-900 p-2 rounded text-sm text-white outline-none border transition ${q.correct_index === oIdx ? 'border-green-500/50' : 'border-slate-700 focus:border-blue-500'}`}
                                    placeholder={`Option ${oIdx + 1}`}
                                    value={opt}
                                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                    aria-label={`Option ${oIdx + 1} for question ${qIdx + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={() => setQuestions([...questions, { id: Date.now().toString(), text: "", options: ["", "", "", ""], correct_index: 0, time_limit: 30 }])} 
                className="px-4 py-3 bg-slate-800 rounded-xl hover:bg-slate-700 text-blue-400 font-bold text-sm transition border border-slate-700 hover:border-blue-500"
            >
                + Add Question
            </button>
            <div className="flex-1"></div>
            <button 
                onClick={handleLaunch} 
                disabled={loading} 
                className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition disabled:opacity-50 flex items-center gap-2 shadow-lg"
            >
                {loading ? <span className="animate-spin text-xl">◌</span> : "🚀 Launch Quiz"}
            </button>
        </div>
      </div>
    </div>
  );
}