/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { Course } from "@prisma/client";
import React, { useEffect } from "react";
import { BsPersonVideo2 } from "react-icons/bs";
import { FaCircleCheck } from "react-icons/fa6";
import { FaDownload, FaShare, FaStar } from "react-icons/fa";
import { TbCertificate } from "react-icons/tb";
import { GoProjectTemplate } from "react-icons/go";
import Image from "next/image";
import {
  HiOutlineGift,
  HiOutlineShoppingCart,
  HiShoppingCart,
} from "react-icons/hi";
import { MdOutlineRateReview } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { Accordion } from "@tremor/react";
import { RatingStars } from "@/app/(course)/courses/_components/rating-stars";
import Reviewcard from "@/app/(course)/courses/_components/sections/reviews/review-card";

function CoursePreview({ params }: any) {
  const [loading, setLoading] = React.useState(true);
  const [isInCart, setIsInCart] = React.useState(false);
  const [course, setCourse] = React.useState<Course>();
  const style = { color: "blue", fontSize: "1.5em" };

  useEffect(() => {
    // https://localhost:3000
    fetch(`/api/courses/${params.id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to fetch courses");
        }
      })
      .then((data) => {
        console.log(data);
        // Assuming your data.data is an array of courses
        setCourse(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  });

  const toggleIsInCart = () => {
    setIsInCart(!isInCart);
  };

  return (
    <div className="flex flex-col py-[2rem] ">
      <div className="flex">
        <div className="pt-[75px]  flex flex-col text-red items-start justify-center text-start text-xl">
          <div className="pl-6 md:pl-0 flex justify-center ">
            <p className="text-sm text-blue-500 dark:text-blue-400">
              Development
            </p>
            <p className="text-sm text-blue-500 dark:text-blue-400">
              {course?.courseCategories}
            </p>
          </div>

          <div className="flex flex-col">
            <p className="pl-6 md:pl-0 font-semibold text-2xl">
              {" "}
              {course?.courseTitle}{" "}
            </p>

            <p className="text-md text-base p-6 md:py-2 md:text-md md:p-0 md:pr-[8rem] w-auto line-clamp-5 md:line-clamp-3 font-noraml text-gray-700 dark:text-gray-400">
              {course?.courseDescription
                ? course?.courseDescription
                : "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat."}
            </p>

            <div className="pl-6 mt-2 md:mt-0 md:p-0 grid grid-flow-col grid-rows-2 md:flex md:flex-row justify-start">
              <RatingStars />
              <div className="flex flex-row">
                <p className="mx-1 cursor-pointer text-sm font-medium text-blue-500 dark:text-blue-400">{`(${239} ratings)`}</p>
                <p className="mx-1 pl-1 text-sm font-medium text-gray-500 dark:text-gray-500">{`(${1456} enrollements)`}</p>
              </div>
            </div>

            <div className="pl-6 md:p-0 mt-6 py-auto items-center flex justify-start">
              <Badge variant="default">
                <div className="px-1">
                  <FaCircleCheck style={style} />
                </div>
                Creator
                <p className="pl-1 text-sm cursor-pointer text-indigo-400 dark:text-indigo-600 underline">
                  {/* {course?.instructorID?.substring(0, 8)} */}
                  Aman Soni
                </p>
              </Badge>
            </div>

            <WhatYouWillLearn />
          </div>
        </div>

        {/* left part */}
        <CourseDetailLeftSection
          toggleIsInCart={toggleIsInCart}
          isInCart={isInCart}
        />
      </div>

      <div className="flex mt-1 flex-col">
        <ThisCourseIncludes />

        <CourseContent />

        <Prerequisits />

        <Description />

        <WhoThisCourseIsFor />

        <InstructorCard />

        <CourseRatings />
      </div>
    </div>
  );
}

type CourseDetailLeftSectionParams = {
  toggleIsInCart: any;
  isInCart: boolean;
};

function CourseDetailLeftSection({
  isInCart,
  toggleIsInCart,
}: CourseDetailLeftSectionParams) {
  const iconStyle = { color: "white" };
  return (
    <div className="hidden md:flex md:flex-col relative w-[30rem] ml-[8rem] mt-[75px] shadow-lg z-99 shadow-gray-950 rounded-lg bg-slate-800 border-gray-500 max-h-[23rem]">
      <Image
        className="h-60 w-[20rem] bg-slate-700 rounded-t-lg relative left-0 right-0"
        src={
          "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210301154221/System-Design-Live-Course-By-GeeksforGeeks.png"
        }
        alt="Next.js Logo"
        width={400}
        height={40}
        style={{
          objectFit: "cover",
        }}
        unoptimized
      />

      <Badge
        onClick={toggleIsInCart}
        className="flex justify-center items-center rounded-full h-10 w-10 bg-indigo-500 absolute mt-1 bottom-29 hover:bg-indigo-600 right-2"
      >
        {isInCart ? (
          <HiOutlineShoppingCart style={iconStyle} />
        ) : (
          <HiShoppingCart style={iconStyle} />
        )}
      </Badge>

      <div className="p-4">
        <div className="flex py-auto items-center">
          <p className="text-lg font-semibold dark:text-gray-200">$ 499</p>
          <p className="font-bold pl-1 text-sm dark:text-gray-400">/mo</p>
        </div>

        <button
          type="submit"
          className="mt-2 bg-indigo-500 w-[18rem] rounded-lg hover:bg-indigo-700 text-sm text-white font-semibold p-2"
        >
          Buy Now
        </button>

        <p className="text-center text-xs py-2 text-gray-400 font-thin">
          30 Day money back guarantee
        </p>

        {/* <div className='grid grid-cols-2 grid-rows-2 gap-4 pt-1 justify-center'>
                        <div className='flex items-center py-auto'>
                            <FaShare />
                            <p className='pl-2 hover:cursor-pointer text-xs text-gray-400 hover:text-indigo-500 hover:font-semibold underline'>Share</p>
                        </div>
                        <div className='pl-[6px]'></div>
                        <div className=' flex items-center py-auto'>
                            <HiOutlineGift />
                            <p className='pl-2 hover:cursor-pointer text-xs text-gray-400 hover:text-indigo-500 hover:font-semibold underline'>Gift this course</p>
                        </div>
                        <div className='pl-[6px]'></div>
                        <div className='flex items-center py-auto'>
                            <RiCoupon3Line />
                            <p className='pl-2 hover:cursor-pointer text-xs text-gray-400 hover:text-indigo-500 hover:font-semibold underline'>Apply Coupon</p>
                        </div>
                    </div> */}
      </div>
    </div>
  );
}

export default CoursePreview;

// -------------------------------------------------------------------------

function WhatYouWillLearn() {
  return (
    <div className="mt-2 md:py-8 md:mt-0 md:p-0 p-6 flex ">
      <div className="flex flex-col p-4 max-w-3xl text-start text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
        <h3 className="mb-4 text-xl tracking-tight font-semibold">
          What you will learn!
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 p-2 md:p-0 text-left">
          <li className="flex items-center space-x-3">
            <svg
              className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="text-sm">Individual configuration</span>
          </li>
          <li className="flex items-center space-x-3">
            <svg
              className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="text-sm">No setup, or hidden fees</span>
          </li>
          <li className="flex items-center space-x-3">
            <svg
              className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="text-sm">
              Team size:{" "}
              <span className="text-sm font-semibold">1 developer</span>
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <svg
              className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="text-sm">
              Premium support:{" "}
              <span className=" text-sm font-semibold">6 months</span>
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <svg
              className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="text-sm">
              Free updates:{" "}
              <span className="text-sm  font-semibold">6 months</span>
            </span>
          </li>
        </div>
      </div>
    </div>
  );
}

function ThisCourseIncludes() {
  return (
    <div className="flex justify-between items-center py-auto">
      <div className="flex flex-col items-start mt-2 p-6 md:p-0">
        <h3 className="mb-4 tracking-tight text-xl font-semibold">
          This course includes:
        </h3>
        <div className="grid px-2 grid-cols-2 md:gap-x-24 gap-6 justify-start md:pb-6 ">
          <ThisCourseIncludesItem
            icon={<BsPersonVideo2 />}
            text="300+ video lectures"
          />
          <ThisCourseIncludesItem
            icon={<TbCertificate />}
            text="Certificate of Completion"
          />
          <ThisCourseIncludesItem
            icon={<FaDownload />}
            text="20+ Downloadable Resources"
          />
          <ThisCourseIncludesItem
            icon={<GoProjectTemplate />}
            text="Complete E-commerce Project"
          />
        </div>
      </div>

      {/* <TechnologiesLearned /> */}
    </div>
  );
}

function ThisCourseIncludesItem({ icon, text }: any) {
  return (
    <div className="flex py-auto justify-start items-center">
      <div>{icon}</div>
      <p className="pl-3 md:pl-2 text-md text-gray-700 dark:text-gray-400">
        {text}
      </p>
    </div>
  );
}

function CourseContent() {
  return (
    <div className="p-6 md:mt-4 md:p-0 max-w-3xl pb-4 md:pb-6">
      <h3 className="mb-4 tracking-tight text:lg md:text-xl font-semibold">
        Course Content:
      </h3>
      <div className="flex justify-between pb-2">
        <div className="grid grid-flow-col grid-rows-2 md:flex justify-evenly text-gray-700 dark:text-gray-400">
          {/* sections */}
          <p className="text-sm">◽ 101 sections</p>
          {/* lections */}
          <p className="text-sm px-1">◽ 300 lectures</p>
          {/* total length */}
          <p className="text-sm">◽ 40h 57m total length</p>
        </div>
        {/* Expand all sections */}
        {/* <div className='font-normal font-indigo-500 text-sm'>Expand all sections</div> */}
      </div>
      {/* accordion (collapse expand for sections and videos) */}
      <Accordion />
    </div>
  );
}

function Prerequisits() {
  return (
    <div className="md:mt-4 p-6 md:p-0 max-w-3xl justify-start">
      <h3 className="mb-4 text-xl tracking-tight font-semibold">
        Prerequisits:
      </h3>
      <ul className="pl-4 flex flex-col text-gray-700 dark:text-gray-400 text-md justify-between pb-2 list-disc">
        <li className="pb-1">No programming experience is required</li>
        <li className="pb-1">Laptop is must</li>
        <li>A stable internet connection</li>
      </ul>
    </div>
  );
}

function WhoThisCourseIsFor() {
  return (
    <div className="md:mt-4 p-6 md:p-0 text-base max-w-3xl justify-start">
      <h3 className="mb-4 text-xl tracking-tight font-semibold">
        Who this course is for:
      </h3>
      <ul className="pl-4 flex flex-col text-gray-700 dark:text-gray-400 text-md justify-between pb-2 list-disc">
        <li className="pb-1">
          Office workers, students, small/home business workers, and
          administrators would want to improve their productivity
        </li>
        <li className="pb-1">
          Computer users who have heard the {"learn to code"} message, but want
          practical reasons to learn programming.
        </li>
        <li>
          While this course doesnt cover specific devops tools, this course
          would be useful for QA, devops, and admins who want to learn scripting
          in Python.
        </li>
      </ul>
    </div>
  );
}

function TechnologiesLearned() {
  const technologies: any[] = [
    {
      name: "React",
      image: "/assets/png/react-logo.png",
    },
    {
      name: "Redux",
      image: "/assets/png/redux-logo.png",
    },
    // {
    //     name: 'Tailwind CSS',
    //     image: '/assets/png/tailwind-css-logo.png'
    // },
    {
      name: "Prisma",
      image: "/assets/png/prisma-logo.png",
    },
    {
      name: "Supabase",
      image: "/assets/png/supabase-logo.png",
    },
  ]; // You might want to update this array with your technologies

  return (
    <div>
      {/* <h3 className="my-8 text-xl font-semibold">Technologies Learnt in this course</h3> */}
      <div>
        <div className="flex items-center space-x-2 text-base">
          <h4 className="font-semibold tracking-tight text-slate-900 dark:text-white">
            Technologies Learnt in this course
          </h4>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
            204
          </span>
        </div>
        <div className="mt-2 flex -space-x-2 overflow-hidden">
          {technologies.map((tech, index) => (
            <div key={index} className="inline-block h-15 w-15">
              <Image
                src={tech.image}
                alt={`Image of ${tech.name}`}
                height={46}
                width={46}
                objectFit="cover"
                className="rounded-full p-3 flex items-center justify-center h-12 w-12 ring-1 ring-white"
              />
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm font-medium">
          <a href="#" className="text-blue-500">
            + 198 others
          </a>
        </div>
      </div>
    </div>
  );
}

function Enrollements() {
  return (
    <div>
      <div className="flex items-center space-x-2 text-base">
        <h4 className="font-semibold text-slate-900">Contributors</h4>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
          204
        </span>
      </div>
      <div className="mt-3 flex -space-x-2 overflow-hidden">
        <img
          className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
        <img
          className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
          src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
        <img
          className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
          alt=""
        />
        <img
          className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
        <img
          className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
          src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
      </div>
      <div className="mt-3 text-sm font-medium">
        <a href="#" className="text-blue-500">
          + 198 others
        </a>
      </div>
    </div>
  );
}

function Description() {
  return (
    <div className="md:mt-4 p-6 md:p-0 max-w-3xl justify-start">
      <h3 className="mb-4 text-xl tracking-tight font-semibold">
        Description:
      </h3>
      <div className="bg-transparent pb-2">
        <p className="text-md text-gray-700 dark:text-gray-400">
          Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At
          arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id at vitae
          feugiat egestas.
        </p>

        <div className="text-md pt-4 text-base text-gray-700 dark:text-gray-400 ">
          <p>
            Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus
            enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor
            praesent donec est. Odio penatibus risus viverra tellus varius sit
            neque erat velit. Faucibus commodo massa rhoncus, volutpat.
            Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae
            sed turpis id.
          </p>

          <ul role="list" className="mt-8 space-y-8 text-gray-600">
            <li className="flex gap-x-3">
              <svg
                className="mt-1 h-5 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="dark:text-gray-400 text-gray-700">
                <strong className="font-semibold dark:text-gray-300 text-gray-900">
                  Push to deploy.
                </strong>{" "}
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Maiores impedit perferendis suscipit eaque, iste dolor
                cupiditate blanditiis ratione.
              </span>
            </li>
            <li className="flex gap-x-3">
              <svg
                className="mt-1 h-5 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="dark:text-gray-400 text-gray-700">
                <strong className="font-semibold dark:text-gray-300 text-gray-900">
                  SSL certificates.
                </strong>{" "}
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                lorem cupidatat commodo.
              </span>
            </li>
            <li className="flex gap-x-3">
              <svg
                className="mt-1 h-5 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4.632 3.533A2 2 0 016.577 2h6.846a2 2 0 011.945 1.533l1.976 8.234A3.489 3.489 0 0016 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234z" />
                <path
                  fillRule="evenodd"
                  d="M4 13a2 2 0 100 4h12a2 2 0 100-4H4zm11.24 2a.75.75 0 01.75-.75H16a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V15zm-2.25-.75a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75h-.01z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="dark:text-gray-400 text-gray-700">
                <strong className="font-semibold dark:text-gray-300 text-gray-900">
                  Database backups.
                </strong>{" "}
                Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.
                Et magna sit morbi lobortis.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TailwindDescription() {
  return (
    <div className="md:mt-4 p-6 md:p-0 max-w-3xl justify-start">
      <h3 className="mb-4 text-xl font-semibold">Description:</h3>
      <div className="relative pt-2 isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width="200"
                height="200"
                x="50%"
                y="-1"
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y="-1" className="overflow-visible fill-gray-50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                stroke-width="0"
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              stroke-width="0"
              fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
            />
          </svg>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-indigo-600">
                  Deploy faster
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  A better workflow
                </h1>
                <p className="mt-6 text-xl leading-8 text-gray-700">
                  Aliquet nec orci mattis amet quisque ullamcorper neque, nibh
                  sem. At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque
                  id at vitae feugiat egestas.
                </p>
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
              alt=""
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                <p>
                  Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget
                  risus enim. Mattis mauris semper sed amet vitae sed turpis id.
                  Id dolor praesent donec est. Odio penatibus risus viverra
                  tellus varius sit neque erat velit. Faucibus commodo massa
                  rhoncus, volutpat. Dignissim sed eget risus enim. Mattis
                  mauris semper sed amet vitae sed turpis id.
                </p>
                <ul role="list" className="mt-8 space-y-8 text-gray-600">
                  <li className="flex gap-x-3">
                    <svg
                      className="mt-1 h-5 w-5 flex-none text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      <strong className="font-semibold text-gray-900">
                        Push to deploy.
                      </strong>{" "}
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Maiores impedit perferendis suscipit eaque, iste dolor
                      cupiditate blanditiis ratione.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <svg
                      className="mt-1 h-5 w-5 flex-none text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      <strong className="font-semibold text-gray-900">
                        SSL certificates.
                      </strong>{" "}
                      Anim aute id magna aliqua ad ad non deserunt sunt. Qui
                      irure qui lorem cupidatat commodo.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <svg
                      className="mt-1 h-5 w-5 flex-none text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M4.632 3.533A2 2 0 016.577 2h6.846a2 2 0 011.945 1.533l1.976 8.234A3.489 3.489 0 0016 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234z" />
                      <path
                        fillRule="evenodd"
                        d="M4 13a2 2 0 100 4h12a2 2 0 100-4H4zm11.24 2a.75.75 0 01.75-.75H16a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V15zm-2.25-.75a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75h-.01z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      <strong className="font-semibold text-gray-900">
                        Database backups.
                      </strong>{" "}
                      Ac tincidunt sapien vehicula erat auctor pellentesque
                      rhoncus. Et magna sit morbi lobortis.
                    </span>
                  </li>
                </ul>
                <p className="mt-8">
                  Et vitae blandit facilisi magna lacus commodo. Vitae sapien
                  duis odio id et. Id blandit molestie auctor fermentum
                  dignissim. Lacus diam tincidunt ac cursus in vel. Mauris
                  varius vulputate et ultrices hac adipiscing egestas. Iaculis
                  convallis ac tempor et ut. Ac lorem vel integer orci.
                </p>
                <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
                  No server? No problem.
                </h2>
                <p className="mt-6">
                  Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam
                  consequat in. Convallis arcu ipsum urna nibh. Pharetra,
                  euismod vitae interdum mauris enim, consequat vulputate nibh.
                  Maecenas pellentesque id sed tellus mauris, ultrices mauris.
                  Tincidunt enim cursus ridiculus mi. Pellentesque nam sed
                  nullam sed diam turpis ipsum eu a sed convallis diam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InstructorCard() {
  const insStyle = { color: "white" };
  return (
    <div className="md:mt-4 p-6 md:p-0 max-w-3xl justify-start">
      <h3 className="mb-4 text-xl tracking-tight font-semibold">Instructor:</h3>

      <div className="dark:p-5 dark:border dark:border-gray-700 rounded-xl">
        <div className="flex">
          <Image
            src="/assets/images/user/user-01.png"
            alt={`Image`}
            height={46}
            width={46}
            objectFit="cover"
            className="rounded-full flex items-center justify-center h-12 w-12 ring-1 ring-white"
          />

          <div className="ml-4 md:ml-6 items-start mr-auto text-base">
            <p className="text-md tracking-tight font-semibold">Aman Soni</p>
            <p className="text-sm text-gray-700 dark:text-gray-400 font-thin ">
              Full Stack Engineer
            </p>
          </div>
        </div>

        <p className="text-md text-base pt-8 md:py-2 md:text-md md:p-0 md:pr-[8rem] w-auto line-clamp-5 md:line-clamp-3 font-noraml text-gray-700 dark:text-gray-400">
          {/* {course?.courseDescription ? course?.courseDescription : '*/}
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident
          eos odit nam quae repellat quis cumque reiciendis autem ab expedita
          Provident eos odit nam quae repellat.
          {/* '} */}
        </p>
      </div>

      <div className="stats sm:stats-vertically md:stats-horizontal shadow my-4 dark:bg-gray-800">
        <div className="stat">
          <div className="stat-figure text-primary">
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg> */}
            <MdOutlineRateReview size={36} style={insStyle} />
          </div>
          <div className="stat-title">Total Reviews</div>
          <div className="stat-value">25.6K</div>
          <div className="stat-desc">21% more than last month</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> */}
            <PiStudentBold size={36} style={insStyle} />
          </div>
          <div className="stat-title">Students</div>
          <div className="stat-value text-white">2.6M</div>
          <div className="stat-desc">21% more than last month</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
          </div>
          <div className="stat-value">2</div>
          <div className="stat-title">Created Courses</div>
          <div className="stat-desc ">Full Stack Enginner</div>
        </div>
      </div>
    </div>
  );
}

function CourseRatings() {
  const [showAllItems, setShowAllItems] = React.useState(false);

  const reviews = [
    {
      name: "Lorean James",
      date: "18 Dec 2023",
      imgurl: "/assets/images/user/user-01.png",
      review: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. .",
    },
    {
      name: "Kapil Sharma",
      date: "17 Nov 2023",
      imgurl: "/assets/images/user/user-02.png",
      review: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. .",
    },
    {
      name: "Parveen Singh",
      date: "16 Oct 2023",
      imgurl: "/assets/images/user/user-03.png",
      review: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. .",
    },
    {
      name: "Naina Choudhary",
      date: "15 Sep 2023",
      imgurl: "/assets/images/user/user-04.png",
      review:
        "Lorem ipsum dolor sit, amet consectetur adipisicing  ipsum dolor sit, amet consectetur adipisicing elit. elit. .",
    },
    {
      name: "Harish Sain",
      date: "14 Aug 2023",
      imgurl: "/assets/images/user/user-05.png",
      review: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. .",
    },
    {
      name: "Aman Soni",
      date: "13 July 2023",
      imgurl: "/assets/images/user/user-06.png",
      review: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. .",
    },
  ];

  const toggleItemsVisibility = () => {
    setShowAllItems(!showAllItems);
  };

  return (
    <div className="group md:mt-4 p-6 md:p-0 max-w-7xl items-center justify-start">
      <div className="flex justify-between items-center py-auto">
        <h3 className="flex items-center justify-start py-auto mb-4 text-xl tracking-tight font-semibold">
          <FaStar />
          <p className="pl-2 pt-1">4.6 course rating, 111K ratings</p>
        </h3>
        <p className="text-sm font-medium text-blue-500 mb-4">Show All</p>
      </div>

      <div
        className={`grid bg-white dark:bg-transparent gap-4 ${
          showAllItems
            ? "grid-cols-2  md:grid-cols-4 grid-flow-col"
            : "grid-rows-2 grid-cols-2  md:grid-cols-4"
        }`}
      >
        {reviews.map((review, index) => {
          return (
            <Reviewcard
              key={index}
              authorName={review.name}
              date={review.date}
              // showDetails={true}
              starRating={5.0}
              authorImgUrl={review.imgurl}
              review={review.review}
            />
          );
        })}
      </div>

      {/* <button
        onClick={toggleItemsVisibility}
        className="mt-2 mx-auto shadow-md px-4 py-2 border border-blue-500 text-blue-500 bg-transparent  hover:text-white hover:bg-blue-500 rounded-full focus:outline-none"
      >
        {showAllItems ? "Show Less" : "Show More"}
      </button> */}
    </div>
  );
}

function CourseRatingItem() {
  return (
    <div className="p-5 w-auto bg-slate-100 dark:bg-slate-800 dark:border dark:border-gray-700 rounded-md max-w-[25rem]">
      <p className="text-sm md:py-2 md:pr-[2.5rem] md:p-0 w-auto max-w-xs line-clamp-5 md:line-clamp-3 font-normal text-gray-700 dark:text-gray-400">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. .
      </p>

      <div className="flex">
        <Image
          src="/assets/images/user/user-01.png"
          alt={`Image`}
          height={56}
          width={56}
          objectFit="cover"
          className="rounded-full flex items-center justify-center h-14 w-14"
        />

        <div className="ml-4 items-start mr-auto text-base">
          <p className="text-md tracking-tight font-semibold">Aman Soni</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-thin ">
            Full Stack Engineer
          </p>
        </div>
      </div>
    </div>
  );
}

function MoreCoursesBy() {
  const [showAllItems, setShowAllItems] = React.useState(false);
  const items = [];

  const toggleItemsVisibility = () => {
    setShowAllItems(!showAllItems);
  };

  return (
    <div className="group md:mt-4 p-6 md:p-0 max-w-7xl items-center justify-start">
      <h3 className="flex items-center justify-start py-auto mb-4 text-xl tracking-tight font-semibold">
        More Courses by <strong className="text-blue-500">Aman Soni</strong>
      </h3>

      <div
        className={`grid bg-white dark:bg-transparent gap-2 ${
          showAllItems ? "grid-cols-3 grid-flow-row" : "grid-rows-2 grid-cols-3"
        }`}
      >
        <MoreCreatedCourseItem />
        <MoreCreatedCourseItem />
        <MoreCreatedCourseItem />
        <MoreCreatedCourseItem />
        <MoreCreatedCourseItem />
        <MoreCreatedCourseItem />
        <MoreCreatedCourseItem />
      </div>

      <button
        onClick={toggleItemsVisibility}
        className="mt-2 mx-auto shadow-md px-4 py-2 border border-blue-500 text-blue-500 bg-transparent  hover:text-white hover:bg-blue-500 rounded-full focus:outline-none"
      >
        {showAllItems ? "Show Less" : "Show More"}
      </button>
    </div>
  );
}

function MoreCreatedCourseItem() {
  return (
    <div className="p-5 bg-slate-100 dark:bg-slate-800 dark:border dark:border-gray-700 rounded-md max-w-[25rem]">
      <div className="flex">
        <Image
          src="/assets/images/user/user-01.png"
          alt={`Image`}
          height={56}
          width={56}
          objectFit="cover"
          className="rounded-full flex items-center justify-center h-14 w-14"
        />

        <div className="ml-4 items-start mr-auto text-base">
          <p className="text-md tracking-tight font-semibold">Aman Soni</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-thin ">
            Full Stack Engineer
          </p>
        </div>
      </div>

      <p className="text-sm md:py-2 md:pr-[2.5rem] md:p-0 w-[25rem] line-clamp-5 md:line-clamp-3 font-normal text-gray-700 dark:text-gray-400">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. .
      </p>
    </div>
  );
}
