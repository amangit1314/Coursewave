"use client";

import axios from "axios";
import React, { useState } from "react";
import { Trash2, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/userStore";

const DeleteAccountWidget = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const [open, setOpen] = useState(false); // ✅ manual control

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`api/profile/${user?.id}`);
      toast.success("Account deleted successfully");
      setOpen(false);
      router.push("/auth/login");
    } catch (err: any) {
      console.log("Error deleting account: ", err.message);
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div
          onClick={() => setOpen(true)}
          className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 flex-shrink-0">
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-zinc-900 dark:text-white truncate">
                Delete Account
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                Permanently delete your account
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[500px] max-h-[30vh] bottom-8 right-8 space-y-0">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center items-center space-x-4">
          <button
            className="border-stroke cursor-pointer text-sm font-medium dark:text-white px-2 py-1 rounded-md"
            onClick={() => setOpen(false)} // ✅ closes the dialog
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 cursor-pointer text-sm font-medium text-white px-3 py-1.5 rounded-md"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountWidget;
