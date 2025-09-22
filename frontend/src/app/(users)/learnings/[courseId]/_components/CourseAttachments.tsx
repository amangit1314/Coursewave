"use client";

import React from "react";
import Link from "next/link";
import CourseAttachmentItem from "./CourseAttachmentItem";

type CourseAttachmentsProps = {
  courseAttachments: any[];
};

const CourseAttachments = ({ courseAttachments }: CourseAttachmentsProps) => {
  console.log("Course Attachments: ", courseAttachments);

  return (
    <div>
      {courseAttachments && courseAttachments.length > 0 ? (
        <ul className="w-full list-disc py-4 font-normal md:ml-4 md:p-0 md:py-2">
          {courseAttachments.map((attachment: any) => (
            <CourseAttachmentItem
              key={attachment.id}
              id={attachment.id}
              url={attachment.url}
              name={attachment.name}
            />
          ))}
        </ul>
      ) : (
        <ul className="text-md md:text-md font-noraml ml-4 w-auto list-disc py-4 text-base text-gray-700 dark:text-gray-400 md:p-0 md:py-2">
          <li className="pb-1">
            <Link href="">
              Connect with Martin on YouTube, Instagram, Spotify, and his
              website.
            </Link>
          </li>
          <li className="pb-1">
            <Link href="">
              Discover Martin’s best-selling book, “Modern Rock Guitar Soloing:
              Master Intermediate and Advanced Lead Guitar Concepts, Licks,
              Theory, & Technique for Rock Soloing & Improvisation”
            </Link>
          </li>
          <li>
            <Link href="">Resources PDF</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CourseAttachments;
