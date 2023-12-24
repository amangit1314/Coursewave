"use client";

import React from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import axios from "axios";
import { Textarea } from "@tremor/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required",
  }),
});

function CreateCourse() {
  return (
    <div className="flex flex-col md:items-center md:justify-start max-w-5xl mx-auto dark:bg-black dark:bg-opacity-80 pt-[80px] min-h-screen h-full p-6">
      <div className="flex flex-col">
        <p className="text-2xl font-semibold">Name your Course</p>
        <p className="text-base text-slate-600 dark:text-slate-400">
          What would you like to name your course? Don&apos;t worry you can
          change this later.
        </p>
      </div>

      <div className="my-[2rem]">
        <CreateCourseForm />
      </div>
    </div>
  );
}

export default CreateCourse;

function CreateCourseForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/course", values);
      router.push(`/instructor/createdCourses/${response.data.id}`);
      console.log(values);
    } catch (error: any) {
      toast.error('Something went wrong ...')
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <div>
              {/* Image upload */}
              <FormItem>
                <InputFile />
              </FormItem>

              {/* for coursename */}
              <FormItem>
                <FormLabel className="my-4 text-base">Course Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. 'Full Stack Bootcamp'"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="pt-2">
                  What will you teach in this course?
                </FormDescription>
                <FormMessage />
              </FormItem>

              {/* for course description */}
              <FormItem>
                <FormLabel className="my-4 text-base">
                  Course Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a description for your course ..."
                    {...field}
                  />
                </FormControl>
                <FormDescription className="pt-2">
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>

              {/* creator name */}
              <FormItem>
                <FormLabel className="my-4 text-base">
                  Instructor Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Instructor Name" {...field} />
                </FormControl>
                <FormDescription className="pt-2">
                  This is the instrctor name which will be displayed.
                </FormDescription>
                <FormMessage />
              </FormItem>

              {/* price slider */}
              <FormItem className="flex flex-col mt-4">
                <PriceRange />
                <FormDescription className="pt-2">
                  We recommend to keep price between 1 to 500$ to ensure
                  affordability.
                </FormDescription>
              </FormItem>
            </div>
          )}
        />

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

export function InputFile() {
  return (
    // <div className="grid w-full max-w-sm items-center gap-1.5">
    //   <Label htmlFor="picture">Picture</Label>
    //   <Input id="picture" type="file" />
    // </div>
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Pick a file</span>
        <span className="label-text-alt">Max size 5MB</span>
      </div>
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs"
      />
      {/* <div className="label">
        <span className="label-text-alt">Max 5MB</span>
        <span className="label-text-alt">Alt label</span>
      </div> */}
    </label>
  );
}

type PriceRangeFormValues = {
  price: {
    min: number;
    max: number;
  };
};

const PriceRange = () => {
  const {
    register,
    formState: { errors },
  } = useForm<PriceRangeFormValues>();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="priceMin">Course price ($)</label>
      <input
        type="number"
        id="priceMin"
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:shadow-outline-blue px-3 py-2"
        min={0}
        max={500}
        {...register("price", { required: true })}
      />
      {errors.price && (
        <span className="text-red-500 font-sm">{errors.price.message}</span>
      )}
    </div>
  );
};
