// "use client";

// import * as z from "zod";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { Pencil, PlusCircle, ImageIcon, Upload, X } from "lucide-react";
// import Image from "next/image";

// import { Button } from "@/components/ui/button";
// import { Course } from "@/types/course";
// import { dmSans } from "@/lib/config/fonts";
// import { useUpdateCourse } from "@/hooks/useCourses";
// import { supabase } from "@/lib/config/supabase";
// // Adjust path to your Supabase client

// const formSchema = z.object({
//   imageUrl: z.string().min(1, {
//     message: "Image is required",
//   }),
// });

// export const ImageForm = ({ course }: { course: Course }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const toggleEdit = () => setIsEditing((current) => !current);
//   const { mutate: updateCourse } = useUpdateCourse();
//   const router = useRouter();

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       updateCourse(
//         { courseId: course.id, updates: values },
//         {
//           onSuccess: () => {
//             toast.success("Course image updated successfully ✔️");
//             toggleEdit();
//             router.refresh();
//           },
//           onError: (error) => {
//             toast.error(error.message || "Something went wrong ❌");
//           },
//         }
//       );
//     } catch {
//       toast.error("Something went wrong ❌");
//     }
//   };

//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       toast.error("Please upload an image file");
//       return;
//     }

//     // Validate file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Image size should be less than 5MB");
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(0);

//     try {
//       // Generate unique file name
//       const fileExt = file.name.split('.').pop();
//       const fileName = `${course.id}/image-${Date.now()}.${fileExt}`;
//       const filePath = `courses/${fileName}`;

//       // Upload to Supabase Storage
//       const { data, error } = await supabase.storage
//         .from('courses') // Make sure this bucket exists
//         .upload(filePath, file, {
//           cacheControl: '3600',
//           upsert: true,
//           // upsert: true,
//           //   const percent = (progress.loaded / progress.total) * 100;
//           //   setUploadProgress(Math.round(percent));
//           // }
//         });

//       if (error) {
//         throw new Error(`Upload failed: ${error.message}`);
//       }

//       // Get public URL
//       const { data: { publicUrl } } = supabase.storage
//         .from('courses')
//         .getPublicUrl(filePath);

//       // Submit the form with the image URL
//       await onSubmit({ imageUrl: publicUrl });

//     } catch (error: any) {
//       console.error("Upload error:", error);
//       toast.error(error.message || "Failed to upload image");
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//       // Clear the file input
//       event.target.value = '';
//     }
//   };

//   const removeImage = async () => {
//     if (!course.imageUrl) return;

//     try {
//       // Extract file path from URL
//       const urlParts = course.imageUrl.split('/');
//       const fileName = urlParts[urlParts.length - 1];
//       const filePath = `courses/${course.id}/${fileName}`;

//       // Delete from Supabase Storage
//       const { error } = await supabase.storage
//         .from('course-images')
//         .remove([filePath]);

//       if (error) {
//         console.error("Delete error:", error);
//       }

//       // Update course with empty image URL
//       await onSubmit({ imageUrl: '' });

//     } catch (error) {
//       console.error("Remove image error:", error);
//       toast.error("Failed to remove image");
//     }
//   };

//   return (
//     <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
//       <div
//         className={`${dmSans.className} flex items-center justify-between font-medium`}
//       >
//         Course image
//         <Button 
//           onClick={toggleEdit} 
//           variant="outline" 
//           className="rounded-full"
//           disabled={isUploading}
//         >
//           {isEditing && <>Cancel</>}
//           {!isEditing && !course?.imageUrl && (
//             <>
//               <PlusCircle className="h-4 w-4 mr-2" />
//               Add an image
//             </>
//           )}
//           {!isEditing && course?.imageUrl && (
//             <>
//               <Pencil className="h-4 w-4 mr-2" />
//               Edit
//             </>
//           )}
//         </Button>
//       </div>

//       {!isEditing && (
//         <div className="mt-4">
//           {!course?.imageUrl ? (
//             <div className="flex h-60 items-center justify-center rounded-2xl bg-slate-200 dark:bg-zinc-800">
//               <ImageIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
//             </div>
//           ) : (
//             <div className="relative mt-2 aspect-video group">
//               <Image
//                 alt="Course image"
//                 fill
//                 className="rounded-2xl object-cover"
//                 src={course.imageUrl}
//               />
//               {/* Remove image button */}
//               <Button
//                 onClick={removeImage}
//                 variant="destructive"
//                 size="sm"
//                 className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           )}
//         </div>
//       )}

//       {isEditing && (
//         <div className="mt-4">
//           <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center">
//             {isUploading ? (
//               <div className="space-y-3">
//                 <div className="flex justify-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                 </div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Uploading... {uploadProgress}%
//                 </p>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-primary h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                 <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
//                   <label
//                     htmlFor="file-upload"
//                     className="relative cursor-pointer rounded-md bg-white dark:bg-zinc-800 font-medium text-primary hover:text-primary/80 focus-within:outline-none"
//                   >
//                     <span className="px-2">Upload an image</span>
//                     <input
//                       id="file-upload"
//                       name="file-upload"
//                       type="file"
//                       className="sr-only"
//                       accept="image/*"
//                       onChange={handleFileUpload}
//                     />
//                   </label>
//                   <p className="pl-1">or drag and drop</p>
//                 </div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   PNG, JPG, GIF up to 5MB
//                 </p>
//               </>
//             )}
//           </div>
          
//           <div className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
//             16:9 aspect ratio recommended
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

"use client";

import * as z from "zod";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Pencil, PlusCircle, ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { dmSans } from "@/lib/config/fonts";
import { useUpdateCourse } from "@/hooks/useCourses";
import { supabase } from "@/lib/config/supabase";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({ course }: { course: Course }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState(course.imageUrl);

  // Update local state when course prop changes
  useEffect(() => {
    setCurrentImageUrl(course.imageUrl);
  }, [course.imageUrl]);

  const toggleEdit = () => setIsEditing((current) => !current);
  const { mutate: updateCourse } = useUpdateCourse();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      updateCourse(
        { 
          courseId: course.id, 
          updates: values 
        },
        {
          onSuccess: (updatedCourse) => {
            // Update local state immediately
            if (values.imageUrl) {
              setCurrentImageUrl(values.imageUrl);
            }
            toast.success("Course image updated successfully ✔️");
            toggleEdit();
            router.refresh();
          },
          onError: (error) => {
            toast.error(error.message || "Something went wrong ❌");
          },
        }
      );
    } catch {
      toast.error("Something went wrong ❌");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `image-${Date.now()}.${fileExt}`;
      const filePath = `${course.id}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('courses')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('courses')
        .getPublicUrl(filePath);

      console.log("Uploaded image URL:", publicUrl);

      // Submit the form with the image URL
      await onSubmit({ imageUrl: publicUrl });

    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Clear the file input
      event.target.value = '';
    }
  };

  const removeImage = async () => {
    if (!currentImageUrl) return;

    try {
      // Extract file path from URL for deletion
      const url = new URL(currentImageUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.indexOf('courses');
      if (bucketIndex !== -1) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/');
        
        // Delete from Supabase Storage
        const { error } = await supabase.storage
          .from('courses')
          .remove([filePath]);

        if (error) {
          console.error("Delete error:", error);
        }
      }

      // Update course with empty image URL
      await onSubmit({ imageUrl: '' });
      setCurrentImageUrl(''); // Clear local state immediately

    } catch (error) {
      console.error("Remove image error:", error);
      toast.error("Failed to remove image");
    }
  };

  return (
    <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
      <div
        className={`${dmSans.className} flex items-center justify-between font-medium`}
      >
        Course image
        <Button 
          onClick={toggleEdit} 
          variant="outline" 
          className="rounded-full"
          disabled={isUploading}
        >
          {isEditing && <>Cancel</>}
          {!isEditing && !currentImageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && currentImageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4">
          {!currentImageUrl ? (
            <div className="flex h-60 items-center justify-center rounded-2xl bg-slate-200 dark:bg-zinc-800">
              <ImageIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
            </div>
          ) : (
            <div className="relative mt-2 aspect-video group">
              <Image
                alt="Course image"
                fill
                className="rounded-2xl object-cover"
                src={currentImageUrl}
                onError={() => {
                  // Fallback if image fails to load
                  setCurrentImageUrl('');
                }}
              />
              {/* Remove image button */}
              <Button
                onClick={removeImage}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="mt-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center">
            {isUploading ? (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Uploading... {uploadProgress}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white dark:bg-zinc-800 font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                  >
                    <span className="px-2">Upload an image</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
          </div>
          
          {/* Show current image in edit mode for reference */}
          {currentImageUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current image:</p>
              <div className="relative aspect-video max-w-md mx-auto">
                <Image
                  alt="Current course image"
                  fill
                  className="rounded-2xl object-cover"
                  src={currentImageUrl}
                />
              </div>
            </div>
          )}
          
          <div className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};