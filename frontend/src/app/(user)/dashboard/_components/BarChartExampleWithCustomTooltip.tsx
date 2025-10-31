import { BarChart } from "@tremor/react";

const chartdata = [
  {
    date: "Jan 23",
    InProgress: 167,
  },
  {
    date: "Feb 23",
    Completed: 125,
  },
  {
    date: "Mar 23",
    Completed: 156,
  },
  {
    date: "Apr 23",
    InProgress: 165,
  },
  {
    date: "May 23",
    InProgress: 153,
  },
  {
    date: "Jun 23",
    Completed: 124,
  },
  {
    date: "Jul 23",
    InProgress: 164,
  },
  {
    date: "Aug 23",
    InProgress: 123,
  },
  {
    date: "Sep 23",
    Completed: 132,
  },
];

export function BarChartExampleWithCustomTooltip() {
  type CustomTooltipTypeBar = {
    payload: any;
    active: boolean | undefined;
    label: any;
  };

  const customTooltip = (props: CustomTooltipTypeBar) => {
    const { payload, active } = props;
    if (!active || !payload) return null;
    return (
      <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
        {payload.map((category: any, idx: number) => (
          <div key={idx} className="flex flex-1 space-x-2.5">
            <div
              className={`flex w-1 flex-col bg-${category.color}-500 rounded`}
            />
            <div className="space-y-1">
              <p className="text-tremor-content">{category.dataKey}</p>
              <p className="font-medium text-tremor-content-emphasis">
                {category.value} bpm
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <>
      <h3 className="text-lg font-medium tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Activity Data
      </h3>
      <BarChart
        className="mt-4 h-72 rounded-md"
        data={chartdata}
        index="date"
        categories={["InProgress", "Completed"]}
        colors={["blue", "emerald"]}
        yAxisWidth={30}
        customTooltip={customTooltip}
      />
    </>
  );
}
