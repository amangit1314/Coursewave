"use client";

import { UpcommingSessionsCard } from "./UpcommingSessionCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export const YourUpComingSessions = () => {
  // Mock data for upcoming sessions
  const upcomingSessions = [
    {
      id: 1,
      title: "Advanced React Patterns and Performance Optimization",
      instructorName: "Sarah Johnson",
      instructorImage: "/assets/images/user/user-01.png",
      scheduledAt: "2024-03-25T14:00:00Z",
      duration: 60,
      isStartingSoon: true,
    },
    {
      id: 2,
      title: "TypeScript Best Practices for Large Applications",
      instructorName: "Mike Chen",
      instructorImage: "/assets/images/user/user-02.png",
      scheduledAt: "2024-03-26T10:00:00Z",
      duration: 90,
      isStartingSoon: false,
    },
    {
      id: 3,
      title: "Building Scalable APIs with Node.js and Express",
      instructorName: "Emily Rodriguez",
      instructorImage: "/assets/images/user/user-03.png",
      scheduledAt: "2024-03-27T16:00:00Z",
      duration: 75,
      isStartingSoon: false,
    },
    {
      id: 4,
      title: "UI/UX Design Principles for Developers",
      instructorName: "Alex Thompson",
      instructorImage: "/assets/images/user/user-04.png",
      scheduledAt: "2024-03-28T11:00:00Z",
      duration: 60,
      isStartingSoon: false,
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Your Upcoming Sessions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
            Sessions you&apos;ve booked for the next 7 days
          </p>
        </div>
        
        {/* View All Button */}
        <Button 
          variant="outline" 
          size="sm"
          className="w-fit border-gray-300 dark:border-zinc-600 hover:border-blue-500 dark:hover:border-blue-400"
        >
          View All Sessions
        </Button>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            skipSnaps: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {upcomingSessions.map((session, index) => (
              <CarouselItem 
                key={session.id} 
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="h-full">
                  <UpcommingSessionsCard session={session} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Controls */}
          <div className="hidden sm:block">
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 -translate-x-12 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-200 opacity-0 group-hover:opacity-100" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 translate-x-12 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-200 opacity-0 group-hover:opacity-100" />
          </div>
          
          {/* Mobile Navigation Dots */}
          <div className="sm:hidden flex justify-center gap-2 mt-4">
            {upcomingSessions.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 dark:bg-zinc-600 transition-colors duration-200"
              />
            ))}
          </div>
        </Carousel>
      </div>

      {/* Empty State */}
      {upcomingSessions.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No upcoming sessions
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don&apos;t have any sessions scheduled for the next 7 days.
          </p>
          <Button>
            Browse Sessions
          </Button>
        </div>
      )}
    </div>
  );
};
