import { useState } from "react";
import { api } from "../services/api";
import { notify } from "../utils/notify";

function JobMatch() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleMatch = async () => {
    if (!resumeText || !jobDescription) {
      alert("Please enter both resume text and job description");
      return;
    }

    try {
      const data = await api.createJobMatch({ resumeText, jobDescription });

      setResult(data.result);
      notify.success("Resume uploaded successfully");
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Resume Job Match</h1>

        <textarea
          className="w-full h-48 border rounded p-3 mb-4"
          placeholder="Paste resume text here"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />

        <textarea
          className="w-full h-48 border rounded p-3 mb-4"
          placeholder="Paste job description here"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button
          onClick={handleMatch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Match Resume
        </button>

        {result && (
          <div className="mt-6 bg-gray-50 border rounded p-4">
            <h2 className="text-xl font-bold mb-2">
              Match Score: {result.matchScore}%
            </h2>

            <p className="mb-4">{result.summary}</p>

            <h3 className="font-bold">Matched Skills</h3>
            <ul className="list-disc ml-6 mb-4">
              {result.matchedSkills.map((skill: string, i: number) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>

            <h3 className="font-bold">Missing Skills</h3>
            <ul className="list-disc ml-6 mb-4">
              {result.missingSkills.map((skill: string, i: number) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>

            <h3 className="font-bold">Suggestions</h3>
            <ul className="list-disc ml-6">
              {result.suggestions.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobMatch;
