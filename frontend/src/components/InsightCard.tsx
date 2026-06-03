type Props = {
  title: string;
  message: string;
};

function InsightCard({ title, message }: Props) {
  return (
    <div
      className="
  mb-6
  bg-gradient-to-r from-indigo-600 to-purple-600
  text-white rounded-xl p-6 shadow-xl
  transition-all duration-300
  hover:shadow-2xl hover:-translate-y-1
"
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <p className="text-lg leading-relaxed">{message}</p>
    </div>
  );
}

export default InsightCard;
