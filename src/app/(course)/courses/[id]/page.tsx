"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { FaShare } from "react-icons/fa";
import { RiCoupon3Line } from "react-icons/ri";
import { FaAngleRight, FaCircleCheck, FaStar } from "react-icons/fa6";
import { HiOutlineShoppingCart, HiShoppingCart } from "react-icons/hi";
import { CourseNavbar } from "../_components/course-navbar";
import { CartItem, Course, Review } from "@prisma/client";
import { CourseContent } from "../_components/course-content";
import { Prerequisits } from "../_components/sections/prerequisits";
import { InstructorCard } from "../_components/sections/instructor-info";
import { WhatYouWillLearn } from "../_components/sections/what-you-will-learn";
import { CourseRatings } from "../_components/sections/ratings/course-ratings";
import { WhoThisCourseIsFor } from "../_components/sections/who-this-course-is-for";
import { CourseBreadcrumb } from "../_components/sections/course-breadcrumb";
import { MoreIntructorCreatedCourses } from "../_components/sections/more-instructor-created-courses";
import { Footer } from "@/components/LandingPage/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { generateUid } from "@/helpers/id_helper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { absoluteUrl } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import toast, { Toaster } from "react-hot-toast";
import { Button, Divider, Title } from "@tremor/react";
import { usePathname } from "next/navigation";
import useUserInfo from "@/hooks/use-user-info";
import useCourseInfo from "@/hooks/use-course-info";
import { useCartStore } from "@/zustand/cartStore";
import { SiCrowdsource } from "react-icons/si";
import { GoProjectTemplate } from "react-icons/go";
import useInstructorInfo from "@/hooks/use-instructor-info";
import { VscPreview } from "react-icons/vsc";
import CourseEnrollButton from "./_components/course-enroll-button";

