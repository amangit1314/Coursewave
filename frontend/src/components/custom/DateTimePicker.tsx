import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils/utils";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  showTimePicker?: boolean;
  disabled?: boolean;
  disablePastDates?: boolean;
  placeholder?: string;
  className?: string;
  timeValue?: string;
  onTimeChange?: (time: string) => void;
  error?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  showTimePicker = false,
  disabled = false,
  disablePastDates = true,
  placeholder = "Select date",
  className = "",
  timeValue = "09:00",
  onTimeChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalTime, setInternalTime] = useState(timeValue);

  const handleDateSelect = (date: Date | undefined) => {
    onChange(date);
    if (!showTimePicker) {
      setIsOpen(false);
    }
  };

  const handleTimeChange = (time: string) => {
    setInternalTime(time);
    if (onTimeChange) {
      onTimeChange(time);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setInternalTime("09:00");
    if (onTimeChange) {
      onTimeChange("09:00");
    }
  };

  const displayTime = onTimeChange ? timeValue : internalTime;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        {/* Date Picker */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                "flex-1 h-11 pl-10 pr-10 text-left font-normal border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700/70 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200 shadow-sm hover:shadow-md",
                !value && "text-zinc-400 dark:text-zinc-500",
                error && "border-red-500 dark:border-red-500"
              )}
            >
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 w-4 h-4 pointer-events-none" />
              {value ? (
                <span className="text-zinc-900 dark:text-zinc-100 font-medium text-sm">
                  {format(value, "PPP")}
                </span>
              ) : (
                <span className="text-sm">{placeholder}</span>
              )}
              {value && !disabled && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl"
            align="start"
          >
            <CalendarComponent
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              disabled={
                disablePastDates
                  ? (date) => date < new Date(new Date().setHours(0, 0, 0, 0))
                  : undefined
              }
              initialFocus
              className="rounded-xl"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center px-4",
                caption_label: "text-sm font-semibold text-zinc-900 dark:text-zinc-100",
                nav: "space-x-1 flex items-center",
                nav_button:
                  "h-8 w-8 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors",
                nav_button_previous: "absolute left-2",
                nav_button_next: "absolute right-2",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                  "text-zinc-500 dark:text-zinc-400 rounded-md w-10 font-medium text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-zinc-100 dark:[&:has([aria-selected])]:bg-zinc-800 [&:has([aria-selected].day-range-end)]:rounded-r-lg [&:has([aria-selected].day-range-start)]:rounded-l-lg first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg",
                day: "h-10 w-10 p-0 font-normal hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors aria-selected:opacity-100",
                day_range_start: "day-range-start",
                day_range_end: "day-range-end",
                day_selected:
                  "bg-green-600 text-white hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white dark:bg-green-600 dark:hover:bg-green-700",
                day_today:
                  "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold",
                day_outside: "text-zinc-400 dark:text-zinc-600 opacity-50",
                day_disabled: "text-zinc-400 dark:text-zinc-600 opacity-50 cursor-not-allowed",
                day_hidden: "invisible",
              }}
            />
            
            {/* Time Picker in Popover */}
            {showTimePicker && (
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Select Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 w-4 h-4 pointer-events-none z-10" />
                    <Input
                      type="time"
                      value={displayTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      disabled={disabled}
                      className="h-10 pl-10 pr-4 text-sm font-medium border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-green-500 dark:focus:border-green-600 transition-all duration-200 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Standalone Time Picker (when not in calendar popover) */}
        {showTimePicker && (
          <div className="w-40">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 w-4 h-4 pointer-events-none z-10" />
              <Input
                type="time"
                value={displayTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                disabled={disabled}
                className={cn(
                  "h-11 pl-10 pr-4 text-sm font-medium border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-green-500 dark:focus:border-green-600 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200 shadow-sm hover:shadow-md text-zinc-900 dark:text-zinc-100",
                  error && "border-red-500 dark:border-red-500"
                )}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
};

// Optional: Compact version without external time input
interface DateTimePickerCompactProps {
  value?: Date;
  onChange: (date: Date | undefined, time?: string) => void;
  showTimePicker?: boolean;
  disabled?: boolean;
  disablePastDates?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const DateTimePickerCompact: React.FC<DateTimePickerCompactProps> = ({
  value,
  onChange,
  showTimePicker = false,
  disabled = false,
  disablePastDates = true,
  placeholder = "Select date",
  className = "",
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState("09:00");

  const handleDateSelect = (date: Date | undefined) => {
    onChange(date, showTimePicker ? time : undefined);
    if (!showTimePicker) {
      setIsOpen(false);
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (value) {
      onChange(value, newTime);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined, undefined);
    setTime("09:00");
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full h-11 pl-10 pr-10 text-left font-normal border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700/70 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200 shadow-sm hover:shadow-md",
              !value && "text-zinc-400 dark:text-zinc-500",
              error && "border-red-500 dark:border-red-500"
            )}
          >
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 w-4 h-4 pointer-events-none" />
            {value ? (
              <span className="text-zinc-900 dark:text-zinc-100 font-medium text-sm">
                {format(value, "PPP")}
                {showTimePicker && <span className="text-zinc-500 ml-2">at {time}</span>}
              </span>
            ) : (
              <span className="text-sm">{placeholder}</span>
            )}
            {value && !disabled && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl"
          align="start"
        >
          <CalendarComponent
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            disabled={
              disablePastDates
                ? (date) => date < new Date(new Date().setHours(0, 0, 0, 0))
                : undefined
            }
            initialFocus
            className="rounded-xl"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center px-4",
              caption_label: "text-sm font-semibold text-zinc-900 dark:text-zinc-100",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-8 w-8 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors",
              nav_button_previous: "absolute left-2",
              nav_button_next: "absolute right-2",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-zinc-500 dark:text-zinc-400 rounded-md w-10 font-medium text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-zinc-100 dark:[&:has([aria-selected])]:bg-zinc-800 [&:has([aria-selected].day-range-end)]:rounded-r-lg [&:has([aria-selected].day-range-start)]:rounded-l-lg first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg",
              day: "h-10 w-10 p-0 font-normal hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors aria-selected:opacity-100",
              day_range_start: "day-range-start",
              day_range_end: "day-range-end",
              day_selected:
                "bg-green-600 text-white hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white dark:bg-green-600 dark:hover:bg-green-700",
              day_today:
                "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold",
              day_outside: "text-zinc-400 dark:text-zinc-600 opacity-50",
              day_disabled: "text-zinc-400 dark:text-zinc-600 opacity-50 cursor-not-allowed",
              day_hidden: "invisible",
            }}
          />

          {showTimePicker && (
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Select Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 w-4 h-4 pointer-events-none z-10" />
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    disabled={disabled}
                    className="h-10 pl-10 pr-4 text-sm font-medium border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-green-500 dark:focus:border-green-600 transition-all duration-200 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
};