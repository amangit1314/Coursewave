"use client";

import React, { useMemo, useState, useCallback } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import CategoriesComponent from "../../courses/_components/CategoriesComponent";
import FilteredCoursesComponent from "./FilteredCourses";
import { dmSans } from "@/lib/config/fonts";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/category";
import { Search } from "lucide-react";

const BrowseSection = () => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const { data: categories, isLoading, error } = useCategories();
  console.log("Categories from hook in ui: ", JSON.stringify(categories));

  const categoriesWithData = useMemo(() => {
    return [
      {
        id: "All",
        name: "All",
        description: "",
        createdAt: undefined,
        updatedAt: undefined,
      },
      ...(categories || []),
    ];
  }, [categories]);

  const handleClick = useCallback((index: number) => {
    setActiveCategoryIndex(index);
  }, []);

  const activeCategory = categoriesWithData[activeCategoryIndex]?.name ?? "All";

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="w-full space-y-8 overflow-x-hidden px-4 sm:px-6 py-8 md:py-12 max-w-7xl mx-auto">
      {/* Section Header with gradient accent */}
      <div className="mb-8 flex flex-col items-center justify-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Explore Our Catalog
          </span>
        </div>

        <h1
          className={`${dmSans.className} text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white text-center leading-tight`}
        >
          Browse Courses
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-center leading-relaxed px-4">
          Discover your next skill. Filter by category or search for something
          specific. All courses are hand-picked and updated regularly.
        </p>
      </div>

      {/* Enhanced Search Bar with animations */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-2xl group">
          {/* Search icon */}
          {/* <span className={`absolute inset-y-0 left-0 flex items-center pl-5 transition-colors duration-200 ${isSearchFocused ? 'text-blue-500' : 'text-zinc-400 dark:text-zinc-500'
            }`}>
            <FiSearch size={20} className="transition-transform duration-200 group-focus-within:scale-110" />
          </span> */}

          <Search className="absolute z-50 left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />


          {/* Input field */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search for courses, topics, or instructors..."
            className="w-full rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 py-4 px-12 text-base text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 shadow-sm hover:shadow-md focus:shadow-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200 outline-none backdrop-blur-sm"
            autoComplete="off"
          />

          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-200 focus:outline-none"
              aria-label="Clear search"
            >
              <FiX size={20} />
            </button>
          )}

          {/* Decorative gradient border (visible on focus) */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-20 dark:group-focus-within:opacity-10 blur-xl transition-opacity duration-300 -z-10`}></div>
        </div>
      </div>

      {/* Search results indicator */}
      {searchQuery && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 animate-in fade-in slide-in-from-top-2 duration-300">
            <span>Searching for:</span>
            <span className="font-semibold text-zinc-900 dark:text-white">"{searchQuery}"</span>
          </div>
        </div>
      )}

      {/* Categories with improved spacing */}
      <div className="relative">
        <CategoriesComponent
          activeCategory={activeCategoryIndex}
          setActiveCategory={handleClick}
          categories={categoriesWithData as Category[]}
          loading={isLoading}
        />
      </div>

      {/* Filtered Courses with subtle separator */}
      <div className="relative">
        <div className="px-2 sm:px-4">
          <FilteredCoursesComponent
            activeCategory={activeCategory}
            categories={categoriesWithData as Category[]}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(BrowseSection);