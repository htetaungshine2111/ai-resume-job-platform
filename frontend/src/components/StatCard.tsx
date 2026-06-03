import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  value: string | number;
  delay?: number;
};

function StatCard({ title, value, delay = 0 }: Props) {
  const [displayValue, setDisplayValue] = useState(0);

  const isNumber = typeof value === "number";

  useEffect(() => {
    if (!isNumber) return;

    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, isNumber]);

  return (
    <motion.div
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.4,
        delay,
      }}
      className="
        bg-white dark:bg-gray-800
        rounded-xl shadow p-6
        transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1
      "
    >
      <h2 className="text-gray-500 dark:text-gray-300">{title}</h2>

      <p className="text-3xl font-bold mt-2 dark:text-white">
        {isNumber ? displayValue : value}
      </p>
    </motion.div>
  );
}

export default StatCard;
