type Props = {
  count?: number;
};

function LoadingSkeleton({ count = 3 }: Props) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 animate-pulse"
        >
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4" />

          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />

          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
