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
import useUserInfo from "@/hooks/use-user-info";

const HelpAndSupport = () => {
  return (
    <div className="px-8 py-16 h-full ">
      {/* <StoreHeader /> */}
      <div className="items-center max-w-7xl w-full h-full mx-auto p-4 space-y-8">
        <div className="flex flex-col justify-center items-center mx-auto pr-8 md:pr-0">
          <p className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Contact Us
          </p>
          <p className="text-base mt-1">
            Any questions or remarks? Just write us a message!
          </p>
        </div>

        {/* mobile screen */}
        <div className="visible md:hidden">
          <div className="flex flex-col md:flex-row md:justify-start md:items-center dark:bg-zinc-800  w-auto h-full md:h-[62vh] rounded-xl bg-white p-4">
            {/* left section */}
            <div className="h-auto p-8 w-auto space-y-6 bg-blue-50 dark:bg-zinc-900 rounded-xl text-blue-500">
              <div className=" space-y-1">
                <p className="text-xl md:text-2xl font-bold tracking-tight text-blue-600 dark:text-white">
                  Contact Information
                </p>
                <p className="text-sm md:text-md md:text-base text-blue-500 dark:text-gray-300 ">
                  Fill up the form and our Team will get back to you within 24
                  hours
                </p>
              </div>

              <ul className=" space-y-3">
                <li className="flex justify-start space-x-2 items-center ">
                  <div className="flex justify-center items-center text-blue-500">
                    <PhoneCallIcon size={18} />
                  </div>
                  <p className="text-sm md:text-md md:text-base text-zinc-700 dark:text-white ">
                    +919649477393
                  </p>
                </li>
                <li className="flex justify-start space-x-2  items-center ">
                  <div className="flex justify-center items-center text-blue-500">
                    <MdEmail size={18} />
                  </div>
                  <p className="text-sm md:text-md md:text-base text-zinc-700 dark:text-white ">
                    gitaman8481@gmail.com
                  </p>
                </li>
                <li className="flex justify-start space-x-2  items-center ">
                  <div className="flex justify-center items-center text-blue-500">
                    <FaAddressCard size={18} />
                  </div>
                  <p className="text-sm md:text-md md:text-base text-zinc-700 dark:text-white ">
                    Churu, Rajasthan
                  </p>
                </li>
              </ul>

              <div className=" flex justify-start">
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
          <div className="flex justify-between items-center dark:bg-zinc-800  w-auto h-full rounded-xl bg-white p-4 space-x-6">
            {/* left section */}
            <div className="md:flex md:flex-col md:justify-between md:items-start h-auto md:h-[82vh] p-8 w-auto md:w-[40vw] space-y-6 bg-blue-50 dark:bg-zinc-900 rounded-xl text-blue-500">
              <div className=" space-y-1">
                <p className="text-xl md:text-2xl font-bold tracking-tight text-blue-600 dark:text-white">
                  Contact Information
                </p>
                <p className="text-sm md:text-md md:text-base text-blue-500 dark:text-gray-300 ">
                  Fill up the form and our Team will get back to you within 24
                  hours
                </p>
              </div>

              <div className="space-y-6">
                <ul className=" space-y-3">
                  <li className="flex justify-start space-x-2 items-center ">
                    <div className="flex justify-center items-center text-blue-500">
                      <PhoneCallIcon size={18} />
                    </div>
                    <p className="text-sm md:text-md md:text-base text-zinc-700 dark:text-white ">
                      +919649477393
                    </p>
                  </li>
                  <li className="flex justify-start space-x-2  items-center ">
                    <div className="flex justify-center items-center text-blue-500">
                      <MdEmail size={18} />
                    </div>
                    <p className="text-sm md:text-md md:text-base text-zinc-700 dark:text-white ">
                      gitaman8481@gmail.com
                    </p>
                  </li>
                  <li className="flex justify-start space-x-2  items-center ">
                    <div className="flex justify-center items-center text-blue-500">
                      <FaAddressCard size={18} />
                    </div>
                    <p className="text-sm md:text-md md:text-base text-zinc-700 dark:text-white ">
                      Churu, Rajasthan
                    </p>
                  </li>
                </ul>

                <div className=" flex justify-start">
                  <SocialLinks />
                </div>
              </div>
            </div>

            {/* right section */}
            <div className="overflow-y-auto p-4 ">
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
      <div className="flex space-x-4 justify-center ">
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
        .post(`/api/profile/${userId}/contact`, {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <FormLabel className=" text-base text-gray-800 dark:text-gray-100">
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
                  <FormLabel className=" text-base text-gray-800 dark:text-gray-100">
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
                <FormLabel className="mb-4 text-base text-gray-800 dark:text-gray-100 ">
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
        <div className="flex items-center gap-x-2 mb-4">
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
