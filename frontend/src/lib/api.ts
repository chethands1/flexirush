const API_BASE = "http://localhost:8001/api";

export const api = {
  // Create a new session
  createSession: async () => {
    const res = await fetch(`${API_BASE}/session/create`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to create session");
    return res.json();
  },

  // Get session state (for the Dashboard)
  getSession: async (code: string) => {
    const res = await fetch(`${API_BASE}/session/${code}/state`);
    if (!res.ok) throw new Error("Session not found");
    return res.json();
  }
};