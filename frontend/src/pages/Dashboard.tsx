import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";

function Dashboard() {
  const { token, logout } = useAuth();

  const [stats, setStats] = useState({
    totalResumes: 0,
    totalMatches: 0,
    totalCoverLetters: 0,
    averageMatchScore: 0,
    chartData: [],
    matchScoreData: [],
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <button
        onClick={logout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Resumes" value={stats.totalResumes} />
        <StatCard title="Total Matches" value={stats.totalMatches} />
        <StatCard title="Total Cover Letters" value={stats.totalCoverLetters} />
        <StatCard
          title="Average Match Score"
          value={`${stats.averageMatchScore}%`}
        />
      </div>

      {/* chart */}

      <ChartCard title="Platform Activity" data={stats.chartData} />

      <div className="mt-8">
        <ChartCard title="Recent Match Scores" data={stats.matchScoreData} />
      </div>
    </div>
  );
}

export default Dashboard;
