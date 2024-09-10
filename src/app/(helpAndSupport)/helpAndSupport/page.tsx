"use client";

import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";
import { Toaster } from "@/components/ui/toaster";
import { PhoneCallIcon } from "lucide-react";
import {
  FaAddressCard,
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { RiInstagramFill } from "react-icons/ri";
import axios from "axios";
import { useUserInfo } from "@/hooks/useUserInfo";

const HelpAndSupport = () => {
  return (
    <div className="h-full px-8 py-16">
      {/* <StoreHeader /> */}
      <div className="mx-auto h-full w-full max-w-7xl items-center space-y-8 p-4">
        <div className="mx-auto flex flex-col items-center justify-center pr-8 md:pr-0">
          <p className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Contact Us
          </p>
          <p className="mt-1 text-base">
            Any questions or remarks? Just write us a message!
          </p>
        </div>

        {/* mobile screen */}
        <div className="visible md:hidden">
          <div className="flex h-full w-auto flex-col rounded-xl bg-white p-4 dark:bg-zinc-800 md:h-[62vh] md:flex-row md:items-center md:justify-start">
            {/* left section */}
            <div className="h-auto w-auto space-y-6 rounded-xl bg-blue-50 p-8 text-blue-500 dark:bg-zinc-900">
              <div className="space-y-1">
                <p className="text-xl font-bold tracking-tight text-blue-600 dark:text-white md:text-2xl">
                  Contact Information
                </p>
                <p className="md:text-md text-sm text-blue-500 dark:text-gray-300 md:text-base">
                  Fill up the form and our Team will get back to you within 24
                  hours
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center justify-start space-x-2">
                  <div className="flex items-center justify-center text-blue-500">
                    <PhoneCallIcon size={18} />
                  </div>
                  <p className="md:text-md text-sm text-zinc-700 dark:text-white md:text-base">
                    +919649477393
                  </p>
                </li>
                <li className="flex items-center justify-start space-x-2">
                  <div className="flex items-center justify-center text-blue-500">
                    <MdEmail size={18} />
                  </div>
                  <p className="md:text-md text-sm text-zinc-700 dark:text-white md:text-base">
                    gitaman8481@gmail.com
                  </p>
                </li>
                <li className="flex items-center justify-start space-x-2">
                  <div className="flex items-center justify-center text-blue-500">
                    <FaAddressCard size={18} />
                  </div>
                  <p className="md:text-md text-sm text-zinc-700 dark:text-white md:text-base">
                    Churu, Rajasthan
                  </p>
                </li>
              </ul>

              <div className="flex justify-start">
                <SocialLinks />
              </div>
            </div>

            {/* right section */}
            <div className="overflow-y-auto p-4 md:ml-8">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* large screen */}
        <div className="hidden md:flex">
          <div className="flex h-full w-auto items-center justify-between space-x-6 rounded-xl bg-white p-4 dark:bg-zinc-800">
            {/* left section */}
            <div className="h-auto w-auto space-y-6 rounded-xl bg-blue-50 p-8 text-blue-500 dark:bg-zinc-900 md:flex md:h-[82vh] md:w-[40vw] md:flex-col md:items-start md:justify-between">
              <div className="space-y-1">
                <p className="text-xl font-bold tracking-tight text-blue-600 dark:text-white md:text-2xl">
                  Contact Information
                </p>
                <p className="md:text-md text-sm text-blue-500 dark:text-gray-300 md:text-base">
                  Fill up the form and our Team will get back to you within 24
                  hours
                </p>
              </div>

              <div className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center justify-start space-x-2">
                    <div className="flex items-center justify-center text-blue-500">
                      <PhoneCallIcon size={18} />
                    </div>
                    <p className="md:text-md text-sm text-zinc-700 dark:text-white md:text-base">
                      +919649477393
                    </p>
                  </li>
                  <li className="flex items-center justify-start space-x-2">
                    <div className="flex items-center justify-center text-blue-500">
                      <MdEmail size={18} />
                    </div>
                    <p className="md:text-md text-sm text-zinc-700 dark:text-white md:text-base">
                      gitaman8481@gmail.com
                    </p>
                  </li>
                  <li className="flex items-center justify-start space-x-2">
                    <div className="flex items-center justify-center text-blue-500">
                      <FaAddressCard size={18} />
                    </div>
                    <p className="md:text-md text-sm text-zinc-700 dark:text-white md:text-base">
                      Churu, Rajasthan
                    </p>
                  </li>
                </ul>

                <div className="flex justify-start">
                  <SocialLinks />
                </div>
              </div>
            </div>

            {/* right section */}
            <div className="overflow-y-auto p-4">
              <ContactForm />
            </div>
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
      <div className="flex justify-center space-x-4">
        <Link
          href="#"
          className="flex items-center justify-center p-2 text-blue-500 transition-all duration-300 hover:rounded-full hover:bg-blue-600 hover:text-white dark:hover:text-white"
        >
          <FaFacebook className="h-4 w-4" />
          <span className="sr-only">Facebook page</span>
        </Link>
        <Link
          href="#"
          className="flex items-center justify-center p-2 text-blue-500 transition-all duration-300 hover:rounded-full hover:bg-blue-600 hover:text-white dark:hover:text-white"
        >
          <FaDiscord className="h-4 w-4" />
          <span className="sr-only">Discord community</span>
        </Link>
        <Link
          href="#"
          className="flex items-center justify-center p-2 text-blue-500 transition-all duration-300 hover:rounded-full hover:bg-blue-600 hover:text-white dark:hover:text-white"
        >
          <FaXTwitter className="h-4 w-4" />
          <span className="sr-only">Twitter page</span>
        </Link>
        <Link
          href="#"
          className="flex items-center justify-center p-2 text-blue-500 transition-all duration-300 hover:rounded-full hover:bg-blue-600 hover:text-white dark:hover:text-white"
        >
          <FaGithub className="h-4 w-4" />
          <span className="sr-only">GitHub account</span>
        </Link>
        <Link
          href="#"
          className="flex items-center justify-center p-2 text-blue-500 transition-all duration-300 hover:rounded-full hover:bg-blue-600 hover:text-white dark:hover:text-white"
        >
          <RiInstagramFill className="h-4 w-4" />
          <span className="sr-only">Dribbble account</span>
        </Link>
      </div>
    </div>
  );
};

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, { message: "Phone number is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

const ContactForm = () => {
  const user = useUserInfo();
  const userId = user.user?.id!;

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
      await axios
        .post(`api/profile/${userId}/contact`, {
          fromEmail: values.email,
          toEmail: "gitaman8481@gmail.com",
          phone: values.phone,
          name: `${values.firstName} ${values.lastName}`,
          message: values.message,
        })
        .then(() => {
          console.log("Contact email sent successfully ...");
        })
        .catch((err) => {
          console.error("ERROR in [SENDING CONTACT EMAIL]: ", err.message);
        });
    } catch (error: any) {
      console.error("Error: ", error.message);
      toast.error("Something went wrong ...");
    }
  };

  return (
    <Form {...form}>
      <Toaster />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/*first name*/}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <div>
                <FormItem>
                  <FormLabel className="text-base text-zinc-800 dark:text-gray-100">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="bg-transparent dark:bg-zinc-900"
                      placeholder="Your First Name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="">
                    Enter your name please
                  </FormDescription>
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
                  <FormLabel className="text-base text-gray-800 dark:text-gray-100">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="bg-transparent dark:bg-zinc-900"
                      placeholder="Your Last Name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="">
                    Enter your name please
                  </FormDescription>
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
                  <FormLabel className="text-base text-gray-800 dark:text-gray-100">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="bg-transparent dark:bg-zinc-900"
                      placeholder="Your Email ..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="">
                    Enter your email please.
                  </FormDescription>
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
                      className="bg-transparent dark:bg-zinc-900"
                      placeholder="Your Phone Number ..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="">
                    Enter your phone number please.
                  </FormDescription>
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
                <FormLabel className="mb-4 text-base text-gray-800 dark:text-gray-100">
                  Your Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a your message here..."
                    className="bg-transparent dark:bg-zinc-900"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="">
                  Enter your message here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        {/* buttons */}
        <div className="mb-4 flex items-center gap-x-2">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full bg-blue-500 text-white disabled:bg-blue-300"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
