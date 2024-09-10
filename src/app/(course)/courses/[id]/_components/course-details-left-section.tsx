"use client";

import React, { useEffect } from "react";
import Image from "next/image";

import { IoPeopleCircleSharp } from "react-icons/io5";
import { CartItem, Course, Review } from "@prisma/client";
import CourseBreadcrumb from "../../_components/sections/course-breadcrumb";
import WhatYouWillLearn from "../../_components/sections/what-you-will-learn";
import CourseContent from "../../_components/course-content";
import WhoThisCourseIsFor from "../../_components/sections/who-this-course-is-for";
import Prerequisits from "../../_components/sections/prerequisits";
import CourseEnrollButton from "./course-enroll-button";
import ApplyCouponCode from "./apply-coupon-code";
import CourseDescription from "./course-description";

import RatingStars from "../../_components/rating-stars";

export const CourseDetailsLeftSection = ({ course }: { course: Course }) => {
  return (
    <div className="text-red flex flex-col items-start justify-center text-start text-xl md:pt-[50px]">
      {/* course breadcrumb */}
      <div className="hidden md:flex">
        <CourseBreadcrumb course={course!} />
      </div>

      {/* course image only for mobile screen */}
      <div className="my-4 w-full max-w-screen-2xl pr-8">
        <Image
          className="visible h-60 w-full rounded-xl bg-slate-700 shadow-md md:hidden"
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
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-white md:text-4xl">
            {course?.courseTitle}
          </h1>

          {/* duration of course */}
          <p className="text-sm">{course?.courseDuration!} on demand content</p>
        </div>

        {/* rating stars, no of reviews, no of enrolled students badge */}
        <div className="flex flex-row items-start justify-start md:items-center">
          {/* rating stars, no of reviews */}
          <div className="flex items-center justify-start">
            {/* rating stars */}
            <RatingStars courseStarRatings={course?.avgStarRatings!} />

            {/* number of reviews, TODO: make no of reviews to show dynamic numbers */}
            <p className="mr-1 cursor-pointer text-xs font-medium text-blue-500 dark:text-blue-600 md:mx-1">{`(${239} Reviews)`}</p>
          </div>

          {/* number of students enrolled badge*/}
          <div className="flex flex-row items-center">
            <div className="mx-1 flex items-center justify-center space-x-[4px] rounded-lg bg-slate-900 px-2 py-1 text-xs font-medium text-white dark:bg-blue-600">
              <IoPeopleCircleSharp size={16} />
              <span className="text-xs">{`${1456} enrolled`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* course instructor */}
      <div className="my-2 flex items-center justify-start space-x-1">
        <p className="text-sm font-medium tracking-tight text-gray-700 dark:text-gray-300">
          Course Instructor:
        </p>
        <p className="cursor-pointer text-sm font-medium tracking-tight text-gray-800 transition-all duration-300 hover:underline dark:text-white">
          {course?.courseCreator!}
        </p>
      </div>

      {/* <p className="text-xs font-thin mb-2 dark:text-400 dark:opacity-50">
          Last updated on {course?.updatedAt?.toString().split("T")[0]}
        </p> */}

      {/* only for mobile screen */}
      <div className="visible space-y-4 py-4 pr-8 md:hidden md:pr-0">
        <div className="space-y-2">
          <p className="text-xs font-medium text-blue-500">Buy course</p>
          <p className="text-xs text-gray-700 dark:text-gray-400">
            Get access to this course forever when you buy it. Learn at your own
            pace, anytime
          </p>
        </div>

        <p className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">
          ${course?.coursePrice!}
        </p>

        <div className="flex flex-col items-center justify-center space-y-2">
          <CourseEnrollButton course={course!} courseId={course?.courseId} />
          <ApplyCouponCode />
        </div>
      </div>

      {/* course description */}
      <div className="my-4 w-full md:my-0 md:mb-8 md:mt-16">
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
