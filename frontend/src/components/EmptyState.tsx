type Props = {
  message: string;
};

function EmptyState({ message }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
      <p className="text-gray-500 dark:text-gray-300">{message}</p>
    </div>
  );
}

export default EmptyState;
