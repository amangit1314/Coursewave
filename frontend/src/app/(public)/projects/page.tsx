"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  PlusCircle,
  Search,
  Grid3X3,
  List,
  Eye,
  Sparkles,
  ArrowRight,
  Code2,
  Star,
  Loader2,
} from "lucide-react";
import { Project } from "@/types/project";
import { useProjects } from "@/hooks/useProjects";
import { dmSans } from "@/lib/config/fonts";

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "planning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "on-hold":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "advanced":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "expert":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const ProjectsPage = () => {
  // Use the hook to fetch data
  const { data: projectsData, isLoading, isError, error } = useProjects();

  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [open, setOpen] = useState(false);

  const projects = projectsData?.data || [];

  // Filter and sort projects whenever projects data or filters change
  useEffect(() => {
    // Ensure projects data is available before filtering
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

    // Sort projects
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

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-red-500">
          Error fetching projects: {error?.message}
        </span>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-lg text-gray-600 dark:text-gray-300">
            Loading projects...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-black">
      {/* Header */}
      {/* <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 dark:border-zinc-700">
        <div className="flex items-center justify-between px-4 py-3 md:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Projects Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Build real-world projects, apply your skills, and showcase your
                journey
              </p>
            </div>
          </motion.div>
          <ThemeModeToggle />
        </div>
      </div> */}

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
              className={`${dmSans.className} mb-4 text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl`}
            >
              Turn Learning into Doing
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
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
              className="rounded-xl bg-gray-100 dark:bg-zinc-800 p-4 backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {projects?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Projects
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl bg-gray-100 dark:bg-zinc-800 p-4 backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {projects?.filter((p: any) => p.status === "completed")
                  .length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Completed
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl bg-gray-100 dark:bg-zinc-800 p-4 backdrop-blur-sm "
            >
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {projects?.filter((p: any) => p.status === "in-progress")
                  .length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
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
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border border-gray-200 dark:border-zinc-800 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="border border-gray-200 dark:border-zinc-800 rounded-lg"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? ""
                    : "border border-gray-200 dark:border-zinc-800 rounded-lg"
                }
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="all">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Data Science">Data Science</option>
              <option value="DevOps">DevOps</option>
              <option value="Design">Design</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
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
              className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="progress">Progress</option>
            </select>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Code2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
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
                  className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              )}
          </motion.div>
        )}
      </div>

      {/* Create Project Dialog */}
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

// ---------------------------------------------------------------------
const ProjectCard = ({
  project,
  viewMode,
}: {
  project: Project;
  viewMode: "grid" | "list";
}) => {
  const [isBookmarked, setIsBookmarked] = useState(project.isBookmarked);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (viewMode === "list") {
    return (
      <Card className="group relative border border-gray-200 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-zinc-800/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Icon + Text */}
            <div className="flex items-start gap-4 w-full md:w-2/3">
              {/* Icon */}
              {/* <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500" /> */}

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-blue-100 dark:bg-blue-500 text-blue-600 dark:text-white rounded-full font-medium tracking-tight"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 4 && (
                    <Badge
                      variant="outline"
                      className="text-xs rounded-full text-blue-600 border-blue-600 font-medium tracking-tight"
                    >
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Status + Difficulty + Button */}
            <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
              <div className="flex gap-2">
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace("-", " ")}
                </Badge>
                <Badge className={getDifficultyColor(project.difficulty)}>
                  {project.difficulty}
                </Badge>
              </div>

              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
              >
                <ArrowRight className="mr-1 h-3 w-3" />
                View Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group border shadow-none border-gray-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 relative overflow-hidden transition-all duration-300 hover:shadow-sm  dark:hover:shadow-blue-500">
      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1 line-clamp-2">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-blue-100 text-blue-600 rounded-full font-medium tracking-tight"
            >
              {tag}
            </Badge>
          ))}
          {project.tags.length > 4 && (
            <Badge
              variant="outline"
              className="text-xs rounded-full text-blue-600 border-blue-600 font-medium tracking-tight"
            >
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col items-start justify-between space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{project.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3" />
                <span>{project.likes}</span>
              </div>
            </div>
          </div>

          {/* status and view button */}
          <div className="flex items-center space-x-2">
            {/* project status */}
            <Badge className={`${getStatusColor(project.status)} shadow-none `}>
              {project.status.replace("-", " ")}
            </Badge>

            {/* difficulty badge */}
            <Badge
              className={`${getDifficultyColor(project.difficulty)} shadow-none`}
            >
              {project.difficulty}
            </Badge>
          </div>

          {/* view / start project button */}
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-500 text-white cursor-pointer to-cyan-500 hover:from-blue-600 hover:to-cyan-600 w-full"
          >
            <ArrowRight className="mr-1 h-3 w-3" />
            View Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CreateProjectForm = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "intermediate",
    tags: "",
    isPublic: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating project:", form);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Project Title
        </label>
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter project title"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe your project"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            required
          >
            <option value="">Select category</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Data Science">Data Science</option>
            <option value="DevOps">DevOps</option>
            <option value="Design">Design</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Difficulty
          </label>
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags
        </label>
        <Input
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="Enter tags separated by commas"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={form.isPublic}
          onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label
          htmlFor="isPublic"
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          Make project public
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-500 text-white to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          Create Project
        </Button>
      </div>
    </form>
  );
};

export default ProjectsPage;
