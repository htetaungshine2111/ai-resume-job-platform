type Props = {
  jobDescription: string;
  coverLetter: string;
  coverLetterLoading: boolean;
  onJobDescriptionChange: (value: string) => void;
  onGenerate: () => void;
  onCopy: () => void;
  onDownload: () => void;
};

function CoverLetterSection({
  jobDescription,
  coverLetter,
  coverLetterLoading,
  onJobDescriptionChange,
  onGenerate,
  onCopy,
  onDownload,
}: Props) {
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Generate AI Cover Letter</h2>

      <textarea
        className="w-full h-48 border rounded p-2"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => onJobDescriptionChange(e.target.value)}
      />

      <button
        type="button"
        onClick={onGenerate}
        disabled={coverLetterLoading}
        className="mt-4 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {coverLetterLoading ? "Generating..." : "Generate Cover Letter"}
      </button>

      {coverLetter && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">AI Cover Letter</h2>

          <textarea
            className="w-full h-96 border rounded p-4"
            value={coverLetter}
            readOnly
          />

          <button
            type="button"
            onClick={onCopy}
            className="mt-4 cursor-pointer bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Copy Cover Letter
          </button>

          <button
            type="button"
            onClick={onDownload}
            className="mt-4 ml-4 cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download Cover Letter
          </button>
        </div>
      )}
    </div>
  );
}

export default CoverLetterSection;
