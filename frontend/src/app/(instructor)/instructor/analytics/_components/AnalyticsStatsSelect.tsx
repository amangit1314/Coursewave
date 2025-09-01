import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnalyticsStatsSelect() {
  return (
    // <Select>
    //   <SelectTrigger className="w-[180px]">
    //     <SelectValue placeholder="Select time span" />
    //   </SelectTrigger>
    //   <SelectContent>
    //     <SelectGroup>
    //       <SelectLabel>Time Span</SelectLabel>
    //       <SelectItem value="allTime">All Time</SelectItem>
    //       <SelectItem value="thisMonth">This Month</SelectItem>
    //       <SelectItem value="thisYear">This Year</SelectItem>
    //     </SelectGroup>
    //   </SelectContent>
    // </Select>

    <div className="flex items-center space-x-2">
      <Select>
        <SelectTrigger className="w-[130px] rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 shadow-none transition-all duration-200 hover:border-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 h-7">
          <SelectValue placeholder="Time span" className="text-xs" />
        </SelectTrigger>
        <SelectContent className="min-w-[130px] rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <SelectItem
            value="allTime"
            className="cursor-pointer px-2 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-blue-50 focus:bg-blue-50 focus:text-blue-900 dark:text-zinc-300 dark:hover:bg-blue-900/20 dark:focus:bg-blue-900/20 dark:focus:text-blue-200"
          >
            All Time
          </SelectItem>
          <SelectItem
            value="thisMonth"
            className="cursor-pointer px-2 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-blue-50 focus:bg-blue-50 focus:text-blue-900 dark:text-zinc-300 dark:hover:bg-blue-900/20 dark:focus:bg-blue-900/20 dark:focus:text-blue-200"
          >
            This Month
          </SelectItem>
          <SelectItem
            value="thisYear"
            className="cursor-pointer px-2 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-blue-50 focus:bg-blue-50 focus:text-blue-900 dark:text-zinc-300 dark:hover:bg-blue-900/20 dark:focus:bg-blue-900/20 dark:focus:text-blue-200"
          >
            This Year
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
