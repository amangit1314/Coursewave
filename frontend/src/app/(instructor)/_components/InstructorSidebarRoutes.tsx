// "use client";

// import React from "react";
// import { BsFolder2, BsPersonVideo2, BsProjector } from "react-icons/bs";
// import { AiFillSetting } from "react-icons/ai";
// import { TbBrandGoogleAnalytics } from "react-icons/tb";
// import { FaBloggerB, FaHandsHelping } from "react-icons/fa";
// import { useRouter, usePathname } from "next/navigation";
// import { cn } from "@/lib/utils/utils";
// import { poppins } from "@/lib/config/fonts";

// const InstructorSideBarRoutes = () => {
//   const routes = [
//     {
//       icon: <TbBrandGoogleAnalytics size={22} />,
//       label: "Analytics",
//       href: `/instructor/analytics`,
//     },
//     {
//       icon: <BsPersonVideo2 size={22} />,
//       label: "Courses",
//       href: `/instructor/courses`,
//     },
//     // {
//     //   icon: <BsFolder2 size={22} />,
//     //   label: "Projects",
//     //   href: `/instructor/projects`,
//     // },
//     {
//       icon: <FaBloggerB size={22} />,
//       label: "Articles",
//       href: `/instructor/articles`,
//     },
//     // {
//     //   icon: <HiUserGroup size={22} />,
//     //   label: "Enrollments",
//     //   href: `/instructor/${instructorId}/enrollements`,
//     // },
//     // {
//     //   icon: <VscFeedback size={22} />,
//     //   label: "Feedback",
//     //   href: `/instructor/${instructorId}/feedback`,
//     // },
//     // {
//     //   icon: <BsPatchQuestion size={22} />,
//     //   label: "Questions",
//     //   href: `/instructor/${instructorId}/questions`,
//     // },
//     {
//       icon: <AiFillSetting size={22} />,
//       label: "Settings",
//       href: `/instructor/settings`,
//     },
//     {
//       icon: <FaHandsHelping size={22} />,
//       label: "Help & Support",
//       href: `/instructor/helpAndSupport`,
//     },
//   ];

//   return (
//     <div className="flex flex-col justify-between font-medium">
//       <ul className="space-y-2 font-medium">
//         {routes.map((route, index) => {
//           return (
//             <InstructorSidebarItem
//               key={index}
//               href={route.href}
//               icon={route.icon}
//               label={route.label}
//             />
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default InstructorSideBarRoutes;

// interface SidebarItemProps {
//   label: string;
//   icon: React.ReactNode;
//   href: string;
// }

// const InstructorSidebarItem = ({ href, icon, label }: SidebarItemProps) => {
//   const router = useRouter();
//   const pathname = usePathname();

//   const isActive =
//     (pathname?.includes("/analytics") && href.includes("/analytics")) ||
//     (pathname?.includes("/courses") && href.includes("/courses")) ||
//     (pathname?.includes("/sessions") && href.includes("/sessions")) ||
//     (pathname?.includes("/enrollements") && href.includes("/enrollements")) ||
//     pathname === href ||
//     pathname?.includes(`${href}`);

//   const onClick = () => {
//     router.push(href);
//   };

//   return (
//     <div className={poppins.className}>
//       <button
//         onClick={onClick}
//         type="button"
//         className={cn(
//           "group flex w-full items-center rounded-md text-gray-900 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
//           isActive &&
//             "bg-blue-200/20 text-blue-500 hover:bg-blue-200/20 hover:text-blue-500"
//         )}
//       >
//         <div className="item-center flex gap-x-2 py-2 pl-2">
//           <div className={cn("text-slate-500", isActive && "text-blue-500")}>
//             {icon}
//           </div>
//           <span className="ml-3 flex-1 whitespace-nowrap tracking-tight">
//             {label}{" "}
//           </span>
//         </div>
//         <div
//           className={cn(
//             "ml-auto h-8 rounded-l-md border-2 border-blue-500 opacity-0 transition-all",
//             isActive && "opacity-100"
//           )}
//         />
//       </button>
//     </div>
//   );
// };

