"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BiFile } from "react-icons/bi";
import { FiSmile } from "react-icons/fi";
import { MdReply, MdPushPin, MdEdit, MdDelete } from "react-icons/md";
import React, { useRef } from "react";
import { ChatMessage, useCommunityChatStore } from "@/zustand/communityChatStore";
import { useUserStore } from "@/zustand/userStore";
import {
  reactToMessage,
  togglePin,
  deleteMessage,
} from "@/lib/socket/communitySocket";
import { formatCommunityTime } from "@/lib/utils/utils";

// Map reaction type enum to emoji display
const REACTION_EMOJI: Record<string, string> = {
  LIKE: "👍",
  DISLIKE: "👎",
  LOVE: "❤️",
  LAUGH: "😄",
};

interface MessageCardProps {
  msg: ChatMessage;
  communityId: string;
}

export const MessageCard: React.FC<MessageCardProps> = ({ msg, communityId }) => {
  const { user } = useUserStore();
  const {
    quickReactions,
    showReactionPicker,
    setShowReactionPicker,
    setReplyingTo,
    setEditingMessage,
    setOpenThreadId,
  } = useCommunityChatStore();

  const reactionPickerRef = useRef<HTMLDivElement>(null);
  const isOwn = user?.id === msg.senderId;

  const handleReact = (type: string) => {
    reactToMessage(communityId, msg.id, type);
    setShowReactionPicker(null);
  };

  const handlePin = () => {
    togglePin(communityId, msg.id, !msg.isPinned);
  };

  const handleDelete = () => {
    if (confirm("Delete this message?")) {
      deleteMessage(communityId, msg.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      id={`message-${msg.id}`}
      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl`}>
        {/* Sender Info */}
        {!isOwn && (
          <div className="mb-1 flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={msg.senderAvatar || undefined} />
              <AvatarFallback>
                {msg.senderName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {msg.senderName}
            </span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`relative rounded-2xl p-3 shadow-sm ${
            isOwn
              ? "rounded-br-md border border-blue-400/30 bg-gradient-to-br from-blue-500/90 to-blue-600/90"
              : "rounded-tl-md border border-gray-200 bg-white text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100"
          }`}
        >
          {/* Reply Preview */}
          {msg.replyTo && (
            <div
              className={`mb-2 rounded-lg p-2 ${
                isOwn
                  ? "border border-white/20 bg-white/20"
                  : "border border-gray-200 bg-gray-100 dark:border-zinc-600 dark:bg-zinc-700"
              }`}
            >
              <div className={`text-xs ${isOwn ? "text-white/80" : "text-gray-600 dark:text-gray-400"}`}>
                Replying to {msg.replyTo.senderName}
              </div>
              <div className={`truncate text-sm ${isOwn ? "text-white/90" : "text-gray-800 dark:text-gray-200"}`}>
                {msg.replyTo.content}
              </div>
            </div>
          )}

          {/* Message text */}
          <div className="space-y-2">
            <p className={`text-sm leading-relaxed ${isOwn ? "text-white" : "text-gray-900 dark:text-gray-100"}`}>
              {msg.content}
              {msg.isEdited && (
                <span className={`ml-1 text-xs ${isOwn ? "text-white/50" : "text-gray-400"}`}>
                  (edited)
                </span>
              )}
            </p>

            {/* Attachments */}
            {msg.attachments.length > 0 && (
              <div className="space-y-2">
                {msg.attachments.map((att, i) => (
                  <div key={i} className="overflow-hidden rounded-lg">
                    {att.type === "image" ? (
                      <img
                        src={att.url}
                        alt={att.name}
                        className="h-auto max-w-full cursor-pointer rounded-lg transition-opacity hover:opacity-90"
                      />
                    ) : (
                      <div
                        className={`flex items-center space-x-2 rounded-lg p-2 ${
                          isOwn ? "border border-white/20 bg-white/20" : "bg-gray-100 dark:bg-zinc-700"
                        }`}
                      >
                        <BiFile className={`h-5 w-5 ${isOwn ? "text-white/80" : "text-blue-500"}`} />
                        <div className="min-w-0 flex-1">
                          <div className={`truncate text-sm font-medium ${isOwn ? "text-white/90" : "text-gray-800 dark:text-gray-200"}`}>
                            {att.name}
                          </div>
                          {att.size && (
                            <div className={`text-xs ${isOwn ? "text-white/70" : "text-gray-500"}`}>
                              {att.size}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reactions + timestamp */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {msg.reactions.map((reaction) => (
                <button
                  key={reaction.type}
                  onClick={() => handleReact(reaction.type)}
                  className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                    isOwn
                      ? "border border-white/20 bg-white/20 text-white hover:bg-white/30"
                      : "border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                  } ${
                    reaction.users.some((u) => u.id === user?.id) ? "ring-1 ring-blue-400" : ""
                  }`}
                  title={reaction.users.map((u) => u.name).join(", ")}
                >
                  {REACTION_EMOJI[reaction.type] || reaction.type} {reaction.users.length}
                </button>
              ))}
            </div>
            <span className={`text-xs ${isOwn ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
              {formatCommunityTime(msg.createdAt)}
            </span>
          </div>
        </div>

        {msg.replyCount > 0 && (
          <button
            onClick={() => setOpenThreadId(msg.id)}
            className="mt-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            ↩ {msg.replyCount} {msg.replyCount === 1 ? "reply" : "replies"}
          </button>
        )}

        {/* Actions */}
        <div className={`mt-1 flex space-x-1 ${isOwn ? "justify-end" : "justify-start"}`}>
          {/* Reaction picker */}
          <div className="relative" ref={reactionPickerRef}>
            <button
              onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
              className="rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
              <FiSmile className="h-4 w-4" />
            </button>

            {showReactionPicker === msg.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-8 left-0 z-10 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="flex space-x-1">
                  {/* Prisma enum reactions */}
                  {(["LIKE", "LOVE", "LAUGH", "DISLIKE"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleReact(type)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
                    >
                      {REACTION_EMOJI[type]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Reply */}
          <button
            onClick={() => setReplyingTo(msg)}
            className="rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
            title="Reply"
          >
            <MdReply className="h-4 w-4" />
          </button>

          {/* Edit (own messages only) */}
          {isOwn && (
            <button
              onClick={() => setEditingMessage(msg)}
              className="rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
              title="Edit"
            >
              <MdEdit className="h-4 w-4" />
            </button>
          )}

          {/* Delete (own messages) */}
          {isOwn && (
            <button
              onClick={handleDelete}
              className="rounded-full p-1 text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete"
            >
              <MdDelete className="h-4 w-4" />
            </button>
          )}

          {/* Pin */}
          <button
            onClick={handlePin}
            className={`rounded-full p-1 transition-colors ${
              msg.isPinned
                ? "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                : "hover:bg-gray-100 dark:hover:bg-zinc-700"
            }`}
            title={msg.isPinned ? "Unpin" : "Pin"}
          >
            <MdPushPin className={`h-4 w-4 ${msg.isPinned ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
