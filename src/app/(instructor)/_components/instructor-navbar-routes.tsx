"use client";

import React from 'react'
import { usePathname, useRouter } from 'next/navigation';

import { IoNotificationsOutline } from 'react-icons/io5';
import UserAvatar from '@/components/user-avatar';
import { Button } from '@/components/ui/button';

function InstructorNavbarRoutes() {
    const pathname = usePathname();
    const router = useRouter()

    const switchBack = () => {
        router.push('/browseCourses')
    }

    return (
        <div className='ml-auto mx-12 flex justify-between'>
            <div className='my-auto mr-auto justify-center cursor-pointer  text-black text-md  dark:text-white bg-transparent items-center'>Instructor Dashboard</div>
            <div className='md:ml-[24rem] lg:ml-[48rem] flex  gap-x-2'>
                <Button
                    onClick={switchBack}
                    className="cursor-pointer border-opacity-10 hover:bg-slate-50 dark:hover:border-opacity-100 dark:border-opacity-10 hover:border-opacity-100 dark:hover:bg-slate-700 border px-4 border-black text-black text-xs dark:border-white dark:text-white bg-transparent rounded-full mx-auto items-center">
                    {'Go back'}
                </Button>

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
                <UserAvatar
                    // put here uid of current user
                    userId='111'
                />
            </div>
        </div>

    )
}

export default InstructorNavbarRoutes