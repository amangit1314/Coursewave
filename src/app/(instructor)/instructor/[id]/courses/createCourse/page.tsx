// "use client";

// import React, { ChangeEvent, useEffect, useRef } from "react";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { FaTags } from "react-icons/fa";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import axios from "axios";
// import { Textarea } from "@/components/ui/textarea";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import toast, { Toaster } from "react-hot-toast";
// import { Label } from "@radix-ui/react-label";
// import useUserInfo from "@/lib/hooks/use-user-info";

// function CreateCourse() {
//   return (
//     <div className="flex flex-col  md:justify-start max-w-7xl w-full dark:bg-zinc-900  min-h-screen h-full py-24 px-8">
//       <div>
//         <p className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
//           Name your Course
//         </p>
//         <p className="text-base mt-2 text-gray-600 dark:text-gray-400">
//           What would you like to name your course? Don&apos;t worry you can
//           change this later.
//         </p>
//       </div>

//       <div className="mt-6 mb-2">
//         <CreateCourseForm />
//       </div>
//     </div>
//   );
// }

// export default CreateCourse;

// //! .............................. components ...........................................

// const formSchema = z.object({
//   title: z.string().min(2, {
//     message: "Title is required",
//   }),
//   image: z.instanceof(File),
//   instructorName: z.string(),
//   coursePrice: z.string(),
//   courseDescription: z.string().optional(),
//   courseCategories: z.string().array().optional(),
// });

// function CreateCourseForm() {
//   const router = useRouter();
//   const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       image: "",
//       instructorName: "",
//       coursePrice: "",
//       courseDescription: "",
//       courseCategories: [],
//     },
//   });

//   const { isSubmitting, isValid } = form.formState;
//   const user = useUserInfo();

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       let instId;
//       const isInstructor = user.user?.isInstructor!;

//       if (!isInstructor) {
//         const res = await axios.post(
//           `https://localhost:3000/api/profile/${user.user?.id}/becomeInstructor`,
//           values
//         );

//         if (res.status !== 200) {
//           console.log(`Failed to becomer instructor ... `);
//         }
//       }

//       instId = user.user?.id;

//       // Handle file upload (replace with your backend logic and error handling)
//       const formData = new FormData();

//       if (selectedFile) {
//         formData.append("image", selectedFile);
//       }

//       console.log("Form Filled values: ", values);

