import { ScrollBar } from "@/components/ui/scroll-area";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { IoMdAdd } from "react-icons/io";
import ScheduledSessionCard from "./scheduled-session-card";
import DateRange from "@/components/date-range";

const ScheduledSessions = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Scheduled Sessions
        </h3>

        <div className="flex cursor-pointer items-center justify-center space-x-1 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <IoMdAdd />
          <p>Book a session</p>
        </div>
      </div>

      {/* <Card> */}
      <DateRange />

      {/* <DatePickerDemo /> */}
      <ScrollArea className="flex max-w-8xl mt-8 w-full whitespace-nowrap items-center justify-start space-x-2 p-1">
        <div className="flex w-max space-x-2 overflow-x-auto">
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
