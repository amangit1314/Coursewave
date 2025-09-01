"use client";

import { Card } from "@/components/ui/card";
import { Code2, Palette, LineChart, Megaphone, BookOpen, Users2 } from "lucide-react";

const categories = [
  {
    name: "Programming",
    icon: Code2,
    description: "Learn coding and software development",
    color: "text-blue-500",
    sessions: 42,
  },
  {
    name: "Design",
    icon: Palette,
    description: "Master UI/UX and graphic design",
    color: "text-purple-500",
    sessions: 35,
  },
  {
    name: "Business",
    icon: LineChart,
    description: "Grow your business skills",
    color: "text-green-500",
    sessions: 28,
  },
  {
    name: "Marketing",
    icon: Megaphone,
    description: "Learn digital marketing strategies",
    color: "text-orange-500",
    sessions: 31,
  },
  {
    name: "Education",
    icon: BookOpen,
    description: "Enhance teaching and learning",
    color: "text-red-500",
    sessions: 24,
  },
  {
    name: "Leadership",
    icon: Users2,
    description: "Develop management skills",
    color: "text-teal-500",
    sessions: 19,
  },
];

export const FeaturedCategories = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Featured Categories
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Explore sessions by topic
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.name}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group border border-stroke"
            >
              <div className="flex items-start gap-4">
                <div className={`${category.color} p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {category.description}
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    {category.sessions} active sessions
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}; 