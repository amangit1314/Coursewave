import React from 'react'

const BecomeInstructor = ({ params }: {
  params: {
    id?: string;
  };
}) => {
  return (
    <div className='pt-[80px]'>
      <span
        className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
        Purple
      </span>
    </div>
  )
}

export default BecomeInstructor