"use client";

import { useEffect, useState, useRef } from "react";

interface Bubble {
  id: number;
  text: string;
  left: number;
  speed: number;
  scale: number;
  color: string;
}

export default function TransientThoughts({ responses }: { responses: string[] }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const prevCountRef = useRef(0);

  useEffect(() => {
    // 1. Sync Logic: Only trigger if we have *more* responses than before
    if (responses.length > prevCountRef.current) {
      const diff = responses.length - prevCountRef.current;
      
      // Backend prepends new items, so we take the top 'diff' items
      const newThoughts = responses.slice(0, diff);

      newThoughts.forEach((text, i) => {
        const id = Date.now() + i;
        const speed = 5 + Math.random() * 3; // Slower, smoother float
        
        // Randomize colors for visual variety
        const colors = [
            "from-blue-600 to-purple-600",
            "from-pink-500 to-rose-500",
            "from-amber-500 to-orange-600", 
            "from-emerald-500 to-teal-600"
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newBubble: Bubble = {
          id,
          text,
          left: Math.random() * 80 + 10, // Random X position (10% to 90%)
          speed,
          scale: 0.9 + Math.random() * 0.3,
          color: randomColor
        };

        // Add bubble to state
        setBubbles((prev) => [...prev, newBubble]);

        // Self-Cleanup: Remove this specific bubble after its animation ends
        setTimeout(() => {
          setBubbles((prev) => prev.filter((b) => b.id !== id));
        }, speed * 1000);
      });

      // Update ref so we don't re-process these
      prevCountRef.current = responses.length;
    }
  }, [responses]);

  return (
    <div className="relative w-full h-96 overflow-hidden bg-slate-900/50 rounded-xl border border-slate-700 backdrop-blur-sm">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100%) scale(0.5); opacity: 0; }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          80% { opacity: 1; }
          100% { transform: translateY(-400px) scale(1.2); opacity: 0; }
        }
        .animate-float-thought {
          animation-name: floatUp;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>

      {bubbles.map((b) => (
        <div
          key={b.id}
          className={`absolute bottom-0 px-6 py-3 bg-linear-to-r ${b.color} rounded-full text-white font-bold shadow-xl animate-float-thought whitespace-nowrap z-10 border border-white/20`}
          /* webhint: ignore inline-styles */
          style={{
            left: `${b.left}%`,
            animationDuration: `${b.speed}s`,
            transform: `scale(${b.scale})`,
          }}
        >
          {b.text}
        </div>
      ))}
      
      {/* Empty State */}
      {responses.length === 0 && bubbles.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 opacity-50 animate-pulse">
          <span className="text-4xl mb-2">💭</span>
          <span className="italic font-medium">Waiting for thoughts...</span>
        </div>
      )}
    </div>
  );
}