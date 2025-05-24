"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { FaShare } from "react-icons/fa";
import { CartItem, Course, Review } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";
import { Button, Divider, Title } from "@tremor/react";
import { usePathname } from "next/navigation";
import CourseEnrollButton from "./course-enroll-button";
import ApplyCouponCode from "./apply-coupon-code";

export const CourseDetailsRightSection = ({ course }: { course: Course }) => {
  const pathname = usePathname();

  const notify = (content: string) => toast(`${content}`);

  const handleShare = () => {
    const currentUrl = pathname;
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        console.log("URL copied to clipboard");
        notify("✔ URL copied successfully!");
      },
      (err) => {
        console.error("Failed to copy URL:", err);
        notify("❌ Failed to copy URL!");
      },
    );
  };

  return (
    <div className="hidden h-auto w-auto md:mt-12 md:flex md:flex-col">
      <div className="mx-auto h-auto w-full max-w-md rounded-3xl shadow-xl dark:bg-slate-800">
        <Image
          className="relative left-0 right-0 h-60 w-full max-w-[28rem] rounded-t-3xl bg-slate-700"
          src={
            course?.courseImage ??
            "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210301154221/System-Design-Live-Course-By-GeeksforGeeks.png"
          }
          alt={course?.courseTitle || "Alt"}
          width={448}
          height={30}
          style={{
            objectFit: "cover",
          }}
          quality={100}
        />

        <div className="p-4">
          <div className="py-auto flex items-center">
            <span className="mr-1 font-bold text-blue-500">$</span>
            <p className="text-lg font-semibold tracking-tight text-gray-950 dark:text-gray-200">
              {course?.coursePrice ?? 499}
            </p>
            <p className="pl-1 text-xs dark:text-gray-400">
              (life time access)
            </p>
          </div>

          <div className="flex w-full flex-col items-center justify-start space-y-1 px-2">
            <CourseEnrollButton course={course!} courseId={course?.courseId} />
            {/* <AddToCartButton course={course!} /> */}
          </div>

          <p className="pt-2 text-center text-xs font-thin text-gray-400">
            30 Day money back guarantee
          </p>

          <Divider />

          {/* what you will get in this course */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-xl dark:text-gray-200">
              What you will get?
            </h3>
            <ul className="flex list-disc flex-col justify-between space-y-2 pb-2 pl-4 text-sm text-gray-700 dark:text-gray-400">
              <li>
                On demand{" "}
                {course?.courseDuration ? course?.courseDuration : "2 hour"} of
                video content
              </li>
              <li>Certificate for Completion</li>
              <li>A Complete Project Included</li>
              <li>
                <div className="flex items-center justify-start space-x-2">
                  <p>You will learn about: </p>
                  {course?.technologiesYouAreGoingToLearn ? (
                    course?.technologiesYouAreGoingToLearn
                      .slice(0, 2)
                      .map((tech: any, index: any) => {
                        return (
                          <div
                            className="flex items-center rounded-md bg-slate-200 px-2 py-1 text-black"
                            key={index}
                          >
                            {tech}
                          </div>
                        );
                      })
                  ) : (
                    <div></div>
                  )}
                  <p className="text-xs">etc.</p>
                </div>
              </li>
            </ul>
          </div>

          <Divider />

          <Toaster />

          {/* share, gift, apply coupon code */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => {
                handleShare();
              }}
              className="flex items-center justify-center"
            >
              <FaShare />
              <p className="pl-2 text-xs text-gray-400 hover:cursor-pointer hover:text-blue-500 hover:underline">
                Share
              </p>
            </button>

            <ApplyCouponCode />
          </div>
        </div>
      </div>
    </div>
  );
};
