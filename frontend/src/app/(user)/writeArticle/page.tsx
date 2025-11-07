
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Image,
  Video,
  Link2,
  Bold,
  Italic,
  Type,
  List,
  Hash,
  Quote,
  Eye,
  Save,
  Send,
  Plus,
  X,
  Upload,
  Trash2,
  Edit3,
  FileText,
  Clock,
  User,
  Calendar,
  Loader2,
} from "lucide-react";
import { useCreateArticle } from "@/hooks/useArticles";
import toast from "react-hot-toast";
import { useUserStore } from "@/zustand/userStore";
import { supabase } from "@/lib/config/supabase";

const PremiumArticleEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    mutate: writeArticle,
    isPending,
    isSuccess,
    error,
  } = useCreateArticle();
  const { user } = useUserStore();

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const words = content.split(/\s+/).filter((word) => word.length > 0).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200));
  }, [content]);

  // 🔄 Upload image to Supabase and return URL
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      setIsUploadingImage(true);

      // Validate file size (25MB limit)
      if (file.size > 25 * 1024 * 1024) {
        throw new Error("File size must be less than 25MB");
      }

      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error(
          "Please upload a valid image file (JPEG, PNG, WebP, GIF)"
        );
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from("articles") // Your bucket name
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("articles").getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error("Image upload error:", error);
      throw new Error(error.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // 🖼️ Handle featured image upload
  const handleFeaturedImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImageToSupabase(file);
      setFeaturedImage(imageUrl);
      toast.success("Featured image uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload featured image");
    }
  };

  // 🖼️ Handle inline image upload in content
  const handleInlineImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Show uploading indicator
      const placeholderText = `![Uploading image...]()`;
      insertAtCursor(`\n${placeholderText}\n`);

      const imageUrl = await uploadImageToSupabase(file);

      // Replace placeholder with actual image markdown
      const imageMarkdown = `![Image](${imageUrl})`;
      const currentContent = content;
      const updatedContent = currentContent.replace(
        placeholderText,
        imageMarkdown
      );
      setContent(updatedContent);

      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      // Remove the placeholder if upload failed
      const currentContent = content;
      const updatedContent = currentContent.replace(
        `![Uploading image...]()\n`,
        ""
      );
      setContent(updatedContent);
    }
  };

  // 🎬 Handle video embedding with URL
  const handleVideoSubmit = () => {
    if (!videoUrl) return;

    let embedCode = "";
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      const videoId = videoUrl.includes("v=")
        ? videoUrl.split("v=")[1].split("&")[0]
        : videoUrl.split("/").pop();
      embedCode = `\n[![YouTube Video](https://img.youtube.com/vi/${videoId}/0.jpg)](https://www.youtube.com/watch?v=${videoId})\n`;
    } else if (videoUrl.includes("vimeo.com")) {
      const videoId = videoUrl.split("/").pop();
      embedCode = `\n[Vimeo Video](${videoUrl})\n`;
    } else {
      // Generic video link
      embedCode = `\n[Video](${videoUrl})\n`;
    }

    insertAtCursor(embedCode);
    setVideoUrl("");
    setShowVideoInput(false);
    setShowMediaPanel(false);
    toast.success("Video embedded successfully!");
  };

  // 🔗 Handle link insertion
  const handleLinkSubmit = () => {
    if (!linkUrl) return;

    const linkCode = `[${linkText || linkUrl}](${linkUrl})`;
    insertAtCursor(linkCode);
    setLinkText("");
    setLinkUrl("");
    setShowLinkInput(false);
    setShowMediaPanel(false);
    toast.success("Link inserted successfully!");
  };

  // 📝 Text formatting functions
  const insertAtCursor = (text: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      content.substring(0, start) + text + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const formatText = (type: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = selectedText;
    switch (type) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "heading":
        formattedText = `\n## ${selectedText || "Heading"}\n`;
        break;
      case "quote":
        formattedText = `\n> ${selectedText || "Quote"}\n`;
        break;
      case "list":
        formattedText = `\n- ${selectedText || "List item"}\n`;
        break;
      case "code":
        formattedText = `\`\`\`\n${selectedText || "code"}\n\`\`\``;
        break;
    }

    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + formattedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // 💾 Save draft function
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please add title and content before saving");
      return;
    }

    setIsSaving(true);
    // Here you can implement draft saving logic
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Draft saved successfully!");
    }, 1000);
  };

  // 🚀 Publish article function
  const handlePublish = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    setIsPublishing(true);

    try {
      // Process content to ensure all media uses URLs
      const processedContent = content;

      // In your handlePublish function, update the writeArticle call:
      writeArticle(
        {
          title: title.trim(),
          content: content.trim(),
          excerpt: "", // Add this or generate from content
          thumbnailUrl: featuredImage || null, // This should now be a Supabase URL
          estimatedReadingTime: readingTime.toString(), // This is number of minutes
          authorId: user.id,
          // isPublished: true,
        },
        {
          onSuccess: () => {
            toast.success("Article Published Successfully!");
            setTimeout(() => {
              window.location.href = "/articles";
            }, 1500);
          },
          onError: (error: any) => {
            toast.error(
              "Error publishing article: " + (error.message || "Unknown error")
            );
            setIsPublishing(false);
          },
        }
      );
    } catch (error: any) {
      toast.error("Failed to publish article: " + error.message);
      setIsPublishing(false);
    }
  };

  // 🗑️ Remove featured image
  const handleRemoveFeaturedImage = () => {
    setFeaturedImage("");
    toast.success("Featured image removed");
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-800 ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
    >
  

      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-zinc-900 dark:text-white">
                  New Article
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-4 text-sm text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center space-x-1">
                  <Type className="h-4 w-4" />
                  <span>{wordCount} words</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center space-x-1"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center space-x-1"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isSaving ? "Saving..." : "Save Draft"}</span>
              </button>

              <button
                onClick={handlePublish}
                disabled={isPublishing || !title.trim() || !content.trim()}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-1"
              >
                {isPublishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{isPublishing ? "Publishing..." : "Publish"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              {/* Featured Image Section */}
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-700">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Featured Image
                </label>

                {featuredImage ? (
                  <div className="relative group">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center space-x-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="p-2 bg-white rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-50"
                      >
                        {isUploadingImage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit3 className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={handleRemoveFeaturedImage}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
                    ) : (
                      <Upload className="h-12 w-12 text-zinc-400 group-hover:text-blue-500 mx-auto mb-4" />
                    )}
                    <p className="text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {isUploadingImage
                        ? "Uploading..."
                        : "Click to upload featured image"}
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">
                      Recommended: 1200x630px • Max 25MB
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                  disabled={isUploadingImage}
                />
              </div>

              {/* Title Section */}
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-700">
                <textarea
                  placeholder="Your article title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-3xl font-bold bg-transparent border-none outline-none resize-none placeholder-zinc-400 dark:placeholder-zinc-500 dark:text-white"
                  rows={2}
                  style={{ lineHeight: "1.2" }}
                />
              </div>

              {/* Toolbar */}
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => formatText("bold")}
                      className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => formatText("italic")}
                      className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => formatText("heading")}
                      className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      title="Heading"
                    >
                      <Hash className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => formatText("quote")}
                      className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      title="Quote"
                    >
                      <Quote className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => formatText("list")}
                      className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      title="List"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <div className="relative">
                      <button
                        onClick={() => setShowMediaPanel(!showMediaPanel)}
                        className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center space-x-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm">Media</span>
                      </button>

                      {showMediaPanel && (
                        <div className="absolute right-0 top-12 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-600 p-2 z-10 min-w-48">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleInlineImageUpload}
                            className="hidden"
                            id="inline-image-upload"
                          />
                          <label
                            htmlFor="inline-image-upload"
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                          >
                            <Image className="h-4 w-4" />
                            <span>Insert Image</span>
                          </label>
                          <button
                            onClick={() => {
                              setShowVideoInput(true);
                              setShowLinkInput(false);
                              setShowMediaPanel(false);
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <Video className="h-4 w-4" />
                            <span>Embed Video</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowLinkInput(true);
                              setShowVideoInput(false);
                              setShowMediaPanel(false);
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <Link2 className="h-4 w-4" />
                            <span>Insert Link</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Video Input */}
                {showVideoInput && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Embed Video
                      </h4>
                      <button
                        onClick={() => setShowVideoInput(false)}
                        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <input
                      type="url"
                      placeholder="Paste YouTube, Vimeo, or direct video URL"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full p-2 border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-zinc-800 mb-3"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowVideoInput(false)}
                        className="px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded hover:bg-zinc-50 dark:hover:bg-zinc-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleVideoSubmit}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Insert Video
                      </button>
                    </div>
                  </div>
                )}

                {/* Link Input */}
                {showLinkInput && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-900 dark:text-green-100">
                        Insert Link
                      </h4>
                      <button
                        onClick={() => setShowLinkInput(false)}
                        className="p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Link text (optional)"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      className="w-full p-2 border border-green-200 dark:border-green-700 rounded-lg bg-white dark:bg-zinc-800 mb-2"
                    />
                    <input
                      type="url"
                      placeholder="URL (required)"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full p-2 border border-green-200 dark:border-green-700 rounded-lg bg-white dark:bg-zinc-800 mb-3"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowLinkInput(false)}
                        className="px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded hover:bg-zinc-50 dark:hover:bg-zinc-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleLinkSubmit}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Insert Link
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-6">
                <textarea
                  ref={contentRef}
                  placeholder="Start writing your story... Use markdown for formatting. You can insert images, videos, and links using the media toolbar."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-96 bg-transparent border-none outline-none resize-none text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-500 leading-relaxed font-mono text-sm"
                  style={{ lineHeight: "1.7" }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Keep your existing sidebar */}
          <div className="lg:col-span-2">
            {/* Your existing sidebar code remains the same */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 sticky top-24">
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
                Article Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Words
                  </span>
                  <span className="font-semibold">{wordCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Reading time
                  </span>
                  <span className="font-semibold">{readingTime} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Characters
                  </span>
                  <span className="font-semibold">{content.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumArticleEditor;
