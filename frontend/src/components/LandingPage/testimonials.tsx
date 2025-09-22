// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { Marquee } from "@/components/magicui/marquee";
// import { Star, Quote, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

// gsap.registerPlugin(ScrollTrigger);

// const testimonials = [
//   {
//     imgUrl:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_s8bqkElCOr8R2XL0I4LmiLQexffc-LMRjOaTCAj8ml1UxCXAohpoQ1soZ-GzyQx74l4&usqp=CAU",
//     name: "Josh Mayer",
//     role: "Full Stack Developer",
//     courseName: "Complete Flutter Dev Bootcamp",
//     comment:
//       "CourseWave transformed my career! The hands-on projects and expert guidance helped me land my dream job. The community support is incredible.",
//     rating: 5.0,
//     company: "TechCorp Inc."
//   },
//   {
//     imgUrl:
//       "https://i.pinimg.com/originals/c6/9d/d2/c69dd2fd36d5797c9472c738ddce44de.jpg",
//     name: "Ankit Sharma",
//     role: "Backend Engineer",
//     courseName: "Backend Pro Master Class",
//     comment:
//       "The Backend Pro course exceeded my expectations. Real-world projects and industry best practices made all the difference in my learning journey.",
//     rating: 4.8,
//     company: "StartupXYZ"
//   },
//   {
//     imgUrl:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScODbPIbdc7AAY2QzQApgWsCzbJ3saUiN-Nm5unofg_beDzFe350o0vHNApy9e17rjXPE&usqp=CAU",
//     name: "Rohan Singh",
//     role: "Mobile Developer",
//     courseName: "Complete Flutter Dev Bootcamp",
//     comment:
//       "From beginner to confident developer in just 6 months! The structured learning path and mentorship sessions were game-changers for me.",
//     rating: 4.9,
//     company: "MobileFirst"
//   },
//   {
//     imgUrl:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6CbDUHMuQk6ZTbcsRN-57V702yP6Mxml3Qt2uw2VrjoEKVUuWTU3ezIQkZCGQmvH8zKY&usqp=CAU",
//     name: "Emily Johnson",
//     role: "Frontend Developer",
//     courseName: "React Mastery Workshop",
//     comment:
//       "The React Mastery Workshop helped me become confident in my coding skills and build complex projects on my own. Highly recommended!",
//     rating: 4.8,
//     company: "WebSolutions"
//   },
//   {
//     imgUrl:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS33gDUfkosbpLY1RMMT4jY-Mn9G1jnQdJVZUEZQXy667t30R7zIqbUqMVNadwmbTjt3RU&usqp=CAU",
//     name: "Michael Brown",
//     role: "JavaScript Developer",
//     courseName: "Advanced JavaScript Concepts",
//     comment:
//       "The Advanced JavaScript Concepts course deepened my understanding and opened new opportunities for me. The instructors are world-class!",
//     rating: 4.7,
//     company: "CodeCraft"
//   },
//   {
//     imgUrl:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGyvcL6it2Zsouur1sq5IB3_MavZ6iPIBYr844inDGcpYTbzEuYtkRuV2E_C9pgEnv0nY&usqp=CAU",
//     name: "Sarah Lee",
//     role: "UI/UX Designer",
//     courseName: "UI/UX Design Bootcamp",
//     comment:
//       "The UI/UX Design Bootcamp was comprehensive and well-structured. I learned so much about user-centered design and landed a great role!",
//     rating: 4.6,
//     company: "DesignStudio"
//   },
//   {
//     imgUrl:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBUVZ8MppkoZug3d6F52h_p-ltXs6vrxzW7ZMtkCoHCBsfusZC0z6XIccFxjcsVb2W14c&usqp=CAU",
//     name: "Daniel Wilson",
//     role: "Full Stack Developer",
//     courseName: "Full Stack Web Development",
//     comment:
//       "The Full Stack Web Development course provided me with the skills and confidence to pursue a career in web development. Amazing experience!",
//     rating: 4.8,
//     company: "DevHub"
//   },
//   {
//     imgUrl:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmVS6e03glA_m8NOjIimdmDONI10IWmJ892fANCbk_-e432jV8yjO2yoaya40jSHuJwiE&usqp=CAU",
//     name: "Sophia Martinez",
//     role: "Data Scientist",
//     courseName: "Data Science with Python",
//     comment:
//       "Data Science with Python was an eye-opener. The hands-on projects were particularly helpful and the community support is outstanding.",
//     rating: 4.9,
//     company: "DataFlow"
//   },
// ];