//       const response = await axios.post(
//         `https://localhost:3000/api/instructor/${instId}/dashboard/courses`,
//         {
//           courseTitle: values.title,
//           courseImage: values.image,
//           courseCreatorName: values.instructorName,
//           coursePrice: values.coursePrice,
//           courseDescription: values.courseDescription,
//           courseCategories: values.courseCategories,
//         },
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status !== 200) {
//         toast.error("Failed to create course ...");
//       }

//       toast.success("Course created successfully ...");
//       router.push(`/instructor/${instId}/createdCourses`);
//     } catch (error: any) {
//       toast.error("Something went wrong ...");
//       console.log("Error in creating course: ", error.message);
//     }
//   };

//   const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const target = event.target as HTMLInputElement & { files: FileList };
//     setSelectedFile(target.files[0] || null); // Allow for no file selection
//   };

//   // Clear selected file when form rerenders
//   useEffect(() => {
//     // Clear selected file when form resets to avoid keeping previously selected files
//     if (form.formState.isDirty) {
//       setSelectedFile(null);
//     }
//   }, [form.formState.isDirty]);

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
//         <Toaster />

//         {/* course image */}
//         <FormField
//           control={form.control}
//           name="image"
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <label className="form-control w-full max-w-5xl">
//                   <div className="label">
//                     <span className="label-text">Pick a file</span>
//                     <span className="label-text-alt">Max size 5MB</span>
//                   </div>
//                   <Input
//                     type="file"
//                     className="file-input file-input-bordered w-full max-w-xs"
//                     // {...field}
//                   />
//                 </label>
//               </FormControl>

//               <FormDescription className="">
//                 Pick a course image for your course.
//               </FormDescription>
//             </FormItem>
//           )}
//         />

//         {/* course title */}
//         <FormField
//           control={form.control}
//           name="title"
//           render={({ field }) => (
//             <div>
//               <FormItem className="mt-8">
//                 <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
//                   Course Name
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     disabled={isSubmitting}
//                     className="bg-transparent"
//                     placeholder="e.g. 'Full Stack Bootcamp'"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormDescription className="">
//                   What will you teach in this course?
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             </div>
//           )}
//         />

//         {/* course description */}
//         <FormField
//           control={form.control}
//           name="courseDescription"
//           render={({ field }) => (
//             <div>
//               <FormItem className="mt-8">
//                 <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
//                   Course Description
//                 </FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="Write a description for your course ..."
//                     className="dark:bg-transparent"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormDescription className="">
//                   This is your public display name.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             </div>
//           )}
//         />

//         {/* instructor name */}
//         <FormField
//           control={form.control}
//           name="instructorName"
//           render={({ field }) => (
//             <div>
//               <FormItem className="mt-8">
//                 <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100 ">
//                   Instructor Name
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="Instructor Name"
//                     className="bg-transparent"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormDescription className="">
//                   This is the instrctor name which will be displayed.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             </div>
//           )}
//         />

//         {/* course categories */}
//         <FormField
//           control={form.control}
//           name="courseCategories"
//           render={({ field }) => (
//             <div>
//               <FormItem className="mt-4">
//                 <AddCourseCategories />
//                 <FormDescription></FormDescription>
//               </FormItem>
//             </div>
//           )}
//         />

//         {/* price slider */}
//         <FormField
//           control={form.control}
//           name="coursePrice"
//           render={({ field }) => (
//             <div>
//               <FormItem className="flex flex-col mt-4">
//                 <FormLabel
//                   htmlFor="priceMin"
//                   className="text-gray-800 dark:text-gray-100"
//                 >
//                   Course price ($)
//                 </FormLabel>
//                 <Input
//                   type="number"
//                   id="priceMin"
//                   className="rounded-md border border-gray-700 dark:border-gray-300 shadow-sm focus:border-blue-500 bg-transparent focus:shadow-outline-blue px-3 py-2"
//                   min={0}
//                   max={500}
//                   {...field}
//                 />
//                 <FormDescription className="">
//                   We recommend to keep price between 1 to 500$ to ensure
//                   affordability.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             </div>
//           )}
//         />

//         {/* buttons */}
//         <div className="flex items-center gap-x-2 mb-4">
//           <Link href="/">
//             <Button variant="ghost" type="button">
//               Cancel
//             </Button>
//           </Link>
//           <Button type="submit" disabled={!isValid || isSubmitting}>
//             Continue
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }

// const AddCourseCategories = () => {
//   const [categories, setCategories] = React.useState<string[]>([]);
//   const [inputValue, setInputValue] = React.useState<string>("");
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     // Focus the input element when the component mounts
//     inputRef.current?.focus();
//   }, []);

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "," && inputValue.trim() !== "") {
//       event.preventDefault(); // Prevent default behavior of the comma key
//       setCategories([...categories, inputValue.trim()]);
//       setInputValue("");
//     }
//   };

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(event.target.value);
//   };

//   const handleDeleteCategory = (category: string) => {
//     setCategories(categories.filter((c) => c !== category));
//   };

//   return (
//     <div className="flex flex-col dark:bg-transparent justify-start items-start rounded overflow-hidden w-full sm:w-11/12 md:max-w-2xl">
//       <div className="flex flex-row space-x-2 justify-start items-center">
//         <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100 ">
//           Course Categories
//         </FormLabel>
//         <FaTags />
//       </div>

//       <form action="#" className="ml-1">
//         <Input
//           ref={inputRef}
//           className="dark:bg-transparent max-w-7xl w-full  "
//           type="text"
//           placeholder="e.g full stack development ..."
//           value={inputValue}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//         />
//       </form>

//       <div className="my-3 flex flex-wrap -m-1">
//         {categories.map((category) => (
//           <span
//             key={category}
//             className="m-1 flex flex-wrap justify-between items-center text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded px-4 py-2 font-bold leading-loose cursor-pointer dark:text-gray-300"
//           >
//             {category}
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-3 h-3 sm:h-4 sm:w-4 ml-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//               onClick={() => handleDeleteCategory(category)}
//             >
//               {/* Add the icon here */}
//             </svg>
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };


"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { Textarea } from "@tremor/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Label } from "@radix-ui/react-label";

