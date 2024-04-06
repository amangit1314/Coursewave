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
      <p className="text-2xl text-zinc-800 dark:text-white font-bold  pb-2">
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
    image: "https://content.wepik.com/statics/20269014/preview-page0.jpg",
    profession: "Data Scientist",
    about:
      "I aim to bring out your strengths and be an empatheic, supportive, and non-judgemental person for you.",
  },
  {
    name: "James Arnol",
    image: "https://content.wepik.com/statics/20269016/preview-page1.jpg",
    profession: "Data Scientist",
    about:
      "I aim to bring out your strengths and be an empatheic, supportive, and non-judgemental person for you.",
  },
  {
    name: "Hamed Jones",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHb5zQa03D0ITa-0U8U8gf8sa2FoQbRPxDXzzUH02yyzqErzhZ6nRaiTZrH3_0C65mXO0&usqp=CAU",
    profession: "Data Scientist",
    about:
      "I aim to bring out your strengths and be an empatheic, supportive, and non-judgemental person for you.",
  },
  {
    name: "Jane Guzlord",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRZL_7w2skq-AFEZMKNRVsEZxFdw7wMnFiLSJU_e5pSn9hZ-CidVx8apClM9BA8xkvKPQ&usqp=CAU",
    profession: "Data Scientist",
    about:
      "I aim to bring out your strengths and be an empatheic, supportive, and non-judgemental person for you.",
  },
  {
    name: "Amatro Hollan",
    image: "https://content.wepik.com/statics/20269016/preview-page1.jpg",
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
