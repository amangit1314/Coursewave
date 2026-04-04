"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  PlusCircle,
  Search,
  Grid3X3,
  List,
  Code2,
  Loader2,
  Rocket,
  Trophy,
  TrendingUp,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { Project } from "@/types/project";
import { useProjects } from "@/hooks/useProjects";
import { dmSans } from "@/lib/config/fonts";
import ProjectCard from "./_components/ProjectCard";
import CreateProjectForm from "./_components/CreateProjectForm";

const ProjectsPage = () => {
  const { projects: projectsData, isLoading, isError, error } = useProjects();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [open, setOpen] = useState(false);

  const projects = projectsData || [];

  // Memoized filtering
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter((project: Project) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.tags.some((tag) => tag.toLowerCase().includes(term));
      const matchesCategory =
        selectedCategory === "all" || project.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || project.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    switch (sortBy) {
      case "recent":
        filtered.sort(
          (a: any, b: any) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        break;
      case "popular":
        filtered.sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0));
        break;
      case "progress":
        filtered.sort((a: any, b: any) => (b.progress || 0) - (a.progress || 0));
        break;
    }

    return filtered;
  }, [projects, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const completedCount = projects.filter((p: any) => p.status === "completed").length;
  const inProgressCount = projects.filter((p: any) => p.status === "in-progress").length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center p-8">
          <Code2 className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-500">Error: {error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl mt-16 px-4 py-8 md:px-8">

        {/* Hero */}
        <div className="mb-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 md:p-12">
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-medium text-white">
                  <Rocket className="h-3 w-3" />
                  Build. Learn. Grow.
                </div>
              </div>
              <h1 className={`${dmSans.className} text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight`}>
                Real-World Projects
              </h1>
              <p className="text-blue-100 text-base md:text-lg leading-relaxed max-w-lg">
                Apply your skills to hands-on projects. Build your portfolio and prove what you can do.
              </p>
            </div>

            {/* Stats row inside hero */}
            <div className="relative z-10 grid grid-cols-3 gap-3 mt-8 max-w-md">
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-bold text-white">{projects.length}</p>
                <p className="text-xs text-blue-200 font-medium">Projects</p>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-bold text-emerald-300">{completedCount}</p>
                <p className="text-xs text-blue-200 font-medium">Completed</p>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-bold text-amber-300">{inProgressCount}</p>
                <p className="text-xs text-blue-200 font-medium">In Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* Search + View Toggle */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <Input
                placeholder="Search projects, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl focus-visible:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg h-10 w-10 ${viewMode === "grid" ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white" : "border-zinc-200 dark:border-zinc-700"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("list")}
                className={`rounded-lg h-10 w-10 ${viewMode === "list" ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white" : "border-zinc-200 dark:border-zinc-700"}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-zinc-400 mr-1" />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile</option>
              <option value="AI/ML">AI / ML</option>
              <option value="Data Science">Data Science</option>
              <option value="DevOps">DevOps</option>
              <option value="Design">Design</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-sm h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="progress">By Progress</option>
            </select>

            {(searchTerm || selectedCategory !== "all" || selectedStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium ml-1"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} found
          </p>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-3"
            }
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              <Code2 className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className={`${dmSans.className} mb-2 text-xl font-bold text-zinc-900 dark:text-white`}>
              No projects found
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
              {searchTerm || selectedCategory !== "all" || selectedStatus !== "all"
                ? "Try adjusting your filters or search terms."
                : "Get started by creating your first project!"}
            </p>
            {!searchTerm && selectedCategory === "all" && selectedStatus === "all" && (
              <Button
                onClick={() => setOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle size={20} />
              Create New Project
            </DialogTitle>
          </DialogHeader>
          <CreateProjectForm onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;
