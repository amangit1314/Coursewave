"use client";

import { ScrollBar } from "@/components/ui/scroll-area";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScheduledSessionCard from "./scheduled-session-card";
import { useEffect, useState } from "react";
import {
  Calendar,
  CalendarIcon,
  ChevronDownIcon,
  CheckIcon,
  XCircleIcon,
  PlusIcon,
} from "lucide-react";

const DateRangeFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [isFiltering, setIsFiltering] = useState(false);

  const toggleCalendar = () => setIsOpen(!isOpen);

  const handleApply = () => {
    // This would apply the filter with the selected date range
    setIsFiltering(true);
    setIsOpen(false);
  };

  const handleClear = () => {
    setDateRange({ start: null, end: null });
    setIsFiltering(false);
  };

  // Format the selected date range for display
  const formatDateDisplay = () => {
    if (dateRange.start && dateRange.end) {
      return `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`;
    } else if (dateRange.start) {
      return `From ${dateRange.start.toLocaleDateString()}`;
    } else if (dateRange.end) {
      return `Until ${dateRange.end.toLocaleDateString()}`;
    }
    return "Select date range";
  };

  return (
    <div className="relative">
      {/* Date Filter Button */}
      <div
        className={`
          flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors
          ${
            isFiltering
              ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
              : "bg-card border-border"
          }
        `}
        onClick={toggleCalendar}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon
            className={`w-5 h-5 ${isFiltering ? "text-blue-600" : "text-gray-500"}`}
          />
          <div>
            <span
              className={`text-sm font-medium ${isFiltering ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground"}`}
            >
              {isFiltering ? "Filtered by date:" : "Filter by date"}
            </span>
            {isFiltering && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                {formatDateDisplay()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isFiltering && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <XCircleIcon className="w-4 h-4" />
            </button>
          )}
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full max-w-md bg-card rounded-lg shadow-lg border border-border p-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Select date range
            </h4>
            <div className="bg-muted p-3 rounded-md">
              <DateRange setDateRange={setDateRange} dateRange={dateRange} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-muted rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!dateRange.start && !dateRange.end}
              className="px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckIcon className="w-4 h-4" />
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

type ScheduledSessionsProps = {
  userId: string;
};

const ScheduledSessions: React.FC<ScheduledSessionsProps> = ({ userId }) => {
  // const {
  //   upcomingSessions,
  //   loadingState: { loading, error },
  //   fetchUpcomingSessions,
  // } = useSessionsStore();

  // useEffect(() => {
  //   fetchUpcomingSessions(userId);
  // }, [userId, fetchUpcomingSessions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            Scheduled Sessions
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage your upcoming learning sessions
          </p>
        </div>

        <button className="flex items-center justify-center space-x-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors">
          <PlusIcon className="w-4 h-4" />
          <span>Book a session</span>
        </button>
      </div>

      {/* Upcoming Sessions */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          {" "}
          <h4 className="text-md font-semibold text-muted-foreground mb-3">
            Upcoming Sessions
          </h4>
          {/* Date Range Filter */}
          <DateRangeFilter />
        </div>

        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4 w-max">
            {/* w-max is important */}
            <ScheduledSessionCard />
            <ScheduledSessionCard />
            <ScheduledSessionCard />
            <ScheduledSessionCard />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default ScheduledSessions;

const DateRange = ({
  dateRange,
  setDateRange,
}: {
  dateRange: { start: Date | null; end: Date | null };
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get the first day of the month
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );

  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Get the number of days in the month
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  // Days of the week
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Format the month and year for display
  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Handle day selection
  interface DateRange {
    start: Date | null;
    end: Date | null;
  }

  interface HandleSelectDayProps {
    day: number;
  }

  const handleSelectDay = (day: HandleSelectDayProps["day"]): void => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (!dateRange.start) {
      // If no start date is selected, set as start date
      setDateRange({ ...dateRange, start: selectedDate });
    } else if (!dateRange.end && selectedDate >= dateRange.start) {
      // If start date is selected but not end date, and selected date is after start date
      setDateRange({ ...dateRange, end: selectedDate });
    } else {
      // If both dates are selected or selected date is before start date, reset and set as start date
      setDateRange({ start: selectedDate, end: null });
    }
  };

  // Check if a date is the start date
  interface IsStartDateProps {
    day: number;
  }

  const isStartDate = (day: IsStartDateProps["day"]): boolean => {
    if (!dateRange.start) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.toDateString() === dateRange.start.toDateString();
  };

  // Check if a date is the end date
  interface IsEndDateProps {
    day: number;
  }

  const isEndDate = (day: IsEndDateProps["day"]): boolean => {
    if (!dateRange.end) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.toDateString() === dateRange.end.toDateString();
  };

  // Check if a date is within the selected range
  interface IsInRangeProps {
    day: number;
  }

  const isInRange = (day: IsInRangeProps["day"]): boolean => {
    if (!dateRange.start || !dateRange.end) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date > dateRange.start && date < dateRange.end;
  };

  // Check if a date is today
  const isToday = (day: number): boolean => {
    const today: Date = new Date();
    const date: Date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="w-full">
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-1 rounded-full hover:bg-muted"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h3 className="text-sm font-medium text-muted-foreground">
          {formatMonthYear(currentMonth)}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-muted"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: firstDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="h-8"></div>
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          return (
            <button
              key={day}
              onClick={() => handleSelectDay(day)}
              className={`
                h-8 rounded-md flex items-center justify-center text-xs
                ${isToday(day) ? "font-bold" : "font-medium"}
                ${
                  isStartDate(day) || isEndDate(day)
                    ? "bg-blue-600 text-white"
                    : isInRange(day)
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                      : "hover:bg-muted text-muted-foreground"
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Range display */}
      {(dateRange.start || dateRange.end) && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {dateRange.start && (
              <span>From: {dateRange.start.toLocaleDateString()}</span>
            )}
            {dateRange.start && dateRange.end && " - "}
            {dateRange.end && (
              <span>To: {dateRange.end.toLocaleDateString()}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

// export default DateRange;
