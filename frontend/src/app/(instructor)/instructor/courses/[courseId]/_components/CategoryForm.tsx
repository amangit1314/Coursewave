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
import toast, { Toaster } from "react-hot-toast";
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

interface CategoryFormProps {
  course: Course;
}

const formSchema = z.object({
  // categories: z.string().array().min(1, "Please select at least one category"),
  categories: z.string(),
});

export const CategoryForm = ({ course }: CategoryFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState([...course?.categories]);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories:
        course?.categories.toString() ??
        "Next.js, Full Stack Dev, Front-end Dev",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  let categories = form.getValues("categories");
  const categoriesArray = categories
    .split(",")
    .map((item: string) => item.trim());

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const categoriesArray = values.categories
        .split(",")
        .map((item: string) => item.trim());

      await axios.patch(
        `api/instructor/${course?.instructorId}/dashboard/courses/${course.id}/editCategories`,
        { categories: categoriesArray }
      );
      toast.success("Course categories updated ...");
      toggleEdit();
      router.refresh();
    } catch (err: any) {
      console.log(`Something went wrong, ERROR: ${err.message}`);
      toast.error(`Something went wrong, ERROR: ${err.message}`);
    }
  };

  const onDelete = (index: any) => {
    const updatedPoints = [...points];
    updatedPoints.splice(index, 1);
    setPoints(updatedPoints);
  };

  const handleDeleteCategory = (category: string) => {
    const categoriesArray = form
      .getValues("categories")
      .split(",")
      .map((item: string) => item.trim());
    setPoints(categoriesArray.filter((c) => c !== category));
  };

  console.log("categories in categories form: ", course?.categories);
  console.log(`Form values: `, form.getValues("categories"));

  return (
    <div className="mt-6 rounded-2xl border bg-slate-100 p-4 dark:bg-zinc-700">
      <div className="flex items-center justify-between font-medium">
        Course categories
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit category
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {categoriesArray.length === 0 && (
            <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
              No attachments yet
            </p>
          )}

          {categoriesArray.length > 0 && (
            <div className="mt-2 flex w-full max-w-[408px] space-x-2 overflow-y-hidden overflow-x-scroll pb-1">
              {categoriesArray.map((category, index) => (
                <div
                  key={index}
                  className="flex w-full items-center rounded-full border border-sky-200 bg-sky-100 p-3 text-sky-700 dark:border-none dark:bg-zinc-800 dark:text-gray-100"
                >
                  <Tag className="mr-2 h-4 w-4 flex-shrink-0" />
                  <p className="line-clamp-1 text-[12px]">{category}</p>
                  {index.toString() === category && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {index.toString() !== category && (
                    <button
                      onClick={() => onDelete(category)}
                      className="ml-4 transition hover:opacity-75"
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
                    />
                  </FormControl>
                  <FormDescription>
                    Add course categories here, Saperate categories with ,
                  </FormDescription>

                  {/* categories list */}
                  <div className="-m-1 my-3 flex flex-wrap">
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

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* submit button */}
            <div className="flex items-center gap-x-2">
              <Button
                className="cursor-pointer transition-all duration-300 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-950"
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

const labels = [
  "feature",
  "bug",
  "enhancement",
  "documentation",
  "design",
  "question",
  "maintenance",
];

export function Combobox({ options, field }: any) {
  const [label, setLabel] = React.useState("feature");
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center">
      <p className="text-sm font-medium leading-none">
        <span className="mr-2 rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground">
          {label}
        </span>
        <span className="text-muted-foreground">Create a new project</span>
      </p>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            {/* <DotsHorizontalIcon /> */}
            <HiDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Assign to...</DropdownMenuItem>
            <DropdownMenuItem>Set due date...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Apply label</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Filter label..."
                    autoFocus={true}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No label found.</CommandEmpty>
                    <CommandGroup>
                      {labels.map((label) => (
                        <CommandItem
                          key={label}
                          value={label}
                          onSelect={(value) => {
                            setLabel(value);
                            setOpen(false);
                          }}
                        >
                          {label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
