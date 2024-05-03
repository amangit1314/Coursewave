import React from "react";
import {
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";
import { es } from "date-fns/locale";

export default function DateRangePickerSpanish() {
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
