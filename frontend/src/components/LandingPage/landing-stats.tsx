"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Star,
  Zap,
  Target,
  Rocket,
} from "lucide-react";
import NumberTicker from "@/components/magicui/number-ticker";
import { Course } from "@/types/course";
import { Instructor } from "@/types/course-details-api-response";
import { User } from "@/types/session";
import { dmSans } from "@/lib/config/fonts";
import { usePlatformStats } from "@/hooks/usePlatformStats";

gsap.registerPlugin(ScrollTrigger);

/// ===============================================================================================

// const LandingCoursewaveStats = () => {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const [stats, setStats] = React.useState<{
//     courses: Course[];
//     instructors: Instructor[];
//     users: User[];
//   }>({ courses: [], instructors: [], users: [] });

//   // React.useEffect(() => {
//   //   const fetchStats = async () => {
//   //     const data = await getHomeStats();
//   //     setStats(data);
//   //   };

//   //   fetchStats();
//   // }, []);

//   const { courses, instructors, users } = stats;

//   const statsData = [
//     {
//       icon: BookOpen,
//       number: courses.length || 200,
//       title: "Online Courses",
//       description:
//         "Comprehensive courses covering the latest technologies and frameworks",
//       gradient: "from-blue-500 to-cyan-500",
//       bgGradient: "from-blue-50 to-cyan-50",
//       darkBgGradient: "from-blue-950/20 to-cyan-950/20",
//     },
//     {
//       icon: Users,
//       number: instructors.length || 50,
//       title: "Expert Instructors",
//       description:
//         "Learn from industry professionals with years of real-world experience",
//       gradient: "from-emerald-500 to-teal-500",
//       bgGradient: "from-emerald-50 to-teal-50",
//       darkBgGradient: "from-emerald-950/20 to-teal-950/20",
//     },
//     {
//       icon: Award,
//       number: users.length || 10000,
//       title: "Active Learners",
//       description:
//         "Join a thriving community of developers advancing their careers",
//       gradient: "from-purple-500 to-pink-500",
//       bgGradient: "from-purple-50 to-pink-50",
//       darkBgGradient: "from-purple-950/20 to-pink-950/20",
//     },
//   ];

//   const achievements = [
//     { icon: Star, text: "100% Success Rate", color: "text-yellow-500" },
//     { icon: Target, text: "Industry Recognition", color: "text-blue-500" },
//     { icon: Rocket, text: "Career Acceleration", color: "text-emerald-500" },
//     { icon: Zap, text: "Real-time Learning", color: "text-purple-500" },
//   ];

//   useEffect(() => {
//     if (!sectionRef.current) return;

//     // Animate section title
//     gsap.fromTo(
//       ".stats-title",
//       { y: 50, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.8,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 80%",
//         },
//       }
//     );

//     // Animate stats cards
//     gsap.fromTo(
//       ".stat-card",
//       { y: 60, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.8,
//         stagger: 0.2,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 70%",
//         },
//       }
//     );

//     // Animate achievements
//     gsap.fromTo(
//       ".achievement-item",
//       { y: 30, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.6,
//         stagger: 0.1,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 60%",
//         },
//       }
//     );
//   }, []);

//   return (
//     <div
//       ref={sectionRef}
//       className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
//     >
//       <div className="flex flex-col space-y-16">
//         {/* Header Section */}
//         <motion.div
//           className="text-center"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//         >
//           <div className="mb-4 flex items-center justify-center space-x-2">
//             <TrendingUp className="h-6 w-6 text-blue-500" />
//             <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
//               Our Impact
//             </span>
//             <TrendingUp className="h-6 w-6 text-blue-500" />
//           </div>
//           <h2
//             className={`${dmSans.className} stats-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl`}
//           >
//             Empowering Developers
//             <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//               {" "}
//               Worldwide
//             </span>
//           </h2>
//           <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-zinc-300 sm:text-xl">
//             Join thousands of developers who have transformed their careers with
//             our comprehensive learning platform
//           </p>
//         </motion.div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//           {statsData.map((stat, index) => (
//             <StatCard key={index} {...stat} />
//           ))}
//         </div>

