"use client";

import { useState } from "react";
import { useSessionStore } from "@/store/sessionStore";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useSessionStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. LOGIN REQUEST
      const loginRes = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        throw new Error(loginData.detail || "Login failed");
      }

      // Save Auth Data
      setToken(loginData.access_token);
      setUser(loginData.user);

      // 2. AUTO-CREATE SESSION (The Fix)
      // Instead of navigating to /api/..., we fetch it here
      const sessionRes = await fetch(`${API_URL}/api/session`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${loginData.access_token}`
        },
        body: JSON.stringify({ title: "Untitled Session" }) 
      });

      if (!sessionRes.ok) {
          // Fallback: If auto-create fails, just go to home
          console.error("Failed to auto-create session");
          window.location.href = "/";
          return;
      }

      const sessionData = await sessionRes.json();
      
      // 3. REDIRECT TO DASHBOARD
      // Check if we are in sidebar mode to keep the UI correct
      const isSidebar = window.location.search.includes("sidebar=true");
      const queryParam = isSidebar ? "?sidebar=true" : "";
      
      // Use the code from the backend to construct the URL
      window.location.href = `/presenter/${sessionData.code}${queryParam}`; 
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">FlexiRush Login</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-slate-400">Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-slate-400">Password</label>
            <input
              id="password"
              type="password"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}