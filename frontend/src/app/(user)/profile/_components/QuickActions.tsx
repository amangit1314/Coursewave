"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PlayCircle, BookOpen, Info, Share, Users } from "lucide-react";
import { useUserStore } from "@/zustand/userStore";
import { toast } from "react-hot-toast";

export default function QuickActions() {
  const router = useRouter();
  const { user } = useUserStore();

  const isInstructor = user?.roles?.includes("INSTRUCTOR");

  // Core actions visible to everyone
  const baseActions = [
    {
      title: "About Coursewave",
      desc: "Learn more about Coursewave",
      icon: <Info className="w-5 h-5" />,
      onClick: () => router.push("/about"),
      color: "from-emerald-600 to-green-500",
    },
    {
      title: "Share App",
      desc: "Share us with others",
      icon: <Share className="w-5 h-5" />,
      onClick: () => {
        if (navigator.share) {
          navigator
            .share({
              title: "Coursewave",
              text: "Check out Coursewave - Learn and Teach Online!",
              url: window.location.origin,
            })
            .catch((error) => console.log("Error sharing", error));
        } else {
          toast("Sharing not supported on this device.");
        }
      },
      color: "from-purple-600 to-pink-500",
    },
  ];

  // Instructor-only actions
  const instructorActions = [
    {
      title: "Continue Teaching",
      desc: "Resume where you left off",
      icon: <PlayCircle className="w-5 h-5" />,
      onClick: () => router.push("/instructor/dashboard"),
      color: "from-emerald-600 to-lime-500",
    },
    {
      title: "Manage Courses",
      desc: "Manage and edit your existing courses",
      icon: <BookOpen className="w-5 h-5" />,
      onClick: () => router.push("/instructor/courses"),
      color: "from-purple-600 to-pink-500",
    },
  ];

  // If user is NOT an instructor
  const nonInstructorAction = {
    title: "Become Instructor",
    desc: "Start teaching today",
    icon: <Users className="w-5 h-5" />,
    onClick: () => router.push("/instructor/become"),
    color: "from-blue-600 to-indigo-500",
  };

  // Merge actions conditionally
  const actions = isInstructor
    ? [...instructorActions, ...baseActions]
    : [nonInstructorAction, ...baseActions];

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-yellow-500"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887a1.125 1.125 0 012.676-.983l5.603 3.113z"
            clipRule="evenodd"
          />
        </svg>
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {actions.map((action, i) => (
          <Card
            key={i}
            onClick={action.onClick}
            className="flex items-center justify-between bg-white dark:bg-zinc-900 dark:hover:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 dark:hover:border-none p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-xl bg-gradient-to-tr ${action.color} text-white`}
              >
                {action.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm truncate max-w-[180px]">
                  {action.title}
                </span>
                <span className="text-xs text-gray-400 truncate max-w-[180px]">
                  {action.desc}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
