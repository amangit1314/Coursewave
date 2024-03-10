"use client";

import React from "react";
import Image from "next/image";
import { Divider } from "@tremor/react";
import { FcGoogle } from "react-icons/fc";
import useUserInfo from "@/lib/hooks/use-user-info";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
import { RiInstagramFill } from "react-icons/ri";
import { FaGithub, FaSquareXTwitter, FaLinkedinIn } from "react-icons/fa6";

const Profile = () => {
  const user = useUserInfo();
  return (
    <div className="p-4">
      <div className="overflow-hidden rounded-2xl border border-stroke border-gray-600 bg-slate-900 shadow-default dark:border-strokedark dark:bg-slate-900 ">
        {/*  profile image with background */}
        {/* <ProfileWithBackground /> */}

        {/* text and other options */}
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="mt-4">
            {/* profile image */}
            <ProfileImage />
            {/* name */}
            <h3 className="mt-4 mb-1 text-2xl font-semibold text-black dark:text-white">
              {user ? user.user?.name! : "Aman Soni"}
            </h3>
            {/* google icon and email */}
            <div className="flex justify-center items-center pt-auto">
              <FcGoogle size={20} />
              <p className="pl-1.5 text-sm font-normal">
                {user ? user.user?.email! : "amansoni@gmail.com"}
              </p>
            </div>
            {/* switch to instructor view */}
            <SwitchToInstructorButton />
            <Divider />
            {/* account settings section */}
            <AccountSettingsSection />
            <Divider />
            {/* help and support section */}
            <HelpAndSupportSection />
            {/* follow coursewave on */}
            <FollowCoursewaveOn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

function ProfileWithBackground() {
  const user = useUserInfo();
  return (
    <div className="relative">
      <div className="relative z-20 h-35 md:h-65">
        <Image
          src={
            user ? user.user?.profileImageUrl! : "/images/cover/cover-01.png"
          }
          alt="profile cover"
          className="max-h-[230px] h-full max-w-7xl w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          width={970}
          height={200}
        />

        <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
          <label
            htmlFor="cover"
            className="flex cursor-pointer items-center justify-center gap-2 rounded bg-slate-900 py-1 px-2 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
          >
            <input type="file" name="cover" id="cover" className="sr-only" />
            <span>
              <svg
                className="fill-current"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z"
                  fill="white"
                />
              </svg>
            </span>
            <span>Edit</span>
          </label>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="h-[100px] w-[10px]"></div>
        {/* image */}
        <ProfileImage />
      </div>
    </div>
  );
}

function ProfileImage() {
  const user = useUserInfo();

  return (
    <div className="flex items-center mt-8 justify-center">
      <div className="relative max-h-44 max-w-44">
        <Image
          src={
            user ? user.user?.profileImageUrl! : "/images/cover/cover-01.png"
          }
          width={160}
          height={160}
          className="rounded-full h-[160px] w-[160px] border border-stroke"
          alt="profile"
        />
        <label
          htmlFor="profile"
          className="absolute bottom-0 right-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary p-2 text-white bg-slate-700 hover:bg-opacity-70 sm:bottom-2 sm:right-2"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
              fill=""
            />
          </svg>
          <input type="file" name="profile" id="profile" className="sr-only" />
        </label>
      </div>
    </div>
  );
}

function SwitchToInstructorButton() {
  return (
    <button className="my-3 cursor-pointer font-bold text-blue-500 hover:bg-blue-700 hover:rounded-lg hover:p-2 hover:bg-opacity-50 rounded-lg hover:text-white transition-all duration-200">
      Switch to instructor view
    </button>
  );
}

function AccountSettingsSection() {
  return (
    <div className="flex mt-4 flex-col items-start">
      <p className="text-sm font-semibold py-1 dark:text-white">
        Account Settings
      </p>

      <div className="flex flex-col mt-6 space-y-4 max-w-7xl w-full">
        <div className="flex justify-between items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 hover:rounded-lg hover:p-2 transition-all duration-200">
          <p className="text-sm">Career Goals</p>
          <MdOutlineKeyboardArrowRight />
        </div>
        <div className="flex justify-between items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 hover:rounded-lg hover:p-2 transition-all duration-200">
          <p className="text-sm">Learning Reminders</p>
          <MdOutlineKeyboardArrowRight />
        </div>
        <div className="flex justify-between items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 hover:rounded-lg hover:p-2 transition-all duration-200">
          <p className="text-sm">Notifications</p>
          <MdOutlineKeyboardArrowRight />
        </div>
        <div className="flex justify-between items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 hover:rounded-lg hover:p-2 transition-all duration-200">
          <p className="text-sm">Email Notifications</p>
          <MdOutlineKeyboardArrowRight />
        </div>
      </div>
    </div>
  );
}

function HelpAndSupportSection() {
  return (
    <div className="mt-4 flex flex-col items-start">
      <p className="text-sm font-semibold dark:text-white">Help and Support</p>
      <div className="flex flex-col mt-6 space-y-4 max-w-7xl w-full">
        <div className="flex justify-between items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 hover:rounded-lg hover:p-2 transition-all duration-200">
          <p className="text-sm">About CourseWave</p>
          <MdOutlineKeyboardArrowRight />
        </div>
        <div className="flex justify-between items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 hover:rounded-lg hover:p-2 transition-all duration-200">
          <p className="text-sm">Share App </p>
          <MdOutlineKeyboardArrowRight />
        </div>
      </div>
    </div>
  );
}

function FollowCoursewaveOn() {
  return (
    <div className="mt-8">
      <h4 className="mb-2 text-sm font-normal text-black dark:text-white">
        Follow <span className="text-blue-500 font-bold">CourseWave</span> on
      </h4>
      <div className="flex items-center justify-center gap-3.5">
        <Link href="#" className="hover:text-blue-500" aria-label="social-icon">
          <RiInstagramFill size={20} />
        </Link>
        <Link href="#" className="hover:text-blue-500" aria-label="social-icon">
          <FaSquareXTwitter size={20} />
        </Link>
        <Link href="#" className="hover:text-blue-500" aria-label="social-icon">
          <FaLinkedinIn size={20} />
        </Link>
        <Link href="#" className="hover:text-blue-500" aria-label="social-icon">
          <FaGithub size={20} />
        </Link>
      </div>
    </div>
  );
}
