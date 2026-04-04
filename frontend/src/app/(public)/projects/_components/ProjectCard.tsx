import { Project } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Code2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { dmSans } from "@/lib/config/fonts";

const statusStyles: Record<string, string> = {
  planning: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400",
  "on-hold": "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
};

const difficultyStyles: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  advanced: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  expert: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

const fallbackStyle = "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-400";

const ProjectCard = ({
  project,
  viewMode,
}: {
  project: Project;
  viewMode: "grid" | "list";
}) => {
  const router = useRouter();
  const viewProject = () => router.push(`/projects/${project.id}`);

  const statusClass = statusStyles[project.status.toLowerCase()] || fallbackStyle;
  const difficultyClass = difficultyStyles[project.difficulty?.toLowerCase()] || fallbackStyle;

  // List view
  if (viewMode === "list") {
    return (
      <Card
        onClick={viewProject}
        className="group cursor-pointer border border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200"
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`${dmSans.className} font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate`}>
                  {project.title}
                </h3>
                <Badge className={`${statusClass} text-[11px] font-medium border-0 shrink-0`}>
                  {project.status.replace("-", " ")}
                </Badge>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 mb-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 4 && (
                  <span className="text-[11px] text-zinc-400">+{project.tags.length - 4}</span>
                )}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-blue-500 transition-colors shrink-0 hidden sm:block" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      onClick={viewProject}
      className="group cursor-pointer border border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200 overflow-hidden"
    >
      {/* Colored top bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

      <CardContent className="p-5">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className={`${statusClass} text-[11px] font-medium border-0`}>
            {project.status.replace("-", " ")}
          </Badge>
          {project.difficulty && (
            <Badge className={`${difficultyClass} text-[11px] font-medium border-0`}>
              {project.difficulty}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className={`${dmSans.className} text-base font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5`}>
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="text-[11px] text-zinc-400 self-center">+{project.tags.length - 4}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          {project.startDate && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Calendar className="h-3 w-3" />
              {new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
            View
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
