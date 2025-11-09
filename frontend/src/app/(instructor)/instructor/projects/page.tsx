"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  PlusCircle,
  Search,
  Grid,
  List,
  Calendar,
  Tag,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { useUserStore } from "@/zustand/userStore";
import { Project } from "@/types/project";
import ProjectCardItem from "./_components/ProjectCardItem";
import ProjectTableItem from "./_components/ProjectTableItem";

export default function InstructorProjects() {
  const { user } = useUserStore();
  const { projects: projectsData, isLoading, isError, error } = useProjects();

  const projects = projectsData || [];
  const instructorProjects = projects;

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");

  // Filter projects based on search
  const filteredProjects = instructorProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.categories?.some((cat) =>
        cat.toLowerCase().includes(search.toLowerCase())
      ) ||
      project.tags?.some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
      )
  );

  const hasProjects = filteredProjects.length > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center p-8 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
            Error Loading Projects
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            {(error as Error)?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Your Projects
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Manage and organize your projects
            </p>
          </div>

          <div className="col-span-2 flex justify-end items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700 shadow-sm">
              <button
                onClick={() => setView("cards")}
                className={`p-2 rounded-md transition-all ${
                  view === "cards"
                    ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView("table")}
                className={`p-2 rounded-md transition-all ${
                  view === "table"
                    ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Create New Project Button */}
            <Link href="/instructor/projects/create">
              <Button className="flex items-center gap-2 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                <PlusCircle className="h-5 w-5" />
                <span className="hidden sm:inline">New Project</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search projects by title, category, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all shadow-sm"
          />
        </div> */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search projects by title, category, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all shadow-sm"
          />
        </div>

        {/* No Projects State */}
        {!isLoading && instructorProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] py-12 px-4 rounded-2xl bg-white dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
              <PlusCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              No Projects Yet
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-center max-w-md">
              You haven't created any projects yet. Get started by creating your
              first project!
            </p>
            <Link href="/instructor/projects/create">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                <PlusCircle className="h-5 w-5" />
                Create Your First Project
              </Button>
            </Link>
          </div>
        )}

        {/* No Search Results */}
        {!isLoading && instructorProjects.length > 0 && !hasProjects && (
          <div className="flex flex-col items-center justify-center min-h-[300px] py-12 px-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
              <Search className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              No Results Found
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-md">
              No projects match your search for "{search}"
            </p>
            <Button
              onClick={() => setSearch("")}
              variant="outline"
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Cards View */}
        {hasProjects && view === "cards" && (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <ProjectCardItem
                key={project.id}
                project={project}
                instructorProjects={instructorProjects}
              />
            ))}
          </div>
        )}

        {/* Table View */}
        {hasProjects && view === "table" && (
          // <div>
            <table className="w-full rounded-xl ">
              <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                    Project
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                    Categories
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white hidden xl:table-cell">
                    Details
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <ProjectTableItem
                    key={project.id}
                    project={project}
                    // instructorProjects={instructorProjects}
                  />
                ))}
              </tbody>
            </table>
          // </div>
        )}
      </div>
    </div>
  );
}