function CreateCourse() {
  return (
    <div className="flex flex-col md:items-center md:justify-start max-w-7xl mx-auto dark:bg-slate-900 dark:bg-opacity-80 min-h-screen h-full pt-32 pb-24">
      <div className="flex flex-col">
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Name your Course
        </p>
        <p className="text-base mt-2 text-slate-600 dark:text-slate-400">
          What would you like to name your course? Don&apos;t worry you can
          change this later.
        </p>
      </div>

      <div className="mt-6 mb-2">
        <CreateCourseForm />
      </div>
    </div>
  );
}

export default CreateCourse;

// ...................... components .........................
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required",
  }),
  image: z.string(),
  instructorName: z.string(),
  coursePrice: z.string(),
  courseDescription: z.string().optional(),
  courseCategories: z.string().array().optional(),
});

function CreateCourseForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",
      instructorName: "",
      coursePrice: "",
      courseDescription: "",
      courseCategories: [],
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/course", values);
      router.push(`/instructor/createdCourses/${response.data.id}`);
      console.log(values);
    } catch (error: any) {
      toast.error("Something went wrong ...");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        {/* course image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <div>
              <FormItem>
                <PickCourseImage />
                <FormDescription className="">
                  Pick a course image for your course.
                </FormDescription>
              </FormItem>
            </div>
          )}
        />

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
                    className="bg-transparent"
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
                    placeholder="Write a description for your course ..."
                    {...field}
                  />
                </FormControl>
                <FormDescription className="">
                  This is your public display name.
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
                    className="bg-transparent"
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

        {/* price slider */}
        <FormField
          control={form.control}
          name="coursePrice"
          render={({ field }) => (
            <div>
              <FormItem className="flex flex-col mt-4">
                <FormLabel
                  htmlFor="priceMin"
                  className="text-gray-800 dark:text-gray-100"
                >
                  Course price ($)
                </FormLabel>
                <Input
                  type="number"
                  id="priceMin"
                  className="rounded-md border border-gray-700 dark:border-gray-300 shadow-sm focus:border-blue-500 bg-transparent focus:shadow-outline-blue px-3 py-2"
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

function PickCourseImage() {
  return (
    <label className="form-control w-full max-w-5xl">
      <div className="label">
        <span className="label-text">Pick a file</span>
        <span className="label-text-alt">Max size 5MB</span>
      </div>
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs"
      />
    </label>
  );
}

const AddCourseCategories = () => {
  const [categories, setCategories] = React.useState<string[]>([]);
  const inputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    // Focus the input element when the component mounts
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "," && inputRef.current?.value.trim()) {
        const newCategory = inputRef.current?.value.trim();
        setCategories([...categories, newCategory]);
        inputRef.current.value = "";
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [categories, inputRef]);

  const handleDeleteCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category)); // Delete category from your data source // deleteCategoryFromServer(category); // Replace with your actual deletion logic
  };

  return (
    <div className="flex flex-col justify-start items-start rounded overflow-hidden w-full sm:w-11/12 md:max-w-2xl ">
      {/* tags text */}
      <div className="flex flex-row justify-start items-center">
        <h1 className="my-4 text-base text-gray-800 mr-2 dark:text-gray-100">
          Course Categories
        </h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600 dark:text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* form */}
      <form action="#" className="">
        <div className="flex bg-gray-100 p-1 items-center w-full space-x-2 sm:space-x- rounded border border-gray-500 dark:bg-gray-700 dark:border-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 opacity-50 dark:text-gray-100 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <input
            className="bg-gray-100 outline-none text-sm sm:text-base w-full dark:bg-gray-700 dark:text-gray-200 border-transparent focus:border-transparent focus:ring-0"
            type="text"
            placeholder="e.g full stack development ..."
          />
        </div>
      </form>

      {/* categories */}
      <div className="my-3 flex flex-wrap -m-1">
        {categories.map((category) => (
          <span
            key={category}
            className="m-1 flex flex-wrap justify-between items-center text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded px-4 py-2 font-bold leading-loose cursor-pointer dark:text-gray-300"
          >
            {category}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 sm:h-4 sm:w-4 ml-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              viewBox="0 0 20 20"
              fill="currentColor"
              onClick={() => handleDeleteCategory(category)}
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
};