// export default function Testimonials() {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   const firstRow = testimonials.slice(0, Math.floor(testimonials.length / 2));
//   const secondRow = testimonials.slice(Math.floor(testimonials.length / 2));

//   useEffect(() => {
//     if (!sectionRef.current) return;

//     // Animate section title
//     gsap.fromTo(
//       ".testimonial-title",
//       { y: 50, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.8,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 80%",
//         },
//       }
//     );

//     // Auto-play testimonials
//     let interval: NodeJS.Timeout;
//     if (isAutoPlaying) {
//       interval = setInterval(() => {
//         setActiveIndex((prev) => (prev + 1) % testimonials.length);
//       }, 5000);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [isAutoPlaying]);

//   const nextTestimonial = () => {
//     setActiveIndex((prev) => (prev + 1) % testimonials.length);
//     setIsAutoPlaying(false);
//   };

//   const prevTestimonial = () => {
//     setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
//     setIsAutoPlaying(false);
//   };

//   return (
//     <div ref={sectionRef} className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
//       <div className="flex flex-col space-y-16">
//         {/* Header Section */}
//         <motion.div
//           className="text-center"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//         >
//           <div className="mb-4 flex items-center justify-center space-x-2">
//             <Sparkles className="h-6 w-6 text-blue-500" />
//             <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
//               Student Success Stories
//             </span>
//             <Sparkles className="h-6 w-6 text-blue-500" />
//           </div>
//           <h2 className="testimonial-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl">
//             What Our Students
//             <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//               {" "}Say About Us
//             </span>
//           </h2>
//           <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
//             Join thousands of successful learners who transformed their careers with CourseWave
//           </p>
//         </motion.div>

//         {/* Featured Testimonial */}
//         <div className="relative">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeIndex}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//               className="relative"
//             >
//               <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 p-8 shadow-2xl dark:from-blue-950/20 dark:to-cyan-950/20 sm:p-12">
//                 {/* Background Pattern */}
//                 <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />

//                 {/* Quote Icon */}
//                 <div className="absolute -top-4 left-8">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
//                     <Quote className="h-6 w-6 text-white" />
//                   </div>
//                 </div>

//                 <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
//                   {/* Testimonial Content */}
//                   <div className="lg:col-span-2">
//                     <p className="text-lg leading-relaxed text-zinc-700 dark:text-gray-200 sm:text-xl">
//                       "{testimonials[activeIndex].comment}"
//                     </p>

//                     {/* Rating */}
//                     <div className="mt-6 flex items-center space-x-1">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`h-5 w-5 ${
//                             i < Math.floor(testimonials[activeIndex].rating)
//                               ? "fill-yellow-400 text-yellow-400"
//                               : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                       <span className="ml-2 text-sm font-medium text-zinc-600 dark:text-gray-400">
//                         {testimonials[activeIndex].rating}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Author Info */}
//                   <div className="flex flex-col items-center space-y-4 lg:items-end">
//                     <div className="text-center lg:text-right">
//                       <h4 className="text-lg font-semibold text-zinc-800 dark:text-white">
//                         {testimonials[activeIndex].name}
//                       </h4>
//                       <p className="text-sm text-blue-600 dark:text-blue-400">
//                         {testimonials[activeIndex].role}
//                       </p>
//                       <p className="text-xs text-zinc-600 dark:text-gray-400">
//                         {testimonials[activeIndex].company}
//                       </p>
//                     </div>

//                     <div className="relative">
//                       <img
//                         src={testimonials[activeIndex].imgUrl}
//                         alt={testimonials[activeIndex].name}
//                         className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-lg dark:ring-gray-800"
//                       />
//                       <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </AnimatePresence>

//           {/* Navigation Arrows */}
//           <div className="absolute -left-4 top-1/2 flex -translate-y-1/2 space-x-4 lg:-left-8">
//             <motion.button
//               onClick={prevTestimonial}
//               className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-gray-300" />
//             </motion.button>
//             <motion.button
//               onClick={nextTestimonial}
//               className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <ArrowRight className="h-5 w-5 text-zinc-600 dark:text-gray-300" />
//             </motion.button>
//           </div>

//           {/* Dots Indicator */}
//           <div className="mt-8 flex justify-center space-x-2">
//             {testimonials.map((_, index) => (
//               <motion.button
//                 key={index}
//                 onClick={() => {
//                   setActiveIndex(index);
//                   setIsAutoPlaying(false);
//                 }}
//                 className={`h-2 w-2 rounded-full transition-all duration-300 ${
//                   index === activeIndex
//                     ? "bg-blue-500 w-8"
//                     : "bg-gray-300 dark:bg-gray-600"
//                 }`}
//                 whileHover={{ scale: 1.2 }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Marquee Section */}
//         {/* <div className="relative">
//           <div className="mb-8 text-center">
//             <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">
//               More Success Stories
//             </h3>
//           </div>

//           <div className="relative flex h-80 w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 shadow-xl dark:from-gray-900/50 dark:to-blue-950/20 sm:h-96">
//             <Marquee pauseOnHover className="[--duration:30s]">
//               {firstRow.map((testimonial) => (
//                 <TestimonialCard key={testimonial.name} {...testimonial} />
//               ))}
//             </Marquee>
//             <Marquee reverse pauseOnHover className="[--duration:25s]">
//               {secondRow.map((testimonial) => (
//                 <TestimonialCard key={testimonial.name} {...testimonial} />
//               ))}
//             </Marquee>

//             <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-gray-50 dark:from-gray-900/50 sm:w-1/3"></div>
//             <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-gray-50 dark:from-gray-900/50 sm:w-1/3"></div>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// }

// const TestimonialCard = ({ name, role, comment, rating, imgUrl }: any) => {
//   return (
//     <motion.div
//       className="mx-4 w-80 rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
//       whileHover={{ y: -5, scale: 1.02 }}
//       transition={{ duration: 0.2 }}
//     >
//       <div className="flex items-start space-x-4">
//         <img
//           src={imgUrl}
//           alt={name}
//           className="h-12 w-12 rounded-full object-cover"
//         />
//         <div className="flex-1">
//           <h4 className="font-semibold text-zinc-800 dark:text-white">{name}</h4>
//           <p className="text-sm text-blue-600 dark:text-blue-400">{role}</p>
//           <div className="mt-2 flex items-center space-x-1">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 className={`h-3 w-3 ${
//                   i < Math.floor(rating)
//                     ? "fill-yellow-400 text-yellow-400"
//                     : "text-gray-300"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//       <p className="mt-4 text-sm text-zinc-600 dark:text-gray-300 line-clamp-3">
//         "{comment}"
//       </p>
//     </motion.div>
//   );
// };

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
} from "lucide-react";

