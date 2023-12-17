"use client";

import { Button } from '@/components/ui/button'
import React from 'react'
import { useRouter } from 'next/navigation';
import { IoAddCircleOutline } from 'react-icons/io5';

function CreateCourseButton(printCourses: any) {
    const router = useRouter();
    
    return (
      <Button
        onClick={() => router.push("/instructor/123456/courses/createCourse")}
        className="flex justify-center shadow-xl ml-auto p-2 font-medium hover:font-semibold text-gray-300 hover:text-white rounded-lg bg-blue-500 hover:bg-blue-700 "
      >
        <IoAddCircleOutline />
        <p className='pl-1'>Create Course</p>
      </Button>
    );
}

export default CreateCourseButton