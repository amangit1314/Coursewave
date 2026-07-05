"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { sendMessage } from "@/lib/socket/communitySocket";
import { formatCommunityTime } from "@/lib/utils/utils";

interface ThreadDialogProps {
  communityId: string;
}

const ThreadDialog = ({ communityId }: ThreadDialogProps) => {
  const { messages, openThreadId, setOpenThreadId } = useCommunityChatStore();
  const [replyText, setReplyText] = useState("");

  const rootMessage = messages.find((m) => m.id === openThreadId);
  const replies = openThreadId
    ? messages.filter((m) => m.parentId === openThreadId)
    : [];

  const handleReply = () => {
    if (!replyText.trim() || !openThreadId) return;
    sendMessage(communityId, replyText.trim(), openThreadId);
    setReplyText("");
  };

  return (
    <Dialog open={!!openThreadId} onOpenChange={(open) => !open && setOpenThreadId(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thread</DialogTitle>
        </DialogHeader>

        {rootMessage && (
          <div className="max-h-96 space-y-3 overflow-y-auto">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-1 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={rootMessage.senderAvatar || undefined} />
                  <AvatarFallback>{rootMessage.senderName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{rootMessage.senderName}</span>
              </div>
              <p className="text-sm">{rootMessage.content}</p>
            </div>

            {replies.map((reply) => (
              <div key={reply.id} className="ml-4 border-l-2 border-blue-200 pl-3 dark:border-blue-800">
                <div className="mb-1 flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reply.senderAvatar || undefined} />
                    <AvatarFallback>{reply.senderName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{reply.senderName}</span>
                  <span className="text-xs text-gray-400">{formatCommunityTime(reply.createdAt)}</span>
                </div>
                <p className="text-sm">{reply.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-gray-200 pt-3 dark:border-zinc-700">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleReply();
              }
            }}
            placeholder="Reply in thread..."
            className="h-9 flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
          />
          <Button size="sm" onClick={handleReply} disabled={!replyText.trim()}>
            Reply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThreadDialog;
