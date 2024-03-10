"use client";

import React from "react";
import Image from "next/image";
import { PhoneCallIcon } from "lucide-react";
import { MdEmail } from "react-icons/md";
import {
  FaAddressCard,
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import axios from "axios";
import { Textarea } from "@tremor/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Label } from "@radix-ui/react-label";
import { RiInstagramFill } from "react-icons/ri";

const HelpAndSupport = () => {
  return (
    <div className="px-8 py-16 ">
      {/* <StoreHeader /> */}
      <div className="items-center max-w-7xl w-full h-full mx-auto">
        <div className="flex flex-col justify-center items-center mx-auto pr-8">
          <p className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Contact Us
          </p>
          <p className="text-base mt-1">
            Any questions or remarks? Just write us a message!
          </p>
        </div>

        <div className="flex justify-start items-center  w-auto h-[62vh] mt-6 rounded-xl bg-white p-4">
          {/* left section */}
          <div className="h-[60vh] w-auto space-y-6 bg-blue-50 rounded-xl text-blue-500">
            <div className="px-8 pt-8">
              <p className="text-2xl font-bold tracking-tight text-blue-600">
                Contact Information
              </p>
              <p className="text-md text-base  text-blue-500 ">
                Fill up the form and our Team will get back to <br /> you within
                24 hours
              </p>
            </div>

            <ul className="px-8 space-y-4">
              <li className="flex justify-start items-center ">
                {/* icon */}
                <div className="p-2 flex justify-center items-center text-white bg-blue-600 rounded-full">
                  <PhoneCallIcon size={18} />
                </div>
                <p className="text-md text-base ml-2 text-blue-500 ">
                  +919649477393
                </p>
              </li>
              <li className="flex justify-start items-center ">
                <div className="p-2 flex justify-center items-center text-white bg-blue-600 rounded-full">
                  <MdEmail size={18} />
                </div>
                <p className="text-md text-base ml-2 text-blue-500 ">
                  gitaman8481@gmail.com
                </p>
              </li>
              <li className="flex justify-start items-center ">
                {/* icon */}
                <div className="p-2 flex  justify-center items-center text-white bg-blue-600 rounded-full">
                  <FaAddressCard size={18} />
                </div>
                <p className="text-md text-base ml-2 text-blue-500 ">
                  Churu, Rajasthan
                </p>
              </li>
            </ul>

            <div className="pl-8 flex justify-start">
              <SocialLinks />
            </div>
          </div>

          {/* right section */}
          <div className="overflow-y-auto p-4 ml-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;

const SocialLinks = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
        <Link
          href="#"
          className="text-blue-500 transition-all duration-300 p-2 hover:rounded-full flex justify-center items-center hover:bg-blue-600 hover:text-white dark:hover:text-white"
        >
          <FaFacebook className="w-4 h-4" />
          <span className="sr-only">Facebook page</span>
        </Link>
        <Link
          href="#"
          className="text-blue-500 transition-all duration-300 p-2 hover:rounded-full flex justify-center items-center hover:bg-blue-600 hover:text-white dark:hover:text-white"
        >
          <FaDiscord className="w-4 h-4" />
          <span className="sr-only">Discord community</span>
        </Link>
        <Link
          href="#"
          className="text-blue-500 transition-all duration-300 p-2 hover:rounded-full flex justify-center items-center hover:bg-blue-600 hover:text-white dark:hover:text-white"
        >
          <FaXTwitter className="w-4 h-4" />
          <span className="sr-only">Twitter page</span>
        </Link>
        <Link
          href="#"
          className="text-blue-500 transition-all duration-300 p-2 hover:rounded-full flex justify-center items-center hover:bg-blue-600 hover:text-white dark:hover:text-white"
        >
          <FaGithub className="w-4 h-4" />
          <span className="sr-only">GitHub account</span>
        </Link>
        <Link
          href="#"
          className="text-blue-500 transition-all duration-300 p-2 hover:rounded-full flex justify-center items-center hover:bg-blue-600 hover:text-white dark:hover:text-white"
        >
          <RiInstagramFill className="w-4 h-4" />
          <span className="sr-only">Dribbble account</span>
        </Link>
      </div>
    </div>
  );
};

enum GenderEnum {
  female = "female",
  male = "male",
  other = "other",
}

interface IFormInput {
  name: string;
  email: string;
  phone: string;
  message: GenderEnum;
}

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, { message: "Phone number is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

const ContactForm = () => {
  // const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // const response = await axios.post("/api/course", values);
      // router.push(`/instructor/createdCourses/${response.data.id}`);
      toast.success("Form Submitted successfully ...");
      console.log(values);
    } catch (error: any) {
      toast.error("Something went wrong ...");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => onSubmit)} className="space-y-4 ">
        <div className="grid grid-cols-2 gap-4">
          {/*first name*/}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <div>
                <FormItem>
                  <FormLabel className="text-base text-gray-800 dark:text-gray-100">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="bg-transparent"
                      placeholder="Your First Name"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription className="">
                  Enter your name please
                </FormDescription> */}
                </FormItem>
              </div>
            )}
          />

          {/*last name*/}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <div>
                <FormItem>
                  <FormLabel className=" text-base text-gray-800 dark:text-gray-100">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="bg-transparent"
                      placeholder="Your Last Name"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription className="">
                  Enter your name please
                </FormDescription> */}
                </FormItem>
              </div>
            )}
          />

          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <div>
                <FormItem>
                  <FormLabel className=" text-base text-gray-800 dark:text-gray-100">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="bg-transparent"
                      placeholder="Your Email ..."
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription className="">
                  Enter your email please.
                </FormDescription> */}
                </FormItem>
              </div>
            )}
          />

          {/* number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <div>
                <FormItem>
                  <FormLabel className="text-base text-gray-800 dark:text-gray-100">
                    Phone No.
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="bg-transparent"
                      placeholder="Your Phone Number ..."
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription className="">
                  Enter your phone number please.
                </FormDescription> */}
                </FormItem>
              </div>
            )}
          />
        </div>

        {/* message  */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <div>
              <FormItem className="">
                <FormLabel className="mb-4 text-base text-gray-800 dark:text-gray-100 ">
                  Your Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a your message here..."
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription className="">
                  Enter your message here.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        {/* buttons */}
        <div className="flex items-center gap-x-2 mb-4">
          {/* <Link href="/">
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </Link> */}
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="disabled:bg-blue-300 w-full bg-blue-500 text-white"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
