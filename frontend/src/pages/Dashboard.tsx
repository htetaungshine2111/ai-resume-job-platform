import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { useEffect, useState } from 'react'
import { logout } from '../utils/auth'



function Dashboard() {

  const [stats, setStats] = useState({
  totalResumes: 0,
  totalMatches: 0,
  averageMatchScore: 0,
  chartData: [],
})

useEffect(() => {
  fetch('http://localhost:5000/dashboard-stats')
    .then((res) => res.json())
    .then((data) => setStats(data))
    .catch((error) => console.error(error))
}, [])
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>
      <button
        onClick={logout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            Total Resumes
          </h2>

          <p className="text-3xl font-bold mt-2">
            {stats.totalResumes}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            Total Matches
          </h2>

          <p className="text-3xl font-bold mt-2">
            {stats.totalMatches}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            Average Match Score
          </h2>

          <p className="text-3xl font-bold mt-2">
            {stats.averageMatchScore}%
          </p>
        </div>
      </div>

      {/* chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Skill Match Overview
        </h2>

        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
                <BarChart data={stats.chartData}>
                <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="score"
                fill="#3b82f6"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard