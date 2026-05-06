import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-gray-900">
        AI Job Match
      </Link>

      <div className="flex gap-6">
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <Link to="/login" className="text-gray-600 hover:text-gray-900">
          Login
        </Link>
        <Link to="/register" className="text-gray-600 hover:text-gray-900">
          Register
        </Link>
        <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
          Dashboard
        </Link>
        <Link to="/upload-resume" className="text-gray-600 hover:text-gray-900">
  Upload Resume
</Link>
<Link to="/job-match" className="text-gray-600 hover:text-gray-900">
  Job Match
</Link>
<Link
  to="/job-match-history"
  className="text-gray-600 hover:text-gray-900"
>
  Match History
</Link>
        <Link to="/history">History</Link>
      </div>
    </nav>
  )
}

export default Navbar