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
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select time span" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Time Span</SelectLabel>
          <SelectItem value="allTime">All Time</SelectItem>
          <SelectItem value="thisMonth">This Month</SelectItem>
          <SelectItem value="thisYear">This Year</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
