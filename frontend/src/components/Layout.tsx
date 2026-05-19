import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  Upload,
  History,
  FileText,
  Briefcase,
  ClipboardList,
} from "lucide-react";

function Layout() {
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"
    }`;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      <button
        type="button"
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 min-h-screen w-64
          bg-gray-900 text-white p-6
          transform transition-transform duration-300 z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h1 className="text-xl font-bold mb-8 mt-10 md:mt-0">
          AI Career Platform
        </h1>

        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/upload-resume"
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <Upload size={20} />
            Resume Upload
          </NavLink>

          <NavLink
            to="/history"
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <History size={20} />
            Resume History
          </NavLink>

          <NavLink
            to="/cover-letter-history"
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <FileText size={20} />
            Cover Letters
          </NavLink>

          <NavLink
            to="/job-match"
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <Briefcase size={20} />
            Job Match
          </NavLink>

          <NavLink
            to="/job-match-history"
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <ClipboardList size={20} />
            Match History
          </NavLink>
        </nav>

        <div className="mt-10 border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-300 mb-3">{user?.email}</p>

          <button
            type="button"
            onClick={logout}
            className="cursor-pointer bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="mt-4 cursor-pointer bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 pt-20 md:pt-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
