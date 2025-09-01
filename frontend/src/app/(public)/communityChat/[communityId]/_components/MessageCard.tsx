"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BiFile } from "react-icons/bi";
import { FiSmile, FiShare2 } from "react-icons/fi";
import { MdReply, MdPushPin } from "react-icons/md";
import React, { useRef } from "react";
import { Message } from "@/types/message";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { formatCommunityTime } from "@/lib/utils/utils";

interface MessageCardProps {
  msg: Message;
  // isAdmin?: boolean;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  msg,
  // isAdmin = false,
}) => {
  const {
    quickReactions,
    isAdmin,
    showReactionPicker,
    addReaction,
    setShowReactionPicker,
    setReplyingTo,
    togglePinMessage,
  } = useCommunityChatStore();

  const reactionPickerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${msg.isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
          msg.isCurrentUser ? "order-2" : "order-1"
        }`}
      >
        {/* Sender Info */}
        {!msg.isCurrentUser && (
          <div className="flex items-center space-x-2 mb-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={msg.avatar} />
              <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {msg.sender}
            </span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`rounded-2xl p-3 relative ${
            msg.isCurrentUser
              ? "bg-gradient-to-br from-blue-500/90 to-blue-600/90 backdrop-blur-sm border border-blue-400/30 shadow-lg"
              : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
          } shadow-sm border border-gray-200 dark:border-zinc-700 ${
            msg.isCurrentUser ? "rounded-br-md" : "rounded-tl-md"
          }`}
        >
          {/* Bubble notch */}
          <div
            className={`absolute w-0 h-0 ${
              msg.isCurrentUser
                ? "bottom-0 right-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-blue-500/90 dark:border-b-blue-600/90"
                : "top-0 left-0 border-r-[12px] border-r-transparent border-t-[12px] border-t-white dark:border-t-zinc-800"
            }`}
          ></div>

          {/* Reply Preview */}
          {msg.replyTo && (
            <div
              className={`mb-2 p-2 rounded-lg ${
                msg.isCurrentUser
                  ? "bg-white/20 backdrop-blur-sm border border-white/20"
                  : "bg-gray-100 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600"
              }`}
            >
              <div
                className={`text-xs ${
                  msg.isCurrentUser
                    ? "text-white/80"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Replying to {msg.replyTo.sender}
              </div>
              <div
                className={`text-sm truncate ${
                  msg.isCurrentUser
                    ? "text-white/90"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {msg.replyTo.content}
              </div>
            </div>
          )}

          {/* Message text */}
          <div className="space-y-2">
            <p
              className={`text-sm leading-relaxed ${
                msg.isCurrentUser
                  ? "text-white"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {msg.content}
            </p>

            {/* Attachments */}
            {msg.attachments?.length ? (
              <div className="space-y-2">
                {msg.attachments.map((attachment, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    {attachment.type === "image" ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div
                        className={`flex items-center space-x-2 p-2 rounded-lg ${
                          msg.isCurrentUser
                            ? "bg-white/20 backdrop-blur-sm border border-white/20"
                            : "bg-gray-100 dark:bg-zinc-700"
                        }`}
                      >
                        <BiFile
                          className={`h-5 w-5 ${
                            msg.isCurrentUser
                              ? "text-white/80"
                              : "text-blue-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-sm font-medium truncate ${
                              msg.isCurrentUser
                                ? "text-white/90"
                                : "text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {attachment.name}
                          </div>
                          {attachment.size && (
                            <div
                              className={`text-xs ${
                                msg.isCurrentUser
                                  ? "text-white/70"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {attachment.size}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Reactions */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex space-x-1">
              {msg.reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  onClick={() => addReaction(msg.id, reaction.emoji)}
                  className={`rounded-full px-2 py-1 text-xs transition-colors ${
                    msg.isCurrentUser
                      ? "bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20 text-white"
                      : "bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 border border-gray-200 dark:border-zinc-600"
                  }`}
                >
                  {reaction.emoji} {reaction.count}
                </button>
              ))}
            </div>
            <span
              className={`text-xs ${
                msg.isCurrentUser
                  ? "text-white/70"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {formatCommunityTime(msg.timestamp)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`mt-1 flex space-x-1 ${
            msg.isCurrentUser ? "justify-end" : "justify-start"
          }`}
        >
          {/* Emoji Picker Trigger */}
          <div className="relative" ref={reactionPickerRef}>
            <button
              onClick={() =>
                setShowReactionPicker(
                  showReactionPicker === msg.id ? null : msg.id
                )
              }
              className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiSmile className="h-4 w-4" />
            </button>

            {showReactionPicker === msg.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-8 left-0 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 p-2 z-10"
              >
                <div className="flex space-x-1">
                  {quickReactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addReaction(msg.id, emoji)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Reply */}
          <button
            onClick={() => setReplyingTo(msg)}
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <MdReply className="h-4 w-4" />
          </button>

          {/* Pin */}
          {isAdmin && (
            <button
              onClick={() => togglePinMessage(msg.id)}
              className={`rounded-full p-1 transition-colors ${
                msg.isPinned
                  ? "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-700"
              }`}
              title={msg.isPinned ? "Unpin message" : "Pin message"}
            >
              <MdPushPin
                className={`h-4 w-4 ${msg.isPinned ? "fill-current" : ""}`}
              />
            </button>
          )}

          {/* Share */}
          <button className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
            <FiShare2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
