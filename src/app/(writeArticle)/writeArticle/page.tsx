"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { RiExternalLinkLine, RiImageAddFill } from "react-icons/ri";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import useUserInfo from "@/hooks/use-user-info";
import { Input } from "@/components/ui/input";
import { absoluteUrl } from "@/utils/utils";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required",
  }),
  image: z.string().optional(),
  content: z.string(),
});

const WriteArticlePage = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const user = useUserInfo();
  const userId = user?.user?.id!;
  console.log("User id in the write article page: ", userId);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",
      content: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await axios
      .post(`api/articles`, {
        authorId: userId,
        title: values.title,
        content: values.content,
        estimatedReadingTime: "10 min",
        thumbnailUrl: values.image ?? "https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets/green-3d.jpg",
      })
      .then((response) => {
        console.log("Write Article Form Values: ", values);
        console.log("Response data after creating article: ", response);
        toast.success("Article Created successfully ...");
        router.push(absoluteUrl('/articles'));
      })
      .catch((err: any) => {
        console.log("Error in creating course: ", err.message);
        toast.error(`Error: ${err.message}`);
      });
  };

  return (
    <div className="px-4 md:px-8 py-24">
      <div className="flex justify-start items-center space-x-2 dark:text-zinc-900 text-xs mb-8">
        <IoMdArrowRoundBack className="text-zinc-900 dark:text-white" />
        <p className="text-zinc-900 dark:text-gray-300 text-xs">
          Back to articles
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <div>
                <FormItem className="mt-8 flex flex-col">
                  <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
                    Article Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Title"
                      className="bg-transparent overflow-hidden outline-none cursor-gray-300 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="">
                    Enter the title of the article here ...
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />

          {/* article field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <div>
                <FormItem className="mt-8">
                  <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
                    Article Content
                  </FormLabel>
                  <FormControl>
                    <div className="justify-start items-start  py-4">
                      <div className="flex justify-start items-start">
                        <button type="button" onClick={() => setOpen(!open)}>
                          <IoAddCircleOutline className="h-8 w-8" />
                        </button>

                        {open && (
                          <div className="flex justify-start items-center space-x-[5px] mx-2">
                            <button
                              type="button"
                              className="flex justify-center items-center border bg-transparent border-stroke rounded-full p-2 cursor-pointer transition-all duration-300 hover:border-blue-400 h-8 w-8 hover:bg-blue-100 hover:text-blue-400"
                            >
                              <RiImageAddFill size={18} />
                            </button>
                            <button
                              type="button"
                              className="flex justify-center items-center border bg-transparent border-stroke rounded-full p-2 cursor-pointer transition-all duration-300 hover:border-blue-400 h-8 w-8 hover:bg-blue-100 hover:text-blue-400"
                            >
                              <AiOutlineVideoCameraAdd size={18} />
                            </button>
                            <button
                              type="button"
                              className="flex justify-center items-center border bg-transparent border-stroke rounded-full p-2 cursor-pointer transition-all duration-300 hover:border-blue-400 h-8 w-8 hover:bg-blue-100 hover:text-blue-400"
                            >
                              <RiExternalLinkLine size={18} />
                            </button>
                          </div>
                        )}
                      </div>

                      <ReactQuill
                        theme="bubble"
                        className="w-full dark:text-white text-[28px]"
                        placeholder="Tell your story ..."
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="">
                    Write your of the article here ...
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />

          {/* cancel and create button */}
          <div className="flex items-center gap-x-2 mb-4">
            <Link href="/">
              <Button variant="ghost" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WriteArticlePage;
