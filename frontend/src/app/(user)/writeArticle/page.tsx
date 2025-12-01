// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import EditorJS from "@editorjs/editorjs";
// import Header from "@editorjs/header";
// import List from "@editorjs/list";
// import Quote from "@editorjs/quote";
// import Embed from "@editorjs/embed";
// import ImageTool from "@editorjs/image";
// import toast from "react-hot-toast";
// import { useUserStore } from "@/zustand/userStore";
// import { supabase } from "@/lib/config/supabase";
// import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
// import {
//   ArrowLeft,
//   Clock,
//   Edit3,
//   Eye,
//   FileText,
//   Loader2,
//   Save,
//   Send,
//   Trash2,
//   Type,
//   Upload,
// } from "lucide-react";
// import { dmSans } from "@/lib/config/fonts";
// import { useRouter } from "next/navigation";

// // Keep EditorJS instance to avoid duplicate instances on re-render
// let ejInstance: EditorJS | null = null;

// const PremiumArticleEditor = () => {
//   // ----- State -----
//   // const [title, setTitle] = useState("");
//   // const [featuredImage, setFeaturedImage] = useState("");

//   // const [isSaving, setIsSaving] = useState(false);
//   // const [isPublishing, setIsPublishing] = useState(false);

//   // const [isUploadingImage, setIsUploadingImage] = useState(false);

//   const [isUploadingFeat, setIsUploadingFeat] = useState(false);
//   const [outputData, setOutputData] = useState<any>(null);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [featuredImage, setFeaturedImage] = useState("");
//   const [wordCount, setWordCount] = useState(0);
//   const [readingTime, setReadingTime] = useState(0);
//   const [showPreview, setShowPreview] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isPublishing, setIsPublishing] = useState(false);
//   const [isUploadingImage, setIsUploadingImage] = useState(false);

//   // --
//   const router = useRouter();
//   const { user } = useUserStore();

//   // Ref for EditorJS holder
//   const editorRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  

//   // ----- EditorJS Init -----
//   useEffect(() => {
//     if (!editorRef.current) return;

//     // Reset any prior instance
//     if (ejInstance) ejInstance.destroy();

//     ejInstance = new EditorJS({
//       holder: editorRef.current,
//       autofocus: true,
//       placeholder: "Start writing your story...",
//       minHeight: 400,
//       tools: {
//         header: Header,
//         list: List,
//         quote: Quote,
//         embed: Embed,
//         image: {
//           class: ImageTool,
//           config: {
//             uploader: {
//               uploadByFile: async (file: File) => {
//                 // Supabase upload logic (inline images)
//                 if (file.size > 25 * 1024 * 1024) {
//                   toast.error("File size must be less than 25MB");
//                   return { success: 0 };
//                 }
//                 try {
//                   const ext = file.name.split(".").pop();
//                   const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${ext}`;
//                   const filePath = `content/${fileName}`;
//                   const { data, error } = await supabase.storage
//                     .from("articles")
//                     .upload(filePath, file, {
//                       cacheControl: "3600",
//                       upsert: false,
//                     });
//                   if (error || !data) {
//                     toast.error("Image upload failed");
//                     return { success: 0 };
//                   }
//                   const { data: urlData } = supabase.storage
//                     .from("articles")
//                     .getPublicUrl(filePath);
//                   return { success: 1, file: { url: urlData.publicUrl } };
//                 } catch (err: any) {
//                   toast.error("Image upload failed");
//                   return { success: 0 };
//                 }
//               },
//             },
//           },
//         },
//       },
//       onChange: async () => {
//         const data = await ejInstance?.save();
//         setOutputData(data);
//       },
//       data: outputData || undefined, // Can hydrate from draft
//     });

//     return () => {
//       ejInstance?.destroy?.();
//       ejInstance = null;
//     };
//     // Mount only!
//     // eslint-disable-next-line
//   }, []);

//   // ----- Featured Image Upload -----
//   const handleFeaturedImageUpload = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setIsUploadingFeat(true);
//     try {
//       if (file.size > 25 * 1024 * 1024) throw new Error("File size too large");
//       const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${file.name.split(".").pop()}`;
//       const filePath = `featured/${fileName}`;
//       const { data, error } = await supabase.storage
//         .from("articles")
//         .upload(filePath, file, { cacheControl: "3600", upsert: false });
//       setIsUploadingFeat(false);
//       if (error || !data) throw error || new Error("Upload failed");
//       const { data: urlData } = supabase.storage
//         .from("articles")
//         .getPublicUrl(filePath);
//       setFeaturedImage(urlData.publicUrl);
//       toast.success("Featured image uploaded!");
//     } catch (err: any) {
//       setIsUploadingFeat(false);
//       toast.error(err.message || "Upload failed");
//     }
//   };

//   // Remove featured image
//   const handleRemoveFeaturedImage = () => {
//     setFeaturedImage("");
//     toast.success("Featured image removed");
//   };

