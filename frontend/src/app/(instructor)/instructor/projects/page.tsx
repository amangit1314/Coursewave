"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Search, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjects"; // You’ll need a useProjects hook for instructor
import { useUserStore } from "@/zustand/userStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function InstructorProjects() {
  const { user } = useUserStore();
  const instructorId = user?.id;
  const { projects, isLoading } = useProjects();
  // const instructorProjects = projects.filter(
  //   (project) => project.instructorId === instructorId
  // );
  const instructorProjects = projects;

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const hasProjects = instructorProjects.length > 0;

  // const instructorProjects = (projects.data ?? []).filter(
  //   (project: any) => project.instructorId === instructorId
  // );

  // const filtered = instructorProjects.filter((project) =>
  //   project.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Your Projects
        </h1>
        {/* <Link href="/instructor/projects/create">
          <Button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow">
            <PlusCircle className="h-5 w-5" />
            <span className="hidden md:inline">New Project</span>
          </Button>
        </Link> */}
        <div className="flex items-center gap-4">
          <Button
            variant={view === "cards" ? "default" : "outline"}
            onClick={() => setView("cards")}
            className={`cursor-pointer rounded-lg px-3 ${view === "cards" ? "bg-blue-600 text-white" : ""}`}
          >
            Cards View
          </Button>
          <Button
            variant={view === "table" ? "default" : "outline"}
            onClick={() => setView("table")}
            className={`cursor-pointer rounded-lg px-3 ${view === "table" ? "bg-blue-600 text-white" : ""}`}
          >
            Table View
          </Button>
          <Link href="/instructor/projects/create">
            <Button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow">
              <PlusCircle className="h-5 w-5" />
              <span className="hidden md:inline">New Project</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 flex justify-between">
        <div className="w-full max-w-md flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-xl border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600">
          <Search className="text-zinc-400 w-5 h-5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500"
            placeholder="Search projects..."
          />
        </div>
      </div>

      {!isLoading && !hasProjects && (
        <div className="flex flex-col items-center justify-center min-h-[300px] py-12 px-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow my-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mb-4 text-blue-400 opacity-80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
            No projects found
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 text-center">
            You haven’t created any projects yet.
            <br /> Click “New Project” to get started.
          </p>
        </div>
      )}

      {hasProjects && view === "cards" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {instructorProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow border border-zinc-200 dark:border-zinc-700 flex flex-col"
            >
              {instructorProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow border border-zinc-200 dark:border-zinc-700 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-2">
                    {project.thumbnailUrl && (
                      <img
                        src={project.thumbnailUrl}
                        alt="Thumbnail"
                        className="w-14 h-14 rounded-lg object-cover border"
                      />
                    )}
                    <div>
                      <h2 className="font-bold text-lg text-zinc-900 dark:text-white">
                        {project.title}
                      </h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {project.slug}
                      </p>
                    </div>
                  </div>
                  <p className="line-clamp-3 text-sm text-zinc-700 dark:text-zinc-200 mb-2">
                    {project.description}
                  </p>

                  <div className="flex gap-2 flex-wrap mb-3">
                    <Badge color="green">{project.status}</Badge>
                    {project.difficulty && (
                      <Badge color="yellow">{project.difficulty}</Badge>
                    )}
                    <Badge color="blue">{project.categories.join(", ")}</Badge>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <Link href={`/instructor/projects/${project.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg font-medium"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/instructor/projects/${project.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg font-medium"
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-lg font-medium"
                      // onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {hasProjects && view === "table" && (
        <div className="overflow-x-auto mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instructorProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.difficulty}</TableCell>
                  <TableCell>{project.categories?.join(", ")}</TableCell>
                  <TableCell>
                    <Link href={`/instructor/projects/${project.id}`}>
                      <Button size="sm" className="rounded-lg font-medium mr-2">
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// Reusable Badge component:
function Badge({
  color = "blue",
  children,
}: {
  color: "green" | "yellow" | "blue" | "gray";
  children: ReactNode;
}) {
  const colors = {
    green: "bg-green-100 text-green-700 border-green-400",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-400",
    blue: "bg-blue-100 text-blue-700 border-blue-400",
    gray: "bg-gray-100 text-gray-600 border-gray-300",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full border shadow-sm text-xs font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
}
