"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Upload,
  Trash2,
  Edit,
  X,
  AlertTriangle,
} from "lucide-react";
import { dmSans } from "@/lib/config/fonts";

interface ChapterVideoUploadProps {
  videoUrl: string;
  content: string;
  isEditingVideo: boolean;
  isUploading: boolean;
  uploadProgress: number;
  onEditVideoToggle: (editing: boolean) => void;
  onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveVideo: () => void;
  onContentChange: (value: string) => void;
}

export const ChapterVideoUpload = ({
  videoUrl,
  content,
  isEditingVideo,
  isUploading,
  uploadProgress,
  onEditVideoToggle,
  onVideoUpload,
  onRemoveVideo,
  onContentChange,
}: ChapterVideoUploadProps) => {
  return (
    <div className="space-y-5">
      {/* Video Preview Section - Show when videoUrl exists and not in edit mode */}
      {videoUrl && !isEditingVideo ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-200 dark:border-zinc-600 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Video Preview
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEditVideoToggle(true)}
                  className="text-xs h-8 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit Video
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRemoveVideo}
                  className="text-xs h-8 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
            <div className="aspect-video bg-slate-100 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-inner">
              <video
                src={videoUrl}
                controls
                className="w-full h-full"
                title="Uploaded video preview"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Video uploaded successfully
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                ✓ Ready to publish
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Video Upload Section - Show when no videoUrl or in edit mode */
        <div>
          <Label
            className={`${dmSans.className} text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block`}
          >
            {videoUrl ? "Replace Video" : "Upload Video"}
          </Label>

          {!videoUrl ? (
            <div className="border-2 border-dashed border-slate-300 dark:border-zinc-600 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 bg-white dark:bg-zinc-900">
              <input
                type="file"
                accept="video/*"
                onChange={onVideoUpload}
                className="hidden"
                id="video-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="video-upload"
                className={`cursor-pointer flex flex-col items-center justify-center space-y-3 ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Uploading Video...
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {uploadProgress}% complete
                      </p>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-slate-400" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Click to upload video
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        MP4, MOV, AVI up to 100MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                    >
                      Choose File
                    </Button>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Video Preview in Edit Mode */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-200 dark:border-zinc-600 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Current Video
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEditVideoToggle(false)}
                      className="text-xs h-8 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
                <div className="aspect-video bg-slate-100 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-inner">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full"
                    title="Current video preview"
                  />
                </div>
              </div>

              {/* Video Replacement Interface */}
              <div className="border-2 border-dashed border-slate-300 dark:border-zinc-600 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 bg-white dark:bg-zinc-900">
                <input
                  type="file"
                  accept="video/*"
                  onChange={onVideoUpload}
                  className="hidden"
                  id="video-replace"
                  disabled={isUploading}
                />
                <label
                  htmlFor="video-replace"
                  className={`cursor-pointer flex flex-col items-center justify-center space-y-3 ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Replacing Video...
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {uploadProgress}% complete
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-slate-400" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Click to replace video
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Choose a new video file to replace the
                          current one
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-2"
                      >
                        Choose New File
                      </Button>
                    </>
                  )}
                </label>
              </div>

              {/* Warning Message */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      Video Replacement Warning
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Replacing this video will remove the current
                      video and its associated data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Video Notes - Always show */}
      <div>
        <Label
          className={`${dmSans.className} text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block`}
        >
          Video Notes
        </Label>
        <Textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Add notes, key points, timestamps, or supplementary information..."
          rows={5}
          className="bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200 shadow-sm resize-none"
        />
      </div>
    </div>
  );
};
