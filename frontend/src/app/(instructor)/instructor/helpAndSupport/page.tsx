"use client";

import React, { useState } from "react";
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
import {
  PhoneCallIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  SendIcon,
  Loader2Icon,
} from "lucide-react";
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaXTwitter,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import axios from "axios";

import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import { motion } from "framer-motion";
import { useUserStore } from "@/zustand/userStore";

const HelpAndSupport = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      {/* Header with Theme Toggle */}
      {/* <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 dark:border-zinc-700">
        <div className="flex items-center justify-between px-4 py-3 md:px-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-blue-600 dark:text-blue-400"
          >
            Instructor Support
          </motion.h1>
          <ThemeModeToggle />
        </div>
      </div> */}

      <div className="mx-auto max-w-7xl px-4 pt-36 pb-8 md:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
            Instructor Support Center
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Need help with course creation, payments, or platform features? Our
            dedicated instructor support team is here to help you succeed.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 dark:bg-zinc-800 dark:ring-zinc-700">
              <div className="mb-6">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Instructor Support
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Priority support for instructors. We typically respond within
                  12 hours.
                </p>
              </div>

              <div className="space-y-4">
                <ContactItem
                  icon={<PhoneCallIcon className="h-5 w-5" />}
                  title="Instructor Hotline"
                  value="+91 9649477393"
                  description="Available Mon-Fri, 9AM-6PM IST"
                />
                <ContactItem
                  icon={<MailIcon className="h-5 w-5" />}
                  title="Instructor Email"
                  value="instructors@coursewave.com"
                  description="Priority email support"
                />
                <ContactItem
                  icon={<MapPinIcon className="h-5 w-5" />}
                  title="Office Location"
                  value="Churu, Rajasthan, India"
                  description="Main headquarters"
                />
                <ContactItem
                  icon={<ClockIcon className="h-5 w-5" />}
                  title="Response Time"
                  value="Within 12 hours"
                  description="For instructor inquiries"
                />
              </div>

              <div className="mt-8">
                <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                  Join our instructor community
                </h4>
                <SocialLinks />
              </div>
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 dark:bg-zinc-800 dark:ring-zinc-700">
              {!isSubmitted ? (
                <>
                  <div className="mb-6">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      Contact Instructor Support
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Fill out the form below and our instructor support team
                      will get back to you as soon as possible.
                    </p>
                  </div>
                  <ContactForm onSuccess={() => setIsSubmitted(true)} />
                </>
              ) : (
                <SuccessMessage onReset={() => setIsSubmitted(false)} />
              )}
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <div className="text-center">
            <h3 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
              Instructor FAQ
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FAQCard
              question="How do I create my first course?"
              answer="Go to your instructor dashboard and click 'Create Course'. Follow the step-by-step wizard to set up your course content, pricing, and requirements."
            />
            <FAQCard
              question="When do I receive payments?"
              answer="Payments are processed monthly. You'll receive your earnings on the 15th of each month for sales made in the previous month."
            />
            <FAQCard
              question="What are the platform fees?"
              answer="CourseWave takes a 15% commission on course sales. This covers platform hosting, payment processing, and marketing support."
            />
            <FAQCard
              question="How do I promote my courses?"
              answer="Use our built-in marketing tools, social media integration, and email campaigns. We also feature top instructors on our homepage."
            />
            <FAQCard
              question="Can I update my course content?"
              answer="Yes! You can update your course content anytime. Students will be notified of new content and updates."
            />
            <FAQCard
              question="What support do you provide?"
              answer="We provide technical support, course optimization advice, marketing assistance, and 1-on-1 consultations for top instructors."
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ContactItem = ({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) => (
  <div className="flex items-start space-x-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
        {title}
      </h4>
      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

const SocialLinks = () => {
  const socialLinks = [
    { icon: <FaFacebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <FaXTwitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <FaLinkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <FaYoutube className="h-5 w-5" />, href: "#", label: "YouTube" },
    { icon: <FaDiscord className="h-5 w-5" />, href: "#", label: "Discord" },
    {
      icon: <RiInstagramFill className="h-5 w-5" />,
      href: "#",
      label: "Instagram",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {socialLinks.map((link, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={link.href}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
            aria-label={link.label}
          >
            {link.icon}
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

const FAQCard = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md dark:bg-zinc-800 dark:ring-zinc-700"
  >
    <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
      {question}
    </h4>
    <p className="text-sm text-gray-600 dark:text-gray-300">{answer}</p>
  </motion.div>
);

const SuccessMessage = ({ onReset }: { onReset: () => void }) => (
  <div className="text-center">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
      <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
    </div>
    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
      Message sent successfully!
    </h3>
    <p className="mb-6 text-gray-600 dark:text-gray-300">
      Thank you for reaching out. Our instructor support team will get back to
      you within 12 hours.
    </p>
    <Button onClick={onReset} variant="outline">
      Send another message
    </Button>
  </div>
);

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, { message: "Phone number is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

const ContactForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useUserStore();
  const userId = user?.id;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(`/api/profile/${userId}/contact`, {
        fromEmail: values.email,
        toEmail: "instructors@coursewave.com",
        phone: values.phone,
        name: `${values.firstName} ${values.lastName}`,
        subject: values.subject,
        message: values.message,
      });

      if (response.data.status) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        form.reset();
        onSuccess();
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error: any) {
      console.error("Error sending contact email:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <Form {...form}>
      <Toaster />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    className="h-11 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    placeholder="Enter your first name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    className="h-11 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    placeholder="Enter your last name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    type="email"
                    className="h-11 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    placeholder="Enter your email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    className="h-11 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    placeholder="Enter your phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Subject Field */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  className="h-11 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  placeholder="What is this about?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message Field */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting}
                  rows={6}
                  className="border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  placeholder="Tell us how we can help you..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="h-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:opacity-50 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700"
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <SendIcon className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default HelpAndSupport;
