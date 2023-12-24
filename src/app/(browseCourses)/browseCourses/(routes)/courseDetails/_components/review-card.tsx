/* eslint-disable @next/next/no-img-element */
import React from 'react'

type ReviewProps = {
    name: string,
    imgUrl: string,
    date: string,
    review: JSX.Element | string,

}

const Reviewcard = ({ name, date, imgUrl, review }: ReviewProps) => {
  return (
    <div className="flex-col hover:border hover:z-50 hover:shadow-md hover:border-indigo-500 items-center p-3 rounded-lg cursor-pointer max-w-xs w-full align-center bg-slate-800 bg-opacity-80 bg-clip-padding backdrop-filter-blur">
      <blockquote>
        <p className="text-sm text-start w-full text-slate-300  line-clamp-6 font-medium ">
          “{review}”
        </p>
      </blockquote>
      <div className="flex justify-start items-center py-auto mt-3 w-xs">
        {/* <img className="rounded-full w-14 h-14" src={imgUrl} alt={name} /> */}
        <img className="w-10 h-10 rounded-full " src={imgUrl} alt={name} />

        <figcaption className="ml-2 font-medium">
          <div className="text-slate-100 text-sm dark:text-slate-100">{name}</div>
          <div className="text-slate-700 text-xs dark:text-slate-500 line-clamp-2">
            {date}
          </div>
        </figcaption>

        
      </div>
    </div>
  );
};

export default Reviewcard;