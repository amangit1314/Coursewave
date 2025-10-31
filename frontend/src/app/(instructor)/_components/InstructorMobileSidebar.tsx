// "use client";

// import Link from "next/link";
// import { Menu, X } from "lucide-react";
// import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
// import InstructorSideBarRoutes from "./InstructorSidebarRoutes";
// import Image from "next/image";
// import { useState } from "react";
// import { dmSans } from "@/lib/config/fonts";

// const InstructorMobileSidebar = () => {
//   const [open, setOpen] = useState(false);

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger
//         className="md:hidden pr-4 hover:opacity-75 transition cursor-pointer"
//         onClick={() => setOpen(true)}
//       >
//         <Menu />
//       </SheetTrigger>
//       <SheetContent
//         side="left"
//         className="px-3 py-4 bg-white dark:bg-zinc-900 h-screen overflow-y-auto scrollbar-thin"
//       >
//         {/* Header with close button */}
//         <div className="flex items-center justify-between mb-6">
//           <Link
//             href="/browseCourses"
//             className="flex cursor-pointer items-center"
//             onClick={() => setOpen(false)}
//           >
//             <Image
//               src="/assets/images/logo/coursewave-favicon-color.png"
//               alt="CourseWave Logo"
//               width={30}
//               height={8}
//               priority
//             />
//             <p className={`${dmSans.className} pl-2 text-blue-500 font-bold text-lg`}>
//               CourseWave
//             </p>
//           </Link>
//           <SheetClose
//             className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
//             onClick={() => setOpen(false)}
//           >
//             <X className="h-5 w-5" />
//           </SheetClose>
//         </div>
//         <InstructorSideBarRoutes />
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default InstructorMobileSidebar;

import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InstructorSidebarRoutes from "./InstructorSidebarRoutes";
import Image from "next/image";
import Link from "next/link";

const InstructorMobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          <Menu size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-zinc-900">
        <div className="h-full px-3 py-4 overflow-y-auto space-y-4">
          {/* Logo */}
          <Link
            href="/instructor/analytics"
            className="flex cursor-pointer items-end px-2"
          >
            <Image
              src="/assets/images/logo/coursewave-favicon-color.png"
              alt="CourseWave Logo"
              width={30}
              height={30}
              priority
            />
            <p className="pl-2 text-blue-500 font-bold text-lg">Coursewave</p>
          </Link>

          {/* Routes */}
          <InstructorSidebarRoutes />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default InstructorMobileSidebar;
