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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Logic matches backend Pydantic model
      const payload = {
        question,
        type,
        options: type === "multiple_choice" 
          ? options.map(opt => ({ label: opt, votes: 0 })) 
          : [],
        correct_option: null 
      };

      const res = await fetch(`http://localhost:8001/api/session/${sessionCode}/poll/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.detail?.[0]?.msg || "Failed to start poll"}`);
      } else {
        onClose();
      }
    } catch {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-white">Create Poll</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {/* FIX: Added htmlFor to link label to input */}
            <label htmlFor="poll-question" className="text-xs font-bold text-slate-500 uppercase">Question</label>
            <input 
              id="poll-question"
              className="w-full bg-slate-800 p-3 rounded-lg text-white border border-slate-700 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="What do you think?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div>
            {/* FIX: Added htmlFor and aria-label to satisfy accessibility linter */}
            <label htmlFor="poll-type" className="text-xs font-bold text-slate-500 uppercase">Type</label>
            <select 
              id="poll-type"
              aria-label="Poll Type"
              className="w-full bg-slate-800 p-3 rounded-lg text-white border border-slate-700 mt-1"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="word_cloud">Word Cloud</option>
              <option value="rating">Rating (1-5)</option>
              <option value="open_ended">Open Ended</option>
            </select>
          </div>

          {type === "multiple_choice" && (
            <div>
              <label htmlFor="poll-options" className="text-xs font-bold text-slate-500 uppercase">Options (comma separated)</label>
              <input 
                id="poll-options"
                className="w-full bg-slate-800 p-3 rounded-lg text-white border border-slate-700 mt-1"
                placeholder="Yes, No, Maybe"
                value={options.join(", ")}
                onChange={(e) => setOptions(e.target.value.split(",").map(s => s.trim()))}
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-400 hover:bg-slate-800 rounded-lg font-bold">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg">
              {loading ? "Launching..." : "Launch Poll 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}