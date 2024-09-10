/* eslint-disable @next/next/no-img-element */
import React from "react";
import ShimmerButton from "../magicui/shimmer-button";
import Link from "next/link";

const AchieveCodingGoals = () => {
  return (
    <div className="mx-24 grid grid-cols-4 items-center gap-6 align-middle">
      <div className="col-span-2">
        <img
          className="h-full w-full rounded-xl shadow-2xl"
          src="https://media.istockphoto.com/id/1219473617/vector/young-male-character-writing-code-on-a-desktop-computer-working-from-home-millennials-at-work.jpg?s=612x612&w=0&k=20&c=9KrYfX8M5lFqpUN2y5Pklac_XebWqnI0bmDkMB6NLhU="
          alt=""
        />
      </div>

      <div className="col-span-2 space-y-4">
        <h1 className="text-4xl font-semibold tracking-tighter text-zinc-800 dark:text-white">
          Achieve <br /> Your Coding Goals
        </h1>

        <div className="space-y-2 text-left text-[#333333] dark:text-gray-200">
          <p>
            Unlock your full potential as a coder with our resources and
            support. Whether you're just starting or looking to advance your
            skills, we're here to help you reach your milestones. Our platform
            offers a range of features designed to enhance your learning
            experience and keep you motivated every step of the way. Start today
            and transform your coding abilities.
          </p>
          <p>
            Our commitment is to provide you with the tools and guidance you
            need to succeed in your coding journey. Dive into our courses,
            engage with our community, and watch as your coding skills soar.
          </p>
        </div>

        <Link href={"/browseCourses"} className="mt-2">
          <ShimmerButton className="mt-2 dark:text-white">
            Explore
          </ShimmerButton>
        </Link>
      </div>
    </div>
  );
};

export default AchieveCodingGoals;
