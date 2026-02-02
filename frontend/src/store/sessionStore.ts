import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Participant {
  id: string;
  name: string;
  location?: { lat: number; long: number };
}

export interface Question {
  id: string;
  text: string;
  votes: number;
  timestamp: string;
  visible?: boolean;
}

export interface PollOption {
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  type: "multiple_choice" | "rating" | "word_cloud" | "open_ended";
  options?: PollOption[];
  total_responses?: number;
  average?: number;
  words?: Record<string, number>;
  responses?: string[];
}

// PATCH: Defined specific interface for Quiz Questions to remove 'any'
export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correct_index: number;
  time_limit: number;
}

export interface Quiz {
  title: string;
  state: "LOBBY" | "QUESTION" | "LEADERBOARD" | "END";
  current_index: number;
  questions: QuizQuestion[];
  time_limit?: number;
}

interface Branding {
  logo_url?: string;
  theme_color?: string;
}

interface SessionState {
  token: string | null;
  user: { id: string; email: string } | null;
  isConnected: boolean;
  participants: Participant[];
  questions: Question[];
  currentPoll: Poll | null;
  pollResults: Record<string, number> | null;
  quiz: Quiz | null;
  quizScores: Record<string, number>;
  lastReaction: string | null;
  aiSummary: string;
  branding: Branding;

  setToken: (token: string | null) => void;
  setUser: (user: { id: string; email: string } | null) => void;
  setConnected: (status: boolean) => void;
  setParticipants: (list: Participant[]) => void;
  setQuestions: (qs: Question[]) => void;
  setPoll: (poll: Poll | null) => void;
  setPollResults: (results: Record<string, number> | null) => void;
  setQuiz: (quiz: Quiz | null) => void;
  setQuizScores: (scores: Record<string, number>) => void;
  setLastReaction: (reaction: string) => void;
  setAiSummary: (summary: string) => void;
  setBranding: (branding: Branding) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isConnected: false,
      participants: [],
      questions: [],
      currentPoll: null,
      pollResults: null,
      quiz: null,
      quizScores: {},
      lastReaction: null,
      aiSummary: "",
      branding: { theme_color: "#3b82f6" },

      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setConnected: (status) => set({ isConnected: status }),
      setParticipants: (list) => set({ participants: list }),
      setQuestions: (qs) => set({ questions: qs }),
      setPoll: (poll) => set({ currentPoll: poll }),
      setPollResults: (results) => set({ pollResults: results }),
      setQuiz: (quiz) => set({ quiz }),
      setQuizScores: (scores) => set({ quizScores: scores }),
      setLastReaction: (reaction) => set({ lastReaction: reaction }),
      setAiSummary: (summary) => set({ aiSummary: summary }),
      setBranding: (branding) => set({ branding }),
    }),
    {
      name: 'flexirush-storage',
      partialize: (state) => ({ token: state.token, user: state.user, branding: state.branding }),
    }
  )
);