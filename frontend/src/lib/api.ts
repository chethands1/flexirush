// frontend/src/lib/api.ts

// 1. SMART URL SELECTOR
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

// Helper to handle responses
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "API Request Failed");
  }
  return res.json();
};

export const api = {
  // --- AUTHENTICATION ---
  // Added types: email: string, password: string
  register: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  // --- SESSIONS ---
  createSession: async () => {
    const res = await fetch(`${API_BASE_URL}/api/session/create`, {
      method: "POST",
    });
    return handleResponse(res);
  },

  getSession: async (code: string) => {
    const res = await fetch(`${API_BASE_URL}/api/session/${code}/state`);
    return handleResponse(res);
  },

  joinSession: async (code: string, name: string) => {
    const res = await fetch(`${API_BASE_URL}/api/session/${code}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return handleResponse(res);
  },

  // --- POLLS ---
  // Replaced 'any' with 'Record<string, unknown>' to satisfy linter
  startPoll: async (code: string, pollData: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE_URL}/api/session/${code}/poll/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pollData),
    });
    return handleResponse(res);
  },

  endPoll: async (code: string) => {
    const res = await fetch(`${API_BASE_URL}/api/session/${code}/poll/end`, {
      method: "POST",
    });
    return handleResponse(res);
  },

  vote: async (code: string, value: string | number) => {
    const res = await fetch(`${API_BASE_URL}/api/session/${code}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: String(value) }), 
    });
    return handleResponse(res);
  },

  // --- Q&A ---
  postQuestion: async (code: string, text: string) => {
    const res = await fetch(`${API_BASE_URL}/api/session/${code}/question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    return handleResponse(res);
  },

  upvoteQuestion: async (code: string, questionId: string) => {
    const res = await fetch(`${API_BASE_URL}/api/session/${code}/question/${questionId}/upvote`, {
      method: "POST",
    });
    return handleResponse(res);
  },
  
  toggleQuestionVisibility: async (code: string, questionId: string) => {
      const res = await fetch(`${API_BASE_URL}/api/session/${code}/question/${questionId}/toggle`, {
        method: "POST",
      });
      return handleResponse(res);
  },

  // --- QUIZZES ---
  generateQuiz: async (prompt: string) => {
    const res = await fetch(`${API_BASE_URL}/api/ai/generate-quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    return handleResponse(res);
  },

  // Replaced 'any' with 'Record<string, unknown>'
  startQuiz: async (code: string, quizData: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE_URL}/api/session/${code}/quiz/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizData),
    });
    return handleResponse(res);
  },

  nextQuizStep: async (code: string) => {
    const res = await fetch(`${API_BASE_URL}/api/session/${code}/quiz/next`, {
      method: "POST",
    });
    return handleResponse(res);
  },

  submitQuizAnswer: async (code: string, userName: string, optionIndex: number) => {
    const res = await fetch(`${API_BASE_URL}/api/session/${code}/quiz/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_name: userName, option_index: optionIndex }),
    });
    return handleResponse(res);
  },

  // --- EXTRAS ---
  summarizeResponses: async (responses: string[]) => {
      const res = await fetch(`${API_BASE_URL}/api/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });
      return handleResponse(res);
  },

  updateBranding: async (code: string, branding: { theme_color?: string, logo_url?: string }) => {
    const res = await fetch(`${API_BASE_URL}/api/session/${code}/branding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branding),
      });
      return handleResponse(res);
  },

  banUser: async (code: string, name: string) => {
      const res = await fetch(`${API_BASE_URL}/api/session/${code}/ban`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        return handleResponse(res);
  },
  
  exportResults: (code: string) => {
      return `${API_BASE_URL}/api/session/${code}/export`;
  }
};