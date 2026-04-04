import { Badge } from "@/components/ui/badge";
import { Check, Clock, ChevronRight, Circle } from "lucide-react";
import { dmSans } from "@/lib/config/fonts";

export function RoadmapTimelineView({
  roadmap,
  progress,
  onToggleProgress,
}: any) {
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalNodes = roadmap.nodes?.length || 0;

  return (
    <div className="p-6 lg:p-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Progress
          </span>
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
            {completedCount}/{totalNodes} completed
          </span>
        </div>
        <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: totalNodes > 0 ? `${(completedCount / totalNodes) * 100}%` : "0%" }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700" />

        {roadmap.nodes.map((node: any, index: number) => {
          const isDone = progress[node.id];

          return (
            <div key={node.id} className="relative pl-14 pb-8 last:pb-0 group">
              {/* Step indicator */}
              <button
                onClick={() => onToggleProgress(node.id)}
                className="absolute left-0 top-0 z-10"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors duration-200 ${
                    isDone
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 hover:border-blue-400 dark:hover:border-blue-500"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </button>

              {/* Content card */}
              <div
                className={`rounded-xl border p-5 transition-colors duration-200 ${
                  isDone
                    ? "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 hover:border-blue-200 dark:hover:border-blue-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className={`${dmSans.className} font-bold text-zinc-900 dark:text-white`}>
                        {node.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-medium ${
                          isDone
                            ? "border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400"
                            : "border-zinc-300 dark:border-zinc-600"
                        }`}
                      >
                        {node.type}
                      </Badge>
                      {isDone && (
                        <Badge className="bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-0 text-[11px]">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                </div>

                {/* Meta row */}
                <div className="mt-3 flex items-center gap-4">
                  {node.estimatedTime && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Clock className="h-3 w-3" />
                      <span>{node.estimatedTime}</span>
                    </div>
                  )}
                  {node.resources && node.resources.length > 0 && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 cursor-pointer hover:underline">
                      {node.resources.length} resources
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
