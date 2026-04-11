"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Globe, Lock } from "lucide-react";
import { supabase } from "@/lib/config/supabase";
import { generateQuizFromContent } from "@/lib/ai/quiz-generator";
import { dmSans } from "@/lib/config/fonts";
import toast from "react-hot-toast";
import { Chapter } from "@/types/courses.service.types";
import { QuizQuestion } from "./ChapterQuizSection";
import { ChapterAccessSettings } from "./ChapterAccessSettings";
import { ChapterFormFields, ContentType, getContentTypeIcon } from "./ChapterFormFields";

interface EditChapterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapter: Chapter | null;
  onSave: (chapterData: Partial<Chapter>) => Promise<void>;
  isLoading?: boolean;
}

export const EditChapterSheet = ({
  open,
  onOpenChange,
  chapter,
  onSave,
  isLoading = false,
}: EditChapterSheetProps) => {
  if (!chapter) return null;

const [formData, setFormData] = useState({
  title: chapter.title,
  description: chapter.description || "",
  content: "",
  contentType: chapter.contentType as ContentType,
  videoUrl: "",
  isPublished: chapter.isPublished,
  isFree: chapter.isFree,
});

const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
const [isUploading, setIsUploading] = useState(false);
const [isEditingVideo, setIsEditingVideo] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const [formErrors, setFormErrors] = useState<Record<string, string>>({});
const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

useEffect(() => {
  if (chapter && open) {
    const content = chapter.content || {};
    let contentValue = "";
    let videoUrlValue = "";

    if (chapter.contentType.toLowerCase() === "text") {
      contentValue = content.text || "";
    } else if (chapter.contentType.toLowerCase() === "video") {
      contentValue = content.notes || "";
      videoUrlValue = content.videoUrl || "";
    }

    setFormData({
      title: chapter.title,
      description: chapter.description || "",
      content: contentValue,
      contentType: chapter.contentType as ContentType,
      videoUrl: videoUrlValue,
      isPublished: chapter.isPublished,
      isFree: chapter.isFree,
    });

    if (chapter.contentType.toLocaleLowerCase() === "quiz") {
      try {
        const questions = Array.isArray(content)
          ? content
          : content.questions || [];
        setQuizQuestions(questions);
      } catch {
        setQuizQuestions([]);
      }
    } else {
      setQuizQuestions([]);
    }

    setFormErrors({});
  }
}, [chapter, open]);

const validateForm = (): boolean => {
  const errors: Record<string, string> = {};

  if (!formData.title.trim()) {
    errors.title = "Title is required";
  }

  if (formData.contentType === "video" && !formData.videoUrl) {
    errors.videoUrl = "Video is required for video content";
  }

  if (formData.contentType === "quiz") {
    if (quizQuestions.length === 0) {
      errors.quiz = "At least one question is required";
    } else {
      quizQuestions.forEach((question, index) => {
        if (!question.question.trim()) {
          errors[`question-${index}`] = `Question ${index + 1} is required`;
        }
        if (!question.correctAnswer.trim()) {
          errors[`answer-${index}`] =
            `Correct answer for question ${index + 1} is required`;
        }
        if (question.type === "multiple-choice" && question.options) {
          const validOptions = question.options.filter((opt) => opt.trim());
          if (validOptions.length < 2) {
            errors[`options-${index}`] =
              `At least 2 options required for question ${index + 1}`;
          }
        }
      });
    }
  }

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) {
    toast.error("Please fix the form errors before saving");
    return;
  }
  if (!chapter) return;

  let finalContent = {};
  try {
    if (formData.contentType === "text") {
      finalContent = { text: formData.content };
    } else if (formData.contentType === "video") {
      finalContent = { videoUrl: formData.videoUrl, notes: formData.content || "" };
      if (!formData.videoUrl) {
        toast.error("Video URL is required for video content");
        return;
      }
    } else if (formData.contentType === "quiz") {
      finalContent = {
        questions: quizQuestions,
        totalPoints: quizQuestions.reduce((sum, q) => sum + q.points, 0),
        totalQuestions: quizQuestions.length,
      };
    }

    const chapterData: Partial<Chapter> = {
      id: chapter.id,
      title: formData.title,
      description: formData.description,
      contentType: formData.contentType.toUpperCase() as "VIDEO" | "QUIZ" | "TEXT" | "ASSIGNMENT" | undefined,
      content: finalContent,
      isPublished: formData.isPublished,
      isFree: formData.isFree,
    };

    await onSave(chapterData);
  } catch (error) {
    console.error("Error preparing chapter data:", error);
    toast.error("Failed to prepare chapter data");
  }
};

const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const validTypes = ["video/mp4", "video/mov", "video/avi", "video/webm"];
  if (!validTypes.includes(file.type)) {
    alert("Please upload a valid video file (MP4, MOV, AVI, WEBM)");
    return;
  }
  if (file.size > 100 * 1024 * 1024) {
    alert("Video file size must be less than 100MB");
    return;
  }

  setIsUploading(true);
  setUploadProgress(0);
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `videos/${fileName}`;

    const { error } = await supabase.storage.from("videos").upload(filePath, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from("videos").getPublicUrl(filePath);
    handleInputChange("videoUrl", publicUrl);
  } catch (error) {
    console.error("Error uploading video:", error);
    alert("Failed to upload video. Please try again.");
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
    event.target.value = "";
  }
};

