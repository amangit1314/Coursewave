import React from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge';

export function SessionCard() {
    return (
        <div className='h-[18rem] mt-2 shadow-md bg-white dark:bg-slate-800 w-[16rem] rounded-xl '>
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
                <div className='flex justify-between'>
                    <Badge className='border hover:text-gray-100 font-medium text-gray-700 bg-transparent dark:hover:bg-transparent dark:hover:text-gray-200 hover:cursor-default border-black dark:text-gray-400 dark:border-gray-400'>Blog</Badge>
                    <div className='flex'>
                        <p className='my-1 text-xs text-gray-700 mr-[2px] dark:text-slate-400'>6 video</p>
                        <p className='my-1 text-xs text-gray-700 dark:text-slate-400'>◽ 40 min</p>
                    </div>
                </div>
                <span className='text-md mt-[10px] font-medium text-gray-800 line-clamp-2 dark:text-slate-100'>Back students mental health matters</span>


                <div className='flex justify-between mt-3'>
                    <div className='flex items-center py-auto'>
                        <Image
                            className='h-6 w-6 rounded-full'
                            src='/nextjs.png'
                            alt='p'
                            height={24}
                            width={24}
                            content='cover'
                        />
                        <p className='text-xs text-gray-600 ml-[6px] dark:text-gray-400'>Terisha Simmons</p>
                    </div>

                    <div className='p-2 text-xs font-bold hover:text-indigo-500 cursor-pointer dark:text-slate-300 dark:hover:text-white'>Join Now</div>
                </div>
            </div>
        </div>

    )
}