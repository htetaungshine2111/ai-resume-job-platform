import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import InsightCard from "../components/InsightCard";
import { Link } from "react-router-dom";

function Dashboard() {
  const { token } = useAuth();

  const [stats, setStats] = useState({
    totalResumes: 0,
    totalMatches: 0,
    totalCoverLetters: 0,
    averageMatchScore: 0,
    chartData: [],
    matchScoreData: [],
    resumeScoreData: [],
    bestResumeScore: 0,
    mostCommonMissingSkill: "",
    insightSummary: "",
  });

  useEffect(() => {
    if (!token) return;

    api
      .getDashboardStats()

      .then((data) => {
        setStats(data);
      })

      .catch((error) => {
        console.error(error);
      });
  }, [token]);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>

      {stats.totalResumes === 0 && (
        <div
          className="
    bg-white dark:bg-gray-800
    rounded-xl shadow p-8 text-center
  "
        >
          <h2
            className="
      text-2xl font-bold mb-4
      dark:text-white
    "
          >
            Welcome to AI Career Platform
          </h2>

          <p
            className="
      text-gray-600 dark:text-gray-300
      mb-6
    "
          >
            Upload your first resume to receive AI-powered feedback, match
            scores, and career insights.
          </p>

          <Link
            to="/upload-resume"
            className="
        inline-block
        bg-indigo-600
        text-white
        px-6 py-3
        rounded-lg
        hover:bg-indigo-700
        transition-all duration-300
      "
          >
            Upload Resume
          </Link>
        </div>
      )}

      {/* Overview Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Resumes"
            value={stats.totalResumes}
            delay={0}
          />
          <StatCard
            title="Total Matches"
            value={stats.totalMatches}
            delay={0.1}
          />
          <StatCard
            title="Cover Letters"
            value={stats.totalCoverLetters}
            delay={0.2}
          />
          <StatCard
            title="Average Match Score"
            value={`${stats.averageMatchScore}%`}
            delay={0.3}
          />
        </div>
      </section>

      {/* AI Insights Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 dark:text-white">AI Insights</h2>
        <InsightCard
          title="AI Career Insights"
          message={stats.insightSummary}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Best Resume Score"
            value={stats.bestResumeScore}
            delay={0.5}
          />

          <StatCard
            title="Most Common Missing Skill"
            value={stats.mostCommonMissingSkill || "N/A"}
            delay={0.6}
          />
        </div>
      </section>

      {/* Analytics Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Analytics</h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard
            title="Platform Activity"
            data={stats.chartData}
            delay={0.7}
          />
          <ChartCard
            title="Recent Match Scores"
            data={stats.matchScoreData}
            delay={0.8}
          />
          <ChartCard
            title="Resume Score Trend"
            data={stats.resumeScoreData}
            delay={0.9}
          />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
