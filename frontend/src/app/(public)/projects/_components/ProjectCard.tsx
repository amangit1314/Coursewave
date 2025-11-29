import { Project } from "@/types/project";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleArrowRight, Eye, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { dmSans } from "@/lib/config/fonts";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "planning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 shadow-none";
    case "published":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 shadow-none";
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 shadow-none";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 shadow-none";
    case "on-hold":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 shadow-none";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 shadow-none";
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 shadow-none";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 shadow-none";
    case "advanced":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 shadow-none";
    case "expert":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 shadow-none";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 shadow-none";
  }
};

const ProjectCard = ({
  project,
  viewMode,
}: {
  project: Project;
  viewMode: "grid" | "list";
}) => {
  const [isBookmarked, setIsBookmarked] = useState(project.isBookmarked);
  const router = useRouter();

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const viewProject = () => {
    router.push(`/projects/${project.id}`);
  };

  if (viewMode === "list") {
    return (
      <Card
        onClick={viewProject}
        className="group relative border border-gray-200 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-zinc-800/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Icon + Text */}
            <div className="flex items-start gap-4 w-full md:w-2/3">
              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`${dmSans.className} text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}
                >
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
                onClick={viewProject}
                className={`${dmSans.className} bg-gradient-to-r mt-4 from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600`}
              >
                <CircleArrowRight className="h-3 w-3" />
                View Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onClick={viewProject}
      className="group border shadow-none border-gray-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 relative overflow-hidden transition-all duration-300 hover:shadow-sm  dark:hover:shadow-blue-500">
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
              className="text-xs bg-blue-500 px-2 py-1 text-white rounded-full font-medium tracking-tight"
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
          {/* <div className="flex items-center space-x-2">
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
          </div> */}

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
            <CircleArrowRight className="h-3 w-3" />
            View Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
