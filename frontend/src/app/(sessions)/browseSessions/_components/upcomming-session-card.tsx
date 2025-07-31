"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Video, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface UpcomingSessionCardProps {
  id: number;
  title: string;
  instructorName: string;
  instructorImage: string;
  scheduledAt: string;
  duration: number;
  sessionLink?: string;
  isStartingSoon?: boolean;
}

export function UpcommingSessionsCard({ session }: { session: UpcomingSessionCardProps }) {
  const scheduledDate = new Date(session.scheduledAt);
  
  const formattedDate = scheduledDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  
  const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isToday = new Date().toDateString() === scheduledDate.toDateString();
  const isTomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString() === scheduledDate.toDateString();

  const getTimeLabel = () => {
    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    return formattedDate;
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-stroke border-gray-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 group">
      {/* Image Section */}
      <div className="relative h-40 sm:h-48 w-full overflow-hidden">
        <Image
          src="/assets/images/cover/cover-01.png"
          alt={session.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badge */}
        {session.isStartingSoon && (
          <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white border-0 text-xs font-medium">
            Starting Soon
          </Badge>
        )}
        
        {/* Duration Badge */}
        <Badge variant="secondary" className="absolute bottom-3 left-3 bg-white/90 dark:bg-zinc-800/90 text-gray-900 dark:text-white border-0 text-xs">
          {session.duration} min
        </Badge>
      </div>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Instructor Section */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={session.instructorImage}
              alt={session.instructorName}
              width={40}
              height={40}
              className="rounded-full border-stroke border-gray-200 dark:border-zinc-700"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-stroke border-white dark:border-zinc-800 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {session.instructorName}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-xs text-gray-600 dark:text-gray-400">4.9 (128 reviews)</span>
            </div>
          </div>
        </div>

        {/* Session Title */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2 leading-tight">
            {session.title}
          </h4>
        </div>

        {/* Session Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{getTimeLabel()}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>Online Session</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {session.isStartingSoon ? (
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm h-9">
              <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">Join Session</span>
              <span className="sm:hidden">Join</span>
            </Button>
          ) : (
            <Button asChild variant="outline" className="flex-1 text-sm h-9 border-gray-300 dark:border-zinc-600 hover:border-blue-500 dark:hover:border-blue-400">
              <Link href={`/browseSessions/${session.id}`}>
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">Details</span>
              </Link>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-9 w-9 p-0 border border-gray-300 dark:border-zinc-600 hover:border-blue-500 dark:hover:border-blue-400"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
