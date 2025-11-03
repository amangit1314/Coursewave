import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { Input } from "@/components/ui/input";
import { SectionsList } from "./SectionsList";
import { Course } from "@/types/course";
import { Chapter } from "@/types/course-details-api-response";
import { CourseSection } from "@/types/course-details-api-response";
import { dmSans } from "@/lib/config/fonts";
import {
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useCourseSections,
} from "@/hooks/useCourses";

interface SectionsFormProps {
  initialData: Course & { sections: CourseSection[] } & { chapters: Chapter[] };
  course: Course;
  // sections: CourseSection[];
  // chapters: Chapter[];
}

const formSchema = z.object({
  sectionNumber: z.string().min(1, "Section number is required"),
  title: z.string().min(1, "Title is required"),
  sectionDescription: z.string().min(1, "Description is required"),
});

export const SectionsForm = ({
  initialData,
  course,
  // sections,
  // chapters,
}: SectionsFormProps) => {
  const params = useParams();
  const courseId = course.id;

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
    setEditingSectionId(null);
    form.reset();
  };

  const router = useRouter();

  // Use the sections query hook
  const { data: courseSections = [], isLoading: isSectionsLoading } =
    useCourseSections(courseId);

  // Mutation hooks
  const { mutate: createSection, isPending: isCreatingSection } =
    useCreateSection(courseId);
  const { mutate: updateSection, isPending: isUpdatingSection } =
    useUpdateSection(courseId);
  const { mutate: deleteSection, isPending: isDeletingSection } =
    useDeleteSection(courseId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      sectionNumber: "",
      sectionDescription: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // Handle both create and update
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const sectionNumber = Number(values.sectionNumber);

      // Check if we're editing or creating
      if (editingSectionId) {
        // UPDATE EXISTING SECTION
        console.log("🔍 Sending update with:", {
          sectionId: editingSectionId,
          updates: {
            title: values.title,
            position: sectionNumber,
            description: values.sectionDescription,
          },
        });

        updateSection(
          {
            sectionId: editingSectionId,
            updates: {
              title: values.title,
              position: sectionNumber,
              description: values.sectionDescription,
            },
          },
          {
            onSuccess: () => {
              toast.success("Section updated successfully ✔️");
              setEditingSectionId(null);
              setIsCreating(false);
              form.reset();
              router.refresh();
            },
            onError: (error: any) => {
              console.error("Update error:", error);
              toast.error(error.message || "Failed to update section ❌");
            },
          }
        );
      } else {
        // CREATE NEW SECTION
        console.log("🔍 Creating new section with:", {
          title: values.title,
          position: sectionNumber,
          description: values.sectionDescription,
        });

        createSection(
          {
            title: values.title,
            position: sectionNumber,
            description: values.sectionDescription,
          },
          {
            onSuccess: () => {
              toast.success("Section created successfully ✔️");
              setIsCreating(false);
              form.reset();
              router.refresh();
            },
            onError: (error: any) => {
              console.error("Create error:", error);
              toast.error(error.message || "Failed to create section ❌");
            },
          }
        );
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
      toast.error("Something went wrong ❌");
    }
  };

  // Edit section
  const onEdit = (section: CourseSection) => {
    setEditingSectionId(section.id);
    setIsCreating(true);
    form.setValue("title", section.title);
    form.setValue("sectionNumber", section.position?.toString() || "");
    form.setValue("sectionDescription", section.description || "");
  };

  // Delete section
  const onDelete = (sectionId: string) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      deleteSection(sectionId, {
        onSuccess: () => {
          toast.success("Section deleted successfully ✔️");
          router.refresh();
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to delete section ❌");
        },
      });
    }
  };

  // Reorder sections
  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      // Update each section's position
      updateData.forEach(({ id, position }) => {
        updateSection(
          {
            sectionId: id,
            updates: { position },
          },
          {
            onError: (error: any) => {
              toast.error(`Failed to reorder section: ${error.message}`);
            },
          }
        );
      });

      toast.success("Sections reordered successfully ✔️");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to reorder sections ❌");
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel editing/creating
  const cancelEdit = () => {
    setEditingSectionId(null);
    setIsCreating(false);
    form.reset();
  };

  const isPending = isCreatingSection || isUpdatingSection || isDeletingSection;

  return (
    <div className="relative mt-6 w-full rounded-2xl bg-slate-100 p-6 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
      {isUpdating && (
        <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reordering sections...
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3
            className={`${dmSans.className} text-lg font-bold text-gray-900 dark:text-white`}
          >
            Course Sections
          </h3>
          {isSectionsLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          )}
        </div>
        <Button
          onClick={toggleCreating}
          variant="outline"
          className={cn(
            `${dmSans.className} rounded-full border font-medium transition-all duration-200`,
            isCreating
              ? "hover:bg-gray-100 dark:hover:bg-zinc-800"
              : "hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 dark:hover:bg-blue-950/30 dark:hover:border-blue-500 dark:hover:text-blue-400"
          )}
          disabled={isPending}
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a section
            </>
          )}
        </Button>
      </div>

      {(isCreating || editingSectionId) && (
        <div className="mt-6 rounded-xl bg-white dark:bg-zinc-800 p-5 border border-blue-200 dark:border-blue-900/50 shadow-sm">
          <h4
            className={`${dmSans.className} text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4`}
          >
            {editingSectionId ? "Edit Section" : "Create New Section"}
          </h4>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="sectionNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting || isPending}
                        placeholder="Section number (e.g. 1)"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting || isPending}
                        placeholder="Section title (e.g. 'Introduction to the course')"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sectionDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting || isPending}
                        placeholder="Section description"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2 pt-2">
                <Button
                  className={cn(
                    `${dmSans.className} rounded-lg font-medium`,
                    "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  )}
                  type="submit"
                  disabled={!isValid || isPending}
                >
                  {editingSectionId ? "Update Section" : "Create Section"}
                  {(isCreatingSection || isUpdatingSection) && (
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                  disabled={isPending}
                  className="rounded-lg border"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {!isCreating && !editingSectionId && (
        <div
          className={cn("mt-6", !courseSections?.length && "text-center py-8")}
        >
          {!courseSections?.length ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No sections yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Click "Add a section" to create your first section
              </p>
            </div>
          ) : (
            <>
              {/* Sections List */}
              <SectionsList
                course={course}
                // chapters={
                //   course?.sections?.flatMap((s) => s.Chapter || []) || []
                // }
                onEdit={onEdit}
                onDelete={onDelete}
                onReorder={onReorder}
                items={Array.isArray(courseSections) ? courseSections : []}
                isPending={isPending}
              />

              <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
                💡 Tip: Drag and drop to reorder the sections
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
