import { Badge } from "@/components/ui/badge";
import { Check, Clock, Plus } from "lucide-react";

export function RoadmapListView({ roadmap, progress, onToggleProgress }: any) {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {roadmap.nodes.map((node: any) => (
          <div
            key={node.id}
            className={`p-4 rounded-lg border ${
              progress[node.id]
                ? "border-green-300 bg-green-50 dark:bg-green-900/10"
                : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => onToggleProgress(node.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  progress[node.id]
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "border border-gray-300 dark:border-zinc-600 text-gray-400"
                }`}
              >
                {progress[node.id] ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold">{node.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {node.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {node.description}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{node.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}