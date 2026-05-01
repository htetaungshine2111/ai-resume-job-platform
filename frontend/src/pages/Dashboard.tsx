function Dashboard() {
  const user = localStorage.getItem('user')
  const parsedUser = user ? JSON.parse(user) : null

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {parsedUser && (
          <p className="mt-4 text-gray-600">
            Welcome, {parsedUser.email}
          </p>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard