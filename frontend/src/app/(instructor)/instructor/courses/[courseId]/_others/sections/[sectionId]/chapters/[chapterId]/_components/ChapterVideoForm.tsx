// "use client";

// import * as z from "zod";
// import axios from "axios";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Chapter, CloudinaryData, MuxData } from "@prisma/client";
// import { Pencil, PlusCircle, Upload, Video as VideoIcon } from "lucide-react";
// import {
//   CldUploadWidget,
//   CloudinaryUploadWidgetResults,
// } from "next-cloudinary";

// interface ChapterVideoFormProps {
//   chapterWithCloudinaryData: Chapter & {
//     cloudinaryData?: CloudinaryData | null;
//   };
//   instructorId: string;
//   courseId: string;
//   sectionId: string;
//   chapterId: string;
// }

// const formSchema = z.object({
//   videoUrl: z.string(),
// });

// export const ChapterVideoForm = ({
//   chapterWithCloudinaryData,
//   instructorId,
//   courseId,
//   sectionId,
//   chapterId,
// }: ChapterVideoFormProps) => {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [videoUrl, setVideoUrl] = useState<string>(
//     chapterWithCloudinaryData?.cloudinaryData?.publicId!,
//   );
//   const toggleEdit = () => setIsEditing((current) => !current);

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       await axios.patch(
//         `/api/instructor/${instructorId}/dashboard/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}`,
//         { videoUrl: values.videoUrl },
//       );
//       toast.success("Chapter updated ✔");
//       toggleEdit();
//       router.refresh();
//     } catch (error: any) {
//       toast.error(`Error in updating chapter: , ${error.message}`);
//     }
//   };

//   const handleUpload = (result: CloudinaryUploadWidgetResults) => {
//     if (result?.event === "success") {
//       // const uploadedUrl = result?.info!;
//       const uploadedUrl = (result.info as any).public_id;
//       console.log("Video upload result: ", uploadedUrl);
//       setVideoUrl(uploadedUrl);
//       onSubmit({ videoUrl: uploadedUrl });
//       toast.success("Video successfully uploaded ✔");
//     } else {
//       toast.error("Error in uploading video 🚧 ...");
//     }
//   };

//   console.log('Video Url in chapter-video-form: ', videoUrl);

//   const getPublicIdFromUrl = (url: string) => {
//     try {
//       const parts = url.split("/");
//       // The public ID is the last part before the file extension
//       const lastPart = parts[parts.length - 1];
//       const publicId = lastPart.split(".")[0]; 
//       return publicId;
//     } catch (error) {
//       console.error("Error extracting public ID from URL:", error);
//       return null;
//     }
//   };

//   const publicId = getPublicIdFromUrl(videoUrl);

//   return (
//     <div className="mt-6 rounded-xl border bg-slate-100 p-4 transition-all duration-300 dark:bg-zinc-800 md:mt-0">
//       <div className="flex items-center justify-between font-medium">
//         <h3 className="font-semibold tracking-tight text-zinc-800 dark:text-white">
//           {" "}
//           Chapter video
//         </h3>
//         <Button
//           onClick={toggleEdit}
//           variant="ghost"
//           className="group hover:bg-white dark:hover:bg-black dark:hover:text-white transition-all duration-100 overflow-hidden"
//         >
//           {isEditing && ( // <div className="text-red-600 bg-red-300 rounded-md px-4 py-2 hover:bg-red-600 hover:text-white border border-stroke border-red-600 hover:border-transparent">Cancel</div>
//             <div className="text-red-600">Cancel</div>
//           )}

//           {!isEditing && !chapterWithCloudinaryData.videoUrl && (
//             <div className="flex items-center justify-end text-zinc-800 group-hover:justify-center dark:text-gray-200">
//               <PlusCircle className="mr-2 h-4 w-4" />
//               <p>Add a video</p>
//             </div>
//           )}

//           {!isEditing && chapterWithCloudinaryData.videoUrl && (
//             <>
//               <Pencil className="mr-2 h-4 w-4" />
//               Edit video
//             </>
//           )}
//         </Button>
//       </div>

//       {!isEditing &&
//         (!chapterWithCloudinaryData.videoUrl ? (
//           <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
//             <VideoIcon className="h-10 w-10 overflow-hidden rounded-xl text-slate-500" />
//           </div>
//         ) : (
          
//           <div className="relative mt-4 flex aspect-video h-60 items-center justify-start rounded-xl">
//             <iframe
//               className="flex h-60 w-[25rem] items-center justify-start overflow-hidden rounded-xl"
//               src={`https://player.cloudinary.com/embed/?cloud_name=${process.env.CLOUDINARY_CLOUD_NAME}&public_id=${publicId}`}
//               // src={videoUrl}
//               allowFullScreen
//               frameBorder="0"
//             />
//           </div>
//         ))}

//       {isEditing && (
//         <div>
//           <CldUploadWidget
//             uploadPreset="coursewave_course_section_chapter_video_uploader"
//             onError={(error) => {
//               console.log(`Error in uplaoding video: ${error}`);
//               toast.error("Error in uploading video: ${error.message}");
//             }}
//             onSuccess={(result) => {
//               handleUpload(result);
//               toast.success("Video successfully uploaded 🎉 ...");
//               console.log(
//                 `Video successfully uploaded, and result: `,
//                 JSON.stringify(result),
//               );
//             }}
//           >
//             {({ open }) => {
//               return (
//                 <button
//                   className="text-md group mx-auto flex cursor-pointer items-center justify-center space-y-4 text-base font-semibold tracking-tight transition-all duration-300 hover:text-blue-700"
//                   onClick={() => open()}
//                 >
//                   <div className="group flex flex-col items-center justify-center space-y-4 text-center align-middle">
//                     <div className="flex items-center justify-center rounded-xl border border-dashed border-white px-8 py-8 transition-all duration-300 group-hover:border-blue-700">
//                       <Upload size={48} />
//                     </div>
//                     <p>Change video</p>
//                   </div>
//                 </button>
//               );
//             }}
//           </CldUploadWidget>

//           <div className="mt-4 text-xs text-muted-foreground">
//             Upload this chapter&apos;s video
//           </div>
//         </div>
//       )}

//       {chapterWithCloudinaryData.videoUrl && !isEditing && (
//         <div className="mt-4 text-xs text-muted-foreground">
//           Videos can take a few minutes to process. Refresh the page if video
//           does not appear.
//         </div>
//       )}
//     </div>
//   );
// };

// ---------------------------------------------------------------------------------------------------

// "use client";

// import * as z from "zod";
// import axios from "axios";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";

// import { Pencil, PlusCircle, Upload, Video as VideoIcon } from "lucide-react";
// import {
//   CldUploadWidget,
//   CloudinaryUploadWidgetResults,
// } from "next-cloudinary";
// import { Chapter } from "@/types/course-details-api-response";

// interface ChapterVideoFormProps {
//   chapterWithCloudinaryData: Chapter & {
//     cloudinaryData?: CloudinaryData | null;
//   };
//   instructorId: string;
//   courseId: string;
//   sectionId: string;
//   chapterId: string;
// }

// const formSchema = z.object({
//   videoUrl: z.string(),
// });

// export const ChapterVideoForm = ({
//   chapterWithCloudinaryData,
//   instructorId,
//   courseId,
//   sectionId,
//   chapterId,
// }: ChapterVideoFormProps) => {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [videoUrl, setVideoUrl] = useState<string>(
//     chapterWithCloudinaryData?.cloudinaryData?.publicId || ""
//   );

//   const toggleEdit = () => setIsEditing((current) => !current);

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       await axios.patch(
//         `/api/instructor/${instructorId}/dashboard/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}`,
//         { videoUrl: values.videoUrl },
//       );
//       toast.success("Chapter updated ✔");
//       toggleEdit();
//       router.refresh();
//     } catch (error: any) {
//       toast.error(`Error in updating chapter: ${error.message}`);
//     }
//   };

//   const handleUpload = (result: CloudinaryUploadWidgetResults) => {
//     if (result?.event === "success") {
//       const uploadedUrl = (result.info as any).public_id;
//       console.log("Video upload result: ", uploadedUrl);
//       setVideoUrl(uploadedUrl);
//       onSubmit({ videoUrl: uploadedUrl });
//       toast.success("Video successfully uploaded ✔");
//     } else {
//       toast.error("Error in uploading video 🚧 ...");
//     }
//   };

//   console.log('Video Url in chapter-video-form: ', videoUrl);

//   const getPublicIdFromUrl = (url: string) => {
//     try {
//       const parts = url.split("/");
//       const lastPart = parts[parts.length - 1];
//       const publicId = lastPart.split(".")[0];
//       return publicId;
//     } catch (error) {
//       console.error("Error extracting public ID from URL:", error);
//       return null;
//     }
//   };

//   const publicId = getPublicIdFromUrl(videoUrl);
//   const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

//   return (
//     <div className="mt-6 rounded-xl border bg-slate-100 p-4 transition-all duration-300 dark:bg-zinc-800 md:mt-0">
//       <div className="flex items-center justify-between font-medium">
//         <h3 className="font-semibold tracking-tight text-zinc-800 dark:text-white">
//           Chapter video
//         </h3>
//         <Button
//           onClick={toggleEdit}
//           variant="ghost"
//           className="group hover:bg-white dark:hover:bg-black dark:hover:text-white transition-all duration-100 overflow-hidden"
//         >
//           {isEditing && (
//             <div className="text-red-600">Cancel</div>
//           )}

//           {!isEditing && !chapterWithCloudinaryData.videoUrl && (
//             <div className="flex items-center justify-end text-zinc-800 group-hover:justify-center dark:text-gray-200">
//               <PlusCircle className="mr-2 h-4 w-4" />
//               <p>Add a video</p>
//             </div>
//           )}

//           {!isEditing && chapterWithCloudinaryData.videoUrl && (
//             <>
//               <Pencil className="mr-2 h-4 w-4" />
//               Edit video
//             </>
//           )}
//         </Button>
//       </div>

//       {!isEditing &&
//         (!chapterWithCloudinaryData.videoUrl ? (
//           <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
//             <VideoIcon className="h-10 w-10 overflow-hidden rounded-xl text-slate-500" />
//           </div>
//         ) : (
//           <div className="relative mt-4 flex aspect-video h-60 items-center justify-start rounded-xl">
//             <iframe
//               className="flex h-60 w-[25rem] items-center justify-start overflow-hidden rounded-xl"
//               src={`https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${publicId}`}
//               allowFullScreen
//               frameBorder="0"
//             />
//           </div>
//         ))}

//       {isEditing && (
//         <div>
//           <CldUploadWidget
//             uploadPreset="coursewave_course_section_chapter_video_uploader"
//             onError={(error) => {
//               console.log(`Error in uploading video: ${error}`);
//               toast.error(`Error in uploading video: ${error}`);
//             }}
//             onSuccess={(result) => {
//               handleUpload(result);
//               toast.success("Video successfully uploaded 🎉 ...");
//               console.log(
//                 `Video successfully uploaded, and result: `,
//                 JSON.stringify(result),
//               );
//             }}
//           >
//             {({ open }) => {
//               return (
//                 <button
//                   className="text-md group mx-auto flex cursor-pointer items-center justify-center space-y-4 text-base font-semibold tracking-tight transition-all duration-300 hover:text-blue-700"
//                   onClick={() => open()}
//                 >
//                   <div className="group flex flex-col items-center justify-center space-y-4 text-center align-middle">
//                     <div className="flex items-center justify-center rounded-xl border border-dashed border-white px-8 py-8 transition-all duration-300 group-hover:border-blue-700">
//                       <Upload size={48} />
//                     </div>
//                     <p>Change video</p>
//                   </div>
//                 </button>
//               );
//             }}
//           </CldUploadWidget>

//           <div className="mt-4 text-xs text-muted-foreground">
//             Upload this chapter&apos;s video
//           </div>
//         </div>
//       )}

//       {chapterWithCloudinaryData.videoUrl && !isEditing && (
//         <div className="mt-4 text-xs text-muted-foreground">
//           Videos can take a few minutes to process. Refresh the page if the video does not appear.
//         </div>
//       )}
//     </div>
//   );
// };
