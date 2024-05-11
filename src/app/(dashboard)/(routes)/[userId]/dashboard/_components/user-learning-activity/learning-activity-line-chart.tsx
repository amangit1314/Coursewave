import { Card } from "@/components/ui/card";
import { LineChart, Title } from "@tremor/react";

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

const LearningActivityLineChart = () => {
  return (
    <Card className="rounded-md mr-[2rem] my-[1rem]">
      <Title className="font-semibold text-lg dark:text-gray-200">
        Learning Activity
      </Title>
      <LineChart
        data={chartdata}
        index="year"
        categories={["Courses Students", "Sessions Students"]}
        colors={["orange", "teal"]}
        valueFormatter={valueFormatter}
        yAxisWidth={40}
      />
    </Card>
  );
};

export default LearningActivityLineChart;
