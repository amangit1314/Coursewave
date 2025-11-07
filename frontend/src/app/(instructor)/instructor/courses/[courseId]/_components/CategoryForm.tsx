"use client";

import * as React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
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
import { Course } from "@/types/course";
import { dmSans } from "@/lib/config/fonts";
import { useUpdateCourse } from "@/hooks/useCourses";

interface CategoryFormProps {
  course: Course;
}

const formSchema = z.object({
  categories: z.string(),
});

export const CategoryForm = ({ course }: CategoryFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState(
    Array.isArray(course?.categories) ? course.categories : []
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  // Safe way to get initial categories value
  const getInitialCategories = () => {
    if (Array.isArray(course?.categories) && course.categories.length > 0) {
      return course.categories.join(", ");
    }
    return "Next.js, Full Stack Dev, Front-end Dev";
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: getInitialCategories(),
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { mutate: updateCourse } = useUpdateCourse();

  // Get categories array from form value
  const getCategoriesArray = () => {
    const categoriesValue = form.getValues("categories");
    return categoriesValue
      .split(",")
      .map((item: string) => item.trim())
      .filter((item) => item.length > 0);
  };

  const categoriesArray = getCategoriesArray();

  console.log("categories array in category form: ", categoriesArray);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const categoriesArray = values.categories
        .split(",")
        .map((item: string) => item.trim())
        .filter((item) => item.length > 0);

      updateCourse(
        {
          courseId: course.id,
          updates: {
            categories: categoriesArray,
          },
        },
        {
          onSuccess: () => {
            toast.success("Course categories updated successfully ✔️");
            toggleEdit();
            setPoints(categoriesArray); // Update local state
            router.refresh();
          },
          onError: (error: any) => {
            toast.error(error.message || "Something went wrong ❌");
          },
        }
      );
    } catch {
      toast.error("Something went wrong ❌");
    }
  };

  const handleDeleteCategory = (category: string) => {
    const updatedPoints = points.filter((c) => c !== category);
    setPoints(updatedPoints);
    // Update the form value as well
    form.setValue("categories", updatedPoints.join(", "));
  };

  // Add a category to the list
  const handleAddCategory = () => {
    const currentValue = form.getValues("categories");
    const categoriesArray = getCategoriesArray();
    setPoints(categoriesArray);
  };

  // Update points when form changes
  useEffect(() => {
    const categoriesArray = getCategoriesArray();
    setPoints(categoriesArray);
  }, [form.watch("categories")]);

  console.log("categories in categories form: ", course?.categories);
  console.log(`Form values: `, form.getValues("categories"));
  console.log("Points state: ", points);

  return (
    <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
      <div
        className={`${dmSans.className} flex items-center justify-between font-medium`}
      >
        Course categories
        <Button onClick={toggleEdit} variant="outline" className="rounded-full">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {points.length === 0 && (
            <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
              No categories yet
            </p>
          )}

          {points.length > 0 && (
            <div className="mt-4 flex w-full max-w-[408px] flex-wrap gap-2 pb-2">
              {points.map((category, index) => (
                <div
                  key={index}
                  className="inline-flex items-center rounded-full border border-sky-200 bg-sky-100 px-3 py-2 text-sky-700 dark:border-none dark:bg-zinc-800 dark:text-gray-100"
                >
                  <Tag className="mr-2 h-4 w-4 flex-shrink-0" />
                  <p className="whitespace-nowrap text-[12px]">{category}</p>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="ml-2 transition hover:opacity-75"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full border-gray-700 dark:border-gray-400 dark:bg-transparent"
                      type="text"
                      placeholder="i.e. Next.js, Flutter etc ..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleAddCategory();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Add course categories here, separate categories with commas
                  </FormDescription>

                  {/* Preview of categories */}
                  {points.length > 0 && (
                    <div className="-m-1 my-3 flex flex-wrap">
                      <p className="w-full text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Categories preview:
                      </p>
                      {points.map((point, index) => (
                        <span
                          key={index}
                          className="m-1 flex cursor-pointer flex-wrap items-center justify-between rounded bg-gray-200 px-4 py-2 text-xs font-bold leading-loose hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-600 dark:hover:text-white sm:text-sm"
                        >
                          <TbCategory2 className="mr-[6px] h-3 w-3 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 sm:h-4 sm:w-4" />
                          {point}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-4 h-3 w-3 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 sm:h-4 sm:w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            onClick={() => handleDeleteCategory(point)}
                          >
                            <RxCross2 size={22} />
                          </svg>
                        </span>
                      ))}
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* submit button */}
            <div className="flex items-center gap-x-2">
              <Button
                className="cursor-pointer transition-all duration-300 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-950"
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
