"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Callout } from "@tremor/react";
import React, { useRef, useEffect } from "react";
import { useCommunityById } from "@/hooks/useCommunities";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { useUserStore } from "@/zustand/userStore";

import ChatHeaderComponent from "./_components/ChatHeaderComponent";
import PinnedMessagesPanel from "./_components/PinnedMessagesPanel";
import OnlineUsersSidebar from "./_components/OnlineUsersSidebar";
import ReplyPreview from "./_components/ReplyPreview";
import ChatMessages from "./_components/ChatMessages";
import PinnedMessagesTopBanner from "./_components/PinnedMessagesTopBanner";
import MessageInput from "./_components/MessageInput";
import {
  initCommunitySocket,
  disconnectSocket,
} from "@/lib/socket/communitySocket";
import { useParams } from "next/navigation";

const CommunityPage = () => {
  const { user, token } = useUserStore();
  const userId = user?.id;

  const params = useParams<{ communityId?: string }>();
  const communityId = params?.communityId;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: community, isLoading, error } = useCommunityById(communityId || "");
  const {
    messages,
    onlineUsers,
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

  const pinnedMessages = messages.filter((msg) => msg.isPinned);

  // Initialize socket connection
  useEffect(() => {
    if (!token || !communityId) return;

    const socket = initCommunitySocket(communityId, token, {
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

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!userId || !communityId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-zinc-500">Please log in to access community chat.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      {!isLoading && !error && community && (
        <ChatHeaderComponent
          userId={userId}
          community={community}
          onlineCount={onlineUsers.filter((u) => u.isOnline).length}
          isAdmin={false}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex flex-1 flex-col">
          <ScrollArea className="flex-1 p-4">
            {/* Pinned Messages Banner */}
            <PinnedMessagesTopBanner isAdmin={false} />

            {/* Welcome Message */}
            {pinnedMessages.length === 0 && messages.length === 0 && (
              <Callout
                className="mb-4 rounded-lg border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-100"
                title={`Welcome to ${community?.title || "this community"}`}
              >
                This is the start of the conversation. Be respectful and enjoy
                the discussion!
              </Callout>
            )}

            {/* Messages */}
            <ChatMessages />
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Reply Preview */}
          <ReplyPreview />

          {/* Message Input */}
          <MessageInput communityId={communityId} />
        </div>

        {/* Panels */}
        <PinnedMessagesPanel />
        <OnlineUsersSidebar />
      </div>
    </div>
  );
};

export default CommunityPage;
