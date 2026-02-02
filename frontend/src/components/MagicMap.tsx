"use client";

import { useMemo } from "react";
import { useSessionStore } from "@/store/sessionStore";

export default function MagicMap() {
  const { participants } = useSessionStore();

  // FIX: Use deterministic "randomness" based on User ID.
  // This makes the function pure (Same Input = Same Output), satisfying the linter.
  const locations = useMemo(() => {
    return participants.map((p) => {
      // Simple hash generation from string
      let hash = 0;
      for (let i = 0; i < p.id.length; i++) {
        hash = p.id.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Map hash to coordinate ranges (Lat: -70 to 70, Lng: -180 to 180)
      const lat = (Math.abs(hash) % 140) - 70;
      const lng = (Math.abs(hash >> 16) % 360) - 180;

      return {
        id: p.id,
        name: p.name,
        lat,
        lng,
      };
    });
  }, [participants]);

  return (
    <div className="w-full h-full bg-slate-950 relative overflow-hidden flex items-center justify-center">
      {/* Background Map Placeholder */}
      <div 
        className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"
        /* webhint: ignore inline-styles */
        style={{ filter: "invert(1)" }}
      ></div>

      {locations.map((loc) => (
        <div
          key={loc.id}
          className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
          /* webhint: ignore inline-styles */
          style={{
            top: `${(loc.lat + 90) / 1.8}%`, // Equirectangular projection approximation
            left: `${(loc.lng + 180) / 3.6}%`,
          }}
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-ping absolute"></div>
          <div className="w-3 h-3 bg-white rounded-full relative z-10"></div>
          <div className="mt-2 bg-black/70 px-2 py-1 rounded text-xs font-bold text-white whitespace-nowrap z-20 backdrop-blur-sm border border-slate-700">
            {loc.name}
          </div>
        </div>
      ))}

      {locations.length === 0 && (
        <div className="z-10 text-center">
          <h3 className="text-2xl font-bold text-slate-500">Waiting for signals...</h3>
          <p className="text-slate-600">Audience locations will appear here.</p>
        </div>
      )}
    </div>
  );
}