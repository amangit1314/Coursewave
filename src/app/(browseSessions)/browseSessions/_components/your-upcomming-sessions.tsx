import React from "react";
import { UpcommingSessionsCard } from "./upcomming-session-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const YourUpComingSessions = () => {
  return (
    <div>
     
      <UpcommingSessionsCarousel />
      {/* <div className="flex overflow-x-scroll">
        <UpcommingSessionsCard />
        <UpcommingSessionsCard />
        <UpcommingSessionsCard />
        <UpcommingSessionsCard />
      </div> */}
    </div>
  );
};

const UpcommingSessionsCarousel = () => {
  return (
    <Carousel>
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold tracking-tight pb-2">
          Your Upcoming Sessions
        </p>
        <div className="flex justify-end items-center">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
      <CarouselContent>
        <CarouselItem className="basis-2/5">
          <UpcommingSessionsCard />
        </CarouselItem>
        <CarouselItem className="basis-2/5">
          <UpcommingSessionsCard />
        </CarouselItem>
        <CarouselItem className="basis-2/5">
          <UpcommingSessionsCard />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};
