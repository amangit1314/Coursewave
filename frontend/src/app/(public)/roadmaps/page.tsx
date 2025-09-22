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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";
import { generateRoadmapWithAI } from "@/lib/ai/roadmap-generator"; // Your AI service

import { categories, popularSkills } from "@/lib/mock/mockData";
import { RoadmapFlowView } from "./_components/RoadmapFlow";
import { RoadmapTimelineView } from "./_components/RoadmapTimeline";
import { RoadmapListView } from "./_components/RoadmapList";
import { downloadRoadmap, getTemplateRoadmap } from "@/lib/utils/roadmap-utils";
import { dmSans } from "@/lib/config/fonts";

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

  // Handle AI-powered search with a check to prevent multiple requests
  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim() || isLoading) {
      // Guard clause: prevent API call if search term is empty or if we are already loading.
      return;
    }

    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const result = await generateRoadmapWithAI(searchTerm);
      setRoadmapData(result);
    } catch (error) {
      console.error("Error generating roadmap:", error);
      // Fallback to template-based roadmap
      setRoadmapData(getTemplateRoadmap(searchTerm));
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle progress for a node
  // Using useCallback to ensure this function has a stable reference across renders.
  // This is a crucial fix for the useEffect dependency warning in the child component.
  const toggleProgress = useCallback((nodeId: string) => {
    setProgress((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  }, []); // The dependency array is empty because `setProgress` is a stable function provided by React.

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      fetchSuggestions(debouncedQuery);
    }
  }, [debouncedQuery]);

  const fetchSuggestions = async (query: string) => {
    // In a real app, this would call your AI service for suggestions
    const mockSuggestions = popularSkills
      .filter((skill) => skill.name.toLowerCase().includes(query.toLowerCase()))
      .map((skill) => skill.name);

    setSuggestions(mockSuggestions.slice(0, 5));
    setShowSuggestions(mockSuggestions.length > 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-transparent dark:to-zinc-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center my-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-blue-500" />
            <h1
              className={`${dmSans.className} text-3xl lg:text-4xl tracking-tight font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent`}
            >
              AI-Powered Learning Roadmaps
            </h1>
            <Sparkles className="h-8 w-8 text-cyan-500" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get personalized learning paths for any skill, powered by AI. Follow
            structured roadmaps to master new technologies efficiently.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="What skill do you want to learn? (e.g., React, Machine Learning, AWS)"
                className="pl-10 pr-12 py-6 text-lg border-2 border-gray-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800/50"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Button
                  onClick={() => handleSearch()}
                  disabled={isLoading || !searchQuery.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Roadmap
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="mt-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 z-10">
                <ul className="py-1">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className=" py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer flex items-center"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        handleSearch(suggestion);
                      }}
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
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

        {/* Popular Skills */}
        <div className="mb-12">
          <h2
            className={`${dmSans.className} text-2xl font-bold text-gray-900 dark:text-white mb-6`}
          >
            Popular Skill Roadmaps
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {popularSkills
              .filter(
                (skill) =>
                  selectedCategory === "All" ||
                  skill.category === selectedCategory
              )
              .map((skill) => (
                <SkillCard
                  skill={skill}
                  onClick={() => {
                    setSearchQuery(skill.name);
                    handleSearch(skill.name);
                  }}
                />
              ))}
          </div>
        </div>

        {/* Roadmap Display */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Generating Your Roadmap
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              AI is creating a personalized learning path for "{searchQuery}"
            </p>
          </div>
        )}

        {roadmapData && !isLoading && (
          <div className="space-y-8">
            {/* Roadmap Header */}
            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-zinc-700 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {roadmapData.title}
                    </h2>
                    <Badge variant="secondary" className="text-sm">
                      {roadmapData.difficulty}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {roadmapData.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>Estimated time: {roadmapData.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <BookOpen className="h-4 w-4" />
                      <span>{roadmapData.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => downloadRoadmap(roadmapData)}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-end">
              <div className="inline-flex rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1">
                <Button
                  variant={viewMode === "flow" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("flow")}
                  className="gap-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Flow
                </Button>
                <Button
                  variant={viewMode === "timeline" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("timeline")}
                  className="gap-2"
                >
                  <GanttChart className="h-4 w-4" />
                  Timeline
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  List
                </Button>
              </div>
            </div>

            {/* Roadmap Content */}
            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
              {viewMode === "flow" && (
                <RoadmapFlowView
                  roadmap={roadmapData}
                  progress={progress}
                  onToggleProgress={toggleProgress}
                />
              )}
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
            </div>

            {/* Resources Section */}
            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-zinc-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recommended Resources
              </h3>
              <div className="grid gap-4">
                {roadmapData.resources?.map((resource: any, index: number) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                          {resource.type === "book" ? (
                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {resource.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {resource.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {resource.category}
                            </Badge>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                              View resource
                              <ChevronRight className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
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
      key={skill.name}
      onClick={onClick}
      className="group cursor-pointer shadow-none rounded-2xl border border-gray-200 bg-white/60 transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 backdrop-blur-lg"
    >
      <CardContent className="flex flex-col items-center px-6 py-8 text-center">
        {/* Icon wrapper */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-100 to-blue-200 dark:from-zinc-800 dark:to-zinc-700  transition-transform">
          <skill.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Skill name */}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {skill.name}
        </h3>

        {/* Category badge */}
        <Badge
          variant="outline"
          className="mt-3 rounded-full shadow-nonw border-none bg-blue-500/90 px-3 py-0.5 text-xs font-medium text-white shadow-sm dark:bg-blue-600/60"
        >
          {skill.category}
        </Badge>
      </CardContent>
    </Card>
  );
};
