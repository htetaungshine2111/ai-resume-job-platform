import { useState } from 'react'

function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      alert('Please select a resume file')
      return
    }

    console.log('Selected file:', file)
    alert('Resume selected successfully')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Upload Resume
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResumeUpload