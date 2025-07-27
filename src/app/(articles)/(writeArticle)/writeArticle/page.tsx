// "use client";

// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useUserInfo } from "@/hooks/useUserInfo";
// import { useState } from "react";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import { IoAddCircleOutline } from "react-icons/io5";
// import { AiOutlineVideoCameraAdd } from "react-icons/ai";
// import { RiImageAddFill, RiExternalLinkLine } from "react-icons/ri";
// import { absoluteUrl } from "@/utils/utils";
// import { RichTextEditor } from "./_components/rich_text_editor";
// import { createClient } from "@supabase/supabase-js";
// import ApiManager from "@/lib/api/api-manager";
// // import { RichTextEditor } from "@/components/RichTextEditor"; // Custom editor

// const formSchema = z.object({
//   title: z.string().min(2, "Title is required"),
//   image: z.string().optional(),
//   content: z.string().min(10, "Content is too short"),
// });

// const WriteArticlePage = () => {
//   const router = useRouter();
//   const user = useUserInfo();
//   const userId = user?.user?.id;
//   const [open, setOpen] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       image: "",
//       content: "",
//     },
//   });

//   const { isSubmitting, isValid } = form.formState;

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       // const res = await axios.post(`/api/articles`, {
//       const res = await ApiManager.getInstance().post(
//         `http://localhost:5002/api/articles`,
//         {
//           authorId: userId,
//           title: values.title,
//           content: values.content,
//           estimatedReadingTime: "10 min",
//           thumbnailUrl:
//             values.image ||
//             "https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets/green-3d.jpg",
//         }
//       );
//       toast.success("Article Created successfully");
//       router.push(absoluteUrl("/articles"));
//     } catch (err: any) {
//       toast.error(`Error: ${err.message}`);
//     }
//   };

//   return (
//     <div className="px-4 py-24 md:px-12 max-w-8xl w-full mx-auto">
//       <div className="mb-6 flex items-center gap-2 text-sm text-zinc-800 dark:text-gray-200">
//         <IoMdArrowRoundBack />
//         <p>Back to articles</p>
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           {/* Title */}
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Article Title</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="Enter title"
//                     {...field}
//                     className="bg-transparent"
//                   />
//                 </FormControl>
//                 <FormDescription>
//                   Give your article an engaging title.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Content */}
//           <FormField
//             control={form.control}
//             name="content"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Article Content</FormLabel>
//                 <FormControl>
//                   <div className="rounded-md border dark:border-gray-700 p-4">
//                     <div className="mb-3 flex items-center gap-3">
//                       <button
//                         type="button"
//                         aria-label="Add Media"
//                         onClick={() => setOpen(!open)}
//                       >
//                         <IoAddCircleOutline className="h-6 w-6" />
//                       </button>

//                       {open && (
//                         <div className="flex gap-2">
//                           <button
//                             type="button"
//                             aria-label="Add Image"
//                             className="p-2 rounded-full border hover:bg-blue-100 hover:text-blue-500"
//                             onClick={() => {
//                               const supabase = createClient(
//                                 process.env.NEXT_PUBLIC_SUPABASE_URL!,
//                                 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//                               );

//                               const handleImageUpload = async (
//                                 event: React.ChangeEvent<HTMLInputElement>
//                               ) => {
//                                 if (
//                                   !event.target.files ||
//                                   event.target.files.length === 0
//                                 ) {
//                                   toast.error(
//                                     "Please select an image to upload."
//                                   );
//                                   return;
//                                 }

//                                 const file = event.target.files[0];
//                                 const fileName = `${Date.now()}-${file.name}`;

//                                 try {
//                                   const { data, error } = await supabase.storage
//                                     .from("assets")
//                                     .upload(fileName, file);

//                                   if (error) {
//                                     throw error;
//                                   }

//                                   const { data: publicUrlData } =
//                                     supabase.storage
//                                       .from("assets")
//                                       .getPublicUrl(data.path);

//                                   if (publicUrlData.publicUrl) {
//                                     form.setValue(
//                                       "image",
//                                       publicUrlData.publicUrl
//                                     );
//                                     toast.success(
//                                       "Image uploaded successfully!"
//                                     );
//                                   }
//                                 } catch (err: any) {
//                                   toast.error(
//                                     `Image upload failed: ${err.message}`
//                                   );
//                                 }
//                               };

//                               // Trigger file input click
//                               const triggerFileInput = () => {
//                                 const fileInput =
//                                   document.createElement("input");
//                                 fileInput.type = "file";
//                                 fileInput.accept = "image/*";
//                                 fileInput.onchange = (event) =>
//                                   handleImageUpload(
//                                     event as unknown as React.ChangeEvent<HTMLInputElement>
//                                   );
//                                 fileInput.click();
//                               };

//                               triggerFileInput();
//                             }}
//                           >
//                             <RiImageAddFill size={18} />
//                           </button>
//                           <button
//                             type="button"
//                             aria-label="Add Video"
//                             className="p-2 rounded-full border hover:bg-blue-100 hover:text-blue-500"
//                           >
//                             <AiOutlineVideoCameraAdd size={18} />
//                           </button>
//                           <button
//                             type="button"
//                             aria-label="Add Link"
//                             className="p-2 rounded-full border hover:bg-blue-100 hover:text-blue-500"
//                           >
//                             <RiExternalLinkLine size={18} />
//                           </button>
//                         </div>
//                       )}
//                     </div>

//                     <Controller
//                       name="content"
//                       control={form.control}
//                       render={({ field }) => (
//                         <RichTextEditor
//                           value={field.value}
//                           onChange={field.onChange}
//                         />
//                       )}
//                     />
//                   </div>
//                 </FormControl>
//                 <FormDescription>Share your thoughts here.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Actions */}
//           <div className="flex gap-4 justify-end">
//             <Link href="/articles">
//               <Button type="button" variant="ghost">
//                 Cancel
//               </Button>
//             </Link>
//             <Button type="submit" disabled={!isValid || isSubmitting}>
//               {isSubmitting ? "Publishing..." : "Publish"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default WriteArticlePage;


"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { RiImageAddFill, RiExternalLinkLine, RiEdit2Line } from "react-icons/ri";
import { absoluteUrl } from "@/utils/utils";
import { RichTextEditor } from "./_components/rich_text_editor";
import { createClient } from "@supabase/supabase-js";
import ApiManager from "@/lib/api/api-manager";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  image: z.string().optional(),
  content: z.string().min(10, "Content is too short"),
});

const WriteArticlePage = () => {
  const router = useRouter();
  const user = useUserInfo();
  const userId = user?.user?.id;
  const [open, setOpen] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",
      content: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await ApiManager.getInstance().post(
        `http://localhost:5002/api/articles`,
        {
          authorId: userId,
          title: values.title,
          content: values.content,
          estimatedReadingTime: "10 min",
          thumbnailUrl:
            values.image ||
            "https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets/green-3d.jpg",
        }
      );
      toast.success("Article Created successfully");
      router.push(absoluteUrl("/articles"));
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      toast.error("Please select an image to upload.");
      return;
    }

    const file = event.target.files[0];
    const fileName = `${Date.now()}-${file.name}`;

    try {
      toast.loading("Uploading image...", { id: "imageUpload" });
      
      const { data, error } = await supabase.storage
        .from("assets")
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from("assets")
        .getPublicUrl(data.path);

      if (publicUrlData.publicUrl) {
        form.setValue("image", publicUrlData.publicUrl);
        toast.success("Image uploaded successfully!", { id: "imageUpload" });
      }
    } catch (err: any) {
      toast.error(`Image upload failed: ${err.message}`, { id: "imageUpload" });
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event) =>
      handleImageUpload(event as unknown as React.ChangeEvent<HTMLInputElement>);
    fileInput.click();
  };

  const handleDeleteImage = () => {
    form.setValue("image", "");
    toast.success("Image removed");
  };
  
  const handleVideoSubmit = () => {
    if (!videoUrl) {
      toast.error("Please enter a video URL");
      return;
    }
    
    try {
      // Extract YouTube or Vimeo ID and create embedded HTML
      let embedHtml = '';
      
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        // Handle YouTube
        const videoId = videoUrl.includes('v=') 
          ? videoUrl.split('v=')[1].split('&')[0]
          : videoUrl.split('/').pop();
          
        embedHtml = `<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
      } else if (videoUrl.includes('vimeo.com')) {
        // Handle Vimeo
        const videoId = videoUrl.split('/').pop();
        embedHtml = `<div class="video-container"><iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allowfullscreen></iframe></div>`;
      } else {
        embedHtml = `<div class="video-container"><video controls src="${videoUrl}" width="560" height="315"></video></div>`;
      }
      
      // Insert at cursor position or append to content
      const currentContent = form.getValues("content");
      form.setValue("content", currentContent + embedHtml);
      
      setVideoUrl('');
      setShowVideoInput(false);
      toast.success("Video added successfully");
    } catch (error) {
      toast.error("Failed to add video");
    }
  };
  
  const handleLinkSubmit = () => {
    if (!linkUrl) {
      toast.error("Please enter a URL");
      return;
    }
    
    try {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>`;
      
      // Insert at cursor position or append to content
      const currentContent = form.getValues("content");
      form.setValue("content", currentContent + linkHtml);
      
      setLinkText('');
      setLinkUrl('');
      setShowLinkInput(false);
      toast.success("Link added successfully");
    } catch (error) {
      toast.error("Failed to add link");
    }
  };

  return (
    <div className="px-4 py-24 md:px-12 max-w-8xl w-full mx-auto">
      <div className="mb-6 flex items-center gap-2 text-sm text-zinc-800 dark:text-gray-200">
        <Link href="/articles" className="flex items-center gap-2 hover:underline">
          <IoMdArrowRoundBack />
          <p>Back to articles</p>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Article Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter title"
                    {...field}
                    className="bg-transparent"
                  />
                </FormControl>
                <FormDescription>
                  Give your article an engaging title.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Preview */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {field.value ? (
                      <div className="relative w-full h-56 md:h-80 border rounded-md overflow-hidden">
                        <Image
                          src={field.value}
                          alt="Featured image"
                          className="object-cover"
                          fill
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={triggerFileInput}
                            className="bg-white/80 hover:bg-white"
                          >
                            <RiEdit2Line className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteImage}
                            className="bg-white/80 hover:bg-red-100 text-red-500"
                          >
                            <IoTrashOutline className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={triggerFileInput}
                        className="w-full h-40 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                      >
                        <div className="text-center">
                          <RiImageAddFill className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Click to upload a featured image</p>
                        </div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload an image to appear at the top of your article.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Article Content</FormLabel>
                <FormControl>
                  <div className="rounded-md border dark:border-gray-700 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Add Media"
                        onClick={() => setOpen(!open)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                      >
                        <IoAddCircleOutline className="h-6 w-6" />
                      </button>

                      {open && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            aria-label="Add Image"
                            className="p-2 rounded-full border hover:bg-blue-100 hover:text-blue-500"
                            onClick={triggerFileInput}
                          >
                            <RiImageAddFill size={18} />
                          </button>
                          <button
                            type="button"
                            aria-label="Add Video"
                            className="p-2 rounded-full border hover:bg-blue-100 hover:text-blue-500"
                            onClick={() => {
                              setShowVideoInput(!showVideoInput);
                              setShowLinkInput(false);
                            }}
                          >
                            <AiOutlineVideoCameraAdd size={18} />
                          </button>
                          <button
                            type="button"
                            aria-label="Add Link"
                            className="p-2 rounded-full border hover:bg-blue-100 hover:text-blue-500"
                            onClick={() => {
                              setShowLinkInput(!showLinkInput);
                              setShowVideoInput(false);
                            }}
                          >
                            <RiExternalLinkLine size={18} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Video Input */}
                    {showVideoInput && (
                      <div className="mb-4 p-3 border rounded-md bg-gray-50 dark:bg-zinc-800">
                        <p className="text-sm font-medium mb-2">Add Video</p>
                        <div className="space-y-3">
                          <Input
                            type="text"
                            placeholder="Paste YouTube, Vimeo or direct video URL"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="bg-white dark:bg-zinc-900"
                          />
                          <div className="flex justify-end gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowVideoInput(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="button" 
                              size="sm"
                              onClick={handleVideoSubmit}
                            >
                              Insert Video
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Link Input */}
                    {showLinkInput && (
                      <div className="mb-4 p-3 border rounded-md bg-gray-50 dark:bg-zinc-800">
                        <p className="text-sm font-medium mb-2">Add Link</p>
                        <div className="space-y-3">
                          <Input
                            type="text"
                            placeholder="Link text (optional)"
                            value={linkText}
                            onChange={(e) => setLinkText(e.target.value)}
                            className="bg-white dark:bg-zinc-900"
                          />
                          <Input
                            type="url"
                            placeholder="URL (required)"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="bg-white dark:bg-zinc-900"
                          />
                          <div className="flex justify-end gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowLinkInput(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="button" 
                              size="sm"
                              onClick={handleLinkSubmit}
                            >
                              Insert Link
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <Controller
                      name="content"
                      control={form.control}
                      render={({ field }) => (
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </FormControl>
                <FormDescription>Share your thoughts here.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link href="/articles">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting} className="bg-blue-500 text-white">
              {isSubmitting ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WriteArticlePage;