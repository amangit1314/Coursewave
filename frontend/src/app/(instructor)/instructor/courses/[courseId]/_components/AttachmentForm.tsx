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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  PlusCircle,
  Loader2,
  X,
  FileText,
  ExternalLink,
  Save,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { absoluteUrl } from "@/lib/utils/utils";
import { dmSans } from "@/lib/config/fonts";
import { useAddAttachment, useCourseAttachments, useDeleteAttachment, useUpdateAttachment } from "@/hooks/useCourses";

const formSchema = z.object({
  attachmentName: z.string().min(1, "Attachment name is required"),
  attachmentUrl: z.string().url("Please enter a valid URL"),
});

const editFormSchema = z.object({
  editName: z.string().min(1, "Attachment name is required"),
  editUrl: z.string().url("Please enter a valid URL"),
});

interface CourseAttachment {
  id: string;
  name: string;
  url: string;
  courseId: string;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
}

type AttachmentFormProps = {
  course: Course;
};

export const AttachmentForm = ({ course }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingAttachmentId, setEditingAttachmentId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const {
    data: courseAttachments,
    isLoading,
    error,
    refetch,
  } = useCourseAttachments(course.id);

  const deleteAttachmentMutation = useDeleteAttachment();
  const addAttachmentMutation = useAddAttachment();
  const updateAttachmentMutation = useUpdateAttachment();

  // Main form for adding new attachments
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attachmentName: "",
      attachmentUrl: "",
    },
  });

  // Edit form for updating existing attachments
  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
  });

  const { isValid: isAddFormValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addAttachmentMutation.mutateAsync(
        {
          courseId: course.id,
          attachmentData: {
            name: values.attachmentName,
            url: values.attachmentUrl,
          },
        },
        {
          onSuccess: () => {
            toast.success("Course resource added successfully ✔️");
            form.reset();
            refetch();
            toggleEdit();
            router.refresh();
          },
          onError: (error: any) => {
            console.error("Error adding attachment:", error);
            toast.error(error.message || "Something went wrong ❌");
          },
        }
      );
    } catch (error: any) {
      console.error("Error adding attachment:", error);
      toast.error(error.message || "Failed to add resource ❌");
    }
  };

  const onDelete = async (attachmentId: string) => {
    try {
      await deleteAttachmentMutation.mutateAsync({
        courseId: course.id,
        attachmentId,
      });
      toast.success("Attachment deleted successfully ✔️");
      refetch();
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting attachment:", error);
      toast.error(error.message || "Failed to delete attachment ❌");
    }
  };

  const startEditing = (attachment: CourseAttachment) => {
    setEditingAttachmentId(attachment.id);
    editForm.reset({
      editName: attachment.name,
      editUrl: attachment.url,
    });
  };

  const cancelEditing = () => {
    setEditingAttachmentId(null);
    editForm.reset();
  };

  const onEditSubmit = async (values: z.infer<typeof editFormSchema>, attachmentId: string) => {
    try {
      await updateAttachmentMutation.mutateAsync(
        {
          courseId: course.id,
          attachmentId,
          attachmentData: {
            name: values.editName,
            url: values.editUrl,
          },
        },
        {
          onSuccess: () => {
            toast.success("Attachment updated successfully ✔️");
            setEditingAttachmentId(null);
            refetch();
            router.refresh();
          },
          onError: (error: any) => {
            console.error("Error updating attachment:", error);
            toast.error(error.message || "Failed to update attachment ❌");
          },
        }
      );
    } catch (error: any) {
      console.error("Error updating attachment:", error);
      toast.error(error.message || "Failed to update attachment ❌");
    }
  };

  const handleAttachmentClick = (attachment: CourseAttachment) => {
    // Open attachment in new tab
    window.open(attachment.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
      <div
        className={`${dmSans.className} flex items-center justify-between font-medium`}
      >
        Course Resources & Attachments
        <span className="w-1 h-1"> </span>
        <Button 
          onClick={toggleEdit} 
          variant="outline" 
          className="rounded-full"
          disabled={deleteAttachmentMutation.isPending || addAttachmentMutation.isPending || updateAttachmentMutation.isPending}
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Add Resource
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4">
          {isLoading && (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex w-full items-center rounded-xl border border-sky-200 bg-sky-100 p-3 text-sky-700 dark:border-none dark:bg-zinc-800 dark:text-gray-100 animate-pulse"
                >
                  <div className="mr-2 h-4 w-4 flex-shrink-0 rounded bg-gray-300 dark:bg-gray-600" />
                  <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              Failed to load attachments. Please try again later.
            </div>
          )}

          {!isLoading && !error && (
            <>
              {courseAttachments?.length === 0 && (
                <div className="flex h-20 items-center justify-center rounded-2xl bg-slate-200 dark:bg-zinc-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No resources added yet
                  </p>
                </div>
              )}

              {courseAttachments && courseAttachments.length > 0 && (
                <div className="space-y-2">
                  {courseAttachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="group flex w-full items-center rounded-xl border border-sky-200 bg-sky-100 p-3 text-sky-700 transition-all hover:bg-sky-200 dark:border-none dark:bg-zinc-800 dark:text-gray-100 dark:hover:bg-zinc-700"
                    >
                      <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                      
                      {editingAttachmentId === attachment.id ? (
                        // Edit Mode
                        <Form {...editForm}>
                          <form 
                            onSubmit={editForm.handleSubmit((values) => onEditSubmit(values, attachment.id))}
                            className="flex flex-1 items-center space-x-2"
                          >
                            <FormField
                              control={editForm.control}
                              name="editName"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      className="h-8 text-[12px] border-gray-300 dark:border-gray-600 dark:bg-zinc-700"
                                      placeholder="Resource name"
                                      {...field}
                                      disabled={updateAttachmentMutation.isPending}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={editForm.control}
                              name="editUrl"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      className="h-8 text-[12px] border-gray-300 dark:border-gray-600 dark:bg-zinc-700"
                                      placeholder="Resource URL"
                                      {...field}
                                      disabled={updateAttachmentMutation.isPending}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <div className="flex space-x-1">
                              <Button
                                type="submit"
                                size="sm"
                                className="h-8 px-2"
                                disabled={updateAttachmentMutation.isPending}
                              >
                                {updateAttachmentMutation.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Save className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-8 px-2"
                                onClick={cancelEditing}
                                disabled={updateAttachmentMutation.isPending}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </form>
                        </Form>
                      ) : (
                        // View Mode
                        <>
                          <button
                            onClick={() => handleAttachmentClick(attachment as CourseAttachment)}
                            className="flex flex-1 items-center text-left text-[12px] hover:underline"
                          >
                            <span className="line-clamp-1">{attachment.name}</span>
                            <ExternalLink className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                          </button>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => startEditing(attachment as CourseAttachment)}
                              className="transition hover:opacity-75"
                              disabled={deleteAttachmentMutation.isPending || updateAttachmentMutation.isPending}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {deleteAttachmentMutation.isPending &&
                            deleteAttachmentMutation.variables?.attachmentId ===
                              attachment.id ? (
                              <div className="ml-1">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            ) : (
                              <button
                                onClick={() => onDelete(attachment.id)}
                                className="transition hover:opacity-75"
                                disabled={deleteAttachmentMutation.isPending || updateAttachmentMutation.isPending}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="attachmentName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full border-gray-700 dark:border-gray-400 dark:bg-zinc-800 text-sm"
                      type="text"
                      placeholder="Enter resource name (e.g., 'Course Slides', 'E-book PDF')"
                      {...field}
                      disabled={addAttachmentMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachmentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full border-gray-700 dark:border-gray-400 dark:bg-zinc-800 text-sm"
                      type="url"
                      placeholder="Enter resource URL (https://...)"
                      {...field}
                      disabled={addAttachmentMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Help Text */}
            {/* /**
            PDFs, Google Drive
                links, Dropbox files, YouTube videos, articles, documentation,
                etc */}
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 <strong>Supported Resources:</strong> Links only.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={toggleEdit}
                disabled={addAttachmentMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="dark:bg-zinc-800 dark:text-white"
                disabled={!isAddFormValid || addAttachmentMutation.isPending}
              >
                {addAttachmentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Resource"
                )}
              </Button>
            </div>

            {/* Current Attachments Preview */}
            {courseAttachments && courseAttachments.length > 0 && (
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Resources ({courseAttachments.length}):
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {courseAttachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-600 dark:bg-zinc-800"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3 w-3 flex-shrink-0" />
                        <span className="line-clamp-1 text-xs">
                          {attachment.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </Form>
      )}
    </div>
  );
};