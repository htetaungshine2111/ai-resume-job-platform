import { useState } from "react";
import MatchScoreBar from "../components/MatchScoreBar";
import SkillList from "../components/SkillList";
import Modal from "../components/Modal";
import useJobMatches from "../hooks/useJobMatches";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { api } from "../services/api";

type JobMatch = {
  id: number;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  createdAt: string;
};

function JobMatchHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<JobMatch | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  //const [matches, setMatches] = useState<JobMatch[]>([]);
  //const [totalPages, setTotalPages] = useState(1);
  //const [loading, setLoading] = useState(true);

  const { matches, loading, totalPages, setMatches } =
    useJobMatches(currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this record?");

    if (!confirmed) return;
    await api.deleteJobMatch(id);

    toast.success("Job match deleted successfully");

    setMatches(matches.filter((match) => match.id !== id));
  };

  const filteredMatches = matches.filter((match) => {
    const search = searchTerm.toLowerCase();

    return (
      match.matchedSkills.some((skill) =>
        skill.toLowerCase().includes(search),
      ) ||
      match.missingSkills.some((skill) => skill.toLowerCase().includes(search))
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Job Match History</h1>

        <input
          type="text"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        />

        {loading && <Spinner />}

        {filteredMatches.length === 0 && <p>No job match history yet.</p>}

        {filteredMatches.map((match) => (
          <div
            key={match.id}
            onClick={() => setSelectedMatch(match)}
            className="border rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-50"
          >
            {selectedMatch && (
              <Modal
                title="Job Match Details"
                onClose={() => setSelectedMatch(null)}
              >
                <p className="mb-4">
                  <strong>Match Score:</strong> {selectedMatch.matchScore}%
                </p>

                <SkillList
                  title="Matched Skills"
                  skills={selectedMatch.matchedSkills}
                />

                <SkillList
                  title="Missing Skills"
                  skills={selectedMatch.missingSkills}
                />

                <SkillList
                  title="Suggestions"
                  skills={selectedMatch.suggestions}
                />
              </Modal>
            )}

            <button
              onClick={(event) => {
                event.stopPropagation();
                handleDelete(match.id);
              }}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>

            <MatchScoreBar score={match.matchScore} />

            <p className="text-sm text-gray-500 mb-3">
              {new Date(match.createdAt).toLocaleString()}
            </p>

            <SkillList title="Matched Skills" skills={match.matchedSkills} />

            <SkillList title="Missing Skills" skills={match.missingSkills} />

            <SkillList title="Suggestions" skills={match.suggestions} />
          </div>
        ))}
        {/* Pagination */}
        <div className="flex gap-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobMatchHistory;
