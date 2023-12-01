"use client";

import React from 'react'
import { FiEdit2 } from "react-icons/fi";
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface CourseProps {
    index: string;
    courseImage: string;
    courseNumber: string;
    title: string;
    duration?: string;
    subject?: string;
    instructor: string;
    price: string;
    categories?: string[];
    instructorId?: string;
    // onClickToEditButton?: VoidFunction;
}
  
function CreatedCourseWidget({ index, instructorId, courseImage, courseNumber, title, duration, subject, instructor, price, categories }: CourseProps) {
    const router = useRouter();
    const params = useParams()

    const onViewDetails = () => {
        router.push(`/browseCourses/courseDetails/${instructorId}`)
    }

    const onClickToEditButton = () => {
        //* here index is my courseId
        router.push(`/instructor/${instructorId}/courses/createdCourses/${index}/editCourse`)
    }

    return (
        <div
            onClick={onViewDetails}
            key={index} className='relative hover:cursor-pointer h-60 max-w-80 w-full rounded-xl overflow-hidden shadow-lg'>

            {/* Background Image */}
            <Image
                className="absolute h-full w-full opacity-80 bg-slate-700 rounded-lg"
                src={courseImage}
                alt="Course Image"
                layout="fill"
                objectFit="cover"
                priority
            />

            {/* Blurred Overlay
            <div className='absolute inset-0 bottom-0 left-0 right-0 h-30 backdrop-blur-sm bg-opacity-30 bg-gray-800 rounded-lg'></div> */}

            {/* Content */}
            <div className='flex justify-between absolute inset-0 bottom-0 bg-black bg-opacity-70 backdrop-blur-lg left-0 pl-4 right-0 top-[10rem] h-30 items-start rounded-bl-lg rounded-br-lg'>
                <div>
                    <div className='font-thin mt-3 text-xs text-gray-400'> {index} </div>
                    <div className='font-medium w-10/12 text-clip  mb-3 text-sm text-gray-200'> {title} </div>
                </div>
                <button
                    onClick={onClickToEditButton}
                    className='flex justify-center mt-5 mr-3 items-center h-8 w-8 rounded-full bg-gray-600 '>
                    <FiEdit2 />
                </button>
            </div>

        </div>
    )
}

export default CreatedCourseWidget