"use client";

import { useEffect, useState, useRef } from "react";
import { useSessionStore } from "@/store/sessionStore";

interface FloatingEmoji {
  id: number;
  emoji: string;
  left: number;
  duration: number;
}

export default function ReactionOverlay() {
  const lastReaction = useSessionStore((state) => state.lastReaction);
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  const prevReactionRef = useRef<string | null>(null);
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  useEffect(() => {
    if (!lastReaction || lastReaction === prevReactionRef.current) return;
    prevReactionRef.current = lastReaction;

    const emojiChar = lastReaction.split("-")[0];
    const newId = Date.now();
    const duration = 2 + Math.random() * 2;

    const newEmoji: FloatingEmoji = {
      id: newId,
      emoji: emojiChar,
      left: Math.random() * 90,
      duration: duration
    };

    requestAnimationFrame(() => {
      setEmojis((prev) => [...prev, newEmoji]);
    });

    const timer = setTimeout(() => {
      setEmojis((prev) => prev.filter((e) => e.id !== newId));
    }, duration * 1000);

    timeoutsRef.current.add(timer);

    // PATCH: Copy ref to local variable for stable cleanup
    const currentTimeouts = timeoutsRef.current;
    return () => {
      currentTimeouts.forEach(clearTimeout);
      currentTimeouts.clear();
    };
  }, [lastReaction]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(100%) scale(0.5); opacity: 1; }
          100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
        }
        .animate-float {
          animation-name: float-up;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>

      {emojis.map((e) => (
        <div
          key={e.id}
          className="absolute bottom-0 text-4xl animate-float"
          /* webhint: ignore inline-styles */
          style={{ 
            left: `${e.left}%`,
            animationDuration: `${e.duration}s` 
          }}
        >
          {e.emoji}
        </div>
      ))}
    </div>
  );
}