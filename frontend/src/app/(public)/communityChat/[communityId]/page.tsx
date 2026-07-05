"use client";

import React from "react";
import { useCommunityById } from "@/hooks/useCommunities";
import { useUserStore } from "@/zustand/userStore";

import ChatHeaderComponent from "./_components/ChatHeaderComponent";
import PinnedMessagesPanel from "./_components/PinnedMessagesPanel";
import OnlineUsersSidebar from "./_components/OnlineUsersSidebar";
import CommunityChatWindow from "@/components/community/CommunityChatWindow";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { useParams } from "next/navigation";

const CommunityPage = () => {
  const { user, token } = useUserStore();
  const userId = user?.id;

  const params = useParams<{ communityId?: string }>();
  const communityId = params?.communityId;

  const { data: community, isLoading, error } = useCommunityById(communityId || "");
  const { onlineUsers } = useCommunityChatStore();

  if (!userId || !communityId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-zinc-500">Please log in to access community chat.</p>
      </div>
    );
  }

  const isAdmin =
    community?.members?.some((m) => m.user.id === userId && m.role === "ADMIN") ?? false;
  const isModerator =
    community?.members?.some(
      (m) => m.user.id === userId && (m.role === "ADMIN" || m.role === "MODERATOR")
    ) ?? false;

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-zinc-900">
      {!isLoading && !error && community && (
        <ChatHeaderComponent
          userId={userId}
          community={community}
          onlineCount={onlineUsers.filter((u) => u.isOnline).length}
          isAdmin={isAdmin}
          isModerator={isModerator}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          {token && (
            <CommunityChatWindow
              communityId={communityId}
              token={token}
              communityTitle={community?.title}
              isAdmin={isAdmin}
            />
          )}
        </div>

        <PinnedMessagesPanel />
        <OnlineUsersSidebar />
      </div>
    </div>
  );
};

export default CommunityPage;
