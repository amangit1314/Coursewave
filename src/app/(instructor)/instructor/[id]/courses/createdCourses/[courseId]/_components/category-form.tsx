"use client";

import * as React from "react";
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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Category, Course } from "@prisma/client";
import {
  Form,
  FormControl,
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

interface CategoryFormProps {
  course: Course;
}

const formSchema = z.object({
  categories: z.string().array().min(1, "Please select at least one category"),
});

// || ["Next.js", "Full Stack Dev", "Front-end Dev"]
export const CategoryForm = ({ course }: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState(
    [...course?.courseCategories]
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: course?.courseCategories || ["Next.js", "Full Stack Dev", "Front-end Dev"],
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/instructor/${course?.instructorID}/dashboard/courses/${course.courseId}/attachments`,
        { newCourseCategories: points }
      );
      toast.success("Course categories updated ...");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = (index: any) => {
    const updatedPoints = [...points];
    updatedPoints.splice(index, 1);
    setPoints(updatedPoints);
  };

  const [inputValue, setInputValue] = React.useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "," || event.key ==="Enter" && inputValue.trim() !== "") {
      event.preventDefault();
      setPoints([...points, inputValue.trim()]);
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleDeleteCategory = (category: string) => {
    setPoints(points.filter((c) => c !== category));
  };

  return (
    <div className="mt-6 border bg-slate-100 dark:bg-zinc-700 rounded-2xl p-4">
      <div className="font-medium flex items-center justify-between">
        Course category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {course?.courseCategories!.length === 0 && (
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 italic">
              No attachments yet
            </p>
          )}

          {course?.courseCategories!.length > 0 && (
            <div className="flex space-x-2 max-w-[408px] w-full pb-1 overflow-x-scroll overflow-y-hidden mt-2">
              {course?.courseCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex w-full items-center p-3 bg-sky-100 dark:bg-zinc-800 border-sky-200 dark:border-none border text-sky-700 dark:text-gray-100 rounded-full"
                >
                  <Tag className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-[12px] line-clamp-1">{category}</p>
                  {index.toString() === category && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {index.toString() !== category && (
                    <button
                      onClick={() => onDelete(category)}
                      className="ml-4 hover:opacity-75 transition"
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
        <Form {...form}>
          <form
            onSubmit={() => form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      ref={inputRef}
                      className="dark:bg-transparent w-full  "
                      type="text"
                      placeholder="e.g full stack development ..."
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                  </FormControl>

                  <div className="my-3 flex flex-wrap -m-1">
                    {points.map((point, index) => (
                      <span
                        key={index}
                        className="m-1 flex flex-wrap justify-between items-center text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-600 rounded px-4 py-2 font-bold leading-loose cursor-pointer dark:text-gray-300 dark:hover:text-white"
                      >
                        <TbCategory2 className="w-3 h-3 sm:h-4 sm:w-4 mr-[6px] text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300" />
                        {point}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 sm:h-4 sm:w-4 ml-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          onClick={() => handleDeleteCategory(point)}
                        >
                          {/* Add the icon here */}
                          <RxCross2 size={22} />
                        </svg>
                      </span>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button
                className="dark:bg-zinc-900 dark:hover:bg-zinc-950 transition-all duration-300 dark:text-white cursor-pointer"
                // disabled={!isValid || !isSubmitting}
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