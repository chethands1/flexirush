"use client";
import { useState} from "react";

export default function WinningWheel({ 
  participants, 
  onClose 
}: { 
  participants: string[]; 
  onClose: () => void 
}) {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentName, setCurrentName] = useState("Ready?");

  const handleSpin = () => {
    if (participants.length === 0) return;
    setSpinning(true);
    setWinner(null);

    let counter = 0;
    // Fast shuffle effect
    const interval = setInterval(() => {
        setCurrentName(participants[Math.floor(Math.random() * participants.length)]);
        counter++;
        if (counter > 20) {
            clearInterval(interval);
            // Pick Winner
            const finalWinner = participants[Math.floor(Math.random() * participants.length)];
            setWinner(finalWinner);
            setCurrentName(finalWinner);
            setSpinning(false);
        }
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-12 text-center shadow-2xl overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 to-blue-900/20" />
        
        <h2 className="text-2xl font-bold text-slate-400 mb-8 uppercase tracking-widest relative z-10">
            Picking a Winner
        </h2>

        {/* The "Wheel" Display */}
        <div className="h-40 flex items-center justify-center mb-8 relative z-10">
            <div className={`text-6xl sm:text-7xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400 transition-all ${winner ? "scale-125 animate-bounce" : ""}`}>
                {participants.length > 0 ? currentName : "No Participants Yet"}
            </div>
        </div>

        {winner && (
            <div className="text-xl text-yellow-400 font-bold mb-8 animate-pulse relative z-10">
                🎉 WINNER! 🎉
            </div>
        )}

        <div className="flex gap-4 justify-center relative z-10">
            <button 
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition"
            >
                Close
            </button>
            <button 
                onClick={handleSpin}
                disabled={spinning || participants.length === 0}
                className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {spinning ? "Spinning..." : winner ? "Spin Again" : "Spin Wheel 🎲"}
            </button>
        </div>
      </div>
    </div>
  );
}