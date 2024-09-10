import  DatePickerDemo  from "@/app/(dashboard)/(routes)/[userId]/dashboard/_components/date-picker-widget";

const DateRange = () => {
  return (
    <div className="flex items-center" data-rangepicker>
      <DatePickerDemo />
      <span className="mx-4 text-gray-500">to</span>
      <DatePickerDemo />
    </div>
  );
};

export default DateRange;
