import { Badge } from "@/components/ui/badge";
import { Check, Clock, ChevronRight } from "lucide-react";
import { dmSans } from "@/lib/config/fonts";

export function RoadmapListView({ roadmap, progress, onToggleProgress }: any) {
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalNodes = roadmap.nodes?.length || 0;

  return (
    <div className="p-6 lg:p-8">
      {/* Progress summary */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h3 className={`${dmSans.className} font-bold text-zinc-900 dark:text-white`}>
            {roadmap.title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {completedCount} of {totalNodes} steps completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: totalNodes > 0 ? `${(completedCount / totalNodes) * 100}%` : "0%" }}
            />
          </div>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* List items */}
      <div className="space-y-2">
        {roadmap.nodes.map((node: any, index: number) => {
          const isDone = progress[node.id];

          return (
            <div
              key={node.id}
              onClick={() => onToggleProgress(node.id)}
              className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors duration-200 ${
                isDone
                  ? "bg-emerald-50/50 dark:bg-emerald-900/10"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                  isDone
                    ? "bg-emerald-500 text-white"
                    : "border-2 border-zinc-300 dark:border-zinc-600 text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : index + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4
                    className={`font-semibold text-sm ${
                      isDone
                        ? "text-emerald-700 dark:text-emerald-400 line-through"
                        : "text-zinc-900 dark:text-white"
                    }`}
                  >
                    {node.title}
                  </h4>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      isDone
                        ? "border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
                        : "border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {node.type}
                  </Badge>
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${isDone ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                  {node.description}
                </p>
                {node.estimatedTime && (
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-400">
                    <Clock className="h-3 w-3" />
                    {node.estimatedTime}
                  </div>
                )}
              </div>

              {/* Arrow */}
              <ChevronRight className={`h-4 w-4 flex-shrink-0 mt-2 ${isDone ? "text-emerald-400" : "text-zinc-300 dark:text-zinc-600"}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
