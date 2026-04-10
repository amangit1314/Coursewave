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
import { Input } from "@/components/ui/input";
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
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-destructive/30 transition-all duration-200 cursor-pointer group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-foreground truncate group-hover:text-destructive transition-colors">
                Delete Account
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Permanently delete your account
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 group-hover:text-destructive transition-all duration-200" />
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[550px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-center text-destructive">
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground text-base">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4">
          <label
            htmlFor="delete-password"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Enter your password to confirm:
          </label>
          <Input
            type="password"
            id="delete-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isPending}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => { setOpen(false); setPassword(""); }}
            disabled={isPending}
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
};

export default DeleteAccountWidget;
