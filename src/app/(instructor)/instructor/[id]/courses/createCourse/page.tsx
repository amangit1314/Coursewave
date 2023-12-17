"use client";

import React from "react";
import CreateCourseForm from "../_components/create-course-form";
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
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@tremor/react";

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

function CreateCourse() {
  return (
    <div className="flex flex-col dark:bg-black dark:bg-opacity-80 pt-[80px] min-h-screen h-full px-[2rem]">
      <div className="flex flex-col">
        <p className="text-2xl font-semibold">Name your Course</p>
        <p className="text-base dark:text-gray-400">
          What would you like to name your course? Dont worry you can change
          this later.{" "}
        </p>
      </div>

      <div className="mt-[2rem]">
        <Create />
      </div>
    </div>
  );
}

export default CreateCourse;

function Create() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              {/* Image upload */}
              <InputFile />

              {/* for coursename */}
              <div>
                <FormLabel>Coursename</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </div>

              {/* for coursedescription */}
              <div>
                <FormLabel className="pt-2">Course Description</FormLabel>
                <FormControl>
                  {/* <Input placeholder="shadcn" {...field} /> */}
                  <Textarea
                    placeholder="Write a description for your course ..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </div>

              {/* creator name */}
              <div>
                <FormLabel className="pt-2">Creator Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is the instrctor name which will be displayed.
                </FormDescription>
                <FormMessage />
              </div>

              {/* price slider */}
              <div className="flex flex-col mt-4">
                <PriceRange />
                <FormDescription className="pt-4">
                  We recommend to keep price between 1 to 100$ to ensure
                  affordability.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function InputFile() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" />
    </div>
  );
}

export function PriceSlider() {
  return (
    <div>
      <div className="flex flex-col mx-auto items-center h-32 justify-center">
        <div className="py-1  w-64 relative min-w-full">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="absolute h-2 rounded-full bg-teal-600 w-0"
              style={{ width: "58.5714%" }}
            />
            <div
              className="absolute h-4 flex items-center justify-center w-4 rounded-full bg-white shadow border border-gray-300 -ml-2 top-0 cursor-pointer"
              unselectable="on"
              onSelect={() => false}
              style={{ left: "58.5714%" }}
            >
              <div className="relative -mt-2 w-1">
                <div
                  className="absolute z-40 opacity-100 bottom-100 mb-2 left-0 min-w-full"
                  style={{ marginLeft: "-20.5px" }}
                >
                  <div className="relative shadow-md">
                    <div className="bg-black -mt-8 text-white truncate text-xs rounded py-1 px-4">
                      92
                    </div>
                    <svg
                      className="absolute text-black w-full h-2 left-0 top-100"
                      x="0px"
                      y="0px"
                      viewBox="0 0 255 255"
                      xmlSpace="preserve"
                    >
                      <polygon
                        className="fill-current"
                        points="0,0 127.5,127.5 255,0"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute text-gray-800 -ml-1 bottom-0 left-0 -mb-6">
              1
            </div>
            <div className="absolute text-gray-800 -mr-1 bottom-0 right-0 -mb-6">
              150
            </div>
          </div>
        </div>
      </div>
    </div>
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
      <label htmlFor="priceMin">Minimum price ($)</label>
      <input
        type="number"
        id="priceMin"
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:shadow-outline-blue px-3 py-2"
        min={0}
        max={100}
        {...register("price.min", { required: true })}
      />
      {errors.price && errors.price.min && (
        <span className="text-red-500 font-sm">{errors.price.min.message}</span>
      )}

      <label htmlFor="priceMax">Maximum price ($)</label>
      <input
        type="number"
        id="priceMax"
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:shadow-outline-blue px-3 py-2"
        min={ 0}
        max={100}
        {...register("price.max", { required: true })}
      />
      {errors.price && errors.price.max && (
        <span className="text-red-500 font-sm">{errors.price.max.message}</span>
      )}
    </div>
  );
};
