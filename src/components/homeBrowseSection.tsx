"use client";

import React from 'react'
import Image from 'next/image'
import { AiFillStar } from 'react-icons/ai';
import { MdOutlineClass } from 'react-icons/md';

const style = { color: "blue", fontSize: "1.5em" }

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
    },
    {
        title: "Coding",
        content: "Content for Tab 1 goes here.",
        src: "/web3.png",
    },
    {
        title: "Programming",
        content: "Content for Tab 2 goes here.",
        src: "/android-jetpack.png",
    },
    {
        title: "Management",
        content: "Content for Tab 3 goes here.",
        src: "/course_illus.png",
    },
];

const HomeBrowseSection = () => {
    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <div className="max-h-screen mb-12 max-w-7xl place-items-center items-center w-full h-full">
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 my-6 w-9/12 justify-center mx-auto">
                {tabContentData.map((tab, index) => (
                    <CourseItem key={index} tab={tab} index={index} />
                ))}
            </div>

            {/* Courses Button */}
            <button className="flex justify-center px-6 mb-16 py-2 bg-blue-500 rounded-full place-items-center mx-auto font-semibold text-md text-white">
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
        className={`group rounded-lg border border-blue-100 p-3 transition-colors hover:border-blue-500 hover:bg-white hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30`}
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
            priority
        />
        <h2 className="pt-4 text-md font-semibold">{tab.title}</h2>

        <div className="pl-1 flex justify-start items-center py-1">
            {/* stars */}
            <div className="flex justify-start">
                <AiFillStar className="my-2" style={style} size={18} />
                <AiFillStar className="my-2" style={style} size={18} />
                <AiFillStar className="my-2" style={style} size={18} />
                <AiFillStar className="my-2" style={style} size={18} />
                <AiFillStar className="my-2" style={style} size={18} />
            </div>

            {/* rating number */}
            <div className="pl-1 flex text-sm">5.0
                <div className="pl-1 text-sm font-semibold">(25)</div>
            </div>
        </div>

        <div className='flex justify-between'>
            <div className='flex justify-start'>
                <MdOutlineClass style={style} size={20} />
                <p className='pl-1 text-sm'> 10 Classes</p>
            </div>

            <p className='font-bold text-blue-500'>499 ₹</p>
        </div>
        {/* <p className="text-sm opacity-80">{tab.content}</p> */}
    </div>
}