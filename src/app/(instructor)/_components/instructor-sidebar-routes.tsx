import React from 'react'
import { BsPersonVideo2 } from 'react-icons/bs';
import { AiFillSetting, AiOutlineTransaction } from 'react-icons/ai'
import { BiBroadcast } from 'react-icons/bi';
import { BsPatchQuestion } from 'react-icons/bs';
import { TbBrandGoogleAnalytics } from 'react-icons/tb';
import SidebarItem from '@/app/(browseCourses)/browseCourses/_components/sidebarItem';
// import { RxDashboard } from 'react-icons/rx';
// import { FaFileInvoice } from "react-icons/fa6";
import { HiUserGroup } from 'react-icons/hi';
import { useParams } from 'next/navigation';



function InstructorSideBarRoutes() {
    let { instructorId } = useParams();

    const routes = [
        {
            icon: <TbBrandGoogleAnalytics size={22} />,
            label: 'Analytics',
            href: `/instructor/${instructorId}/analytics`,
        },
        // {
        //     icon: <RxDashboard size={22} />,
        //     label: 'Dashboard',
        //     href: '/instructorDashboard',
        // },
        {
            icon: <BiBroadcast size={22} />,
            label: 'Sessions',
            href: `/instructor/${instructorId}/createdSessions`,
        },
        {
            icon: <BsPersonVideo2 size={22} />,
            label: 'Courses',
            href: `/instructor/${instructorId}/courses/createdCourses`,
        },
        {
            icon: <HiUserGroup size={22} />,
            label: 'Enrollements',
            href: `/instructor/${instructorId}/enrollements`
        },
        // {
        //     icon: <FaFileInvoice size={22} />,
        //     label: 'Invoices',
        //     href: '/invoices'
        // },
        {
            icon: <AiOutlineTransaction size={22} />,
            label: 'Payouts',
            href: `/instructor/${instructorId}/payouts`,
        }, {
            icon: <BsPatchQuestion size={22} />,
            label: 'Questions',
            href: `/instructor/${instructorId}/questions`,
        },
        {
            icon: <AiFillSetting size={22} />,
            label: 'Settings',
            href: `/instructor/${instructorId}/instructorSettings`,
        },
    ]

    return (
        <ul className="space-y-2 font-medium">
            {routes.map((route, index) => {
                return (
                    <SidebarItem
                        key={index}
                        href={route.href}
                        icon={route.icon}
                        label={route.label}
                    />
                )
            })}
        </ul>
    )
}

export default InstructorSideBarRoutes