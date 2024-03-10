import React from "react";
import { SessionCard } from "./session-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const PopularTalksAndSessions = () => {
  return (
    <div>
      <p className="text-xl  pb-4 font-semibold tracking-tight">
        Today Popular Talks and Sessions
      </p>
      {/* <div className="grid grid-cols-1 max-w-5xl lg:grid-cols-4 gap-4 my-6 justify-center mx-auto">
          <SessionCard />
          <SessionCard />
          <SessionCard />
          <SessionCard />
        </div> */}
      <PopularTalksAndSessionsCarousel />
    </div>
  );
};

const sessions = [
  {
    name: "Learn skill of working in a technical team.",
    image: "/assets/images/cards/cards-01.png",
    instructor: "Someone Soni",
  },
  {
    name: "Learn skill of working in a technical team.",
    image: "/assets/images/cards/cards-02.png",
    instructor: "Someone Soni",
  },
  {
    name: "Learn skill of working in a technical team.",
    image: "/assets/images/cards/cards-03.png",
    instructor: "Someone Soni",
  },
  {
    name: "Learn skill of working in a technical team.",
    image: "/assets/images/cards/cards-04.png",
    instructor: "Someone Soni",
  },
  {
    name: "Learn skill of working in a technical team.",
    image: "/assets/images/cards/cards-05.png",
    instructor: "Someone Soni",
  },
];

const PopularTalksAndSessionsCarousel = () => {
  return (
    <Carousel>
      <CarouselContent>
        {sessions.map((session, index) => {
          return (
            <CarouselItem key={index} className="basis-[16rem]">
              <SessionCard
                sessionName={session.name}
                sessionImage={session.image}
                instructor={session.instructor}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};
