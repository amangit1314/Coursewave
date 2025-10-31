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

// const prerequisits = [
//   "Must have a good internet connection.",
//   "Laptop is a must.",
//   "And if you Want to learn & gain knowledge",
// ];

// const formSchema = z.object({
//   prerequisits: z.string().array(),
// });

// export const PrerequisitsForm = ({ course }: { course: Course }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [points, setPoints] = useState(course?.prerequisites || prerequisits); // Use initial data or empty array

//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   const toggleEdit = () => setIsEditing((current) => !current);

//   const router = useRouter();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       prerequisits: points,
//     },
//   });

//   const { isSubmitting, isValid } = form.formState;

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       await axios.post(
//         `api/instructor/${course?.instructorId}/dashboard/courses/${course?.id}/attachments`,
//         { newPrerequisits: values.prerequisits },
//       );
//       toast.success("Course categories updated ...");
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

//   return (
//     <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
//       <div className={`${dmSans.className} mb-4 flex items-center justify-between font-medium`}>
//         Prerequisits
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
//           {points.length === 0 && (
//             <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
//               No points yet
//             </p>
//           )}

//           {points.length > 0 && (
//             <div className="space-y-2">
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
//               name="prerequisits"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <Combobox
//                       className="dark:bg-zinc-800"
//                       // options={...options}
//                       {...field}
//                     />
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
import { Pencil, PlusCircle, X, Check, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Course } from "@/types/course";
import { dmSans } from "@/lib/config/fonts";
import { useUpdateCourse } from "@/hooks/useCourses";

const formSchema = z.object({
  prerequisites: z.array(z.string().min(1, "Prerequisite cannot be empty")),
});

const PrerequisitesForm = ({ course }: { course: Course }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prerequisites, setPrerequisites] = useState<string[]>(
    course?.prerequisites || []
  );
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const { mutate: updateCourse } = useUpdateCourse();

  const addPrerequisite = () => {
    const trimmedValue = newPrerequisite.trim();
    if (trimmedValue && !prerequisites.includes(trimmedValue)) {
      setPrerequisites([...prerequisites, trimmedValue]);
      setNewPrerequisite("");
    } else if (prerequisites.includes(trimmedValue)) {
      toast.error("This prerequisite already exists");
    }
  };

  const removePrerequisite = (index: number) => {
    const updatedPrerequisites = prerequisites.filter((_, i) => i !== index);
    setPrerequisites(updatedPrerequisites);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPrerequisite();
    }
  };

  const onSubmit = async () => {
    if (prerequisites.length === 0) {
      toast.error("Please add at least one prerequisite");
      return;
    }

    setIsSubmitting(true);

    try {
      updateCourse(
        {
          courseId: course.id,
          updates: {
            prerequisites,
          },
        },
        {
          onSuccess: () => {
            toast.success("course prerequisits updated successfully ...");
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
    // Reset to original values when canceling
    setPrerequisites(course?.prerequisites || []);
    setNewPrerequisite("");
    toggleEdit();
  };

  return (
    <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
      <div
        className={`${dmSans.className} flex items-center justify-between font-medium`}
      >
        Course Prerequisites
        <Button onClick={toggleEdit} variant="outline" className="rounded-full">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Edit Prerequisites
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4">
          {prerequisites.length === 0 ? (
            <div className="flex h-20 items-center justify-center rounded-2xl bg-slate-200 dark:bg-zinc-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No prerequisites added yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {prerequisites.map((prerequisite, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-sky-200 bg-sky-100 p-3 text-sky-700 dark:border-none dark:bg-zinc-800 dark:text-gray-100"
                >
                  <div className="flex items-start space-x-2">
                    {/* <Check className="h-4 w-4 mt-1 flex-shrink-0 text-green-600 dark:text-green-400" /> */}
                    <Pencil className="mr-2 h-4 w-4 flex-shrink-0" />
                    <p className="text-sm">{prerequisite}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="mt-4 space-y-4">
          {/* Current Prerequisites List */}
          {prerequisites.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Prerequisites:
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {prerequisites.map((prerequisite, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-zinc-800"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                        {index + 1}
                      </div>
                      <span className="text-sm">{prerequisite}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePrerequisite(index)}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Prerequisite */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add New Prerequisite:
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter a prerequisite (e.g., 'Basic JavaScript knowledge')"
                value={newPrerequisite}
                onChange={(e) => setNewPrerequisite(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 dark:bg-zinc-800"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                onClick={addPrerequisite}
                disabled={!newPrerequisite.trim() || isSubmitting}
                size="sm"
                className="whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-1" />
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
              disabled={prerequisites.length === 0 || isSubmitting}
              className="dark:bg-zinc-800 dark:text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>Tip:</strong> Prerequisites help students understand
              what they should know before taking your course. Be specific about
              the required knowledge or skills.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrerequisitesForm;
