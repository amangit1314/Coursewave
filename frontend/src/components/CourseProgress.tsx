import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/utils";
import { CheckCircle2, Clock } from "lucide-react";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
}

const colorByVariant = {
  default: "text-sky-600",
  success: "text-emerald-600",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

export const CourseProgress = ({
  value,
  variant = "default",
  size = "default",
}: CourseProgressProps) => {
  const isComplete = value >= 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isComplete ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <Clock className="h-4 w-4 text-sky-500" />
          )}
          <p
            className={cn(
              "tracking-tight underline decoration-2 underline-offset-4",
              colorByVariant[variant],
              sizeByVariant[size]
            )}
          >
            {isComplete ? "Completed" : "In Progress"}
          </p>
        </div>

        <p
          className={cn(
            "font-semibold ml-1",
            colorByVariant[variant],
            sizeByVariant[size]
          )}
        >
          {Math.round(value)}%
        </p>
      </div>

      <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "absolute left-0 top-0 h-full transition-all duration-500",
            isComplete
              ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
              : "bg-gradient-to-r from-sky-400 to-sky-600"
          )}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
};
