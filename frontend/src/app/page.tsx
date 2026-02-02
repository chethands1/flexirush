"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/sessionStore";
import Link from "next/link";

// PATCH: Define a simple interface for History items to avoid 'any'
interface SessionHistoryItem {
  code: string;
  name: string;
  created_at: string;
}

export default function Home() {
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();
  
  // PATCH: Destructure setToken to use in dependency array
  const { token, setToken } = useSessionStore();
  
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);

  // Fetch History if Logged In
  useEffect(() => {
    if (token) {
      fetch("http://localhost:8001/api/session/my-sessions", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if(res.status === 401) {
           setToken(null); // Logout if token expired
           return [];
        }
        return res.json();
      })
      .then(data => setHistory(data || []));
    }
  }, [token, setToken]); // PATCH: Added setToken to dependency array

  const handleCreate = async () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
        const res = await fetch("http://localhost:8001/api/session/create", {
            method: "POST",
            headers
        });
        
        if (!res.ok) throw new Error("Failed to create session");
        
        const data = await res.json();
        router.push(`/presenter/${data.code}`);
    } catch (error) {
        console.error("Create session failed:", error);
        alert("Failed to create session. Is the backend running?");
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim()) router.push(`/join/${joinCode.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT: Actions */}
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-black mb-2 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">
              FlexiRush
            </h1>
            <p className="text-xl text-slate-400">Interactive presentations, polls, and quizzes in real-time.</p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <button 
              onClick={handleCreate}
              className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:scale-105 transition shadow-lg shadow-purple-900/20 mb-6"
            >
              ✨ Create New Session
            </button>

            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-slate-700"></div>
              <span className="shrink mx-4 text-slate-500 text-sm">OR JOIN EXISTING</span>
              <div className="grow border-t border-slate-700"></div>
            </div>

            <form onSubmit={handleJoin} className="mt-6 flex gap-2">
              <input 
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter 6-digit code..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 uppercase tracking-widest font-mono"
              />
              <button type="submit" className="bg-slate-700 hover:bg-slate-600 px-6 rounded-lg font-bold transition">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Dashboard / Auth */}
        <div className="h-full flex flex-col justify-center">
          {!token ? (
            <div className="text-center p-8 bg-slate-900 rounded-2xl border border-slate-800">
              <h3 className="text-2xl font-bold mb-4">Are you a Presenter?</h3>
              <p className="text-slate-400 mb-6">Log in to save your session history and access analytics.</p>
              <div className="flex gap-4 justify-center">
                <Link href="/login" className="px-6 py-2 border border-slate-600 rounded-lg hover:bg-slate-800 transition">Log In</Link>
                <Link href="/register" className="px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition">Sign Up</Link>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col max-h-125">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur">
                <h3 className="font-bold text-xl">Your History</h3>
                <button onClick={() => setToken(null)} className="text-xs text-red-400 hover:text-red-300">Log Out</button>
              </div>
              <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">No previous sessions found.</div>
                ) : (
                  history.map((session) => (
                    <Link key={session.code} href={`/presenter/${session.code}`} className="block">
                      <div className="p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition border border-transparent hover:border-slate-700">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono text-blue-400 font-bold text-lg">{session.code}</span>
                          <span className="text-xs text-slate-500">{new Date(session.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm text-slate-300">{session.name || "Untitled Session"}</div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}