import { Badge } from "@/components/ui/badge";
import { Check, Clock, Plus } from "lucide-react";

export function RoadmapTimelineView({
  roadmap,
  progress,
  onToggleProgress,
}: any) {
  return (
    <div className="p-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-zinc-700"></div>

        {roadmap.nodes.map((node: any, index: number) => (
          <div key={node.id} className="relative pl-12 pb-8">
            {/* Timeline dot */}
            <div
              className={`absolute left-0 top-1 w-3 h-3 rounded-full ${
                progress[node.id]
                  ? "bg-green-500 ring-4 ring-green-200 dark:ring-green-900/30"
                  : "bg-blue-500"
              }`}
            ></div>

            {/* Node content */}
            <div
              className={`p-4 rounded-lg border ${
                progress[node.id]
                  ? "border-green-300 bg-green-50 dark:bg-green-900/10"
                  : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{node.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {node.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {node.description}
                  </p>
                </div>
                <button
                  onClick={() => onToggleProgress(node.id)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  {progress[node.id] ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Plus className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{node.estimatedTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
