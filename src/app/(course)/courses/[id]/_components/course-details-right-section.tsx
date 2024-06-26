"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { FaShare } from "react-icons/fa";
import { CartItem, Course, Review } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";
import { Button, Divider, Title } from "@tremor/react";
import { usePathname } from "next/navigation";
import { CourseEnrollButton } from "./course-enroll-button";
import { ApplyCouponCode } from "./apply-coupon-code";

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
      }
    );
  };

  return (
    <div className="w-auto h-auto hidden md:flex md:flex-col md:mt-12">
      <div className="mx-auto shadow-xl max-w-md w-full rounded-3xl dark:bg-slate-800 h-auto">
        <Image
          className="h-60 max-w-[28rem] w-full bg-slate-700 rounded-t-3xl relative left-0 right-0"
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
          <div className="flex py-auto items-center">
            <span className="text-blue-500 font-bold mr-1">$</span>
            <p className="text-lg font-semibold tracking-tight text-gray-950 dark:text-gray-200">
              {course?.coursePrice ?? 499}
            </p>
            <p className=" pl-1 text-xs dark:text-gray-400">
              (life time access)
            </p>
          </div>

          <div className="flex flex-col justify-start space-y-1 px-2 items-center w-full">
            <CourseEnrollButton course={course!} courseId={course?.courseId} />
            {/* <AddToCartButton course={course!} /> */}
          </div>

          <p className="text-center text-xs pt-2 text-gray-400 font-thin">
            30 Day money back guarantee
          </p>

          <Divider />

          {/* what you will get in this course */}
          <div className="space-y-2">
            <h3 className=" tracking-tight text-lg dark:text-xl text-gray-900 dark:text-gray-200 font-semibold">
              What you will get?
            </h3>
            <ul className="pl-4 flex flex-col text-gray-700 dark:text-gray-400 text-sm justify-between pb-2 list-disc space-y-2">
              <li>
                On demand{" "}
                {course?.courseDuration ? course?.courseDuration : "2 hour"} of
                video content
              </li>
              <li>Certificate for Completion</li>
              <li>A Complete Project Included</li>
              <li>
                <div className="flex justify-start items-center space-x-2">
                  <p>You will learn about: </p>
                  {course?.technologiesYouAreGoingToLearn ? (
                    course?.technologiesYouAreGoingToLearn
                      .slice(0, 2)
                      .map((tech: any, index: any) => {
                        return (
                          <div
                            className="px-2 py-1 flex items-center bg-slate-200 text-black rounded-md"
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
          <div className="flex space-x-4 justify-center items-center">
            <button
              onClick={() => {
                handleShare();
              }}
              className="flex justify-center items-center"
            >
              <FaShare />
              <p className="pl-2 hover:cursor-pointer text-xs text-gray-400 hover:text-blue-500  hover:underline">
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
