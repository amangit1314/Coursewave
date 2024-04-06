"use client";

import React, { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaTags } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { TbCategory2 } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { FileUpload } from "@/components/file-upload";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";

function CreateCourse({ params }: { params: { id: string } }) {
  const instructorId = params?.id!;
  return (
    <div className="flex flex-col md:items-start justify-start max-w-7xl w-full mx-auto dark:bg-zinc-900 min-h-screen h-full py-20">
      <div className="flex flex-col px-4 md:px-8">
        <p className="text-2xl tracking-tight font-semibold text-gray-800 dark:text-gray-100">
          Create your Course
        </p>
        <p className="text-base mt-2 text-gray-600 dark:text-slate-400">
          Enter below fields to create your course! Don&apos;t worry you can
          change general things later on.
        </p>
      </div>

      <div className="my-2 px-4 md:px-8">
        <CreateCourseForm instructorId={instructorId} />
      </div>
    </div>
  );
}

export default CreateCourse;

//* ................................ components ....................................
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required",
  }),
  image: z.string(),
  courseDescription: z.string().optional(),
  coursePrice: z.string(),
  courseCategories: z.string().array().optional(),
  instructorName: z.string(),
  technologiesYouWillLearn: z.string().array().optional(),
  thisCourseIsFor: z.string().array().optional(),
  prerequisits: z.string().array().optional(),
  whatYouWillLearn: z.string().array().optional(),
});

