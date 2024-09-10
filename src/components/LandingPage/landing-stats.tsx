import React from "react";
import { useTheme } from "next-themes";
import NumberTicker from "../magicui/number-ticker";
import { PiChartPieSliceThin } from "react-icons/pi";
import { Course, Instructor, User } from "@prisma/client";
import { getHomeStats } from "@/app/_actions/get-home-stats";

const LandingCoursewaveStats = () => {
  const [stats, setStats] = React.useState<{
    courses: Course[];
    instructors: Instructor[];
    users: User[];
  }>({ courses: [], instructors: [], users: [] });

  React.useEffect(() => {
    const fetchStats = async () => {
      const data = await getHomeStats();
      setStats(data);
    };

    fetchStats();
  }, []);

  const { courses, instructors, users } = stats;

  return (
    <div className="md:max-w-screen mt-32 h-full w-full space-y-12">
      <div className="mx-[.75rem] w-full items-center gap-8 align-middle md:mx-[6rem] md:grid md:grid-cols-3">
        <div className="space-y-2 md:col-span-1">
          <PiChartPieSliceThin
            className="duration-400 flex items-center justify-center rounded-full border p-2 transition-all"
            size={48}
          />

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-800 dark:text-white">
            Empower Your Future with <br /> Modern Learning
          </h1>
          <p className="text-base text-[#333333] dark:text-gray-200">
            An investment in knowledge pays the best interest grow your
            creativie Entrepreneurship.
          </p>
        </div>
      </div>

      {/* mx-[.75rem] md: */}
      <div className="mx-[6rem] grid grid-cols-3 items-center gap-4 align-middle">
        <LandingCoursewaveStatItem
          number={courses.length ?? 50}
          title={"Online Courses"}
          description={
            "Learn from us, polish your skills or gain new skills by taking our interesting in-depth courses!"
          }
        />
        <LandingCoursewaveStatItem
          number={instructors.length ?? 50}
          title={"Professional Instructors"}
          description={
            "Our courses are taught by worldwide top leading professionals and industry experts."
          }
        />
        <LandingCoursewaveStatItem
          number={users.length ?? 50}
          title={"Students Enrolled"}
          description={`Join a community of over ${users.length ?? 50}+ learners who are advancing their skills with our courses.`}
        />
      </div>
    </div>
  );
};

export default LandingCoursewaveStats;

const LandingCoursewaveStatItem = ({ number, title, description }: any) => {
  const { theme } = useTheme();
  return (
    <div className="border-stroke w-full max-w-[24rem] space-y-2 rounded-xl border bg-transparent p-[1.2rem] shadow-2xl">
      <div className="flex flex-col items-start justify-start space-y-1">
        <h1 className="text-left text-2xl font-bold tracking-tighter text-zinc-800 dark:text-white">
          <NumberTicker value={number ?? 250} />
        </h1>
        <p className="line-clamp-1 text-ellipsis text-left text-xl font-semibold tracking-tight text-zinc-800 dark:text-white">
          {title ?? "Online Courses"}
        </p>
      </div>

      <p className="line-clamp-3 text-ellipsis text-wrap text-left text-base text-[#333333] dark:text-gray-200">
        {description ??
          "Learn and polish skills by taking our interesting in-depth courses!"}
      </p>
    </div>
  );
};
