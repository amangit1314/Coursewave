import Image from "next/image";
import React from "react";
import { AiTwotoneStar } from 'react-icons/ai';
import { FaStar } from "react-icons/fa6";

interface TestimonialItemProps {
    name: string;
    courseName: string;
    imgUrl: string;
    comment: string;
}

const TestimonialItem: React.FC<TestimonialItemProps> = ({
    name,
    courseName,
    imgUrl,
    comment,
}) => {
    return (
        <div className="h-[16rem] md:h-[13rem] w-auto md:max-w-[25rem dark:bg-slate-800 bg-opacity-50 rounded-xl mr-4 shadow-lg hover:shadow-lg hover:shadow-grey-500/50 backdrop-filter-blur">
            {/* comment */}
            <p className="p-4 text-base text-black dark:text-slate-200 font-medium line-clamp-4 ">“{comment}”</p>

            {/* other */}
            <div className="py-2 flex flex-col md:flex-row justify-start flex-shrink-0 w-auto p-2 mx-1 transition duration-200 rounded-lg cursor-pointer align-center items-center md:items-start backdrop-filter-blur">
                <Image
                    className="items-center bg-white rounded-full w-12 h-12"
                    src={imgUrl}
                    alt={name}
                    height={12}
                    width={12}
                    unoptimized
                />
                <div className="w-full ml-1 px-2 pt-1 md:pt-0 my-1 md:my-0 flex flex-col">

                    <div className="flex justify-between items-center py-auto rating">
                        <p className="text-sm md:mt-0 font-medium">{name}</p>
                        <div className="flex items-center py-auto">
                            <p className="text-md font-medium text-slate-800 dark:text-white px-1">4.8</p>
                            <FaStar  className="text-yellow-500" />
                        </div>
                    </div>

                    <p className=" text-xs dark:text-slate-400">{courseName}</p>
                </div>
            </div>
        </div>
    );
}

export default TestimonialItem;
