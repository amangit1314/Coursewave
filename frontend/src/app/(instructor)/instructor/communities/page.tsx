"use client";

import React, { useState } from "react";
import { Users, Loader2, MessageSquare } from "lucide-react";
import {
  useCommunities,
  useCreateCommunity,
  useJoinCommunity,
  useLeaveCommunity,
} from "@/hooks/useCommunities";
import { Community } from "@/types/community";
import { useUserStore } from "@/zustand/userStore";
import CommunityList from "./_components/CommunityList";
import CreateCommunityDialog from "./_components/CreateCommunityDialog";
import CommunityChatWindow from "@/components/community/CommunityChatWindow";

export default function CommunitiesPage() {
  const { user, token } = useUserStore();
  const { data, isLoading, isError } = useCommunities();
  const createCommunity = useCreateCommunity();
  const joinCommunity = useJoinCommunity();
  const leaveCommunity = useLeaveCommunity();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Extract communities array from paginated response
  const communities: Community[] = Array.isArray(data?.data)
    ? data.data
    : data?.data
      ? [data.data]
      : [];

  const selectedCommunity = communities.find((c) => c.id === selectedId) || null;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-2">
        <Users className="h-8 w-8 text-red-400" />
        <p className="text-sm text-red-500">Failed to load communities.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          <h1 className="text-lg font-bold text-zinc-900 dark:text-white">
            Communities
          </h1>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
            {communities.length}
          </span>
        </div>
        <CreateCommunityDialog
          onCreate={(data) => createCommunity.mutate(data)}
          isPending={createCommunity.isPending}
        />
      </div>

      {/* Two-column layout */}
      <div className="flex h-[calc(100%-4.25rem)]">
        {/* Left: Community list */}
        <div className="w-80 shrink-0 overflow-y-auto border-r border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
          <CommunityList
            communities={communities}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onJoin={(id) => joinCommunity.mutate(id)}
            onLeave={(id) => leaveCommunity.mutate(id)}
            isJoining={joinCommunity.isPending}
            isLeaving={leaveCommunity.isPending}
          />
        </div>

        {/* Right: Chat area */}
        <div className="flex-1 bg-white dark:bg-zinc-800">
          {selectedCommunity && token ? (
            <CommunityChatWindow
              communityId={selectedCommunity.id}
              token={token}
              communityTitle={selectedCommunity.title}
              isAdmin={
                selectedCommunity.members?.some(
                  (m) => m.user.id === user?.id && m.role === "ADMIN"
                ) ?? false
              }
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-700">
                <MessageSquare className="h-8 w-8 text-zinc-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Select a community
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Choose a community from the list to view messages
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
