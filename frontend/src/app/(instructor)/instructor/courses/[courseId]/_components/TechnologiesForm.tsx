// "use client";

// import React from "react";

// import * as z from "zod";
// import axios from "axios";
// import { Pencil, PlusCircle, Loader2, X } from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { Combobox } from "./CategoryForm";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Course } from "@/types/course";
// import { dmSans } from "@/lib/config/fonts";

// const technologies = [
//   "Who wants to learn.",
//   "Want to understand concepts of this topic.",
//   "If you are a enthusiast of subject.",
// ];

// const formSchema = z.object({
//   technologies: z.string().array(),
// });

// export const TechnologiesForm = ({ course }: { course: Course }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [points, setPoints] = useState(course?.technologies || technologies);

//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   const toggleEdit = () => setIsEditing((current) => !current);

//   const router = useRouter();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       technologies: points,
//     },
//   });

//   const { isSubmitting, isValid } = form.formState;

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       await axios.post(
//         `api/instructor/${course?.instructorId}/dashboard/courses/${course?.id}/attachments`,
//         { newTechnologies: values.technologies }
//       );
//       toast.success("Course technologies updated ...");
//       toggleEdit();
//       router.refresh();
//     } catch {
//       toast.error("Something went wrong");
//     }
//   };

//   const onDelete = (index: any) => {
//     const updatedPoints = [...points]; // Create a copy of the array
//     updatedPoints.splice(index, 1); // Remove the point at the specified index
//     setPoints(updatedPoints);
//   };
//   2;
//   return (
//     <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
//       <div className={`${dmSans.className} mb-4 flex items-center justify-between font-medium`}>
//         Technologies you will learn
//         <Button onClick={toggleEdit} variant="outline" className="rounded-full">
//           {isEditing && <>Cancel</>}
//           {!isEditing && (
//             <>
//               <PlusCircle className="h-4 w-4" />
//               Add a point
//             </>
//           )}
//         </Button>
//       </div>
//       {!isEditing && (
//         <>
//           {technologies!.length === 0 && (
//             <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
//               No points yet
//             </p>
//           )}

//           {points.length > 0 && (
//             <div className="space-y-2">
//               {/* initialData?.attachments  */}
//               {points.map((point: string, index: any) => (
//                 <div
//                   key={index}
//                   className="flex w-full items-center rounded-xl border border-sky-200 bg-sky-100 p-3 text-sky-700 dark:border-none dark:bg-zinc-800 dark:text-gray-100"
//                 >
//                   <Pencil className="mr-2 h-4 w-4 flex-shrink-0" />
//                   <p className="line-clamp-1 text-[12px]">{point}</p>
//                   {deletingId === index && (
//                     <div>
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     </div>
//                   )}
//                   {deletingId !== index && (
//                     <button
//                       onClick={() => onDelete(index)}
//                       className="ml-auto transition hover:opacity-75"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {isEditing && (
//         <Form {...form}>
//           <form
//             onSubmit={() => form.handleSubmit(onSubmit)}
//             className="mt-4 space-y-4"
//           >
//             <FormField
//               control={form.control}
//               name="technologies"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <Combobox className="dark:bg-zinc-800" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div className="flex items-center gap-x-2">
//               <Button
//                 className="dark:bg-zinc-800 dark:text-white"
//                 disabled={!isValid || isSubmitting}
//                 type="submit"
//               >
//                 Save
//               </Button>
//             </div>
//           </form>
//         </Form>
//       )}
//     </div>
//   );
// };

"use client";

import React from "react";
import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, X, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Course } from "@/types/course";
import { dmSans } from "@/lib/config/fonts";
import { useUpdateCourse } from "@/hooks/useCourses";

const formSchema = z.object({
  technologies: z.array(z.string().min(1, "Technology cannot be empty")),
});

const defaultTechnologies = [
  "Who wants to learn.",
  "Want to understand concepts of this topic.",
  "If you are a enthusiast of subject.",
];

export const TechnologiesForm = ({ course }: { course: Course }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [technologies, setTechnologies] = useState<string[]>(
    course?.technologies || defaultTechnologies
  );
  const [newTechnology, setNewTechnology] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const { mutate: updateCourse } = useUpdateCourse();

  const addTechnology = () => {
    const trimmedValue = newTechnology.trim();
    if (trimmedValue && !technologies.includes(trimmedValue)) {
      setTechnologies([...technologies, trimmedValue]);
      setNewTechnology("");
    } else if (technologies.includes(trimmedValue)) {
      toast.error("This technology already exists");
    }
  };

  const removeTechnology = async (index: number) => {
    setDeletingId(index.toString());
    const updatedTechnologies = technologies.filter((_, i) => i !== index);
    setTechnologies(updatedTechnologies);
    setDeletingId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  };

  const onSubmit = async () => {
    if (technologies.length === 0) {
      toast.error("Please add at least one technology");
      return;
    }

    setIsSubmitting(true);
    try {
      updateCourse(
        {
          courseId: course.id,
          updates: {
            technologies,
          },
        },
        {
          onSuccess: () => {
            toast.success("Course technologies updated successfully ...");
            toggleEdit();
            router.refresh();
          },
          onError: (error: { message: any }) => {
            toast.error(error.message || "Something went wrong ...");
          },
        }
      );
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong ...");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    setTechnologies(course?.technologies || defaultTechnologies);
    setNewTechnology("");
    toggleEdit();
  };

  return (
    <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
      <div className={`${dmSans.className} mb-4 flex items-center justify-between font-medium`}>
        Technologies you will learn
        <Button onClick={toggleEdit} variant="outline" className="rounded-full">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4" />
              Add a point
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {technologies.length === 0 && (
            <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
              No points yet
            </p>
          )}

          {technologies.length > 0 && (
            <div className="space-y-2">
              {technologies.map((technology: string, index: any) => (
                <div
                  key={index}
                  className="flex w-full items-center rounded-xl border border-sky-200 bg-sky-100 p-3 text-sky-700 dark:border-none dark:bg-zinc-800 dark:text-gray-100"
                >
                  <Pencil className="mr-2 h-4 w-4 flex-shrink-0" />
                  <p className="line-clamp-2 text-[12px] mr-2 ml-1">{technology}</p>
                  {deletingId === index.toString() && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== index.toString() && (
                    <button
                      onClick={() => removeTechnology(index)}
                      className="ml-auto transition hover:opacity-75"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div className="mt-4 space-y-4">
          {/* Current Technologies List */}
          {technologies.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Technologies:
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {technologies.map((technology, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-sky-200 bg-sky-100 p-3 text-sky-700 dark:border-none dark:bg-zinc-800 dark:text-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <Pencil className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{technology}</span>
                    </div>
                    <button
                      onClick={() => removeTechnology(index)}
                      className="ml-auto transition hover:opacity-75"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Technology */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add New Technology:
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter a technology (e.g., 'React', 'Node.js')"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 dark:bg-zinc-800"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                onClick={addTechnology}
                disabled={!newTechnology.trim() || isSubmitting}
                size="sm"
                className="whitespace-nowrap"
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Press Enter to quickly add
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={technologies.length === 0 || isSubmitting}
              className="dark:bg-zinc-800 dark:text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
