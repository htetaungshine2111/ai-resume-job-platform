import { useState } from "react";
import { api } from "../services/api";
import { toast } from "react-hot-toast/headless";
import { useAuth } from "../context/AuthContext";

function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);

  const [resumeText, setResumeText] = useState("");

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const { token } = useAuth();

  const analyzeResume = async () => {
    if (!resumeText) {
      alert("Please upload and parse your resume first");
      return;
    }

    setLoading(true);

    try {
      const data = await api.analyzeResume({
        resumeText,
        fileName,
      });

      setAnalysis(data.analysis);

      toast.success("Resume analyzed successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Analyze failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a resume file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const data = await api.uploadResume(formData);

      setResumeText(data.resumeText);
      setFileName(data.fileName);

      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Resume upload failed",
      );
    }
  };

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
        {resumeText && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Extracted Resume Text</h2>

            <textarea
              className="w-full h-64 border rounded p-2"
              value={resumeText}
              readOnly
            />
          </div>
        )}

        <button
          onClick={analyzeResume}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Analyzing..." : "Analyze Resume with AI"}
        </button>

        {analysis && (
          <div className="mt-6 bg-gray-50 border rounded p-4">
            <h2 className="text-lg font-bold mb-4">AI Analysis</h2>

            <p className="mb-4">
              <strong>Summary:</strong> {analysis.summary}
            </p>

            <div className="mb-4">
              <strong>Skills:</strong>
              <ul className="list-disc ml-6">
                {analysis.skills.map((skill: string, i: number) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <strong>Missing Skills:</strong>
              <ul className="list-disc ml-6">
                {analysis.missingSkills.map((skill: string, i: number) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <strong>Suggestions:</strong>
              <ul className="list-disc ml-6">
                {analysis.suggestions.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong>Recommended Roles:</strong>
              <ul className="list-disc ml-6">
                {analysis.jobRoles.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;
