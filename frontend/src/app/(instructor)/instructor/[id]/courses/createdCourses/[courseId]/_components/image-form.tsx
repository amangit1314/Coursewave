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

export const ImageForm = ({ course }: { course: Course }) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `api/instructor/${course.instructorID}/dashboard/courses/${course.courseId}`,
        { newCourseImage: values.imageUrl },
      );
      toast.success("Course image updated ✔️ ...");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong ❌ ...");
    }
  };

  return (
    <div className="mt-6 rounded-2xl border bg-slate-100 p-4 dark:bg-zinc-700">
      <div className="flex items-center justify-between font-medium">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !course?.courseImage && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an image
            </>
          )}
          {!isEditing && course?.courseImage && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!course?.courseImage ? (
          <div className="mt-4 flex h-60 items-center justify-center rounded-2xl bg-slate-200 dark:bg-zinc-800">
            <ImageIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Upload"
              fill
              className="rounded-2xl object-cover"
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
          <div className="mt-4 text-xs text-muted-foreground">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
