import { useEffect, useState } from 'react'

type Analysis = {
  id: number
  fileName: string
  summary: string
  skills: string[]
  createdAt: string
}

function History() {
  const [items, setItems] = useState<Analysis[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/resume-analyses')
      .then((res) => res.json())
      .then(setItems)
      .catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Resume History</h1>

        {items.length === 0 && <p>No records yet.</p>}

        {items.map((item) => (
          <div key={item.id} className="border-b py-4">
            <p className="font-semibold">{item.fileName}</p>
            <p className="text-gray-600 text-sm">
              {new Date(item.createdAt).toLocaleString()}
            </p>

            <p className="mt-2">{item.summary}</p>

            <ul className="list-disc ml-6 mt-2">
              {item.skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default History