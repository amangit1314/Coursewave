"use client";

import React from "react";
import Marquee from "../magicui/marquee";
import TestimonialItem from "./testomonial_item";

const testimonials = [
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_s8bqkElCOr8R2XL0I4LmiLQexffc-LMRjOaTCAj8ml1UxCXAohpoQ1soZ-GzyQx74l4&usqp=CAU",
    name: "Josh Mayer",
    courseName: "Complete Flutter Dev Bootcamp",
    comment:
      "A generous person who has a passion to work with different mindsets and also lead them too according to their caliber, this person is a hard-working personality.",
    rating: 5.0,
  },
  {
    imgUrl:
      "https://i.pinimg.com/originals/c6/9d/d2/c69dd2fd36d5797c9472c738ddce44de.jpg",
    name: "Ankit Sharma",
    courseName: "Backend Pro Master Class",
    comment:
      "A generous person who has a passion to work with different mindsets and also lead them too according to their caliber, this person is a hard-working personality.",
    rating: 4.5,
  },
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScODbPIbdc7AAY2QzQApgWsCzbJ3saUiN-Nm5unofg_beDzFe350o0vHNApy9e17rjXPE&usqp=CAU",
    name: "Rohan Singh",
    courseName: "Complete Flutter Dev Bootcamp",
    comment:
      "A generous person who has a passion to work with different mindsets and also lead them too according to their caliber, this person is a hard-working personality.",
    rating: 4.3,
  },
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6CbDUHMuQk6ZTbcsRN-57V702yP6Mxml3Qt2uw2VrjoEKVUuWTU3ezIQkZCGQmvH8zKY&usqp=CAU",
    name: "Emily Johnson",
    courseName: "React Mastery Workshop",
    comment:
      "The React Mastery Workshop helped me become confident in my coding skills and build complex projects on my own.",
    rating: 4.8,
  },
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS33gDUfkosbpLY1RMMT4jY-Mn9G1jnQdJVZUEZQXy667t30R7zIqbUqMVNadwmbTjt3RU&usqp=CAU",
    name: "Michael Brown",
    courseName: "Advanced JavaScript Concepts",
    comment:
      "The Advanced JavaScript Concepts course deepened my understanding and opened new opportunities for me.",
    rating: 4.7,
  },
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGyvcL6it2Zsouur1sq5IB3_MavZ6iPIBYr844inDGcpYTbzEuYtkRuV2E_C9pgEnv0nY&usqp=CAU",
    name: "Sarah Lee",
    courseName: "UI/UX Design Bootcamp",
    comment:
      "The UI/UX Design Bootcamp was comprehensive and well-structured. I learned so much about user-centered design.",
    rating: 4.1,
  },
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBUVZ8MppkoZug3d6F52h_p-ltXs6vrxzW7ZMtkCoHCBsfusZC0z6XIccFxjcsVb2W14c&usqp=CAU",
    name: "Daniel Wilson",
    courseName: "Full Stack Web Development",
    comment:
      "The Full Stack Web Development course provided me with the skills and confidence to pursue a career in web development.",
    rating: 4.6,
  },
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmVS6e03glA_m8NOjIimdmDONI10IWmJ892fANCbk_-e432jV8yjO2yoaya40jSHuJwiE&usqp=CAU",
    name: "Sophia Martinez",
    courseName: "Data Science with Python",
    comment:
      "Data Science with Python was an eye-opener. The hands-on projects were particularly helpful.",
    rating: 4.9,
  },
  // {
  //   imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBUVZ8MppkoZug3d6F52h_p-ltXs6vrxzW7ZMtkCoHCBsfusZC0z6XIccFxjcsVb2W14c&usqp=CAU",
  //   name: "James Anderson",
  //   courseName: "Machine Learning A-Z",
  //   comment:
  //     "The Machine Learning A-Z course was thorough and well-explained. I now feel ready to tackle real-world ML problems.",
  // },
  // {
  //   imgUrl: "/assets/images/images9.jpg",
  //   name: "Isabella Thompson",
  //   courseName: "Cybersecurity Fundamentals",
  //   comment:
  //     "Cybersecurity Fundamentals gave me a solid foundation and awareness of security practices necessary in today's digital world.",
  // },
  // {
  //   imgUrl: "/assets/images/images10.jpg",
  //   name: "David Clark",
  //   courseName: "DevOps Masterclass",
  //   comment:
  //     "The DevOps Masterclass was excellent. It covered all the essential tools and practices I needed to know.",
  // },
];

export default function Testimonials() {
  const firstRow = testimonials.slice(0, Math.floor(testimonials.length / 2));
  const secondRow = testimonials.slice(
    Math.floor(testimonials.length / 2),
    Math.floor((2 * testimonials.length) / 2),
  );

  return (
    <div className="h-full w-full max-w-7xl">
      {/* bold text and subtext */}
      <div>
        <p className="text-center text-2xl font-bold tracking-tight text-[#333333] dark:text-white">
          Testimonials
        </p>
        <p className="mb-4 pt-4 text-center text-[1rem] text-[#333333] dark:text-white">
          See what our students say about our courses and mentorship sessions.
        </p>
      </div>

      {/* testimonials marque */}
      <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:dark:shadow-xl">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((testimonial) => (
            <TestimonialItem key={testimonial.name} {...testimonial} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((testimonial) => (
            <TestimonialItem key={testimonial.name} {...testimonial} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </div>
  );
}

/**
 * -------------------------------------- OLD CODE -------------------------------------------------
 *   <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 w-full md:p-8 md:mx-auto mb-[16rem] md:mb-[3rem] scroll-smooth">
        {testimonials.map((testimonial, index) => (
          <React.Fragment key={index}>
            <TestimonialItem
              imgUrl={testimonial.imgUrl}
              name={testimonial.name}
              courseName={testimonial.courseName}
              comment={testimonial.comment}
              rating={testimonial.rating}
            />
            <div className="py-2 visible lg:hidden lg:py-0"></div>
          </React.Fragment>
        ))}
      </div> 
 */
