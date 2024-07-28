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
    <div className="space-y-4">
      <p className="text-xl text-zinc-800 dark:text-white font-bold tracking-tight">
        Today Popular Talks and Sessions
      </p>

      <PopularTalksAndSessionsCarousel />
    </div>
  );
};

const sessions = [
  {
    id: "1",
    name: "Learn skill of working in a technical team.",
    image: "/assets/images/cards/cards-01.png",
    instructor: "Alice Johnson",
    price: 49,
    currency: "USD",
    dateTime: "27 July 2024, 01:00 PM",
    isBooked: true,
    isLive: true,
    sessionEnded: false,
  },
  {
    id: "2",
    name: "Learn skill of working in a technical team.",
    image: "/assets/images/cards/cards-02.png",
    instructor: "Bob Smith",
    price: 14,
    currency: "USD",
    dateTime: "2 Aug 2024, 06:00 PM",
    isBooked: false,
    isLive: false,
    sessionEnded: false,
  },
  {
    id: "3",
    name: "Learn skill of working in a technical team.",
    image: "/assets/images/cards/cards-03.png",
    instructor: "Carol White",
    price: 0,
    currency: "USD",
    dateTime: "7 Aug 2024, 05:30 PM",
    isBooked: true,
    isLive: false,
    sessionEnded: false,
  },
  {
    id: "4",
    name: "Learn skill of working in a technical team.",
    image: "/assets/images/cards/cards-04.png",
    instructor: "Aman Soni",
    price: 35,
    currency: "USD",
    dateTime: "12 Aug 2024, 02:30 PM",
    isBooked: false,
    isLive: false,
    sessionEnded: false,
  },
  {
    id: "5",
    name: "Learn skill of working in a technical team.",
    image: "/assets/images/cards/cards-05.png",
    instructor: "Jack Purple",
    price: 15,
    currency: "USD",
    dateTime: "27 July 2024, 01:19 PM",
    isBooked: false,
    isLive: false,
    sessionEnded: false,
  },
];

const PopularTalksAndSessionsCarousel = () => {
  return (
    <Carousel>
      <CarouselContent>
        {sessions
          .filter((session) => session.sessionEnded === false)
          .map((session, index) => {
            return (
              <CarouselItem key={index} className="basis-[16rem]">
                <SessionCard
                  sessionName={session.name}
                  sessionImage={session.image}
                  instructor={session.instructor}
                  price={session.price}
                  currency={session.currency}
                  dateAndTime={session.dateTime}
                  isBooked={session.isBooked}
                  isLive={session.isLive}
                />
              </CarouselItem>
            );
          })}
      </CarouselContent>
    </Carousel>
  );
};
