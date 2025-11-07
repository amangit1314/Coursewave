import { dmSans } from "@/lib/config/fonts";
import { motion } from "framer-motion";

const FAQCard = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="rounded-xl bg-white p-6 shadow-sm ring-1 group ring-gray-200 transition-shadow hover:bg-blue-500 hover:text-white hover:shadow-md dark:bg-zinc-800 dark:hover:bg-blue-500  dark:ring-zinc-700"
  >
    <h4
      className={`${dmSans.className} mb-3 font-semibold text-gray-900 dark:text-white group-hover:text-white dark:group-hover:text-white`}
    >
      {question}
    </h4>
    <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-300 dark:group-hover:text-gray-300">
      {answer}
    </p>
  </motion.div>
);

export default FAQCard;