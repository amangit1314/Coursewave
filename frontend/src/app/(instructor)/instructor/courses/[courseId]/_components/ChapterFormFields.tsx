"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Video, FileText, HelpCircle } from "lucide-react";
import { dmSans } from "@/lib/config/fonts";
import RichTextEditor from "./RichTextEditor";
import { ChapterVideoUpload } from "./ChapterVideoUpload";
import { ChapterQuizSection, QuizQuestion } from "./ChapterQuizSection";

export type ContentType = "text" | "video" | "quiz";

interface ChapterFormFieldsProps {
  title: string;
  description: string;
  content: string;
  contentType: ContentType;
  videoUrl: string;
  formErrors: Record<string, string>;
  // Video props
  isEditingVideo: boolean;
  isUploading: boolean;
  uploadProgress: number;
  onEditVideoToggle: (editing: boolean) => void;
  onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveVideo: () => void;
  // Quiz props
  quizQuestions: QuizQuestion[];
  isGeneratingQuiz: boolean;
  onAddQuestion: () => void;
  onRemoveQuestion: (id: string) => void;
  onUpdateQuestion: (id: string, field: string, value: any) => void;
  onUpdateOption: (questionId: string, optionIndex: number, value: string) => void;
  onAddOption: (questionId: string) => void;
  onRemoveOption: (questionId: string, optionIndex: number) => void;
  onAIGenerateQuiz: () => void;
  // Common
  onInputChange: (field: string, value: string | boolean) => void;
}

export const getContentTypeIcon = (type: ContentType) => {
  switch (type) {
    case "video":
      return <Video className="h-4 w-4" />;
    case "quiz":
      return <HelpCircle className="h-4 w-4" />;
    case "text":
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export const ChapterFormFields = ({
  title,
  description,
  content,
  contentType,
  videoUrl,
  formErrors,
  isEditingVideo,
  isUploading,
  uploadProgress,
  onEditVideoToggle,
  onVideoUpload,
  onRemoveVideo,
  quizQuestions,
  isGeneratingQuiz,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestion,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onAIGenerateQuiz,
  onInputChange,
}: ChapterFormFieldsProps) => {
  return (
    <>
      {/* Basic Information (Title & Content Type) */}
      <div className="space-y-4">
        <div className="space-y-3">
          <Label
            htmlFor="title"
            className={`${dmSans.className} text-sm font-semibold text-slate-700 dark:text-slate-300`}
          >
            Chapter Title
          </Label>
          <Input
            value={title}
            onChange={(e) => onInputChange("title", e.target.value)}
            placeholder="Enter an engaging chapter title"
            required
            className="h-11 bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200 shadow-sm"
          />
          {formErrors.title && (
            <p className="text-red-500 text-sm">{formErrors.title}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label
            htmlFor="contentType"
            className={`${dmSans.className} text-sm font-semibold text-slate-700 dark:text-slate-300`}
          >
            Content Type
          </Label>
          <Select
            value={contentType}
            onValueChange={(value: ContentType) =>
              onInputChange("contentType", value)
            }
          >
            <SelectTrigger className="h-11 bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200 shadow-sm">
              <SelectValue>
                <div className="flex items-center gap-3">
                  {getContentTypeIcon(
                    contentType.toLocaleLowerCase() as ContentType
                  )}
                  <span className="capitalize font-medium">
                    {contentType}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 shadow-xl rounded-xl">
              <SelectItem value="text" className="py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>Text Content</span>
                </div>
              </SelectItem>
              <SelectItem value="video" className="py-3">
                <div className="flex items-center gap-3">
                  <Video className="h-4 w-4 text-red-500" />
                  <span>Video Content</span>
                </div>
              </SelectItem>
              <SelectItem value="quiz" className="py-3">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-4 w-4 text-purple-500" />
                  <span>Quiz</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <Label
          htmlFor="description"
          className={`${dmSans.className} text-sm font-semibold text-slate-700 dark:text-slate-300`}
        >
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Write a compelling description that will engage your students..."
          rows={3}
          className="bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200 shadow-sm resize-none"
        />
      </div>

      {/* Dynamic Content Section */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-700 rounded-xl p-5 border border-slate-200 dark:border-zinc-600">
        <h3
          className={`${dmSans.className} text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200`}
        >
          {getContentTypeIcon(contentType.toLowerCase() as ContentType)}
          {contentType.toLowerCase() === "text" && "Text Content"}
          {contentType.toLowerCase() === "video" && "Video Content"}
          {contentType.toLowerCase() === "quiz" && "Quiz Configuration"}
        </h3>

        {/* Text view */}
        {contentType.toLowerCase() === "text" && (
          <RichTextEditor
            value={content}
            onChange={(value) => onInputChange("content", value)}
          />
        )}

        {/* Video view */}
        {contentType.toLowerCase() === "video" && (
          <ChapterVideoUpload
            videoUrl={videoUrl}
            content={content}
            isEditingVideo={isEditingVideo}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            onEditVideoToggle={onEditVideoToggle}
            onVideoUpload={onVideoUpload}
            onRemoveVideo={onRemoveVideo}
            onContentChange={(value) => onInputChange("content", value)}
          />
        )}

        {/* Quiz view */}
        {contentType.toLowerCase() === "quiz" && (
          <ChapterQuizSection
            quizQuestions={quizQuestions}
            isGeneratingQuiz={isGeneratingQuiz}
            onAddQuestion={onAddQuestion}
            onRemoveQuestion={onRemoveQuestion}
            onUpdateQuestion={onUpdateQuestion}
            onUpdateOption={onUpdateOption}
            onAddOption={onAddOption}
            onRemoveOption={onRemoveOption}
            onAIGenerateQuiz={onAIGenerateQuiz}
          />
        )}

        {/* Video upload with error display */}
        {contentType === "video" && formErrors.videoUrl && (
          <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">
              {formErrors.videoUrl}
            </p>
          </div>
        )}

        {/* Quiz errors */}
        {contentType === "quiz" && formErrors.quiz && (
          <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">
              {formErrors.quiz}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
