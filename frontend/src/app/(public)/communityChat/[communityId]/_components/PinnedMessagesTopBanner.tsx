import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCommunityTime } from "@/lib/utils/utils";
import { Message } from "@/types/message";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { AvatarImage } from "@radix-ui/react-avatar";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { MdClose, MdExpandLess, MdExpandMore, MdPushPin } from "react-icons/md";

type Props = {
  isAdmin?: boolean;
};

const PinnedMessagesTopBanner = (props: Props) => {
  const {
    messages,
    showPinnedMessages,
    setShowPinnedMessages,
    togglePinMessage,
  } = useCommunityChatStore();

  const pinnedMessages = messages.filter((msg) => msg.isPinned);

  if (!showPinnedMessages || pinnedMessages.length === 0) return null;

  return (
    <div>
      {pinnedMessages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MdPushPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Pinned Messages ({pinnedMessages.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPinnedMessages(!showPinnedMessages)}
                  className="h-6 px-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {showPinnedMessages ? (
                    <MdExpandLess className="h-4 w-4" />
                  ) : (
                    <MdExpandMore className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Pinned Messages List */}
            <AnimatePresence>
              {showPinnedMessages && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  {pinnedMessages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback>
                            {msg.sender.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {msg.sender}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatCommunityTime(msg.timestamp)}
                              </span>
                            </div>
                            {props.isAdmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePinMessage(msg.id)}
                                className="h-5 px-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                              >
                                <MdClose className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed line-clamp-2">
                            {msg.content}
                          </p>

                          {/* Reactions */}
                          {msg.reactions.length > 0 && (
                            <div className="flex space-x-1 mt-2">
                              {msg.reactions.slice(0, 3).map((reaction) => (
                                <span
                                  key={reaction.emoji}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-white dark:bg-black/30 text-xs"
                                >
                                  {reaction.emoji} {reaction.count}
                                </span>
                              ))}
                              {msg.reactions.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  +{msg.reactions.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapsed View - Show first pinned message preview */}
            {!showPinnedMessages && (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={pinnedMessages[0].avatar} />
                  <AvatarFallback>
                    {pinnedMessages[0].sender.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                    {pinnedMessages[0].content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {pinnedMessages.length > 1
                      ? `+${pinnedMessages.length - 1} more pinned messages`
                      : "Pinned message"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PinnedMessagesTopBanner;
