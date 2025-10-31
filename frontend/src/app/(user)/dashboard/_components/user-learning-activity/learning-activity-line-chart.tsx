// // import { Card } from "@/components/ui/card";
// // import { LineChart, Title } from "@tremor/react";

// // const chartdata = [
// //   {
// //     year: 2023,
// //     "Courses Students": 2.04,
// //     "Sessions Students": 1.53,
// //   },
// //   {
// //     year: 2024,
// //     "Courses Students": 1.06,
// //     "Sessions Students": 3.58,
// //   },
// //   {
// //     year: 2025,
// //     "Courses Students": 3.96,
// //     "Sessions Students": 2.61,
// //   },
// //   {
// //     year: 2026,
// //     "Courses Students": 1.23,
// //     "Sessions Students": 1.61,
// //   },
// //   {
// //     year: 2027,
// //     "Courses Students": 1.88,
// //     "Sessions Students": 2.67,
// //   },
// // ];

// // const valueFormatter = (number: number) =>
// //   `${new Intl.NumberFormat("us").format(number).toString()}K`;

// // const LearningActivityLineChart = () => {
// //   return (
// //     <Card className="rounded-md mr-[2rem] my-[1rem]">
// //       <Title className="font-semibold text-lg dark:text-zinc-200">
// //         Learning Activity
// //       </Title>
// //       <LineChart
// //         data={chartdata}
// //         index="year"
// //         categories={["Courses Students", "Sessions Students"]}
// //         colors={["orange", "teal"]}
// //         valueFormatter={valueFormatter}
// //         yAxisWidth={40}
// //       />
// //     </Card>
// //   );
// // };

// // export default LearningActivityLineChart;

// import { Card } from "@/components/ui/card";
// import { LineChart } from "@tremor/react";
// import { motion } from "framer-motion";
// import { useTheme } from "next-themes";
// import { TrendingUpIcon, CalendarIcon, FilterIcon, RefreshCwIcon, BarChart3Icon, AlertCircleIcon } from "lucide-react";
// import { useEffect, useState, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from "date-fns";
// import { cn } from "@/lib/utils/utils";
// import { Skeleton } from "@/components/ui/skeleton";
// import { dmSans } from "@/lib/config/fonts";

// // Types for the chart data
// interface LearningActivityData {
//   date: string;
//   "Course Progress": number;
//   "Learning Sessions": number;
//   "Time Spent (hours)": number;
// }

// interface DateRange {
//   from: Date;
//   to: Date;
// }

// // Generate mock data for the last 30 days
// const generateMockData = (days: number = 30): LearningActivityData[] => {
//   const data: LearningActivityData[] = [];
//   const today = new Date();
  
//   for (let i = days - 1; i >= 0; i--) {
//     const date = subDays(today, i);
//     data.push({
//       date: format(date, 'MMM dd'),
//       "Course Progress": Math.floor(Math.random() * 5) + 1,
//       "Learning Sessions": Math.floor(Math.random() * 4) + 1,
//       "Time Spent (hours)": Math.floor(Math.random() * 3) + 1,
//     });
//   }
  
//   return data;
// };

// const valueFormatter = (number: number) =>
//   `${new Intl.NumberFormat("us").format(number).toString()}`;

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.5,
//       ease: "easeOut" as const,
//     },
//   },
// };

// // Loading Skeleton Component
// const ChartSkeleton = () => (
//   <div className="space-y-4">
//     <div className="flex items-center justify-between">
//       <div className="flex items-center space-x-3">
//         <Skeleton className="h-10 w-10 rounded-xl" />
//         <div className="space-y-2">
//           <Skeleton className="h-6 w-32" />
//           <Skeleton className="h-4 w-48" />
//         </div>
//       </div>
//       <div className="flex items-center space-x-2">
//         <Skeleton className="h-9 w-32" />
//         <Skeleton className="h-9 w-40" />
//         <Skeleton className="h-9 w-24" />
//         <Skeleton className="h-9 w-9" />
//       </div>
//     </div>
//     <Skeleton className="h-72 w-full rounded-xl" />
//     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//       {[...Array(3)].map((_, i) => (
//         <Skeleton key={i} className="h-20 w-full rounded-xl" />
//       ))}
//     </div>
//   </div>
// );

