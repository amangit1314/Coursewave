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
import { motion } from "framer-motion";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import { useUserStore } from "@/zustand/userStore";
import { dmSans } from "@/lib/config/fonts";

const HelpAndSupport = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { user } = useUserStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      {/* Header with Theme Toggle */}
      {/* <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 dark:border-zinc-700">
        <div className="flex items-center justify-between px-4 py-3 md:px-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${dmSans.className} text-lg tracking-tight font-bold text-blue-600 dark:text-blue-400`}
          >
            Help & Support
          </motion.h1>
          <ThemeModeToggle />
        </div>
      </div> */}

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h2
            className={`${dmSans.className} mb-4 mt-24 md:mt-0 text-3xl font-bold tracking-tighter text-gray-900 dark:text-white md:text-4xl lg:text-5xl`}
          >
            How can we help you?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Get in touch with our support team. We're here to help you with any
            questions, technical issues, or feedback about CourseWave.
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
                <h3
                  className={`${dmSans.className} mb-2 text-xl font-semibold text-gray-900 dark:text-white`}
                >
                  Contact Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Reach out to us through any of these channels. We typically
                  respond within 24 hours.
                </p>
              </div>

              <div className="space-y-4">
                <ContactItem
                  icon={<PhoneCallIcon className="h-5 w-5" />}
                  title="Phone Support"
                  value="+91 9649477393"
                  description="Available Mon-Fri, 9AM-6PM IST"
                />
                <ContactItem
                  icon={<MailIcon className="h-5 w-5" />}
                  title="Email Support"
                  value="support@coursewave.com"
                  description="24/7 email support"
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
                  value="Within 24 hours"
                  description="For all inquiries"
                />
              </div>

              <div className="mt-8">
                <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                  Follow us on social media
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
                    <h3
                      className={`${dmSans.className} mb-2 text-xl font-semibold text-gray-900 dark:text-white`}
                    >
                      Send us a message
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Fill out the form below and we'll get back to you as soon
                      as possible.
                    </p>
                  </div>
                  {/* <ContactForm onSuccess={() => setIsSubmitted(true)} /> */}
                  {user ? (
                    <ContactForm onSuccess={() => setIsSubmitted(true)} />
                  ) : (
                    <p className="text-center text-sm text-gray-500">
                      Please log in to send us a message.
                    </p>
                  )}
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
          className="my-16"
        >
          <div className="text-center">
            <h3
              className={`${dmSans.className} mb-8 text-2xl font-bold text-gray-900 dark:text-white`}
            >
              Frequently Asked Questions
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FAQCard
              question="How do I reset my password?"
              answer="Go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your inbox."
            />
            <FAQCard
              question="How do I enroll in a course?"
              answer="Browse our course catalog, select a course you're interested in, and click 'Enroll Now'. Complete the payment process to gain access."
            />
            <FAQCard
              question="Can I get a refund?"
              answer="We offer a 30-day money-back guarantee for all courses. Contact our support team if you're not satisfied with your purchase."
            />
            <FAQCard
              question="How do I become an instructor?"
              answer="Click on 'Become an Instructor' in your profile settings. Fill out the application form and our team will review your submission."
            />
            <FAQCard
              question="Is there a mobile app?"
              answer="Currently, we're working on mobile apps for iOS and Android. For now, our platform is fully responsive and works great on mobile browsers."
            />
            <FAQCard
              question="How do I contact technical support?"
              answer="Use the contact form above or email us directly at support@coursewave.com. Include detailed information about your issue for faster resolution."
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
      <h4
        className={`${dmSans.className} text-sm font-semibold text-gray-900 dark:text-white`}
      >
        {title}
      </h4>
      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-300">{description}</p>
    </div>
  </div>
);

const SocialLinks = () => {
  const socialLinks = [
    { icon: <FaGithub className="h-5 w-5" />, href: "https://github.com/amangit1314", label: "GitHub" },
    { icon: <FaXTwitter className="h-5 w-5" />, href: "https://twitter.com/Hulk131469", label: "Twitter" },
    { icon: <FaLinkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/aman-soni1", label: "LinkedIn" },
    {
      icon: <RiInstagramFill className="h-5 w-5" />,
      href: "https://www.instagram.com/soni.amanic/",
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
    className="rounded-xl bg-white p-6 shadow-sm ring-1 group ring-gray-200 transition-shadow hover:bg-blue-500 hover:text-white hover:shadow-md dark:bg-zinc-800 dark:hover:bg-blue-500  dark:ring-zinc-700"
  >
    <h4
      className={`${dmSans.className} mb-3 font-semibold text-gray-900 dark:text-white group-hover:text-white dark:group-hover:text-white`}
    >
      {question}
    </h4>
    <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-300 dark:group-hover:text-gray-300">{answer}</p>
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
      Thank you for reaching out. We'll get back to you within 24 hours.
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

export default HelpAndSupport;


const ContactForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useUserStore();
  const userId = user?.id; // safe optional access

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
    if (!userId) {
      toast.error("You must be logged in to send a message.");
      return;
    }

    try {
      const response = await axios.post(`/api/profile/${userId}/contact`, {
        fromEmail: values.email,
        toEmail: "support@coursewave.com",
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
