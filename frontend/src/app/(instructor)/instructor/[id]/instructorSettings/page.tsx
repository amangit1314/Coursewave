"use client";

import React from "react";
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
import { Switch } from "@/components/ui/switch";
import toast, { Toaster } from "react-hot-toast";
import { Card, Title } from "@tremor/react";
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

const FormSchema = z.object({
  course_update_reminder: z.boolean().default(true).optional(),
  new_services_reminder: z.boolean().default(true).optional(),
  enrollment_notification: z.boolean().default(true).optional(),
  course_review_notification: z.boolean().default(true).optional(),
  session_reminders: z.boolean().default(true).optional(),
  qandAns_reminders: z.boolean().default(true).optional(),
  course_updates: z.boolean().default(true).optional(),
  marketing_emails: z.boolean().default(true).optional(),
  security_emails: z.boolean().default(true).optional(),
});

export default function InstructorSettings() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      course_update_reminder: true,
      new_services_reminder: true,
      enrollment_notification: true,
      course_review_notification: true,
      // session_reminders: true,
      qandAns_reminders: true,
      course_updates: true,
      marketing_emails: true,
      security_emails: true,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast.success("Settings updated successfully!");
    console.log("Form data:", data);
  };

  return (
    <div className="p-20">
      <Toaster />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div>
            <div>
              <h3 className="mb-4 text-lg font-semibold tracking-tight text-zinc-800 dark:text-white">
                Notifications
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="enrollment_notification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-zinc-800 dark:text-white">
                          Enrollment Notifications
                        </FormLabel>
                        <FormDescription>
                          Receive notifications whenever somebody enrolls in
                          your course.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="course_review_notification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-zinc-800 dark:text-white">
                          Course Review Notifications
                        </FormLabel>
                        <FormDescription>
                          Receive notifications whenever somebody writes an
                          review for your course.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qandAns_reminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-zinc-800 dark:text-white">
                          QnA Notification
                        </FormLabel>
                        <FormDescription>
                          Receive emails about qna chat or questions asked in
                          your course.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 mt-4 text-lg font-semibold tracking-tight text-zinc-800 dark:text-white">
                Email Notifications
              </h3>
              <div className="space-y-4">
                {/* <FormField
                  control={form.control}
                  name="course_updates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Feature Updates
                        </FormLabel>
                        <FormDescription>
                          Receive emails about new features or updates in the platform
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="marketing_emails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-zinc-800 dark:text-white">
                          Marketing emails
                        </FormLabel>
                        <FormDescription>
                          Receive emails about new products, features, updates,
                          and more.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="security_emails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-zinc-800 dark:text-white">
                          Security emails
                        </FormLabel>
                        <FormDescription>
                          Receive emails about your account security.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 mt-4 text-lg font-semibold tracking-tight text-zinc-800 dark:text-white">
                Account Settings
              </h3>
              <div className="space-x-.5 flex justify-start">
                <ChangePasswordWidget />

                <DeleteAccountWidget />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

function DeleteAccountWidget() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="group ml-4 flex cursor-pointer flex-col items-center justify-between rounded-lg border p-4 transition-all duration-300 hover:bg-red-600">
          <div className="space-y-0.5">
            <Title className="text-base font-semibold text-zinc-800 group-hover:text-white dark:text-white">
              Delete Account
            </Title>
            {/* <p>Click here to delete your Coursewave account</p> */}
            <FormDescription className="group-hover:text-gray-200">
              Click here to delete your Coursewave account
            </FormDescription>
          </div>

          {/* <GrLinkNext size={22} /> */}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction color="red">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ChangePasswordWidget() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group flex cursor-pointer flex-col items-center justify-between rounded-lg border p-4 transition-all duration-300 hover:bg-green-600">
          <div className="space-y-0.5">
            <Title className="text-base font-semibold text-zinc-800 group-hover:text-white dark:text-white">
              Change Password
            </Title>
            {/* <p>Receive emails about new products, features, and more</p> */}
            <FormDescription className="group-hover:text-gray-200">
              Receive emails about new products, features, and more.
            </FormDescription>
          </div>

          {/* <GrLinkNext size={22} /> */}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Make changes in your password here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              New Password
            </Label>
            <Input
              id="newPassword"
              value="Enter your new password ..."
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              value="Confirm your password ..."
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
