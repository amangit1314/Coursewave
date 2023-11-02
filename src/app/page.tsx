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


export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleSignUpClick = () => {
    router.push('/register');
  };

  return (
    <main className="flex dark:bg-black min-h-screen flex-col items-center justify-between p-10">
      <Header
        handleLoginClick={handleLoginClick}
        handleSignUpClick={handleSignUpClick}
      />

      <div className=" h-screen pt-20 relative flex flex-col place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/course_illus.png"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
        <p className="pt-8 text-2xl lg:text-4xl xl:tex-5xl font-extrabold text-center">Unlock Your Learning Potential with <br /><span className="text-blue-500">Coursewave!</span></p>
        <p className="pt-4 text-md opacity-80 text-center">Unlock Your Infinte Learning and Professional Protential with <br /> wide range of courses of <span className="text-blue-500">Coursewave!</span></p>
        <button className='bg-blue-500 font-semibold text-white px-4 py-2 rounded-xl mt-4'>Courses</button>

        <svg
          className="bottom-10 lg:bottom-20 absolute animate-bounce h-24 w-5 bg-red pb-8"
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
      </div>

      <About />

      <Offerings />

      <SessionsSection />

      <Testimonials />

      <HomeBrowseSection />

      <Footer />
    </main>
  )
}

function Footer2() {
  return (
    <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black ">
      <a
        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
        href="https://next-level-portfolio.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        By{' Aman Soni '}
        {/* <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            /> */}
      </a>
    </div>
  );
}
