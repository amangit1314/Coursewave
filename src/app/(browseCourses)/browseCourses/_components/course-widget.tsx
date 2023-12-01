"use client";

import React from 'react'
import { MdOutlineClass } from 'react-icons/md';
import { PiSuitcaseSimple } from 'react-icons/pi';
import { SlCalender } from 'react-icons/sl';
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

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
}
//  
function CourseWidget({ index, instructorId, courseImage, courseNumber, title, duration, subject, instructor, price, categories }: CourseProps) {
    const router = useRouter();
    const params = useParams()

    const onViewDetails = () => {
        router.push(`/browseCourses/courseDetails/${index}`)
    }

    return (
        <div
            key={index}
            className='max-w-70 w-full border border-blue-500 dark:border-none bg-transparent  h-30 rounded-lg shadow-lg flex flex-col items-start justify-start dark:bg-slate-800 '>

            <Image
                className="h-45 w-full bg-slate-700 rounded-tl-lg rounded-tr-lg relative"
                src={courseImage}
                alt="Next.js Logo"
                width={256}
                height={180}
                style={{
                    objectFit: 'cover',
                }}
                priority
            />

            <div className='p-4'>
                <p className='text-xs text-black dark:text-slate-400 font-medium pt-3'>{courseNumber}</p>
                <p className='text-xl font-semibold text-slate-900 dark:text-slate-300 line-clamp-2'>{title}</p>

                <div className='w-full py-2 flex flex-col'>
                    <div className='flex justify-start items-center py-auto'>
                        <p className='pl-1 text-xs font-medium'>Instructor:</p>
                        <p className='pl-1 text-xs text-slate-400 font-medium '>{instructor} </p>
                    </div>
                    {/* categories */}
                    <div>
                        <div className='text-xs text-black dark:text-slate-400 font-medium pt-3'>Categories</div>
                        <div className='pt-2 grid grid-cols-2 gap-2'>

                            {categories && categories.length > 0 ? (
                                <span>{
                                    categories.map(
                                        (category, index) => (
                                            <Badge key={index} variant='outline'>{category}</Badge>
                                        )
                                    )
                                }</span>
                            ) : (
                                <span >
                                        <Badge className='text-xs text-blue-500 font-normal border-blue-500' key={index} variant='outline'>Default</Badge>
                                </span>
                            )}


                        </div>
                    </div>
                </div>

                {/* <div className='w-full py-2 flex gap-x-20 md:gap-x-0 items-center justify-between'>
                <div className='flex justify-center items-center py-auto'>
                    
                    <MdOutlineClass size={30} />
                    <div className='flex flex-col justify-start items-start'>
                        <p className='pl-1 text-xs text-slate-400 uppercase font-thin'>Instructor</p>
                        <p className='pl-1 text-xs font-medium '>{instructor} </p>
                    </div>
                    
                </div>
                <div className='md:ml-4 flex justify-center items-center py-auto'>
                    <PiSuitcaseSimple size={30} />
                    <div className='flex flex-col justify-start items-start'>
                        <p className='pl-1 text-xs text-slate-400 uppercase font-thin'>Subject</p>
                        <p className='pl-1 text-xs font-medium '>{subject} </p>
                    </div>
                </div>
            </div> */}

                <div className='flex w-full justify-between gap-x-20 md:gap-x-0 '>
                    <div>
                        <div className='flex'>
                            <div className='pt-3 pr-1'> <SlCalender size={14} /></div>
                            <p className='text-xs text-black uppercase dark:text-slate-400 font-medium pt-3 '>Estimated Duration</p>
                        </div>
                        <div className='flex justify-start text-lg font-semibold text-blue-500 dark:text-gray-200 items-center py-auto'>{duration} Days</div>
                        {/* <p className='pt-1 text-xs text-slate-400 uppercase'>Duration</p> */}
                        {/* <div className='flex justify-center items-center py-auto'>
                            <div className='font-semibold pt-1 text-3xl'>{duration}</div>
                            <div className='ml-2 mt-1'>
                                <SlCalender size={15} />
                                <div className='mt-1 text-xs text-slate-400'>Days</div>
                            </div>
                        </div> */}
                    </div>
                    <div className='pt-4 pl-5'>
                        <p className='text-xs text-slate-400 uppercase'>Price</p>
                        {/*  ₹ */}
                        <div className='flex justify-center text-xl font-semibold text-blue-500 dark:text-white items-center py-auto'>{price}</div>
                    </div>
                </div>

                <button
                    onClick={onViewDetails}
                    className='mt-4 bg-blue-500 mx-auto p-2 w-full rounded-md items-center text-center text-md font-semibold hover:text-white text-slate-300'>
                    View details
                </button>
            </div>


        </div>
    )
}

export default CourseWidget