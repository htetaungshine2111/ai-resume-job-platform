const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",

    Authorization: token ? `Bearer ${token}` : "",

    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

export const api = {
  getJobMatches(page: number) {
    return apiFetch(`/job-matches?page=${page}&limit=5`);
  },

  deleteJobMatch(id: number) {
    return apiFetch(`/job-matches/${id}`, {
      method: "DELETE",
    });
  },

  analyzeResume(data: { resumeText: string; fileName: string }) {
    return apiFetch("/analyze-resume", {
      method: "POST",

      body: JSON.stringify(data),
    });
  },

  createJobMatch(data: { resumeText: string; jobDescription: string }) {
    return apiFetch("/job-match", {
      method: "POST",

      body: JSON.stringify(data),
    });
  },
};
