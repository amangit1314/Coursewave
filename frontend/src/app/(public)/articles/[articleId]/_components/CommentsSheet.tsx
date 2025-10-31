"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AddCommentForm } from "./AddCommentForm";
import { CommentList } from "./CommentsList";

interface CommentsSidebarProps {
  articleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function CommentsSheet({
  articleId,
  open,
  onOpenChange,
}: CommentsSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md lg:max-w-lg overflow-y-auto">
        <SheetTitle className="">Comments</SheetTitle>

        {/* Main Comments area */}
        <div className="flex flex-col gap-8  ">
          <div className="dark:border-zinc-800">
            <CommentList articleId={articleId} />
          </div>

          <div className="h-24" aria-hidden />
          <div className="sticky bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800 pt-7">
            <AddCommentForm articleId={articleId} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
