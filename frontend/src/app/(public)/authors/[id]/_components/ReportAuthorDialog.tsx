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
import { useReportUser } from "@/hooks/useAuthors";
import toast from "react-hot-toast";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function ReportAuthorDialog({ authorId }: { authorId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");

    const { mutateAsync: reportUser, isPending: isSubmitting } = useReportUser();

    const handleSubmit = async () => {
        if (!reason.trim()) {
            toast.error("Please enter a reason before submitting.");
            return;
        }

        try {
            await reportUser({ userId: authorId, reason, details });
            toast.success("Thank you for reporting this user. Our team will review it shortly.");
            setReason("");
            setDetails("");
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to submit report.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()} // Prevent closing dropdown immediately
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                    <Flag className="w-4 h-4 mr-2" />
                    Report Author
                </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-center text-zinc-900 dark:text-white">
                        Report User
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 p-4">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Please let us know why you are reporting this user.
                    </p>

                    <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Reason (required)..."
                        className="min-h-[80px] rounded-xl border-zinc-200 dark:border-zinc-700 bg-transparent"
                    />
                    <Textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Additional details (optional)..."
                        className="min-h-[80px] rounded-xl border-zinc-200 dark:border-zinc-700 bg-transparent"
                    />

                    <DialogFooter>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white py-2"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
