import { Project } from "@/types/project";
import Badge from "./Badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, Calendar, Tag, X } from "lucide-react";
import React from "react";

type ProjectCardItemProps = {
  project: Project;
  instructorProjects: Project[];
};

const ProjectCardItem = (props: ProjectCardItemProps) => {
  const { instructorProjects, project } = props;
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);

  const handleDelete = () => {
    setDeleteConfirm(false);
  };

  return (
    <>
      {instructorProjects.map((project: Project) => (
        <div
          key={project.id}
          className="group relative bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50 flex flex-col transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          {/* Decorative gradient overlay */}
          {/* <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-0 group-hover:scale-150 transition-transform duration-500" /> */}

          <div className="relative z-10">
            {/* Header with thumbnail */}
            <div className="flex items-start gap-4 mb-4">
              {project.thumbnailUrl && (
                <div className="relative flex-shrink-0">
                  <img
                    src={project.thumbnailUrl}
                    alt="Thumbnail"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white dark:border-zinc-700 shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-xl text-zinc-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded-md inline-block">
                  {project.slug}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
              {project.description}
            </p>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap mb-5">
              <Badge color="green">{project.status}</Badge>
              {project.difficulty && (
                <Badge color="yellow">{project.difficulty}</Badge>
              )}
              <Badge color="blue">{project.categories.join(", ")}</Badge>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-600 to-transparent mb-4" />

            {/* Action buttons */}
            <div className="flex gap-2">
              {/* <Link
                href={`/instructor/projects/${project.id}`}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-all group/btn"
                >
                  <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                  View
                </Button>
              </Link> */}
              <Link
                href={`/instructor/projects/${project.id}/edit`}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl font-medium hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-700 transition-all group/btn"
                >
                  <Edit className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-all group/btn"
                // onClick={() => handleDelete()}
                onClick={() => setOpenDropdown(!openDropdown)}
              >
                <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {openDropdown && (
        <>
          <div
            className="fixed inset-0 z-40 left-20"
            onClick={() => setOpenDropdown(false)}
          />
          <div className="absolute mt-2 w-52 rounded-xl shadow-2xl z-50 overflow-hidden border backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200 bg-white/95 dark:bg-zinc-800/95 border-zinc-200 dark:border-zinc-700">
            <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Actions
              </p>
            </div>
            <div className="py-1">
              <button
                onClick={() => setOpenDropdown(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 group/item text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-500/10"
              >
                <div className="p-1 rounded-md transition-colors bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover/item:bg-blue-200 dark:group-hover/item:bg-blue-500/30">
                  <Eye className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium text-sm text-zinc-900 dark:text-white">
                  View Project
                </span>
              </button>
              <button
                onClick={() => setOpenDropdown(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 group/item text-zinc-700 dark:text-zinc-200 hover:bg-green-50 dark:hover:bg-green-500/10"
              >
                <div className="p-1 rounded-md transition-colors bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 group-hover/item:bg-green-200 dark:group-hover/item:bg-green-500/30">
                  <Edit className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium text-sm text-zinc-900 dark:text-white">
                  Edit Project
                </span>
              </button>
              <div className="my-1 border-t border-zinc-100 dark:border-zinc-700" />
              <button
                onClick={() => {
                  setDeleteConfirm(true);
                  setOpenDropdown(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 group/item text-zinc-700 dark:text-zinc-200 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <div className="p-1 rounded-md transition-colors bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 group-hover/item:bg-red-200 dark:group-hover/item:bg-red-500/30">
                  <Trash2 className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium text-sm text-red-600 dark:text-red-400">
                  Delete Project
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {deleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setDeleteConfirm(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 bg-white dark:bg-zinc-800 dark:border dark:border-zinc-700">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="absolute top-4 right-4 p-1 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-red-100 dark:bg-red-500/20">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">
                Delete Project?
              </h3>
              <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                Are you sure you want to delete{" "}
                <strong>"{project.title}"</strong>? This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProjectCardItem;
