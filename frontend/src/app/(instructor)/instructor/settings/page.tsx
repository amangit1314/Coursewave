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
  FormMessage,
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
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import { useChangePassword, useDeleteAccount } from "@/hooks/useAccount";
import { ChevronRight, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { ChangePasswordData } from "@/types/profile.service.types";

// ✅ Form Schema
const FormSchema = z.object({
  enrollment_notification: z.boolean().default(true).optional(),
  course_review_notification: z.boolean().default(true).optional(),
  qandAns_reminders: z.boolean().default(true).optional(),
  marketing_emails: z.boolean().default(true).optional(),
  security_emails: z.boolean().default(true).optional(),
});

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
    <div className="px-6 py-12 md:px-20 md:py-10 font-sans">
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
  const { user } = useUserStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState(""); // confirmation password
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error("Please enter your password to confirm account deletion");
      return;
    }
    try {
      deleteAccount(password, {
        onSuccess: () => {
          toast.success("Account deleted successfully");
          setOpen(false);
          setPassword("");
          router.push("/login");
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || "Failed to delete account"
          );
        },
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

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
      <AlertDialogContent className="sm:max-w-[550px] border-zinc-200 dark:border-zinc-700 top-8 max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-zinc-600 dark:text-zinc-400 text-base">
            This action cannot be undone.
            <br />
            Your account and all data will be{" "}
            <span className="font-semibold text-red-500">
              permanently removed
            </span>
            . Please confirm by entering your password.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-6">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Enter your password to confirm:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            disabled={isPending}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-700 mt-6">
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            className="rounded-xl border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => {
              setOpen(false);
              setPassword(""); // clear input when canceling
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={isPending || !password}
            className="rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const changePasswordFormSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const ChangePasswordWidget = () => {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof changePasswordFormSchema>) => {
    try {
      changePassword(
        {
          currentPassword: values.oldPassword,
          newPassword: values.newPassword,
        } as ChangePasswordData,
        {
          onSuccess: () => {
            toast.success("Password changed successfully!");
            form.reset();
            setShowOldPassword(false);
            setShowNewPassword(false);
            setIsDialogOpen(false);
          },
          onError: (err: any) => {
            toast.error(
              err.response?.data?.message || "Failed to change password"
            );
          },
        }
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to change password in catch"
      );
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setShowOldPassword(false);
      setShowNewPassword(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
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

      <DialogContent className="sm:max-w-[550px] top-8 max-h-[90vh] overflow-y-auto border-zinc-200 dark:border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-zinc-950 dark:text-white text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-600 dark:text-zinc-400">
            Update your account password. Make sure to use a strong password.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-zinc-800 dark:text-gray-100">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showOldPassword ? "text" : "password"}
                        disabled={isSubmitting}
                        placeholder="Enter current password"
                        className="border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 focus:border-green-500 dark:focus:border-green-500 transition-colors rounded-xl h-12 px-4 pr-12"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4 text-zinc-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-zinc-500" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-zinc-800 dark:text-gray-100">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        disabled={isSubmitting}
                        placeholder="Enter new password"
                        className="border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 focus:border-green-500 dark:focus:border-green-500 transition-colors rounded-xl h-12 px-4 pr-12"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-zinc-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-zinc-500" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                    Must be at least 6 characters long
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting || isPending}
                className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                {isSubmitting || isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
