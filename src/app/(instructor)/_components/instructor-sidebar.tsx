import React from 'react'
import Image from 'next/image'
import InstructorSidebarRoutes from './instructor-sidebar-routes'

function InstructorSidebar() {
    return (
        <div
            className="fixed border-r top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 shadow-sm bg-white overflow-y-auto" aria-label="InstructorSidebar"
        >
            <div className="h-full pl-3 md:px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <a href='/browseCourses' className="pb-6 flex cursor-pointer items-center">
                    <Image
                        src="/assets/images/logo/coursewave-favicon-color.png"
                        alt="CourseWave Logo"
                        className=""
                        width={30}
                        height={8}
                        priority
                    />
                    <p className="pl-2 text-blue-500 font-bold font-mono text-xl">Coursewave</p>
                </a>
                <InstructorSidebarRoutes />
            </div>
        </div>
    )
}

export default InstructorSidebar