// import { useZustandStore } from "@/zustand/store";
// import {
//   Pencil,
//   Tag as TagIcon,
//   Calendar,
//   Target,
//   Clock,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import React, { useState } from "react";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";
// import { LearningGoal } from "./learning-goal";

// const formSchema = z.object({
//   title: z.string().optional(),
//   tag: z.string().optional(),
//   date: z.string().optional(),
//   time: z.string().optional(),
//   isDone: z.boolean().optional(),
// });

// const EditLearningGoal = ({ learningGoal }: { learningGoal: LearningGoal }) => {
//   const { editLearningGoal } = useZustandStore();
//   const [open, setOpen] = useState(false);

//   // Convert stored time to date and time format for the form
//   const getDateTimeFromStoredTime = (time: Date | string) => {
//     try {
//       const dateObj = typeof time === "string" ? new Date(time) : time;
//       return {
//         date: dateObj.toISOString().split("T")[0],
//         time: dateObj.toTimeString().slice(0, 5), // HH:MM format
//       };
//     } catch {
//       return { date: "", time: "09:00" };
//     }
//   };

//   const initialDateTime = getDateTimeFromStoredTime(learningGoal.time);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: learningGoal.title,
//       tag: learningGoal.tag,
//       date: initialDateTime.date,
//       time: initialDateTime.time,
//       isDone: learningGoal.isDone,
//     },
//   });

//   const { isSubmitting, isValid } = form.formState;

//   const onSubmit = (values: z.infer<typeof formSchema>) => {
//     // Combine date and time into a single datetime string
//     const deadlineDateTime = `${values.date}T${values.time}`;

//     editLearningGoal(
//       learningGoal.id,
//       values.title ?? learningGoal.title,
//       values.tag ?? learningGoal.tag,
//       deadlineDateTime
//     );
//     setOpen(false);
//     form.reset();
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group">
//           <Pencil className="h-4 w-4 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
//         </button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[550px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-h-[90vh] overflow-hidden">
//         <DialogHeader>
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
//               <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
//             </div>
//             <div>
//               <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
//                 Edit Learning Goal
//               </DialogTitle>
//               <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
//                 Update your learning goal details and save when you're done.
//               </DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-5 overflow-y-auto px-1 py-4 max-h-[calc(90vh-180px)]"
//           >
//             {/* Title Field */}
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
//                     <Target className="w-4 h-4" />
//                     Goal Title
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       disabled={isSubmitting}
//                       className="border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
//                       placeholder={learningGoal.title}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription className="text-xs text-zinc-500 dark:text-zinc-400">
//                     What goal will you set for yourself?
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Category/Tag Field */}
//             <FormField
//               control={form.control}
//               name="tag"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
//                     <TagIcon className="w-4 h-4" />
//                     Category
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       disabled={isSubmitting}
//                       className="border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
//                       placeholder={learningGoal.tag}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription className="text-xs text-zinc-500 dark:text-zinc-400">
//                     Categorize your goal for better organization
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Deadline Section */}
//             <div className="space-y-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
//               <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
//                 <Calendar className="w-4 h-4" />
//                 <h4 className="text-sm font-semibold">Deadline</h4>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 {/* Date Field */}
//                 <FormField
//                   control={form.control}
//                   name="date"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
//                         Date
//                       </FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-3.5 h-3.5 pointer-events-none" />
//                           <Input
//                             type="date"
//                             disabled={isSubmitting}
//                             className="pl-9 text-sm border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
//                             {...field}
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Time Field */}
//                 <FormField
//                   control={form.control}
//                   name="time"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
//                         Time
//                       </FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-3.5 h-3.5 pointer-events-none" />
//                           <Input
//                             type="time"
//                             disabled={isSubmitting}
//                             className="pl-9 text-sm border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0"
//                             {...field}
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormDescription className="text-xs text-zinc-500 dark:text-zinc-400">
//                 Update your target completion date and time
//               </FormDescription>
//             </div>

//             <DialogFooter className="pt-2 gap-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setOpen(false)}
//                 className="border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={!isValid || isSubmitting}
//                 className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-sm hover:shadow-md transition-all"
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Saving...
//                   </span>
//                 ) : (
//                   <span className="flex items-center gap-2">
//                     <Pencil className="w-4 h-4" />
//                     Save Changes
//                   </span>
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditLearningGoal;


/// =====================================================================================

import { useZustandStore } from "@/zustand/store";
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
import { LearningGoal } from "./learning-goal";
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
  const { editLearningGoal } = useZustandStore();
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
      deadlineDateTime
    );
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group">
          <Pencil className="h-4 w-4 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Edit Learning Goal
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
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
                  <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Goal Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
                      placeholder={learningGoal.title}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-zinc-500 dark:text-zinc-400">
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
                  <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <TagIcon className="w-4 h-4" />
                    Category
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
                      placeholder={learningGoal.tag}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                    Categorize your goal for better organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deadline Section - Enhanced UI */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-800/50 dark:to-zinc-800/30 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
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
                      <FormLabel className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full h-11 pl-10 pr-4 text-left font-normal border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700/70 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200 shadow-sm hover:shadow-md",
                                !field.value &&
                                  "text-zinc-400 dark:text-zinc-500"
                              )}
                            >
                              {field.value ? (
                                <span className="text-zinc-900 dark:text-zinc-100 font-medium text-sm">
                                  {format(field.value, "PPP")}
                                </span>
                              ) : (
                                <span className="text-sm">Select date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl"
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
                                "text-sm font-semibold text-zinc-900 dark:text-zinc-100",
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
                              day_outside:
                                "text-zinc-400 dark:text-zinc-600 opacity-50",
                              day_disabled:
                                "text-zinc-400 dark:text-zinc-600 opacity-50 cursor-not-allowed",
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
                      <FormLabel className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        Time
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 w-4 h-4 pointer-events-none z-10" />
                          <Input
                            type="time"
                            disabled={isSubmitting}
                            className="h-11 pl-10 pr-4 text-sm font-medium border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-green-500 dark:focus:border-green-600 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200 shadow-sm hover:shadow-md text-zinc-900 dark:text-zinc-100"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormDescription className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 pt-1">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                Update your target completion date and time
              </FormDescription>
            </div>

            <DialogFooter className="pt-2 gap-2 flex-col sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-zinc-400 disabled:to-zinc-500 text-white shadow-sm hover:shadow-md transition-all duration-200"
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