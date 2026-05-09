type JobMatch = {
  id: number;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  createdAt: string;
};

type Props = {
  match: JobMatch;

  onDelete: (id: number) => void;

  onSelect: (match: JobMatch) => void;
};

function JobMatchCard({ match, onDelete, onSelect }: Props) {
  return (
    <div
      onClick={() => onSelect(match)}
      className="border rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-50"
    >
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="font-bold">Match Score</span>

          <span className="font-bold">{match.matchScore}%</span>
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

      <div className="mb-3">
        <strong>Matched Skills:</strong>

        <ul className="list-disc ml-6">
          {match.matchedSkills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();

          onDelete(match.id);
        }}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  );
}

export default JobMatchCard;
