"use client";

import React, { useState } from "react";
import { PhoneCallIcon, MailIcon, MapPinIcon, ClockIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "@/zustand/userStore";
import { dmSans } from "@/lib/config/fonts";
import ContactItem from "./_components/ContactItem";
import SocialLinks from "./_components/SocialLinks";
import ContactForm from "./_components/ContactForm";
import SuccessMessage from "./_components/SuccessMessage";
import FAQCard from "./_components/FAQCard";

const HelpAndSupport = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { user } = useUserStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      {/* Header with Theme Toggle */}
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
                  value="amansoni53453@gmail.com"
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

export default HelpAndSupport;
