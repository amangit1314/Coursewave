import { SessionCard } from "@/app/(sessions)/browseSessions/_components/session-card";
import { Session } from "@/types/session";
import React from "react";

function CreatedSessions() {
  const dummySession: Session = {
    id: "session_dummy_id",
    title: "Intro to Full-Stack Development",
    description:
      "A demo session for learning how to build full-stack apps with Next.js.",
    imageUrl: "/assets/images/cover/cover-01.png", // or null
    status: "UPCOMING", // 'UPCOMING' | 'LIVE' | 'ENDED'
    type: "GROUP", // 'ONE_TO_ONE' | 'GROUP'
    rtcType: "WEBRTC", // 'WEBRTC' | 'ZOOM' | 'GOOGLE_MEET'
    rtcRoomId: "dummy_room_id",
    rtcToken: "dummy_rtc_token",
    rtcConfig: null, // or {} if you want
    isFree: false,
    price: 49,
    currency: "USD",
    scheduledAt: new Date().toISOString(),
    duration: 60, // in minutes
    endsAt: new Date(Date.now() + 60 * 60000).toISOString(), // scheduledAt + 1 hour
    instructorId: "instructor_dummy_id",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    instructor: {
      id: "instructor_dummy_id",
      userId: "user_dummy_id",
      bio: "Expert in web development and teaching.",
      expertise: ["Next.js", "TypeScript", "React"],
      socialLinks: {
        twitter: "https://twitter.com/dummy",
        linkedin: "https://linkedin.com/in/dummy",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        name: "John Doe",
        profileImageUrl: null,
      },
    },

    _count: {
      bookings: 10,
    },
  };

  return (
    <div className="mx-12 pt-[80px]">
      <div className="grid h-full w-full grid-cols-4 gap-4 rounded-xl bg-gray-200 p-8 dark:bg-gray-700">
        <SessionCard
          // sessionImage={"/assets/images/cover/cover-01.png"}
          // sessionName={"Webinar on building a course website"}
          // instructor={"Aman Soni"}
          session={dummySession}
          isBooked={false}
        />
        {/* <SessionCard />
          <SessionCard />
          <SessionCard />
          <SessionCard />
          <SessionCard /> */}
      </div>
    </div>
  );
}

export default CreatedSessions;
