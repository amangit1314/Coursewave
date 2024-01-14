import React from "react";
import { CoachCard } from "./coach-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const MeetOurCoaches = () => {
  return (
    <div className="w-auto">
      <p className="text-xl font-semibold tracking-tight  pb-2">
        Meet our Coaches
      </p>
      {/* <div className="grid grid-cols-1 max-w-5xl lg:grid-cols-3 gap-2 my-6 justify-center mx-auto">
          <CoachCard />
          <CoachCard />
        </div> */}
      <MeetOurCoachesCarousel />
    </div>
  );
};

const coaches = [
  {
    name: "Jessica Gutierrez",
    image: "/assets/images/user/user-01.png",
    profession: "Data Scientist",
    about:
      "I aim to bring out your strengths and be an empatheic, supportive, and non-judgemental person for you.",
  },
  {
    name: "James Arnol",
    image: "/assets/images/user/user-02.png",
    profession: "Data Scientist",
    about:
      "I aim to bring out your strengths and be an empatheic, supportive, and non-judgemental person for you.",
  },
  {
    name: "Hamed Jones",
    image: "/assets/images/user/user-03.png",
    profession: "Data Scientist",
    about:
      "I aim to bring out your strengths and be an empatheic, supportive, and non-judgemental person for you.",
  },
  {
    name: "Jane Guzlord",
    image: "/assets/images/user/user-04.png",
    profession: "Data Scientist",
    about:
      "I aim to bring out your strengths and be an empatheic, supportive, and non-judgemental person for you.",
  },
  {
    name: "Amatro Hollan",
    image: "/assets/images/user/user-05.png",
    profession: "Data Scientist",
    about:
      "I aim to bring out your strengths and be an empatheic, supportive, and non-judgemental person for you.",
  },
];

const MeetOurCoachesCarousel = () => {
  return (
    <Carousel>
      <CarouselContent>
        {coaches.map((coach, index) => {
          return (
            <CarouselItem key={index} className="basis-[16rem]">
              <CoachCard
                name={coach.name}
                image={coach.image}
                profession={coach.profession}
                about={coach.about}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};
