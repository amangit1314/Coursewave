"use client";

import React from "react";
import { Community } from "@/types/community";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, LogIn, LogOut, Loader2 } from "lucide-react";
import { useUserStore } from "@/zustand/userStore";

interface CommunityListProps {
  communities: Community[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
  isJoining: boolean;
  isLeaving: boolean;
}

export default function CommunityList({
  communities,
  selectedId,
  onSelect,
  onJoin,
  onLeave,
  isJoining,
  isLeaving,
}: CommunityListProps) {
  const user = useUserStore((s) => s.user);

  const isMember = (community: Community) => {
    if (!user) return false;
    return community.members?.some((m) => m.user.id === user.id);
  };

  if (communities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-700">
          <Users className="h-6 w-6 text-zinc-400" />
        </div>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          No communities yet. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {communities.map((community) => {
        const memberOfCommunity = isMember(community);
        const isSelected = selectedId === community.id;

        return (
          <Card
            key={community.id}
            className={`cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700/50 ${
              isSelected
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                : ""
            }`}
            onClick={() => onSelect(community.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {community.title}
                  </h3>
                  {community.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {community.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                      {community.members?.slice(0, 3).map((m, i) => (
                        <Avatar key={i} className="h-5 w-5 border border-white dark:border-zinc-800">
                          <AvatarImage src={m.user.profileImageUrl || undefined} />
                          <AvatarFallback className="text-[8px]">
                            {m.user.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-xs text-zinc-400">
                      {community.totalMembers || community.members?.length || 0} members
                    </span>
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  {memberOfCommunity ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      disabled={isLeaving}
                      onClick={() => onLeave(community.id)}
                    >
                      {isLeaving ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <LogOut className="mr-1 h-3 w-3" />
                      )}
                      Leave
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      disabled={isJoining}
                      onClick={() => onJoin(community.id)}
                    >
                      {isJoining ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <LogIn className="mr-1 h-3 w-3" />
                      )}
                      Join
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
