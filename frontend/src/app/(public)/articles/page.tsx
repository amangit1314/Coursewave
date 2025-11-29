"use client";

import React, { useState, useMemo } from "react";
import { ArticleCard } from "./_components/ArticleCard";
import { Button } from "@/components/ui/button";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { BlogArticle } from "@/types";
import { useArticles } from "@/hooks/useArticles";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 9;

// Enhanced Shimmer Component with wave animation
const Shimmer = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50" />
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

// Modern Article Card Skeleton with glassmorphism - matches ArticleCard structure
const ArticleCardSkeleton = () => {
  return (
    <div className="group relative">
      {/* Hover glow effect placeholder */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-3xl opacity-5 blur-xl" />

      <div className="relative bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg overflow-hidden">
        {/* Cover Image Skeleton */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
          <Shimmer className="h-full w-full" />

          {/* Category Badge Skeleton */}
          <div className="absolute bottom-4 left-4 z-20">
            <Shimmer className="h-7 w-32 rounded-full" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="relative p-6 space-y-4">
          {/* Read Time Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-muted/50 animate-pulse" />
            <Shimmer className="h-3 w-20 rounded-lg" />
          </div>

          {/* Title & Description Skeleton */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Shimmer className="h-6 w-full rounded-lg" />
              <Shimmer className="h-6 w-4/5 rounded-lg" />
            </div>
            <div className="space-y-2 pt-1">
              <Shimmer className="h-4 w-full rounded-lg" />
              <Shimmer className="h-4 w-full rounded-lg" />
              <Shimmer className="h-4 w-3/4 rounded-lg" />
            </div>
          </div>

          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Shimmer className="h-7 w-16 rounded-full" />
            <Shimmer className="h-7 w-20 rounded-full" />
            <Shimmer className="h-7 w-18 rounded-full" />
          </div>

          {/* Footer - Stats & Actions Skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {/* Engagement Stats Skeleton */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Shimmer className="h-9 w-9 rounded-full" />
                <Shimmer className="h-4 w-8 rounded-lg" />
              </div>
              <div className="flex items-center gap-2">
                <Shimmer className="h-9 w-9 rounded-full" />
                <Shimmer className="h-4 w-8 rounded-lg" />
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex items-center gap-2">
              <Shimmer className="h-9 w-9 rounded-xl" />
              <Shimmer className="h-9 w-9 rounded-xl" />
              <Shimmer className="h-9 w-9 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Filter Skeleton
const FilterSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8 justify-between items-start lg:items-center">
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <Shimmer className="h-12 w-80 rounded-2xl" />
        <Shimmer className="h-12 w-44 rounded-2xl" />
        <Shimmer className="h-12 w-52 rounded-2xl" />
      </div>
      <Shimmer className="h-12 w-52 rounded-2xl" />
    </div>
  );
};

const ArticlesPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const {
    data: articles = [],
    isLoading,
    error,
    isError,
    refetch,
  } = useArticles();

  const filteredAndSortedArticles = useMemo(() => {
    if (!articles) return [];

    let result = [...articles];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.content?.toLowerCase().includes(searchLower) ||
          article.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter(
        (article) => article.Category?.name === categoryFilter
      );
    }

    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
        );
        break;
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return result;
  }, [articles, search, categoryFilter, sortBy]);

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedArticles.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedArticles, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedArticles.length / ITEMS_PER_PAGE
  );

  const categories = useMemo(() => {
    if (!articles) return [];
    const uniqueCategories = new Set(
      articles.map((article) => article.Category?.name).filter(Boolean)
    );
    return Array.from(uniqueCategories);
  }, [articles]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16 space-y-4">
            <div className="h-14 w-80 mx-auto rounded-2xl bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 animate-pulse" />
            <div className="h-8 w-[500px] mx-auto rounded-xl bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 animate-pulse" />
          </div>

          <FilterSkeleton />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-destructive/5 via-transparent to-transparent" />

        <div className="relative max-w-md text-center px-4">
          <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-12">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 rounded-full blur-3xl animate-pulse" />
              <AlertTriangle className="relative h-20 w-20 text-destructive mx-auto mb-6 animate-bounce" />
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {error?.message ||
                "We couldn't load the articles. Please try again."}
            </p>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => refetch()}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/articles")}
                className="rounded-xl border-white/10 hover:bg-white/5"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasArticles = paginatedArticles.length > 0;
  const totalArticles = filteredAndSortedArticles.length;
  const showingStart = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd = Math.min(currentPage * ITEMS_PER_PAGE, totalArticles);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Modern Header with animated gradient */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 mb-4 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Discover Amazing Content
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
              Articles
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore cutting-edge insights, in-depth tutorials, and inspiring
            stories from our vibrant community
          </p>
        </div>

        {/* Modern Filters with glassmorphism */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                  <Input
                    placeholder="Search for anything..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-4 h-12 w-full sm:w-80 rounded-2xl border-white/10 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                  />
                </div>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-44 h-12 rounded-2xl border-white/10 bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all shadow-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-white/10 backdrop-blur-xl">
                    <SelectItem value="all" className="rounded-xl">
                      All Categories
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="rounded-xl"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-52 h-12 rounded-2xl border-white/10 bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all shadow-sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-white/10 backdrop-blur-xl">
                    <SelectItem value="newest" className="rounded-xl">
                      Newest First
                    </SelectItem>
                    <SelectItem value="oldest" className="rounded-xl">
                      Oldest First
                    </SelectItem>
                    <SelectItem value="title-asc" className="rounded-xl">
                      Title A-Z
                    </SelectItem>
                    <SelectItem value="title-desc" className="rounded-xl">
                      Title Z-A
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium text-foreground">
                  {showingStart}-{showingEnd}{" "}
                  <span className="text-muted-foreground">of</span>{" "}
                  {totalArticles}
                </span>
              </div>
            </div>

            {/* Active Filters Pills */}
            {(search || categoryFilter !== "all") && (
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/5">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Active filters:
                </span>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all text-sm font-medium"
                  >
                    <span className="text-foreground">"{search}"</span>
                    <span className="text-primary group-hover:rotate-90 transition-transform">
                      ×
                    </span>
                  </button>
                )}
                {categoryFilter !== "all" && (
                  <button
                    onClick={() => setCategoryFilter("all")}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all text-sm font-medium"
                  >
                    <span className="text-foreground">{categoryFilter}</span>
                    <span className="text-purple-500 group-hover:rotate-90 transition-transform">
                      ×
                    </span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("all");
                    setSortBy("newest");
                  }}
                  className="px-4 py-2 rounded-full hover:bg-white/5 transition-all text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Articles Grid */}
        {hasArticles ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            {/* Modern Pagination */}
            {totalPages > 1 && (
              <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-sm font-medium text-muted-foreground">
                    Page{" "}
                    <span className="text-foreground font-bold text-lg">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="text-foreground font-bold text-lg">
                      {totalPages}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="h-11 px-5 rounded-xl border-white/10 hover:bg-white/5 disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              className={`w-11 h-11 p-0 rounded-xl transition-all ${
                                currentPage === page
                                  ? "bg-gradient-to-r from-primary to-primary/80 shadow-lg scale-110"
                                  : "border-white/10 hover:bg-white/5"
                              }`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span
                              key={page}
                              className="px-2 text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="h-11 px-5 rounded-xl border-white/10 hover:bg-white/5 disabled:opacity-30"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Modern Empty State */
          <div className="text-center py-24">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-full p-12 border border-white/10 shadow-2xl">
                <FileText className="h-24 w-24 text-primary mx-auto" />
              </div>
            </div>

            <h3 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              No articles found
            </h3>
            <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
              {search || categoryFilter !== "all"
                ? "Try adjusting your search terms or filters to discover more amazing content."
                : "There are no articles available at the moment. Check back soon for fresh content!"}
            </p>

            <div className="flex gap-4 justify-center">
              {(search || categoryFilter !== "all") && (
                <Button
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("all");
                  }}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 h-12"
                >
                  Clear filters
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="rounded-xl border-white/10 hover:bg-white/5 px-8 h-12"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default ArticlesPage;
