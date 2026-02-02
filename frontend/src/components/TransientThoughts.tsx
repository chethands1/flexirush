"use client";

import { useEffect, useState, useRef } from "react";

interface Bubble {
  id: number;
  text: string;
  left: number;
  speed: number;
  scale: number;
}

export default function TransientThoughts({ responses }: { responses: string[] }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  
  // PATCH: Tracking state to prevent render loops
  const processedCount = useRef(0);
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  useEffect(() => {
    // 1. Safety Check: Only proceed if new responses have arrived
    if (responses.length <= processedCount.current) return;

    // 2. Data Extraction
    const newestText = responses[0];
    const newId = Date.now();
    const speed = 4 + Math.random() * 3;

    const newBubble: Bubble = {
      id: newId,
      text: newestText,
      left: Math.random() * 80 + 10,
      speed: speed,
      scale: Math.random() * 0.3 + 0.9
    };

    // 3. PATCH: Use requestAnimationFrame to prevent cascading render warnings
    requestAnimationFrame(() => {
      setBubbles((prev) => [...prev, newBubble]);
      processedCount.current = responses.length;
    });

    // 4. Cleanup Timer: Fixed variable name to 'setBubbles'
    const timer = setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== newId));
      timeoutsRef.current.delete(timer);
    }, speed * 1000);

    timeoutsRef.current.add(timer);

    // 5. PATCH: Capture the current ref value for stable cleanup
    const activeTimeouts = timeoutsRef.current;
    return () => {
      activeTimeouts.forEach(clearTimeout);
      activeTimeouts.clear();
    };
  }, [responses]); // Dependency on responses is sufficient with ref check

  return (
    <div className="relative w-full h-96 overflow-hidden bg-slate-900/50 rounded-xl border border-slate-700">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100%) scale(0.5); opacity: 0; }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          90% { opacity: 1; }
          100% { transform: translateY(-400px) scale(1.5); opacity: 0; }
        }
        .animate-float-thought {
          animation-name: floatUp;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>

      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-0 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold shadow-lg animate-float-thought whitespace-nowrap z-10"
          style={{
            left: `${b.left}%`,
            animationDuration: `${b.speed}s`,
            transform: `scale(${b.scale})`
          }}
        >
          {b.text}
        </div>
      ))}
      
      {responses.length === 0 && bubbles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 italic">
          Waiting for audience thoughts...
        </div>
      )}
    </div>
  );
}