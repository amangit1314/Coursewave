"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";
import {
  Loader2,
  ArrowLeft,
  Clock,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Download,
  Share2,
  GanttChart,
  List,
  Sparkles,
} from "lucide-react";
import { generateRoadmapWithAI } from "@/lib/ai/roadmap-generator";
import { downloadRoadmap, getTemplateRoadmap } from "@/lib/utils/roadmap-utils";
import { RoadmapTimelineView } from "../_components/RoadmapTimeline";
import { RoadmapListView } from "../_components/RoadmapList";

const RoadMapDetailPage = () => {
  const params = useParams();
  const skillName = decodeURIComponent((params?.skillName as string) || "");

  const [isLoading, setIsLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  const toggleProgress = useCallback((nodeId: string) => {
    setProgress((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  }, []);

  useEffect(() => {
    if (!skillName) return;

    let cancelled = false;
    const fetchRoadmap = async () => {
      setIsLoading(true);
      try {
        const result = await generateRoadmapWithAI(skillName);
        if (!cancelled) setRoadmapData(result);
      } catch (error) {
        console.error("Error generating roadmap:", error);
        if (!cancelled) setRoadmapData(getTemplateRoadmap(skillName));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchRoadmap();
    return () => { cancelled = true; };
  }, [skillName]);

  if (!skillName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <p className="text-zinc-500">No skill specified.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 pt-[80px] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/roadmaps">
            <Button variant="ghost" size="sm" className="text-zinc-600 dark:text-zinc-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Roadmaps
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className={cn("text-xl font-bold text-zinc-900 dark:text-white mb-2", dmSans.className)}>
              Generating Your Roadmap
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-center text-sm">
              Creating a personalized path for{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">"{skillName}"</span>
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
                      <h1 className={cn("text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-white", dmSans.className)}>
                        {roadmapData.title}
                      </h1>
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
                  <h3 className={cn("text-xl font-bold text-zinc-900 dark:text-white mb-5", dmSans.className)}>
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
              <Link href="/roadmaps">
                <Button variant="outline" className="border-zinc-300 dark:border-zinc-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Explore More Roadmaps
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadMapDetailPage;
