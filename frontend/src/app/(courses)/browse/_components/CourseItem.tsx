import React from "react";
import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import { MdOutlineClass } from "react-icons/md";

interface CourseItemProps {
  index: number;
  tab: {
    src: string;
    title: string;
    classes: number;
    rating: number;
    price: string;
  };
}

const style = { color: "yellow", fontSize: "1.5em" };

const CourseItem: React.FC<CourseItemProps> = ({ index, tab }) => {
  return (
    <div
      key={index}
      className={`group rounded-lg border border-blue-100 p-3 transition-colors hover:border-blue-500 hover:bg-white hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30`}
    >
      <Image
        className="relative h-40 w-[13rem] rounded-lg bg-slate-700"
        src={tab.src}
        alt="Next.js Logo"
        width={208}
        height={160}
        style={{
          objectFit: "cover",
        }}
        priority
      />
      <h2 className="text-md pt-4 font-semibold">{tab.title}</h2>

      <div className="flex items-center justify-start py-1 pl-1">
        <div className="flex justify-start">
          <AiFillStar className="my-2" style={style} size={18} />
          <AiFillStar className="my-2" style={style} size={18} />
          <AiFillStar className="my-2" style={style} size={18} />
          <AiFillStar className="my-2" style={style} size={18} />
          <AiFillStar className="my-2" style={style} size={18} />
        </div>

        <div className="flex pl-1 text-sm">
          5.0
          <div className="pl-1 text-sm font-semibold">({tab.rating})</div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex justify-start">
          <MdOutlineClass size={20} />
          <p className="pl-1 text-sm">{tab.classes}</p>
        </div>

        <p className="font-bold text-blue-500 dark:text-blue-300">
          {tab.price} ₹
        </p>
      </div>
    </div>
  );
};

export default CourseItem;
