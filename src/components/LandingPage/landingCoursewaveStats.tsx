import { useTheme } from "next-themes";
import React from "react";
import { MagicCard } from "../magicui/magic-card";
import NumberTicker from "../magicui/number-ticker";
import { PiChartPieSliceThin } from "react-icons/pi";

const LandingCoursewaveStats = () => {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-3 mx-24 align-middle items-center gap-8">
        <div className=" col-span-1 space-y-2">
          <PiChartPieSliceThin
            className="flex justify-center items-center border p-2 rounded-full  transition-all duration-400"
            size={48}
          />

          <h1 className="font-semibold text-xl tracking-tight text-zinc-800 dark:text-white">
            Mordern art for everyone
          </h1>
          <p className="text-base text-[#333333] dark:text-gray-200 ">
            An investment in knowledge pays the best interest grow your
            creativie Entrepreneurship.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 mx-24 align-middle items-center gap-4">
        <LandingCoursewaveStatItem
          number={250}
          title={"Online Courses"}
          description={
            "Learn from us, polish your skills or gain new skills by taking our interesting in-depth courses!"
          }
        />
        <LandingCoursewaveStatItem
          number={50}
          title={"Professional Instructors"}
          description={
            "Our courses are taught by worldwide top leading professionals and industry experts."
          }
        />
        <LandingCoursewaveStatItem
          number={5000}
          title={"Students Enrolled"}
          description={
            "Join a community of over 5000+ learners who are advancing their skills with our courses."
          }
        />
      </div>
    </div>
  );
};

export default LandingCoursewaveStats;

const LandingCoursewaveStatItem = ({ number, title, description }: any) => {
  const { theme } = useTheme();
  return (
    // <MagicCard
    //   className="cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap p-6"
    //   gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
    // >
    //   <div className="flex flex-col justify-start items-start space-y-1">
    //     <h1 className="text-4xl font-bold tracking-tight text-left">
    //       <NumberTicker value={250} /> +
    //     </h1>
    //     <p className="text-2xl font-semibold tracking-tight text-left">Online Courses</p>
    //   </div>

    //   <p className="dark:text-gray-200 opacity-80 text-base text-left line-clamp-3">
    //     Learn and polish skills by taking our interesting in-depth courses!
    //   </p>
    // </MagicCard>
    <div className="space-y-4 p-4 rounded-xl bg-transparent border border-stroke shadow-2xl">
      <div className="flex flex-col justify-start items-start space-y-1">
        <h1 className="text-4xl font-bold tracking-tighter text-left text-zinc-800 dark:text-white">
          <NumberTicker value={number ?? 250} />
        </h1>
        <p className="text-xl font-semibold tracking-tight text-left line-clamp-1 text-ellipsis text-zinc-800 dark:text-white">
          {title ?? "Online Courses"}
        </p>
      </div>

      <p className="text-[#333333] dark:text-gray-200 text-base text-left line-clamp-3 text-wrap text-ellipsis">
        {description ??
          "Learn and polish skills by taking our interesting in-depth courses!"}
      </p>
    </div>
  );
};
