"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React, { useState, useMemo } from "react";
import { MdSearch, MdGridOn, MdViewList, MdGroups } from "react-icons/md";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Community } from "@/types/community";
import { useCommunities } from "@/hooks/useCommunities";
import { useUserStore } from "@/zustand/userStore";
import { CommunityCard } from "./_components/CommunityCard";
import { CommunityListCard } from "./_components/CommunityListCard";
import { CreateCommunityDialog } from "./_components/CreateCommunityDialog";
import { useSocket } from "@/hooks/useSocket";

const CommunityChat = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: communitiesData, isLoading } = useCommunities();
  const { user, token } = useUserStore();
  const userId = user?.id!;

  useSocket(token); // socket connects when this page renders

  const communities = communitiesData?.data || [];

  const filteredCommunities = useMemo(() => {
    if (!communitiesData) {
      return [];
    }

    return communities.filter((community: Community) => {
      const matchesSearch =
        community.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        community.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" ||
        community.category.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, communitiesData, communities]);

  const categories = useMemo(() => {
    if (!communitiesData) {
      return ["all"];
    }
    const uniqueCategories = Array.from(
      new Set(communities.map((c: Community) => c.category.name))
    ) as string[];
    return ["all", ...uniqueCategories];
  }, [communitiesData, communities]);

  const isFiltered = searchQuery.trim().length > 0 || selectedCategory !== "all";

  return (
    <div className="max-w-7xl space-y-6 overflow-x-hidden px-4 pb-16 md:mx-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white">
            Communities
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Join communities and connect with like-minded developers
          </p>
        </div>

        {user && <CreateCommunityDialog />}
      </div>

      {/* Search, Filters, and View Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full focus-visible:ring-blue-500"
            />
          </div>

          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) =>
              value && setViewMode(value as "grid" | "list")
            }
          >
            <ToggleGroupItem
              value="grid"
              aria-label="Grid view"
              className="flex items-center gap-2"
            >
              <MdGridOn className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              aria-label="List view"
              className="flex items-center gap-2"
            >
              <MdViewList className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Category pills — matches the Browse Courses filter pattern */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`capitalize flex h-9 items-center justify-center rounded-full px-5 text-sm font-medium transition-all duration-200
                ${
                  selectedCategory === category
                    ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white tracking-tight font-semibold shadow-lg shadow-blue-500/30 border-2 border-blue-600 scale-105"
                    : "text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-400 hover:shadow-md"
                }`}
            >
              {category === "all" ? "All" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Communities Display */}
      <ScrollArea className="h-[calc(100vh-300px)]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading communities…</p>
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
              <MdGroups className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            {isFiltered ? (
              <>
                <p className="font-medium text-zinc-800 dark:text-zinc-100">No communities match your filters</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Try a different search term or category.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-zinc-800 dark:text-zinc-100">No communities yet</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                  {user
                    ? "Be the first to start one for people to join."
                    : "Sign in to be the first to start one."}
                </p>
              </>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCommunities.map((community: Community, index: number) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CommunityCard
                  community={community}
                  userId={userId}
                  isJoined={community.members?.some(
                    (m) => m.user.id === userId
                  )}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCommunities.map((community: Community, index: number) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CommunityListCard
                  community={community}
                  userId={userId}
                  isJoined={community.members?.some(
                    (m) => m.user.id === userId
                  )}
                />
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default CommunityChat;
