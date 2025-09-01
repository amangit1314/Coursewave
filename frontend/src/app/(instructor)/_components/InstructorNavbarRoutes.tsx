"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { ThemeModeToggle } from "@/app/(shared)/ThemeModeToggle";
import UserAvatar from "@/app/(shared)/UserAvatar";
import { useUserStore } from "@/zustand/userStore";
import { poppins } from "@/lib/config/fonts";
import Notifications from "@/app/(shared)/NotificationButton";

// const InstructorNavbarRoutes = () => {
//   const pathname = usePathname();
//   const router = useRouter();

//   const switchBack: any = () => {
//     router.push("/browseCourses");
//   };

//   const { user } = useUserStore();

//   return (
//     <div className="flex w-full items-center justify-between ml-64">
//       <div className={poppins.className}>
//         <div className="text-md hidden bg-transparent text-base font-semibold tracking-tight text-black dark:text-white md:flex">
//           Instructor Dashboard
//         </div>
//       </div>
//       <div className="ml-auto flex justify-end gap-x-2">
//         <Button
//           onClick={switchBack}
//           className="mx-auto cursor-pointer h-9 items-center rounded-lg border border-black border-opacity-10 bg-transparent px-4 text-xs text-black hover:border-opacity-100 hover:bg-slate-50 dark:border-white dark:border-opacity-10 dark:text-white dark:hover:border-opacity-100 dark:hover:bg-zinc-700"
//         >
//           Go back
//         </Button>

//         <div className="mx-2">
//           <ThemeModeToggle />
//         </div>

//         <Notifications />

//         <div className={poppins.className}>
//           <UserAvatar />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InstructorNavbarRoutes;

const InstructorNavbarRoutes = () => {
  const router = useRouter();
  const { user } = useUserStore();

  const switchBack = () => {
    router.push("/browseCourses");
  };

  return (
    <div
      className={`${poppins.className} flex w-full items-center justify-end`}
    >
      {/* Dashboard Title - Hidden on mobile, visible on md+ */}
      {/* <div className="hidden md:block md:pl-64">
        <h1 className="text-xl font-semibold text-primary">
          Instructor Dashboard
        </h1>
      </div> */}

      <div className="ml-auto flex items-center justify-end gap-4">
        {/* Back Button */}
        <Button
          onClick={switchBack}
          variant="outline"
          size="sm"
          className="h-10 px-4"
        >
          Go back
        </Button>

        {/* Theme Toggle */}
        <ThemeModeToggle />

        {/* Notifications */}
        <Notifications />

        {/* User Avatar */}
        <UserAvatar />
      </div>
    </div>
  );
};

export default InstructorNavbarRoutes;
