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
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Video,
  FileText,
  HelpCircle,
  Sparkles,
  Globe,
  Lock,
  X,
  AlertTriangle,
  Upload,
  Trash2,
  Plus,
  Minus,
  Edit,
} from "lucide-react";
import { supabase } from "@/lib/config/supabase";
// import { Chapter } from "@/types/course-details-api-response";
import { CustomSwitch } from "./PublishCourseForm";
import { dmSans } from "@/lib/config/fonts";
import RichTextEditor from "./RichTextEditor";
import toast from "react-hot-toast";
import { Chapter } from "@/types/courses.service.types";

interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: string;
  points: number;
}

interface EditChapterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapter: Chapter | null;
  onSave: (chapterData: Partial<Chapter>) => Promise<void>;
  isLoading?: boolean;
}

type ContentType = "text" | "video" | "quiz";

export const EditChapterSheet = ({
  open,
  onOpenChange,
  chapter,
  onSave,
  isLoading = false,
}: EditChapterSheetProps) => {
  if (!chapter) return null;

  // In EditChapterSheet.tsx - at the top of component
  // ✅ Only log when chapter changes
  useEffect(() => {
    console.log("📋 Original chapter data:", {
      title: chapter.title,
      description: chapter.description,
      contentType: chapter.contentType,
      content: chapter.content,
      isPublished: chapter.isPublished,
      isFree: chapter.isFree,
    });
  }, [chapter]); // Only re-run when chapter object changes

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

  // Initialize form data when chapter changes
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
      } else if (chapter.contentType.toLowerCase() === "quiz") {
        contentValue = "";
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

      // Parse quiz questions
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

  /// =============================== METHODS =============================== ///

  // Form validation
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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     toast.error("Please fix the form errors before saving");
  //     return;
  //   }

  //   if (!chapter) return;

  //   let finalContent = {};

  //   try {
  //     // Structure content based on content type
  //     if (formData.contentType === "text") {
  //       finalContent = {
  //         text: formData.content,
  //       };
  //     } else if (formData.contentType === "video") {
  //       finalContent = {
  //         videoUrl: formData.videoUrl,
  //         notes: formData.content,
  //       };
  //     } else if (formData.contentType === "quiz") {
  //       finalContent = {
  //         questions: quizQuestions,
  //         totalPoints: quizQuestions.reduce((sum, q) => sum + q.points, 0),
  //         totalQuestions: quizQuestions.length,
  //       };
  //     }

  //     // Prepare the chapter data for update
  //     const chapterData: Partial<Chapter> = {
  //       id: chapter.id,
  //       title: formData.title,
  //       description: formData.description,
  //       contentType: formData.contentType,
  //       content: JSON.stringify(finalContent),
  //       isPublished: formData.isPublished,
  //       isFree: formData.isFree,
  //     };

  //     await onSave(chapterData);
  //   } catch (error) {
  //     console.error("Error preparing chapter data:", error);
  //     toast.error("Failed to prepare chapter data");
  //   }
  // };

  // Video upload handler

  // In EditChapterSheet.tsx - handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors before saving");
      return;
    }

    if (!chapter) return;

    let finalContent = {};

    try {
      // Structure content based on content type
      if (formData.contentType === "text") {
        finalContent = {
          text: formData.content,
        };
      } else if (formData.contentType === "video") {
        // ✅ Ensure videoUrl is properly set
        finalContent = {
          videoUrl: formData.videoUrl, // This should contain your actual video URL
          notes: formData.content || "", // Optional notes
        };

        console.log("🎥 Video content:", finalContent);

        // Validate that videoUrl exists for video content
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

      // Prepare the chapter data for update
      const chapterData: Partial<Chapter> = {
        id: chapter.id,
        title: formData.title,
        description: formData.description,
        contentType: formData.contentType.toUpperCase() as "VIDEO" | "QUIZ" | "TEXT" | "ASSIGNMENT" | undefined,
        content: finalContent, // ✅ Send as object, NOT stringified
        isPublished: formData.isPublished,
        isFree: formData.isFree,
      };

      console.log("📤 Final chapter data to send:", chapterData);

      await onSave(chapterData);
    } catch (error) {
      console.error("Error preparing chapter data:", error);
      toast.error("Failed to prepare chapter data");
    }
  };

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["video/mp4", "video/mov", "video/avi", "video/webm"];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid video file (MP4, MOV, AVI, WEBM)");
      return;
    }

    if (file.size > maxSize) {
      alert("Video file size must be less than 100MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { data, error } = await supabase.storage
        .from("videos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("videos").getPublicUrl(filePath);

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

  // Remove video handler
  const handleRemoveVideo = async () => {
    if (!formData.videoUrl) return;

    try {
      const url = new URL(formData.videoUrl);
      const pathParts = url.pathname.split("/");
      const filePath = pathParts.slice(pathParts.indexOf("videos")).join("/");

      const { error } = await supabase.storage
        .from("videos")
        .remove([filePath]);

      if (error) throw error;

      handleInputChange("videoUrl", "");
    } catch (error) {
      console.error("Error removing video:", error);
      alert("Failed to remove video. Please try again.");
    }
  };

  // Quiz management functions
  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuizQuestions(quizQuestions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuizQuestions(
      quizQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuizQuestions(
      quizQuestions.map((q) => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const addOption = (questionId: string) => {
    setQuizQuestions(
      quizQuestions.map((q) => {
        if (q.id === questionId && q.options) {
          return { ...q, options: [...q.options, ""] };
        }
        return q;
      })
    );
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuizQuestions(
      quizQuestions.map((q) => {
        if (q.id === questionId && q.options && q.options.length > 2) {
          const newOptions = q.options.filter(
            (_, index) => index !== optionIndex
          );
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getContentTypeIcon = (type: ContentType) => {
    // console.log("Getting icon for content type:", type);
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4" />;
      case "text":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  /// =============================== RENDER =============================== ///
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
                      {chapter.isPublished ? (
                        <Globe className="h-2.5 w-2.5" />
                      ) : (
                        <Lock className="h-2.5 w-2.5" />
                      )}
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
            {/* Basic Information (Title & Content Type) */}
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-3">
                <Label
                  htmlFor="title"
                  className={`${dmSans.className} text-sm font-semibold text-slate-700 dark:text-slate-300`}
                >
                  Chapter Title
                </Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter an engaging chapter title"
                  required
                  className="h-11 bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200 shadow-sm"
                />
                {formErrors.title && (
                  <p className="text-red-500 text-sm">{formErrors.title}</p>
                )}
              </div>

              {/* Content Type */}
              <div className="space-y-3">
                <Label
                  htmlFor="contentType"
                  className={`${dmSans.className} text-sm font-semibold text-slate-700 dark:text-slate-300`}
                >
                  Content Type
                </Label>
                <Select
                  value={formData.contentType}
                  onValueChange={(value: ContentType) =>
                    handleInputChange("contentType", value)
                  }
                >
                  <SelectTrigger className="h-11 bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200 shadow-sm">
                    <SelectValue>
                      <div className="flex items-center gap-3">
                        {getContentTypeIcon(
                          formData.contentType.toLocaleLowerCase() as ContentType
                        )}
                        <span className="capitalize font-medium">
                          {formData.contentType}
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
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
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
                {getContentTypeIcon(
                  formData.contentType.toLowerCase() as ContentType
                )}
                {formData.contentType.toLowerCase() === "text" &&
                  "Text Content"}
                {formData.contentType.toLowerCase() === "video" &&
                  "Video Content"}
                {formData.contentType.toLowerCase() === "quiz" &&
                  "Quiz Configuration"}
              </h3>

              {/* Text view */}
              {formData.contentType.toLowerCase() === "text" && (
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => handleInputChange("content", value)}
                />
              )}

              {/* Video view */}
              {formData.contentType.toLowerCase() === "video" && (
                <div className="space-y-5">
                  {/* Video Preview Section - Show when videoUrl exists and not in edit mode */}
                  {formData.videoUrl && !isEditingVideo ? (
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
                              onClick={() => setIsEditingVideo(true)}
                              className="text-xs h-8 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit Video
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleRemoveVideo}
                              className="text-xs h-8 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="aspect-video bg-slate-100 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-inner">
                          <video
                            src={formData.videoUrl}
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
                        {formData.videoUrl ? "Replace Video" : "Upload Video"}
                      </Label>

                      {!formData.videoUrl ? (
                        <div className="border-2 border-dashed border-slate-300 dark:border-zinc-600 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 bg-white dark:bg-zinc-900">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
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
                                  onClick={() => setIsEditingVideo(false)}
                                  className="text-xs h-8 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                            <div className="aspect-video bg-slate-100 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-inner">
                              <video
                                src={formData.videoUrl}
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
                              onChange={handleVideoUpload}
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
                      value={formData.content}
                      onChange={(e) =>
                        handleInputChange("content", e.target.value)
                      }
                      placeholder="Add notes, key points, timestamps, or supplementary information..."
                      rows={5}
                      className="bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200 shadow-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Quiz view */}
              {formData.contentType.toLowerCase() === "quiz" && (
                <div className="space-y-4">
                  {/* Quiz Questions Management */}
                  <div className="space-y-4">
                    {quizQuestions.map((question, index) => (
                      <div
                        key={question.id}
                        className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-600"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-sm font-medium">
                            Question {index + 1}
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <Input
                            value={question.question}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                "question",
                                e.target.value
                              )
                            }
                            placeholder="Enter your question"
                            className="bg-white dark:bg-zinc-800"
                          />

                          <Select
                            value={question.type}
                            onValueChange={(
                              value:
                                | "multiple-choice"
                                | "true-false"
                                | "short-answer"
                            ) => updateQuestion(question.id, "type", value)}
                          >
                            <SelectTrigger className="bg-white dark:bg-zinc-800">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple-choice">
                                Multiple Choice
                              </SelectItem>
                              <SelectItem value="true-false">
                                True/False
                              </SelectItem>
                              <SelectItem value="short-answer">
                                Short Answer
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          {question.type === "multiple-choice" && (
                            <div className="space-y-2">
                              <Label className="text-sm">Options</Label>
                              {question.options?.map((option, optIndex) => (
                                <div key={optIndex} className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) =>
                                      updateOption(
                                        question.id,
                                        optIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Option ${optIndex + 1}`}
                                    className="bg-white dark:bg-zinc-800 flex-1"
                                  />
                                  {question.options &&
                                    question.options.length > 2 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          removeOption(question.id, optIndex)
                                        }
                                        className="h-10 w-10 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(question.id)}
                                className="w-full border-dashed"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Option
                              </Button>
                              <Input
                                value={question.correctAnswer}
                                onChange={(e) =>
                                  updateQuestion(
                                    question.id,
                                    "correctAnswer",
                                    e.target.value
                                  )
                                }
                                placeholder="Correct answer (enter the exact option text)"
                                className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                              />
                            </div>
                          )}

                          {question.type === "true-false" && (
                            <Select
                              value={question.correctAnswer}
                              onValueChange={(value) =>
                                updateQuestion(
                                  question.id,
                                  "correctAnswer",
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="bg-white dark:bg-zinc-800">
                                <SelectValue placeholder="Select correct answer" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
                              </SelectContent>
                            </Select>
                          )}

                          {question.type === "short-answer" && (
                            <Input
                              value={question.correctAnswer}
                              onChange={(e) =>
                                updateQuestion(
                                  question.id,
                                  "correctAnswer",
                                  e.target.value
                                )
                              }
                              placeholder="Expected answer"
                              className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                            />
                          )}

                          <div className="flex items-center gap-2">
                            <Label className="text-sm">Points:</Label>
                            <Input
                              type="number"
                              value={question.points}
                              onChange={(e) =>
                                updateQuestion(
                                  question.id,
                                  "points",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              min="1"
                              max="10"
                              className="w-20 bg-white dark:bg-zinc-800"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={addQuestion}
                    variant="outline"
                    className="w-full border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>

                  {quizQuestions.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Total Questions: {quizQuestions.length} | Total Points:{" "}
                        {quizQuestions.reduce((sum, q) => sum + q.points, 0)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Video upload with error display */}
              {formData.contentType === "video" && formErrors.videoUrl && (
                <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {formErrors.videoUrl}
                  </p>
                </div>
              )}

              {/* Quiz errors */}
              {formData.contentType === "quiz" && formErrors.quiz && (
                <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {formErrors.quiz}
                  </p>
                </div>
              )}
            </div>

            {/* Settings Section */}
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
                  {/* <Switch
                    checked={formData.isPublished}
                    onCheckedChange={(checked) =>
                      handleInputChange("isPublished", checked)
                    }
                    className="data-[state=checked]:bg-green-500/30 data-[state=unchecked]:bg-gray-200/30 dark:data-[state=unchecked]:bg-gray-700/30 [&>span]:bg-green-500 dark:[&>span]:bg-green-400"
                  /> */}
                  {/* <CustomSwitch
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => {
                      console.log("Current isPublished:", formData.isPublished);
                      console.log("New value:", checked);
                      handleInputChange("isPublished", checked);
                    }}
                    // className="data-[state=checked]:bg-green-500/30 data-[state=unchecked]:bg-gray-200/30 dark:data-[state=unchecked]:bg-gray-700/30 [&>span]:bg-green-500 dark:[&>span]:bg-green-400"
                  /> */}
                  <CustomSwitch
                    checked={formData.isPublished}
                    color={"green"}
                    disabled={isLoading}
                    onCheckedChange={(checked: boolean) =>
                      handleInputChange("isPublished", checked)
                    }
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
                  {/* <Switch
                    checked={formData.isFree}
                    onCheckedChange={(checked) =>
                      handleInputChange("isFree", checked)
                    }
                    className="data-[state=checked]:bg-blue-500/30 data-[state=unchecked]:bg-gray-200/30 dark:data-[state=unchecked]:bg-gray-700/30 [&>span]:bg-blue-500 dark:[&>span]:bg-blue-400"
                  /> */}
                  <CustomSwitch
                    checked={formData.isFree}
                    color={"blue"}
                    disabled={isLoading}
                    onCheckedChange={(checked: boolean) =>
                      handleInputChange("isFree", checked)
                    }
                  />
                </div>
              </div>
            </div>
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
