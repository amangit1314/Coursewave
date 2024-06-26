"use client";

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { Pencil, PlusCircle, Upload, Video as VideoIcon } from "lucide-react";
import Video from "next-video";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, CloudinaryData, MuxData } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { CldUploadButton, CldUploadWidget } from "next-cloudinary";

interface ChapterVideoFormProps {
  chapterWithCloudinaryData: Chapter & {
    cloudinaryData?: CloudinaryData | null;
  };
  instructorId: string;
  // courseId: string;
  // sectionId: string;
  // chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  chapterWithCloudinaryData,
  instructorId,
  // courseId,
  // sectionId,
  // chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/instructor/${instructorId}/dashboard/courses/${chapterWithCloudinaryData.courseId}/sections/${chapterWithCloudinaryData.courseSectionId}/chapters/${chapterWithCloudinaryData.id}`,
        values
      );
      toast.success("Chapter updated successfully ...");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleUpload = (error: any, result: any) => {
    if (error) {
      toast.error(`Error in uploading video: ${error.message}`);
    } else {
      const uploadedUrl = result?.info?.url;
      setVideoUrl(uploadedUrl);
      onSubmit({ videoUrl: uploadedUrl });
      console.log("Uploaded video url: ", videoUrl);
      toast.success("Video successfully uploaded!");
    }
  };

  return (
    <div className="mt-6 md:mt-0 border bg-slate-100 dark:bg-zinc-800 transition-all duration-300 rounded-xl p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}

          {!isEditing && !chapterWithCloudinaryData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}

          {!isEditing && chapterWithCloudinaryData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!chapterWithCloudinaryData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500 rounded-xl overflow-hidden" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            {/* <MuxPlayer
              className="rounded-xl overflow-hidden"
              playbackId={chapterWithCloudinaryData?.muxData?.playbackId || ""}
            /> */}

            <Video className="rounded-xl overflow-hidden" src={videoUrl} />

            {/* <iframe
              className="rounded-xl overflow-hidden"
              src={
                // chapterWithCloudinaryData?.cloudinaryData?.publicId!
                //   ?
                `https://player.cloudinary.com/embed/?cloud_name=df2g8tcxq&public_id=${chapterWithCloudinaryData?.cloudinaryData?.publicId!}`
                // : ``
              }
            /> */}
          </div>
        ))}

      {isEditing && (
        <div>
          {/* <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          /> */}

          <CldUploadWidget
            uploadPreset="coursewave_course_section_chapter_video_uploader"
            onError={(error) => {
              console.log(`Error in uplaoding video: ${error}`);
              toast.error("Error in uplaoding video: ${error.message}");
            }}
            onSuccess={(result) => {
              toast.success("Video successfully uploaded 🎉 ...");
              console.log(
                `Video successfully uploaded, and result: `,
                JSON.stringify(result)
              );
              handleUpload(null, result);
            }}
          >
            {({ open }) => {
              return (
                <button
                  className="cursor-pointer flex justify-center items-center mx-auto text-md text-base tracking-tight group hover:text-blue-700 transition-all duration-300 font-semibold space-y-4"
                  onClick={() => open()}
                >
                  <div className="flex flex-col space-y-4 justify-center items-center align-middle text-center group">
                    <div className="flex justify-center items-center px-8 py-8 border border-white  border-dashed rounded-xl group-hover:border-blue-700 transition-all duration-300">
                      <Upload size={48} />
                    </div>
                    <p>Change video</p>
                  </div>
                </button>
              );
            }}
          </CldUploadWidget>

          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}

      {chapterWithCloudinaryData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
};
