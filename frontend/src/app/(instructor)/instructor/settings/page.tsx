"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import toast, { Toaster } from "react-hot-toast";
import { Title } from "@tremor/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { dmSans, poppins } from "@/lib/config/fonts";
import { CustomSwitch } from "../courses/[courseId]/_components/PublishCourseForm";

// ✅ Form Schema
const FormSchema = z.object({
  enrollment_notification: z.boolean().default(true).optional(),
  course_review_notification: z.boolean().default(true).optional(),
  qandAns_reminders: z.boolean().default(true).optional(),
  marketing_emails: z.boolean().default(true).optional(),
  security_emails: z.boolean().default(true).optional(),
});

// interface CustomSwitchProps {
//   checked: boolean | undefined;
//   onCheckedChange: (value: boolean) => void;
//   disabled?: boolean;
//   size?: "sm" | "md" | "lg";
//   variant?: "default" | "success" | "primary" | "warning";
//   label?: string;
//   description?: string;
//   showIcons?: boolean;
//   id?: string;
//   "aria-label"?: string;
//   "aria-labelledby"?: string;
//   "aria-describedby"?: string;
// }

// export const CustomSwitch: React.FC<CustomSwitchProps> = ({
//   checked,
//   onCheckedChange,
//   disabled = false,
//   size = "md",
//   variant = "default",
//   label,
//   description,
//   showIcons = false,
//   id,
//   "aria-label": ariaLabel,
//   "aria-labelledby": ariaLabelledBy,
//   "aria-describedby": ariaDescribedBy,
// }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   // Handle undefined/null values properly
//   const isChecked = Boolean(checked);

//   // Precise size configurations - fixed positioning calculations
//   const sizeConfig = {
//     sm: {
//       container: "h-5 w-9",
//       thumb: "h-4 w-4",
//       translateOn: "translate-x-4", // Move to right
//       translateOff: "translate-x-0.5", // Move to left
//       icon: "w-2.5 h-2.5",
//     },
//     md: {
//       container: "h-6 w-11",
//       thumb: "h-5 w-5",
//       translateOn: "translate-x-5", // Move to right
//       translateOff: "translate-x-0.5", // Move to left
//       icon: "w-3 h-3",
//     },
//     lg: {
//       container: "h-7 w-14",
//       thumb: "h-6 w-6",
//       translateOn: "translate-x-7", // Move to right
//       translateOff: "translate-x-0.5", // Move to left
//       icon: "w-4 h-4",
//     },
//   };

//   // Clean color variants
//   const variantConfig = {
//     default: {
//       active: "bg-green-500",
//       inactive: "bg-gray-300 dark:bg-gray-600",
//       focus: "focus:ring-green-500/20",
//     },
//     success: {
//       active: "bg-emerald-500",
//       inactive: "bg-gray-300 dark:bg-gray-600",
//       focus: "focus:ring-emerald-500/20",
//     },
//     primary: {
//       active: "bg-blue-500",
//       inactive: "bg-gray-300 dark:bg-gray-600",
//       focus: "focus:ring-blue-500/20",
//     },
//     warning: {
//       active: "bg-amber-500",
//       inactive: "bg-gray-300 dark:bg-gray-600",
//       focus: "focus:ring-amber-500/20",
//     },
//   };

//   const config = sizeConfig[size];
//   const colors = variantConfig[variant];

//   // Optimized icons
//   const CheckIcon = () => (
//     <svg
//       className={clsx("text-green-600", config.icon)}
//       fill="currentColor"
//       viewBox="0 0 20 20"
//     >
//       <path
//         fillRule="evenodd"
//         d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//         clipRule="evenodd"
//       />
//     </svg>
//   );

//   const XIcon = () => (
//     <svg
//       className={clsx("text-gray-500", config.icon)}
//       fill="currentColor"
//       viewBox="0 0 20 20"
//     >
//       <path
//         fillRule="evenodd"
//         d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//         clipRule="evenodd"
//       />
//     </svg>
//   );

//   const handleKeyDown = (event: React.KeyboardEvent) => {
//     if (event.key === " " || event.key === "Enter") {
//       event.preventDefault();
//       if (!disabled) {
//         onCheckedChange(!isChecked);
//       }
//     }
//   };

