import ResumeScoreCard from "./ResumeScoreCard";
import { motion } from "framer-motion";
type AiFeedback = {
  resumeScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  atsImprovements: string[];
  careerSuggestions: string[];
};

type Props = {
  aiFeedback: AiFeedback;
  onCopy: () => void;
};

function AiFeedbackSection({ aiFeedback, onCopy }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-600";
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">AI Resume Feedback</h2>
      <ResumeScoreCard score={aiFeedback.resumeScore} />
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-bold">Resume Score</span>
          <span className="font-bold">{aiFeedback.resumeScore}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${aiFeedback.resumeScore}%`,
            }}
            transition={{
              duration: 0.8,
            }}
            className={`${getScoreColor(aiFeedback.resumeScore)} h-4 rounded-full`}
          />
        </div>
      </div>

      <Section title="Strengths" items={aiFeedback.strengths} />
      <Section title="Weaknesses" items={aiFeedback.weaknesses} />
      <Section title="Missing Skills" items={aiFeedback.missingSkills} />
      <Section title="ATS Improvements" items={aiFeedback.atsImprovements} />
      <Section
        title="Career Suggestions"
        items={aiFeedback.careerSuggestions}
      />

      <button
        type="button"
        onClick={onCopy}
        className="mt-4 cursor-pointer bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
      >
        Copy AI Feedback
      </button>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-6">
      <h3 className="font-bold mb-2">{title}</h3>

      <ul className="list-disc pl-6">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default AiFeedbackSection;