// // Empty State Component
// const EmptyState = ({ message }: { message: string }) => (
//   <div className="flex flex-col items-center justify-center py-12 text-center">
//     <div className="p-4 bg-zinc-100 dark:bg-zinc-700 rounded-full mb-4">
//       <BarChart3Icon className="h-8 w-8 text-zinc-400" />
//     </div>
//     <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
//       No Data Available
//     </h3>
//     <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm">
//       {message}
//     </p>
//   </div>
// );

// // Error State Component
// const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
//   <div className="flex flex-col items-center justify-center py-12 text-center">
//     <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
//       <AlertCircleIcon className="h-8 w-8 text-red-500" />
//     </div>
//     <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
//       Something went wrong
//     </h3>
//     <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mb-4">
//       {message}
//     </p>
//     <Button onClick={onRetry} variant="outline" size="sm">
//       <RefreshCwIcon className="h-4 w-4 mr-2" />
//       Try Again
//     </Button>
//   </div>
// );

// const LearningActivityLineChart = () => {
//   const { theme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   const [dateRange, setDateRange] = useState<DateRange>({
//     from: subDays(new Date(), 30),
//     to: new Date(),
//   });
//   const [selectedMetric, setSelectedMetric] = useState<string>("Course Progress");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [allData, setAllData] = useState<LearningActivityData[]>([]);

//   useEffect(() => {
//     setMounted(true);
//     loadData();
//   }, []);

//   // Use a default theme during SSR to prevent hydration mismatch
//   const isDark = mounted ? theme === "dark" : false;

//   const loadData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setAllData(generateMockData(30));
//     } catch (err) {
//       setError("Failed to load learning activity data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Filter data based on selected date range
//   const filteredData = useMemo(() => {
//     if (!dateRange.from || !dateRange.to) return allData;
    
//     return allData.filter(item => {
//       const itemDate = new Date(item.date);
//       return itemDate >= startOfDay(dateRange.from) && itemDate <= endOfDay(dateRange.to);
//     });
//   }, [allData, dateRange]);

//   // Calculate summary stats
//   const summaryStats = useMemo(() => {
//     if (filteredData.length === 0) return { avgProgress: 0, avgSessions: 0, totalTime: 0 };
    
//     const totalProgress = filteredData.reduce((sum, item) => sum + item["Course Progress"], 0);
//     const totalSessions = filteredData.reduce((sum, item) => sum + item["Learning Sessions"], 0);
//     const totalTime = filteredData.reduce((sum, item) => sum + item["Time Spent (hours)"], 0);
    
//     return {
//       avgProgress: Math.round(totalProgress / filteredData.length * 10) / 10,
//       avgSessions: Math.round(totalSessions / filteredData.length * 10) / 10,
//       totalTime: totalTime,
//     };
//   }, [filteredData]);

//   const handleRefresh = async () => {
//     await loadData();
//   };

//   const handleDateRangeChange = (range: DateRange) => {
//     setDateRange(range);
//   };

//   const quickDateRanges = [
//     { label: "Last 7 days", days: 7 },
//     { label: "Last 30 days", days: 30 },
//     { label: "Last 90 days", days: 90 },
//   ];

//   const handleQuickRangeSelect = (days: number) => {
//     setDateRange({
//       from: subDays(new Date(), days),
//       to: new Date(),
//     });
//   };

//   // Show loading state
//   if (isLoading) {
//     return (
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="w-full"
//       >
//         <motion.div variants={itemVariants}>
//           <Card className="rounded-3xl p-6 transition-all duration-300 shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800">
//             <ChartSkeleton />
//           </Card>
//         </motion.div>
//       </motion.div>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="w-full"
//       >
//         <motion.div variants={itemVariants}>
//           <Card className="rounded-3xl p-6 transition-all duration-300 shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800">
//             <ErrorState message={error} onRetry={handleRefresh} />
//           </Card>
//         </motion.div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="w-full"
//     >
//       <motion.div variants={itemVariants}>
//         <Card className="rounded-3xl p-6 transition-all duration-300 shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800">
//           <motion.div
//             className="flex items-center justify-between mb-6"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//           >
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
//                 <TrendingUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <h3 className={`${dmSans.className} text-xl font-semibold text-zinc-900 dark:text-white`}>
//                   Learning Activity
//                 </h3>
//                 <p className="text-sm text-zinc-600 dark:text-zinc-400">
//                   Track your learning progress and engagement over time
//                 </p>
//               </div>
//             </div>
            
