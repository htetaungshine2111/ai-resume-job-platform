import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            AI Resume & Career Platform
          </h1>

          <p className="text-xl text-blue-100 max-w-2xl mb-8">
            Analyze resumes, generate AI cover letters, match jobs, and prepare
            for interviews using powerful AI tools.
          </p>

          <div className="flex gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-14">
          AI-Powered Career Tools
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-3">Resume Analysis</h3>

            <p className="text-gray-600">
              Upload resumes and receive AI-powered strengths, weaknesses, ATS
              improvements, and career suggestions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-3">Cover Letter Generator</h3>

            <p className="text-gray-600">
              Generate personalized AI cover letters tailored to specific job
              descriptions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-3">Job Matching</h3>

            <p className="text-gray-600">
              Compare resumes against job descriptions and receive AI-based
              compatibility analysis.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-3">AI Career Assistant</h3>

            <p className="text-gray-600">
              Organize resume history, cover letters, and future interview
              preparation tools.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <p>© 2026 AI Resume & Career Platform</p>
      </footer>
    </div>
  );
}
