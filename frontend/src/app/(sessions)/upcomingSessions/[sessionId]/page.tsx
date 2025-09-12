"use client";

import React, { Suspense } from "react";
import { notFound, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// async function getSession(sessionId: string) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL || ""}/sessions/${sessionId}`
//   );
//   if (!res.ok) return null;
//   const data = await res.json();
//   return data.data;
// }

export default function SessionDetailPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params?.sessionId;

  // const session = await getSession(sessionId);
  const session = {
    id: "sess_12345",
    title: "Mastering React Hooks",
    status: "UPCOMING", // could be UPCOMING, LIVE, COMPLETED
    isFree: false,
    price: 49.99,
    currency: "USD",
    type: "GROUP", // or "ONE_TO_ONE"
    startTime: new Date().toISOString(), // today
    duration: 60, // minutes
    description:
      "Join this interactive session to dive deep into React hooks, state management, and practical use cases.",
    instructor: {
      user: {
        id: "user_987",
        name: "Jane Doe",
        profileImage: "/assets/images/user/user-01.png",
      },
    },
  };

  if (!session) return notFound();

  const formattedDate = new Date(session.startTime).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" }
  );
  const formattedTime = new Date(session.startTime).toLocaleTimeString(
    "en-US",
    { hour: "2-digit", minute: "2-digit" }
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl mb-2">{session.title}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{session.status}</Badge>
              <Badge variant="outline">
                {session.isFree
                  ? "Free"
                  : `${session.price} ${session.currency}`}
              </Badge>
              <Badge variant="outline">
                {session.type === "ONE_TO_ONE" ? "1-on-1" : "Group"}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium">
                {session.instructor?.user?.name}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>
                {formattedTime} ({session.duration} minutes)
              </span>
            </div>
            <div className="my-4">
              <p className="text-gray-700 dark:text-gray-200">
                {session.description}
              </p>
            </div>
            <Link
              href={`/sessions/upcoming/${session.id}/event`}
              passHref
              legacyBehavior
            >
              <a className="w-full inline-flex justify-center items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md font-medium transition-colors">
                <Video className="h-4 w-4 mr-2" />
                Join Event
              </a>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
