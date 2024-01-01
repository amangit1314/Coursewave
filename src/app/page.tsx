"use client";

import About from '@/components/about';
import Footer from '@/components/footer';
import Header from '@/components/header';
import HomeBrowseSection from '@/components/homeBrowseSection';
import Offerings from '@/components/offerings'
import { useRouter } from 'next/navigation';
import SessionsSection from '@/components/sessions';
import Image from 'next/image'
import React from 'react'
import Testimonials from '@/components/testimonials';
import { FiToggleRight } from 'react-icons/fi';
import Lottie from "lottie-react";
import * as scrollAnimation from "./ScrollAnimation.json";

export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleSignUpClick = () => {
    router.push('/register');
  };

  return (
    <main className="flex dark:bg-black dark:bg-opacity-80 min-h-screen flex-col items-center justify-between ">
      <div className="p-10">
        <Header
          handleLoginClick={handleLoginClick}
          // handleSignUpClick={handleSignUpClick}
        />

        <HeroSection />

        <About />

        <Offerings />

        <SessionsSection />

        <Testimonials />

        <HomeBrowseSection />
      </div>

      <Footer />
    </main>
  );
}

function HeroSection() {
  return (
    <div className="h-screen pt-20 relative flex flex-col place-items-center -z-1">
      <Image
        className="relative"
        src="/assets/illustrations/course_illus.png"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      />
      <div className="pt-8 text-2xl text-gray-900 dark:text-white tracking-tight lg:text-4xl xl:tex-5xl font-extrabold text-center">Unlock Your Learning Potential with <br /><span className="text-blue-500">Coursewave!</span></div>
      <p className="pt-4 text-base text-slate-700 dark:text-slate-300 opacity-80 text-center">Unlock Your Infinte Learning and Professional Protential with <br /> wide range of courses of <span className="text-blue-500">Coursewave!</span></p>
      <button className='bg-blue-500 font-semibold text-white px-4 py-2 rounded-xl mt-4'>Courses</button>

      <svg
        className="visible dark:hidden bottom-10 lg:bottom-20 absolute animate-bounce h-24 w-5 bg-red pb-8"
        viewBox="0 0 16 132"
        fill="black"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.29289 131.707C7.68341 132.098 8.31658 132.098 8.7071 131.707L15.0711 125.343C15.4616 124.953 15.4616 124.319 15.0711 123.929C14.6805 123.538 14.0474 123.538 13.6568 123.929L7.99999 129.586L2.34314 123.929C1.95262 123.538 1.31945 123.538 0.928927 123.929C0.538402 124.319 0.538402 124.953 0.928927 125.343L7.29289 131.707ZM7 -4.37114e-08L6.99999 131L8.99999 131L9 4.37114e-08L7 -4.37114e-08Z"
          fillRule="evenodd"
          fill='black'
        />
      </svg>

      <Lottie className='dark:visible' animationData={scrollAnimation} loop={true} />


    </div>
  )
}