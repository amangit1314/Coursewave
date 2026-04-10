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
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { dmSans } from "@/lib/config/fonts";
import { useRouter } from "next/navigation";
import { useChangePassword, useDeleteAccount } from "@/hooks/useAccount";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { ChangePasswordData } from "@/types/profile.service.types";
import { PageContainer, PageHeader } from "@/components/shared";

const FormSchema = z.object({
  enrollment_notification: z.boolean().default(true).optional(),
  course_review_notification: z.boolean().default(true).optional(),
  qandAns_reminders: z.boolean().default(true).optional(),
  marketing_emails: z.boolean().default(true).optional(),
  security_emails: z.boolean().default(true).optional(),
});

type NotificationField = {
  name: keyof z.infer<typeof FormSchema>;
  label: string;
  description: string;
};

const notificationFields: NotificationField[] = [
  { name: "enrollment_notification", label: "Enrollment Notifications", description: "Get notified when someone enrolls in your course." },
  { name: "course_review_notification", label: "Course Review Notifications", description: "Stay updated when students review your course." },
  { name: "qandAns_reminders", label: "Q&A Notifications", description: "Receive alerts about new questions in your course Q&A." },
];

const emailFields: NotificationField[] = [
  { name: "marketing_emails", label: "Marketing Emails", description: "Updates about new features, offers, and promotions." },
  { name: "security_emails", label: "Security Emails", description: "Important alerts about your account security." },
];

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

  const onSubmit = () => {
    toast.success("Settings updated successfully!");
  };

  const renderToggleField = (field: NotificationField) => (
    <FormField
      key={field.name}
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border p-5">
          <div>
            <FormLabel className={`${dmSans.className} text-base font-semibold text-foreground`}>
              {field.label}
            </FormLabel>
            <FormDescription className="text-sm text-muted-foreground">
              {field.description}
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={formField.value || false}
              onCheckedChange={formField.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );

  return (
    <PageContainer size="lg">
      <PageHeader title="Settings" description="Manage your instructor account preferences" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Notifications */}
          <section>
            <h3 className={`${dmSans.className} mb-6 text-lg font-semibold tracking-tight text-foreground`}>
              Notifications
            </h3>
            <div className="space-y-4">
              {notificationFields.map(renderToggleField)}
            </div>
          </section>

          {/* Email Notifications */}
          <section>
            <h3 className={`${dmSans.className} mb-6 text-lg font-semibold tracking-tight text-foreground`}>
              Email Notifications
            </h3>
            <div className="space-y-4">
              {emailFields.map(renderToggleField)}
            </div>
          </section>

          {/* Account Settings */}
          <section>
            <h3 className={`${dmSans.className} mb-6 text-lg font-semibold tracking-tight text-foreground`}>
              Account Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ChangePasswordWidget />
              <DeleteAccountWidget />
            </div>
          </section>
        </form>
      </Form>
    </PageContainer>
  );
}

function DeleteAccountWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error("Please enter your password to confirm account deletion");
      return;
    }
    deleteAccount(password, {
      onSuccess: () => {
        toast.success("Account deleted successfully");
        setOpen(false);
        setPassword("");
        router.push("/login");
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to delete account");
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="group flex w-full cursor-pointer flex-col gap-1 rounded-xl border border-border p-6 transition-colors hover:border-destructive hover:bg-destructive/5">
          <h4 className={`${dmSans.className} text-lg font-semibold text-foreground`}>
            Delete Account
          </h4>
          <p className="text-sm text-muted-foreground">
            Permanently remove your account and data.
          </p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[550px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-center text-destructive">
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground text-base">
            This action cannot be undone. Your account and all data will be{" "}
            <span className="font-semibold text-destructive">permanently removed</span>.
            Please confirm by entering your password.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-6">
          <label htmlFor="delete-password" className="block text-sm font-semibold text-foreground mb-2">
            Enter your password to confirm:
          </label>
          <Input
            type="password"
            id="delete-password"
            value={password}
            disabled={isPending}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={() => { setOpen(false); setPassword(""); }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isPending || !password}
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

function ChangePasswordWidget() {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: { oldPassword: "", newPassword: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof changePasswordFormSchema>) => {
    changePassword(
      { currentPassword: values.oldPassword, newPassword: values.newPassword } as ChangePasswordData,
      {
        onSuccess: () => {
          toast.success("Password changed successfully!");
          form.reset();
          setIsDialogOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to change password");
        },
      }
    );
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) { form.reset(); setShowOldPassword(false); setShowNewPassword(false); }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <div className="group flex w-full cursor-pointer flex-col gap-1 rounded-xl border border-border p-6 transition-colors hover:border-primary hover:bg-primary/5">
          <h4 className={`${dmSans.className} text-lg font-semibold text-foreground`}>
            Change Password
          </h4>
          <p className="text-sm text-muted-foreground">
            Update your password to keep your account secure.
          </p>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">Current Password</FormLabel>
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
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
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
                  <FormLabel className="text-sm font-semibold text-foreground">New Password</FormLabel>
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
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Must be at least 6 characters long
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting || isPending}>
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
}
