import { useEffect, useRef } from 'react';
import { useSessionStore, Participant } from '@/store/sessionStore';
import { useRouter } from 'next/navigation';

export function useRealtime(sessionCode: string, myName?: string | null) {
  const ws = useRef<WebSocket | null>(null);
  const router = useRouter();
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  // Stable Store Selectors
  const setConnected = useSessionStore((s) => s.setConnected);
  const setPoll = useSessionStore((s) => s.setPoll);
  const setQuestions = useSessionStore((s) => s.setQuestions);
  const setParticipants = useSessionStore((s) => s.setParticipants);
  const setQuiz = useSessionStore((s) => s.setQuiz);
  const setQuizScores = useSessionStore((s) => s.setQuizScores);
  const setLastReaction = useSessionStore((s) => s.setLastReaction);
  const setBranding = useSessionStore((s) => s.setBranding);

  useEffect(() => {
    // 1. Safety Check
    if (!sessionCode || sessionCode === "undefined" || myName === null) return;

    const connect = () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);

      const rolePath = myName ? encodeURIComponent(myName) : "presenter";
      const wsUrl = `ws://localhost:8001/ws/${sessionCode}/${rolePath}`; 
      
      console.log(`🔌 Connecting WS to ${wsUrl}`);
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('✅ WS Connected');
        setConnected(true);
        
        // 2. Initial State Fetch
        fetch(`http://localhost:8001/api/session/${sessionCode}/state`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (!data) return;
            
            if (data.current_poll) setPoll(data.current_poll);
            if (data.questions) setQuestions(data.questions);
            
            // Handle Participants: Check if string or object
            if (data.participants) {
                const parts = (data.participants as Array<string | Participant>).map((p) => 
                    typeof p === 'string' ? { id: p, name: p } : p
                );
                setParticipants(parts);
            }

            if (data.quiz) {
                setQuiz(data.quiz);
                if (data.quiz_scores) setQuizScores(data.quiz_scores);
            }
            if (data.branding) setBranding(data.branding);
          })
          .catch(err => console.error("❌ Initial sync failed:", err));
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'POLL_START':
            case 'POLL_UPDATE':
              setPoll(data.payload || data.poll);
              break;
            
            case 'QNA_UPDATE':
            case 'QUESTION_UPDATE':
              setQuestions(data.payload || data.questions || []);
              break;

            case 'PARTICIPANT_UPDATE':
              // Handle mixed formats safely
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
              
              if (quizData) setQuiz(quizData);
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
          reconnectTimeout.current = setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [sessionCode, myName, router, setConnected, setPoll, setQuestions, setParticipants, setQuiz, setQuizScores, setLastReaction, setBranding]);
}