//             {/* Controls */}
//             <div className="flex items-center space-x-2">
//               {/* Metric Selector */}
//               <Select value={selectedMetric} onValueChange={setSelectedMetric}>
//                 <SelectTrigger className="w-40 h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className={`${dmSans.className}`}>
//                   <SelectItem value="Course Progress">Course Progress</SelectItem>
//                   <SelectItem value="Learning Sessions">Learning Sessions</SelectItem>
//                   <SelectItem value="Time Spent (hours)">Time Spent</SelectItem>
//                 </SelectContent>
//               </Select>

//               {/* Date Range Picker */}
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline" size="sm" className="h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
//                     <CalendarIcon className="h-4 w-4 mr-2" />
//                     {dateRange.from && dateRange.to ? (
//                       `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
//                     ) : (
//                       "Select date range"
//                     )}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="end">
//                   <Calendar
//                     initialFocus
//                     mode="range"
//                     defaultMonth={dateRange.from || new Date()}
//                     selected={{
//                       from: dateRange.from,
//                       to: dateRange.to
//                     }}
//                     onSelect={(range) => {
//                       if (range?.from && range?.to) {
//                         handleDateRangeChange({ from: range.from, to: range.to });
//                       }
//                     }}
//                     numberOfMonths={2}
//                   />
//                 </PopoverContent>
//               </Popover>

//               {/* Quick Date Ranges */}
//               <Select onValueChange={(value) => handleQuickRangeSelect(Number(value))}>
//                 <SelectTrigger className="w-32 h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
//                   <SelectValue placeholder="Quick" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {quickDateRanges.map((range) => (
//                     <SelectItem key={range.days} value={range.days.toString()}>
//                       {range.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {/* Refresh Button */}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleRefresh}
//                 disabled={isLoading}
//                 className="h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600"
//               >
//                 <RefreshCwIcon className={cn("h-4 w-4", isLoading && "animate-spin")} />
//               </Button>
//             </div>
//           </motion.div>

//           {/* Chart Section */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="w-full"
//           >
//             {filteredData.length === 0 ? (
//               <EmptyState message="No learning activity data available for the selected date range. Try adjusting your filters or check back later." />
//             ) : (
//               <LineChart
//                 data={filteredData}
//                 index="date"
//                 categories={[selectedMetric]}
//                 colors={isDark ? ["#3B82F6"] : ["#2563EB"]}
//                 valueFormatter={valueFormatter}
//                 yAxisWidth={45}
//                 showLegend={false}
//                 curveType="monotone"
//                 showGridLines={true}
//                 showAnimation={true}
//                 animationDuration={2000}
//                 autoMinValue={true}
//                 enableLegendSlider={true}
//                 className={`h-72 mt-4 text-sm font-medium tracking-tight ${
//                   isDark 
//                     ? '[&_.recharts-cartesian-axis-tick-value]:!fill-zinc-300 [&_.recharts-cartesian-axis-tick-value]:!text-zinc-300 [&_.recharts-legend-item-text]:!fill-zinc-300 [&_.recharts-legend-item-text]:!text-zinc-300 [&_.recharts-legend-item]:!gap-1 [&_.recharts-legend-item]:!items-center [&_.recharts-cartesian-grid-horizontal]:!stroke-zinc-600 [&_.recharts-cartesian-grid-vertical]:!stroke-zinc-600 [&_.recharts-cartesian-axis-line]:!stroke-zinc-600 [&_.recharts-cartesian-axis-tick-line]:!stroke-zinc-600' 
//                     : '[&_.recharts-cartesian-axis-tick-value]:!fill-zinc-700 [&_.recharts-cartesian-axis-tick-value]:!text-zinc-700 [&_.recharts-legend-item-text]:!fill-zinc-700 [&_.recharts-legend-item-text]:!text-zinc-700 [&_.recharts-legend-item]:!gap-1 [&_.recharts-legend-item]:!items-center [&_.recharts-cartesian-grid-horizontal]:!stroke-zinc-300 [&_.recharts-cartesian-grid-vertical]:!stroke-zinc-300 [&_.recharts-cartesian-axis-line]:!stroke-zinc-300 [&_.recharts-cartesian-axis-tick-line]:!stroke-zinc-300'
//                 }`}
//                 customTooltip={(props) => (
//                   <div className="rounded-xl border bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-lg p-3">
//                     <p className="text-zinc-900 dark:text-white font-semibold text-sm mb-2">
//                       {props.payload?.[0]?.payload.date}
//                     </p>
//                     {props.payload?.map((category, idx) => (
//                       <div key={idx} className="flex items-center justify-between mt-1">
//                         <div className="flex items-center">
//                           <span
//                             className="w-3 h-3 rounded-full mr-2"
//                             style={{ backgroundColor: category.color }}
//                           />
//                           <span className="text-zinc-700 dark:text-zinc-300 text-sm">
//                             {category.dataKey}
//                           </span>
//                         </div>
//                         <span className="text-zinc-900 dark:text-white font-medium text-sm">
//                           {valueFormatter(Number(category.value))}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               />
//             )}
//           </motion.div>

