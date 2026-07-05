"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useUserStore } from "@/zustand/userStore";
import { supabase } from "@/lib/config/supabase";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import {
  ArrowLeft,
  Edit3,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { dmSans } from "@/lib/config/fonts";
import { useRouter } from "next/navigation";
import { useCreateArticle } from "@/hooks/useArticles";

// Dynamically import EditorJS and tools on the client only
const EditorJSDynamic = dynamic(
  async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const List = (await import("@editorjs/list")).default;
    const Quote = (await import("@editorjs/quote")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    return function EditorWrapper(props: {
      holder: string;
      data: any;
      onChange: (data: any) => void;
    }) {
      const { holder, data, onChange } = props;
      const instanceRef = useRef<any>(null);

      useEffect(() => {
        let isMounted = true;

        const initEditor = async () => {
          if (!isMounted) return;
          if (instanceRef.current) return;

          const editor = new EditorJS({
            holder,
            autofocus: true,
            placeholder: "Start writing your story...",
            minHeight: 400,
            tools: {
              header: Header,
              list: List,
              quote: Quote,
              embed: Embed,
              image: {
                class: ImageTool,
                config: {
                  uploader: {
                    uploadByFile: async (file: File) => {
                      if (file.size > 25 * 1024 * 1024) {
                        toast.error("File size must be less than 25MB");
                        return { success: 0 };
                      }
                      try {
                        const ext = file.name.split(".").pop();
                        const fileName = `${Math.random()
                          .toString(36)
                          .substring(2)}_${Date.now()}.${ext}`;
                        const filePath = `content/${fileName}`;
                        const { data: uploadData, error } = await supabase.storage
                          .from("articles")
                          .upload(filePath, file, {
                            cacheControl: "3600",
                            upsert: false,
                          });
                        if (error || !uploadData) {
                          toast.error("Image upload failed");
                          return { success: 0 };
                        }
                        const { data: urlData } = supabase.storage
                          .from("articles")
                          .getPublicUrl(filePath);
                        return { success: 1, file: { url: urlData.publicUrl } };
                      } catch (err: any) {
                        toast.error("Image upload failed");
                        return { success: 0 };
                      }
                    },
                  },
                },
              },
            },
            data: data || undefined,
            async onChange(api) {
              const saved = await api.saver.save();
              onChange(saved);
            },
          });

          instanceRef.current = editor;
        };

        initEditor();

        return () => {
          isMounted = false;
          if (instanceRef.current && instanceRef.current.destroy) {
            instanceRef.current.destroy();
            instanceRef.current = null;
          }
        };
      }, [holder]);

      return <div id={holder} className="prose dark:prose-invert min-h-[420px] px-1" />;
    };
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading editor...
      </div>
    ),
  }
);

const PremiumArticleEditor = () => {
  const router = useRouter();
  const { user } = useUserStore();

  const [outputData, setOutputData] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { mutateAsync: createArticle } = useCreateArticle();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFeaturedImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      if (file.size > 25 * 1024 * 1024) {
        throw new Error("File size too large");
      }
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}_${Date.now()}.${file.name.split(".").pop()}`;
      const filePath = `featured/${fileName}`;
      const { data, error } = await supabase.storage
        .from("articles")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (error || !data) throw error || new Error("Upload failed");
      const { data: urlData } = supabase.storage
        .from("articles")
        .getPublicUrl(filePath);
      setFeaturedImage(urlData.publicUrl);
      toast.success("Featured image uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveFeaturedImage = () => {
    setFeaturedImage("");
    toast.success("Featured image removed");
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    setIsSaving(true);
    try {
      await createArticle({
        title: title.trim(),
        content: JSON.stringify(outputData),
        thumbnailUrl: featuredImage || null,
        estimatedReadingTime: `${Math.max(1, Math.ceil((outputData?.blocks?.length ?? 0) / 3))} min`,
        authorId: user.id,
      });
      toast.success("Draft saved!");
    } catch {
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    setIsPublishing(true);
    try {
      await createArticle({
        title: title.trim(),
        content: JSON.stringify(outputData),
        thumbnailUrl: featuredImage || null,
        estimatedReadingTime: `${Math.max(1, Math.ceil((outputData?.blocks?.length ?? 0) / 3))} min`,
        authorId: user.id,
      });
      toast.success("Article Published Successfully!");
      setTimeout(() => {
        router.push("/articles");
      }, 1200);
    } catch (err: any) {
      toast.error(
        "Publish failed" + (err?.message ? `: ${err.message}` : "")
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background fixed inset-0 z-50 overflow-y-auto">
      {/* Header Bar */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex justify-start items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2
              className={`${dmSans.className} font-semibold text-foreground text-xl flex items-center gap-2`}
            >
              New Article
            </h2>
          </div>

          <div className="flex gap-2">
            <ThemeModeToggle />
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`${dmSans.className} px-4 py-1.5 rounded-lg border cursor-pointer border-border hover:bg-muted transition-colors flex items-center space-x-1`}
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing || !title.trim()}
              className={`${dmSans.className} px-4 py-1.5 bg-primary hover:bg-primary/90 cursor-pointer disabled:bg-primary/30 disabled:text-primary-foreground/50 disabled:cursor-not-allowed text-primary-foreground rounded-lg transition-colors flex items-center space-x-1`}
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Editor section */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            {/* Featured Image */}
            <div className="p-6 border-b border-border">
              <label
                className={`${dmSans.className} block text-sm font-medium text-muted-foreground mb-3`}
              >
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
                      className="cursor-pointer p-2 bg-background rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      {isUploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Edit3 className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={handleRemoveFeaturedImage}
                      className="cursor-pointer p-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  {isUploadingImage ? (
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                  ) : (
                    <Upload className="h-12 w-12 text-muted-foreground group-hover:text-primary mx-auto mb-4" />
                  )}
                  <p className="text-muted-foreground group-hover:text-primary">
                    {isUploadingImage
                      ? "Uploading..."
                      : "Click to upload featured image"}
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Recommended: 1200x630px - Max 25MB
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

            {/* Title Input */}
            <div className="p-6 border-b border-border">
              <input
                placeholder="Your article title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-bold bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground text-foreground"
                style={{ lineHeight: "1.2" }}
              />
            </div>

            {/* EditorJS Area */}
            <div className="p-6">
              <EditorJSDynamic
                holder="premium-editor-holder"
                data={outputData}
                onChange={(data) => setOutputData(data)}
              />
            </div>
          </div>
        </div>

        {/* Sidebar section - Article Stats */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sticky top-24">
            <h3
              className={`${dmSans.className} font-semibold text-foreground mb-4`}
            >
              Article Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Title Length
                </span>
                <span className="font-semibold">{title.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Featured image
                </span>
                <span className="font-semibold">
                  {featuredImage ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Content Blocks
                </span>
                <span className="font-semibold">
                  {outputData?.blocks?.length ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumArticleEditor;
