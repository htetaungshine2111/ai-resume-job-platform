type Props = {
  selectedQuestion: string;
  interviewAnswer: string;
  answerFeedback: string;
  answerLoading: boolean;
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  onEvaluate: () => void;
};

function InterviewAnswerEvaluation({
  selectedQuestion,
  interviewAnswer,
  answerFeedback,
  answerLoading,
  onQuestionChange,
  onAnswerChange,
  onEvaluate,
}: Props) {
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">
        AI Interview Answer Evaluation
      </h2>

      <textarea
        className="w-full h-28 border rounded p-3 dark:bg-gray-700 dark:text-white"
        placeholder="Paste or type an interview question..."
        value={selectedQuestion}
        onChange={(e) => onQuestionChange(e.target.value)}
      />

      <textarea
        className="w-full h-40 border rounded p-3 mt-4 dark:bg-gray-700 dark:text-white"
        placeholder="Type your answer here..."
        value={interviewAnswer}
        onChange={(e) => onAnswerChange(e.target.value)}
      />

      <button
        type="button"
        onClick={onEvaluate}
        disabled={answerLoading}
        className="mt-4 cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-300"
      >
        {answerLoading ? "Evaluating..." : "Evaluate Answer"}
      </button>

      {answerFeedback && (
        <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <h3 className="font-bold mb-2 dark:text-white">Feedback</h3>

          <p className="whitespace-pre-line text-gray-700 dark:text-gray-200">
            {answerFeedback}
          </p>
        </div>
      )}
    </div>
  );
}

export default InterviewAnswerEvaluation;