function CreateCourseForm({ instructorId }: { instructorId: string }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = React.useState("");

  const handleImageUpload = async (url: string) => {
    try {
      if (url) {
        setImageUrl(url);
        toast.success("Course updated successfully ✔️ ...");
      } else {
        toast.error("Error uploading image. Please try again.");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",
      instructorName: "",
      coursePrice: "",
      courseDescription: "",
      courseCategories: [],
      whatYouWillLearn: [],
      thisCourseIsFor: [],
      technologiesYouWillLearn: [],
      prerequisits: [],
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios
        .post(`/api/instructor/${instructorId}/dashboard/courses`, {
          courseTitle: values.title,
          coursePrice: values.coursePrice,
          courseImage: imageUrl,
        })
        .then((response) => {
          console.log("Response: ", response.data);
          router.push(
            `/instructor/${instructorId}/courses/createdCourses/${response.data.data?.courseId!}`
          );
          toast.success("Course Created successfully ...");
          console.log(values);
        })
        .catch((err: any) => {
          toast.error(`Error: 500${err.message}`);
        });
    } catch (error: any) {
      toast.error(`error: ${error.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
        {/* course title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <div>
              <FormItem className="mt-8">
                <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
                  Course Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    className="bg-transparent border-gray-700 dark:border-gray-400 "
                    placeholder="e.g. 'Full Stack Bootcamp'"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="">
                  What will you teach in this course?
                </FormDescription>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        {/* course image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <div>
              <FormItem>
                <FormControl>
                  {/* <PickCourseImage /> */}
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Pick a file</span>
                      <span className="label-text-alt">Max size 4MB</span>
                    </div>
                    <UploadDropzone
                      endpoint={"imageUploader"}
                      onClientUploadComplete={() => {
                        (url: string) => handleImageUpload(url);
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`${error?.message}`);
                      }}
                    />

                    {imageUrl ? (
                      <div className="mt-4">
                        <Image
                          src={imageUrl}
                          alt="Uploaded course image"
                          height={180}
                          width={180}
                          className="m-1 object-cover rounded-xl"
                        />
                      </div>
                    ) : <div></div>}
                  </label>


                </FormControl>

                <FormDescription className="">
                  Pick a course image for your course. 16:9 aspect ratio
                  recommended
                </FormDescription>
              </FormItem>
            </div>
          )}
        />

        {/* course description */}
        <FormField
          control={form.control}
          name="courseDescription"
          render={({ field }) => (
            <div>
              <FormItem className="mt-8">
                <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
                  Course Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-transparent border-gray-700 dark:border-gray-400 "
                    placeholder="Write a description for your course ..."
                    {...field}
                  />
                </FormControl>
                <FormDescription className="">
                  This is your course description keep min 150 chars.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        {/* instructor name */}
        <FormField
          control={form.control}
          name="instructorName"
          render={({ field }) => (
            <div>
              <FormItem className="mt-8">
                <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100 ">
                  Instructor Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Instructor Name"
                    className="bg-transparent border-gray-700 dark:border-gray-400 "
                    {...field}
                  />
                </FormControl>
                <FormDescription className="">
                  This is the instrctor name which will be displayed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        {/* course categories */}
        <FormField
          control={form.control}
          name="courseCategories"
          render={({ field }) => (
            <div>
              <FormItem className="mt-4">
                <AddCourseCategories />
                <FormDescription></FormDescription>
              </FormItem>
            </div>
          )}
        />

        {/* what you will learn*/}
        <FormField
          control={form.control}
          name="whatYouWillLearn"
          render={({ field }) => (
            <div>
              <FormItem className="mt-4">
                <AddCourseCategories />
                <FormDescription></FormDescription>
              </FormItem>
            </div>
          )}
        />

        {/* thisCourseIsFor */}
        <FormField
          control={form.control}
          name="thisCourseIsFor"
          render={({ field }) => (
            <div>
              <FormItem className="mt-4">
                <AddCourseCategories />
                <FormDescription>
                  Write who should take this course!
                </FormDescription>
              </FormItem>
            </div>
          )}
        />

        {/* technologiesYouWillLearn */}
        <FormField
          control={form.control}
          name="thisCourseIsFor"
          render={({ field }) => (
            <div>
              <FormItem className="mt-4">
                <AddCourseCategories />
                <FormDescription>
                  What techlogies student will learn? (if any)
                </FormDescription>
              </FormItem>
            </div>
          )}
        />

        {/* prerequisists */}
        <FormField
          control={form.control}
          name="prerequisits"
          render={({ field }) => (
            <div>
              <FormItem className="mt-4">
                <AddCourseCategories />
                <FormDescription>
                  Write the prerequisits for this course
                </FormDescription>
              </FormItem>
            </div>
          )}
        />

        {/* price slider */}
        <FormField
          control={form.control}
          name="coursePrice"
          render={({ field }) => (
            <div>
              <FormItem className="flex flex-col mt-4">
                <FormLabel
                  htmlFor="priceMin"
                  className="text-gray-800 text-base dark:text-gray-100"
                >
                  Course price ($)
                </FormLabel>
                <Input
                  type="number"
                  id="priceMin"
                  className="rounded-md border border-gray-700 dark:border-gray-400 shadow-sm focus:border-blue-500 bg-transparent focus:shadow-outline-blue px-3 py-2"
                  min={0}
                  max={500}
                  {...field}
                />
                <FormDescription className="">
                  We recommend to keep price between 1 to 500$ to ensure
                  affordability.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        {/* buttons */}
        <div className="flex items-center gap-x-2 mb-4">
          <Link href="/">
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={!isValid || isSubmitting}>
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}

const AddCourseCategories = () => {
  const [categories, setCategories] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input element when the component mounts
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "," && inputValue.trim() !== "") {
      event.preventDefault(); // Prevent default behavior of the comma key
      setCategories([...categories, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleDeleteCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
  };

  return (
    <div className="flex flex-col dark:bg-transparent justify-start items-start rounded overflow-hidden w-full sm:w-11/12 md:max-w-5xl">
      <div className="flex flex-row space-x-2 justify-start items-center">
        <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100 ">
          Course Categories
        </FormLabel>
        <TbCategory2 />
      </div>

      <form action="#" className="ml-1">
        <Input
          ref={inputRef}
          className="dark:bg-transparent w-full  "
          type="text"
          placeholder="e.g full stack development ..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </form>

      <div className="my-3 flex flex-wrap -m-1">
        {categories.map((category) => (
          <span
            key={category}
            className="m-1 flex flex-wrap justify-between items-center text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-600 rounded px-4 py-2 font-bold leading-loose cursor-pointer dark:text-gray-300 dark:hover:text-white"
          >
            <TbCategory2 className="w-3 h-3 sm:h-4 sm:w-4 mr-[6px] text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300" />
            {category}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 sm:h-4 sm:w-4 ml-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              viewBox="0 0 20 20"
              fill="currentColor"
              onClick={() => handleDeleteCategory(category)}
            >
              {/* Add the icon here */}
              <RxCross2 size={22} />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
};

function PickCourseImage() {
  const [imageUrl, setImageUrl] = React.useState("");
  const router = useRouter();

  const handleImageUpload = async (url: string) => {
    try {
      if (url) {
        setImageUrl(url);
        toast.success("Course updated successfully ✔️ ...");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">Pick a file</span>
        <span className="label-text-alt">Max size 5MB</span>
      </div>
      {/* <input
        type="file"
        className="file-input file-input-bordered w-full max-w-lg"
      /> */}
      <UploadDropzone
        endpoint={"imageUploader"}
        onClientUploadComplete={() => {
          (url: string) => handleImageUpload(url);
        }}
        onUploadError={(error: Error) => {
          toast.error(`${error?.message}`);
        }}
      />
    </label>
  );
}