"use client";

import { useEffect, useRef } from "react";
import { MessageSquareText } from "lucide-react";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { initCommunitySocket, disconnectSocket } from "@/lib/socket/communitySocket";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessages from "@/app/(public)/communityChat/[communityId]/_components/ChatMessages";
import ReplyPreview from "@/app/(public)/communityChat/[communityId]/_components/ReplyPreview";
import MessageInput from "@/app/(public)/communityChat/[communityId]/_components/MessageInput";
import PinnedMessagesTopBanner from "@/app/(public)/communityChat/[communityId]/_components/PinnedMessagesTopBanner";
import ThreadDialog from "@/app/(public)/communityChat/[communityId]/_components/ThreadDialog";

interface CommunityChatWindowProps {
  communityId: string;
  token: string;
  communityTitle?: string;
  isAdmin?: boolean;
}

const CommunityChatWindow = ({
  communityId,
  token,
  communityTitle,
  isAdmin = false,
}: CommunityChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    setMessages,
    addMessage,
    updateMessage,
    removeMessage,
    setReactions,
    setPinned,
    setTypingUser,
    setUserPresence,
    reset,
  } = useCommunityChatStore();

  useEffect(() => {
    if (!token || !communityId) return;

    initCommunitySocket(communityId, token, {
      onInitMessages: (msgs) => setMessages(msgs),
      onNewMessage: (msg) => addMessage(msg),
      onMessageEdited: (msg) => updateMessage(msg),
      onMessageDeleted: ({ messageId }) => removeMessage(messageId),
      onReaction: ({ messageId, reactions }) => setReactions(messageId, reactions),
      onPinned: ({ message, isPinned }) => {
        if (message) setPinned(message.id, isPinned);
      },
      onTypingUpdate: ({ userId, name, isTyping }) =>
        setTypingUser(userId, name || "Someone", isTyping),
      onPresenceUpdate: ({ userId, isOnline }) => setUserPresence(userId, isOnline),
    });

    return () => {
      disconnectSocket();
      reset();
    };
  }, [communityId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <PinnedMessagesTopBanner isAdmin={isAdmin} />

        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-4 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10 mb-4">
              <MessageSquareText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
              Welcome to {communityTitle || "this community"}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
              This is the start of the conversation. Be respectful and enjoy the discussion!
            </p>
          </div>
        ) : (
          <>
            <ChatMessages />
            <div ref={messagesEndRef} />
          </>
        )}
      </ScrollArea>

      <ReplyPreview />
      <MessageInput communityId={communityId} />
      <ThreadDialog communityId={communityId} />
    </div>
  );
};

export default CommunityChatWindow;
