"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CoachCardProps {
  image: string;
  name: string;
  profession: string;
  about: string;
  rating: number;
  totalSessions: number;
}

export const CoachCard = ({
  image,
  name,
  profession,
  about,
  rating,
  totalSessions,
}: CoachCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute bottom-3 left-3 bg-white dark:bg-zinc-800 rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{profession}</p>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {about}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>{totalSessions} sessions completed</span>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/sessions/book/${name.toLowerCase().replace(/\s+/g, '-')}`}>
              Book Session
            </Link>
          </Button>
          <Button variant="outline" className="flex-1">
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
