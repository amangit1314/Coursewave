
import React from "react";
import {
  Calendar,
  Award,
  Tag,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  X,
} from "lucide-react";

type Project = {
  id: string;
  title: string;
  status: string;
  difficulty?: string;
  categories?: string[];
  deadline?: string;
  maxSubmissions?: number;
};

type ProjectItemProps = {
  project: Project;
};

const ProjectTableItem = ({ project }: ProjectItemProps) => {
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30";
      case "draft":
        return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30";
      case "archived":
        return "bg-zinc-100 dark:bg-zinc-500/20 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/30";
      default:
        return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30";
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30";
      case "intermediate":
        return "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30";
      case "advanced":
        return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30";
      default:
        return "bg-zinc-100 dark:bg-zinc-500/20 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/30";
    }
  };

  const getDifficultyIcon = (difficulty?: string) => {
    const iconClass = "h-3.5 w-3.5";
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return <Award className={iconClass} />;
      case "intermediate":
      case "advanced":
        return <TrendingUp className={iconClass} />;
      default:
        return null;
    }
  };

  const handleDelete = () => {
    console.log("Deleting project:", project.id);
    setDeleteConfirm(false);
  };

  return (
    <>
      <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-150 group">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
              {project.title.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {project.title}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                ID: {project.id}
              </p>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(
              project.status
            )}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {project.status}
          </span>
        </td>

        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getDifficultyColor(
              project.difficulty
            )}`}
          >
            {getDifficultyIcon(project.difficulty)}
            {project.difficulty || "N/A"}
          </span>
        </td>

        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1.5">
            {project.categories && project.categories.length > 0 ? (
              <>
                {project.categories.slice(0, 2).map((cat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  >
                    <Tag className="h-3 w-3" />
                    {cat}
                  </span>
                ))}
                {project.categories.length > 2 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                    +{project.categories.length - 2}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Uncategorized</span>
            )}
          </div>
        </td>

        <td className="px-6 py-4 hidden xl:table-cell">
          <div className="flex items-center gap-4 text-sm">
            {project.deadline && (
              <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <Calendar className="h-4 w-4" />
                <span>{new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            )}
            {project.maxSubmissions && (
              <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <Award className="h-4 w-4" />
                <span>{project.maxSubmissions}</span>
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex justify-end relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className={`relative flex items-center justify-center h-9 w-9 rounded-lg transition-all duration-200 ${
                openDropdown
                  ? "bg-zinc-100 dark:bg-zinc-700 shadow-lg scale-95"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
              }`}
              aria-haspopup="true"
              aria-expanded={openDropdown}
            >
              <MoreHorizontal
                className={`h-5 w-5 transition-transform duration-200 ${
                  openDropdown ? "rotate-90" : ""
                }`}
              />
            </button>

            {openDropdown && (
              <>
                <div
                  className="fixed inset-0"
                  onClick={() => setOpenDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-2xl z-[9999] overflow-hidden border backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200 bg-white/95 dark:bg-zinc-800/95 border-zinc-200 dark:border-zinc-700">
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-700">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Actions
                    </p>
                  </div>
                  <div className="py-1">
                    {/* <button
                      onClick={() => setOpenDropdown(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 group/item text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    >
                      <div className="p-1 rounded-md transition-colors bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover/item:bg-blue-200 dark:group-hover/item:bg-blue-500/30">
                        <Eye className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium text-sm text-zinc-900 dark:text-white">
                        View Project
                      </span>
                    </button> */}
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
          </div>
        </td>
      </tr>

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
                <strong>"{project.title}"</strong>? This action cannot be undone.
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

export default ProjectTableItem;