"use client";

import React, { useState } from "react";
import {
  BsFolder2,
  BsPersonVideo2,
  BsProjector,
  BsChevronDown,
  BsChevronRight,
} from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaBloggerB, FaHandsHelping, FaUsers } from "react-icons/fa";
import { MdOndemandVideo, MdGroups } from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import { poppins } from "@/lib/config/fonts";
import { FaMoneyCheck } from "react-icons/fa6";

// const InstructorSideBarRoutes = () => {
//   const [expandedGroups, setExpandedGroups] = useState({
//     analytics: true,
//     content: true,
//     audience: true,
//     settings: true
//   });

//   const toggleGroup = (group: string) => {
//     setExpandedGroups(prev => ({
//       ...prev,
//       [group as keyof typeof expandedGroups]: !prev[group as keyof typeof expandedGroups]
//     }));
//   };

//   const routes = [
//     {
//       group: "Analytics",
//       key: "analytics",
//       icon: <TbBrandGoogleAnalytics size={20} />,
//       routes: [
//         {
//           icon: <TbBrandGoogleAnalytics size={18} />,
//           label: "Dashboard",
//           href: `/instructor/analytics`,
//         },
//         {
//           icon: <FaUsers size={18} />,
//           label: "Students",
//           href: `/instructor/students`,
//         },
//       ]
//     },
//     {
//       group: "Content",
//       key: "content",
//       icon: <BsFolder2 size={20} />,
//       routes: [
//         {
//           icon: <BsPersonVideo2 size={18} />,
//           label: "Courses",
//           href: `/instructor/courses`,
//         },
//         {
//           icon: <FaBloggerB size={18} />,
//           label: "Articles",
//           href: `/instructor/articles`,
//         },
//         {
//           icon: <BsProjector size={18} />,
//           label: "Projects",
//           href: `/instructor/projects`,
//         },
//         {
//           icon: <MdOndemandVideo size={18} />,
//           label: "Live Sessions",
//           href: `/instructor/sessions`,
//         },
//       ]
//     },
//     {
//       group: "Audience",
//       key: "audience",
//       icon: <FaUsers size={20} />,
//       routes: [
//         {
//           icon: <MdGroups size={18} />,
//           label: "Communities",
//           href: `/instructor/communities`,
//         },
//       ]
//     },
//     {
//       group: "Settings",
//       key: "settings",
//       icon: <AiFillSetting size={20} />,
//       routes: [
//         {
//           icon: <AiFillSetting size={18} />,
//           label: "Profile & Settings",
//           href: `/instructor/settings`,
//         },
//         {
//           icon: <FaHandsHelping size={18} />,
//           label: "Help & Support",
//           href: `/instructor/helpAndSupport`,
//         },
//       ]
//     },
//   ];

//   return (
//     <div className="flex flex-col justify-between font-medium">
//       <ul className="space-y-1 font-medium">
//         {routes.map((group, index) => (
//           <li key={group.key} className="mb-2">
//             {/* Group Header */}
//             <button
//               onClick={() => toggleGroup(group.key)}
//               className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               <div className="flex items-center gap-x-2">
//                 <span className="text-slate-500">{group.icon}</span>
//                 <span className="tracking-tight">{group.group}</span>
//               </div>
//               {expandedGroups[group.key as keyof typeof expandedGroups] ? (
//                 <BsChevronDown size={14} className="text-slate-400" />
//               ) : (
//                 <BsChevronRight size={14} className="text-slate-400" />
//               )}
//             </button>

//             {/* Group Routes */}
//             {expandedGroups[group.key as keyof typeof expandedGroups] && (
//               <ul className="mt-1 space-y-1 border-l border-gray-200 pl-3 dark:border-gray-700">
//                 {group.routes.map((route, routeIndex) => (
//                   <InstructorSidebarItem
//                     key={routeIndex}
//                     href={route.href}
//                     icon={route.icon}
//                     label={route.label}
//                     isNested={true}
//                   />
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default InstructorSideBarRoutes;

