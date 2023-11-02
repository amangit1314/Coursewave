import Image from 'next/image'
import React from 'react'
import { CgMenuRightAlt } from 'react-icons/cg';
import { FaCompass } from 'react-icons/fa';
import { TbArrowGuide, TbJewishStarFilled, TbBrandWish, TbShoppingCartCode } from 'react-icons/tb'
import { BiSearchAlt } from 'react-icons/bi'
import UserDropdown from './_components/user_dropdown';
import { BiBroadcast } from 'react-icons/bi';
import { FcCollaboration } from 'react-icons/fc'

const Browse = () => {
    return (
        <div>
            <div className=' max-w-8xl flex w-full items-center mx-auto py-auto justify-between  text-sm lg:flex'>
                <button data-drawer-target="cta-button-sidebar" data-drawer-toggle="cta-button-sidebar" aria-controls="cta-button-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <span className="sr-only">Open sidebar</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                </button>

                <aside id="cta-button-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                        <a href='/' className=" pt-2 pb-6 flex cursor-pointer items-center">
                            <Image
                                src="/courseWaveFaviconColored.png"
                                alt="CourseWave Logo"
                                className=""
                                width={30}
                                height={8}
                                priority
                            />
                            <p className="pl-2 text-blue-500 font-bold font-mono text-xl">Coursewave</p>
                        </a>
                        <ul className="space-y-2 font-medium">
                            <li>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <div className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-white'> <FaCompass size={22} /></div>

                                    <span className="flex-1 ml-3 whitespace-nowrap">Browse</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <BiBroadcast size={22} className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-white" />
                                    <span className="flex-1 ml-3 whitespace-nowrap">Sessions</span>
                                    <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <div className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-white'> <FcCollaboration size={22} /></div>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Mentorships</span>
                                    <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                                    </svg>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Inbox</span>
                                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                                </a>
                            </li>

                            <li>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <div className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-white'> <TbBrandWish size={22} /></div>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Wishlist</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <div className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-white'> <TbShoppingCartCode size={22} /></div>
                                    <span className="flex-1 ml-3 whitespace-nowrap">Cart</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </aside>

                {/* Content of the sidebar remaing 80% */}
                <div className="p-4 sm:ml-64 w-full">
                    <BrowseHeader />
                    {/* <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                                <p className="text-2xl text-gray-400 dark:text-gray-500">
                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </p>
                            </div>
                            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                                <p className="text-2xl text-gray-400 dark:text-gray-500">
                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </p>
                            </div>
                            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                                <p className="text-2xl text-gray-400 dark:text-gray-500">
                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                </svg>
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                                <p className="text-2xl text-gray-400 dark:text-gray-500">
                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </p>
                            </div>
                            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                                <p className="text-2xl text-gray-400 dark:text-gray-500">
                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </p>
                            </div>
                            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                                <p className="text-2xl text-gray-400 dark:text-gray-500">
                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </p>
                            </div>
                            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                                <p className="text-2xl text-gray-400 dark:text-gray-500">
                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                </svg>
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                                <p className="text-2xl text-gray-400 dark:text-gray-500">
                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </p>
                            </div>
                            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                                <p className="text-2xl text-gray-400 dark:text-gray-500">
                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </p>
                            </div>
                            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                                <p className="text-2xl text-gray-400 dark:text-gray-500">
                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </p>
                            </div>
                            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                                <p className="text-2xl text-gray-400 dark:text-gray-500">
                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </p>
                            </div>
                        </div>
                    B</div> */}
                </div>
            </div>
        </div>
    )
}

export default Browse

const BrowseHeader = () => {
    return (
        <div className=" max-w-screen px-16 lg:px-0 lg:max-w-8xl  flex w-full items-center py-2 justify-between text-sm lg:flex">
            <form className="flex items-center">
                <label className="sr-only">Search</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <BiSearchAlt />
                    </div>
                    <input type="text" id="voice-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for courses..." required />
                    <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3">
                    </button>
                </div>
            </form>

            <div className='flex justify-center'>
                <div className=" hidden xl:visible lg:visible lg:flex items-center py-auto">
                    <a href="/instructor" className="text-black font-md px-4 hover:text-blue-500">
                        Instructor Mode
                    </a>

                    <UserDropdown />
                </div>

                <CgMenuRightAlt size={24} className="visible xl:hidden lg:hidden md:hidden " />
            </div>
        </div>
    )
}

// <a href="/dashboard">
//    <button
//      onClick = { handleSignUpClick }
//      className = "text-blue-500 hover:text-sm hover:font-semibold hover:shadow-lg
//                   border cursor-pointer border-blue-500 hover:bg-blue-500
//                   hover:text-white bg-transparent font-md rounded-3xl px-4 py-2">
//          Dashboard
//     </button >
//     <p
//       className = "text-md hover:font-semibold hover:text-blue-500 border
//                    hover:border-blue-500 cursor-pointer bg-transparent font-md
//                    rounded-3xl px-4 py-2" >
//          Dashboard
//     </p >
// </a> 