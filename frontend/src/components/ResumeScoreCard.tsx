type Props = {
  score: number;
};

function ResumeScoreCard({ score }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-500";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Strong Resume";
    if (score >= 60) return "Needs Improvement";
    return "Needs Major Improvement";
  };

  return (
    <div className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
      <p className="text-gray-500 dark:text-gray-300 mb-2">AI Resume Score</p>

      <p className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}%</p>

      <p className="mt-2 text-gray-600 dark:text-gray-300 font-medium">
        {getScoreLabel(score)}
      </p>
    </div>
  );
}

export default ResumeScoreCard;
