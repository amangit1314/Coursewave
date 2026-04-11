"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lock, Loader2, Eye, EyeOff } from "lucide-react";
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
import { useChangePassword } from "@/hooks/useAccount";
import { ChangePasswordData } from "@/types/profile.service.types";

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
            // Reset visibility states
            setShowOldPassword(false);
            setShowNewPassword(false);
            // Close the dialog
            setIsDialogOpen(false);
          },
          onError: (err: any) => {
            console.error("Error in updating password: ", err.message);
            toast.error(
              err.response?.data?.message || "Failed to change password"
            );
            // Note: We don't close the dialog on error so user can fix the issue
          },
        }
      );
    } catch (err: any) {
      console.error("Error in updating password in catch: ", err.message);
      toast.error(
        err.response?.data?.message || "Failed to change password in catch"
      );
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    // Reset form when dialog closes
    if (!open) {
      form.reset();
      setShowOldPassword(false);
      setShowNewPassword(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800/80 dark:to-zinc-900/80 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/20 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-green-500 via-emerald-500 to-teal-500 text-white flex-shrink-0 shadow-md shadow-green-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Lock className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-zinc-900 dark:text-white truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Change Password
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                Update your password securely
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400 flex-shrink-0 group-hover:translate-x-1 group-hover:text-green-500 transition-all duration-300" />
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

export default ChangePasswordWidget;