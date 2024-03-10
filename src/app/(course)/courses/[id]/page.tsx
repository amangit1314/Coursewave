"use client";

import { Course, Review } from "@prisma/client";
import React, { useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { RatingStars } from "../_components/rating-stars";
import WhatYouWillLearn from "../_components/sections/what-you-will-learn";
import Description from "../_components/sections/course-description";
import WhoThisCourseIsFor from "../_components/sections/who-this-course-is-for";
import Prerequisits from "../_components/sections/prerequisits";
import InstructorCard from "../_components/sections/instructor-info";
import CourseRatings from "../_components/sections/ratings/course-ratings";
import CourseContent from "../_components/course-content";
import { IoPeopleCircleSharp } from "react-icons/io5";
import Image from "next/image";
import { HiOutlineShoppingCart, HiShoppingCart } from "react-icons/hi";
import { FaShare } from "react-icons/fa";
import { RiCoupon3Line } from "react-icons/ri";
import { Button, Divider, Title } from "@tremor/react";
import { usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import CourseNavbar from "../_components/course-navbar";
import CourseBreadcrumb from "../_components/sections/course-breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/zustand/cartStore";
import { generateUid } from "@/lib/helpers/id_helper";
import useUserInfo from "@/lib/hooks/use-user-info";
import MoreIntructorCreatedCourses from "../_components/sections/more-instructor-created-courses";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";

function CoursePreview({ params }: any) {
  const courseId = params?.id;

  const [loading, setLoading] = React.useState(true);
  const [course, setCourse] = React.useState<Course>();
  const [reviews, setReviews] = React.useState<Review[]>([]);

  const style = { color: "blue", fontSize: "1em" };

  useEffect(() => {
    const getCourseInfo = async (courseId: string) => {
      try {
        const response = await fetch(
          `https://localhost:3000/api/courses/${courseId}`
        );

        if (!response.ok) {
          console.log(
            `Failed to fetch course info for courseId: ${courseId} in the useEffect in page.tsx`
          );
        }

        const data = await response.json();
        console.log(`fetched Course info:`, data);
        setCourse(data.data);
        setReviews(data.data.reviews);
      } catch (error: any) {
        console.error(
          `Failed to fetch course info for courseId: ${courseId}, ERROR:`,
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

    getCourseInfo(courseId);
  }, [courseId]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className="flex flex-col pb-[6rem] overflow-x-hidden">
      <div className=" inset-y-0 w-full z-50 px-4 md:px-10 py-2 ">
        <CourseNavbar courseName={course?.courseTitle} />
      </div>

      {/* course breadcrumb */}
      <div className="visible md:hidden pl-8">
        <CourseBreadcrumb courseId={course?.courseId!} />
      </div>

      {/* course content */}
      <div className="grid grid-cols-1 md:grid-cols-2  md:max-w-7xl pl-8  md:pl-[6rem] ">
        {/* left part */}
        <div className="md:pt-[50px] flex flex-col text-red items-start justify-center text-start text-xl">
          {/* course breadcrumb */}
          <div className="hidden md:flex">
            <CourseBreadcrumb courseId={course?.courseId!} />
          </div>

          {/* course image only for mobile screen */}
          <div className="pr-8 my-4">
            <Image
              className="visible md:hidden h-60 w-full bg-slate-700 rounded-xl shadow-md"
              src={
                course?.courseImage ||
                "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210301154221/System-Design-Live-Course-By-GeeksforGeeks.png"
              }
              alt={course?.courseTitle || "Alt"}
              width={384}
              height={30}
              style={{
                objectFit: "cover",
              }}
              quality={100}
            />
          </div>

          {/* course title, description, ratings,*/}
          <div className="space-y-1">
            {/* title  & course duration*/}
            <div>
              {/* title */}
              <p className="dark:text-white tracking-tight text-gray-800 font-semibold text-2xl md:text-4xl mb-2">
                {" "}
                {course?.courseTitle}{" "}
              </p>

              {/* duration of course */}
              <p className="text-sm mb-2">
                {course?.courseDuration} on demand content
              </p>
            </div>

            {/* rating sections */}
            <div className="flex flex-row justify-start items-start md:items-center">
              <div className="flex justify-start items-center">
                <RatingStars courseStarRatings={course?.avgStarRatings} />
                <p className="mr-1 md:mx-1 cursor-pointer text-xs font-medium text-blue-500 dark:text-blue-600">{`(${239} Reviews)`}</p>
              </div>

              <div className="flex flex-row items-center">
                {/* <p className="mr-1 md:mx-1 cursor-pointer text-xs font-medium text-blue-500 dark:text-blue-600">{`(${239} Reviews)`}</p> */}
                <div className="mx-1 flex rounded-lg  justify-center items-center text-xs font-medium text-white space-x-[4px] bg-slate-900 dark:bg-blue-600 px-2 py-1 ">
                  <IoPeopleCircleSharp size={16} />
                  <span className="text-xs">{`${1456} enrolled`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* creator */}
          <div className="space-x-1 mt-2 mb-2 items-center flex justify-start">
            <div className="flex justify-start items-center space-x-2">
              <p className="text-gray-700 text-sm  font-medium dark:text-gray-300 tracking-tight">
                Course Instructor:
              </p>
              <p className="text-gray-800 dark:text-white cursor-pointer text-sm font-semibold underline tracking-tight">
                {course?.courseCreator}
              </p>
            </div>
            <FaCircleCheck style={style} size={16} color="blue" />
          </div>

          <p className="text-xs font-thin mb-2 dark:text-400 dark:opacity-50">
            Last updated on {course?.updatedAt?.toString().split("T")[0]}
          </p>

          <div className="visible md:hidden pr-8 py-4 md:pr-0 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-blue-500">Buy course</p>
              <p className="text-xs text-gray-700 dark:text-gray-400">
                Get access to this course forever when you buy it. Learn at your
                own pace, anytime
              </p>
            </div>

            <p className="font-bold text-2xl text-gray-800 dark:text-white tracking-tight">
              ${course?.coursePrice}
            </p>
            <div className="flex flex-col justify-center items-center space-y-2">
              <Button className="w-full dark:text-white font-semibold bg-blue-500 dark:bg-blue-600">
                Buy now
              </Button>
              <p className="text-xs opacity-50">Apply coupon</p>
            </div>
          </div>

          <div className="my-4 md:my-0 md:mt-16 md:mb-8 w-full">
            <CourseDescription
              courseDescription={
                course?.courseDescription ||
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat"
              }
            />
          </div>

          <WhatYouWillLearn whatYouWillLearn={course?.whatYouWillLearn} />

          <CourseContent courseId={course?.courseId!} />

          <Description courseDescription={course?.courseDescription} />

          <WhoThisCourseIsFor thisCourseIsFor={course?.thisCourseIsFor} />

          <Prerequisits prerequisits={course?.prerequisits} />
        </div>

        {/* right part */}
        <CourseDetailsRightSection course={course} />
      </div>

      {/* TODO: course ratings */}
      {/* // courseId={course?.instructorID!} */}
      <div className="max-w-7xl py-4 md:py-[4rem] px-2 md:px-[6rem] flex justify-start items-center mt-4 w-full ">
        <CourseRatings
          courseId={courseId}
          avgStarRatings={course?.avgStarRatings!}
          reviews={reviews}
        />
      </div>

      {/* DONE: Instructor Info */}
      <div className="max-w-7xl w-full bg-gray-50 dark:bg-zinc-900 border-y flex flex-col justify-start mt-4 px-8 md:px-[6rem] py-8">
        <h3 className="mb-4 text-xl md:text-2xl text-gray-800 dark:text-slate-200 tracking-tight font-semibold">
          Meet Your Instructor
        </h3>
        <InstructorCard instructorId={course?.instructorID} />

        <MoreIntructorCreatedCourses
          instructorId={course?.instructorID}
          instructorName={course?.courseCreator}
        />
      </div>
    </div>
  );
}

export default CoursePreview;

function CourseDetailsRightSection({ course }: any) {
  const pathname = usePathname();
  const [isInCart, setIsInCart] = React.useState(false);
  const notify = (content: string) => toast(`${content}`);
  // const removeFromCart: any = useCartStore();
  const { add: handleAddToCart, remove: handleRemoveFromCart } = useCartStore();
  const cartItemId = generateUid();
  const user = useUserInfo();

  const cartItemToAdd = {
    id: `cart_${cartItemId}`,
    userId: user.user?.id,
    courseId: course.courseId,
    courseName: course.courseTitle,
    courseInstructorName: course.instructorName,
    courseImageUrl: course.courseImage,
    coursePrice: course.coursePrice,
    quantity: 1,
    createdAt: null,
    updatedAt: null,
  };

  const toggleIsInCart = () => {
    // If course is already in the cart, remove it
    if (isInCart) {
      handleRemoveFromCart(cartItemToAdd.id); // Assuming you have a removeFromCart function in cartStore
    } else {
      handleAddToCart(cartItemToAdd);
      setIsInCart(!isInCart);
    }
  };

  const handleShare = () => {
    const currentUrl = pathname;
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        console.log("URL copied to clipboard");
        // Add a success message or notification if desired
        notify("✔ URL copied successfully!");
      },
      (err) => {
        console.error("Failed to copy URL:", err);
        // Handle any errors gracefully
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
            course?.courseImage ||
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
              {course?.coursePrice || 499}
            </p>
            <p className=" pl-1 text-xs dark:text-gray-400">
              (life time access)
            </p>
          </div>

          <div className="flex justify-between">
            {/* TODO: Integrate payment gateway */}
            <Link
              href={`${course?.courseId}/courseContent`}
              className="mt-2 text-center bg-blue-500 w-[22rem] rounded-lg hover:bg-blue-700 text-sm text-white font-semibold p-2"
            >
              Buy Now
            </Link>

            <button
              onClick={toggleIsInCart}
              className={`mt-2 ml-2 border ${
                isInCart
                  ? "bg-blue-500 border-none text-white"
                  : "bg-transparent border-blue-500 text-blue-500 hover:text-white"
              } rounded-lg hover:bg-blue-700 text-sm  font-semibold py-2 px-4`}
            >
              {isInCart ? <HiShoppingCart /> : <HiOutlineShoppingCart />}
            </button>
          </div>

          <p className="text-center text-xs pt-2 text-gray-400 font-thin">
            30 Day money back guarantee
          </p>

          <Divider />

          {/* TODO: what you will get in this course */}
          <div className="space-y-2">
            <h3 className=" tracking-tight text-lg dark:text-xl text-gray-900 dark:text-gray-200 font-semibold">
              What you will get:
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
            {/* <div className=" flex justify-center items-center">
              <HiOutlineGift />
              <p className="pl-2 hover:cursor-pointer text-xs text-gray-400 hover:text-blue-500  hover:underline">
                Gift this course
              </p>
            </div> */}
            <ApplyCouponCode />
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseDescription({ courseDescription }: any) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  // const courseDescription = course.courseDescription || "Lorem ipsum...";

  const truncatedDescription = courseDescription.slice(0, 150);

  return (
    <div className="w-full h-auto">
      <h3 className=" tracking-tight text-xl mt-2 font-semibold text-gray-700 dark:text-slate-200">
        About Course:
      </h3>
      <p
        className={`text-md text-base mt-2 md:py-2 md:text-md md:p-0 md:pr-[8rem] w-auto line-clamp-5 md:line-clamp-3 font-noraml text-gray-700 dark:text-gray-400 ${
          isExpanded ? "text-clamp-4" : ""
        }`}
      >
        {truncatedDescription}
      </p>
      {courseDescription.length > 150 && (
        <div
          className="expand-toggle hover:underline cursor-pointer text-blue-500 text-md text-base"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </div>
      )}
    </div>
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
