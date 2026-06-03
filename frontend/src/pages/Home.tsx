import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function Home() {
  return (
    <div>
      <div
        className="
      min-h-screen
      bg-gradient-to-br
      from-indigo-600
      via-purple-600
      to-blue-600
      flex items-center justify-center
      px-6
    "
      >
        <div className="max-w-4xl text-center text-white">
          <h1
            className="
          text-5xl md:text-7xl
          font-extrabold
          leading-tight
          mb-6
        "
          >
            AI-Powered Career Platform
          </h1>

          <p
            className="
          text-xl md:text-2xl
          text-indigo-100
          mb-10
          leading-relaxed
        "
          >
            Analyze resumes, generate cover letters, match jobs, and prepare for
            interviews using AI-driven insights.
          </p>

          <div
            className="
          flex flex-col sm:flex-row
          justify-center gap-4
        "
          >
            <a
              href="/register"
              className="
              bg-white text-indigo-700
              px-8 py-4 rounded-xl
              font-bold
              hover:bg-gray-100
              transition-all duration-300
            "
            >
              Get Started
            </a>

            <a
              href="/dashboard"
              className="
              border border-white
              px-8 py-4 rounded-xl
              font-bold
              hover:bg-white hover:text-indigo-700
              transition-all duration-300
            "
            >
              View Dashboard
            </a>
          </div>
        </div>
      </div>

      <section
        className="
  bg-gray-50 dark:bg-gray-900
  py-20 px-6
"
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className="
      text-4xl font-bold text-center
      mb-14 dark:text-white
    "
          >
            Powerful AI Career Tools
          </h2>

          <div
            className="
      grid grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4
      gap-8
    "
          >
            <div
              className="
        bg-white dark:bg-gray-800
        rounded-2xl shadow-lg p-8
        hover:shadow-2xl
        transition-all duration-300
        hover:-translate-y-1
      "
            >
              <h3
                className="
          text-2xl font-bold mb-4
          dark:text-white
        "
              >
                AI Resume Analysis
              </h3>

              <p
                className="
          text-gray-600 dark:text-gray-300
        "
              >
                Get AI-powered feedback, ATS improvements, and resume scoring.
              </p>
            </div>

            <div
              className="
        bg-white dark:bg-gray-800
        rounded-2xl shadow-lg p-8
        hover:shadow-2xl
        transition-all duration-300
        hover:-translate-y-1
      "
            >
              <h3
                className="
          text-2xl font-bold mb-4
          dark:text-white
        "
              >
                Cover Letter Generator
              </h3>

              <p
                className="
          text-gray-600 dark:text-gray-300
        "
              >
                Generate professional cover letters tailored to job
                descriptions.
              </p>
            </div>

            <div
              className="
        bg-white dark:bg-gray-800
        rounded-2xl shadow-lg p-8
        hover:shadow-2xl
        transition-all duration-300
        hover:-translate-y-1
      "
            >
              <h3
                className="
          text-2xl font-bold mb-4
          dark:text-white
        "
              >
                Job Match Analytics
              </h3>

              <p
                className="
          text-gray-600 dark:text-gray-300
        "
              >
                Compare resumes with jobs and track AI match scores over time.
              </p>
            </div>

            <div
              className="
        bg-white dark:bg-gray-800
        rounded-2xl shadow-lg p-8
        hover:shadow-2xl
        transition-all duration-300
        hover:-translate-y-1
      "
            >
              <h3
                className="
          text-2xl font-bold mb-4
          dark:text-white
        "
              >
                AI Interview Coach
              </h3>

              <p
                className="
          text-gray-600 dark:text-gray-300
        "
              >
                Generate interview questions and receive AI answer evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
