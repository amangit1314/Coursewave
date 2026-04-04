"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCommunityTime } from "@/lib/utils/utils";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { MdExpandLess, MdExpandMore, MdPushPin } from "react-icons/md";

const REACTION_EMOJI: Record<string, string> = {
  LIKE: "👍", DISLIKE: "👎", LOVE: "❤️", LAUGH: "😄",
};

interface Props {
  isAdmin?: boolean;
}

const PinnedMessagesTopBanner = ({ isAdmin }: Props) => {
  const { messages } = useCommunityChatStore();
  const [expanded, setExpanded] = useState(false);

  const pinnedMessages = messages.filter((msg) => msg.isPinned);

  if (pinnedMessages.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdPushPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Pinned Messages ({pinnedMessages.length})
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-6 px-2 text-blue-600 dark:text-blue-400"
          >
            {expanded ? <MdExpandLess className="h-4 w-4" /> : <MdExpandMore className="h-4 w-4" />}
          </Button>
        </div>

        {/* Expanded: show all pinned */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden"
            >
              {pinnedMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-lg border border-blue-100 bg-white/50 p-3 dark:border-blue-800 dark:bg-black/20"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarImage src={msg.senderAvatar || undefined} />
                      <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {msg.senderName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCommunityTime(msg.createdAt)}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                        {msg.content}
                      </p>
                      {msg.reactions.length > 0 && (
                        <div className="mt-2 flex space-x-1">
                          {msg.reactions.slice(0, 3).map((r) => (
                            <span key={r.type} className="inline-flex items-center rounded-full bg-white px-1.5 py-0.5 text-xs dark:bg-black/30">
                              {REACTION_EMOJI[r.type] || r.type} {r.users.length}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed: show first message preview */}
        {!expanded && (
          <div className="flex items-center gap-3">
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarImage src={pinnedMessages[0].senderAvatar || undefined} />
              <AvatarFallback>{pinnedMessages[0].senderName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-gray-800 dark:text-gray-200">
                {pinnedMessages[0].content}
              </p>
              {pinnedMessages.length > 1 && (
                <p className="text-xs text-gray-500">+{pinnedMessages.length - 1} more</p>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PinnedMessagesTopBanner;
