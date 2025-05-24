"use client";

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

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
}

export const ConfirmModal = ({ children, onConfirm }: ConfirmModalProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription>
          Are you absolutley sure to delte this chapter! This action cannot be
          undone. You cannot recover this chapter once deleted.
        </AlertDialogDescription>

        <AlertDialogFooter className="mx-auto flex items-center justify-center">
          <AlertDialogCancel className="border-stroke overflow-hidden rounded-md border border-red-600 bg-red-300 text-red-600 hover:bg-red-600 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="mt-2">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
