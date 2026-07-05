"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Search,
  BookOpen,
  Clock,
  ExternalLink,
  Target,
  Sparkles,
  ChevronRight,
  List,
  GanttChart,
  Download,
  Share2,
  Zap,
  TrendingUp,
  Brain,
  Route,
  ArrowRight,
  Database,
  Code,
  Smartphone,
  Palette,
  Shield,
  Globe,
  Star,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { generateRoadmapWithAI } from "@/lib/ai/roadmap-generator";
import { useCategories } from "@/hooks/useCategories";
import { RoadmapTimelineView } from "./_components/RoadmapTimeline";
import { RoadmapListView } from "./_components/RoadmapList";
import { downloadRoadmap, getTemplateRoadmap } from "@/lib/utils/roadmap-utils";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";

/** Curated popular skills for the roadmap suggestions UI */
const popularSkills = [
  { name: "Backend Developer", icon: Database, category: "Development" },
  { name: "Frontend Developer", icon: Code, category: "Development" },
  { name: "Data Scientist", icon: TrendingUp, category: "Data Science" },
  { name: "DevOps Engineer", icon: Zap, category: "Operations" },
  { name: "Mobile Developer", icon: Smartphone, category: "Mobile" },
  { name: "UI/UX Designer", icon: Palette, category: "Design" },
  { name: "Full Stack Developer", icon: Globe, category: "Development" },
  { name: "Cybersecurity Engineer", icon: Shield, category: "Security" },
];

/** Icon mapping for category filter tabs */
const categoryIconMap: Record<string, React.ElementType> = {
  All: Star,
  Development: Code,
  "Data Science": TrendingUp,
  Operations: Zap,
  Mobile: Smartphone,
  Design: Palette,
  Security: Shield,
};

/** Per-category accent so tabs, icon chips and card edges share one color language */
const categoryColorMap: Record<
  string,
  { text: string; iconBg: string; activeBg: string; ring: string; edge: string; hoverBorder: string }
> = {
  All: {
    text: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
    activeBg: "data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:shadow-none",
    ring: "focus-visible:ring-indigo-500",
    edge: "bg-indigo-500",
    hoverBorder: "hover:border-indigo-400 dark:hover:border-indigo-500",
  },
  Development: {
    text: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    activeBg: "data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:shadow-none",
    ring: "focus-visible:ring-blue-500",
    edge: "bg-blue-500",
    hoverBorder: "hover:border-blue-400 dark:hover:border-blue-500",
  },
  "Data Science": {
    text: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    activeBg: "data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:shadow-none",
    ring: "focus-visible:ring-emerald-500",
    edge: "bg-emerald-500",
    hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-500",
  },
  Operations: {
    text: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    activeBg: "data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:shadow-none",
    ring: "focus-visible:ring-amber-500",
    edge: "bg-amber-500",
    hoverBorder: "hover:border-amber-400 dark:hover:border-amber-500",
  },
  Mobile: {
    text: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    activeBg: "data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:shadow-none",
    ring: "focus-visible:ring-violet-500",
    edge: "bg-violet-500",
    hoverBorder: "hover:border-violet-400 dark:hover:border-violet-500",
  },
  Design: {
    text: "text-pink-600 dark:text-pink-400",
    iconBg: "bg-pink-50 dark:bg-pink-500/10",
    activeBg: "data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:shadow-none",
    ring: "focus-visible:ring-pink-500",
    edge: "bg-pink-500",
    hoverBorder: "hover:border-pink-400 dark:hover:border-pink-500",
  },
  Security: {
    text: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-50 dark:bg-red-500/10",
    activeBg: "data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:shadow-none",
    ring: "focus-visible:ring-red-500",
    edge: "bg-red-500",
    hoverBorder: "hover:border-red-400 dark:hover:border-red-500",
  },
};

const getCategoryColor = (name: string) => categoryColorMap[name] ?? categoryColorMap.Development;

const RoadmapPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const { data: apiCategories } = useCategories();

  // Build category tabs from API data with icon mapping, always include "All"
  const categories = React.useMemo(() => {
    const allTab = { name: "All", icon: Star };
    if (!apiCategories || apiCategories.length === 0) {
      // Fallback: derive unique categories from popularSkills
      const uniqueNames = Array.from(new Set(popularSkills.map((s) => s.category)));
      return [allTab, ...uniqueNames.map((name) => ({ name, icon: categoryIconMap[name] || BookOpen }))];
    }
    return [
      allTab,
      ...apiCategories.map((cat) => ({
        name: cat.name,
        icon: categoryIconMap[cat.name] || BookOpen,
      })),
    ];
  }, [apiCategories]);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim() || isLoading) return;

    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const result = await generateRoadmapWithAI(searchTerm);
      setRoadmapData(result);
    } catch (error) {
      console.error("Error generating roadmap:", error);
      setRoadmapData(getTemplateRoadmap(searchTerm));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProgress = useCallback((nodeId: string) => {
    setProgress((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  }, []);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      const filtered = popularSkills
        .filter((s) => s.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
        .map((s) => s.name)
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  const filteredSkills = popularSkills.filter(
    (skill) => selectedCategory === "All" || skill.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 pt-[80px] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Banner */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-800 p-8 md:p-12">
            {/* Decorative elements — darker tints that work in both light and dark mode */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white">
                      <Sparkles className="h-3 w-3" />
                      Powered by AI
                    </span>
                  </div>

                  <h1 className={`${dmSans.className} text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight leading-tight`}>
                    Learning Roadmaps
                  </h1>
                  <p className="text-indigo-100 text-base md:text-lg leading-relaxed max-w-md">
                    Get personalized learning paths for any skill. AI generates structured roadmaps to master new technologies.
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {[
                      { icon: Zap, label: "AI Generated" },
                      { icon: TrendingUp, label: "Adaptive" },
                      { icon: Target, label: "Goal Oriented" },
                    ].map(({ icon: Icon, label }) => (
                      <span key={label} className="flex items-center gap-1.5 bg-white/20 border border-white/10 rounded-full px-3 py-1.5 text-xs font-medium text-white">
                        <Icon className="h-3 w-3" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visual element on the right */}
                <div className="hidden lg:flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-white/15 border border-white/10 flex items-center justify-center rotate-6">
                      <Route className="h-16 w-16 text-white/70" />
                    </div>
                    <div className="absolute -bottom-3 -left-3 w-16 h-16 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center -rotate-6">
                      <Brain className="h-8 w-8 text-white/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-12 relative">
          {/* Ambient glow tying the search back to the hero gradient above */}
          <div className="pointer-events-none absolute -top-10 left-1/2 h-32 w-[min(90%,40rem)] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-blue-500/20 blur-3xl" />

          <div className="max-w-3xl mx-auto relative">
            <div className="group relative rounded-2xl bg-gradient-to-r from-violet-500/40 via-indigo-500/40 to-blue-500/40 p-[1.5px] focus-within:from-violet-500 focus-within:via-indigo-500 focus-within:to-blue-500 transition-colors duration-300">
              <div className="relative rounded-[15px] bg-zinc-50 dark:bg-zinc-800">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 pointer-events-none z-10" />
                <Input
                  type="text"
                  placeholder="What skill do you want to learn? (e.g., React, Machine Learning, AWS)"
                  className="pl-12 pr-36 h-14 text-base border-0 rounded-[15px] bg-transparent shadow-none focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <Button
                    onClick={() => handleSearch()}
                    disabled={isLoading || !searchQuery.trim()}
                    className="h-10 px-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:from-zinc-400 disabled:to-zinc-400"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-1.5" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="mt-2 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-3 transition-colors text-left"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      handleSearch(suggestion);
                    }}
                  >
                    <Search className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {suggestion}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400 ml-auto" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categories + Skills (only when no roadmap) */}
        {!isLoading && !roadmapData && (
          <>
            {/* Category Tabs — pill segmented control, color-coded per category */}
            <div className="mb-8">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="h-auto w-auto flex-wrap justify-start gap-2 bg-transparent p-0">
                  {categories.map((category) => {
                    const color = getCategoryColor(category.name);
                    const isActive = selectedCategory === category.name;
                    return (
                      <TabsTrigger
                        key={category.name}
                        value={category.name}
                        className={cn(
                          "px-3.5 py-1.5 rounded-full text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 transition-colors hover:border-zinc-300 dark:hover:border-zinc-600",
                          color.activeBg
                        )}
                      >
                        <category.icon className={cn("h-3.5 w-3.5 mr-1.5", isActive ? "text-white" : color.text)} />
                        {category.name}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>

            {/* Skills Grid */}
            <div className="mb-14">
              <div className="flex items-center justify-between mb-5">
                <h2 className={`${dmSans.className} text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white`}>
                  Popular Skill Roadmaps
                </h2>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {filteredSkills.length} skills
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredSkills.map((skill) => {
                  const color = getCategoryColor(skill.category);
                  return (
                    <button
                      key={skill.name}
                      onClick={() => {
                        setSearchQuery(skill.name);
                        handleSearch(skill.name);
                      }}
                      className={cn(
                        "group relative flex flex-col items-center p-5 pt-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 transition-all duration-200 text-center overflow-hidden hover:-translate-y-0.5 hover:shadow-md",
                        color.hoverBorder
                      )}
                    >
                      {/* Category-colored top edge, brightens on hover */}
                      <span className={cn("absolute top-0 left-0 right-0 h-0.5 opacity-40 group-hover:opacity-100 transition-opacity", color.edge)} />

                      <div className={cn("mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105", color.iconBg)}>
                        <skill.icon className={cn("h-5 w-5", color.text)} />
                      </div>
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1.5 line-clamp-2">
                        {skill.name}
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                        {skill.category}
                      </span>

                      <ArrowRight className={cn("absolute right-3 bottom-3 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all", color.text)} />
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className={`${dmSans.className} text-xl font-bold text-zinc-900 dark:text-white mb-2`}>
              Generating Your Roadmap
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-center text-sm">
              Creating a personalized path for{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">"{searchQuery}"</span>
            </p>
          </div>
        )}

        {/* Roadmap Display */}
        {roadmapData && !isLoading && (
          <div className="space-y-5">
            {/* Header Card */}
            <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h2 className={`${dmSans.className} text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-white`}>
                        {roadmapData.title}
                      </h2>
                      <Badge className="bg-blue-600 text-white border-0 text-xs font-semibold">
                        {roadmapData.difficulty}
                      </Badge>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                      {roadmapData.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                        <Clock className="h-3.5 w-3.5 text-blue-500" />
                        {roadmapData.duration}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                        {roadmapData.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 lg:flex-shrink-0">
                    <Button
                      onClick={() => downloadRoadmap(roadmapData)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1.5" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* View Toggle */}
            <div className="flex justify-end">
              <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("timeline")}
                  className={cn(
                    "rounded-md text-xs",
                    viewMode === "timeline" && "bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-sm"
                  )}
                >
                  <GanttChart className="h-3.5 w-3.5 mr-1" />
                  Timeline
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-md text-xs",
                    viewMode === "list" && "bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-sm"
                  )}
                >
                  <List className="h-3.5 w-3.5 mr-1" />
                  List
                </Button>
              </div>
            </div>

            {/* Roadmap Content */}
            <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden">
              {viewMode === "timeline" && (
                <RoadmapTimelineView
                  roadmap={roadmapData}
                  progress={progress}
                  onToggleProgress={toggleProgress}
                />
              )}
              {viewMode === "list" && (
                <RoadmapListView
                  roadmap={roadmapData}
                  progress={progress}
                  onToggleProgress={toggleProgress}
                />
              )}
            </Card>

            {/* Resources */}
            {roadmapData.resources?.length > 0 && (
              <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
                <CardContent className="p-6 lg:p-8">
                  <h3 className={`${dmSans.className} text-xl font-bold text-zinc-900 dark:text-white mb-5`}>
                    Recommended Resources
                  </h3>
                  <div className="space-y-3">
                    {roadmapData.resources.map((resource: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                          {resource.type === "book" ? (
                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-zinc-900 dark:text-white text-sm mb-0.5">
                            {resource.title}
                          </h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 line-clamp-2">
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-[11px] border-zinc-300 dark:border-zinc-700">
                              {resource.category}
                            </Badge>
                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                              >
                                View <ChevronRight className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generate another */}
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setRoadmapData(null);
                  setSearchQuery("");
                }}
                className="border-zinc-300 dark:border-zinc-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Another Roadmap
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;
