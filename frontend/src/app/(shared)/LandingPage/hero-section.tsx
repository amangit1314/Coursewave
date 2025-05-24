// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client"; // required for lottie-react because it use (useState) internally

// import React, { useEffect, useState } from "react";
// import Lottie from "lottie-react";
// import { PiInfinityBold } from "react-icons/pi";
// import { IoArrowForwardCircle } from "react-icons/io5";
// import { Orbitron } from "next/font/google";
// import BoxReveal from "@/components/magicui/box-reveal";
// import ShimmerButton from "@/components/magicui/shimmer-button";
// import RetroGrid from "@/components/magicui/retro-grid";

// const orbitron = Orbitron({
//   weight: ["400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
// });

// type HeroSectionProps = {
//   scrollAnimation: LottieAnimationData; //TODO: use explicit specific type according to use case here
// };

// interface LottieAnimationData {
//   v: string; // Lottie version
//   fr: number; // Frame rate
//   ip: number; // In-point (start frame)
//   op: number; // Out-point (end frame)
//   w: number; // Width
//   h: number; // Height
//   layers: Array<{
//     // Layers will vary depending on animation, here's a simplified example
//     d: number;
//     nm: string;
//     ty: number;
//     // other layer-related properties
//   }>;
//   // other relevant fields specific to your animation
// }

// const HeroSection: React.FC<HeroSectionProps> = ({ scrollAnimation }) => {
//   const [animationData, setAnimationData] =
//     useState<null | LottieAnimationData>(null);

//   useEffect(() => {
//     // Check if the window is defined to ensure this runs only on the client side
//     if (typeof window !== "undefined") {
//       setAnimationData(scrollAnimation);
//     }
//   }, [scrollAnimation]);

//   const largeScreenLayout = (
//     <div className="pt-15 -z-1 relative flex h-screen w-screen flex-col place-items-center">
//       {/* bold and sub texts */}
//       <div className="mx-auto w-full max-w-3xl">
//         <div className="mx-auto flex items-center justify-center pt-16 text-center align-middle">
//           <BoxReveal boxColor={"#5046e6"} duration={0.5}>
//             <div className={orbitron.className}>
//               <h1 className="text-center text-[48px] font-extrabold leading-10 tracking-tighter text-zinc-950 dark:text-white md:text-[52px]">
//                 <div className="ml-16 flex">
//                   Unlock Your{" "}
//                   <PiInfinityBold
//                     size={48}
//                     className="mx-[8px] text-blue-500"
//                   />
//                   Learning
//                 </div>
//                 Potential with
//                 <span className="ml-2 text-[56px] font-extrabold tracking-tighter text-blue-500 lg:text-4xl xl:text-5xl">
//                   Coursewave!
//                 </span>
//               </h1>
//             </div>
//           </BoxReveal>
//         </div>

//         <div className="mx-auto flex items-center justify-center pt-4 text-center">
//           <BoxReveal boxColor={"#5046e6"} duration={0.5}>
//             <p className="pt-4 text-center text-[1rem] text-[#333333] dark:text-gray-200">
//               Unlock Your Infinte Learning and Professional Potential with our
//               wide range of courses on different aspects.
//             </p>
//           </BoxReveal>
//         </div>
//       </div>

//       {/* Browse Course Button */}
//       <div className="group mt-4 flex items-center gap-2 transition-all duration-300">
//         <BoxReveal>
//           <ShimmerButton className="mt-4 bg-transparent p-0" color="blue">
//             <div className="group flex items-center gap-2 rounded-full bg-transparent px-4 py-2 font-semibold tracking-tight text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-sky-400">
//               Unlock Your Potential
//               <IoArrowForwardCircle className="group-hover:anim hidden text-white transition-all duration-300 group-hover:flex group-hover:animate-pulse" />
//             </div>
//           </ShimmerButton>
//         </BoxReveal>
//       </div>

//       {/* scroll to bottom animation */}
//       <div>
//         {/* arrow to display in light mode */}
//         <svg
//           className="bg-red visible absolute h-24 w-5 animate-bounce pt-12 dark:hidden"
//           viewBox="0 0 16 132"
//           fill="black"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M7.29289 131.707C7.68341 132.098 8.31658 132.098 8.7071 131.707L15.0711 125.343C15.4616 124.953 15.4616 124.319 15.0711 123.929C14.6805 123.538 14.0474 123.538 13.6568 123.929L7.99999 129.586L2.34314 123.929C1.95262 123.538 1.31945 123.538 0.928927 123.929C0.538402 124.319 0.538402 124.953 0.928927 125.343L7.29289 131.707ZM7 -4.37114e-08L6.99999 131L8.99999 131L9 4.37114e-08L7 -4.37114e-08Z"
//             fillRule="evenodd"
//             fill="black"
//           />
//         </svg>

//         {/* lottie to display in dark mode */}
//         {/* <Lottie
//           className="hidden text-zinc-950 dark:flex"
//           animationData={animationData}
//           loop={true}
//         /> */}
//       </div>

//       <RetroGrid />
//     </div>
//   );

//   const mobileScreenLayout = (
//     <div className="-z-1 relative flex h-full w-screen flex-col place-items-center px-[.75rem] pt-[1.25rem]">
//       {/* Heading text and description text */}
//       <div className="w-full space-y-6">
//         {/* main bold heading text */}
//         <div className={orbitron.className}>
//           <h1 className="pt-16 text-center align-middle text-4xl font-bold leading-10 text-zinc-950 dark:text-white">
//             Unlock Your Infinite Learning Potential with
//             <p className="text-blue-500">Coursewave!</p>{" "}
//           </h1>
//         </div>

