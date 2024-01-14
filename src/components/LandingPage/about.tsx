import Image from 'next/image';
import React from 'react';
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ScrollSmoother } from "gsap/ScrollSmoother";

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function About() {
    return (
      <div className="h-screen max-w-7xl mb-12 w-full flex flex-col justify-center">
        <div>
          <div className="font-bold tracking-tight text-[#333333] dark:text-white text-center text-2xl">
            About
          </div>
          <p className="pt-4 text-base text-center text-[#333333] dark:text-gray-200">
            Ride the Wave of Knowledge with
            <span className="text-indigo-500"> Coursewave!</span>: Where
            <br />
            Learning Meets Innovation!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row mt-8 justify-center mx-auto w-full place-items-center">
          <div className="smooth-wrapper flex flex-col justify-center">
            <video
              className="smooth-content h-[12rem] rounded-lg object-cover w-[12rem] bg-indigo-200"
              width="192"
              height="192"
              loop
              autoPlay
            >
              <source
                className="bg-cover"
                src="assets/videos/vid.mp4"
                type="video/mp4"
              />
            </video>
            <div className="smooth-content pt-2 ">
              <p className="font-semibold text-[#333333] dark:text-gray-200 text-base">
                About Courewave
              </p>
              <p className="text-sm text-[#333333] dark:text-gray-200 opacity-80">
                2 min
              </p>
            </div>
          </div>

          <div className="flex flex-col p-8 lg:full">
            <div className="text-left text-[1rem] text-[#333333] dark:text-gray-200 lg:pl-8 ">
              Build a never-before skill set by taking our courses and interact
              with our extensive community!
            </div>
            <div className="pt-1 pb-3  text-[1rem] text-[#333333] dark:text-gray-200 lg:pt-0  text-left lg:pl-8">
              We have a great success with delivering high-quality value for
              money content in our courses
            </div>
            <div className="flex justify-start pl-12 w-9/12">
              <div className="relative pl-20  items-center mx-auto">
                <div className="h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center absolute -left-4 z-10">
                  <Image
                    src="/images1.jpg"
                    alt="Avatar 1"
                    className="h-10 w-10 rounded-full"
                    fill={true}
                  />
                </div>
                <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center absolute left-4 z-20">
                  <Image
                    src="/images2.jpg"
                    alt="Avatar 2"
                    className="h-10 w-10 rounded-full"
                    fill={true}
                  />
                </div>
                <div className="h-12 w-12 bg-red-500 rounded-full flex items-center justify-center absolute left-12 z-30">
                  <Image
                    src="/images3.jpg"
                    alt="Avatar 3"
                    className="h-10 w-10 rounded-full"
                    fill={true}
                  />
                </div>
              </div>
              {/* 200+ & happy customers text */}
              <div className="flex flex-col pl-8 w-full">
                <p className="font-semibold text-sm text-indigo-500">200+</p>
                <p className="text-xs font-medium text-[#333333] dark:text-gray-200">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default About;
