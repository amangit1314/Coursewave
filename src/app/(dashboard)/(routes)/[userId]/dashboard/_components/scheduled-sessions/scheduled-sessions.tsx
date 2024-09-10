import { ScrollBar } from "@/components/ui/scroll-area";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { IoMdAdd } from "react-icons/io";
import ScheduledSessionCard from "./scheduled-session-card";
import DateRange from "@/components/date-range";

const ScheduledSessions = () => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Scheduled Sessions
        </div>

        <div className="flex cursor-pointer items-center justify-center space-x-1 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <IoMdAdd />
          <p>Book a session</p>
        </div>
      </div>

      {/* <Card> */}
      <DateRange />

      {/* <DatePickerDemo /> */}
      <ScrollArea className="flex w-full max-w-7xl items-center justify-start space-x-2 p-1">
        <div className="flex w-full max-w-7xl space-x-2">
          <ScheduledSessionCard />
          <ScheduledSessionCard />
          <ScheduledSessionCard />
          <ScheduledSessionCard />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* </Card> */}
    </div>
  );
};

export default ScheduledSessions;
