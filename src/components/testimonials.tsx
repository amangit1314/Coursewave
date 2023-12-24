"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TestimonialItem from "./testomonial_item";

export default function Testimonials() {
    return (
        <div className="max-h-screen mb-12 max-w-7xl w-full h-full">
            <p className="text-2xl font-bold text-center">Testimonials</p>
            <p className="pt-4 text-md opacity-80 mb-4  text-center">See what our students say about our courses and mentorship sessions </p>

            <div className=" flex flex-col lg:flex-row w-full md:p-8 md:mx-auto mb-[16rem] md:mb-[3rem] scroll-smooth">
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
        </div>
    );
}
