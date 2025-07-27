"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Filter, MapPin, Clock, Star, X } from "lucide-react";
import { useState } from "react";

export const SearchAndFilter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTime, setSelectedTime] = useState("upcoming");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "programming", label: "Programming" },
    { value: "design", label: "Design" },
    { value: "business", label: "Business" },
    { value: "marketing", label: "Marketing" },
    { value: "data-science", label: "Data Science" },
    { value: "devops", label: "DevOps" },
    { value: "mobile", label: "Mobile Development" },
  ];

  const timeOptions = [
    { value: "upcoming", label: "Upcoming" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "thisWeek", label: "This Week" },
    { value: "nextWeek", label: "Next Week" },
  ];

  const priceOptions = [
    { value: "all", label: "All Prices" },
    { value: "free", label: "Free" },
    { value: "paid", label: "Paid" },
    { value: "under50", label: "Under $50" },
    { value: "under100", label: "Under $100" },
  ];

  const ratingOptions = [
    { value: "all", label: "All Ratings" },
    { value: "4plus", label: "4+ Stars" },
    { value: "4.5plus", label: "4.5+ Stars" },
    { value: "5", label: "5 Stars" },
  ];

  const activeFilters = [
    selectedCategory !== "all" && { type: "Category", value: categories.find(c => c.value === selectedCategory)?.label },
    selectedTime !== "upcoming" && { type: "Time", value: timeOptions.find(t => t.value === selectedTime)?.label },
    selectedPrice !== "all" && { type: "Price", value: priceOptions.find(p => p.value === selectedPrice)?.label },
    selectedRating !== "all" && { type: "Rating", value: ratingOptions.find(r => r.value === selectedRating)?.label },
  ].filter((filter): filter is { type: string; value: string | undefined } => Boolean(filter));

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedTime("upcoming");
    setSelectedPrice("all");
    setSelectedRating("all");
  };

  const removeFilter = (filterType: string) => {
    switch (filterType) {
      case "Category":
        setSelectedCategory("all");
        break;
      case "Time":
        setSelectedTime("upcoming");
        break;
      case "Price":
        setSelectedPrice("all");
        break;
      case "Rating":
        setSelectedRating("all");
        break;
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Main search and filter bar */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 sm:p-6 shadow-xs border border-gray-200 dark:border-zinc-700">
        <div className="flex flex-col gap-4">
          {/* Search input - full width on mobile */}
          <div className="relative w-full">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-5 sm:w-5" />
            <Input
              placeholder="Search for sessions, mentors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400 dark:bg-zinc-900 dark:text-white w-full"
            />
          </div>
          
          {/* Filter controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Mobile filter toggle */}
            <div className="sm:hidden flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 w-full border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm">Filters</span>
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Desktop filters - hidden on mobile */}
            <div className={`sm:flex gap-3 ${showFilters ? 'flex flex-col' : 'hidden'}`}>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[140px] lg:w-[160px] border-2 border-gray-200 dark:border-zinc-700 dark:bg-zinc-900 text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="w-full sm:w-[140px] lg:w-[160px] border-2 border-gray-200 dark:border-zinc-700 dark:bg-zinc-900 text-sm">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger className="w-full sm:w-[140px] lg:w-[160px] border-2 border-gray-200 dark:border-zinc-700 dark:bg-zinc-900 text-sm">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  {priceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="w-full sm:w-[140px] lg:w-[160px] border-2 border-gray-200 dark:border-zinc-700 dark:bg-zinc-900 text-sm">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Desktop filter button */}
            <div className="hidden sm:block">
              <Button 
                variant="outline" 
                size="icon"
                className="border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-3 sm:p-4 shadow-xs border border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Filters ({activeFilters.length})
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 h-8 px-2 sm:px-3"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs px-2 py-1 flex items-center gap-1"
              >
                <span>{filter?.type}: {filter?.value}</span>
                <button
                  onClick={() => removeFilter(filter.type)}
                  className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Quick filter chips */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-gray-300 dark:border-zinc-600 hover:border-blue-500 dark:hover:border-blue-400 h-8 px-3"
        >
          <Star className="h-3 w-3 mr-1.5" />
          <span className="hidden sm:inline">Top Rated</span>
          <span className="sm:hidden">Top</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-gray-300 dark:border-zinc-600 hover:border-blue-500 dark:hover:border-blue-400 h-8 px-3"
        >
          <Clock className="h-3 w-3 mr-1.5" />
          <span className="hidden sm:inline">Starting Soon</span>
          <span className="sm:hidden">Soon</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-gray-300 dark:border-zinc-600 hover:border-blue-500 dark:hover:border-blue-400 h-8 px-3"
        >
          <MapPin className="h-3 w-3 mr-1.5" />
          <span className="hidden sm:inline">Available Now</span>
          <span className="sm:hidden">Now</span>
        </Button>
      </div>
    </div>
  );
}; 