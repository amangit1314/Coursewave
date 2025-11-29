"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  Code2,
  Loader2,
} from "lucide-react";
import { Project } from "@/types/project";
import { useProjects } from "@/hooks/useProjects";
import { dmSans } from "@/lib/config/fonts";
import ProjectCard from "./_components/ProjectCard";
import CreateProjectForm from "./_components/CreateProjectForm";

// --- Main Component ---
const ProjectsPage = () => {
  const { projects: projectsData, isLoading, isError, error } = useProjects();

  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [open, setOpen] = useState(false);

  const projects = projectsData || [];

  // Filtering and sorting logic
  useEffect(() => {
    if (!projects) {
      setFilteredProjects([]);
      return;
    }

    let filtered = projects.filter((project: Project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
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
        filtered.sort((a: any, b: any) => b.likes - a.likes);
        break;
      case "progress":
        filtered.sort((a: any, b: any) => b.progress - a.progress);
        break;
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, selectedStatus, sortBy]);

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-lg text-zinc-600 dark:text-zinc-300">
            Loading projects...
          </span>
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-red-500">
          Error fetching projects: {error?.message}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-black">
      {/* Header */}
      <div className="mx-auto max-w-7xl mt-16 px-4 py-8 md:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <h2
              className={`${dmSans.className} mb-4 text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-4xl`}
            >
              Turn Learning into Doing
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
              Explore real-world projects, apply your knowledge, and showcase
              your work as you learn and grow.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl bg-zinc-100 dark:bg-zinc-800 p-4 backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {projects?.length || 0}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                Total Projects
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl bg-zinc-100 dark:bg-zinc-800 p-4 backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {projects?.filter((p: any) => p.status === "completed")
                  .length || 0}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                Completed
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl bg-zinc-100 dark:bg-zinc-800 p-4 backdrop-blur-sm "
            >
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {projects?.filter((p: any) => p.status === "in-progress")
                  .length || 0}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                In Progress
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-lg shadow-none ${viewMode === "grid" ? "bg-blue-500 text-white" : ""}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={`rounded-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-lg shadow-none ${viewMode === "list" ? "bg-blue-500 text-white" : ""}`}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Dropdowns (modernized) */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <label className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors">
                <Grid3X3 className="h-4 w-4" />
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Data Science">Data Science</option>
                <option value="DevOps">DevOps</option>
                <option value="Design">Design</option>
              </select>
              {/* Dropdown Chevron */}
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                ▾
              </span>
            </label>

            {/* Status Filter */}
            <label className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors">
                <Sparkles className="h-4 w-4" />
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                ▾
              </span>
            </label>

            {/* Sort Filter */}
            <label className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors">
                <Code2 className="h-4 w-4" />
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="progress">Progress</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                ▾
              </span>
            </label>
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={
            viewMode === "grid"
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                layout
                className={viewMode === "grid" ? "" : "w-full"}
              >
                <ProjectCard project={project} viewMode={viewMode} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-blue-100 to-cyan-100 dark:from-zinc-800 dark:to-zinc-900 shadow-lg">
              <Code2 className="h-8 w-8 text-blue-400 dark:text-blue-300" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
              No projects found
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-3">
              {searchTerm ||
                selectedCategory !== "all" ||
                selectedStatus !== "all"
                ? "Try adjusting your filters or search terms."
                : "Get started by creating your first project!"}
            </p>
            {!searchTerm &&
              selectedCategory === "all" &&
              selectedStatus === "all" && (
                <Button
                  onClick={() => setOpen(true)}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              )}
          </motion.div>
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