//   // ----- Save Draft -----
//   const handleSave = async () => {
//     if (!ejInstance) return;
//     setIsSaving(true);
//     try {
//       const data = await ejInstance.save();
//       setOutputData(data); // For live preview/draft
//       // Integrate with your save API/storage here
//       toast.success("Draft saved!");
//     } catch {
//       toast.error("Failed to save draft");
//     }
//     setIsSaving(false);
//   };

//   // ----- Publish -----
//   const handlePublish = async () => {
//     if (!ejInstance) return;
//     if (!user?.id) {
//       toast.error("User not authenticated");
//       return;
//     }
//     if (!title.trim()) {
//       toast.error("Please enter a title");
//       return;
//     }
//     setIsPublishing(true);
//     try {
//       const data = await ejInstance.save();
//       // Replace with your real publish API:
//       // send {title, content: JSON.stringify(data), thumbnailUrl:featuredImage, userId:user.id, ...}
//       toast.success("Article Published Successfully!");
//       setTimeout(() => {
//         router.push("/articles");
//       }, 1200);
//     } catch (err: any) {
//       toast.error("Publish failed" + (err.message ? `: ${err.message}` : ""));
//     }
//     setIsPublishing(false);
//   };

//   // ----- Responsive UI -----
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-800 fixed inset-0 z-50 overflow-y-auto">
//       {/* Header Bar */}
//       <div className="border-b border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex justify-start items-center space-x-4">
//             <button
//               onClick={() => window.history.back()}
//               className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
//             >
//               <ArrowLeft className="h-5 w-5" />
//             </button>
//             <h2
//               className={`${dmSans.className} font-semibold text-zinc-900 dark:text-white text-xl flex items-center gap-2`}
//             >
//               New Article
//             </h2>
//           </div>

//           <div className="flex gap-2">
//             <ThemeModeToggle />
//             <button
//               onClick={handleSave}
//               disabled={isSaving}
//               className={`${dmSans.className} px-4 py-1.5 rounded-lg border cursor-pointer border-gray-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center space-x-1`}
//             >
//               {isSaving ? "Saving..." : "Save Draft"}
//             </button>
//             <button
//               onClick={handlePublish}
//               disabled={isPublishing || !title.trim()}
//               className={`${dmSans.className} px-4 py-1.5 bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:bg-blue-100 disabled:dark:bg-blue-50 disabled:text-gray-200 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-1`}
//             >
//               {isPublishing ? "Publishing..." : "Publish"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* <div className="border-b border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => window.history.back()}
//                 className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
//               >
//                 <ArrowLeft className="h-5 w-5" />
//               </button>
//               <div className="flex items-center space-x-2">
//                 <FileText className="h-5 w-5 text-blue-600" />
//                 <span className="font-semibold text-zinc-900 dark:text-white">
//                   New Article
//                 </span>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <div className="hidden md:flex items-center space-x-4 text-sm text-zinc-500 dark:text-zinc-400">
//                 <div className="flex items-center space-x-1">
//                   <Type className="h-4 w-4" />
//                   <span>{wordCount} words</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <Clock className="h-4 w-4" />
//                   <span>{readingTime} min read</span>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setShowPreview(!showPreview)}
//                 className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center space-x-1"
//               >
//                 <Eye className="h-4 w-4" />
//                 <span className="hidden sm:inline">Preview</span>
//               </button>

//               <button
//                 onClick={handleSave}
//                 disabled={isSaving}
//                 className="px-4 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center space-x-1"
//               >
//                 {isSaving ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Save className="h-4 w-4" />
//                 )}
//                 <span>{isSaving ? "Saving..." : "Save Draft"}</span>
//               </button>

//               <button
//                 onClick={handlePublish}
//                 disabled={isPublishing || !title.trim() || !content.trim()}
//                 className=" cursor-pointer px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-1"
//               >
//                 {isPublishing ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Send className="h-4 w-4" />
//                 )}
//                 <span>{isPublishing ? "Publishing..." : "Publish"}</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div> */}

//       <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
//         {/* Main Editor section */}
//         <div className="lg:col-span-3">
//           <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
//             {/* Featured Image */}
//             {/* <div className="p-6 border-b border-zinc-100 dark:border-zinc-700">
//               <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
//                 Featured Image
//               </label>
//               {featuredImage ? (
//                 <div className="relative group">
//                   <img
//                     src={featuredImage}
//                     alt="Featured"
//                     className="w-full h-64 object-cover rounded-xl"
//                   />
//                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
//                     <button
//                       onClick={handleRemoveFeaturedImage}
//                       className="cursor-pointer p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFeaturedImageUpload}
//                   disabled={isUploadingFeat}
//                   className="block"
//                 />
//               )}
//               <p className="text-sm text-zinc-400 mt-1">
//                 Recommended: 1200x630px • Max 25MB
//               </p>
//             </div> */}