const InstructorSideBarRoutes = () => {
  const [expandedGroups, setExpandedGroups] = useState({
    analytics: true,
    content: true,
    audience: true,
    settings: true,
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group as keyof typeof expandedGroups]:
        !prev[group as keyof typeof expandedGroups],
    }));
  };

  const routes = [
    {
      group: "Analytics",
      key: "analytics",
      icon: <TbBrandGoogleAnalytics size={20} />,
      routes: [
        {
          icon: <TbBrandGoogleAnalytics size={18} />,
          label: "Dashboard",
          href: `/instructor/analytics`,
        },
        {
          icon: <FaMoneyCheck size={18} />,
          label: "Earnings",
          href: `/instructor/earnings`,
        },
        {
          icon: <FaUsers size={18} />,
          label: "Students",
          href: `/instructor/students`,
        },
      ],
    },
    {
      group: "Content",
      key: "content",
      icon: <BsFolder2 size={20} />,
      routes: [
        {
          icon: <BsPersonVideo2 size={18} />,
          label: "Courses",
          href: `/instructor/courses`,
        },
        {
          icon: <FaBloggerB size={18} />,
          label: "Articles",
          href: `/instructor/articles`,
        },
        {
          icon: <BsProjector size={18} />,
          label: "Projects",
          href: `/instructor/projects`,
        },
        {
          icon: <MdOndemandVideo size={18} />,
          label: "Live Sessions",
          href: `/instructor/sessions`,
        },
      ],
    },
    {
      group: "Audience",
      key: "audience",
      icon: <FaUsers size={20} />,
      routes: [
        {
          icon: <MdGroups size={18} />,
          label: "Communities",
          href: `/instructor/communities`,
        },
      ],
    },
    {
      group: "Settings",
      key: "settings",
      icon: <AiFillSetting size={20} />,
      routes: [
        {
          icon: <AiFillSetting size={18} />,
          label: "Profile & Settings",
          href: `/instructor/settings`,
        },
        {
          icon: <FaHandsHelping size={18} />,
          label: "Help & Support",
          href: `/instructor/helpAndSupport`,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col justify-between font-medium">
      <ul className="space-y-1 font-medium">
        {routes.map((group, index) => (
          <li key={group.key} className="mb-2">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.key)}
              className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-x-2">
                <span className="text-slate-500">{group.icon}</span>
                <span className="tracking-tight">{group.group}</span>
              </div>
              {expandedGroups[group.key as keyof typeof expandedGroups] ? (
                <BsChevronDown size={14} className="text-slate-400" />
              ) : (
                <BsChevronRight size={14} className="text-slate-400" />
              )}
            </button>

            {/* Group Routes with GitHub-like branching */}
            {expandedGroups[group.key as keyof typeof expandedGroups] && (
              <ul className="relative mt-1 space-y-0 pl-3">
                {group.routes.map((route, routeIndex) => (
                  <li key={routeIndex} className="relative">
                    <InstructorSidebarItem
                      href={route.href}
                      icon={route.icon}
                      label={route.label}
                      isNested={true}
                      isLastItem={routeIndex === group.routes.length - 1}
                    />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstructorSideBarRoutes;

// interface SidebarItemProps {
//   label: string;
//   icon: React.ReactNode;
//   href: string;
//   isNested?: boolean;
// }

// const InstructorSidebarItem = ({
//   href,
//   icon,
//   label,
//   isNested = false,
// }: SidebarItemProps) => {
//   const router = useRouter();
//   const pathname = usePathname();

//   const isActive =
//     (pathname?.includes("/analytics") && href.includes("/analytics")) ||
//     (pathname?.includes("/courses") && href.includes("/courses")) ||
//     (pathname?.includes("/articles") && href.includes("/articles")) ||
//     (pathname?.includes("/projects") && href.includes("/projects")) ||
//     (pathname?.includes("/sessions") && href.includes("/sessions")) ||
//     (pathname?.includes("/students") && href.includes("/students")) ||
//     (pathname?.includes("/communities") && href.includes("/communities")) ||
//     (pathname?.includes("/settings") && href.includes("/settings")) ||
//     (pathname?.includes("/helpAndSupport") &&
//       href.includes("/helpAndSupport")) ||
//     pathname === href;

//   const onClick = () => {
//     router.push(href);
//   };

//   return (
//     <div className={poppins.className}>
//       <button
//         onClick={onClick}
//         type="button"
//         className={cn(
//           "group flex w-full items-center rounded-md text-gray-900 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
//           isActive &&
//             "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
//           isNested ? "py-1.5 pl-2 text-sm" : "py-2 pl-2"
//         )}
//       >
//         <div className="item-center flex gap-x-2">
//           <div
//             className={cn(
//               "text-slate-500 transition-colors",
//               isActive && "text-blue-500",
//               isNested ? "scale-90" : "scale-100"
//             )}
//           >
//             {icon}
//           </div>
//           <span
//             className={cn(
//               "flex-1 whitespace-nowrap tracking-tight text-left transition-colors",
//               isNested ? "text-sm" : "text-base"
//             )}
//           >
//             {label}
//           </span>
//         </div>
//         {isActive && !isNested && (
//           <div className="ml-auto h-8 rounded-l-md border-2 border-blue-500" />
//         )}
//         {isActive && isNested && (
//           <div className="ml-auto h-6 w-1 rounded-full bg-blue-500" />
//         )}
//       </button>
//     </div>
//   );
// };

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  href: string;
  isNested?: boolean;
  isLastItem?: boolean;
}

const InstructorSidebarItem = ({
  href,
  icon,
  label,
  isNested = false,
  isLastItem = false,
}: SidebarItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive =
    (pathname?.includes("/analytics") && href.includes("/analytics")) ||
    (pathname?.includes("/courses") && href.includes("/courses")) ||
    (pathname?.includes("/articles") && href.includes("/articles")) ||
    (pathname?.includes("/projects") && href.includes("/projects")) ||
    (pathname?.includes("/sessions") && href.includes("/sessions")) ||
    (pathname?.includes("/students") && href.includes("/students")) ||
    (pathname?.includes("/communities") && href.includes("/communities")) ||
    (pathname?.includes("/settings") && href.includes("/settings")) ||
    (pathname?.includes("/helpAndSupport") &&
      href.includes("/helpAndSupport")) ||
    pathname === href;

  const onClick = () => {
    router.push(href);
  };

  return (
    <div className={poppins.className}>
      <div className="relative flex">
        {/* GitHub-like branching lines */}
        {isNested && (
          <div className="absolute left-0 top-0 h-full w-5">
            {/* Vertical line connecting all items */}
            <div
              className={cn(
                "absolute left-2 top-0 w-0.5 bg-gray-200 dark:bg-gray-700",
                isLastItem ? "h-1/2" : "h-full"
              )}
            />
            {/* Horizontal line connecting to item */}
            <div className="absolute left-2 top-1/2 w-3 -translate-y-1/2 border-t border-gray-200 dark:border-gray-700" />
          </div>
        )}

        <button
          onClick={onClick}
          type="button"
          className={cn(
            "group relative z-10 ml-5 flex w-full items-center rounded-md text-gray-900 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
            isActive &&
              "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
            isNested ? "py-1.5 pl-2 text-sm" : "py-2 pl-2"
          )}
        >
          <div className="item-center flex gap-x-2">
            <div
              className={cn(
                "text-slate-500 transition-colors",
                isActive && "text-blue-500",
                isNested ? "scale-90" : "scale-100"
              )}
            >
              {icon}
            </div>
            <span
              className={cn(
                "flex-1 whitespace-nowrap tracking-tight text-left transition-colors",
                isNested ? "text-sm" : "text-base"
              )}
            >
              {label}
            </span>
          </div>

          {/* Active indicator for nested items */}
          {isActive && isNested && (
            <div className="ml-auto h-4 w-1 rounded-full bg-blue-500" />
          )}
        </button>
      </div>
    </div>
  );
};
