import React from 'react'
import Image from 'next/image'

export function UpcommingSessionsCard() {
    return (
        <div className='rounded-xl p-4 flex border border-gray-300 mt-2 mb-8'>
            <div className={`bg-purple-500 h-[4.5rem] w-1 rounded-full`}></div>

            <div className='mx-3 justify-start items-start py-auto flex flex-col'>
                <p className='uppercase text-gray-600 text-sm dark:text-gray-400'>Tuesday, jan 3 at 3:40 pm (pt)</p>
                <div className='flex justify-between'>
                    <div className='flex'>
                        <p className='text-base font-medium'>One-on-One Session (40m) </p>
                        <p className='text-xs ml-[8px] font-medium bg-green-400 p-[6px] rounded-xl'>Confirmed</p>
                    </div>

                    {/* modify */}
                    <div className="text-xs ml-4 font-medium border border-gray-200 bg-transparent p-[6px] rounded-xl">
                        Modify
                        <span className='font-bold ml-2 rotate-180'>^</span>
                    </div>
                </div>

                <div className='flex'>
                    <Image
                        className='h-6 w-6 rounded-full'
                        src='/nextjs.png'
                        alt='p'
                        height={24}
                        width={24}
                        content='cover'
                    />
                    <p className='text-sm text-gray-600 ml-2 dark:text-gray-400'>Terisha Simmons</p>
                </div>
            </div>

        </div>
    );
}