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
import { toast } from "@/components/ui/use-toast";
import { GrLinkNext } from "react-icons/gr";
import { Card, Title } from "@tremor/react";
import { Toaster } from "@/components/ui/toaster";
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
  session_reminders: z.boolean().default(true).optional(),
  qandAns_reminders: z.boolean().default(true).optional(),
  course_updates: z.boolean().default(true).optional(),
  marketing_emails: z.boolean().default(true).optional(),
  security_emails: z.boolean().default(true).optional(),
});

function Settings() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      session_reminders: true,
      qandAns_reminders: true,
      course_updates: true,
      marketing_emails: true,
      security_emails: true,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
              <h3 className="mb-4 text-lg font-medium">Notifications</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="session_reminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Session Reminders
                        </FormLabel>
                        <FormDescription>
                          Receive notifications reminders regarding sessions in
                          browser.
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
                        <FormLabel className="text-base">
                          QnA Notification
                        </FormLabel>
                        <FormDescription>
                          Receive emails about qna chat replies or new messages
                          updates in the enrolled course
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
              <h3 className="mb-4 mt-4 text-lg font-medium">
                Email Notifications
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="course_updates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Course Updates{" "}
                        </FormLabel>
                        <FormDescription>
                          Receive emails about new updates in the enrolled
                          course
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
                  name="marketing_emails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Marketing emails
                        </FormLabel>
                        <FormDescription>
                          Receive emails about new products, features, and more.
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
                        <FormLabel className="text-base">
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
              <h3 className="mb-4 mt-4 text-lg font-medium">
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

export default Settings;

function DeleteAccountWidget() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex flex-col ml-4 cursor-pointer hover:bg-red-500 items-center justify-between rounded-lg border p-4 transition-all duration-300">
          <div className="space-y-0.5">
            <Title className="text-base font-bold ">Delete Account</Title>
            {/* <p>Click here to delete your Coursewave account</p> */}
            <FormDescription>
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
        <div className="flex flex-col cursor-pointer hover:bg-green-800 items-center justify-between rounded-lg border p-4 transition-all duration-300">
          <div className="space-y-0.5">
            <Title className="text-base font-bold">Change Password</Title>
            {/* <p>Receive emails about new products, features, and more</p> */}
            <FormDescription>
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
            <Input id="newPassword" value="Enter your new password ..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Confirm Password
            </Label>
            <Input id="confirmPassword" value="Confirm your password ..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
