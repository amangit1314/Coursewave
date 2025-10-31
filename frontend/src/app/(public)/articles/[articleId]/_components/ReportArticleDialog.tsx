"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";
import { useReportArticle } from "@/hooks/useArticles";
import toast from "react-hot-toast";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";

export function ReportArticleDialog({ articleId }: { articleId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");

  // Instantiate the query
  const { refetch: reportArticle, isFetching: isSubmitting } = useReportArticle(
    articleId,
    reason
  );

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error(
        // {
        // title: "Reason required",
        // description:
        "Please enter a reason before submitting."
        // variant: "destructive",
        //   }
      );
      return;
    }

    try {
      const { data } = await reportArticle();

      toast.success(
        // {
        // title: "Report submitted",
        //    "title":
        "Thank you for reporting this article. Our team will review it shortly."
        //   }
      );

      setReason("");
      setIsOpen(false);
    } catch (error) {
      toast.error(
        // {
        // title: "Error",
        // description:
        "Failed to submit report."
        //     variant: "destructive",
        //   }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-red-500/10 transition-all"
        >
          {/* <Heart className="h-4 w-4 text-red-500" /> */}
          <div className="p-2 rounded-lg bg-red-500/10 group-hover/item:bg-red-500/20 transition-colors">
            <Flag className="h-4 w-4 text-red-500" />
          </div>
          <span className="font-medium">Report article</span>
          <DropdownMenuShortcut className="text-xs opacity-60">
            ⌘R
          </DropdownMenuShortcut>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-2xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-center bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Report Article
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <p className="text-sm text-muted-foreground">
            Please let us know why you are reporting this article.
          </p>

          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter your reason..."
            className="min-h-[120px] rounded-xl border border-white/10"
          />

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-red-500 hover:bg-red-600 text-white py-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
