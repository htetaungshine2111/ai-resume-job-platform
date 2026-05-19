type Props = {
  title: string;
  value: string | number;
};

function StatCard({ title, value }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h2 className="text-gray-500 dark:text-gray-300">{title}</h2>

      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default StatCard;
