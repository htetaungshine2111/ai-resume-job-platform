import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
type AiFeedback = {
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  atsImprovements: string[];
  careerSuggestions: string[];
};

type Analysis = {
  id: number;
  fileName: string;
  summary: string;
  skills: string[];
  aiFeedback?: string | null;
  createdAt: string;
};

function History() {
  const [items, setItems] = useState<Analysis[]>([]);

  const { token } = useAuth();

  const parseAiFeedback = (value?: string | null): AiFeedback | null => {
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!token) return;

    api
      .getResumeAnalyses()

      .then(setItems)

      .catch(console.error);
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Resume History</h1>

        {items.length === 0 && <p>No records yet.</p>}

        {items.map((item) => {
          const aiFeedback = parseAiFeedback(item.aiFeedback);

          return (
            <div key={item.id} className="border-b py-4">
              <p className="font-semibold">{item.fileName}</p>
              <p className="text-gray-600 text-sm">
                {new Date(item.createdAt).toLocaleString()}
              </p>

              <p className="mt-2">{item.summary}</p>

              {aiFeedback && (
                <div className="mt-4 bg-gray-50 border rounded p-4">
                  <h3 className="font-bold mb-2">AI Feedback</h3>

                  <h4 className="font-semibold text-green-600">Strengths</h4>
                  <ul className="list-disc ml-6 mb-3">
                    {aiFeedback.strengths.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <h4 className="font-semibold text-red-600">Weaknesses</h4>
                  <ul className="list-disc ml-6 mb-3">
                    {aiFeedback.weaknesses.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <h4 className="font-semibold text-yellow-600">
                    Missing Skills
                  </h4>
                  <ul className="list-disc ml-6 mb-3">
                    {aiFeedback.missingSkills.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <h4 className="font-semibold text-blue-600">
                    ATS Improvements
                  </h4>
                  <ul className="list-disc ml-6 mb-3">
                    {aiFeedback.atsImprovements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <h4 className="font-semibold text-purple-600">
                    Career Suggestions
                  </h4>
                  <ul className="list-disc ml-6">
                    {aiFeedback.careerSuggestions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default History;
