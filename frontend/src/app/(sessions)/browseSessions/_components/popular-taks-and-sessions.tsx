"use client";

import React, { useState } from "react";
import { SessionCard } from "./session-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSessions } from "@/hooks/useSessions";
import { Session } from "@/types/session";

export const PopularTalksAndSessions = () => {
  return (
    <div className="space-y-4">
      <p className="text-xl font-bold tracking-tight text-zinc-800 dark:text-white">
        Today Popular Talks and Sessions
      </p>

      <PopularTalksAndSessionsGrid />
    </div>
  );
};

const ITEMS_PER_PAGE = 6;

const PopularTalksAndSessionsGrid = () => {
  const { sessions, isLoading, error } = useSessions();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading sessions</div>;
  }

  // Filter sessions based on category
  const filteredSessions = sessions?.filter((session) => {
    if (selectedCategory === "all") return true;
    return session.type === selectedCategory;
  }) || [];

  // Sort sessions based on date
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
    }
    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedSessions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSessions = sortedSessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Get unique categories
  const categories = ["all", ...new Set(sessions?.map((session) => session.type) || [])];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
