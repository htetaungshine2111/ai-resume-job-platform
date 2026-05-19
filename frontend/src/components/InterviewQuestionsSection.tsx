type Props = {
  interviewQuestions: string;
  interviewLoading: boolean;
  onGenerate: () => void;
};

function InterviewQuestionsSection({
  interviewQuestions,
  interviewLoading,
  onGenerate,
}: Props) {
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">AI Interview Questions</h2>

      <button
        type="button"
        onClick={onGenerate}
        disabled={interviewLoading}
        className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-purple-300"
      >
        {interviewLoading ? "Generating..." : "Generate Interview Questions"}
      </button>

      {interviewQuestions && (
        <div className="mt-6">
          <p className="whitespace-pre-line text-gray-700">
            {interviewQuestions}
          </p>
        </div>
      )}
    </div>
  );
}

export default InterviewQuestionsSection;
