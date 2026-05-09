type Props = {
  score: number;
};

function MatchScoreBar({ score }: Props) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="font-bold">Match Score</span>
        <span className="font-bold">{score}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{
            width: `${score}%`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default MatchScoreBar;
