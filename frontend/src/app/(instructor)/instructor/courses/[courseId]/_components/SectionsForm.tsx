// "use client";

// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Loader2, Pencil, PlusCircle } from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useParams, useRouter } from "next/navigation";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils/utils";
// import { Input } from "@/components/ui/input";
// import { SectionsList } from "./SectionsList";
// import { Course } from "@/types/course";
// import { Chapter } from "@/types/course-details-api-response";
// import { CourseSection } from "@/types/course-details-api-response";
// import { dmSans } from "@/lib/config/fonts";
// import {
//   useCreateSection,
//   useUpdateSection,
//   useDeleteSection,
//   useCourseSections,
// } from "@/hooks/useCourses";

// interface SectionsFormProps {
//   initialData: Course & { sections: CourseSection[] } & { chapters: Chapter[] };
//   course: Course;
//   sections: CourseSection[];
//   chapters: Chapter[];
// }

// const formSchema = z.object({
//   sectionNumber: z.string().min(1, "Section number is required"),
//   title: z.string().min(1, "Title is required"),
//   sectionDescription: z.string().min(1, "Description is required"),
// });

// export const SectionsForm = ({
//   initialData,
//   course,
//   sections,
//   chapters,
// }: SectionsFormProps) => {
//   const params = useParams();
//   const courseId = course.id;

//   const [isCreating, setIsCreating] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

//   const toggleCreating = () => {
//     setIsCreating((current) => !current);
//     form.reset();
//   };

//   const router = useRouter();

//   // Use the sections query hook
//   const { data: courseSections = [], isLoading: isSectionsLoading } =
//     useCourseSections(courseId);

//   // Mutation hooks
//   const { mutate: createSection, isPending: isCreatingSection } =
//     useCreateSection(courseId);
//   const { mutate: updateSection, isPending: isUpdatingSection } =
//     useUpdateSection(courseId);
//   const { mutate: deleteSection, isPending: isDeletingSection } =
//     useDeleteSection(courseId);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       sectionNumber: "",
//       sectionDescription: "",
//     },
//   });

//   const { isSubmitting, isValid } = form.formState;

//   // Create new section  In your SectionsForm onSubmit
//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       const sectionNumber = Number(values.sectionNumber);

//       console.log("🔍 Sending update with:", {
//         sectionId: editingSectionId,
//         updates: {
//           title: values.title,
//           position: sectionNumber,
//           description: values.sectionDescription,
//         },
//       });

//       updateSection(
//         {
//           sectionId: editingSectionId!,
//           updates: {
//             title: values.title,
//             position: sectionNumber,
//             description: values.sectionDescription,
//           },
//         },
//         {
//           onSuccess: () => {
//             toast.success("Section updated successfully ✔️");
//             setEditingSectionId(null);
//             form.reset();
//             router.refresh();
//           },
//           onError: (error: any) => {
//             console.error("Update error:", error);
//             toast.error(error.message || "Failed to update section ❌");
//           },
//         }
//       );
//     } catch (err: any) {
//       console.log("Error: ", err.message);
//       toast.error("Something went wrong ❌");
//     }
//   };

//   // Edit section
//   const onEdit = (section: CourseSection) => {
//     setEditingSectionId(section.id);
//     setIsCreating(true);
//     form.setValue("title", section.title);
//     form.setValue("sectionNumber", section.position?.toString() || "");
//     form.setValue("sectionDescription", section.description || "");
//   };

//   // Delete section
//   const onDelete = (sectionId: string) => {
//     if (window.confirm("Are you sure you want to delete this section?")) {
//       deleteSection(sectionId, {
//         onSuccess: () => {
//           toast.success("Section deleted successfully ✔️");
//           router.refresh();
//         },
//         onError: (error: any) => {
//           toast.error(error.message || "Failed to delete section ❌");
//         },
//       });
//     }
//   };

//   // Reorder sections
//   const onReorder = async (updateData: { id: string; position: number }[]) => {
//     try {
//       setIsUpdating(true);

//       // Update each section's position optimistically
//       updateData.forEach(({ id, position }) => {
//         updateSection(
//           {
//             sectionId: id,
//             updates: { position },
//           },
//           {
//             onError: (error: any) => {
//               toast.error(`Failed to reorder section: ${error.message}`);
//             },
//           }
//         );
//       });

//       // Alternatively, you can make a bulk update API call if your backend supports it
//       // await axios.put(`/api/courses/${courseId}/sections/reorder`, {
//       //   list: updateData,
//       // });

//       toast.success("Sections reordered successfully ✔️");
//       router.refresh();
//     } catch (error: any) {
//       toast.error(error.message || "Failed to reorder sections ❌");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     setEditingSectionId(null);
//     toggleCreating();
//   };

//   const isPending = isCreatingSection || isUpdatingSection || isDeletingSection;

//   return (
//     <div className="relative mt-6 w-full rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
//       {isUpdating && (
//         <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-xl bg-slate-500/20">
//           <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
//         </div>
//       )}

//       <div className="flex items-center justify-between font-medium">
//         <div className="flex items-center gap-2">
//           Course sections
//           {isSectionsLoading && (
//             <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
//           )}
//         </div>
//         <Button
//           onClick={toggleCreating}
//           variant="outline"
//           className={`${dmSans.className} rounded-full`}
//           disabled={isPending}
//         >
//           {isCreating ? (
//             <>Cancel</>
//           ) : (
//             <>
//               <PlusCircle className="h-4 w-4 mr-1" />
//               Add a section
//             </>
//           )}
//         </Button>
//       </div>

