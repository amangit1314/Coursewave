// import { Grip } from "lucide-react";
// import { Button } from "../ui/button";
import * as React from "react";
import { motion, SVGMotionProps, useCycle } from "framer-motion";
import { MenuItem } from "./menu-item";
import { SiGoogleclassroom } from "react-icons/si";
import { RiBloggerLine } from "react-icons/ri";
import { PiVideoConference } from "react-icons/pi";
import { GrContact } from "react-icons/gr";
import { useDimensions } from "@/hooks/useDimensions";

const Path = (
  props: React.JSX.IntrinsicAttributes &
    SVGMotionProps<SVGPathElement> &
    React.RefAttributes<SVGPathElement>,
) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({ toggle }: any) => (
  <button onClick={toggle}>
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

export const MobileMenuDrawerButton = () => {
  const sidebar = {
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    }),
    closed: {
      clipPath: "circle(30px at 40px 40px)",
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = React.useRef(null);
  const { height } = useDimensions(containerRef);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
    >
      {/* <motion.div className="background" variants={sidebar} /> */}
      <Navigation />
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
  //   return (
  //     <Button
  //       variant={"outline"}
  //       size={"icon"}
  //       className="border-stroke group visible flex h-10 w-10 items-center justify-center rounded-md border transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800 md:hidden"
  //     >
  //       <Grip className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:text-slate-300" />
  //     </Button>
  //   );
};

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const Navigation = () => {
  const links = [
    {
      icon: <SiGoogleclassroom />,
      name: "Courses",
      link: "/browseCourses",
    },
    {
      icon: <RiBloggerLine />,
      name: "Articles",
      link: "/articles",
    },
    {
      icon: <PiVideoConference />,
      name: "Sessions",
      link: "/browseSessions",
    },
    {
      icon: <GrContact />,
      name: "Contact",
      link: "/contact",
    },
  ];

  return (
    <motion.ul variants={variants}>
      {links.map((link: any, index: number) => (
        <MenuItem
          i={index}
          key={index}
          icon={link.icon}
          text={link.name}
          link={link.link}
        />
      ))}
    </motion.ul>
  );
};

// import React, { useMemo } from "react";
// import { motion, SVGMotionProps, useCycle } from "framer-motion";
// import { SiGoogleclassroom } from "react-icons/si";
// import { RiBloggerLine } from "react-icons/ri";
// import { PiVideoConference } from "react-icons/pi";
// import { GrContact } from "react-icons/gr";
// import { useDimensions } from "@/hooks/useDimensions";
// import { MenuItem } from "./menu-item";

// type PathProps = React.JSX.IntrinsicAttributes &
//   SVGMotionProps<SVGPathElement> &
//   React.RefAttributes<SVGPathElement>;

// const Path = (props: PathProps) => (
//   <motion.path
//     fill="transparent"
//     strokeWidth="3"
//     stroke="hsl(0, 0%, 18%)"
//     strokeLinecap="round"
//     {...props}
//   />
// );

// const MenuToggle = ({ toggle }: { toggle: () => void }) => (
//   <button
//     onClick={toggle}
//     className="focus:outline-none"
//     aria-label="Toggle menu"
//   >
//     <svg width="23" height="23" viewBox="0 0 23 23">
//       <Path
//         variants={{
//           closed: { d: "M 2 2.5 L 20 2.5" },
//           open: { d: "M 3 16.5 L 17 2.5" },
//         }}
//       />
//       <Path
//         d="M 2 9.423 L 20 9.423"
//         variants={{
//           closed: { opacity: 1 },
//           open: { opacity: 0 },
//         }}
//         transition={{ duration: 0.1 }}
//       />
//       <Path
//         variants={{
//           closed: { d: "M 2 16.346 L 20 16.346" },
//           open: { d: "M 3 2.5 L 17 16.346" },
//         }}
//       />
//     </svg>
//   </button>
// );

// const sidebarVariants = {
//   open: (height = 1000) => ({
//     clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
//     transition: {
//       type: "spring",
//       stiffness: 20,
//       restDelta: 2,
//     },
//   }),
//   closed: {
//     clipPath: "circle(30px at 40px 40px)",
//     transition: {
//       delay: 0.5,
//       type: "spring",
//       stiffness: 400,
//       damping: 40,
//     },
//   },
// };

// const menuVariants = {
//   open: {
//     transition: { staggerChildren: 0.07, delayChildren: 0.2 },
//   },
//   closed: {
//     transition: { staggerChildren: 0.05, staggerDirection: -1 },
//   },
// };

// const NAV_ITEMS = [
//   {
//     icon: <SiGoogleclassroom />,
//     name: "Courses",
//     link: "/browseCourses",
//   },
//   {
//     icon: <RiBloggerLine />,
//     name: "Articles",
//     link: "/articles",
//   },
//   {
//     icon: <PiVideoConference />,
//     name: "Sessions",
//     link: "/browseSessions",
//   },
//   {
//     icon: <GrContact />,
//     name: "Contact",
//     link: "/contact",
//   },
// ] as const;

// const Navigation = () => {
//   return (
//     <motion.ul variants={menuVariants}>
//       {NAV_ITEMS.map((item, index) => (
//         <MenuItem
//           key={item.link}
//           i={index}
//           icon={item.icon}
//           text={item.name}
//           link={item.link}
//         />
//       ))}
//     </motion.ul>
//   );
// };

// export const MobileMenuDrawerButton = React.memo(() => {
//   const [isOpen, toggleOpen] = useCycle(false, true);
//   const containerRef = React.useRef(null);
//   const { height } = useDimensions(containerRef);

//   const memoizedNavigation = useMemo(() => <Navigation />, []);

//   return (
//     <motion.nav
//       initial={false}
//       animate={isOpen ? "open" : "closed"}
//       custom={height}
//       ref={containerRef}
//       className="z-50"
//     >
//       <motion.div
//         className=" w-full bg-red-500 shadow-lg"
//         variants={sidebarVariants}
//       />
//       {memoizedNavigation}
//       <MenuToggle toggle={toggleOpen} />
//     </motion.nav>
//   );
// });