//             <div className="p-6 border-b border-zinc-100 dark:border-zinc-700">
//               <label
//                 className={`${dmSans.className} block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3`}
//               >
//                 Featured Image
//               </label>

//               {featuredImage ? (
//                 <div className="relative group">
//                   <img
//                     src={featuredImage}
//                     alt="Featured"
//                     className="w-full h-64 object-cover rounded-xl"
//                   />
//                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center space-x-3">
//                     <button
//                       onClick={() => fileInputRef.current?.click()}
//                       disabled={isUploadingImage}
//                       className="cursor-pointer p-2 bg-white rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-50"
//                     >
//                       {isUploadingImage ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <Edit3 className="h-4 w-4" />
//                       )}
//                     </button>
//                     <button
//                       onClick={handleRemoveFeaturedImage}
//                       className="cursor-pointer p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div
//                   onClick={() => fileInputRef.current?.click()}
//                   className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
//                 >
//                   {isUploadingImage ? (
//                     <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
//                   ) : (
//                     <Upload className="h-12 w-12 text-zinc-400 group-hover:text-blue-500 mx-auto mb-4" />
//                   )}
//                   <p className="text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
//                     {isUploadingImage
//                       ? "Uploading..."
//                       : "Click to upload featured image"}
//                   </p>
//                   <p className="text-sm text-zinc-400 mt-1">
//                     Recommended: 1200x630px • Max 25MB
//                   </p>
//                 </div>
//               )}

//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFeaturedImageUpload}
//                 className="hidden"
//                 disabled={isUploadingImage}
//               />
//             </div>

//             {/* Title Input */}
//             <div className="p-6 border-b border-zinc-100 dark:border-zinc-700">
//               <input
//                 placeholder="Your article title..."
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full text-3xl font-bold bg-transparent border-none outline-none resize-none placeholder-zinc-400 dark:placeholder-zinc-500 dark:text-white"
//                 style={{ lineHeight: "1.2" }}
//               />
//             </div>

//             {/* Editor.js Block Editing Area */}
//             <div className="p-6">
//               {/* Editor.js attaches in this container */}
//               <div
//                 ref={editorRef}
//                 className="prose dark:prose-invert min-h-[420px] px-1"
//                 style={{
//                   background: "transparent",
//                   color: "inherit",
//                   fontFamily: "inherit",
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Sidebar section - Article Stats */}
//         <div className="lg:col-span-2">
//           <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 sticky top-24">
//             <h3
//               className={`${dmSans.className} font-semibold text-zinc-900 dark:text-white mb-4`}
//             >
//               Article Stats
//             </h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-zinc-600 dark:text-zinc-400">
//                   Title Length
//                 </span>
//                 <span className="font-semibold">{title.length}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-zinc-600 dark:text-zinc-400">
//                   Featured image
//                 </span>
//                 <span className="font-semibold">
//                   {featuredImage ? "Yes" : "No"}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-zinc-600 dark:text-zinc-400">
//                   Content Blocks
//                 </span>
//                 <span className="font-semibold">
//                   {outputData?.blocks?.length ?? 0}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PremiumArticleEditor;

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
      <div className="flex items-center justify-center min-h-[200px] text-zinc-500">
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
    setIsSaving(true);
    try {
      // Here you would call your API to save as draft
      // data: outputData
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
      // Replace with your publish API
      // send { title, content: JSON.stringify(outputData), thumbnailUrl: featuredImage, userId: user.id }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-800 fixed inset-0 z-50 overflow-y-auto">
      {/* Header Bar */}
      <div className="border-b border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex justify-start items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2
              className={`${dmSans.className} font-semibold text-zinc-900 dark:text-white text-xl flex items-center gap-2`}
            >
              New Article
            </h2>
          </div>

          <div className="flex gap-2">
            <ThemeModeToggle />
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`${dmSans.className} px-4 py-1.5 rounded-lg border cursor-pointer border-gray-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center space-x-1`}
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing || !title.trim()}
              className={`${dmSans.className} px-4 py-1.5 bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:bg-blue-100 disabled:dark:bg-blue-50 disabled:text-gray-200 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-1`}
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Editor section */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {/* Featured Image */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-700">
              <label
                className={`${dmSans.className} block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3`}
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
                      className="cursor-pointer p-2 bg-white rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-50"
                    >
                      {isUploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Edit3 className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={handleRemoveFeaturedImage}
                      className="cursor-pointer p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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

            {/* Title Input */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-700">
              <input
                placeholder="Your article title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-bold bg-transparent border-none outline-none resize-none placeholder-zinc-400 dark:placeholder-zinc-500 dark:text-white"
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
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 sticky top-24">
            <h3
              className={`${dmSans.className} font-semibold text-zinc-900 dark:text-white mb-4`}
            >
              Article Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Title Length
                </span>
                <span className="font-semibold">{title.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Featured image
                </span>
                <span className="font-semibold">
                  {featuredImage ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
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
