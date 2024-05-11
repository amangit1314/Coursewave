import { ScrollBar } from "@/components/ui/scroll-area";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { IoMdAdd } from "react-icons/io";
import ScheduledSessionCard from "./scheduled-session-card";
import DateRange from "@/components/date-range";

const ScheduledSessions = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="font-semibold text-gray-700 text-lg dark:text-gray-200">
          Scheduled Sessions
        </div>

        <div className="flex justify-center items-center bg-blue-500 text-white hover:bg-blue-700 text-sm cursor-pointer font-medium space-x-1 rounded-md px-4 py-2">
          <IoMdAdd />
          <p>Book a session</p>
        </div>
      </div>

      {/* <Card> */}
      <DateRange />

      {/* <DatePickerDemo /> */}
      <ScrollArea className="flex p-1 justify-start items-center space-x-2 max-w-7xl w-full">
        <div className="flex space-x-2 max-w-7xl w-full">
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