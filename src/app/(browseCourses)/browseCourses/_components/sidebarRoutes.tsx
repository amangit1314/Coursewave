import React from 'react'
import { FaCompass } from 'react-icons/fa';
import { AiFillSetting, AiOutlineTransaction } from 'react-icons/ai'
import { BiBroadcast } from 'react-icons/bi';
import { TbShoppingCartCode } from 'react-icons/tb';
import SidebarItem from './sidebarItem';
import { MdDashboard } from 'react-icons/md';
import { CiLogout } from 'react-icons/ci';
import { ImSearch } from 'react-icons/im';
import { UserButton } from '@clerk/nextjs';

const routes = [
    {
        icon: <MdDashboard size={22} />,
        label: 'EnrolledCourses',
        href: `/${1234}/enrolledCourses`,
    },
    {
        icon: <FaCompass size={22} />,
        label: 'Browse',
        href: `/browseCourses`,
    },
    {
        icon: <ImSearch  size={22} />,
        label: 'Search',
        href: `/search`,
    },
    {
        icon: <BiBroadcast size={22} />,
        label: 'Sessions',
        href: `/browseSessions`,
    },
    // {
    //     icon: <TbShoppingCartCode size={22} />,
    //     label: 'Cart',
    //     href: `/cart`,
    // },
    {
        icon: <AiOutlineTransaction size={22} />,
        label: 'Subscription',
        href: `/subscription`,
    },
    {
        icon: <AiFillSetting size={22} />,
        label: 'Settings',
        href: `/settings`,
    }
]

function SideBarRoutes() {
    return (
        <div className='flex flex-col font-medium justify-between'>
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

            {/* <div className='mt-[19rem]'> */}
                {/* <SidebarItem
                    href='/signOut'
                    icon={<CiLogout size={22} />}
                    label='LogOut'
                /> */}
                {/* <UserButton afterSignOutUrl="/" /> */}
            {/* </div> */}
        </div>
    )
}

export default SideBarRoutes