//       {(isCreating || editingSectionId) && (
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="mt-4 space-y-4"
//           >
//             <FormField
//               control={form.control}
//               name="sectionNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <Input
//                       disabled={isSubmitting || isPending}
//                       placeholder="e.g. 1"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <Input
//                       disabled={isSubmitting || isPending}
//                       placeholder="e.g. 'Introduction to the course'"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="sectionDescription"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <Input
//                       disabled={isSubmitting || isPending}
//                       placeholder="e.g. 'This is an introduction section where we will introduce the course & the instructor ...'"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="flex items-center gap-2">
//               <Button
//                 className="dark:bg-zinc-800"
//                 type="submit"
//                 disabled={!isValid || isPending}
//               >
//                 {editingSectionId ? "Update" : "Create"}
//                 {(isCreatingSection || isUpdatingSection) && (
//                   <Loader2 className="h-4 w-4 animate-spin ml-2" />
//                 )}
//               </Button>

//               {editingSectionId && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={cancelEdit}
//                   disabled={isPending}
//                 >
//                   Cancel Edit
//                 </Button>
//               )}
//             </div>
//           </form>
//         </Form>
//       )}

//       {!isCreating && !editingSectionId && (
//         <div
//           className={cn(
//             "mt-2 text-sm",
//             !courseSections?.length && "italic text-gray-500 dark:text-gray-400"
//           )}
//         >
//           {!courseSections?.length && "No sections"}

//           {/* Sections List */}
//           <SectionsList
//             course={course}
//             chapters={
//               chapters ||
//               course?.sections?.flatMap((s) => s.Chapter || []) ||
//               []
//             }
//             onEdit={onEdit}
//             onDelete={onDelete}
//             onReorder={onReorder}
//             items={
//               Array.isArray(courseSections) ? courseSections : sections || []
//             }
//             isPending={isPending}
//           />
//         </div>
//       )}

//       {!isCreating && !editingSectionId && courseSections?.length > 0 && (
//         <p className="mt-4 text-xs text-muted-foreground">
//           Drag and drop to reorder the sections
//         </p>
//       )}
//     </div>
//   );
// };"use client";

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
  sections: CourseSection[];
  chapters: Chapter[];
}

const formSchema = z.object({
  sectionNumber: z.string().min(1, "Section number is required"),
  title: z.string().min(1, "Title is required"),
  sectionDescription: z.string().min(1, "Description is required"),
});

export const SectionsForm = ({
  initialData,
  course,
  sections,
  chapters,
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
                chapters={
                  chapters ||
                  course?.sections?.flatMap((s) => s.Chapter || []) ||
                  []
                }
                onEdit={onEdit}
                onDelete={onDelete}
                onReorder={onReorder}
                items={
                  Array.isArray(courseSections)
                    ? courseSections
                    : sections || []
                }
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

/**
 * Here are well-structured sections for the "Fundamentals of Programming" course:

**Section 1: Getting Started with Programming**
Introduction to programming concepts, setting up your development environment, and writing your first program. Understanding how code executes and the basic workflow of software development.

**Section 2: Variables and Data Types**
Learn how to store and manipulate data using variables. Explore different data types including numbers, strings, booleans, and understand type conversion and basic operations.

**Section 3: Control Flow and Logic**
Master conditional statements (if/else), comparison operators, and logical operators. Learn how to make your programs make decisions based on different conditions.

**Section 4: Loops and Iteration**
Discover how to repeat code efficiently using for loops, while loops, and nested loops. Practice iterating through data and avoiding common pitfalls like infinite loops.

**Section 5: Functions and Modular Code**
Learn to write reusable code blocks with functions, understand parameters and return values, and organize your code for better readability and maintainability.

**Section 6: Data Structures Fundamentals**
Introduction to arrays/lists, dictionaries/objects, and how to store and access collections of data. Learn when to use each data structure effectively.

**Section 7: Object-Oriented Programming Basics**
Understand classes, objects, properties, and methods. Learn the principles of encapsulation and how to model real-world entities in code.

**Section 8: Error Handling and Debugging**
Develop essential debugging skills, learn to read error messages, use debugging tools, and implement try-catch blocks for robust error handling.

**Section 9: File Operations and Input/Output**
Learn to read from and write to files, handle user input, and work with different file formats. Build programs that persist data between sessions.

**Section 10: Algorithms and Problem-Solving**
Introduction to algorithmic thinking, common algorithms (searching, sorting), and problem-solving strategies. Practice breaking down complex problems into manageable steps.

**Section 11: Best Practices and Code Quality**
Learn about code style, naming conventions, comments, documentation, and writing clean, maintainable code that others can understand.

**Section 12: Version Control with Git**
Introduction to Git and GitHub for tracking changes, collaborating with others, and managing your code projects professionally.

**Section 13: Final Project - Building Your Application**
Apply everything you've learned by building a complete application from scratch. Plan, design, implement, test, and deploy your project with instructor guidance.

**Section 14: Next Steps in Your Programming Journey**
Explore different programming paths (web development, data science, mobile apps), recommended resources, and how to continue learning and growing as a developer.
 */
