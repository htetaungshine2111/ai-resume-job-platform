import { useEffect, useState } from "react";
import { api } from "../services/api";
import { notify } from "../utils/notify";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";

type CoverLetterItem = {
  id: number;
  title: string | null;
  jobDescription: string | null;
  coverLetter: string | null;
  createdAt: string;
};

export default function CoverLetterHistory() {
  const [items, setItems] = useState<CoverLetterItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [editTitle, setEditTitle] = useState("");

  const startEditing = (item: CoverLetterItem) => {
    setEditingId(item.id);
    setEditTitle(item.title || "AI Cover Letter");
  };

  const saveTitle = async (id: number) => {
    try {
      const updated = await api.updateCoverLetterTitle(id, editTitle);

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                title: updated.title,
              }
            : item,
        ),
      );

      setEditingId(null);
      setEditTitle("");

      notify.success("Title updated");
    } catch (error) {
      console.error(error);
      notify.error("Failed to update title");
    }
  };

  useEffect(() => {
    const fetchCoverLetters = async () => {
      try {
        setLoading(true);

        const data = await api.getCoverLetters();

        setItems(data);
      } catch (error) {
        console.error(error);

        notify.error("Failed to load cover letters");
      } finally {
        setLoading(false);
      }
    };
    fetchCoverLetters();
  }, []);

  const filteredItems = items.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      item.jobDescription?.toLowerCase().includes(search) ||
      item.coverLetter?.toLowerCase().includes(search)
    );
  });

  const copyCoverLetter = async (coverLetter: string | null) => {
    if (!coverLetter) {
      notify.error("No cover letter to copy");
      return;
    }

    await navigator.clipboard.writeText(coverLetter);

    notify.success("Cover letter copied");
  };

  const deleteCoverLetter = async (id: number) => {
    const confirmed = window.confirm("Delete this cover letter?");

    if (!confirmed) return;

    try {
      await api.deleteCoverLetter(id);

      setItems((prev) => prev.filter((item) => item.id !== id));

      notify.success("Cover letter deleted");
    } catch (error) {
      console.error(error);

      notify.error("Delete failed");
    }
  };

  if (loading) {
    return <div className="p-6">Loading cover letters...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Cover Letter History</h1>

      <div className="space-y-6">
        <input
          type="text"
          placeholder="Search cover letters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-6 border rounded-lg p-3 dark:bg-gray-800 dark:text-white"
        />

        {loading && <LoadingSkeleton />}

        {!loading && filteredItems.length === 0 && (
          <EmptyState message="No cover letters found." />
        )}

        {!loading &&
          filteredItems.length > 0 &&
          filteredItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow">
              <p className="text-sm text-gray-500 mb-4">
                {new Date(item.createdAt).toLocaleString()}
              </p>

              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => deleteCoverLetter(item.id)}
                  className="mt-4 ml-4 cursor-pointer bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>

                {editingId === item.id ? (
                  <div className="flex gap-2 mb-4">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border rounded p-2 flex-1"
                    />

                    <button
                      type="button"
                      onClick={() => saveTitle(item.id)}
                      className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditTitle("");
                      }}
                      className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                      {item.title || "AI Cover Letter"}
                    </h2>

                    <button
                      type="button"
                      onClick={() => startEditing(item)}
                      className="cursor-pointer bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Edit Title
                    </button>
                  </div>
                )}

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
