"use client";

import React, { useEffect } from "react";
import Image from "next/image";

import { IoPeopleCircleSharp } from "react-icons/io5";
import { CartItem, Course, Review } from "@prisma/client";
import { CourseBreadcrumb } from "../../_components/sections/course-breadcrumb";
import { RatingStars } from "../../_components/rating-stars";
import { WhatYouWillLearn } from "../../_components/sections/what-you-will-learn";
import { CourseContent } from "../../_components/course-content";
import { WhoThisCourseIsFor } from "../../_components/sections/who-this-course-is-for";
import { Prerequisits } from "../../_components/sections/prerequisits";
import { CourseEnrollButton } from "./course-enroll-button";
import { ApplyCouponCode } from "./apply-coupon-code";
import { CourseDescription } from "./course-description";


export const CourseDetailsLeftSection = ({ course }: { course: Course }) => {
  return (
    <div className="md:pt-[50px] flex flex-col text-red items-start justify-center text-start text-xl">
      {/* course breadcrumb */}
      <div className="hidden md:flex">
        <CourseBreadcrumb course={course!} />
      </div>

      {/* course image only for mobile screen */}
      <div className="pr-8 my-4 max-w-screen-2xl w-full">
        <Image
          className="visible md:hidden h-60 w-full bg-slate-700 rounded-xl shadow-md"
          src={
            course?.courseImage ??
            "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210301154221/System-Design-Live-Course-By-GeeksforGeeks.png"
          }
          alt={course?.courseTitle || "Alt"}
          width={400}
          height={30}
          style={{
            objectFit: "cover",
          }}
          quality={100}
        />
      </div>

      {/* course title, course duration, rating stars, no of reviews, no of enrolled students badge */}
      <div className="space-y-6">
        {/* course title, course duration*/}
        <div className="space-y-2">
          {/* title */}
          <h1 className="dark:text-white tracking-tight text-gray-800 font-semibold text-2xl md:text-4xl">
            {course?.courseTitle}
          </h1>

          {/* duration of course */}
          <p className="text-sm">{course?.courseDuration!} on demand content</p>
        </div>

        {/* rating stars, no of reviews, no of enrolled students badge */}
        <div className="flex flex-row justify-start items-start md:items-center">
          {/* rating stars, no of reviews */}
          <div className="flex justify-start items-center">
            {/* rating stars */}
            <RatingStars courseStarRatings={course?.avgStarRatings!} />

            {/* number of reviews, TODO: make no of reviews to show dynamic numbers */}
            <p className="mr-1 md:mx-1 cursor-pointer text-xs font-medium text-blue-500 dark:text-blue-600">{`(${239} Reviews)`}</p>
          </div>

          {/* number of students enrolled badge*/}
          <div className="flex flex-row items-center">
            <div className="mx-1 flex rounded-lg  justify-center items-center text-xs font-medium text-white space-x-[4px] bg-slate-900 dark:bg-blue-600 px-2 py-1 ">
              <IoPeopleCircleSharp size={16} />
              <span className="text-xs">{`${1456} enrolled`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* course instructor */}
      <div className="flex justify-start items-center space-x-1 my-2 ">
        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium tracking-tight">
          Course Instructor:
        </p>
        <p className="text-gray-800 dark:text-white text-sm font-medium tracking-tight cursor-pointer hover:underline transition-all duration-300">
          {course?.courseCreator!}
        </p>
      </div>

      {/* <p className="text-xs font-thin mb-2 dark:text-400 dark:opacity-50">
          Last updated on {course?.updatedAt?.toString().split("T")[0]}
        </p> */}

      {/* only for mobile screen */}
      <div className="visible md:hidden pr-8 py-4 md:pr-0 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-blue-500">Buy course</p>
          <p className="text-xs text-gray-700 dark:text-gray-400">
            Get access to this course forever when you buy it. Learn at your own
            pace, anytime
          </p>
        </div>

        <p className="font-bold text-2xl text-gray-800 dark:text-white tracking-tight">
          ${course?.coursePrice!}
        </p>

        <div className="flex flex-col justify-center items-center space-y-2">
          <CourseEnrollButton course={course!} courseId={course?.courseId} />
          <ApplyCouponCode />
        </div>
      </div>

      {/* course description */}
      <div className="my-4 md:my-0 md:mt-16 md:mb-8 w-full">
        <CourseDescription
          courseDescription={
            course?.courseDescription ??
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat"
          }
        />
      </div>

      {/* what you will learn */}
      <WhatYouWillLearn whatYouWillLearn={course?.whatYouWillLearn} />

      {/* course content (chapters, sections) */}
      <CourseContent courseId={course?.courseId} />

      {/* who this course is for? */}
      <WhoThisCourseIsFor thisCourseIsFor={course?.thisCourseIsFor} />

      {/* pre-requisits */}
      <Prerequisits prerequisits={course?.prerequisits} />
    </div>
  );
};
