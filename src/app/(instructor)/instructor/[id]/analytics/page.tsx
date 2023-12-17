"use client";

import React from "react";
import CardDataStats from "@/components/CardDataStats";
import { RiRadioButtonLine } from "react-icons/ri";
import { BsPersonVideo2 } from "react-icons/bs";
import { TbMoneybag } from "react-icons/tb";
import {
  LineChart,
  Flex,
  Switch,
  Badge,
  BadgeDelta,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { AiOutlineDollarCircle } from "react-icons/ai";
import AreaChartDemo from "@/app/(instructor)/_components/analytics/area-chart-demo";
import { FaSort } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import {
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";
import { es } from "date-fns/locale";
import ChartFour from "./_components/apex-chart";

function Analytics() {
  return (
    <div className="dark:bg-gray-900 h-auto flex justify-between">
      {/* first column */}
      <div>
        <div className="px-[2rem] pt-[90px]">
          <div className="flex flex-col justify-start md:flex-row md:justify-between items-center py-auto">
            <div className="font-semibold text-xl pt-2 pb-4 text-gray-700 dark:text-gray-400">
              Analytics Stats
            </div>
            <BadgeDelta
              className="flex justify-center mb-2 items-center text-blue-500 px-4 rounded-full border border-blue-500 bg-transparent"
              deltaType="moderateIncrease"
            >
              All Time
            </BadgeDelta>
          </div>

          <div className=" grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="Total Earnings"
              total="$45,2K"
              rate="4.35%"
              levelUp
            >
              <div className="p-1.5 h-[2.5rem] w-[2.5rem] flex justify-center items-center rounded-full bg-slate-200 dark:bg-slate-700 bg-opacity-30   ">
                <TbMoneybag size={22} />
              </div>
            </CardDataStats>

            <CardDataStats title="Total Courses" total="4" rate="2.59%" levelUp>
              <div className="p-1.5 h-[2.5rem] w-[2.5rem] flex justify-center items-center rounded-full bg-slate-200 dark:bg-slate-700 bg-opacity-30">
                <BsPersonVideo2 size={22} />
              </div>
            </CardDataStats>

            <CardDataStats
              title="Total Students"
              total="3,456"
              rate="0.95%"
              levelDown
            >
              <div className="p-1.5 h-[2.5rem] w-[2.5rem] flex justify-center items-center rounded-full bg-slate-200 dark:bg-slate-700 bg-opacity-30  ">
                <svg
                  className="fill-gray-900 dark:fill-white"
                  width="22"
                  height="18"
                  viewBox="0 0 22 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                    fill=""
                  />
                  <path
                    d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                    fill=""
                  />
                  <path
                    d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                    fill=""
                  />
                </svg>
              </div>
            </CardDataStats>
          </div>
        </div>

        <div className="px-[2rem] py-[2rem]">
          <div className="font-semibold text-xl text-gray-700 dark:text-gray-400 pb-2 ">
            Earning Report
          </div>
          <AreaChartDemo />
        </div>

        <div className="px-[2rem] pb-[2rem]">
          <div className="font-semibold text-xl pb-2 text-gray-700 dark:text-gray-400">
            Students
          </div>
          <LineChartForStudents />
        </div>
      </div>

      {/* second column */}
      <div className="w-[22rem] mt-[3rem] pt-[50px] mr-[2rem]">
        <TotalRevenueCard />
        <BestSellingCourses />
        <ChartFour />
      </div>
    </div>
  );
}

export default Analytics;

// ---------------------------------------------------------------------------
function TotalRevenueCard() {
  return (
    <Card className="w-[22rem] border border-gray-700 shadow-md rounded-lg justify-start items-center">
      <div className="flex justify-between ">
        <div>
          <p className="text-base tracking-tight font-medium">Total Revenue</p>
          <p className="text-xs dark:text-gray-400 text-gray-600">This month</p>
        </div>

        {/* <p className='px-2 text-xs flex justify-center items-center text-center border border-gray-200 rounded-md'>All courses</p> */}
      </div>

      {/* <DateRangePickerSpanish /> */}

      <div className="flex mt-4 mb-4 justify-between  ">
        <div className="items-center py-auto pr-3">
          <p className="text-sm tracking-tight dark:text-gray-200">Today</p>
          <p className="text-sm dark:text-gray-50">$2.4</p>
        </div>

        <div className="items-center py-auto pr-3">
          <p className="text-sm tracking-tight dark:text-gray-200">Yesterday</p>
          <p className="text-sm dark:text-gray-50">$2.4</p>
        </div>

        <div className="items-center py-auto pr-3">
          <p className="text-sm tracking-tight dark:text-gray-200">11-12-23</p>
          <p className="text-sm dark:text-gray-50">$2.4</p>
        </div>

        <div className="items-center py-auto">
          <p className="text-sm tracking-tight dark:text-gray-200">10-12-23</p>
          <p className="text-sm dark:text-gray-50">$2.4</p>
        </div>
      </div>

      <div className="h-18 flex items-center justify-between p-4 w-full rounded-b-lg bg-gray-50 dark:bg-gray-800">
        <div>
          <p className="text-sm dark:text-gray-300">Available</p>
          <p className="text-md font-medium text-gray-900 dark:text-gray-50">
            $49
          </p>
        </div>

        <div className="p-3 cursor-pointer hover:bg-blue-700 rounded-lg flex justify-center outline-none bg-blue-500 text-white text-xs border-none tracking-tight font-medium">
          <AiOutlineDollarCircle size={18} />{" "}
          <span className="ml-1 text-sm">Withdraw</span>
        </div>
      </div>
    </Card>
  );
}

function BestSellingCourses() {
  const data = [
    {
      name: "Viola Amherd",
      published: "3 months ago",
      sales: "19,408",
      enrolles: "180987",
      status: "active",
    },
    {
      name: "Simonetta Sommaruga",
      published: "this month",
      sales: "18, 308",
      enrolles: "186897",
      status: "active",
    },
    {
      name: "Alain Berset",
      published: "1 month ago",
      sales: "18, 308",
      enrolles: "104963",
      status: "active",
    },
    {
      name: "Ignazio Cassis",
      published: "2 month ago",
      sales: "18, 308",
      enrolles: "40823",
      status: "active",
    },
    {
      name: "Karin Keller-Sutter",
      published: "this month",
      sales: "14,890",
      enrolles: "828923",
      status: "active",
    },
    {
      name: "Guy Parmelin",
      published: "5 months ago",
      sales: "14,890",
      enrolles: "450831",
      status: "active",
    },
    {
      name: "Elisabeth Baume-Schneider",
      published: "this month",
      sales: "14,890",
      enrolles: "09871",
      status: "active",
    },
  ];

  return (
    <Card className="w-[22rem] my-[25px] border border-gray-800 shadow-md rounded-lg justify-start items-center py-auto">
      <Title className="flex justify-between">
        <div>
          <p className="text-base tracking-tight font-medium">
            Best Selling Courses
          </p>
          <p className="text-xs dark:text-gray-400 text-gray-600">All Time</p>
        </div>

        <Badge
          color="emerald"
          className="bg-blue-400 px-4 rounded-full dark:text-blue-300 dark:bg-blue-700 text-blue-700 text-xs"
          icon={FaSort}
        >
          sort
        </Badge>
      </Title>

      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="text-xs dark:text-gray-400 text-gray-600">
              Name
            </TableHeaderCell>
            <TableHeaderCell className="text-xs dark:text-gray-400 text-gray-600">
              Published
            </TableHeaderCell>
            <TableHeaderCell className="text-xs dark:text-gray-400 text-gray-600">
              Total Sales
            </TableHeaderCell>
            <TableHeaderCell className="text-xs dark:text-gray-400 text-gray-600">
              Enrollements
            </TableHeaderCell>
            <TableHeaderCell className="text-xs dark:text-gray-400 text-gray-600">
              Status
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((item: any) => (
            <TableRow key={item.name}>
              <TableCell className="text-xs">{item.name}</TableCell>
              <TableCell className="text-xs">{item.published}</TableCell>
              <TableCell>
                <div className="text-xs">{item.sales}</div>
              </TableCell>
              <TableCell>
                <div className="text-xs">{item.enrolles}</div>
              </TableCell>
              <TableCell>
                <Badge
                  color="orange"
                  className="bg-purple-400 rounded-full dark:text-purple-300 dark:bg-purple-700 text-purple-700 text-xs"
                  icon={RiRadioButtonLine}
                >
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

// -----------------------------------------------------------------------------------

const chartdata3 = [
  {
    date: "Jan 23",
    Courses: 167,
    Sessions: 145,
    Articles: 135,
  },
  {
    date: "Feb 23",
    Courses: 125,
    Sessions: 110,
    Articles: 155,
  },
  {
    date: "Mar 23",
    Courses: 156,
    Sessions: 149,
    Articles: 145,
  },
  {
    date: "Apr 23",
    Courses: 165,
    Sessions: 112,
    Articles: 125,
  },
  {
    date: "May 23",
    Courses: 153,
    Sessions: 138,
    Articles: 165,
  },
  {
    date: "Jun 23",
    Courses: 124,
    Sessions: 145,
    Articles: 175,
  },
];

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
  //...
];

const valueFormatter = (number: number) =>
  `${new Intl.NumberFormat("us").format(number).toString()}K`;

// --------------------------------------------------------------------------------
export const LineChartForStudents = () => {
  return (
    <Card>
      <Title>Students enrolled in Courses/Sessions (2023 to Present)</Title>
      <LineChart
        className="mt-6"
        data={chartdata}
        index="year"
        categories={["Courses Students", "Sessions Students"]}
        colors={["orange", "indigo"]}
        valueFormatter={valueFormatter}
        yAxisWidth={40}
      />
    </Card>
  );
};

// -----------------------------------------------------------------------------

// ChartJS.register(
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
// );

// export const LineChartSliderExample = () => {
//   const [value, setValue] = React.useState(true);

//   const data = {
//     labels: ["May 12", "June 13", "July 15", "Aug 15", "Sep 15", "Oct 18", "Dec 31"],
//     datasets: [{
//       data: [3, 7, 5, 7, 8, 6, 9, 1, 6, 8],
//       backgroundColor: 'transparent',
//       borderColor: '#f26ced',
//       pointBorderColor: 'transparent',
//       pointBorderWidth: 4,
//       tension: 0.5
//     }],
//   };

//   const options = {
//     plugins: {
//       legend: false,
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false
//         }
//       },
//       y: {
//         min: .2,
//         max: 10,
//         ticks: {
//           stepSize: 2,
//           callback:  (value: any) => value + 'K'
//         },
//         grid: {
//           borderDash: [10]
//         }
//       }
//     }
//   };

//   return (
//     // <Card className="max-w-3xl mx-auto p-0 rounded-lg mt-2">
//     //   <div className="p-6">
//     //     <LineChart
//     //       className="h-80 mt-4"
//     //       data={chartdata3}
//     //       index="date"
//     //       categories={[
//     //         "Courses",
//     //         "Sessions",
//     //         "Articles",
//     //       ]}
//     //       colors={["amber", "indigo", "rose"]}
//     //       yAxisWidth={30}
//     //       enableLegendSlider={value}
//     //     />
//     //   </div>
//     //   <div className="p-6 bg-gray-50 border-t flex items-center space-x-3 rounded-b-lg">
//     //     <Switch  id="switch" checked={value} onChange={() => setValue(!value)} />
//     //     <label className="text-sm text-slate-500" htmlFor="switch">
//     //       Enable Legend Slider
//     //     </label>
//     //   </div>
//     // </Card>
//     <Card className='w-full rounded-lg mt-2'>
//       <Line className='w-full' data={data} options={options}></Line>
//     </Card>
//   );
// };

export function DateRangePickerSpanish() {
  const [value, setValue] = React.useState<DateRangePickerValue>({
    from: new Date(2023, 1, 1),
    to: new Date(),
  });

  return (
    <DateRangePicker
      className="max-w-md mx-auto"
      value={value}
      onValueChange={setValue}
      locale={es}
      selectPlaceholder="Select"
      color="rose"
    >
      <DateRangePickerItem
        className="text-xs"
        key="ytd"
        value="ytd"
        from={new Date(2023, 0, 1)}
      >
        Year passed
      </DateRangePickerItem>
      <DateRangePickerItem
        key="half"
        value="half"
        from={new Date(2023, 0, 1)}
        to={new Date(2023, 5, 31)}
      >
        First semester
      </DateRangePickerItem>
    </DateRangePicker>
  );
}
