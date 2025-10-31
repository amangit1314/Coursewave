import { dmSans, poppins } from "@/lib/config/fonts";
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import { CheckCircle, Sparkles } from "lucide-react";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";

type Props = {};

const benefits = [
  "Access to 500+ expert-led courses",
  "Lifetime access to all content",
  "Certificate of completion",
  "Community support & networking",
  "Mobile & desktop learning",
  "30-day money-back guarantee",
];

const RegisterLeftSection = (props: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-center space-y-8 p-4 md:p-6"
    >
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 transition-opacity">
            <Image
              src="/assets/images/logo/coursewave-favicon-color.png"
              alt="CourseWave Logo"
              width={32}
              height={32}
              priority
              className="h-8 w-8 sm:h-9 sm:w-9"
            />
            <p
              className={`${dmSans.className} text-lg font-extrabold capitalize tracking-tight text-blue-500 sm:text-xl`}
            >
              Coursewave
            </p>
          </div>

          <ThemeModeToggle />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 dark:bg-blue-900/30">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span
            className={`${poppins.className} text-xs font-medium text-blue-700 dark:text-blue-300`}
          >
            Modern Learning Platform
          </span>
        </div>

        <div className="space-y-4">
          <h1
            className={`${dmSans.className} text-4xl tracking-tighter font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl`}
          >
            Join Coursewave{" "}
            <span className="bg-gradient-to-r tracking-tighter from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              for Free
            </span>
          </h1>
          <p
            className={`${poppins.className} text-lg text-gray-600 dark:text-gray-300`}
          >
            Start your learning journey today and unlock unlimited possibilities
            with our comprehensive courses.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <span
            className={`${poppins.className} text-sm text-gray-500 dark:text-gray-400`}
          >
            Join 50,000+ learners worldwide
          </span>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-4">
        <h3
          className={`${dmSans.className} text-lg font-semibold text-gray-900 dark:text-white`}
        >
          What you'll get:
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span
                className={`${poppins.className} text-sm text-gray-600 dark:text-gray-300`}
              >
                {benefit}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Social Proof */}
      {/* <div className="rounded-xl bg-white/50 p-6 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div
              className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}
            >
              50K+
            </div>
            <div
              className={`${poppins.className} text-sm text-gray-600 dark:text-gray-400`}
            >
              Active Learners
            </div>
          </div>
          <div className="text-center">
            <div
              className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}
            >
              500+
            </div>
            <div
              className={`${poppins.className} text-sm text-gray-600 dark:text-gray-400`}
            >
              Courses
            </div>
          </div>
          <div className="text-center">
            <div
              className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}
            >
              95%
            </div>
            <div
              className={`${poppins.className} text-sm text-gray-600 dark:text-gray-400`}
            >
              Success Rate
            </div>
          </div>
        </div>
      </div> */}
    </motion.div>
  );
};

export default RegisterLeftSection;
