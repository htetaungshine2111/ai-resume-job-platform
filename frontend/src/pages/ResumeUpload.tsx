import { useState } from "react";
import { api } from "../services/api";
import AiFeedbackSection from "../components/AiFeedbackSection";
import CoverLetterSection from "../components/CoverLetterSection";
import InterviewQuestionsSection from "../components/InterviewQuestionsSection";
import { notify } from "../utils/notify";
import InterviewAnswerEvaluation from "../components/InterviewAnswerEvaluation";

type Analysis = {
  summary: string;
  skills: string[];
  missingSkills: string[];
  suggestions: string[];
  jobRoles: string[];
};

type AiFeedback = {
  resumeScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  atsImprovements: string[];
  careerSuggestions: string[];
};
function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);

  const [resumeText, setResumeText] = useState("");

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [aiFeedback, setAiFeedback] = useState<AiFeedback | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [jobDescription, setJobDescription] = useState("");

  const [coverLetter, setCoverLetter] = useState("");

  const [coverLetterLoading, setCoverLetterLoading] = useState(false);

  const [interviewQuestions, setInterviewQuestions] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);

  const copyCoverLetter = async () => {
    if (!coverLetter) {
      notify.error("No cover letter to copy");
      return;
    }

    await navigator.clipboard.writeText(coverLetter);

    notify.success("Cover letter copied");
  };

  const copyAiFeedback = async () => {
    if (!aiFeedback) {
      notify.error("No AI feedback to copy");
      return;
    }

    const formattedText = `
Strengths:
${aiFeedback.strengths.map((item) => `- ${item}`).join("\n")}

Weaknesses:
${aiFeedback.weaknesses.map((item) => `- ${item}`).join("\n")}

Missing Skills:
${aiFeedback.missingSkills.map((item) => `- ${item}`).join("\n")}

ATS Improvements:
${aiFeedback.atsImprovements.map((item) => `- ${item}`).join("\n")}

Career Suggestions:
${aiFeedback.careerSuggestions.map((item) => `- ${item}`).join("\n")}
`;

    await navigator.clipboard.writeText(formattedText);

    notify.success("AI feedback copied");
  };

  const evaluateAnswer = async () => {
    if (!selectedQuestion) {
      notify.error("Please enter or select a question");
      return;
    }

    if (!interviewAnswer) {
      notify.error("Please enter your answer");
      return;
    }

    try {
      setAnswerLoading(true);

      const data = await api.evaluateInterviewAnswer({
        question: selectedQuestion,
        answer: interviewAnswer,
      });

      setAnswerFeedback(data.feedback);

      notify.success("Answer evaluated");
    } catch (error) {
      console.error(error);

      notify.error(
        error instanceof Error ? error.message : "Answer evaluation failed",
      );
    } finally {
      setAnswerLoading(false);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText) {
      alert("Please upload and parse your resume first");
      return;
    }

    setLoading(true);

    try {
      const data = await api.analyzeResume({
        resumeText,
        fileName,
      });

      setAnalysis(data.analysis);

      notify.success("Resume analyzed successfully");
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Analyze failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      notify.error("Please select a resume file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const data = await api.uploadResume(formData);

      setResumeText(data.resumeText);
      setFileName(data.fileName);

      setAiLoading(true);

      const aiData = await api.aiResumeFeedback({
        resumeText: data.resumeText,
      });

      setAiFeedback(aiData.feedback);

      setAiLoading(false);

      console.log(aiData.feedback);

      notify.success("Resume uploaded successfully");
    } catch (error) {
      setAiLoading(false);
      console.error(error);

      notify.error(
        error instanceof Error ? error.message : "Resume upload failed",
      );
    }
  };

  const generateCoverLetter = async () => {
    if (!resumeText) {
      notify.error("Upload resume first");
      return;
    }

    if (!jobDescription) {
      notify.error("Please enter job description");
      return;
    }

    try {
      setCoverLetterLoading(true);

      const data = await api.generateCoverLetter({
        resumeText,
        jobDescription,
      });

      setCoverLetter(data.coverLetter);

      notify.success("Cover letter generated");
    } catch (error) {
      console.error(error);

      notify.error(
        error instanceof Error
          ? error.message
          : "Cover letter generation failed",
      );
    } finally {
      setCoverLetterLoading(false);
    }
  };

  const downloadCoverLetter = () => {
    if (!coverLetter) {
      notify.error("No cover letter available");
      return;
    }

    const blob = new Blob([coverLetter], { type: "text/plain" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "cover-letter.txt";
    notify.success("Cover letter downloaded");

    link.click();

    window.URL.revokeObjectURL(url);
  };

  const generateInterviewQuestions = async () => {
    if (!resumeText) {
      notify.error("Upload resume first");
      return;
    }

    if (!jobDescription) {
      notify.error("Please enter job description");
      return;
    }

    try {
      setInterviewLoading(true);

      const data = await api.generateInterviewQuestions({
        resumeText,
        jobDescription,
      });

      setInterviewQuestions(data.questions);

      notify.success("Interview questions generated");
    } catch (error) {
      console.error(error);

      notify.error(
        error instanceof Error
          ? error.message
          : "Interview question generation failed",
      );
    } finally {
      setInterviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Upload Resume
          </button>
        </form>
        {aiLoading && (
          <div className="mt-6 bg-white p-6 rounded-xl shadow">
            <p className="text-blue-600 font-bold">
              Analyzing resume with AI...
            </p>
          </div>
        )}

        <CoverLetterSection
          jobDescription={jobDescription}
          coverLetter={coverLetter}
          coverLetterLoading={coverLetterLoading}
          onJobDescriptionChange={setJobDescription}
          onGenerate={generateCoverLetter}
          onCopy={copyCoverLetter}
          onDownload={downloadCoverLetter}
        />

        <InterviewQuestionsSection
          interviewQuestions={interviewQuestions}
          interviewLoading={interviewLoading}
          onGenerate={generateInterviewQuestions}
        />

        <InterviewAnswerEvaluation
          selectedQuestion={selectedQuestion}
          interviewAnswer={interviewAnswer}
          answerFeedback={answerFeedback}
          answerLoading={answerLoading}
          onQuestionChange={setSelectedQuestion}
          onAnswerChange={setInterviewAnswer}
          onEvaluate={evaluateAnswer}
        />

        {aiFeedback && (
          <AiFeedbackSection aiFeedback={aiFeedback} onCopy={copyAiFeedback} />
        )}

        {resumeText && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Extracted Resume Text</h2>

            <textarea
              className="w-full h-64 border rounded p-2"
              value={resumeText}
              readOnly
            />
          </div>
        )}

        <button
          onClick={analyzeResume}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Analyzing..." : "Analyze Resume with AI"}
        </button>

        {analysis && (
          <div className="mt-6 bg-gray-50 border rounded p-4">
            <h2 className="text-lg font-bold mb-4">AI Analysis</h2>

            <p className="mb-4">
              <strong>Summary:</strong> {analysis.summary}
            </p>

            <div className="mb-4">
              <strong>Skills:</strong>
              <ul className="list-disc ml-6">
                {analysis.skills.map((skill: string, i: number) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <strong>Missing Skills:</strong>
              <ul className="list-disc ml-6">
                {analysis.missingSkills.map((skill: string, i: number) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <strong>Suggestions:</strong>
              <ul className="list-disc ml-6">
                {analysis.suggestions.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong>Recommended Roles:</strong>
              <ul className="list-disc ml-6">
                {analysis.jobRoles.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;
