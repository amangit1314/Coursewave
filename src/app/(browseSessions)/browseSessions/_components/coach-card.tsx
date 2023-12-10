import React from 'react'
import Image from 'next/image'
import { IoMdAddCircleOutline } from "react-icons/io";
import { Button } from '@/components/ui/button';

export function CoachCard() {
    return (
        <div className='max-h-[25rem] h-auto mt-2 shadow-md bg-white dark:bg-slate-800 w-[16rem] rounded-xl  mb-8'>
            <Image
                className="h-36 w-[16rem] bg-slate-700 rounded-tl-xl rounded-tr-xl relative"
                src='/nextjs.png'
                alt="Next.js Logo"
                width={256}
                height={145}
                style={{
                    objectFit: 'cover',
                }}
                unoptimized
            />
            <div className='flex flex-col pt-3 px-3'>

                <div className='text-center justify-center items-center'>
                    <span className='text-md mt-[10px] font-medium line-clamp-2 dark:text-slate-100'>Jessica Gutierrez</span>
                    <p className='text-xs text-center pb-3 text-gray-700 dark:text-gray-500 ml-2'>Data Scientist</p>
                </div>

                <p className='text-xs text-center text-gray-700 dark:text-gray-400'>I aim to bring out your strengths and be an empatheic, supportive, and non-judgemental person for you.</p>

                <Button className='flex hover:bg-blue-700 bg-blue-500 justify-center my-3'>
                    <IoMdAddCircleOutline style={{ color: 'white' }} />
                    <p className='p-2 text-xs font-bold cursor-pointer dark:text-slate-300'>
                        Book a Session
                    </p>
                </Button>
            </div>
        </div>

    )
}