//   const switchElement = (
//     <button
//       id={id}
//       type="button"
//       role="switch"
//       aria-checked={isChecked}
//       aria-label={ariaLabel}
//       aria-labelledby={ariaLabelledBy}
//       aria-describedby={ariaDescribedBy}
//       disabled={disabled}
//       onClick={() => !disabled && onCheckedChange(!isChecked)}
//       onFocus={() => setIsFocused(true)}
//       onBlur={() => setIsFocused(false)}
//       onKeyDown={handleKeyDown}
//       className={clsx(
//         // Base styles
//         "relative inline-flex items-center rounded-full p-0.5 transition-all duration-200 focus:outline-none",
//         config.container,

//         // Colors based on state
//         isChecked ? colors.active : colors.inactive,

//         // Focus and interaction states
//         !disabled && [
//           "cursor-pointer hover:shadow-md active:scale-95",
//           isFocused && `ring-4 ${colors.focus}`,
//         ],

//         // Disabled state
//         disabled && "cursor-not-allowed opacity-50"
//       )}
//     >
//       {/* Thumb */}
//       <div
//         className={clsx(
//           "flex items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 transform",
//           config.thumb,

//           // Position based on checked state - fixed positioning
//           isChecked ? config.translateOn : config.translateOff,

//           // Hover effects
//           !disabled && "hover:shadow-lg"
//         )}
//       >
//         {showIcons && (
//           <>
//             <div
//               className={clsx(
//                 "absolute inset-0 flex items-center justify-center transition-all duration-150",
//                 isChecked ? "opacity-100 scale-100" : "opacity-0 scale-75"
//               )}
//             >
//               <CheckIcon />
//             </div>
//             <div
//               className={clsx(
//                 "absolute inset-0 flex items-center justify-center transition-all duration-150",
//                 !isChecked ? "opacity-100 scale-100" : "opacity-0 scale-75"
//               )}
//             >
//               <XIcon />
//             </div>
//           </>
//         )}
//       </div>
//     </button>
//   );

//   // Return just switch if no label
//   if (!label && !description) {
//     return switchElement;
//   }

