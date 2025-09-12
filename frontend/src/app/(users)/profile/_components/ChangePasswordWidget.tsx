"use client";

import axios from "axios";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Settings,
  Trash2,
  LogOut,
  User,
  Mail,
  Globe,
  Users,
  Award,
  HelpCircle,
  Share2,
  ChevronRight,
  Crown,
  Zap,
  Heart,
  Bell,
  Lock,
} from "lucide-react";
import { SiGmail } from "react-icons/si";
import { RiInstagramFill } from "react-icons/ri";
import { FaGithub, FaSquareXTwitter, FaLinkedinIn } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
// import { useUserInfo } from "@/hooks/useUserInfo";
import "@uploadthing/react/styles.css";
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
import { UploadDropzone } from "@/lib/utils/uploadthing";
import { DialogClose } from "@radix-ui/react-dialog";
import { ThemeModeToggle } from "@/app/(shared)/ThemeModeToggle";
import { useRouter } from "next/navigation";
import { useInstructorInfo } from "@/hooks/useInstructorInfo";
import { PiSignOut, PiStudentFill } from "react-icons/pi";
import { useUserStore } from "@/zustand/userStore";

const changePasswordFormSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const ChangePasswordWidget = () => {
  const { user } = useUserStore();

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
      const response = await axios.patch(
        `api/profile/${user?.id}/changePassword`,
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }
      );
      console.log("Response data after changing password: ", response);
      toast.success("Password changed successfully!");
      form.reset();
    } catch (err: any) {
      console.log("Error in updating password: ", err.message);
      toast.error(err.response?.data?.message || "Failed to change password");
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
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordWidget;