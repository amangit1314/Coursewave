"use client";

import axios from "axios";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Divider } from "@tremor/react";
import { SiGmail } from "react-icons/si";
import { Camera, Pencil } from "lucide-react";
import { RiInstagramFill } from "react-icons/ri";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaGithub, FaSquareXTwitter, FaLinkedinIn } from "react-icons/fa6";
import toast from "react-hot-toast";
import useUserInfo from "@/hooks/use-user-info";
import { ThemeModeToggle } from "@/components/themeModeToggle";
import "@uploadthing/react/styles.css";

const Profile = () => {
  const user = useUserInfo().user;

  return (
    <div className="p-4">
      <div className="overflow-hidden rounded-3xl border border-stroke border-gray-600 shadow-default dark:border-strokedark dark:bg-slate-900 shadow z-20 px-4 pt-6 pb-6 text-center lg:pb-8 xl:pb-11.5 m-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center border border-red-500 font-medium justify-center text-sm text-red-500 px-2 py-1 rounded-md bg-transparent hover:bg-red-600 hover:text-white cursor-pointer transition-all duration-300">
            Logout
          </div>
          <div className="flex items-end justify-end ml-auto">
            <ThemeModeToggle />
          </div>
        </div>

        <ProfileImage />

        <h3 className="mt-4 text-2xl tracking-tight font-bold text-black dark:text-white">
          {user ? user.name : "Aman Soni"}
        </h3>

        <div className="flex text-black dark:text-gray-200 justify-center items-center pt-auto space-x-2">
          <div className="flex justify-start items-center">
            <SiGmail size={20} />
            <p className="pl-1.5 text-sm font-normal">
              {user ? user.email : "amansoni@gmail.com"}
            </p>
          </div>
          <Pencil size={16} className="ut-upload-icon cursor-pointer duration-300 transition-all" />
        </div>

        <SwitchToInstructorButton />

        <Divider />

        <AccountSettingsSection />

        <Divider />

        <HelpAndSupportSection />

        <FollowCoursewaveOn />
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
            user
              ? user.user?.profileImageUrl!
              : "/assets/images/cover/cover-01.png"
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
              <Pencil size={18} />
            </span>
            <span>Edit</span>
          </label>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="h-[100px] w-[10px]"></div>
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
            user
              ? user.user?.profileImageUrl ?? "/assets/images/user/user-01.png"
              : "/assets/images/user/user-02.png"
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
          <Camera size={18} />
          <input type="file" name="profile" id="profile" className="sr-only" />
        </label>
      </div>
    </div>
  );
}

function SwitchToInstructorButton() {
  const user = useUserInfo().user;

  const isInstructor = user?.isInstructor!;

  const setInstructor = async () => {
    try {
      await axios.post(`/api/profile/${user?.id}/becomeInstructor`);
      toast.success("You are now instructor ✔️ ");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <button
      onClick={setInstructor}
      className="my-3 p-2 cursor-pointer font-bold text-blue-500 hover:bg-blue-700 hover:rounded-lg hover:p-2  rounded-lg hover:text-white transition-all duration-200"
    >
      {isInstructor ? "Switch to instructor view" : "Become Instructor"}
    </button>
  );
}

function AccountSettingsSection() {
  return (
    <div className="flex mt-4 space-y-5 flex-col items-start">
      <p className="text-md text-base font-semibold px-1 text-black  dark:text-white">
        Account Settings
      </p>

      <div className="flex group flex-col  space-y-2 max-w-7xl w-full  ">
        <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 dark:hover:from-blue-600 hover:via-indigo-400 hover:to-sky-400 dark:hover:bg-blue-600 hover:text-white hover:rounded-lg p-2 transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm">Career Goals</p>
          <MdOutlineKeyboardArrowRight />
        </div>
        <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 dark:hover:from-blue-600 hover:via-indigo-400 hover:to-sky-400 hover:bg-blue-600 hover:text-white hover:rounded-lg p-2 transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm">Learning Reminders</p>
          <MdOutlineKeyboardArrowRight />
        </div>
        <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 dark:hover:from-blue-600 hover:via-indigo-400 hover:to-sky-400 hover:bg-blue-600  hover:rounded-lg p-2 hover:text-white transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm">Notifications</p>
          <MdOutlineKeyboardArrowRight />
        </div>
        {/* <div className="flex justify-between items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 hover:rounded-lg p-2 transition-all duration-200">
          <p className="text-sm">Email Notifications</p>
          <MdOutlineKeyboardArrowRight />
        </div> */}
      </div>
    </div>
  );
}

function HelpAndSupportSection() {
  return (
    <div className="mt-4 flex flex-col space-y-5 items-start">
      <p className="text-md text-base font-semibold dark:text-white px-1">
        Help and Support
      </p>
      <div className="flex flex-col space-y-2 max-w-7xl w-full">
        <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 dark:hover:from-blue-600 hover:via-indigo-400 hover:to-sky-400 hover:bg-blue-600 hover:text-white  hover:rounded-lg p-2 transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm">About CourseWave</p>
          <MdOutlineKeyboardArrowRight />
        </div>
        <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 dark:hover:from-blue-600 hover:via-indigo-400 hover:to-sky-400 hover:bg-blue-600 hover:text-white  hover:rounded-lg p-2 transition-all duration-200 text-gray-800 dark:text-gray-200">
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