//           {/* Summary Stats */}
//           {filteredData.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6 }}
//               className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
//             >
//               <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
//                       Avg Course Progress
//                     </p>
//                     <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
//                       {summaryStats.avgProgress}
//                     </p>
//                   </div>
//                   <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-lg">
//                     <TrendingUpIcon className="h-4 w-4 text-blue-700 dark:text-blue-300" />
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl p-4 border border-pink-200 dark:border-pink-800">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">
//                       Avg Learning Sessions
//                     </p>
//                     <p className="text-lg font-semibold text-pink-900 dark:text-pink-100">
//                       {summaryStats.avgSessions}
//                     </p>
//                   </div>
//                   <div className="p-2 bg-pink-200 dark:bg-pink-800 rounded-lg">
//                     <TrendingUpIcon className="h-4 w-4 text-pink-700 dark:text-pink-300" />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-green-600 dark:text-green-400 font-medium">
//                       Total Time Spent
//                     </p>
//                     <p className="text-lg font-semibold text-green-900 dark:text-green-100">
//                       {summaryStats.totalTime}h
//                     </p>
//                   </div>
//                   <div className="p-2 bg-green-200 dark:bg-green-800 rounded-lg">
//                     <TrendingUpIcon className="h-4 w-4 text-green-700 dark:text-green-300" />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* Data Range Info */}
//           {filteredData.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.8 }}
//               className="mt-4 text-center"
//             >
//               <p className="text-xs text-zinc-500 dark:text-zinc-400">
//                 Showing {filteredData.length} data points from {dateRange.from && format(dateRange.from, 'MMM dd, yyyy')} to {dateRange.to && format(dateRange.to, 'MMM dd, yyyy')}
//               </p>
//             </motion.div>
//           )}
//         </Card>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default LearningActivityLineChart;


/// ===========================================================================================


import { Card } from "@/components/ui/card";
import { LineChart } from "@tremor/react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { TrendingUpIcon, CalendarIcon, FilterIcon, RefreshCwIcon, BarChart3Icon, AlertCircleIcon } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from "date-fns";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { dmSans } from "@/lib/config/fonts";

// Types for the chart data
interface LearningActivityData {
  date: string;
  "Course Progress": number;
  "Learning Sessions": number;
  "Time Spent (hours)": number;
}

interface DateRange {
  from: Date;
  to: Date;
}

// Generate realistic mock data for the logged-in user
const generateUserLearningData = (days: number = 30): LearningActivityData[] => {
  const data: LearningActivityData[] = [];
  const today = new Date();
  
  // More realistic data patterns
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Less activity on weekends
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.3 : 1;
    
    data.push({
      date: format(date, 'MMM dd'),
      "Course Progress": Math.floor(Math.random() * 3 * weekendMultiplier) + 1,
      "Learning Sessions": Math.floor(Math.random() * 5 * weekendMultiplier) + 1,
      "Time Spent (hours)": Number((Math.random() * 4 * weekendMultiplier + 0.5).toFixed(1)),
    });
  }
  
  return data;
};