const handleRemoveVideo = async () => {
  if (!formData.videoUrl) return;
  try {
    const url = new URL(formData.videoUrl);
    const pathParts = url.pathname.split("/");
    const filePath = pathParts.slice(pathParts.indexOf("videos")).join("/");
    const { error } = await supabase.storage.from("videos").remove([filePath]);
    if (error) throw error;
    handleInputChange("videoUrl", "");
  } catch (error) {
    console.error("Error removing video:", error);
    alert("Failed to remove video. Please try again.");
  }
};

const addQuestion = () => {
  setQuizQuestions([...quizQuestions, {
    id: Date.now().toString(), question: "", type: "multiple-choice",
    options: ["", "", "", ""], correctAnswer: "", points: 1,
  }]);
};

const handleAIGenerateQuiz = async () => {
  try {
    setIsGeneratingQuiz(true);
    const content = formData.content || formData.title;
    const questions = await generateQuizFromContent(content, formData.title, 5);
    setQuizQuestions(questions);
    toast.success(`Generated ${questions.length} quiz questions`);
  } catch {
    toast.error("Failed to generate quiz. Check your Gemini API key.");
  } finally {
    setIsGeneratingQuiz(false);
  }
};

const removeQuestion = (id: string) => setQuizQuestions(quizQuestions.filter((q) => q.id !== id));

const updateQuestion = (id: string, field: string, value: any) => {
  setQuizQuestions(quizQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
};

const updateOption = (questionId: string, optionIndex: number, value: string) => {
  setQuizQuestions(quizQuestions.map((q) => {
    if (q.id === questionId && q.options) {
      const newOptions = [...q.options];
      newOptions[optionIndex] = value;
      return { ...q, options: newOptions };
    }
    return q;
  }));
};

const addOption = (questionId: string) => {
  setQuizQuestions(quizQuestions.map((q) => {
    if (q.id === questionId && q.options) return { ...q, options: [...q.options, ""] };
    return q;
  }));
};

const removeOption = (questionId: string, optionIndex: number) => {
  setQuizQuestions(quizQuestions.map((q) => {
    if (q.id === questionId && q.options && q.options.length > 2) {
      return { ...q, options: q.options.filter((_, i) => i !== optionIndex) };
    }
    return q;
  }));
};

const handleInputChange = (field: string, value: string | boolean) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};

return (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      className="!max-w-none w-[40vw] sm:w-[60vw] lg:w-[60vw]
                 p-0 flex flex-col
                 bg-gradient-to-br from-white to-slate-50
                 dark:from-zinc-950 dark:to-zinc-900
                 border-l-2 border-slate-200/50 dark:border-zinc-700/50
                 shadow-2xl"
    >
      {/* Header */}
      <SheetHeader className="px-6 py-4 border-b border-slate-200/50 dark:border-zinc-700/50 bg-gradient-to-r from-blue-600/5 via-blue-600/5 to-cyan-600/5 dark:from-blue-400/10 dark:via-blue-400/10 dark:to-cyan-400/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              {getContentTypeIcon(chapter.contentType as ContentType)}
            </div>
            <div>
              <SheetTitle
                className={`${dmSans.className} text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent`}
              >
                Edit Chapter
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  className={
                    chapter.isPublished
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-md border-0 px-2.5 py-0.5 text-xs"
                      : "bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 shadow-md border border-amber-300 dark:border-amber-700 px-2.5 py-0.5 text-xs"
                  }
                >
                  <div className="flex items-center gap-1">
                    {chapter.isPublished ? <Globe className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
                    {chapter.isPublished ? "Published" : "Draft"}
                  </div>
                </Badge>
                {chapter.isFree && (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md border-0 px-2.5 py-0.5 text-xs">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" />
                      Free
                    </div>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetHeader>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ChapterFormFields
            title={formData.title}
            description={formData.description}
            content={formData.content}
            contentType={formData.contentType}
            videoUrl={formData.videoUrl}
            formErrors={formErrors}
            isEditingVideo={isEditingVideo}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            onEditVideoToggle={setIsEditingVideo}
            onVideoUpload={handleVideoUpload}
            onRemoveVideo={handleRemoveVideo}
            quizQuestions={quizQuestions}
            isGeneratingQuiz={isGeneratingQuiz}
            onAddQuestion={addQuestion}
            onRemoveQuestion={removeQuestion}
            onUpdateQuestion={updateQuestion}
            onUpdateOption={updateOption}
            onAddOption={addOption}
            onRemoveOption={removeOption}
            onAIGenerateQuiz={handleAIGenerateQuiz}
            onInputChange={handleInputChange}
          />

          <ChapterAccessSettings
            isPublished={formData.isPublished}
            isFree={formData.isFree}
            isLoading={isLoading}
            onPublishedChange={(checked) => handleInputChange("isPublished", checked)}
            onFreeChange={(checked) => handleInputChange("isFree", checked)}
          />
        </form>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="px-6 py-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-zinc-700 flex gap-3 justify-end shadow-lg flex-shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
          className="h-11 px-6 border-2 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all duration-200"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="h-11 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save Changes
        </Button>
      </div>
    </SheetContent>
  </Sheet>
);
};
