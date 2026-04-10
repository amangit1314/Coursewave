import { dmSans } from "@/lib/config/fonts";
import { TrendingUpIcon } from "lucide-react";
import React from "react";
import { ProgressBar } from "@/components/shared";

type Props = {
  completionRate: number;
  totalEnrolledCourses: number;
  totalOngoingCourses: number;
  totalCompletedCourses: number;
};

const LearningProgress = (props: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg p-2 bg-primary/10">
            <TrendingUpIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className={`${dmSans.className} text-xl font-semibold text-foreground`}>
              Learning Progress
            </h3>
            <p className="text-sm text-muted-foreground">
              Your course completion overview
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className={`${dmSans.className} text-2xl font-bold text-foreground tabular-nums`}>
            {props.completionRate}%
          </div>
          <div className="text-sm text-muted-foreground">
            Completion Rate
          </div>
        </div>
      </div>

      {/* progress bar */}
      <ProgressBar value={props.completionRate} showLabel={false} size="md" />

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-semibold text-foreground tabular-nums">
            {props.totalEnrolledCourses}
          </div>
          <div className={`${dmSans.className} text-sm text-muted-foreground`}>
            Enrolled
          </div>
        </div>

        <div>
          <div className="text-lg font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
            {props.totalOngoingCourses}
          </div>
          <div className={`${dmSans.className} text-sm text-muted-foreground`}>
            In Progress
          </div>
        </div>

        <div>
          <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {props.totalCompletedCourses}
          </div>
          <div className={`${dmSans.className} text-sm text-muted-foreground`}>
            Completed
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgress;
