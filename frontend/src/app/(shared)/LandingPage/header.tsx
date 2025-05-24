// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Orbitron } from "next/font/google";
// import { Button } from "@/components/ui/button";
// import { ThemeModeToggle } from "../theme-mode-toggle";
// import { MobileMenuDrawerButton } from "./menu";

// const orbitron = Orbitron({
//   weight: ["400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
// });

// type LandingPageHeaderProps = {
//   handleLoginClick: () => void;
// };

// const LandingPageHeader: React.FC<LandingPageHeaderProps> = ({
//   handleLoginClick,
// }) => {
//   const links = [
//     {
//       name: "Courses",
//       link: "/browseCourses",
//     },
//     {
//       name: "Articles",
//       link: "/articles",
//     },
//     {
//       name: "Sessions",
//       link: "/browseSessions",
//     },
//     {
//       name: "Contact",
//       link: "/contact",
//     },
//   ];
//   return (
//     <div className="py-auto max-w-screen sticky top-0 z-10 mx-auto flex h-[64px] w-full items-center justify-between overflow-x-hidden overflow-y-hidden border-b bg-transparent px-[.75rem] py-[2rem] backdrop-blur-xl md:max-w-7xl md:p-[2rem]">
//       {/* coursewave logo and text */}
//       <div className="py-auto flex cursor-pointer items-center space-x-2">
//         <Image
//           src="/assets/images/logo/coursewave-favicon-color.png"
//           alt="CourseWave Logo"
//           width={30}
//           height={8}
//           priority
//         />
//         <div className={orbitron.className}>
//           <p className="text-[1.1rem] font-extrabold capitalize tracking-tight text-blue-500 md:text-[1.1rem]">
//             Coursewave
//           </p>
//         </div>
//       </div>

//       {/* navigate links */}
//       <div className="hidden justify-around lg:visible lg:flex lg:space-x-4">
//         {links.map((link, index) => {
//           return (
//             <div key={index} className={orbitron.className}>
//               <Link
//                 href={link.link}
//                 className="cursor-pointer text-[.8rem] font-medium text-gray-800 transition-all duration-100 hover:text-blue-500 dark:text-white dark:hover:text-blue-500"
//               >
//                 {link.name}
//               </Link>
//             </div>
//           );
//         })}
//       </div>

//       {/* theme and other icons */}
//       <div className="py-auto flex items-center justify-center space-x-2">
//         <ThemeModeToggle />

//         <Link
//           className="py-auto hidden items-center md:visible md:flex"
//           href="/login"
//         >
//           <Button
//             onClick={handleLoginClick}
//             variant={"outline"}
//             size={"icon"}
//             className="border-stroke group visible flex h-10 w-10 items-center justify-center rounded-md border transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800 md:hidden"
//           >
//             Login
//           </Button>
//         </Link>

//         <div className="visible flex md:hidden">
//           <MobileMenuDrawerButton />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPageHeader;

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";
import { ThemeModeToggle } from "../theme-mode-toggle";
import { MobileMenuDrawerButton } from "./menu";

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap", // better font loading
});

type LandingPageHeaderProps = {
  handleLoginClick: () => void;
};

const NAV_LINKS = [
  { name: "Courses", link: "/browseCourses" },
  { name: "Articles", link: "/articles" },
  { name: "Sessions", link: "/browseSessions" },
  { name: "Contact", link: "/contact" },
] as const;

const LandingPageHeader: React.FC<LandingPageHeaderProps> = ({
  handleLoginClick,
}) => {
  const memoizedLogo = useMemo(
    () => (
      <div className="flex cursor-pointer items-center space-x-2">
        <Image
          src="/assets/images/logo/coursewave-favicon-color.png"
          alt="CourseWave Logo"
          width={30}
          height={8}
          priority
          className="h-8 w-8" // better image sizing
        />
        <p
          className={`${orbitron.className} text-[1.1rem] font-extrabold capitalize tracking-tight text-blue-500`}
        >
          Coursewave
        </p>
      </div>
    ),
    []
  );

  const memoizedNavLinks = useMemo(
    () => (
      <nav className="hidden space-x-4 lg:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.link}
            href={link.link}
            className={`${orbitron.className} text-[.8rem] font-medium text-gray-800 transition-colors duration-100 hover:text-blue-500 dark:text-white dark:hover:text-blue-500`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    ),
    []
  );

  // const memoizedAuthButtons = useMemo(
  //   () => (
  //     <div className="flex items-center space-x-2">
  //       <ThemeModeToggle />

  //       <Link href="/login" className="hidden md:block">
  //         <Button
  //           onClick={handleLoginClick}
  //           variant="outline"
  //           size="icon"
  //           className="h-10 w-25 rounded-md border border-stroke transition-colors duration-200 dark:bg-transparent dark:hover:bg-zinc-800"
  //           aria-label="Login"
  //         >
  //           Login
  //         </Button>
  //       </Link>

  //       <div className="md:hidden">
  //         <MobileMenuDrawerButton />
  //       </div>
  //     </div>
  //   ),
  //   [handleLoginClick]
  // );

  const memoizedAuthButtons = useMemo(
    () => (
      <div className="flex items-center space-x-2">
        {/* Theme toggle visible on all screens */}
        <ThemeModeToggle />
  
        {/* Login button hidden on mobile */}
        <Link href="/login" className="hidden md:block">
          <Button
            onClick={handleLoginClick}
            variant="outline"
            size="icon"
            className="h-10 w-25 rounded-md border border-stroke transition-colors duration-200 dark:bg-transparent dark:hover:bg-zinc-800"
            aria-label="Login"
          >
            Login
          </Button>
        </Link>
  
        {/* Mobile Menu Button (hidden on large screens) */}
        <div className="block md:hidden">
          <MobileMenuDrawerButton />
        </div>
      </div>
    ),
    [handleLoginClick]
  );
  

  return (
    <header className="sticky top-0 z-10 mx-auto h-16 w-full border-b bg-transparent px-3 backdrop-blur-xl md:h-20 md:max-w-7xl md:px-8">
      <div className="flex h-full items-center justify-between">
        {memoizedLogo}
        {memoizedNavLinks}
        {memoizedAuthButtons}
      </div>
    </header>
  );
};

export default React.memo(LandingPageHeader);