//         {/* Achievements Section */}
//         <motion.div
//           className="achievement-item"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//         >
//           <div className="relative">
//             <div className="absolute inset-0 border border-none dark:border-zinc-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl dark:from-zinc-800/20 dark:to-gray-950/20" />
//             <div className="relative p-8 sm:p-12">
//               <div className="text-center mb-12">
//                 <h3
//                   className={`${dmSans.className} text-2xl font-bold text-zinc-800 dark:text-white sm:text-3xl mb-4`}
//                 >
//                   Surf the Future of Learning
//                 </h3>
//                 <p className="text-lg text-zinc-600 dark:text-gray-300 max-w-2xl mx-auto">
//                   oin thousands who&apos;ve grown their careers with CourseWave.
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
//                 {achievements.map((achievement, index) => (
//                   <AchievementItem key={index} {...achievement} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default LandingCoursewaveStats;

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const LandingCoursewaveStats = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { data: stats, isLoading, error } = usePlatformStats();

  const statsData = [
    {
      icon: BookOpen,
      number: stats?.totalCourses || 0,
      title: "Online Courses",
      description:
        "Comprehensive courses covering the latest technologies and frameworks",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      darkBgGradient: "from-blue-950/20 to-cyan-950/20",
    },
    {
      icon: Users,
      number: stats?.totalInstructors || 0,
      title: "Expert Instructors",
      description:
        "Learn from industry professionals with years of real-world experience",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      darkBgGradient: "from-emerald-950/20 to-teal-950/20",
    },
    {
      icon: Award,
      number: stats?.totalUsers || 0,
      title: "Active Learners",
      description:
        "Join a thriving community of developers advancing their careers",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      darkBgGradient: "from-purple-950/20 to-pink-950/20",
    },
  ];

  const achievements = [
    { icon: Star, text: "100% Success Rate", color: "text-yellow-500" },
    { icon: Target, text: "Industry Recognition", color: "text-blue-500" },
    { icon: Rocket, text: "Career Acceleration", color: "text-emerald-500" },
    { icon: Zap, text: "Real-time Learning", color: "text-purple-500" },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate section title
    gsap.fromTo(
      ".stats-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // Animate stats cards
    gsap.fromTo(
      ".stat-card",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    // Animate achievements
    gsap.fromTo(
      ".achievement-item",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      }
    );
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-16">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h3 className="text-red-800 font-medium text-lg mb-2">
              Failed to load statistics
            </h3>
            <p className="text-red-600 text-sm">
              {error.message || "Please try refreshing the page"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col space-y-16">
        {/* Header Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex items-center justify-center space-x-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Our Impact
            </span>
            <TrendingUp className="h-6 w-6 text-blue-500" />
          </div>
          <h2
            className={`${dmSans.className} stats-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl`}
          >
            Empowering Developers
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              Worldwide
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-zinc-300 sm:text-xl">
            Join thousands of developers who have transformed their careers with
            our comprehensive learning platform
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Achievements Section */}
        <motion.div
          className="achievement-item"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <div className="absolute inset-0 border border-none dark:border-zinc-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl dark:from-zinc-800/20 dark:to-gray-950/20" />
            <div className="relative p-8 sm:p-12">
              <div className="text-center mb-12">
                <h3
                  className={`${dmSans.className} text-2xl font-bold text-zinc-800 dark:text-white sm:text-3xl mb-4`}
                >
                  Surf the Future of Learning
                </h3>
                <p className="text-lg text-zinc-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Join thousands who&apos;ve grown their careers with
                  CourseWave.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {achievements.map((achievement, index) => (
                  <AchievementItem key={index} {...achievement} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingCoursewaveStats;
/// ===============================================================================================

const StatCard = ({
  icon: Icon,
  number,
  title,
  description,
  gradient,
  bgGradient,
  darkBgGradient,
}: any) => {
  return (
    <motion.div
      className="stat-card group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 transition-all duration-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10 dark:${darkBgGradient}`}
      />

      {/* Icon */}
      <div
        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${gradient} shadow-lg`}
      >
        <Icon className="h-8 w-8 text-white" />
      </div>

      {/* Content */}
      <div className="relative space-y-4">
        <div className={`${dmSans.className} space-y-2`}>
          <h3 className="text-3xl font-bold tracking-tighter text-zinc-800 dark:text-white sm:text-4xl">
            <NumberTicker value={number} />
            <span className="text-2xl text-blue-500">+</span>
          </h3>
          <h4 className="text-xl font-semibold text-zinc-800 dark:text-white">
            {title}
          </h4>
        </div>
        <p className="text-zinc-600 dark:text-zinc-300">{description}</p>
      </div>

      {/* Hover Effect */}
      {/* <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/0 to-cyan-500/0 transition-all duration-300 group-hover:from-blue-500/10 group-hover:to-cyan-500/10" /> */}
    </motion.div>
  );
};

const AchievementItem = ({ icon: Icon, text, color }: any) => {
  return (
    <motion.div
      className="achievement-item flex flex-col items-center space-y-2"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800`}
      >
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <p className="text-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {text}
      </p>
    </motion.div>
  );
};
