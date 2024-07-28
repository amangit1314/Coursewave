/* eslint-disable @next/next/no-img-element */
import React from "react";
import ShimmerButton from "../magicui/shimmer-button";
import Link from "next/link";

const AchieveCodingGoals = () => {
  return (
    <div className="grid grid-cols-4 gap-6 align-middle items-center mx-24">
      <div className="col-span-2">
        <img
          className="h-full w-full rounded-xl shadow-2xl"
          src="https://media.istockphoto.com/id/1219473617/vector/young-male-character-writing-code-on-a-desktop-computer-working-from-home-millennials-at-work.jpg?s=612x612&w=0&k=20&c=9KrYfX8M5lFqpUN2y5Pklac_XebWqnI0bmDkMB6NLhU="
          alt=""
        />
      </div>

      <div className="col-span-2 space-y-4">
        <h1 className="font-semibold text-4xl tracking-tighter text-zinc-800 dark:text-white ">
          Achieve <br /> Your Coding Goals
        </h1>

        <div className="text-left space-y-2 text-[#333333] dark:text-gray-200">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam,
            laborum porro. Laborum quos, ipsa quasi nulla est pariatur nesciunt
            itaque consequatur voluptatem voluptatum neque nihil error accusamus
            illum vero tempora dolores, facere consectetur provident!
            Perspiciatis repellendus officia quia at! Necessitatibus, tempora
            velit.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque
            quasi fugit impedit!
          </p>
        </div>

        <Link href={"/browseCourses"} className="mt-2">
          <ShimmerButton className="dark:text-white mt-2">Explore</ShimmerButton>
        </Link>
      </div>
    </div>
  );
};

export default AchieveCodingGoals;