const testimonials = [
  {
    imgUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    name: "Josh Mayer",
    role: "Full Stack Developer",
    courseName: "Complete Flutter Dev Bootcamp",
    comment:
      "CourseWave transformed my career completely! The hands-on projects and expert guidance helped me land my dream job at a top tech company. The community support is absolutely incredible.",
    rating: 5.0,
    company: "TechCorp Inc.",
    verified: true,
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    name: "Ankit Sharma",
    role: "Backend Engineer",
    courseName: "Backend Pro Master Class",
    comment:
      "The Backend Pro course exceeded all my expectations. Real-world projects and industry best practices made all the difference in my learning journey. Now I'm confident in building scalable systems.",
    rating: 4.8,
    company: "StartupXYZ",
    verified: true,
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    name: "Rohan Singh",
    role: "Mobile Developer",
    courseName: "Complete Flutter Dev Bootcamp",
    comment:
      "From complete beginner to confident developer in just 6 months! The structured learning path and personalized mentorship sessions were absolute game-changers for my career.",
    rating: 4.9,
    company: "MobileFirst",
    verified: true,
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b372?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    name: "Emily Johnson",
    role: "Frontend Developer",
    courseName: "React Mastery Workshop",
    comment:
      "The React Mastery Workshop helped me become incredibly confident in my coding skills and build complex, production-ready projects independently. Highly recommended for anyone serious about frontend development!",
    rating: 4.8,
    company: "WebSolutions",
    verified: true,
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    name: "Michael Brown",
    role: "JavaScript Developer",
    courseName: "Advanced JavaScript Concepts",
    comment:
      "The Advanced JavaScript Concepts course deepened my understanding of the language fundamentals and opened countless new opportunities. The instructors are truly world-class professionals!",
    rating: 4.7,
    company: "CodeCraft",
    verified: true,
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    name: "Sarah Lee",
    role: "UI/UX Designer",
    courseName: "UI/UX Design Bootcamp",
    comment:
      "The UI/UX Design Bootcamp was comprehensive and perfectly structured. I learned so much about user-centered design principles and landed an amazing role at my dream company!",
    rating: 4.6,
    company: "DesignStudio",
    verified: true,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused]);

  // Navigation functions
  const nextTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  }, []);

  const prevTestimonial = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  }, []);

  const goToTestimonial = useCallback((index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
  }, []);

  // Touch handlers for mobile swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextTestimonial();
    } else if (isRightSwipe) {
      prevTestimonial();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevTestimonial();
      } else if (e.key === "ArrowRight") {
        nextTestimonial();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPaused(!isPaused);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nextTestimonial, prevTestimonial, isPaused]);

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-transparent overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-100 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-100 dark:bg-cyan-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center space-x-2 mb-4 sm:mb-6">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-400" />
            <span className="text-sm sm:text-base font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">
              Student Success Stories
            </span>
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            What Our Students
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-600 bg-clip-text text-transparent">
              Say About Us
            </span>
          </h2>

          <p className="mx-auto max-w-2xl lg:max-w-3xl text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Join thousands of successful learners who transformed their careers
            with our AI-powered learning platform
          </p>
        </motion.div>

        {/* Main Testimonial Card */}
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="relative rounded-3xl bg-white dark:bg-zinc-950 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30 dark:from-blue-900/20 dark:via-gray-800 dark:to-cyan-900/10" />

                {/* Quote decoration */}
                <div className="absolute  top-6 left-6 sm:left-8 z-10">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                    <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>

                <div className="relative p-6 ">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                    {/* Testimonial Content */}
                    <div className="lg:col-span-8 order-2 lg:order-1 pt-16">
                      <blockquote className="text-md sm:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 font-medium">
                        "{currentTestimonial.comment}"
                      </blockquote>

                      {/* Course badge */}
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                        {currentTestimonial.courseName}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(currentTestimonial.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {currentTestimonial.rating}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          out of 5
                        </span>
                      </div>
                    </div>

                    {/* Author Info */}
                    <div className="lg:col-span-4 order-1 lg:order-2">
                      <div className="flex flex-col items-center text-center space-y-4">
                        {/* Profile Image */}
                        <div className="relative">
                          <div className="relative">
                            <img
                              src={currentTestimonial.imgUrl}
                              alt={`${currentTestimonial.name} - ${currentTestimonial.role}`}
                              className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-full object-cover shadow-lg ring-4 ring-white dark:ring-gray-800"
                              loading="lazy"
                            />
                            {currentTestimonial.verified && (
                              <div className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-7 sm:w-7 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Author Details */}
                        <div className="space-y-1">
                          <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            {currentTestimonial.name}
                          </h4>
                          <p className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-medium">
                            {currentTestimonial.role}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {currentTestimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-8 sm:mt-10 lg:mt-12 space-x-4">
            {/* Previous Button */}
            <motion.button
              onClick={prevTestimonial}
              className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-300" />
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex items-center justify-center space-x-3 px-4 py-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:ring-offset-1 dark:focus:ring-offset-gray-900 ${
                    index === activeIndex
                      ? "bg-blue-600 w-6"
                      : "bg-gray-300/80 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                  }`}
                  whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              onClick={nextTestimonial}
              className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-300" />
            </motion.button>

            {/* Play/Pause Button */}
            <motion.button
              onClick={() => {
                setIsPaused(!isPaused);
                setIsAutoPlaying(!isAutoPlaying);
              }}
              className="ml-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused || !isAutoPlaying ? (
                <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />
              ) : (
                <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </motion.button>
          </div>

          {/* Progress bar */}
          <div className="mt-6 sm:mt-8">
            <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((activeIndex + 1) / testimonials.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span>
                {activeIndex + 1} of {testimonials.length}
              </span>
              <span>Student Reviews</span>
            </div>
          </div>
        </div>

        {/* Simple Progress Counter */}
        <motion.div
          className="mt-12 sm:mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-4 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full shadow-sm">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {activeIndex + 1} of {testimonials.length} reviews
            </span>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                4.8 average
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
