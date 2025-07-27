"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Marquee } from "@/components/magicui/marquee";
import { Star, Quote, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_s8bqkElCOr8R2XL0I4LmiLQexffc-LMRjOaTCAj8ml1UxCXAohpoQ1soZ-GzyQx74l4&usqp=CAU",
    name: "Josh Mayer",
    role: "Full Stack Developer",
    courseName: "Complete Flutter Dev Bootcamp",
    comment:
      "CourseWave transformed my career! The hands-on projects and expert guidance helped me land my dream job. The community support is incredible.",
    rating: 5.0,
    company: "TechCorp Inc."
  },
  {
    imgUrl:
      "https://i.pinimg.com/originals/c6/9d/d2/c69dd2fd36d5797c9472c738ddce44de.jpg",
    name: "Ankit Sharma",
    role: "Backend Engineer",
    courseName: "Backend Pro Master Class",
    comment:
      "The Backend Pro course exceeded my expectations. Real-world projects and industry best practices made all the difference in my learning journey.",
    rating: 4.8,
    company: "StartupXYZ"
  },
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScODbPIbdc7AAY2QzQApgWsCzbJ3saUiN-Nm5unofg_beDzFe350o0vHNApy9e17rjXPE&usqp=CAU",
    name: "Rohan Singh",
    role: "Mobile Developer",
    courseName: "Complete Flutter Dev Bootcamp",
    comment:
      "From beginner to confident developer in just 6 months! The structured learning path and mentorship sessions were game-changers for me.",
    rating: 4.9,
    company: "MobileFirst"
  },
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6CbDUHMuQk6ZTbcsRN-57V702yP6Mxml3Qt2uw2VrjoEKVUuWTU3ezIQkZCGQmvH8zKY&usqp=CAU",
    name: "Emily Johnson",
    role: "Frontend Developer",
    courseName: "React Mastery Workshop",
    comment:
      "The React Mastery Workshop helped me become confident in my coding skills and build complex projects on my own. Highly recommended!",
    rating: 4.8,
    company: "WebSolutions"
  },
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS33gDUfkosbpLY1RMMT4jY-Mn9G1jnQdJVZUEZQXy667t30R7zIqbUqMVNadwmbTjt3RU&usqp=CAU",
    name: "Michael Brown",
    role: "JavaScript Developer",
    courseName: "Advanced JavaScript Concepts",
    comment:
      "The Advanced JavaScript Concepts course deepened my understanding and opened new opportunities for me. The instructors are world-class!",
    rating: 4.7,
    company: "CodeCraft"
  },
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGyvcL6it2Zsouur1sq5IB3_MavZ6iPIBYr844inDGcpYTbzEuYtkRuV2E_C9pgEnv0nY&usqp=CAU",
    name: "Sarah Lee",
    role: "UI/UX Designer",
    courseName: "UI/UX Design Bootcamp",
    comment:
      "The UI/UX Design Bootcamp was comprehensive and well-structured. I learned so much about user-centered design and landed a great role!",
    rating: 4.6,
    company: "DesignStudio"
  },
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBUVZ8MppkoZug3d6F52h_p-ltXs6vrxzW7ZMtkCoHCBsfusZC0z6XIccFxjcsVb2W14c&usqp=CAU",
    name: "Daniel Wilson",
    role: "Full Stack Developer",
    courseName: "Full Stack Web Development",
    comment:
      "The Full Stack Web Development course provided me with the skills and confidence to pursue a career in web development. Amazing experience!",
    rating: 4.8,
    company: "DevHub"
  },
  {
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmVS6e03glA_m8NOjIimdmDONI10IWmJ892fANCbk_-e432jV8yjO2yoaya40jSHuJwiE&usqp=CAU",
    name: "Sophia Martinez",
    role: "Data Scientist",
    courseName: "Data Science with Python",
    comment:
      "Data Science with Python was an eye-opener. The hands-on projects were particularly helpful and the community support is outstanding.",
    rating: 4.9,
    company: "DataFlow"
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const firstRow = testimonials.slice(0, Math.floor(testimonials.length / 2));
  const secondRow = testimonials.slice(Math.floor(testimonials.length / 2));

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate section title
    gsap.fromTo(
      ".testimonial-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // Auto-play testimonials
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  return (
    <div ref={sectionRef} className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-16">
        {/* Header Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Student Success Stories
            </span>
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="testimonial-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl">
            What Our Students
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}Say About Us
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
            Join thousands of successful learners who transformed their careers with CourseWave
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 p-8 shadow-2xl dark:from-blue-950/20 dark:to-cyan-950/20 sm:p-12">
                {/* Background Pattern */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
                
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                    <Quote className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
                  {/* Testimonial Content */}
                  <div className="lg:col-span-2">
                    <p className="text-lg leading-relaxed text-zinc-700 dark:text-gray-200 sm:text-xl">
                      "{testimonials[activeIndex].comment}"
                    </p>
                    
                    {/* Rating */}
                    <div className="mt-6 flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(testimonials[activeIndex].rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-zinc-600 dark:text-gray-400">
                        {testimonials[activeIndex].rating}
                      </span>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="flex flex-col items-center space-y-4 lg:items-end">
                    <div className="text-center lg:text-right">
                      <h4 className="text-lg font-semibold text-zinc-800 dark:text-white">
                        {testimonials[activeIndex].name}
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        {testimonials[activeIndex].role}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-gray-400">
                        {testimonials[activeIndex].company}
                      </p>
                    </div>
                    
                    <div className="relative">
                      <img
                        src={testimonials[activeIndex].imgUrl}
                        alt={testimonials[activeIndex].name}
                        className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-lg dark:ring-gray-800"
                      />
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute -left-4 top-1/2 flex -translate-y-1/2 space-x-4 lg:-left-8">
            <motion.button
              onClick={prevTestimonial}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-gray-300" />
            </motion.button>
            <motion.button
              onClick={nextTestimonial}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight className="h-5 w-5 text-zinc-600 dark:text-gray-300" />
            </motion.button>
          </div>

          {/* Dots Indicator */}
          <div className="mt-8 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-blue-500 w-8"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>

        {/* Marquee Section */}
        {/* <div className="relative">
          <div className="mb-8 text-center">
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">
              More Success Stories
            </h3>
          </div>
          
          <div className="relative flex h-80 w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 shadow-xl dark:from-gray-900/50 dark:to-blue-950/20 sm:h-96">
            <Marquee pauseOnHover className="[--duration:30s]">
              {firstRow.map((testimonial) => (
                <TestimonialCard key={testimonial.name} {...testimonial} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:25s]">
              {secondRow.map((testimonial) => (
                <TestimonialCard key={testimonial.name} {...testimonial} />
              ))}
            </Marquee>
            
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-gray-50 dark:from-gray-900/50 sm:w-1/3"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-gray-50 dark:from-gray-900/50 sm:w-1/3"></div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

const TestimonialCard = ({ name, role, comment, rating, imgUrl }: any) => {
  return (
    <motion.div
      className="mx-4 w-80 rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start space-x-4">
        <img
          src={imgUrl}
          alt={name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-zinc-800 dark:text-white">{name}</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">{role}</p>
          <div className="mt-2 flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-zinc-600 dark:text-gray-300 line-clamp-3">
        "{comment}"
      </p>
    </motion.div>
  );
};
