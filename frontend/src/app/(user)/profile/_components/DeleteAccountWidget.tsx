"use client";

import React, { useState } from "react";
import { Trash2, ChevronRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/userStore";
import { useDeleteAccount } from "@/hooks/useAccount"; // Adjust the import path as needed

const DeleteAccountWidget = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState(""); // Add password state

  // Use the delete account hook
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
          setPassword(""); // Clear password
          // The hook already handles logout and query cache clearing
          // You can optionally redirect to login page
          router.push("/login");
        },
        onError: (err: any) => {
          console.log("Error deleting account: ", err.message);
          toast.error(
            err.response?.data?.message || "Failed to delete account"
          );
        },
      });
    } catch (err: any) {
      console.log("Error deleting account in catch: ", err.message);
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800/80 dark:to-zinc-900/80 backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/20 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-red-500 via-rose-500 to-pink-500 text-white flex-shrink-0 shadow-md shadow-red-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-zinc-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                Delete Account
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                Permanently delete your account
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400 flex-shrink-0 group-hover:translate-x-1 group-hover:text-red-500 transition-all duration-300" />
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[550px] border-zinc-200 dark:border-zinc-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-zinc-950 dark:text-white text-center bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-zinc-600 dark:text-zinc-400 text-base">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Password confirmation input */}
        <div className="mt-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Enter your password to confirm:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-center items-center gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-700">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setPassword(""); // Clear password when canceling
            }}
            className="rounded-xl border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={isPending || !password}
            className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
};

export default DeleteAccountWidget;
