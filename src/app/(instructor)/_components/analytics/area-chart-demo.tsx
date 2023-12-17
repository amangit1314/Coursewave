"use client";

import { FC } from "react";
import { AreaChart, Card, Title } from "@tremor/react";

interface ChartData {
    date: string;
    Courses: number;
    Sessions: number;
}

const mockDataSet: ChartData[] = [
    { date: '2023-01-01', Courses: 900, Sessions: 800 },
    { date: '2023-01-02', Courses: 340, Sessions: 1000 },
    { date: '2023-01-03', Courses: 840, Sessions: 808 },
    { date: '2023-01-04', Courses: 600, Sessions: 600 },
    { date: '2023-01-05', Courses: 900, Sessions: 900 },
    { date: '2023-01-06', Courses: 1200, Sessions: 900 },
    { date: '2023-01-07', Courses: 900, Sessions: 1200 },
    { date: '2023-01-08', Courses: 800, Sessions: 700 },
    { date: '2023-01-09', Courses: 1100, Sessions: 500 },
    { date: '2023-01-10', Courses: 400, Sessions: 808 },
    { date: '2023-01-11', Courses: 600, Sessions: 900 },
    { date: '2023-01-12', Courses: 808, Sessions: 500 },
    { date: '2023-01-13', Courses: 740, Sessions: 700 },
    { date: '2023-01-14', Courses: 420, Sessions: 740 },
];

const AreaChartDemo: FC = () => (
    <Card className='rounded-lg mt-2'>
        <Title>Total revenue over time (USD)</Title>
        <AreaChart
            className='h-80 mt-4'
            data={mockDataSet}
            index='date'
            defaultValue={0}
            categories={["Courses", "Sessions"]}
            colors={["indigo", "orange", "fuchsia", "emerald"]}
            allowDecimals={false}
            yAxisWidth={60}
            noDataText='There is no data, yet'
        />
    </Card>
);

export default AreaChartDemo;
