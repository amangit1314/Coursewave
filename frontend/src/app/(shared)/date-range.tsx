/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// // import  DatePickerDemo  from "@/app/(dashboard)/(routes)/[userId]/dashboard/_components/date-picker-widget";
// import DatePickerDemo from "@/app/(dashboard)/[userId]/dashboard/_components/date-picker-widget";
// const DateRange = () => {
//   return (
//     <div className="flex items-center" data-rangepicker>
//       <DatePickerDemo />
//       <span className="mx-4 text-gray-500">to</span>
//       <DatePickerDemo />
//     </div>
//   );
// };
// export default DateRange;

/// ! <=============================================================================================================>

// Import DatePicker from shadcn's date-picker component
// import { DatePicker, Popover, Button, Input, Calendar } from "/@/components";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


const DateRange = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleDateChange = (date: Date, type: "start" | "end") => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  return (
    <div className="flex items-center gap-4" data-rangepicker>
      {/* Start Date Picker */}
      <Popover>
        <PopoverTrigger>
          <Button variant="outline">
            {startDate ? startDate.toDateString() : "Select Start Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {/* TODO: use calendar here */}
          {/* <Calendar
            selected={startDate}
            onSelect={(date: Date | undefined) =>
              handleDateChange(date!, "start")
            }
          /> */}
        </PopoverContent>
      </Popover>

      <span className="text-gray-500">to</span>

      {/* End Date Picker */}
      <Popover>
        <PopoverTrigger>
          <Button variant="outline">
            {endDate ? endDate.toDateString() : "Select End Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {/* <Calendar
            selected={endDate}
            onSelect={(date: Date | undefined) =>
              handleDateChange(date!, "end")
            }
          /> */}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRange;
