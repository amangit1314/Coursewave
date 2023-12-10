import { Card, Text, Title, AreaChart } from "@tremor/react";

const generateData = () => {
    let chartdata = [];
    const dates = [
        'Nov 23',
        'Nov 24',
        'Nov 25',
        'Nov 26',
        'Nov 27',
        'Nov 28',
        'Nov 29',
        'Nov 30',
        'Dec 01',
        'Dec 02',
        'Dec 03',
        'Dec 04',
        'Dec 05',
        'Dec 06',
        'Dec 07',
        'Dec 08',
        'Dec 09',
        'Dec 10',
        'Dec 11',
        'Dec 12',
        'Dec 13',
        'Dec 14',
        'Dec 15',
        'Dec 16',
        'Dec 17',
        'Dec 18',
        'Dec 19',
        'Dec 20',
    ];

    for (let date of dates) {
        chartdata.push({
            date,
            'courses': Math.round(150 + Math.random() * 20 - 10),
            'sessions': Math.round(150 + Math.random() * 20 - 10),
        });
    }

    return chartdata;
}

const mockDataSet = generateData();



const AreaChartDemo = () => (
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