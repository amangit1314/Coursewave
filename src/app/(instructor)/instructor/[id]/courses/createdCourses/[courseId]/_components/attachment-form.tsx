"use client";

import React from "react";
import { Combobox } from "./category-form";
import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Category, Course, CourseAttachment } from "@prisma/client";
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
import { Pencil, PlusCircle, Loader2, X, File, Tag } from "lucide-react";
import { TbCategory2 } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { Input } from "@/components/ui/input";
import { absoluteUrl } from "@/lib/utils";

const sampleCourseAttachments = [
  "Who wants to learn.",
  "Want to understand concepts of this topic.",
  "If you are a enthusiast of subject.",
];

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
  const [points, setPoints] = useState();

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
          `/api/instructor/${course?.instructorID}/dashboard/courses/${course?.courseId}/attachments`
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

  const onDelete = (index: any) => {
    // const updatedPoints = [...points];
    // updatedPoints.splice(index, 1);
    // setPoints(updatedPoints);
  };

  return (
    <div className="mt-6 border bg-slate-100 dark:bg-zinc-700 rounded-2xl p-4">
      <div className="font-medium flex items-center justify-between mb-2">
        Course Attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a point
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {courseAttachmentsPoints.length === 0 && (
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 italic">
              No attachments yet
            </p>
          )}

          {courseAttachmentsPoints.length > 0 && (
            <div className="space-y-2">
              {/* initialData?.attachments  */}
              {courseAttachmentsPoints.map(
                (attachment: CourseAttachment, index: any) => (
                  <div
                    key={index}
                    className="flex items-center p-3 w-full bg-sky-100 dark:bg-zinc-800 border-sky-200 dark:border-none border text-sky-700 dark:text-gray-100 rounded-xl"
                  >
                    <Pencil className="h-4 w-4 mr-2 flex-shrink-0" />
                    <Link
                      href={attachment.url}
                      className="text-[12px] line-clamp-1"
                    >
                      {attachment.name}
                    </Link>
                    {deletingId === index && (
                      <div>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    )}
                    {deletingId !== index && (
                      <button
                        onClick={() => onDelete(index)}
                        className="ml-auto hover:opacity-75 transition"
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
            className="space-y-4 mt-4"
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
                      className="dark:bg-transparent w-full border-gray-700 dark:border-gray-400"
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
                      className="dark:bg-transparent w-full border-gray-700 dark:border-gray-400"
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
