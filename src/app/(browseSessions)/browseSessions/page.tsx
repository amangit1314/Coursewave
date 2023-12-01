import React from 'react'
import Image
  from 'next/image'
function BrowseSessions() {
  return (
    <div className='p-12 mt-[3rem] max-w-7xl'>
      <div className='grid grid-cols-4 gap-8'>
        <SessionCard />
        <SessionCard />
        <SessionCard />
        <SessionCard />
      </div>
    </div>
  )
}

export default BrowseSessions



export function SessionCard() {
  return (
    <div className='h-[18rem] shadow-md bg-white dark:bg-slate-900 w-[16rem] rounded-xl '>
      <Image
        className="h-40 w-[16rem] bg-slate-700 rounded-tl-xl rounded-tr-xl relative"
        src='/images1.jpg'
        alt="Next.js Logo"
        width={256}
        height={160}
        style={{
          objectFit: 'cover',
        }}
        unoptimized
      />
      <div className='flex flex-col pt-3 px-5'>
        <span className='text-md font-semibold text-gray-800 dark:text-slate-100'>Session Name</span>
        <div className='flex'>
          <p className='my-1 text-xs text-gray-700 dark:text-slate-400'>6 video</p>
          <div className='ml-1'></div>
          <p className='my-1 text-xs text-gray-700 dark:text-slate-400'>◽ 40 min</p>
        </div>

        <div className='flex justify-between mt-3'>
          <div className=' p-2 rounded-lg text-white  bg-blue-400  text-sm'>
            Business Session
          </div>
          <div className='p-2 text-sm dark:text-slate-300'>Join Now</div>
        </div>
      </div>
    </div>

  )
}
