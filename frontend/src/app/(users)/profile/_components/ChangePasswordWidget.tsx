"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lock } from "lucide-react";
import toast from "react-hot-toast";
import "@uploadthing/react/styles.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormDescription,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useUserStore } from "@/zustand/userStore";
import { useChangePassword } from "@/hooks/useAccount";
import { ChangePasswordData } from "@/types/profile.service.types";

const changePasswordFormSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const ChangePasswordWidget = () => {
  const { mutate: changePassword, isPending, error } = useChangePassword();

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
          },
          onError: (err: any) => {
            console.log("Error in updating password: ", err.message);
            toast.error(
              err.response?.data?.message || "Failed to change password"
            );
          },
        }
      );
    } catch (err: any) {
      console.log("Error in updating password in catch: ", err.message);
      toast.error(err.response?.data?.message || "Failed to change password in catch");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 flex-shrink-0">
              <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-zinc-900 dark:text-white truncate">
                Change Password
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                Update your password
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] top-8">
        <DialogHeader>
          <DialogTitle className="text-zinc-950 dark:text-white text-center">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-center">
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
                  <FormLabel className="text-zinc-800 dark:text-white">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isSubmitting}
                      placeholder="Enter current password"
                      className="bg-white dark:bg-zinc-800"
                      {...field}
                    />
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
                  <FormLabel className="text-zinc-800 dark:text-white">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isSubmitting}
                      placeholder="Enter new password"
                      className="bg-white dark:bg-zinc-800"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Must be at least 6 characters long
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!isValid || isSubmitting || isPending}>
                {isSubmitting || isPending ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordWidget;
