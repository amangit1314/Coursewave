"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import "@uploadthing/react/styles.css";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({ course }: {course: Course}) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `api/instructor/${course.instructorID}/dashboard/courses/${course.courseId}`,
        { newCourseImage : values.imageUrl}
      );
      toast.success("Course image updated ✔️ ...");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong ❌ ...");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 dark:bg-zinc-700 rounded-2xl p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !course?.courseImage && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && course?.courseImage && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!course?.courseImage ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 mt-4 dark:bg-zinc-800 rounded-2xl">
            <ImageIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-2xl"
              src={course?.courseImage}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImageUpdater"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
