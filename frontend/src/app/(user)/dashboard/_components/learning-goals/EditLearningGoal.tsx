import { useLearningGoalsStore } from "@/zustand/learningGoalsStore";
import {
  Pencil,
  Tag as TagIcon,
  Calendar,
  Target,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { LearningGoal } from "@/types/learning-goal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils/utils";

const formSchema = z.object({
  title: z.string().optional(),
  tag: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.string().optional(),
  isDone: z.boolean().optional(),
});

const EditLearningGoal = ({ learningGoal }: { learningGoal: LearningGoal }) => {
  const { editLearningGoal } = useLearningGoalsStore();
  const [open, setOpen] = useState(false);

  // Convert stored time to date and time format for the form
  const getDateTimeFromStoredTime = (time: Date | string) => {
    try {
      const dateObj = typeof time === "string" ? parseISO(time) : time;
      return {
        date: dateObj,
        time: dateObj.toTimeString().slice(0, 5), // HH:MM format
      };
    } catch {
      return { 
        date: new Date(), 
        time: "09:00" 
      };
    }
  };

  const initialDateTime = getDateTimeFromStoredTime(learningGoal.time);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: learningGoal.title,
      tag: learningGoal.tag,
      date: initialDateTime.date,
      time: initialDateTime.time,
      isDone: learningGoal.isDone,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Format date to YYYY-MM-DD and combine with time
    const formattedDate = format(values.date, "yyyy-MM-dd");
    const deadlineDateTime = `${formattedDate}T${values.time}`;

    editLearningGoal(
      learningGoal.id,
      values.title ?? learningGoal.title,
      values.tag ?? learningGoal.tag,
      formattedDate,
      values.time ?? learningGoal.time
    );
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors group">
          <Pencil className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-card border border-border rounded-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Edit Learning Goal
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Update your learning goal details and save when you're done.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 overflow-y-auto px-1 py-4 max-h-[calc(90vh-180px)]"
          >
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Goal Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="border-border bg-card rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
                      placeholder={learningGoal.title}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    What goal will you set for yourself?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category/Tag Field */}
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TagIcon className="w-4 h-4" />
                    Category
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="border-border bg-card rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
                      placeholder={learningGoal.tag}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Categorize your goal for better organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deadline Section - Enhanced UI */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-800/50 dark:to-zinc-800/30 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-sm font-semibold">Deadline</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Field with Enhanced Calendar Picker */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs font-medium text-muted-foreground mb-2">
                        Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full h-11 pl-10 pr-4 text-left font-normal border-border bg-card rounded-lg hover:bg-muted/70 hover:border-muted-foreground/40 transition-all duration-200 shadow-sm hover:shadow-md",
                                !field.value &&
                                  "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                <span className="text-foreground font-medium text-sm">
                                  {format(field.value, "PPP")}
                                </span>
                              ) : (
                                <span className="text-sm">Select date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-card border-border shadow-xl rounded-xl"
                          align="start"
                        >
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                            className="rounded-xl"
                            classNames={{
                              months:
                                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                              month: "space-y-4",
                              caption:
                                "flex justify-center pt-1 relative items-center px-4",
                              caption_label:
                                "text-sm font-semibold text-foreground",
                              nav: "space-x-1 flex items-center",
                              nav_button:
                                "h-8 w-8 bg-transparent hover:bg-muted rounded-lg transition-colors",
                              nav_button_previous: "absolute left-2",
                              nav_button_next: "absolute right-2",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex",
                              head_cell:
                                "text-muted-foreground rounded-md w-10 font-medium text-[0.8rem]",
                              row: "flex w-full mt-2",
                              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-zinc-100 dark:[&:has([aria-selected])]:bg-zinc-800 [&:has([aria-selected].day-range-end)]:rounded-r-lg [&:has([aria-selected].day-range-start)]:rounded-l-lg first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg",
                              day: "h-10 w-10 p-0 font-normal hover:bg-muted rounded-lg transition-colors aria-selected:opacity-100",
                              day_range_start: "day-range-start",
                              day_range_end: "day-range-end",
                              day_selected:
                                "bg-green-600 text-white hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white dark:bg-green-600 dark:hover:bg-green-700",
                              day_today:
                                "bg-muted text-foreground font-semibold",
                              day_outside:
                                "text-muted-foreground opacity-50",
                              day_disabled:
                                "text-muted-foreground opacity-50 cursor-not-allowed",
                              day_hidden: "invisible",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Time Field with Enhanced Time Picker */}
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs font-medium text-muted-foreground mb-2">
                        Time
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 w-4 h-4 pointer-events-none z-10" />
                          <Input
                            type="time"
                            disabled={isSubmitting}
                            className="h-11 pl-10 pr-4 text-sm font-medium border-border bg-card rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-green-500 dark:focus:border-green-600 hover:border-muted-foreground/40 transition-all duration-200 shadow-sm hover:shadow-md text-foreground"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                Update your target completion date and time
              </FormDescription>
            </div>

            <DialogFooter className="pt-2 gap-2 flex-col sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto border-border hover:bg-muted transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Pencil className="w-4 h-4" />
                    Save Changes
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLearningGoal;