import Image from "next/image";
import React from "react";
import { AiTwotoneStar } from 'react-icons/ai';

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
        <div className="h-[13rem] max-w-[25rem] pb-2 dark:bg-slate-700 bg-opacity-50 rounded-xl mr-4 shadow-lg hover:shadow-lg hover:shadow-grey-500/50 backdrop-filter-blur">
            <p className="p-4 text-sm text-black dark:text-white font-medium line-clamp-4 opacity-50">“{comment}”</p>
            <div className="pt-6 flex justify-start flex-shrink-0 w-auto p-2 m-2 transition duration-200 rounded-lg cursor-pointer align-center  backdrop-filter-blur">
                <Image
                    className="items-center bg-white rounded-full w-12 h-12"
                    src={imgUrl}
                    alt={name}
                    height={12}
                    width={12}
                    unoptimized
                />
                <div className="w-full px-2 flex flex-col">

                    <div className="flex justify-between rating">
                        <p className="text-sm font-bold">{name}</p>
                        <div className="flex items-center">
                            <p className="text-md font-medium text-slate-800 dark:text-white px-1">4.8</p>
                            <AiTwotoneStar className="text-yellow-500" />
                        </div>
                    </div>

                    <p className=" text-xs opacity-50">{courseName}</p>
                </div>
            </div>
        </div>
    );
}

export default TestimonialItem;
