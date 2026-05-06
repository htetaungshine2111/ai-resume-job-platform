import { useEffect, useState } from 'react'

type JobMatch = {
  id: number
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  suggestions: string[]
  createdAt: string
}

function JobMatchHistory() {
  const [matches, setMatches] = useState<JobMatch[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/job-matches')
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((error) => console.error(error))
  }, [])


const handleDelete = async (id: number) => {
  const confirmed = confirm('Are you sure you want to delete this record?')

  if (!confirmed) return

  const res = await fetch(`http://localhost:5000/job-matches/${id}`, {
    method: 'DELETE',
  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.message || 'Delete failed')
    return
  }

  setMatches(matches.filter((match) => match.id !== id))
}

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">
          Job Match History
        </h1>

        {matches.length === 0 && (
          <p>No job match history yet.</p>
        )}

        {matches.map((match) => (
          <div
            key={match.id}
            className="border rounded-lg p-4 mb-4"
          >
<button
  onClick={() => handleDelete(match.id)}
  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
>
  Delete
</button>

            
            <div className="mb-4">
  <div className="flex justify-between mb-1">
    <span className="font-bold">Match Score</span>

    <span className="font-bold">
      {match.matchScore}%
    </span>
  </div>

  <div className="w-full bg-gray-200 rounded-full h-4">
    <div
      className="bg-green-500 h-4 rounded-full"
      style={{
        width: `${match.matchScore}%`,
      }}
    ></div>
  </div>
</div>

            <p className="text-sm text-gray-500 mb-3">
              {new Date(match.createdAt).toLocaleString()}
            </p>

            <div className="mb-3">
              <strong>Matched Skills:</strong>

              <ul className="list-disc ml-6">
                {match.matchedSkills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <strong>Missing Skills:</strong>

              <ul className="list-disc ml-6">
                {match.missingSkills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong>Suggestions:</strong>

              <ul className="list-disc ml-6">
                {match.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobMatchHistory