import { useEffect, useState } from "react";
import { api } from "../services/api";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { notify } from "../utils/notify";

type InterviewItem = {
  id: number;
  interviewTitle: string | null;
  jobDescription: string | null;
  interviewQuestions: string | null;
  createdAt: string;
};

function InterviewHistory() {
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  const handleEdit = (id: number, currentTitle: string) => {
    setEditingId(id);
    setEditedTitle(currentTitle);
  };

  const handleSave = async (id: number) => {
    try {
      const updatedInterview = await api.updateInterviewTitle(id, editedTitle);

      setInterviews((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                interviewTitle: updatedInterview.interviewTitle,
              }
            : item,
        ),
      );

      setEditingId(null);

      notify.success("Interview title updated");
    } catch (error) {
      console.error(error);

      notify.error("Failed to update interview title");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete these interview questions?",
    );

    if (!confirmed) return;

    try {
      await api.deleteInterviewQuestions(id);

      setInterviews((prev) => prev.filter((item) => item.id !== id));

      notify.success("Interview questions deleted");
    } catch (error) {
      notify.error("Failed to delete interview questions");
      console.error(error);
    }
  };

  useEffect(() => {
    api
      .getInterviewQuestions()
      .then((data) => {
        setInterviews(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredInterviews = interviews.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      item.interviewTitle?.toLowerCase().includes(search) ||
      item.jobDescription?.toLowerCase().includes(search) ||
      item.interviewQuestions?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Interview Questions History
      </h1>

      <input
        type="text"
        placeholder="Search interview questions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full mb-6 border rounded-lg p-3
          dark:bg-gray-800 dark:text-white
          dark:border-gray-700
        "
      />

      {loading && <LoadingSkeleton />}

      {!loading && filteredInterviews.length === 0 && (
        <EmptyState message="No interview questions found." />
      )}

      {!loading &&
        filteredInterviews.length > 0 &&
        filteredInterviews.map((item) => (
          <div
            key={item.id}
            className="
              bg-white dark:bg-gray-800
              rounded-xl shadow p-6 mb-6
            "
          >
            <div className="flex justify-between items-start">
              <div>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="
      border rounded p-2
      dark:bg-gray-700
      dark:text-white
    "
                  />
                ) : (
                  <h2 className="text-xl font-bold dark:text-white">
                    {item.interviewTitle || "AI Interview Questions"}
                  </h2>
                )}

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              {editingId === item.id ? (
                <button
                  onClick={() => handleSave(item.id)}
                  className="
      bg-green-500 text-white
      px-3 py-2 rounded-lg
      hover:bg-green-600
    "
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleEdit(
                      item.id,
                      item.interviewTitle || "AI Interview Questions",
                    )
                  }
                  className="
      bg-blue-500 text-white
      px-3 py-2 rounded-lg
      hover:bg-blue-600
    "
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => handleDelete(item.id)}
                className="
      bg-red-500 text-white
      px-3 py-2 rounded-lg
      hover:bg-red-600
      transition-colors
    "
              >
                Delete
              </button>
            </div>

            {item.jobDescription && (
              <div className="mt-4">
                <h3 className="font-bold mb-2 dark:text-white">
                  Job Description
                </h3>

                <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
                  {item.jobDescription}
                </p>
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-bold mb-2 dark:text-white">
                Interview Questions
              </h3>

              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
                {item.interviewQuestions}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default InterviewHistory;
