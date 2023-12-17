"use client";

import { Button } from './ui/button';
import UserAvatar from './user-avatar';
import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { FiShoppingCart } from "react-icons/fi";


function NavbarRoutes() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  // const userId = params?.userId;
  const userId = '123456';
  const courseId = params?.courseId;

  const isInstructorPage = pathname?.startsWith("/instructor");
  const isPlayerPage = pathname?.includes("/courseDetails" || "/chapter");

  const [loading, setLoading] = React.useState(true);
  const [isInstructor, setIsInstructor] = React.useState(isInstructorPage);

  useEffect(() => {
    if (userId) {
      fetch(`https://localhost:3000/api/instructor/${userId}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed to check if user is instructor');
          }
        })
        .then((data) => {
          console.log(data);
          setIsInstructor(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error checking instructor id:', error);
          setLoading(false);
        });
    }
  }); // Empty dependency array to run the effect only once

  const switchToInstructorView = () => {
    // if (!userId) {
    //   toast.error('Please provide user id');
    // } else if (isInstructor) {
    //   router.push(`/instructor/${userId}/analytics`);
    // } else {
    //   setIsInstructor(false);
    //   router.push(`/profile/${userId}/becomeInstructor`);
    //   toast.error('You are not an instructor');
    // }

    //! ---- for TESTING ONLY AFTER TESTING REMOVE BELOW CODE ---
    router.push(`/instructor/1234/analytics`);

  };

  return (
    <div className='ml-auto flex  gap-x-2'>

      <Toaster />

      {/* instructor button */}
      <Button
        onClick={switchToInstructorView}
        className="cursor-pointer border-opacity-10 hover:bg-slate-50 dark:hover:border-opacity-100 dark:border-opacity-10 hover:border-opacity-100 dark:hover:bg-slate-700 border px-4 border-black text-black text-xs dark:border-white dark:text-white bg-transparent rounded-full mx-auto items-center">
        {isInstructor ? 'Instructor View' : 'Become Instructor'}
      </Button>

      {/* cart */}
      <button className="relative  rounded-full  transition duration-150 ease-in-out" aria-label="Cart">
        <div className='cursor-pointer rounded-full p-3 text-center items-center hover:bg-slate-50 border bg-transparent dark:hover:border-opacity-100 border-opacity-10 dark:bg-slate-700 dark:border-opacity-10'>
          <FiShoppingCart size={16} />
        </div>
        <span className="absolute inset-0 object-right-top -mr-6">
          <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-blue-500 text-white">
            6
          </div>
        </span>
      </button>

      {/* notification */}
      <button className="relative  rounded-full  transition duration-150 ease-in-out" aria-label="Cart">
        <div className='cursor-pointer rounded-full p-3 text-center items-center hover:bg-slate-50 border bg-transparent dark:hover:border-opacity-100 border-opacity-10 dark:bg-slate-700 dark:border-opacity-10'>
          <IoNotificationsOutline size={16} />
        </div>
        <span className="absolute inset-0 object-right-top -mr-6">
          <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-blue-500 text-white">
            6
          </div>
        </span>
      </button>

      {/* user profile */}
      {<UserAvatar userId='12345' />}
    </div>
  )
}

export default NavbarRoutes