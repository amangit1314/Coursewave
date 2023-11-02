import Image from "next/image";
import React from "react";

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
        <div className="h-[13rem] max-w-[25rem] pb-2 bg-blue-100 bg-opacity-50 rounded-lg mr-4 shadow-lg hover:shadow-lg hover:shadow-grey-500/50 backdrop-filter-blur">
            <p className="p-4 text-sm line-clamp-3 opacity-50">{comment}</p>
            <div className="pt-10 flex justify-start flex-shrink-0 w-auto p-2 m-2 transition duration-200 rounded-lg cursor-pointer align-center  backdrop-filter-blur">
                <Image
                    className="items-center bg-white rounded-full w-14 h-14"
                    src={imgUrl}
                    alt={name}
                    height={14}
                    width={14}
                    quality={100}
                />
                <div className="w-full px-2 flex flex-col">

                    <div className="flex justify-between rating">
                        <p className="text-sm font-bold">{name}</p>
                        <div className="flex items-center">
                            <div className="text-yellow-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M10 0l2.4 6.6H17l-5.4 4.8 2.4 6.6-6.3-4.8-6.4 4.8 2.5-6.6L3 6.6H9.6z" />
                                </svg>
                            </div>
                            <div className="text-yellow-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M10 0l2.4 6.6H17l-5.4 4.8 2.4 6.6-6.3-4.8-6.4 4.8 2.5-6.6L3 6.6H9.6z" />
                                </svg>
                            </div>
                            <div className="text-yellow-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M10 0l2.4 6.6H17l-5.4 4.8 2.4 6.6-6.3-4.8-6.4 4.8 2.5-6.6L3 6.6H9.6z" />
                                </svg>
                            </div>
                            <div className="text-yellow-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M10 0l2.4 6.6H17l-5.4 4.8 2.4 6.6-6.3-4.8-6.4 4.8 2.5-6.6L3 6.6H9.6z" />
                                </svg>
                            </div>
                            <div className="text-yellow-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M10 0l2.4 6.6H17l-5.4 4.8 2.4 6.6-6.3-4.8-6.4 4.8 2.5-6.6L3 6.6H9.6z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <p className="pt-1 text-xs opacity-50">{courseName}</p>
                </div>
            </div>
        </div>
    );
}

export default TestimonialItem;
