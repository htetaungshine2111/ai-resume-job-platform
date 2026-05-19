import { useEffect, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

type CoverLetterItem = {
  id: number;
  jobDescription: string | null;
  coverLetter: string | null;
  createdAt: string;
};

export default function CoverLetterHistory() {
  const [items, setItems] = useState<CoverLetterItem[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoverLetters = async () => {
      try {
        const data = await api.getCoverLetters();

        setItems(data);
      } catch (error) {
        console.error(error);

        toast.error("Failed to load cover letters");
      } finally {
        setLoading(false);
      }
    };
    fetchCoverLetters();
  }, []);

  const copyCoverLetter = async (coverLetter: string | null) => {
    if (!coverLetter) {
      toast.error("No cover letter to copy");
      return;
    }

    await navigator.clipboard.writeText(coverLetter);

    toast.success("Cover letter copied");
  };

  if (loading) {
    return <div className="p-6">Loading cover letters...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Cover Letter History</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500 mb-4">
              {new Date(item.createdAt).toLocaleString()}
            </p>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Job Description</h2>

              <p className="text-gray-700 whitespace-pre-line">
                {item.jobDescription}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Cover Letter</h2>

              <p className="text-gray-700 whitespace-pre-line">
                {item.coverLetter}
              </p>
            </div>

            <button
              type="button"
              onClick={() => copyCoverLetter(item.coverLetter)}
              className="mt-4 cursor-pointer bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Copy Cover Letter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
