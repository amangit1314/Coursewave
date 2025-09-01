"use client";

import React from "react";
import Link from "next/link";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";

interface CourseAttachment {
  id: string;
  name: string;
  url: string;
  courseId: string;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
}
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { absoluteUrl } from "@/lib/utils/utils";

const formSchema = z.object({
  attachmentName: z.string(),
  attachmentUrl: z.string(),
  // courseAttachments: z.object({ name: z.string(), url: z.string() }).array(),
});

type AttachmentFormProps = {
  course: Course;
  courseAttachmentsPoints: CourseAttachment[];
};

export const AttachmentForm = ({
  course,
  courseAttachmentsPoints,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attachmentName: "",
      attachmentUrl: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // const newAttachments = values.courseAttachments.map((attachment) => ({
      //   name: attachment.name,
      //   url: attachment.url || "", // Set empty string for optional URL
      //   instructorId: course?.instructorID,
      //   courseId: course?.courseId,
      // }));

      await axios.post(
        absoluteUrl(
          `api/instructor/${course?.instructorId}/dashboard/courses/${course?.id}/attachments`
        ),
        {
          resourceName: values.attachmentName,
          resourceUrl: values.attachmentUrl,
        }
      );
      toast.success("Course courseAttachments updated ...");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = (attachmentId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete attachment:", attachmentId);
  };

  return (
    <div className="mt-6 rounded-2xl border bg-slate-100 p-4 dark:bg-zinc-700">
      <div className="mb-2 flex items-center justify-between font-medium">
        Course Attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a point
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {courseAttachmentsPoints.length === 0 && (
            <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
              No attachments yet
            </p>
          )}

          {courseAttachmentsPoints.length > 0 && (
            <div className="space-y-2">
              {/* initialData?.attachments  */}
              {courseAttachmentsPoints.map(
                (attachment: CourseAttachment, index: number) => (
                  <div
                    key={index}
                    className="flex w-full items-center rounded-xl border border-sky-200 bg-sky-100 p-3 text-sky-700 dark:border-none dark:bg-zinc-800 dark:text-gray-100"
                  >
                    <Pencil className="mr-2 h-4 w-4 flex-shrink-0" />
                    <Link
                      href={attachment.url}
                      className="line-clamp-1 text-[12px]"
                    >
                      {attachment.name}
                    </Link>
                    {deletingId === attachment.id && (
                      <div>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    )}
                    {deletingId !== attachment.id && (
                      <button
                        onClick={() => onDelete(attachment.id)}
                        className="ml-auto transition hover:opacity-75"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={() => form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            {/* <FormField
              control={form.control}
              name="attachmentName"
              render={({ field }) => (
                // <FormItem>
                //   <FormControl>

                //     <Input
                //       className="dark:bg-transparent w-full border-gray-700 dark:border-gray-400  "
                //       type="text"
                //       placeholder="i.e. Next.js, Flutter etc ..."

                //       {...field}
                //     />
                //   </FormControl>
                //   <FormDescription>
                //     Add course categories here, Saperate categories with ,
                //   </FormDescription>
                // </FormItem>

                // <>
                //   {field.value.map((attachment, index) => (
                //     <FormItem key={index}>
                //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                //         <FormControl>
                //           <Input
                //             className="dark:bg-transparent w-full border-gray-700 dark:border-gray-400"
                //             type="text"
                //             placeholder="Attachment Name"
                //             {...field.at(index).field("name")}
                //           />
                //         </FormControl>
                //         <FormControl>
                //           <Input
                //             className="dark:bg-transparent w-full border-gray-700 dark:border-gray-400"
                //             type="url"
                //             placeholder="Attachment URL (optional)"
                //             {...field.at(index).field("url")}
                //           />
                //         </FormControl>
                //       </div>
                //     </FormItem>
                //   ))}

                //   <Button
                //     onClick={() => field.push({ name: "", url: "" })}
                //     variant="ghost"
                //   >
                //     <PlusCircle className="h-4 w-4 mr-2" /> Add Another
                //     Attachment
                //   </Button>
                // </>
              )}
            /> */}

            <FormField
              control={form.control}
              name="attachmentName"
              render={({ field }) => (
                <div>
                  <FormControl>
                    <Input
                      className="w-full border-gray-700 dark:border-gray-400 dark:bg-transparent"
                      type="text"
                      placeholder="Attachment Name"
                      {...field}
                    />
                  </FormControl>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="attachmentUrl"
              render={({ field }) => (
                <div>
                  <FormControl>
                    <Input
                      className="w-full border-gray-700 dark:border-gray-400 dark:bg-transparent"
                      type="text"
                      placeholder="Attachment url"
                      {...field}
                    />
                  </FormControl>
                </div>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button
                className="dark:bg-zinc-800 dark:text-white"
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
