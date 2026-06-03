import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `
    transition-colors
    ${
      isActive
        ? "text-indigo-600 dark:text-indigo-400 font-semibold"
        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    }
  `;
function Navbar() {
  return (
    <nav
      className="
    sticky top-0 z-50
    backdrop-blur-md
    bg-white/70 dark:bg-gray-900/70
    border-b border-gray-200 dark:border-gray-800
  "
    >
      <div
        className="
          max-w-7xl mx-auto
          px-6 py-4
          flex items-center justify-between
        "
      >
        <Link to="/" className="text-xl font-bold text-gray-900">
          AI Job Match
        </Link>

        <div className="flex gap-6">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/login" className={navLinkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={navLinkClass}>
            Register
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/upload-resume" className={navLinkClass}>
            Upload Resume
          </NavLink>
          <NavLink to="/job-match" className={navLinkClass}>
            Job Match
          </NavLink>
          <NavLink to="/job-match-history" className={navLinkClass}>
            Match History
          </NavLink>
          <NavLink to="/history" className={navLinkClass}>
            History
          </NavLink>
          <NavLink to="/cover-letter-history" className={navLinkClass}>
            Cover Letter History
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
