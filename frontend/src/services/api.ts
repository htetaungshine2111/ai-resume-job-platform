const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    Authorization: token ? `Bearer ${token}` : "",

    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

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

  register(data: { name: string; email: string; password: string }) {
    return apiFetch("/register", {
      method: "POST",

      body: JSON.stringify(data),
    });
  },

  login(data: { email: string; password: string }) {
    return apiFetch("/login", {
      method: "POST",

      body: JSON.stringify(data),
    });
  },

  getDashboardStats() {
    return apiFetch("/dashboard-stats");
  },

  getResumeAnalyses() {
    return apiFetch("/resume-analyses");
  },

  uploadResume(formData: FormData) {
    return apiFetch("/upload-resume", {
      method: "POST",

      body: formData,
    });
  },

  aiResumeFeedback(data: { resumeText: string }) {
    return apiFetch("/ai-resume-feedback", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  generateCoverLetter(data: { resumeText: string; jobDescription: string }) {
    return apiFetch("/ai-cover-letter", {
      method: "POST",

      body: JSON.stringify(data),
    });
  },

  getCoverLetters() {
    return apiFetch("/cover-letters");
  },

  generateInterviewQuestions(data: {
    resumeText: string;
    jobDescription: string;
  }) {
    return apiFetch("/ai-interview-questions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
