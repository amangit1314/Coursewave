"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Callout } from "@tremor/react";
import React, { useRef, useEffect } from "react";
import { useCommunityById } from "@/hooks/useCommunityById";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { useUserStore } from "@/zustand/userStore";

import ChatHeaderComponent from "./_components/ChatHeaderComponent";
import PinnedMessagesPanel from "./_components/PinnedMessagesPanel";
import OnlineUsersSidebar from "./_components/OnlineUsersSidebar";
import ReplyPreview from "./_components/ReplyPreview";
import ChatMessages from "./_components/ChatMessages";
import PinnedMessagesTopBanner from "./_components/PinnedMessagesTopBanner";
import MessageInput from "./_components/MessageInput";
import { initCommunitySocket } from "@/lib/socket/communitySocket";

const CommunityPage = ({
  params,
}: {
  params: {
    userId?: string;
    communityChatId?: string;
  };
}) => {
  const communityId = params?.communityChatId!;
  const userId = params?.userId!;

  // -----------------------------------------------------------------------------
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reactionPickerRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------------------------------------------------------
  const { data: community, isLoading, error } = useCommunityById(communityId);
  const {
    messages,
    isAdmin,
    onlineUsers,
    addReaction,
    togglePinMessage,
    setMessages,
    addMessage,
    setIsTyping,
  } = useCommunityChatStore();
  const { user, token } = useUserStore();

  // ----------------------------------------------------------------------------------------------------

  // Get pinned messages
  const pinnedMessages = messages.filter((msg) => msg.isPinned);

  // ---------------------------------------------------------------------------------------
  useEffect(() => {
    if (!token) {
      console.error("No token found, cannot initialize socket connection.");
      return;
    }
    const socket = initCommunitySocket(communityId, token, {
      onInitMessages: (msgs) => setMessages(msgs),
      onNewMessage: (msg) => addMessage(msg),
      onReaction: (messageId, reaction) =>
        addReaction(messageId, reaction.emoji),
      onPinned: (msg) => togglePinMessage(msg.id),
      onTypingUpdate: (_, typing) => setIsTyping(typing),
      onPresenceUpdate: (userId, isOnline) => {
        console.log(`User ${userId} is now ${isOnline ? "online" : "offline"}`);
      },
    });

    return () => {
      socket.disconnect();
    };
  }, [setMessages, addMessage, addReaction, togglePinMessage, setIsTyping]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -----------------------------------------------------------------------------------------

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      {!isLoading && !error && community && (
        <ChatHeaderComponent
          userId={userId}
          community={community}
          onlineCount={onlineUsers.length}
          isAdmin={isAdmin}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {/* Pinned Messages Section */}
            <PinnedMessagesTopBanner isAdmin={isAdmin} />

            {/* Welcome Message (only if no pinned messages) */}
            {pinnedMessages.length === 0 && (
              <Callout
                className="mb-4 rounded-lg bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800"
                title="Welcome to Tech Enthusiasts"
              >
                This is a community for discussing all things tech. Be
                respectful and enjoy the conversation! 🚀
              </Callout>
            )}

            {/* Chat Messages List */}
            <ChatMessages />
          </ScrollArea>

          {/* Reply Preview */}
          <ReplyPreview />

          {/* Message Input */}
          <MessageInput />
        </div>

        {/* Pinned Messages Panel */}
        <PinnedMessagesPanel />

        {/* Online Users Sidebar */}
        <OnlineUsersSidebar />
      </div>
    </div>
  );
};

export default CommunityPage;