//   // Return with label and description
//   return (
//     <div className="flex items-start gap-3">
//       {switchElement}
//       <div className="flex-1">
//         {label && (
//           <label
//             htmlFor={id}
//             className={clsx(
//               "block text-sm font-medium text-gray-900 dark:text-gray-100",
//               disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
//             )}
//           >
//             {label}
//           </label>
//         )}
//         {description && (
//           <p
//             className={clsx(
//               "mt-1 text-xs text-gray-500 dark:text-gray-400",
//               disabled && "opacity-60"
//             )}
//           >
//             {description}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// ✅ Main Component
export default function InstructorSettings() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enrollment_notification: true,
      course_review_notification: true,
      qandAns_reminders: true,
      marketing_emails: true,
      security_emails: true,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast.success("Settings updated successfully!");
    console.log("Form data:", data);
  };

  return (
    <div className="px-6 py-12 md:px-20 md:py-16 font-sans">
      <Toaster />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`${poppins.className}  w-full space-y-10`}
        >
          {/* Notifications */}
          <section>
            <h3
              className={`${dmSans.className} mb-6 text-xl font-bold tracking-tight text-zinc-900 dark:text-white`}
            >
              Notifications
            </h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="enrollment_notification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-800 dark:border-zinc-200 p-5 shadow-sm">
                    <div>
                      <FormLabel
                        className={`${dmSans.className} text-base font-semibold font-dmsans text-zinc-900 dark:text-white`}
                      >
                        Enrollment Notifications
                      </FormLabel>
                      <FormDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                        Get notified when someone enrolls in your course.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <CustomSwitch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                        disabled={false}
                        color={field.value ? "green" : "gray"}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="course_review_notification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-800 dark:border-zinc-200 p-5 shadow-sm">
                    <div>
                      <FormLabel
                        className={`${dmSans.className} text-base font-semibold font-dmsans text-zinc-900 dark:text-white`}
                      >
                        Course Review Notifications
                      </FormLabel>
                      <FormDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                        Stay updated when students review your course.
                      </FormDescription>
                    </div>
                    <FormControl>
                      {/* <CustomSwitch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      /> */}
                      <CustomSwitch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                        disabled={false}
                        color={field.value ? "green" : "gray"}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="qandAns_reminders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-800 dark:border-zinc-200 p-5 shadow-sm">
                    <div>
                      <FormLabel
                        className={`${dmSans.className} text-base font-semibold font-dmsans text-zinc-900 dark:text-white`}
                      >
                        Q&A Notifications
                      </FormLabel>
                      <FormDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                        Receive alerts about new questions in your course Q&A.
                      </FormDescription>
                    </div>
                    <FormControl>
                      {/* <CustomSwitch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      /> */}
                      <CustomSwitch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                        disabled={false}
                        color={field.value ? "green" : "gray"}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Email Notifications */}
          <section>
            <h3
              className={`${dmSans.className} mb-6 text-xl font-bold tracking-tight text-zinc-900 dark:text-white font-poppins`}
            >
              Email Notifications
            </h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="marketing_emails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-800 dark:border-zinc-200 p-5 shadow-sm">
                    <div>
                      <FormLabel
                        className={`${dmSans.className} text-base font-semibold font-dmsans text-zinc-900 dark:text-white`}
                      >
                        Marketing Emails
                      </FormLabel>
                      <FormDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                        Updates about new features, offers, and promotions.
                      </FormDescription>
                    </div>
                    <FormControl>
                      {/* <CustomSwitch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      /> */}
                      <CustomSwitch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                        disabled={false}
                        color={field.value ? "green" : "gray"}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="security_emails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-800 dark:border-zinc-200 p-5 shadow-sm">
                    <div>
                      <FormLabel
                        className={`${dmSans.className} text-base font-semibold font-dmsans text-zinc-900 dark:text-white`}
                      >
                        Security Emails
                      </FormLabel>
                      <FormDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                        Important alerts about your account security.
                      </FormDescription>
                    </div>
                    <FormControl>
                      {/* <CustomSwitch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled
                      /> */}
                      <CustomSwitch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                        disabled={false}
                        color={field.value ? "green" : "gray"}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Account Settings */}
          <section>
            <h3
              className={`${dmSans.className}  mb-6 text-xl font-bold tracking-tight text-zinc-900 dark:text-white font-poppins`}
            >
              Account Settings
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <ChangePasswordWidget />
              <DeleteAccountWidget />
            </div>
          </section>
        </form>
      </Form>
    </div>
  );
}

// Delete Account Widget
function DeleteAccountWidget() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="group flex w-full cursor-pointer flex-col gap-1 rounded-xl border border-gray-800 dark:border-zinc-200 p-6 shadow-sm transition-all hover:bg-red-600">
          <Title
            className={`${dmSans.className}  text-lg font-semibold text-zinc-900 group-hover:text-white dark:text-white font-poppins`}
          >
            Delete Account
          </Title>
          <FormDescription className="text-sm text-zinc-500 group-hover:text-gray-200 dark:text-zinc-400 dark:group-hover:text-zinc-200">
            Permanently remove your account and data.
          </FormDescription>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will delete your account and all
            associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={`${dmSans.className} bg-red-600 hover:bg-red-700`}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Change Password Widget
function ChangePasswordWidget() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group flex w-full cursor-pointer flex-col gap-1 rounded-xl border border-gray-800 dark:border-zinc-200 p-6 shadow-sm transition-all hover:bg-green-600">
          <Title
            className={`${dmSans.className} text-lg font-semibold text-zinc-900 group-hover:text-white dark:text-white font-poppins`}
          >
            Change Password
          </Title>
          <FormDescription className="text-sm text-zinc-500 group-hover:text-gray-200 dark:text-zinc-400 dark:group-hover:text-zinc-200">
            Update your password to keep your account secure.
          </FormDescription>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={`${dmSans.className}`}>
            Change Password
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Enter a new password below and confirm before saving.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right font-dmsans">
              New Password
            </Label>
            <Input
              id="newPassword"
              placeholder="Enter your new password"
              type="password"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmPassword" className="text-right font-dmsans">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              placeholder="Confirm your password"
              type="password"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