//         {/* description text */}
//         <p className="text-center text-[1rem] text-[#333333] dark:text-gray-200">
//           Unlock Your Infinte Learning and Professional Potential with our wide
//           range of courses on different aspects.
//         </p>
//       </div>

//       {/* Browse Course Button */}
//       <button className="group my-4 flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-extrabold tracking-tight text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-sky-400">
//         Unlock Your Potential
//         <IoArrowForwardCircle className="group-hover:anim hidden text-white transition-all duration-300 group-hover:flex group-hover:animate-pulse" />
//       </button>

//       {/* scroll to bottom animation */}
//       <div>
//         {/* arrow to display in light mode */}
//         <svg
//           className="bg-red visible absolute h-24 w-5 animate-bounce pt-12 dark:hidden"
//           viewBox="0 0 16 132"
//           fill="black"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M7.29289 131.707C7.68341 132.098 8.31658 132.098 8.7071 131.707L15.0711 125.343C15.4616 124.953 15.4616 124.319 15.0711 123.929C14.6805 123.538 14.0474 123.538 13.6568 123.929L7.99999 129.586L2.34314 123.929C1.95262 123.538 1.31945 123.538 0.928927 123.929C0.538402 124.319 0.538402 124.953 0.928927 125.343L7.29289 131.707ZM7 -4.37114e-08L6.99999 131L8.99999 131L9 4.37114e-08L7 -4.37114e-08Z"
//             fillRule="evenodd"
//             fill="black"
//           />
//         </svg>

//         {/* lottie to display in dark mode */}
//         {/* <Lottie
//           className="hidden text-zinc-950 dark:flex"
//           animationData={animationData}
//           loop={true}
//         /> */}
//       </div>
//     </div>
//   );

//   return (
//     <div className="mx-auto flex items-center justify-center">
//       <div className="hidden md:flex">{largeScreenLayout}</div>
//       <div className="flex md:hidden">{mobileScreenLayout}</div>
//     </div>
//   );
// };

// export default HeroSection;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useRef } from "react";
import { IoArrowForward } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Orbitron } from "next/font/google";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Title character animation
    gsap.from(".char", {
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.2)",
      stagger: 0.05,
      delay: 0.2
    });

    // Subtitle animation
    gsap.from(subtitleRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.8
    });

    // CTA animation
    gsap.from(ctaRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 1.2
    });

    // Grid animation
    gsap.fromTo(".grid-line",
      { opacity: 0, scaleY: 0 },
      {
        opacity: 0.15,
        scaleY: 1,
        duration: 1.5,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3
      }
    );

    // Floating elements animation
    gsap.to(".floating-shape", {
      y: "+=20",
      x: "+=10",
      rotation: "+=5",
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2
    });

    // Pulsing dots
    gsap.to(".pulsing-dot", {
      scale: 1.3,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });

    // Scroll indicator animation
    gsap.to(scrollIndicatorRef.current, {
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2
    });

  }, { scope: containerRef });

  const renderAnimatedTitle = (text: string) => {
    return text.split("").map((char, index) => (
      <span key={index} className="char inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-neutral-950 px-4"
    >
      {/* Animated grid background */}
      <div ref={gridRef} className="absolute inset-0 z-0 flex justify-center">
        <div className="absolute h-full w-full max-w-6xl">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="grid-line absolute left-0 top-0 h-full w-px origin-top bg-white"
              style={{ left: `${(i + 1) * 5}%` }}
            />
          ))}
        </div>
      </div>

      {/* Floating futuristic shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="floating-shape absolute left-[15%] top-[20%] h-32 w-32 rounded-full bg-emerald-500/20 blur-[60px]" />
        <div className="floating-shape absolute right-[20%] top-[30%] h-40 w-40 rotate-45 bg-purple-500/20 blur-[80px]" />
        <div className="floating-shape absolute bottom-[25%] left-[25%] h-28 w-28 rounded-full bg-cyan-500/20 blur-[50px]" />
        <div className="floating-shape absolute bottom-[15%] right-[15%] h-36 w-36 rotate-12 bg-amber-500/20 blur-[70px]" />
      </div>

      {/* Pulsing connection dots */}
      <div className="absolute inset-0 z-0">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="pulsing-dot absolute h-2 w-2 rounded-full bg-white opacity-50"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${30 + (Math.sin(i) * 20)}%`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <h1 
          ref={titleRef}
          className={`${orbitron.className} mb-6 text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl`}
        >
          {renderAnimatedTitle("Elevate Your Learning")}
        </h1>
        
        <p 
          ref={subtitleRef}
          className="mx-auto mb-10 max-w-2xl text-base text-neutral-300 sm:text-lg md:text-xl"
        >
          Master new skills with our immersive courses designed for the modern learner
        </p>

        <div ref={ctaRef}>
          <button className="group mx-auto flex items-center cursor-pointer justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-medium text-neutral-900 transition-all hover:bg-neutral-200 sm:px-8 sm:py-4 sm:text-lg">
            <span>Begin Your Journey</span>
            <IoArrowForward className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Animated scanning line */}
      <div className="absolute left-0 top-0 z-0 h-px w-full bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-70" />

      {/* Scroll indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 transform"
      >
        <div className="flex flex-col items-center">
          <div className="h-6 w-4 rounded-full border-2 border-white/50 p-1">
            <div className="h-2 w-1 rounded-full bg-white/80" />
          </div>
          <FiChevronDown className="mt-1 text-white/60" size={18} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;