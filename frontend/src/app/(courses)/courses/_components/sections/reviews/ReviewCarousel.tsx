/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Image from "next/image";
import { Course } from "@prisma/client";
import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { TbCertificate } from "react-icons/tb";
import { BsPersonVideo2 } from "react-icons/bs";
import { FaCircleCheck } from "react-icons/fa6";
import { GoProjectTemplate } from "react-icons/go";
import { FaDownload, FaShare, FaStar } from "react-icons/fa";
import {
  HiOutlineGift,
  HiOutlineShoppingCart,
  HiShoppingCart,
} from "react-icons/hi";
import { MdOutlineRateReview } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import "swiper/css";
import { Controller, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import Video from "next-video";
import Reviewcard from "./ReviewCard";

const ReviewCarousel = ({ reviews }: any) => {
  const swiper = useSwiper();
  const [firstSwiper, setFirstSwiper] = React.useState(null);
  const isActive = true;

  return (
    <div>
      {/* Swipper wrapper */}
      <Swiper
        spaceBetween={10}
        slidesPerView={3}
        pagination={{ clickable: true }}
        modules={[EffectFade, Navigation, Pagination]}
        navigation={true}
      >
        {reviews.map((review: any, index: any) => (
          <SwiperSlide key={index}>
            <Reviewcard
              key={index}
              authorName={review.name}
              date={review.date}
              // showDetails={true}
              starRating={5.0}
              authorImgUrl={review.imgurl}
              review={review.review}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* <!-- Slider indicators --> */}
      {/* <div className="absolute z-30 rounded-xl flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {content.map((indicator, index) => {
          return (
            <button
              key={index}
              type="button"
              className={`w-3 ${
                isActive ? "bg-orange-600" : "bg-orange-400"
              } h-3  rounded-full`}
              aria-current="true"
              aria-label="Slide 1"
              data-carousel-slide-to={index}
            ></button>
          );
        })}
      </div> */}

      {/* Slider controls */}
      {/* <button
        type="button"
        className="absolute  top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={() => swiper.slidePrev()}
        data-carousel-prev
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only text-xs font-bold text-orange-600">
            Previous
          </span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={() => swiper.slideNext()}
        data-carousel-next
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only text-xs font-bold text-orange-600">
            Next
          </span>
        </span>
      </button> */}
    </div>
  );
};

export default ReviewCarousel;