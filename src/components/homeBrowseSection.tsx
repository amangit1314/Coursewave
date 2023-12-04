"use client";

import React from 'react'
import Image from 'next/image'
import { AiFillStar } from 'react-icons/ai';
// import { MdOutlineClass } from 'react-icons/md';
// import CourseWidget from '@/app/(browseCourses)/browseCourses/_components/course-widget';
import { CiBookmark } from "react-icons/ci";
// import { BsBookmarkCheckFill } from "react-icons/bs";
// import { Badge } from './ui/badge';

// const style = { color: "blue", fontSize: "1.5em" }
const starStyle = { color: "yellow" }

const tabs = [
    {
        title: "All",
    },
    {
        title: "Programming",
    },
    {
        title: "Management",
    },
    {
        title: "Sales",
    },
    {
        titile: "Data"
    }
];

const tabContentData = [
    {
        title: "Coding",
        content: "Content for Tab 1 goes here.",
        src: "/course_illus.png",
    },
    {
        title: "Programming",
        content: "Content for Tab 2 goes here.",
        src: "/images1.jpg",
    },
    {
        title: "Management",
        content: "Content for Tab 3 goes here.",
        src: "/images2.jpg",
    },
    {
        title: "Sales",
        content: "Content for Tab 4 goes here.",
        src: "/images3.jpg",
    },
    {
        title: "Data",
        content: "Content for Tab 4 goes here.",
        src: "/nextjs.png",
    }
];

const HomeBrowseSection = () => {
    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <div className="max-h-screen mt-[14rem] md:mt-[1rem] mb-12 max-w-7xl place-items-center items-center w-full h-full">
            <p className="text-2xl font-bold text-center">Browse Different Course Categories</p>
            <p className="pt-4 text-md opacity-80 text-center">
                Browse different courses according to the selected course <br /> categories on{' '}
                <span className="text-blue-500">Coursewave!</span>
            </p>

            {/* Tabs section */}
            <ul className="flex flex-wrap justify-center py-4 text-sm font-medium text-center mx-auto text-gray-500 dark:text-gray-400">
                {tabs.map((tab, index) => (
                    <li key={index} className="mr-2">
                        <a
                            href="#"
                            onClick={() => setActiveTab(index)}
                            className={`inline-block px-6 py-2 rounded-full hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white ${activeTab === index ? 'text-white bg-blue-600' : 'text-gray-500'
                                }`}
                        >
                            {tab.title}
                        </a>
                    </li>
                ))}
            </ul>

            {/* Tabs content section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-0 gap-y-2 md:gap-y-4 md:gap-x-16 my-6 w-9/12 justify-center mx-auto">
                {tabContentData.map((tab, index) => (
                    <CourseItem key={index} tab={tab} index={index} />
                    // <CourseWidget key={index} index={index.toString()} courseImage={tab.src} courseNumber={index.toString()} title={tab.title} duration='20' subject='Course Tab' instructor='Aman Soni' price='299' />
                ))
                }
            </div>

            {/* Courses Button */}
            <button className="flex justify-center px-6 mb-16 py-2 bg-blue-500 rounded-full place-items-center mx-auto font-bold text-sm text-white">
                Explore Courses
            </button>
        </div>
    );
};

export default HomeBrowseSection;

interface CourseItemProps {
    index: number;
    tab: any;
}

const CourseItem: React.FC<CourseItemProps> = ({
    index,
    tab,
}) => {
    return <div
        key={index}
        className={`group rounded-xl w-[15rem] dark:bg-gray-800 p-2.5 transition-colors hover:border-blue-500 hover:bg-white hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30`}
    >
        <Image
            className="h-40 w-[15rem] bg-slate-700 rounded-lg relative"
            src={tab.src}
            alt="Next.js Logo"
            width={250}
            height={35}
            style={{
                objectFit: 'cover',
            }}
        // unoptimized
        />
        {/* <Badge className='mt-2 text-xs bg-transparent text-blue-500 font-normal border-blue-500'>Default</Badge> */}
        <p className='mt-2 text-xs bg-transparent text-blue-500 font-normal border-blue-500'>Default</p>
        <p className="text-sm font-semibold line-clamp-2">{tab.title}</p>

        <div className="flex justify-between items-center py-auto">
            <div className="flex text-xs items-center py-auto">
                <AiFillStar className="my-2" style={starStyle} size={18} />
                <p className="ms-1 text-xs font-medium text-gray-500 dark:text-gray-400">4.95</p>
                <p className="ms-1 text-xs font-medium text-gray-500 dark:text-gray-400"> (25 </p>
                <p className="ms-1 text-xs font-medium text-gray-500 dark:text-gray-400">Reviews)</p>
            </div>

            <div className='h-7 hover:bg-indigo-600 w-7 p-1 items-center cursor-pointer flex py-auto justify-center rounded-full bg-indigo-400'>
                <CiBookmark size={16} style={{ color: "white" }} />
                {/* <BsBookmarkCheckFill /> */}
            </div>
        </div>

        <div className='flex justify-start'>
            <div className='flex justify-between'>
                <p className='text-xs'>◽ 10 Classes</p>
                <p className='pl-1 text-xs'>◽ 48 hours</p>
            </div>
        </div>
    </div>
}