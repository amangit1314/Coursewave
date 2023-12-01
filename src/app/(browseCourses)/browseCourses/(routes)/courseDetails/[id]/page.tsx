"use client";

import { Badge } from '@/components/ui/badge';
import { course } from '@prisma/client'
import React, { useEffect } from 'react'
import { BsPersonVideo2 } from 'react-icons/bs';
import { FaCircleCheck } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa";
import { TbCertificate } from "react-icons/tb";
import { GoProjectTemplate } from "react-icons/go";

function CoursePreview({ params }: any) {

    const [loading, setLoading] = React.useState(true);
    const [course, setCourse] = React.useState<course>();
    const [accordionState, setAccordionState] = React.useState({
        section1: false,
        section2: false,
        section3: false,
        // ... add more sections as needed
    });

    const style = { color: "blue", fontSize: "1.5em" }

    useEffect(() => {
        fetch(`https://localhost:3000/api/courses/${params.id}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch courses');
                }
            })
            .then((data) => {
                console.log(data); // Check the data in the console

                // Assuming your data.data is an array of courses
                setCourse(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
                setLoading(false);
            });
    });

    return (
        <div className='flex py-[2rem] '>
            <div className='pt-[75px] flex flex-col text-red items-start justify-center text-start text-xl'>
                <div className='flex justify-center '>
                    <p className='text-xs text-blue-500 dark:text-blue-400'>Development</p>
                    <p className='text-xs text-blue-500 dark:text-blue-400'>{course?.courseCategories}</p>
                </div>

                <div className='flex flex-col'>
                    <p className='font-semibold text-2xl'>
                        {course?.courseTitle}
                    </p>

                    <p className='text-sm pt-1 pb-1.5 pr-[8rem] w-auto line-clamp-3 font-noraml text-gray-500 dark:text-gray-400'>
                        {course?.courseDescription ? course?.courseDescription : 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat.'}
                    </p>

                    <div className='flex justify-start'>
                        <RatingStars />
                        <p className='ms-1 cursor-pointer text-sm font-medium text-blue-500 dark:text-blue-400 underline'>{`(${239} ratings)`}</p>
                        <p className='ms-1 pl-1 text-sm font-medium text-gray-500 dark:text-gray-500'>{`(${1456} enrollements)`}</p>
                    </div>

                    <div className='mt-3 py-auto items-center flex justify-start'>
                        <Badge variant='default'>
                            <div className='px-1'>
                                <FaCircleCheck style={style} />
                            </div>
                            Creator
                            <p className='pl-1 text-sm cursor-pointer text-indigo-400 dark:text-indigo-600 underline'>
                                {/* {course?.instructorID?.substring(0, 8)} */}
                                Aman Soni
                            </p>
                        </Badge>
                    </div>

                    <WhatYouWillLearn />

                    <ThisCourseIncludes />

                    <CourseContent />
                </div>
            </div>

            <div className='w-[30rem] mt-[75px] z-99 rounded-lg bg-indigo-400 h-[30rem]'>

            </div>
        </div>

    )
}

export default CoursePreview

function RatingStars() {
    return (


        <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">4.95</p>
            <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
            <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5, </p>
        </div>

    )
}

function WhatYouWillLearn() {
    return <div className='py-8 flex '>
        <div className="flex flex-col p-2 max-w-3xl text-start text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">What you will learn!</h3>

            <div className="grid grid-cols-3 gap-4 mb-8 text-left">
                <li className="flex items-center space-x-3">
                    <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span className='text-sm'>Individual configuration</span>
                </li>
                <li className="flex items-center space-x-3">

                    <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span className='text-sm'>No setup, or hidden fees</span>
                </li>
                <li className="flex items-center space-x-3">

                    <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span className='text-sm'>Team size: <span className="text-sm font-semibold">1 developer</span></span>
                </li>
                <li className="flex items-center space-x-3">

                    <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span className='text-sm'>Premium support: <span className=" text-sm font-semibold">6 months</span></span>
                </li>
                <li className="flex items-center space-x-3">

                    <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span className='text-sm'>Free updates: <span className="text-sm  font-semibold">6 months</span></span>
                </li>
            </div>
        </div>
    </div>
}

function ThisCourseIncludes() {
    return <div className='flex flex-col items-start pt-2'>
        <h3 className="mb-4 text-xl font-semibold">This course includes:</h3>
        <div className='grid px-2 grid-cols-2 gap-x-24 gap-2 justify-start pb-6 '>
            <ThisCourseIncludesItem icon={<BsPersonVideo2 />} text='300+ video lectures' />
            <ThisCourseIncludesItem icon={<TbCertificate />} text='Certificate of Completion' />
            <ThisCourseIncludesItem icon={<FaDownload />} text='20+ Downloadable Resources' />
            <ThisCourseIncludesItem icon={< GoProjectTemplate />} text='Complete E-commerce Project' />
        </div>
    </div>
}

function ThisCourseIncludesItem({ icon, text }: any) {
    return <div
        className='flex py-auto justify-start items-center'>
        <div>{icon}</div>
        <p className='pl-2 text-sm text-gray-500 dark:text-gray-400'>{text}</p>
    </div>
}

function CourseContent() {
    return <div className='mt-4 max-w-3xl'>
        <h3 className="mb-4 text-xl font-semibold">Course Content:</h3>
        <div className='flex justify-between pb-2'>
            <div className='flex justify-start'>
                {/* sections */}
                <p className='text-sm'>◽ 101 sections</p>
                {/* lections */}
                <p className='text-sm px-1'>◽ 300 lectures</p>
                {/* total length */}
                <p className='text-sm'>◽ 40h 57m total length</p>
            </div>
            {/* Expand all sections */}
            <div className='font-normal font-indigo-500 text-sm'>Expand all sections</div>
        </div>
        <CollapseExpandAccordion />
    </div>
}

// -----------------------------------------------------------------------------------------
function NewAccordion() {
    return (

        <div id="accordion-color" data-accordion="collapse" data-active-classes="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white">
            <CollapseExpandAccordionItem
                accordionCollapseHeaderId='accordion-color-heading-1'
                accordionCollapsBodyId='accordion-color-body-1'
                dataAccordionTarget=''
                areaControls=''
                headingText='Introduction Video'
            />
            {/* ------------------------------------------------------------------------ */}
            <h2 id="accordion-color-heading-1">
                <button type="button" className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 dark:border-gray-700 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-color-body-1" aria-expanded="true" aria-controls="accordion-color-body-1">
                    <span>What is Flowbite?</span>
                    <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5" />
                    </svg>
                </button>
            </h2>
            <div id="accordion-color-body-1" className="hidden" aria-labelledby="accordion-color-heading-1">
                <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more.</p>
                    <p className="text-gray-500 dark:text-gray-400">Check out this guide to learn how to <a href="/docs/getting-started/introduction/" className="text-blue-600 dark:text-blue-500 hover:underline">get started</a> and start developing websites even faster with components on top of Tailwind CSS.</p>
                </div>
            </div>
            <h2 id="accordion-color-heading-2">
                <button type="button" className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 dark:border-gray-700 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-color-body-2" aria-expanded="false" aria-controls="accordion-color-body-2">
                    <span>Is there a Figma file available?</span>
                    <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5" />
                    </svg>
                </button>
            </h2>
            <div id="accordion-color-body-2" className="hidden" aria-labelledby="accordion-color-heading-2">
                <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">Flowbite is first conceptualized and designed using the Figma software so everything you see in the library has a design equivalent in our Figma file.</p>
                    <p className="text-gray-500 dark:text-gray-400">Check out the <a href="https://flowbite.com/figma/" className="text-blue-600 dark:text-blue-500 hover:underline">Figma design system</a> based on the utility classes from Tailwind CSS and components from Flowbite.</p>
                </div>
            </div>
            <h2 id="accordion-color-heading-3">
                <button type="button" className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 dark:border-gray-700 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-color-body-3" aria-expanded="false" aria-controls="accordion-color-body-3">
                    <span>What are the differences between Flowbite and Tailwind UI?</span>
                    <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5" />
                    </svg>
                </button>
            </h2>
            <div id="accordion-color-body-3" className="hidden" aria-labelledby="accordion-color-heading-3">
                <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone components, whereas Tailwind UI offers sections of pages.</p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">However, we actually recommend using both Flowbite, Flowbite Pro, and even Tailwind UI as there is no technical reason stopping you from using the best of two worlds.</p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">Learn more about these technologies:</p>
                    <ul className="ps-5 text-gray-500 list-disc dark:text-gray-400">
                        <li><a href="https://flowbite.com/pro/" className="text-blue-600 dark:text-blue-500 hover:underline">Flowbite Pro</a></li>
                        <li><a href="https://tailwindui.com/" rel="nofollow" className="text-blue-600 dark:text-blue-500 hover:underline">Tailwind UI</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------------------

function CollapseExpandAccordion() {
    return (
        <div id="accordion-collapse" data-accordion="collapse">
            <CollapseExpandAccordionItem
                accordionCollapseHeaderId=''
                accordionCollapsBodyId=''
                dataAccordionTarget=''
                areaControls=''
                headingText='Introduction'
            />
            <CollapseExpandAccordionItem
                accordionCollapseHeaderId=''
                accordionCollapsBodyId=''
                dataAccordionTarget=''
                areaControls=''
                headingText='Introduction'
            />
            <CollapseExpandAccordionItem
                accordionCollapseHeaderId=''
                accordionCollapsBodyId=''
                dataAccordionTarget=''
                areaControls=''
                headingText='Introduction'
            />
            {/* <p id="accordion-collapse-heading-1">
                <button type="button"
                    className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-collapse-body-1" aria-expanded="true" aria-controls="accordion-collapse-body-1">
                    <span className='text-sm'>What is Flowbite?</span>
                    <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5" />
                    </svg>
                </button>
            </p>
            <div id="accordion-collapse-body-1" className="hidden" aria-labelledby="accordion-collapse-heading-1">
                <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more.</p>
                    <p className="text-gray-500 dark:text-gray-400">Check out this guide to learn how to <a href="/docs/getting-started/introduction/" className="text-blue-600 dark:text-blue-500 hover:underline">get started</a> and start developing websites even faster with components on top of Tailwind CSS.</p>
                </div>
            </div> */}
            {/* ------------------------------------------------------------- */}
            {/* <p id="accordion-collapse-heading-2">
                <button type="button" className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-collapse-body-2" aria-expanded="false" aria-controls="accordion-collapse-body-2">
                    <span className='text-sm'>Is there a Figma file available?</span>
                    <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5" />
                    </svg>
                </button>
            </p>
            <div id="accordion-collapse-body-2" className="hidden" aria-labelledby="accordion-collapse-heading-2">
                <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">Flowbite is first conceptualized and designed using the Figma software so everything you see in the library has a design equivalent in our Figma file.</p>
                    <p className="text-gray-500 dark:text-gray-400">Check out the <a href="https://flowbite.com/figma/" className="text-blue-600 dark:text-blue-500 hover:underline">Figma design system</a> based on the utility classes from Tailwind CSS and components from Flowbite.</p>
                </div>
            </div> */}
            {/* ------------------------------------------------------------- */}
            {/* <p id="accordion-collapse-heading-3">
                <button type="button"
                    className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-collapse-body-3"
                    aria-expanded="false" aria-controls="accordion-collapse-body-3">
                    <span className='text-sm'>What are the differences between Flowbite and Tailwind UI?</span>
                    <svg data-accordion-icon
                        className="w-3 h-3 rotate-180 shrink-0"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2" d="M9 5 5 1 1 5" />
                    </svg>
                </button>
            </p>
            <div
                id="accordion-collapse-body-3"
                className="hidden" aria-labelledby="accordion-collapse-heading-3">
                <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone components, whereas Tailwind UI offers sections of pages.
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        However, we actually recommend using both Flowbite, Flowbite Pro, and even Tailwind UI as there is no technical reason stopping you from using the best of two worlds.
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        Learn more about these technologies:
                    </p>
                    <ul className="ps-5 text-gray-500 list-disc dark:text-gray-400">
                        <li>
                            <a
                                href="https://flowbite.com/pro/"
                                className="text-blue-600 dark:text-blue-500 hover:underline">
                                Flowbite Pro
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://tailwindui.com/"
                                rel="nofollow"
                                className="text-blue-600 dark:text-blue-500 hover:underline">
                                Tailwind UI
                            </a>
                        </li>
                    </ul>
                </div>
            </div> */}
        </div>
    )
}

interface CollapseAccordionItemProps {
    accordionCollapseHeaderId: string
    accordionCollapsBodyId: string
    dataAccordionTarget: string
    areaControls: string
    headingText: string
}

const CollapseExpandAccordionItem: React.FC<CollapseAccordionItemProps> = ({ accordionCollapseHeaderId, accordionCollapsBodyId, dataAccordionTarget, areaControls, headingText }) => {
    const [accordionState, setAccordionState] = React.useState({
        section1: false,
        section2: false,
        section3: false,
        // ... add more sections as needed
    });


    const toggleAccordion = () => {
        setAccordionState((prevState) => ({
            ...prevState,
            [dataAccordionTarget]: false,
        }));
    };
    
    return (
        <div>
            <p id={accordionCollapseHeaderId}>
                <button type="button"
                    className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                    data-accordion-target={dataAccordionTarget}
                    aria-expanded="true" aria-controls={areaControls}>
                    <span className='text-sm'>{headingText}</span>
                    <svg data-accordion-icon
                        className="w-3 h-3 rotate-180 shrink-0"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 10 6">
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5 5 1 1 5" />
                    </svg>
                </button>
            </p>
            <div
                id={accordionCollapsBodyId}
                className="hidden" aria-labelledby="accordion-collapse-heading-1">
                <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more.
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                        Check out this guide to learn how to
                        <a href="/docs/getting-started/introduction/"
                            className="text-blue-600 dark:text-blue-500 hover:underline">
                            get started
                        </a>
                        and start developing websites even faster with components on top of Tailwind CSS.
                    </p>
                </div>
            </div>
        </div>
    )
}