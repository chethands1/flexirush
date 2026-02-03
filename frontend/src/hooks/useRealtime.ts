"use client";

import { useEffect, useRef } from 'react';
import { useSessionStore, Participant } from '@/store/sessionStore';
import { useRouter } from 'next/navigation';

// --- SMART URL SELECTOR ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
const WS_URL = API_URL.replace(/^http/, 'ws'); 

export function useRealtime(sessionCode: string, myName?: string | null) {
  const ws = useRef<WebSocket | null>(null);
  const router = useRouter();
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  // Stable Store Selectors
  const setConnected = useSessionStore((s) => s.setConnected);
  const setPoll = useSessionStore((s) => s.setPoll);
  const setPollResults = useSessionStore((s) => s.setPollResults); // ✅ ADDED: Needed for Sync
  const setQuestions = useSessionStore((s) => s.setQuestions);
  const setParticipants = useSessionStore((s) => s.setParticipants);
  const setQuiz = useSessionStore((s) => s.setQuiz);
  const setQuizScores = useSessionStore((s) => s.setQuizScores);
  const setLastReaction = useSessionStore((s) => s.setLastReaction);
  const setBranding = useSessionStore((s) => s.setBranding);

  useEffect(() => {
    if (!sessionCode || sessionCode === "undefined" || myName === null) return;

    const connect = () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);

      const rolePath = myName ? encodeURIComponent(myName) : "presenter";
      const wsUrl = `${WS_URL}/ws/${sessionCode}/${rolePath}`;
      
      console.log(`🔌 Connecting WS to ${wsUrl}`);
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('✅ WS Connected');
        setConnected(true);
        
        // Initial State Fetch
        fetch(`${API_URL}/api/session/${sessionCode}/state`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (!data) return;
            
            // Sync Poll Data
            if (data.current_poll) setPoll(data.current_poll);
            if (data.poll_results) setPollResults(data.poll_results); // ✅ Sync existing votes
            
            if (data.questions) setQuestions(data.questions);
            
            if (data.participants) {
                const parts = (data.participants as Array<string | Participant>).map((p) => 
                    typeof p === 'string' ? { id: p, name: p } : p
                );
                setParticipants(parts);
            }

            if (data.quiz) {
                setQuiz(data.quiz);
                if (data.quiz_scores) setQuizScores(data.quiz_scores);
            } else {
                setQuiz(null);
            }
            if (data.branding) setBranding(data.branding);
          })
          .catch(err => console.error("❌ Initial sync failed:", err));
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            // ✅ CASE 1: Poll Started (Reset Results)
            case 'POLL_START':
              setPoll(data.payload);
              setPollResults({}); 
              break;

            // ✅ CASE 2: Live Vote Received (Update Results)
            case 'POLL_RESULTS_UPDATE':
              if (data.payload) setPoll(data.payload);
              if (data.results) setPollResults(data.results);
              break;

            case 'POLL_UPDATE':
              setPoll(data.payload);
              if (!data.payload) setPollResults(null);
              break;
            
            case 'QNA_UPDATE':
              setQuestions(data.payload || []);
              break;

            case 'PARTICIPANT_UPDATE':
              const rawList = data.participants || data.names || data.payload || [];
              if (Array.isArray(rawList)) {
                  const cleanList = rawList.map((p: string | Participant) => 
                      typeof p === 'string' ? { id: p, name: p } : p
                  );
                  setParticipants(cleanList);
              }
              break;

            case 'REACTION':
              setLastReaction(`${data.emoji}-${Date.now()}`);
              break;

            case 'BRANDING_UPDATE':
              setBranding(data.payload || data.branding);
              break;

            case 'QUIZ_UPDATE':
              const quizData = data.quiz || (data.payload ? data.payload.quiz : null) || data.payload;
              const scoreData = data.scores || (data.payload ? data.payload.scores : null);
              
              if (quizData !== undefined) setQuiz(quizData);
              if (scoreData) setQuizScores(scoreData);
              break;

            case 'USER_KICKED':
              if (myName && data.target_name === myName) {
                  alert("You have been kicked from the session.");
                  ws.current?.close(); 
                  router.push('/'); 
              }
              break;
          }
        } catch (e) {
          console.error("WS Parse Error:", e);
        }
      };

      ws.current.onclose = (e) => {
        setConnected(false);
        if (e.code !== 1000 && window.location.pathname.includes(sessionCode)) {
          console.log(`⚠️ WS Closed. Reconnecting in 3s...`);
          reconnectTimeout.current = setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [sessionCode, myName, router, setConnected, setPoll, setPollResults, setQuestions, setParticipants, setQuiz, setQuizScores, setLastReaction, setBranding]);
}