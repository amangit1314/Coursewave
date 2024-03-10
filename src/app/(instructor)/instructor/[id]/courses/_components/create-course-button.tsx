"use client";

import { Button } from '@/components/ui/button'
import React from 'react'
import { useRouter } from 'next/navigation';
import { IoAddCircleOutline } from 'react-icons/io5';
import useUserInfo from '@/lib/hooks/use-user-info';

function CreateCourseButton(printCourses: any) {
  const router = useRouter();
  const user = useUserInfo();

    return (
      <Button
        onClick={() => router.push(`/instructor/${user.user?.id!}/courses/createCourse`)}
        className="flex justify-center shadow-xl ml-auto p-2 font-medium hover:font-semibold text-gray-300 hover:text-white rounded-lg bg-blue-500 hover:bg-blue-700 "
      >
        <IoAddCircleOutline size={22} />
        <p className='pl-1 font-semibold text-white'>Create Course</p>
      </Button>
    );
}

export default CreateCourseButton