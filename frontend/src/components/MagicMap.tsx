"use client";

import { useEffect, useRef } from "react";
import { useSessionStore } from "@/store/sessionStore";

export default function MagicMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const participants = useSessionStore((s) => s.participants);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; r: number; color: string; vx: number; vy: number }[] = [];

    // Initialize random dots for participants
    const initParticles = () => {
        particles = participants.map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 3 + 2,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
        }));
    };

    const resize = () => {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        initParticles();
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
        // Clear screen with fade effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw connecting lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off walls
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
        });

        animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationFrameId);
    };
  }, [participants]);

  return (
    <div className="w-full h-full relative bg-slate-950 overflow-hidden">
        <div 
            className="absolute inset-0 opacity-20 pointer-events-none" 
            /* webhint: ignore inline-styles */
            style={{ 
                 backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
            }}
        />
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Overlay Text */}
        <div className="absolute bottom-8 left-8 bg-slate-900/80 p-4 rounded-xl border border-slate-700 backdrop-blur-md">
            <h3 className="text-white font-bold text-lg">Active Nodes</h3>
            <p className="text-blue-400 font-mono text-2xl">{participants.length}</p>
        </div>
    </div>
  );
}