function CoursePreview({ params }: { params: { id: string } }) {
  const courseId = params?.id;
  const courseData = useCourseInfo(courseId);
  const course: Course = courseData.courseInfo;

  console.log(
    `Course data for courseId:${courseId} in course id detail page: `,
    course
  );

  if (courseData.isLoading) {
    return (
      <>
        <div className="visible flex mx-auto items-center justify-center md:hidden align-middle my-auto">
          <CourseSmallScreenSkeleton />
        </div>
        <div className="hidden md:flex md:items-center md:justify-center md:mx-auto">
          <CourseBigScreenSkeleton />
        </div>
      </>
    );
  }

  if (courseData.error) {
    return (
      <div className="justify-center items-center">
        <p className="flex align-middle items-center justify-center space-x-4 text-red-400">
          ERROR: <span>{courseData.error.message}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <div className="flex flex-col pb-[6rem] overflow-x-hidden">
        {/* course navbar */}
        <div className=" inset-y-0 w-full z-50 px-4 md:px-10 py-2 ">
          <CourseNavbar courseName={course.courseTitle} />
        </div>

        {/* course breadcrumb */}
        {/* <div className="visible md:hidden pl-8">
          <CourseBreadcrumb course={course!} />
        </div> */}

        {/* course content */}
        <div className="md:grid md:grid-cols-2 md:max-w-7xl pl-8 md:pl-[6rem] ">
          {/* left part */}
          <CourseDetailsLeftSection course={course!} />

          {/* right part */}
          <div className="sticky">
            <CourseDetailsRightSection course={course!} />
          </div>
        </div>

        {/* course ratings */}
        <div className="max-w-7xl md:mt-4 px-2 md:px-[6rem] flex justify-start items-center w-full ">
          <CourseRatings
            courseId={courseId}
            avgStarRatings={course?.avgStarRatings ?? 4.9}
          />
        </div>

        {/* Instructor Info */}
        <div className="max-w-7xl w-full dark:bg-transparent border-y flex flex-col justify-start mt-4 px-8 md:px-[6rem] py-8">
          <h3 className="mb-4 text-xl text-gray-800 dark:text-slate-200 tracking-tight font-semibold">
            Meet Your Instructor
          </h3>

          {/* instructor card */}
          <InstructorCard instructorId={course?.instructorID!} />

          {/* more created courses by instructor */}
          <MoreIntructorCreatedCourses
            instructorId={course?.instructorID!}
            instructorName={course?.courseCreator!}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CoursePreview;

// ------------------------------------- SKELETONS ------------------------------------

function CourseSmallScreenSkeleton() {
  return (
    <div className="space-y-4 min-h-screen min-w-screen py-8">
      <Skeleton className="h-[220px] w-full rounded-2xl" />
      <div className="h-full col-span-2 w-full space-y-8">
        <div className="flex space-x-2">
          <Skeleton className="h-4 w-[100px] rounded-full" />
          <FaAngleRight />
          <Skeleton className="h-4 w-[100px] rounded-full" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-[300px] rounded-md" />
          </div>

          <div className="flex space-x-2 justify-start items-center">
            <FaStar className="text-yellow-500" />
            <Skeleton className="h-4 w-[100px] rounded-full" />
            <Skeleton className="h-4 w-[230px] rounded-full" />
            <Skeleton className="h-4 w-[150px] rounded-md" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-[260px] rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 mt-2 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-[320px] rounded-full" />
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div>
            <Skeleton className="h-6 w-40  rounded-md" />
          </div>

          <div className="space-y-2">
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-[260px] rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 mt-2 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-[320px] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseBigScreenSkeleton() {
  return (
    <div className=" min-h-screen min-w-screen flex justify-center items-center py-8">
      <div className="grid grid-cols-3 justify-between space-x-8 items-start min-h-screen h-full border border-stroke rounded-3xl p-4">
        {/* left */}
        <div className="h-full col-span-2 w-full space-y-8">
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-[100px] rounded-full" />
            <FaAngleRight />
            <Skeleton className="h-4 w-[100px] rounded-full" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-[300px] rounded-md" />
            </div>

            <div className="flex space-x-2 justify-start items-center">
              <FaStar className="text-yellow-500" />
              <Skeleton className="h-4 w-[100px] rounded-full" />
              <Skeleton className="h-4 w-[230px] rounded-full" />
              <Skeleton className="h-4 w-[150px] rounded-md" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-[260px] rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 mt-2 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-[320px] rounded-full" />
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div>
              <Skeleton className="h-6 w-40  rounded-md" />
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-[260px] rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 mt-2 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-[320px] rounded-full" />
            </div>
          </div>
        </div>

        {/* right */}
        <div className="h-full col-span-1 space-y-2 max-w-[22rem] w-full rounded-3xl border border-stroke p-4 ">
          <Skeleton className="h-[220px] w-full rounded-2xl" />
          <div className="flex justify-start items-center space-x-2">
            <span className="text-blue-500 font-bold">$</span>
            <Skeleton className="h-4 w-12 rounded-md" />{" "}
            <Skeleton className="h-4 w-40 rounded-full" />
          </div>

          <Skeleton className="h-10 w-full rounded-md" />

          <div className="space-y-8">
            <div className="flex justify-center items-center mx-auto">
              <Skeleton className="h-4 w-40 rounded-full" />
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <Skeleton className="h-6 w-40 rounded-md" />
              </div>

              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-4 mx-auto">
              <Skeleton className="h-4 w-40 rounded-full" />
              <Skeleton className="h-4 w-40 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InstructorBadgeLoadingSkeleton() {
  return (
    <div className="flex justify-start items-center space-x-4">
      <Skeleton className="rounded-full h-20 w-20" />

      <div className="space-y-2">
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-3 w-full rounded-md" />
      </div>
    </div>
  );
}

//* ------------------------------------- SECTIONS -------------------------------------

function CourseDetailsLeftSection({ course }: { course: Course }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<String | null>(null);

  const instructorId = course?.instructorID!;
  console.log(
    `Instructor id in the course details left section: ${instructorId} `
  );
  const instructor = useInstructorInfo(instructorId).instructor;

  if (loading) {
    return <InstructorBadgeLoadingSkeleton />;
  }

  if (error) {
    return <div>ERROR: {error}</div>;
  }

  return (
    <div className="mt-[3.125rem] flex flex-col text-red items-start justify-center text-start text-xl space-y-6 overflow-x-hidden">
      {/* course title, description, ratings,*/}
      <div className="space-y-4 mr-8">
        <div className=" rounded-3xl py-4 pl-4 pr-4 md:pr-4 backdrop-blur-sm bg-gradient-to-br from-purple-500 to-blue-500 dark:from-zinc-900 dark:to-blue-500 md:w-[590px] space-y-4 md:mr-0 w-full">
          <div className="space-y-1">
            {/* course breadcrumb */}
            <div className="">
              <CourseBreadcrumb course={course!} />
            </div>

            {/* course image only for mobile screen */}
            <div className="visible md:hidden pr-8 my-4 max-w-screen-2xl w-full mr-8">
              <Image
                className="visible md:hidden h-60 w-full bg-slate-700 rounded-3xl shadow-md"
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

            {/* title */}
            {/* text-gray-800 */}
            <h1 className="dark:text-white tracking-tight text-white  font-semibold text-2xl md:text-4xl">
              {course?.courseTitle}
            </h1>

            {/* rating stars */}
            <div className="flex flex-row justify-start items-start md:items-center">
              <div className="flex items-center justify-start space-x-1">
                {/* text-zinc-800 */}
                <div className="text-sm font-semibold tracking-tight text-white  dark:text-white">
                  {course?.avgStarRatings?.toFixed(1) ?? 4.8}
                </div>
                <FaStar className="text-yellow-500" size={12} />
              </div>

              {/* number of students enrolled badge */}
              <div className="flex flex-row items-center">
                <div className="mx-1 flex rounded-full  justify-center items-center text-xs font-medium text-white space-x-[4px] bg-slate-900 dark:bg-blue-600 px-2 py-1 ">
                  <VscPreview size={16} />
                  <span className="text-xs">{`${156} reviews`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* instructor info tile */}
          <div className=" flex flex-row justify-start flex-shrink-0 w-auto transition-all duration-200 rounded-lg cursor-pointer align-center items-center md:items-start backdrop-filter-blur ">
            <Image
              className="items-center bg-white rounded-full w-12 h-12"
              src={instructor?.instructorProfilePicUrl!}
              alt={instructor?.instructorName}
              height={12}
              width={12}
              unoptimized
            />

            <div className="w-full ml-1 px-2 pt-1 md:pt-0 my-1 md:my-0 flex flex-col">
              <div className="flex justify-between items-center py-auto rating">
                {/* text-zinc-800  */}
                <p className="text-md text-base tracking-tight font-semibold text-gray-100 dark:text-gray-200">
                  {instructor?.instructorName}
                </p>
              </div>

              {/* text-gray-700 */}
              <p className="text-sm text-gray-300  dark:text-gray-400">
                Instructor of this course
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* no of reviews and projects */}
      <div className="flex justify-start space-x-6 items-center md:max-w-7xl w-full pr-8 md:pr-0 md:mr-0">
        {/* backdrop-blur-sm bg-gradient-to-r from-purple-500 to-red-400 */}
        {/* dark:from-purple-700 dark:to-[#64E9FF] */}
        <div
          className="p-4 space-y-2 h-50 rounded-3xl backdrop-blur-sm bg-gradient-to-br from-purple-500 to-blue-500  dark:from-zinc-900 dark:to-blue-500
         "
        >
          <div className="space-y-1">
            <SiCrowdsource size={24} className="text-white" />
            <p className="text-4xl font-bold tracking-tighter text-white">
              200+
            </p>
          </div>

          <p className="text-gray-200 text-md text-base">
            Number of peoples enrolled in this course just after launch
          </p>
        </div>

        <div className="p-4 space-y-2 h-50 rounded-3xl backdrop-blur-sm bg-gradient-to-br from-purple-500 to-blue-500 dark:from-zinc-900 dark:to-blue-500">
          <div className="space-y-1">
            <GoProjectTemplate size={24} className="text-white" />
            <p className="text-4xl font-bold tracking-tighter text-white">5</p>
          </div>

          <p className=" text-gray-200 text-md text-base">
            We will build 5 big projects together and will learn a lot of
            concepts.
          </p>
        </div>
      </div>

      {/* only for mobile screen */}
      <div className="visible md:hidden pr-8 mr-8 py-4 md:pr-0 space-y-4">
        <div className="space-y-2 mr-8">
          <p className="text-sm font-medium text-blue-500">Buy course</p>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Get access to this course forever when you buy it. Learn at your own
            pace, anytime
          </p>
        </div>

        <p className="font-bold text-2xl text-gray-800 dark:text-white tracking-tight">
          ${course?.coursePrice!}
        </p>

        <div className="flex flex-col justify-center items-center space-y-2 mr-4">
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
}

function CourseDetailsRightSection({ course }: { course: Course }) {
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
}

//? --------------------------------------- COMPONENTS ----------------------------------

function CourseDescription({
  courseDescription,
}: {
  courseDescription: string;
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const truncatedDescription = courseDescription.slice(0, 170);
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  return (
    <div className="w-full h-auto space-y-4 mt-2">
      <h3 className="tracking-tight text-xl font-semibold text-zinc-800 dark:text-slate-200">
        About This Course
      </h3>
      {/* <p
        className={`text-md text-base md:text-md md:p-0 md:pr-[8rem] w-auto line-clamp-5 md:line-clamp-3 font-noraml text-gray-700 dark:text-gray-400 ${
          isExpanded ? "text-clamp-4" : ""
        }`}
      >
        {truncatedDescription}
      </p> */}

      <p
        className={`${
          showFullDescription ? "" : "line-clamp-4"
        } text-md text-base text-slate-700 dark:text-gray-400 py-4 md:py-2 md:text-md md:p-0 w-auto   ${
          showFullDescription ? "" : "overflow-hidden"
        }`}
      >
        {courseDescription}
      </p>

      {courseDescription.length > 250 && (
        <div
          className="expand-toggle cursor-pointer text-blue-500 text-md text-base"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? "Show Less" : "Show More"}
        </div>
      )}
    </div>
  );
}

function AddToCartButton({ course }: { course: Course }) {
  const user = useUserInfo();
  const cartItemId = generateUid();

  const [isInCart, setIsInCart] = React.useState(false);
  const { addToCart: handleAddToCart, removeFromCart: handleRemoveFromCart } =
    useCartStore();

  const cartItemToAdd: CartItem = {
    id: `cart_${cartItemId}`,
    userId: user.user?.id,
    courseId: course?.courseId,
    courseName: course?.courseTitle,
    courseInstructorName: course?.instructorName ?? "",
    courseImageUrl: course?.courseImage ?? "./assets/images/images1.jpg",
    coursePrice: course?.coursePrice!,
    quantity: 1,
    createdAt: null,
    updatedAt: null,
  };

  const toggleIsInCart = () => {
    if (isInCart) {
      handleRemoveFromCart(course?.courseId!);
    } else {
      handleAddToCart(course!, user.user?.id!);
      setIsInCart(!isInCart);
    }
  };

  return (
    <Button
      onClick={toggleIsInCart}
      size="sm"
      color="blue"
      className={`mt-2 text-center text-white bg-blue-500 w-[26rem] rounded-md hover:bg-blue-700 text-sm  font-semibold m-2 ${isInCart ? "bg-blue-600" : "bg-blue-500"}`}
    >
      {isInCart ? (
        <div className="flex justify-center items-center">
          <HiShoppingCart size={22} /> Remove from cart
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <HiOutlineShoppingCart size={22} /> Add to cart
        </div>
      )}
    </Button>
  );
}

function ApplyCouponCode() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center">
          <RiCoupon3Line />
          <p className="pl-2 hover:cursor-pointer text-xs text-gray-400 hover:text-blue-500  hover:underline">
            Apply Coupon
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-white font-semibold">
            Enter coupon code below
          </DialogTitle>
          <DialogDescription>
            Enter coupon code below and press apply when you are done. It will
            applied to the course price.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center">
            <Label className="text-left text-gray-800 dark:text-white font-semibold mb-1">
              Coupon Code
            </Label>
            <Input
              id="couponCode"
              value="Enter coupon code ..."
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
