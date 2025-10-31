"use client";

import React from "react";
import Link from "next/link";
import { Paperclip, ExternalLink, Download, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCourseAttachments } from "@/hooks/useCourses";

type CourseAttachmentsProps = {
  courseId: string;
};

const CourseAttachments = ({ courseId }: CourseAttachmentsProps) => {
  const { data: courseAttachments = [], isLoading: isAttachmentsLoading } =
    useCourseAttachments(courseId);

  const hasAttachments = courseAttachments && courseAttachments.length > 0;

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <FileText className="text-red-500" size={16} />;
      case "doc":
      case "docx":
        return <FileText className="text-blue-500" size={16} />;
      case "xls":
      case "xlsx":
        return <FileText className="text-green-500" size={16} />;
      case "zip":
      case "rar":
        return <FileText className="text-yellow-500" size={16} />;
      default:
        return <FileText className="text-gray-500" size={16} />;
    }
  };

  const getFileSize = (size?: string) => {
    if (!size) return null;
    return (
      <span className="text-xs text-gray-400 dark:text-gray-500">{size}</span>
    );
  };

  const defaultAttachments = [
    {
      id: "1",
      name: "Connect with Martin on YouTube, Instagram, Spotify, and his website",
      url: "#",
      type: "link",
    },
    {
      id: "2",
      name: "Discover Martin's book: Modern Rock Guitar Soloing",
      url: "#",
      type: "link",
    },
    {
      id: "3",
      name: "Resources PDF",
      url: "#",
      type: "pdf",
    },
  ];

  const attachmentsToShow = hasAttachments
    ? courseAttachments
    : [];
    // defaultAttachments;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-900/80">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2 dark:bg-blue-900/20">
            <Paperclip className="text-lg text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Course Attachments
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {attachmentsToShow.length} resource
              {attachmentsToShow.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Attachments List */}
      <div className="space-y-3">
        <AnimatePresence>
          {attachmentsToShow.map((attachment, index) => (
            <motion.div
              key={attachment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <Link
                href={attachment.url}
                target={
                  attachment.url.startsWith("http") ? "_blank" : undefined
                }
                rel={
                  attachment.url.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                <div className="group relative rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-blue-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="rounded-lg bg-gray-50 p-2 group-hover:bg-blue-50 dark:bg-zinc-700 dark:group-hover:bg-blue-900/20 transition-colors">
                        {"type" in attachment && attachment.type === "link" ? (
                          <ExternalLink
                            className="text-gray-600 group-hover:text-blue-600 dark:text-gray-400"
                            size={16}
                          />
                        ) : (
                          getFileIcon(attachment.name)
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-gray-100">
                            {attachment.name}
                          </h4>
                          {attachment.url.startsWith("http") && (
                            <ExternalLink
                              size={12}
                              className="text-gray-400 flex-shrink-0"
                            />
                          )}
                        </div>
                        {/* {"fileSize" in attachment &&
                          getFileSize(attachment.fileSize)} */}
                      </div>
                    </div>

                    <div className="ml-4 opacity-0 transition-all group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-2">
                      <div className="rounded-full bg-blue-50 p-2 dark:bg-blue-900/20">
                        <Download
                          className="text-blue-600 dark:text-blue-400"
                          size={14}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State - Only show if no attachments provided */}
      {!hasAttachments && attachmentsToShow.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-12 text-center"
        >
          <div className="mx-auto mb-4 rounded-full bg-gray-100 p-4 dark:bg-zinc-800 w-fit">
            <Paperclip className="text-3xl text-gray-400 dark:text-gray-500" />
          </div>
          <h4 className="mb-2 font-medium text-gray-600 dark:text-gray-400">
            No attachments available
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Course resources will appear here
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CourseAttachments;
