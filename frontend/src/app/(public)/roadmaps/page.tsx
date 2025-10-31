"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Search,
  BookOpen,
  Clock,
  ExternalLink,
  Target,
  FileText,
  Sparkles,
  ChevronRight,
  Plus,
  Check,
  Star,
  LayoutGrid,
  List,
  GanttChart,
  Download,
  Share2,
  Zap,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";
import { generateRoadmapWithAI } from "@/lib/ai/roadmap-generator";

import { categories, popularSkills } from "@/lib/mock/mockData";
import { RoadmapFlowView } from "./_components/RoadmapFlow";
import { RoadmapTimelineView } from "./_components/RoadmapTimeline";
import { RoadmapListView } from "./_components/RoadmapList";
import { downloadRoadmap, getTemplateRoadmap } from "@/lib/utils/roadmap-utils";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";

const RoadmapPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"flow" | "timeline" | "list">(
    "flow"
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [progress, setProgress] = useState<Record<string, boolean>>({});

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
    setProgress((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  }, []);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      fetchSuggestions(debouncedQuery);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  const fetchSuggestions = async (query: string) => {
    const mockSuggestions = popularSkills
      .filter((skill) => skill.name.toLowerCase().includes(query.toLowerCase()))
      .map((skill) => skill.name);

    setSuggestions(mockSuggestions.slice(0, 5));
    setShowSuggestions(mockSuggestions.length > 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section - Enhanced */}
        <div className="text-center my-12 space-y-6">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-100 dark:border-blue-900/50">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Powered by AI
            </span>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1
              className={`${dmSans.className} text-4xl sm:text-5xl lg:text-6xl tracking-tight font-extrabold`}
            >
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                AI-Powered Learning
              </span>
              <br />
              <span className="text-zinc-900 dark:text-white">Roadmaps</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Get personalized learning paths for any skill, powered by AI.
              Follow structured roadmaps to master new technologies efficiently.
            </p>
          </div>

          {/* Stats or trust indicators */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                AI Generated
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Adaptive Learning
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Goal Oriented
              </span>
            </div>
          </div>
        </div>

        {/* Search Section - Enhanced */}
        <div className="mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <Input
                  type="text"
                  placeholder="What skill do you want to learn? (e.g., React, Machine Learning, AWS)"
                  className="pl-14 pr-48 py-7 text-base sm:text-lg border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 dark:focus:border-blue-400 dark:bg-zinc-900/50 backdrop-blur-sm transition-all shadow-sm hover:shadow-md"
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
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed h-12"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Suggestions dropdown - Enhanced */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden backdrop-blur-sm"
                >
                  <ul className="py-1">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer flex items-center gap-3 transition-colors group"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          handleSearch(suggestion);
                        }}
                      >
                        <Search className="h-4 w-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {suggestion}
                        </span>
                        <ChevronRight className="h-4 w-4 text-zinc-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Categories - Enhanced */}
        {!isLoading && !roadmapData && (
          <div className="mb-8">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="flex justify-between items-center h-26 md:h-14 overflow-x-auto py-4 px-4 md:px-2 md:py-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-zinc-700">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.name}
                    value={category.name}
                    className="flex-shrink-0 px-4 py-2 rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Popular Skills - Enhanced */}
        {!isLoading && !roadmapData && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`${dmSans.className} text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white`}
              >
                Popular Skill Roadmaps
              </h2>
              <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0">
                {
                  popularSkills.filter(
                    (skill) =>
                      selectedCategory === "All" ||
                      skill.category === selectedCategory
                  ).length
                }{" "}
                skills
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularSkills
                .filter(
                  (skill) =>
                    selectedCategory === "All" ||
                    skill.category === selectedCategory
                )
                .map((skill) => (
                  <SkillCard
                    key={skill.name}
                    skill={skill}
                    onClick={() => {
                      setSearchQuery(skill.name);
                      handleSearch(skill.name);
                    }}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Loading State - Enhanced */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full blur-2xl opacity-30 animate-pulse" />
              <Loader2 className="relative animate-spin h-16 w-16 text-blue-600 dark:text-blue-400" />
            </div>
            <h3
              className={`${dmSans.className} text-2xl font-bold text-zinc-900 dark:text-white mt-6 mb-2`}
            >
              Generating Your Roadmap
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-md">
              AI is creating a personalized learning path for{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                "{searchQuery}"
              </span>
            </p>
          </motion.div>
        )}

        {/* Roadmap Display */}
        {roadmapData && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Roadmap Header - Enhanced */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl">
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2
                        className={`${dmSans.className} text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-white`}
                      >
                        {roadmapData.title}
                      </h2>
                      <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 px-3 py-1 font-semibold">
                        {roadmapData.difficulty}
                      </Badge>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6 text-base">
                      {roadmapData.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {roadmapData.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                        <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {roadmapData.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                    <Button
                      onClick={() => downloadRoadmap(roadmapData)}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <Download className="h-4 w-4" />
                      Export PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* View Mode Toggle - Enhanced */}
            <div className="flex justify-end">
              <div className="inline-flex rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-1 shadow-sm">
                {/* <Button
                  variant={viewMode === "flow" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("flow")}
                  className={cn(
                    "gap-2 rounded-lg transition-all",
                    viewMode === "flow" && "bg-blue-600 text-white shadow-md"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Flow</span>
                </Button> */}
                <Button
                  variant={viewMode === "timeline" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("timeline")}
                  className={cn(
                    "gap-2 rounded-lg transition-all",
                    viewMode === "timeline" &&
                      "bg-blue-600 text-white shadow-md"
                  )}
                >
                  <GanttChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Timeline</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "gap-2 rounded-lg transition-all",
                    viewMode === "list" && "bg-blue-600 text-white shadow-md"
                  )}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
              </div>
            </div>

            {/* Roadmap Content */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
              {/* {viewMode === "flow" && (
                <RoadmapFlowView
                  roadmap={roadmapData}
                  progress={progress}
                  onToggleProgress={toggleProgress}
                />
              )} */}
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

            {/* Resources Section - Enhanced */}
            {roadmapData.resources && roadmapData.resources.length > 0 && (
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl">
                <CardContent className="p-6 lg:p-8">
                  <h3
                    className={`${dmSans.className} text-xl lg:text-2xl font-bold text-zinc-900 dark:text-white mb-6`}
                  >
                    Recommended Resources
                  </h3>
                  <div className="grid gap-4">
                    {roadmapData.resources.map(
                      (resource: any, index: number) => (
                        <Card
                          key={index}
                          className="hover:shadow-lg transition-all duration-300 border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700"
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-xl flex items-center justify-center shadow-sm">
                                {resource.type === "book" ? (
                                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                ) : (
                                  <ExternalLink className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">
                                  {resource.title}
                                </h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
                                  {resource.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-3">
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-medium border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                  >
                                    {resource.category}
                                  </Badge>
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                                  >
                                    View resource
                                    <ChevronRight className="h-4 w-4" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;

type Props = {
  skill: {
    name: string;
    category: string;
    icon: React.ElementType;
  };
  onClick?: () => void;
};

const SkillCard = ({ skill, onClick }: Props) => {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer border border-zinc-100 dark:border-zinc-800 shadow-sm rounded-xl bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900"
    >
      <CardContent className="flex flex-col items-center p-6 text-center">
        {/* Icon with subtle hover effect */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 group-hover:from-blue-100 group-hover:to-cyan-100 dark:group-hover:from-blue-950/50 dark:group-hover:to-cyan-950/50 transition-all">
          <skill.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Skill name */}
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2">
          {skill.name}
        </h3>

        {/* Category badge */}
        <Badge className="rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border-0 px-3 py-1 text-xs font-medium">
          {skill.category}
        </Badge>
      </CardContent>
    </Card>
  );
};
