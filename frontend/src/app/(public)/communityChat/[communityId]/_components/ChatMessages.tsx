"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCard } from "./MessageCard";
import React from "react";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { useParams } from "next/navigation";

const ChatMessages = () => {
  const { messages, typingUsers } = useCommunityChatStore();
  const params = useParams<{ communityId?: string }>();
  const communityId = params?.communityId || "";

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {messages.map((msg) => (
          <MessageCard key={msg.id} msg={msg} communityId={communityId} />
        ))}
      </AnimatePresence>

      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2">
          <TypingIndicator />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {typingUsers.length === 1
              ? `${typingUsers[0].name} is typing...`
              : `${typingUsers.length} people are typing...`}
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex space-x-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.1s" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.2s" }} />
        </div>
      </div>
    </motion.div>
  );
};
