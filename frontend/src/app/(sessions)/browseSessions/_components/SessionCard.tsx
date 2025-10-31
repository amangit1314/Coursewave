import React from "react";
import Image from "next/image";
import AvatarCircles from "@/components/magicui/avatar-circles";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Session } from "@/types/session";
import {
  Calendar,
  Clock,
  Star,
  Users,
  Play,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface SessionCardProps {
  session: Session;
  isBooked?: boolean;
  showActions?: boolean;
  onEdit: any;
  onViewAnalytics: any;
}

export const SessionCard = ({
  session,
  isBooked = false,
  showActions = false,
  onEdit,
  onViewAnalytics,
}: SessionCardProps) => {
  const avatarUrls = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_s8bqkElCOr8R2XL0I4LmiLQexffc-LMRjOaTCAj8ml1UxCXAohpoQ1soZ-GzyQx74l4&usqp=CAU",
    "https://i.pinimg.com/originals/c6/9d/d2/c69dd2fd36d5797c9472c738ddce44de.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScODbPIbdc7AAY2QzQApgWsCzbJ3saUiN-Nm5unofg_beDzFe350o0vHNApy9e17rjXPE&usqp=CAU",
  ];

  const isLive = session.status === "LIVE";
  const isStartingSoon =
    new Date(session.scheduledAt).getTime() - Date.now() < 30 * 60 * 1000; // 30 minutes
  const isPast = new Date(session.scheduledAt).getTime() < Date.now();

  const formattedDate = new Date(session.scheduledAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusBadge = () => {
    if (isLive) {
      return (
        <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white border-0">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>
        </Badge>
      );
    }
    if (isStartingSoon && !isPast) {
      return (
        <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600 text-white border-0">
          Starting Soon
        </Badge>
      );
    }
    if (isPast) {
      return (
        <Badge className="absolute top-3 left-3 bg-gray-500 hover:bg-gray-600 text-white border-0">
          Completed
        </Badge>
      );
    }
    return null;
  };

  const getActionButton = () => {
    if (isBooked) {
      if (isLive) {
        return (
          <Link
            href={`/sessions/${session.id}`}
            className="w-full px-4 py-3 flex justify-center items-center text-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg cursor-pointer transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            <Play className="h-4 w-4 mr-2" />
            Join Now
          </Link>
        );
      } else if (isPast) {
        return (
          <Button
            className="w-full px-4 py-3 flex justify-center items-center text-sm text-white bg-gray-500 rounded-lg cursor-not-allowed opacity-75"
            disabled
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Session Completed
          </Button>
        );
      } else {
        return (
          <Button
            className="w-full px-4 py-3 flex justify-center items-center text-sm text-white bg-blue-500 rounded-lg cursor-not-allowed opacity-75"
            disabled
          >
            <Calendar className="h-4 w-4 mr-2" />
            Session Booked
          </Button>
        );
      }
    } else {
      return (
        <Link
          href={`/sessions/${session.id}`}
          className="w-full px-4 py-3 flex justify-center items-center text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg cursor-pointer transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          {session.isFree ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Free Session
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              {session.currency} {session.price}
            </>
          )}
        </Link>
      );
    }
  };

  return (
    <Card className="group h-full w-full cursor-pointer hover:shadow-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 rounded-xl overflow-hidden">
      <div className="relative w-full aspect-[16/9]">
        <Image
          className="rounded-t-xl group-hover:scale-105 transition-transform duration-300"
          src={session.imageUrl || "/assets/images/cards/default-session.png"}
          alt={session.title}
          fill
          style={{
            objectFit: "cover",
          }}
          unoptimized
        />
        {getStatusBadge()}

        {/* Instructor rating overlay */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs text-white font-medium">4.8</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          {/* Date and time */}
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {session.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
              <Users className="h-3 w-3 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">by</span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
              {session.instructor.user.name}
            </span>
          </div>

          {/* Enrolled users */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AvatarCircles
                numPeople={session._count.bookings}
                avatarUrls={avatarUrls}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {session._count.bookings} enrolled
              </span>
            </div>

            {/* Session duration */}
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>60 min</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2">{getActionButton()}</div>
      </CardContent>
    </Card>
  );
};
