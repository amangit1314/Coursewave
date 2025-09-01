import { AnimatePresence, motion } from "framer-motion";
import { MessageCard } from "./MessageCard";
import React from "react";
import { Message } from "@/types/message";
import { useCommunityChatStore } from "@/zustand/communityChatStore";

const ChatMessages = () => {
  const { messages, isTyping } = useCommunityChatStore();

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {messages.map((msg: Message) => (
          <MessageCard key={msg.id} msg={msg} />
        ))}
      </AnimatePresence>

      {isTyping && (
        <div className="flex justify-start">
          <TypingIndicator />
        </div>
      )}

      {/* <div ref={messagesEndRef} /> */}
    </div>
  );
};

export default ChatMessages;

// --------------------------------------------------------------------------------
type Props = {};

const TypingIndicator = (props: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-3 shadow-sm border border-gray-200 dark:border-zinc-700">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};
