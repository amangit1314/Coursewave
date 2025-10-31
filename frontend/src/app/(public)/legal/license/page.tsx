// app/license/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Scale, 
  FileText, 
  Users, 
  Lock, 
  Globe,
  Code,
  BookOpen,
  Shield,
  Heart
} from "lucide-react";

export default function LicensePage() {
  const licenseSections = [
    {
      icon: Users,
      title: "User Rights",
      items: [
        "Access and use the platform for personal learning",
        "Enroll in courses and complete them at your own pace",
        "Participate in community discussions and forums",
        "Download course materials for personal use",
        "Receive certificates upon course completion"
      ]
    },
    {
      icon: Lock,
      title: "User Restrictions",
      items: [
        "Do not share your account credentials",
        "Do not redistribute or resell course content",
        "Do not use platform content for commercial purposes",
        "Do not attempt to reverse engineer the platform",
        "Do not upload malicious or illegal content"
      ]
    },
    {
      icon: Code,
      title: "Intellectual Property",
      items: [
        "Course content belongs to respective instructors",
        "Platform code and design are proprietary",
        "User-generated content remains user property",
        "We retain rights to platform improvements",
        "Brand names and logos are trademarked"
      ]
    },
    {
      icon: Shield,
      title: "Liability",
      items: [
        "We provide the platform 'as is' without warranties",
        "Not liable for learning outcomes or career results",
        "Not responsible for user-generated content",
        "May modify or discontinue services at any time",
        "Total liability limited to fees paid in last 6 months"
      ]
    }
  ];

  const openSourceLibraries = [
    { name: "React", license: "MIT", url: "https://reactjs.org/" },
    { name: "Next.js", license: "MIT", url: "https://nextjs.org/" },
    { name: "Tailwind CSS", license: "MIT", url: "https://tailwindcss.com/" },
    { name: "TypeScript", license: "Apache 2.0", url: "https://www.typescriptlang.org/" },
    { name: "Prisma", license: "Apache 2.0", url: "https://www.prisma.io/" },
    { name: "Lucide Icons", license: "ISC", url: "https://lucide.dev/" },
    { name: "Framer Motion", license: "MIT", url: "https://www.framer.com/motion/" }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            License Agreement
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start space-x-4">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                TL;DR - Quick Summary
              </h3>
              <p className="text-blue-700 dark:text-blue-400">
                CourseWave is a proprietary learning platform. You can use it for personal learning, 
                but cannot redistribute content or code. Instructors own their course materials, 
                and we provide the platform as a service. For full details, read the complete agreement below.
              </p>
            </div>
          </div>
        </motion.div>

        {/* License Sections */}
        <div className="space-y-8">
          {licenseSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>

                <ul className="space-y-3">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            );
          })}
        </div>

        {/* Open Source Attribution */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Open Source Attribution
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                CourseWave is built with amazing open source technologies
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openSourceLibraries.map((lib, index) => (
              <motion.a
                key={lib.name}
                href={lib.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {lib.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {lib.license} License
                  </div>
                </div>
                <Globe className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Legal Contact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 text-white"
        >
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Legal Inquiries</h3>
            <p className="text-gray-300 mb-4 max-w-md mx-auto">
              For legal questions, partnership inquiries, or copyright concerns
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Email:</strong> legal@coursewave.com
              </div>
              <div>
                <strong>Response Time:</strong> 2-3 business days
              </div>
              <div>
                <strong>Address:</strong> 123 Learning Street, Education City, EC 10101
              </div>
            </div>
          </div>
        </motion.section>

        {/* Acceptance Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            By using CourseWave, you acknowledge that you have read, understood, 
            and agree to be bound by this License Agreement.
          </p>
        </motion.div>
      </div>
    </div>
  );
}