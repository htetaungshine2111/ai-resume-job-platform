import { motion } from "framer-motion";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartItem = {
  name: string;
  score: number;
};

type Props = {
  title: string;
  data: ChartItem[];
  delay?: number;
};

function ChartCard({ title, data }: Props) {
  return (
    <motion.div
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="
  bg-white dark:bg-gray-800
  rounded-xl shadow p-6
  transition-all duration-300
  hover:shadow-2xl
  hover:-translate-y-1
"
    >
      <h2 className="text-xl font-bold dark:text-white mb-4">{title}</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default ChartCard;
