"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React, { useState, useMemo } from "react";
import { MdSearch, MdAdd, MdGridOn, MdViewList } from "react-icons/md";
import { motion } from "framer-motion";
import { Community } from "@/types/community";
import { useCommunities } from "@/hooks/useCommunities";
import { useUserStore } from "@/zustand/userStore";
import { CommunityCard } from "./_components/CommunityCard";
import { CommunityListCard } from "./_components/CommunityListCard";
import { useSocket } from "@/hooks/useSocket";

const CommunityChat = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: communitiesData, isLoading } = useCommunities(); // <--- Call the hook
  const { user, token } = useUserStore();
  const userId = user?.id!;

  const socket = useSocket(token); // socket connects when this page renders

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
  }, [searchQuery, selectedCategory, communitiesData]); // <--- Add communitiesData to dependencies

  // Update categories to use the real data
  // Update categories to use the real data
  const categories = useMemo(() => {
    if (!communitiesData) {
      return ["all"];
    }
    // Map to the category's name property
    const uniqueCategories = Array.from(
      new Set(communities.map((c: any) => c.category.name))
    ) as string[];
    return ["all", ...uniqueCategories];
  }, [communitiesData]);

  const isInstructor = user?.roles?.includes("INSTRUCTOR") ?? false;
  console.log("Is instructor in communities", isInstructor); // For debugging

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

        {isInstructor && (
          <Button className="flex items-center gap-2">
            <MdAdd className="h-4 w-4" />
            Create Community
          </Button>
        )}
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
              className="pl-10"
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

        {/* tabs */}
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="flex flex-wrap w-full justify-center px-2 items-center h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg gap-8">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="flex-grow capitalize data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-sm transition-all duration-200 hover:bg-gray-200 dark:hover:bg-zinc-700 data-[state=active]:hover:bg-blue-600 px-4 py-2"
              >
                {category === "all" ? "All" : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Communities Display */}
      <ScrollArea className="h-[calc(100vh-300px)]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading communities...</p>
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p>No communities found.</p>
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
                    (m: any) => m.id === userId
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
                    (m: any) => m.id === userId
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
