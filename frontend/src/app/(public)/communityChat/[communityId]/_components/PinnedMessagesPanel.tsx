import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdClose, MdPushPin } from "react-icons/md";
import { motion } from "framer-motion";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { formatCommunityTime } from "@/lib/utils/utils";

const PinnedMessagesPanel = () => {
  const {
    messages,
    setShowPinnedPanel,
    showPinnedPanel,
    isAdmin,
    togglePinMessage,
  } = useCommunityChatStore();

  const pinnedMessages = messages.filter((msg) => msg.isPinned);

  if (pinnedMessages.length === 0) return null;
  return (
    <div>
      {showPinnedPanel && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="border-l border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MdPushPin className="h-4 w-4 text-blue-500" />
                Pinned Messages
              </h3>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowPinnedPanel(false)}
                className="h-8 w-8"
              >
                <MdClose className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {pinnedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-3 border border-gray-200 dark:border-zinc-600"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={msg.avatar} />
                        <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {msg.sender}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatCommunityTime(msg.timestamp)}
                            </span>
                          </div>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePinMessage(msg.id)}
                              className="h-6 px-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                            >
                              <MdClose className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mb-2">
                          {msg.content}
                        </p>

                        {/* Reactions */}
                        {msg.reactions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {msg.reactions.map((reaction: any) => (
                              <span
                                key={reaction.emoji}
                                className="inline-flex items-center px-2 py-1 rounded-full bg-white dark:bg-zinc-600 text-xs"
                              >
                                {reaction.emoji} {reaction.count}
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
      )}
    </div>
  );
};

export default PinnedMessagesPanel;