const valueFormatter = (number: number) =>
  `${new Intl.NumberFormat("us").format(number).toString()}`;

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
      ease: "easeOut" as const,
    },
  },
};

// Loading Skeleton Component
const ChartSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
    <Skeleton className="h-72 w-full rounded-xl" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="p-4 bg-zinc-100 dark:bg-zinc-700 rounded-full mb-4">
      <BarChart3Icon className="h-8 w-8 text-zinc-400" />
    </div>
    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
      No Data Available
    </h3>
    <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm">
      {message}
    </p>
  </div>
);

// Error State Component
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
      <AlertCircleIcon className="h-8 w-8 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
      Something went wrong
    </h3>
    <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mb-4">
      {message}
    </p>
    <Button onClick={onRetry} variant="outline" size="sm">
      <RefreshCwIcon className="h-4 w-4 mr-2" />
      Try Again
    </Button>
  </div>
);

const LearningActivityLineChart = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedMetric, setSelectedMetric] = useState<string>("Course Progress");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allData, setAllData] = useState<LearningActivityData[]>([]);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  // Use a default theme during SSR to prevent hydration mismatch
  const isDark = mounted ? theme === "dark" : false;

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulate API call - In real app, fetch user-specific data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAllData(generateUserLearningData(30));
    } catch (err) {
      setError("Failed to load learning activity data");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return allData;
    
    return allData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfDay(dateRange.from) && itemDate <= endOfDay(dateRange.to);
    });
  }, [allData, dateRange]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (filteredData.length === 0) return { avgProgress: 0, avgSessions: 0, totalTime: 0 };
    
    const totalProgress = filteredData.reduce((sum, item) => sum + item["Course Progress"], 0);
    const totalSessions = filteredData.reduce((sum, item) => sum + item["Learning Sessions"], 0);
    const totalTime = filteredData.reduce((sum, item) => sum + item["Time Spent (hours)"], 0);
    
    return {
      avgProgress: Math.round(totalProgress / filteredData.length * 10) / 10,
      avgSessions: Math.round(totalSessions / filteredData.length * 10) / 10,
      totalTime: Number(totalTime.toFixed(1)),
    };
  }, [filteredData]);

  const handleRefresh = async () => {
    await loadData();
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  const quickDateRanges = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
  ];

  const handleQuickRangeSelect = (days: number) => {
    setDateRange({
      from: subDays(new Date(), days),
      to: new Date(),
    });
  };

  // Get colors based on theme and selected metric
  const getChartColors = () => {
    const colorMap: Record<string, string[]> = {
      "Course Progress": isDark ? ["#3B82F6"] : ["#2563EB"], // Blue
      "Learning Sessions": isDark ? ["#10B981"] : ["#059669"], // Green
      "Time Spent (hours)": isDark ? ["#F59E0B"] : ["#D97706"], // Amber
    };
    return colorMap[selectedMetric] || [isDark ? "#3B82F6" : "#2563EB"];
  };

  // Show loading state
  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl p-6 transition-all duration-300 shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800">
            <ChartSkeleton />
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  // Show error state
  if (error) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl p-6 transition-all duration-300 shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800">
            <ErrorState message={error} onRetry={handleRefresh} />
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <motion.div variants={itemVariants}>
        <Card className="rounded-3xl p-6 transition-all duration-300 shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800">
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <TrendingUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className={`${dmSans.className} text-xl font-semibold text-zinc-900 dark:text-white`}>
                  Your Learning Activity
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Track your personal learning progress and engagement over time
                </p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-2">
              {/* Metric Selector */}
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40 h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${dmSans.className}`}>
                  <SelectItem value="Course Progress">Course Progress</SelectItem>
                  <SelectItem value="Learning Sessions">Learning Sessions</SelectItem>
                  <SelectItem value="Time Spent (hours)">Time Spent</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateRange.from && dateRange.to ? (
                      `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                    ) : (
                      "Select date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from || new Date()}
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        handleDateRangeChange({ from: range.from, to: range.to });
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              {/* Quick Date Ranges */}
              <Select onValueChange={(value) => handleQuickRangeSelect(Number(value))}>
                <SelectTrigger className="w-32 h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600">
                  <SelectValue placeholder="Quick" />
                </SelectTrigger>
                <SelectContent>
                  {quickDateRanges.map((range) => (
                    <SelectItem key={range.days} value={range.days.toString()}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600"
              >
                <RefreshCwIcon className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            </div>
          </motion.div>

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            {filteredData.length === 0 ? (
              <EmptyState message="No learning activity data available for the selected date range. Try adjusting your filters or check back later." />
            ) : (
              <LineChart
                data={filteredData}
                index="date"
                categories={[selectedMetric]}
                colors={getChartColors()}
                valueFormatter={valueFormatter}
                yAxisWidth={45}
                showLegend={false}
                curveType="monotone"
                showGridLines={true}
                showAnimation={true}
                animationDuration={2000}
                autoMinValue={true}
                enableLegendSlider={true}
                className={`h-72 mt-4 text-sm font-medium tracking-tight ${
                  isDark 
                    ? '[&_.recharts-cartesian-axis-tick-value]:!fill-zinc-300 [&_.recharts-cartesian-axis-tick-value]:!text-zinc-300 [&_.recharts-legend-item-text]:!fill-zinc-300 [&_.recharts-legend-item-text]:!text-zinc-300 [&_.recharts-legend-item]:!gap-1 [&_.recharts-legend-item]:!items-center [&_.recharts-cartesian-grid-horizontal]:!stroke-zinc-600 [&_.recharts-cartesian-grid-vertical]:!stroke-zinc-600 [&_.recharts-cartesian-axis-line]:!stroke-zinc-600 [&_.recharts-cartesian-axis-tick-line]:!stroke-zinc-600 [&_.recharts-dot]:!stroke-white [&_.recharts-active-dot]:!stroke-white' 
                    : '[&_.recharts-cartesian-axis-tick-value]:!fill-zinc-700 [&_.recharts-cartesian-axis-tick-value]:!text-zinc-700 [&_.recharts-legend-item-text]:!fill-zinc-700 [&_.recharts-legend-item-text]:!text-zinc-700 [&_.recharts-legend-item]:!gap-1 [&_.recharts-legend-item]:!items-center [&_.recharts-cartesian-grid-horizontal]:!stroke-zinc-300 [&_.recharts-cartesian-grid-vertical]:!stroke-zinc-300 [&_.recharts-cartesian-axis-line]:!stroke-zinc-300 [&_.recharts-cartesian-axis-tick-line]:!stroke-zinc-300 [&_.recharts-dot]:!stroke-zinc-800 [&_.recharts-active-dot]:!stroke-zinc-800'
                }`}
                customTooltip={(props) => (
                  <div className="rounded-xl border bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-lg p-3">
                    <p className="text-zinc-900 dark:text-white font-semibold text-sm mb-2">
                      {props.payload?.[0]?.payload.date}
                    </p>
                    {props.payload?.map((category, idx) => (
                      <div key={idx} className="flex items-center justify-between mt-1">
                        <div className="flex items-center">
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-zinc-700 dark:text-zinc-300 text-sm">
                            {category.dataKey}
                          </span>
                        </div>
                        <span className="text-zinc-900 dark:text-white font-medium text-sm">
                          {valueFormatter(Number(category.value))}
                          {category.dataKey === "Time Spent (hours)" ? "h" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
            )}
          </motion.div>

          {/* Summary Stats */}
          {filteredData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Avg Course Progress
                    </p>
                    <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                      {summaryStats.avgProgress}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-lg">
                    <TrendingUpIcon className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Avg Learning Sessions
                    </p>
                    <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                      {summaryStats.avgSessions}
                    </p>
                  </div>
                  <div className="p-2 bg-green-200 dark:bg-green-800 rounded-lg">
                    <TrendingUpIcon className="h-4 w-4 text-green-700 dark:text-green-300" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                      Total Time Spent
                    </p>
                    <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                      {summaryStats.totalTime}h
                    </p>
                  </div>
                  <div className="p-2 bg-amber-200 dark:bg-amber-800 rounded-lg">
                    <TrendingUpIcon className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Data Range Info */}
          {filteredData.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 text-center"
            >
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Showing {filteredData.length} data points from {dateRange.from && format(dateRange.from, 'MMM dd, yyyy')} to {dateRange.to && format(dateRange.to, 'MMM dd, yyyy')}
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LearningActivityLineChart;