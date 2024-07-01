"use client";

import React, { useEffect, useRef } from "react";
import "@uploadthing/react/styles.css";
import { absoluteUrl } from "@/utils/utils";
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
import Image from "next/image";
import toast from "react-hot-toast";
import { Asterisk } from "lucide-react";
import { BiBulb } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { TbCategory2 } from "react-icons/tb";
import { IoIosCodeWorking } from "react-icons/io";
import { UploadDropzone } from "@/utils/uploadthing";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required",
  }),
  image: z.string(),
  courseDescription: z.string(),
  coursePrice: z.string(),
  courseCategories: z.string(),
  instructorName: z.string(),
  technologiesYouWillLearn: z.string(),
  thisCourseIsFor: z.string(),
  prerequisits: z.string(),
  whatYouWillLearn: z.string(),
});

const CreateCourseForm = ({ instructorId }: { instructorId: string }) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = React.useState("");

  useEffect(() => {
    inputRef.current?.focus(); // Focus the input element when the component mounts
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: imageUrl,
      instructorName: "",
      coursePrice: "",
      courseDescription: "",
      courseCategories: "",
      whatYouWillLearn: "",
      thisCourseIsFor: "",
      technologiesYouWillLearn: "",
      prerequisits: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const whatYouWillLearnArray = values.whatYouWillLearn
      .split(",")
      .map((item: string) => item.trim());
    const thisCourseIsForArray = values.thisCourseIsFor
      .split(",")
      .map((item: string) => item.trim());
    const technologiesYouWillLearnArray = values.technologiesYouWillLearn
      .split(",")
      .map((item: string) => item.trim());
    const prerequisitsArray = values.prerequisits
      .split(",")
      .map((item: string) => item.trim());
    const categoriesArray = values.courseCategories
      .split(",")
      .map((item: string) => item.trim());

    await axios
      .post(`/api/instructor/${instructorId}/dashboard/courses`, {
        courseTitle: values.title,
        coursePrice: values.coursePrice,
        courseCreatorName: values.instructorName,
        courseImage: imageUrl,
        courseDescription: values.courseDescription,
        courseCategories: categoriesArray,
        courseTechnologies: technologiesYouWillLearnArray,
        courseThisCourseIsFor: thisCourseIsForArray,
        coursePrerequisits: prerequisitsArray,
        courseWhatYouWillLearn: whatYouWillLearnArray,
      })
      .then((response) => {
        console.log("Form Values: ", values);
        console.log("Response data after creating course: ", response);
        router.push(
          `/instructor/${instructorId}/courses/createdCourses/${response.data.data?.courseId!}`
        );
        toast.success("Course Created successfully ...");
      })
      .catch((err: any) => {
        console.log("Error in creating course: ", err.message);
        toast.error(`Error: ${err.message}`);
      });
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
                    placeholder="i.e. 'Full Stack Bootcamp', etc..."
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
                <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
                  Course Image
                </FormLabel>

                <FormControl>
                  <UploadDropzone
                    endpoint={"imageUploader"}
                    onClientUploadComplete={(res: any) => {
                      console.log("Uploadthing image upload response: ", res);
                      console.log("Uploaded img url: ", res[0].url);

                      setImageUrl(res[0].url);
                      toast.success("Image uploaded successfully ...");
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`${error?.message}`);
                    }}
                  />
                </FormControl>

                <FormDescription>
                  Pick a course image for your course. 16:9 aspect ratio
                  recommended
                </FormDescription>

                {/* uploaded image */}
                {imageUrl.length ? (
                  <div className="mt-4">
                    <Image
                      src={imageUrl}
                      alt="Uploaded course image"
                      height={180}
                      width={180}
                      className="m-1 object-cover rounded-xl"
                    />
                  </div>
                ) : (
                  <div></div>
                )}
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
                    placeholder="i.e. This is a full stack dev course, etc ..."
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
                    placeholder="i.e. Aman Soni, etc ..."
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
                <FormLabel className="my-4 flex justify-start space-x-1 items-center text-base text-gray-800 dark:text-gray-100 ">
                  Course Categories
                  <TbCategory2 />
                </FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-transparent w-full border-gray-700 dark:border-gray-400  "
                    type="text"
                    placeholder="i.e. Next.js, Flutter etc ..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Add course categories here, Saperate categories with ,
                </FormDescription>
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
                <FormLabel className="flex justify-start items-center text-base text-gray-800 dark:text-gray-100 ">
                  <span>This Course is for</span> <QuestionMarkIcon />
                </FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-transparent w-full border-gray-700 dark:border-gray-400  "
                    type="text"
                    placeholder="i.e. If you want to learn, etc ..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write who should take this course!, Saperate points with ,
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
                <FormLabel className="flex justify-start items-center text-base text-gray-800 space-x-[2px] dark:text-gray-100 ">
                  <span>Prerequisits</span> <Asterisk size={16} />
                </FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-transparent w-full border-gray-700 dark:border-gray-400  "
                    type="text"
                    placeholder="i.e. You must have a laptop, etc ...,"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write the prerequisits for this course, Saperate points with ,
                </FormDescription>
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
                <FormLabel className="flex justify-start items-center text-base text-gray-800 space-x-[2px] dark:text-gray-100 ">
                  <span>What you&apos;ll learn</span> <BiBulb size={16} />
                </FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-transparent w-full border-gray-700 dark:border-gray-400  "
                    type="text"
                    placeholder="i.e. You'll learn how to design responsive web pages, etc ..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write points regarding what students will learn in this
                  course?, Saperate points with ,
                </FormDescription>
              </FormItem>
            </div>
          )}
        />

        {/* technologiesYouWillLearn */}
        <FormField
          control={form.control}
          name="technologiesYouWillLearn"
          render={({ field }) => (
            <div>
              <FormItem className="mt-4">
                <FormLabel className="flex justify-start items-center text-base text-gray-800 space-x-[2px] dark:text-gray-100 ">
                  <span>Technologies you&apos;ll learn</span>{" "}
                  <IoIosCodeWorking size={20} />
                </FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-transparent w-full border-gray-700 dark:border-gray-400  "
                    type="text"
                    placeholder="i.e. Next.js, Flutter, etc ..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  What techlogies student will learn? (if any), Saperate points
                  with ,
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
};

export default CreateCourseForm;
