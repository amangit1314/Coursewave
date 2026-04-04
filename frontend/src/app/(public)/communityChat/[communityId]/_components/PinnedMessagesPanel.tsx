"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdClose, MdPushPin } from "react-icons/md";
import { motion } from "framer-motion";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { togglePin } from "@/lib/socket/communitySocket";
import { formatCommunityTime } from "@/lib/utils/utils";
import { useParams } from "next/navigation";

const REACTION_EMOJI: Record<string, string> = {
  LIKE: "👍",
  DISLIKE: "👎",
  LOVE: "❤️",
  LAUGH: "😄",
};

const PinnedMessagesPanel = () => {
  const { messages, setShowPinnedPanel, showPinnedPanel } = useCommunityChatStore();
  const params = useParams<{ communityId?: string }>();
  const communityId = params?.communityId || "";

  const pinnedMessages = messages.filter((msg) => msg.isPinned);

  if (!showPinnedPanel || pinnedMessages.length === 0) return null;

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="border-l border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
    >
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <MdPushPin className="h-4 w-4 text-blue-500" />
            Pinned Messages ({pinnedMessages.length})
          </h3>
          <Button variant="outline" size="icon" onClick={() => setShowPinnedPanel(false)} className="h-8 w-8">
            <MdClose className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3">
            {pinnedMessages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-zinc-600 dark:bg-zinc-700"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={msg.senderAvatar || undefined} />
                    <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {msg.senderName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCommunityTime(msg.createdAt)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePin(communityId, msg.id, false)}
                        className="h-6 px-2 text-gray-500 hover:text-red-500"
                        title="Unpin"
                      >
                        <MdClose className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="mb-2 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                      {msg.content}
                    </p>

                    {msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {msg.reactions.map((r) => (
                          <span
                            key={r.type}
                            className="inline-flex items-center rounded-full bg-white px-2 py-1 text-xs dark:bg-zinc-600"
                          >
                            {REACTION_EMOJI[r.type] || r.type} {r.users.length}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
};

export default PinnedMessagesPanel;
