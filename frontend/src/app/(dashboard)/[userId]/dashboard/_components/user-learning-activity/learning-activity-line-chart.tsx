// import { Card } from "@/components/ui/card";
// import { LineChart, Title } from "@tremor/react";

// const chartdata = [
//   {
//     year: 2023,
//     "Courses Students": 2.04,
//     "Sessions Students": 1.53,
//   },
//   {
//     year: 2024,
//     "Courses Students": 1.06,
//     "Sessions Students": 3.58,
//   },
//   {
//     year: 2025,
//     "Courses Students": 3.96,
//     "Sessions Students": 2.61,
//   },
//   {
//     year: 2026,
//     "Courses Students": 1.23,
//     "Sessions Students": 1.61,
//   },
//   {
//     year: 2027,
//     "Courses Students": 1.88,
//     "Sessions Students": 2.67,
//   },
// ];

// const valueFormatter = (number: number) =>
//   `${new Intl.NumberFormat("us").format(number).toString()}K`;

// const LearningActivityLineChart = () => {
//   return (
//     <Card className="rounded-md mr-[2rem] my-[1rem]">
//       <Title className="font-semibold text-lg dark:text-gray-200">
//         Learning Activity
//       </Title>
//       <LineChart
//         data={chartdata}
//         index="year"
//         categories={["Courses Students", "Sessions Students"]}
//         colors={["orange", "teal"]}
//         valueFormatter={valueFormatter}
//         yAxisWidth={40}
//       />
//     </Card>
//   );
// };

// export default LearningActivityLineChart;

import { Card } from "@/components/ui/card";
import { LineChart } from "@tremor/react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const chartdata = [
  {
    year: 2023,
    "Courses Students": 2.04,
    "Sessions Students": 1.53,
  },
  {
    year: 2024,
    "Courses Students": 1.06,
    "Sessions Students": 3.58,
  },
  {
    year: 2025,
    "Courses Students": 3.96,
    "Sessions Students": 2.61,
  },
  {
    year: 2026,
    "Courses Students": 1.23,
    "Sessions Students": 1.61,
  },
  {
    year: 2027,
    "Courses Students": 1.88,
    "Sessions Students": 2.67,
  },
];

const valueFormatter = (number: number) =>
  `${new Intl.NumberFormat("us").format(number).toString()}K`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const LearningActivityLineChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <motion.div variants={itemVariants}>
        {/* border-gray-200 dark:border-gray-200 */}
        <Card className="rounded-3xl p-6 transition-all duration-300 shadow-sm border border-stroke overflow-hidden bg-white dark:bg-transparent">
          <motion.h3
            className="text-xl font-semibold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Learning Activity
          </motion.h3>

          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <LineChart
              data={chartdata}
              index="year"
              categories={["Courses Students", "Sessions Students"]}
              // colors={
              //   isDark ? ["amber-400", "pink-300"] : ["orange-500", "pink-500"]
              // }
              colors={
                isDark ? ["#fbbf24", "#f9a8d4"] : ["#f97316", "#ec4899"] // Using hex codes for better reliability
              }
              valueFormatter={valueFormatter}
              yAxisWidth={45}
              showLegend={true}
              curveType="monotone"
              showGridLines={true}
              showAnimation={true}
              animationDuration={2000}
              autoMinValue={true}
              enableLegendSlider={true}
              className="h-72 mt-4 dark:text-gray-300 text-sm font-medium tracking-tighter overflow-hidden"
              // Custom tooltip styling
              onValueChange={(v) => console.log(v)}
              customTooltip={(props) => (
                <div className="rounded-xl border bg-white dark:bg-zinc-800 border-gray-200 dark:border-gray-200 shadow-sm p-2">
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {props.payload?.[0]?.payload.year}
                  </p>
                  {props.payload?.map((category, idx) => (
                    <div key={idx} className="flex items-center mt-1">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {category.dataKey}:{" "}
                        {valueFormatter(Number(category.value))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              // Fix for axis colors in dark mode
              // Removed theme prop as it is not supported by LineChart
            />
          </motion.div> */}

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.4 }}
>
  <LineChart
    data={chartdata}
    index="year"
    categories={["Courses Students", "Sessions Students"]}
    colors={isDark ? ["#F59E0B", "#EC4899"] : ["#F97316", "#DB2777"]}
    valueFormatter={valueFormatter}
    yAxisWidth={45}
    showLegend={true}
    curveType="monotone"
    showGridLines={true}
    showAnimation={true}
    animationDuration={2000}
    autoMinValue={true}
    enableLegendSlider={true}
    className="h-72 mt-4 dark:text-gray-300 text-sm font-medium tracking-tighter overflow-hidden"
    customTooltip={(props: import("@tremor/react").CustomTooltipProps) => {
      // Get unique entries
      const uniqueEntries = props.payload?.reduce((acc: { dataKey: string; value: number; color: string; payload: { year: number } }[], item) => {
        if (!acc.some(i => i.dataKey === item.dataKey)) {
          if (typeof item.dataKey === "string") {
            acc.push(item as { dataKey: string; value: number; color: string; payload: { year: number } });
          }
        }
        return acc;
      }, []);

      return (
        <div className={`
          rounded-xl border p-3 shadow-lg
          bg-white dark:bg-gray-800
          border-gray-200 dark:border-gray-600
        `}>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            {props.label || uniqueEntries?.[0]?.payload.year}
          </p>
          <div className="space-y-1">
            {uniqueEntries?.map((category) => (
              <div key={category.dataKey} className="flex items-center">
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: category.color
                  }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {category.dataKey}: {valueFormatter(Number(category.value))}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }}
  />
</motion.div>

      
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LearningActivityLineChart;
