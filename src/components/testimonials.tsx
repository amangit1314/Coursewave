"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TestimonialItem from "./testomonial_item";

export default function Testimonials() {
    return (
        <div className="max-h-screen mb-12 max-w-7xl w-full h-full">
            <p className="text-2xl font-bold text-center">Testimonials</p>
            <p className="pt-4 text-md opacity-80  text-center">See what our students say about our courses and mentorship sessions </p>

            <div className=" flex flex-col lg:flex-row w-full p-8 mx-auto mb-[16rem] md:mb-[3rem] scroll-smooth">
                <TestimonialItem
                    imgUrl="/assets/images/images1.jpg"
                    name="Josh Mayer"
                    courseName="Complete Flutter Dev Bootcamp"
                    comment="A generous person who has a passion to work with different mindsets and also lead them too according to their caliber, this person is a hard-working personality."
                />
                <div className="py-2 visible lg:hidden lg:py-0"></div>
                <TestimonialItem
                    imgUrl="/assets/images/images2.jpg"
                    name="Ankit Sharma"
                    courseName="Backend Pro Master Class"
                    comment="A generous person who has a passion to work with different mindsets and also lead them too according to their caliber, this person is a hard-working personality."
                />
                <div className="py-2 visible lg:hidden lg:py-0"></div>
                <TestimonialItem
                    imgUrl="/assets/images/images1.jpg"
                    name="Rohan Singh"
                    courseName="Complete Flutter Dev Bootcamp"
                    comment="A generous person who has a passion to work with different mindsets and also lead them too according to their caliber, this person is a hard-working personality."
                />
                
            </div>
{/* 
            <Swiper slidesPerView={3} className="w-full p-8 mx-auto mb-16 swiper-wrapper">
                <SwiperSlide className="swiper-slide">
                    <TestimonialItem
                        projectUrl=""
                        imgUrl="https://omlogistics.co.in/wp-content/uploads/2015/09/Randheer-sharma-359X233-848X335.jpg"
                        name="Vikas Kumawat"
                        courseName="HR Manager, Om Logistics."
                        comment="A generous person who has a passion to work with different mindsets and also lead them too according to their caliber, this person is a hard-working personality."
                    />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                    <TestimonialItem
                        imgUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQICSVq9-BAcWmscgA5pQyPPxdeJGu6p6w-0Q&usqp=CAU"
                        name="James D"
                        courseName="Global Team Lead, Slack"
                        comment="A generous person who has a passion to work with different mindsets and also lead them too according to their caliber, this person is a hard-working personality."
                        projectUrl=""
                    />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                    <TestimonialItem
                        projectUrl=""
                        imgUrl="https://www.seekpng.com/png/detail/402-4024748_how-to-apply-the-porefessional-face-primer-persons.png"
                        name="John Doe"
                        courseName="HR Manager, Hacker Rank"
                        comment="A generous person who has a passion to work with different mindsets and also lead them too according to their caliber, this person is a hard-working personality."
                    />
                </SwiperSlide>
            </Swiper> */}
        </div>
    );
}
