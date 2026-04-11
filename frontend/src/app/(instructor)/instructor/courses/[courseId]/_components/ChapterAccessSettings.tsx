"use client";

import { Label } from "@/components/ui/label";
import { Globe, Sparkles } from "lucide-react";
import { CustomSwitch } from "./PublishCourseForm";
import { dmSans } from "@/lib/config/fonts";

interface ChapterAccessSettingsProps {
  isPublished: boolean;
  isFree: boolean;
  isLoading: boolean;
  onPublishedChange: (checked: boolean) => void;
  onFreeChange: (checked: boolean) => void;
}

export const ChapterAccessSettings = ({
  isPublished,
  isFree,
  isLoading,
  onPublishedChange,
  onFreeChange,
}: ChapterAccessSettingsProps) => {
  return (
    <div className="space-y-4">
      {/* isPublished switch */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-5 rounded-xl border border-green-200 dark:border-green-800/50">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
              <Label
                className={`${dmSans.className} text-base font-semibold text-green-800 dark:text-green-200`}
              >
                Publish Chapter
              </Label>
            </div>
            <p className="text-sm text-green-600 dark:text-green-300">
              Make this chapter visible to students
            </p>
          </div>
          <CustomSwitch
            checked={isPublished}
            color={"green"}
            disabled={isLoading}
            onCheckedChange={onPublishedChange}
          />
        </div>
      </div>

      {/* isFree switch */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800/50">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <Label
                className={`${dmSans.className} text-base font-semibold text-blue-800 dark:text-blue-200`}
              >
                Free Access
              </Label>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Allow free preview of this chapter
            </p>
          </div>
          <CustomSwitch
            checked={isFree}
            color={"blue"}
            disabled={isLoading}
            onCheckedChange={onFreeChange}
          />
        </div>
      </div>
    </div>
  );
};
