import React from "react";
import { PiChartPieSliceThin } from "react-icons/pi";
import { Course, Instructor, User } from "@prisma/client";
import { getHomeStats } from "@/app/_actions/get-home-stats";
import NumberTicker from "@/components/magicui/number-ticker";

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
    <div className="md:max-w-7xl flex-col justify-center items-center mx-auto mt-32 h-full w-full space-y-12">
      <div className="w-full items-center gap-8 align-middle lg:mx-[6rem] lg:grid lg:grid-cols-3">
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
      <div className="lg:mx-[6rem] grid-cols-1 grid md:grid-cols-2 lg:grid-cols-3 items-center gap-4 align-middle">
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
          description={`Join a community of over ${
            users.length ?? 50
          }+ learners who are advancing their skills with our courses.`}
        />
      </div>
    </div>
  );
};

export default LandingCoursewaveStats;

type LandingCoursewaveStatItemProps = {
  number: number;
  title: string;
  description: string;
};

const LandingCoursewaveStatItem = ({
  number,
  title,
  description,
}: LandingCoursewaveStatItemProps) => {
  // const { theme } = useTheme();
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

// const LandingCoursewaveStats = () => {
//   const [stats, setStats] = React.useState<{
//     courses: Course[];
//     instructors: Instructor[];
//     users: User[];
//   }>({ courses: [], instructors: [], users: [] });

//   React.useEffect(() => {
//     const fetchStats = async () => {
//       const data = await getHomeStats();
//       setStats(data);
//     };

//     fetchStats();
//   }, []);

//   const { courses, instructors, users } = stats;

//   return (
//     <div className="mx-auto mt-24 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
//       {/* Top Section */}
//       <div className="flex flex-col items-start space-y-4 text-center sm:text-left">
//         <PiChartPieSliceThin
//           className="mx-auto sm:mx-0 rounded-full border p-2"
//           size={48}
//         />
//         <h1 className="text-2xl font-semibold tracking-tight text-zinc-800 dark:text-white">
//           Empower Your Future with <br /> Modern Learning
//         </h1>
//         <p className="text-base text-zinc-600 dark:text-gray-300 max-w-lg">
//           An investment in knowledge pays the best interest. Grow your creative
//           entrepreneurship.
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         <LandingCoursewaveStatItem
//           number={courses.length}
//           title="Online Courses"
//           description="Learn from us, polish your skills or gain new skills by taking our interesting in-depth courses!"
//         />
//         <LandingCoursewaveStatItem
//           number={instructors.length}
//           title="Professional Instructors"
//           description="Our courses are taught by top professionals and industry experts worldwide."
//         />
//         <LandingCoursewaveStatItem
//           number={users.length}
//           title="Students Enrolled"
//           description={`Join a community of over ${users.length}+ learners who are advancing their skills with our courses.`}
//         />
//       </div>
//     </div>
//   );
// };

// export default LandingCoursewaveStats;

// type LandingCoursewaveStatItemProps = {
//   number: number;
//   title: string;
//   description: string;
// };

// const LandingCoursewaveStatItem = ({
//   number,
//   title,
//   description,
// }: LandingCoursewaveStatItemProps) => {
//   return (
//     <div className="w-full rounded-xl border border-border bg-transparent p-6 shadow-md">
//       <div className="space-y-1">
//         <h1 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-white">
//           <NumberTicker value={number ?? 0} />
//         </h1>
//         <p className="text-lg font-semibold text-zinc-800 dark:text-white">
//           {title}
//         </p>
//       </div>
//       <p className="mt-2 text-sm text-zinc-600 dark:text-gray-300">
//         {description}
//       </p>
//     </div>
//   );
// };
