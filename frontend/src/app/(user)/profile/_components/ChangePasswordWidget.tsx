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
            console.log("Error in updating password: ", err.message);
            toast.error(
              err.response?.data?.message || "Failed to change password"
            );
            // Note: We don't close the dialog on error so user can fix the issue
          },
        }
      );
    } catch (err: any) {
      console.log("Error in updating password in catch: ", err.message);
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
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-emerald-500/30 transition-all duration-200 cursor-pointer group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
              <Lock className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-foreground truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Change Password
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Update your password securely
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all duration-200" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
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
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showOldPassword ? "text" : "password"}
                        disabled={isSubmitting}
                        placeholder="Enter current password"
                        className="pr-12"
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
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
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
                  <FormLabel className="text-sm font-semibold text-foreground">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        disabled={isSubmitting}
                        placeholder="Enter new password"
                        className="pr-12"
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
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground dark:text-zinc-400">
                    Must be at least 6 characters long
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting || isPending}
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