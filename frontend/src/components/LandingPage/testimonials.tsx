// "use client";

// import React, { useRef, useEffect, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Star,
//   Quote,
//   Sparkles,
//   ArrowLeft,
//   ArrowRight,
//   Play,
//   Pause,
// } from "lucide-react";
// import { dmSans } from "@/lib/config/fonts";

// const testimonials = [
//   {
//     imgUrl:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
//     name: "Josh Mayer",
//     role: "Full Stack Developer",
//     courseName: "Complete Flutter Dev Bootcamp",
//     comment:
//       "CourseWave transformed my career completely! The hands-on projects and expert guidance helped me land my dream job at a top tech company. The community support is absolutely incredible.",
//     rating: 5.0,
//     company: "TechCorp Inc.",
//     verified: true,
//   },
//   {
//     imgUrl:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
//     name: "Ankit Sharma",
//     role: "Backend Engineer",
//     courseName: "Backend Pro Master Class",
//     comment:
//       "The Backend Pro course exceeded all my expectations. Real-world projects and industry best practices made all the difference in my learning journey. Now I'm confident in building scalable systems.",
//     rating: 4.8,
//     company: "StartupXYZ",
//     verified: true,
//   },
//   {
//     imgUrl:
//       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
//     name: "Rohan Singh",
//     role: "Mobile Developer",
//     courseName: "Complete Flutter Dev Bootcamp",
//     comment:
//       "From complete beginner to confident developer in just 6 months! The structured learning path and personalized mentorship sessions were absolute game-changers for my career.",
//     rating: 4.9,
//     company: "MobileFirst",
//     verified: true,
//   },
//   {
//     imgUrl:
//       "https://images.unsplash.com/photo-1494790108755-2616b612b372?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
//     name: "Emily Johnson",
//     role: "Frontend Developer",
//     courseName: "React Mastery Workshop",
//     comment:
//       "The React Mastery Workshop helped me become incredibly confident in my coding skills and build complex, production-ready projects independently. Highly recommended for anyone serious about frontend development!",
//     rating: 4.8,
//     company: "WebSolutions",
//     verified: true,
//   },
//   {
//     imgUrl:
//       "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
//     name: "Michael Brown",
//     role: "JavaScript Developer",
//     courseName: "Advanced JavaScript Concepts",
//     comment:
//       "The Advanced JavaScript Concepts course deepened my understanding of the language fundamentals and opened countless new opportunities. The instructors are truly world-class professionals!",
//     rating: 4.7,
//     company: "CodeCraft",
//     verified: true,
//   },
//   {
//     imgUrl:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
//     name: "Sarah Lee",
//     role: "UI/UX Designer",
//     courseName: "UI/UX Design Bootcamp",
//     comment:
//       "The UI/UX Design Bootcamp was comprehensive and perfectly structured. I learned so much about user-centered design principles and landed an amazing role at my dream company!",
//     rating: 4.6,
//     company: "DesignStudio",
//     verified: true,
//   },
// ];

// export default function Testimonials() {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//   const [isPaused, setIsPaused] = useState(false);
//   const [touchStart, setTouchStart] = useState<number | null>(null);
//   const [touchEnd, setTouchEnd] = useState<number | null>(null);

//   // Auto-play functionality
//   useEffect(() => {
//     if (!isAutoPlaying || isPaused) return;

//     const interval = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % testimonials.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [isAutoPlaying, isPaused]);

//   // Navigation functions
//   const nextTestimonial = useCallback(() => {
//     setActiveIndex((prev) => (prev + 1) % testimonials.length);
//     setIsAutoPlaying(false);
//   }, []);

//   const prevTestimonial = useCallback(() => {
//     setActiveIndex(
//       (prev) => (prev - 1 + testimonials.length) % testimonials.length
//     );
//     setIsAutoPlaying(false);
//   }, []);

//   const goToTestimonial = useCallback((index: number) => {
//     setActiveIndex(index);
//     setIsAutoPlaying(false);
//   }, []);

//   // Touch handlers for mobile swipe
//   const minSwipeDistance = 50;

//   const onTouchStart = (e: React.TouchEvent) => {
//     setTouchEnd(null);
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const onTouchMove = (e: React.TouchEvent) => {
//     setTouchEnd(e.targetTouches[0].clientX);
//   };

//   const onTouchEnd = () => {
//     if (!touchStart || !touchEnd) return;

//     const distance = touchStart - touchEnd;
//     const isLeftSwipe = distance > minSwipeDistance;
//     const isRightSwipe = distance < -minSwipeDistance;

//     if (isLeftSwipe) {
//       nextTestimonial();
//     } else if (isRightSwipe) {
//       prevTestimonial();
//     }
//   };

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if (e.key === "ArrowLeft") {
//         prevTestimonial();
//       } else if (e.key === "ArrowRight") {
//         nextTestimonial();
//       } else if (e.key === " ") {
//         e.preventDefault();
//         setIsPaused(!isPaused);
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, [nextTestimonial, prevTestimonial, isPaused]);

//   const currentTestimonial = testimonials[activeIndex];

//   return (
//     <section
//       ref={sectionRef}
//       className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-transparent overflow-hidden"
//       onMouseEnter={() => setIsPaused(true)}
//       onMouseLeave={() => setIsPaused(false)}
//     >
//       {/* Background decorations */}
//       <div className="absolute inset-0">
//         <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-100 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
//         <div
//           className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-100 dark:bg-cyan-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"
//           style={{ animationDelay: "2s" }}
//         />
//       </div>

//       <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <motion.div
//           className="text-center mb-12 sm:mb-16 lg:mb-20"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//         >
//           <div className="inline-flex items-center justify-center space-x-2 mb-4 sm:mb-6">
//             <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-400" />
//             <span className="text-sm sm:text-base font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">
//               Student Success Stories
//             </span>
//             <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-400" />
//           </div>

//           <h2 className={`${dmSans.className} text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6`}>
//             What Our Students
//             <br className="hidden sm:block" />
//             <span className="bg-gradient-to-r tracking-tighter from-blue-600 via-cyan-600 to-blue-800 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-600 bg-clip-text text-transparent">
//               Say About Us
//             </span>
//           </h2>

//           <p className="mx-auto max-w-2xl lg:max-w-3xl text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
//             Join thousands of successful learners who transformed their careers
//             with our AI-powered learning platform
//           </p>
//         </motion.div>

//         {/* Main Testimonial Card */}
//         <div className="relative max-w-5xl mx-auto">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeIndex}
//               initial={{ opacity: 0, y: 20, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -20, scale: 0.95 }}
//               transition={{ duration: 0.6, ease: "easeInOut" }}
//               className="relative"
//               onTouchStart={onTouchStart}
//               onTouchMove={onTouchMove}
//               onTouchEnd={onTouchEnd}
//             >
//               <div className="relative rounded-3xl bg-white dark:bg-zinc-950 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
//                 {/* Background gradient */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30 dark:from-blue-900/20 dark:via-gray-800 dark:to-cyan-900/10" />

//                 {/* Quote decoration */}
//                 <div className="absolute  top-6 left-6 sm:left-8 z-10">
//                   <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
//                     <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
//                   </div>
//                 </div>

//                 <div className="relative p-6 ">
//                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
//                     {/* Testimonial Content */}
//                     <div className="lg:col-span-8 order-2 lg:order-1 pt-16">
//                       <blockquote className="text-md sm:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 font-medium">
//                         "{currentTestimonial.comment}"
//                       </blockquote>

//                       {/* Course badge */}
//                       <div className={`${dmSans.className} inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4`}>
//                         {currentTestimonial.courseName}
//                       </div>

//                       {/* Rating */}
//                       <div className="flex items-center space-x-2 mb-4">
//                         <div className="flex items-center space-x-1">
//                           {[...Array(5)].map((_, i) => (
//                             <Star
//                               key={i}
//                               className={`h-5 w-5 ${
//                                 i < Math.floor(currentTestimonial.rating)
//                                   ? "fill-yellow-400 text-yellow-400"
//                                   : "text-gray-300 dark:text-gray-600"
//                               }`}
//                             />
//                           ))}
//                         </div>
//                         <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                           {currentTestimonial.rating}
//                         </span>
//                         <span className="text-sm text-gray-500 dark:text-gray-400">
//                           out of 5
//                         </span>
//                       </div>
//                     </div>

//                     {/* Author Info */}
//                     <div className="lg:col-span-4 order-1 lg:order-2">
//                       <div className="flex flex-col items-center text-center space-y-4">
//                         {/* Profile Image */}
//                         <div className="relative">
//                           <div className="relative">
//                             <img
//                               src={currentTestimonial.imgUrl}
//                               alt={`${currentTestimonial.name} - ${currentTestimonial.role}`}
//                               className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-full object-cover shadow-lg ring-4 ring-white dark:ring-gray-800"
//                               loading="lazy"
//                             />
//                             {currentTestimonial.verified && (
//                               <div className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-7 sm:w-7 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
//                                 <svg
//                                   className="w-3 h-3 sm:w-4 sm:h-4 text-white"
//                                   fill="currentColor"
//                                   viewBox="0 0 20 20"
//                                 >
//                                   <path
//                                     fillRule="evenodd"
//                                     d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                     clipRule="evenodd"
//                                   />
//                                 </svg>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {/* Author Details */}
//                         <div className="space-y-1">
//                           <h4 className={`${dmSans.className} text-lg sm:text-2xl font-bold text-gray-900 dark:text-white`}>
//                             {currentTestimonial.name}
//                           </h4>
//                           <p className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-medium">
//                             {currentTestimonial.role}
//                           </p>
//                           <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
//                             {currentTestimonial.company}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </AnimatePresence>

//           {/* Navigation Controls */}
//           <div className="flex items-center justify-center mt-8 sm:mt-10 lg:mt-12 space-x-4">
//             {/* Previous Button */}
//             <motion.button
//               onClick={prevTestimonial}
//               className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               aria-label="Previous testimonial"
//             >
//               <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-300" />
//             </motion.button>

//             {/* Dots Indicator */}
//             <div className="flex items-center justify-center space-x-3 px-4 py-2">
//               {testimonials.map((_, index) => (
//                 <motion.button
//                   key={index}
//                   onClick={() => goToTestimonial(index)}
//                   className={`h-2 w-2 rounded-full transition-all duration-300 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:ring-offset-1 dark:focus:ring-offset-gray-900 ${
//                     index === activeIndex
//                       ? "bg-blue-600 w-6"
//                       : "bg-gray-300/80 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
//                   }`}
//                   whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
//                   whileTap={{ scale: 0.95 }}
//                   aria-label={`Go to testimonial ${index + 1}`}
//                 />
//               ))}
//             </div>

//             {/* Next Button */}
//             <motion.button
//               onClick={nextTestimonial}
//               className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               aria-label="Next testimonial"
//             >
//               <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-300" />
//             </motion.button>

//             {/* Play/Pause Button */}
//             <motion.button
//               onClick={() => {
//                 setIsPaused(!isPaused);
//                 setIsAutoPlaying(!isAutoPlaying);
//               }}
//               className="ml-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
//             >
//               {isPaused || !isAutoPlaying ? (
//                 <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />
//               ) : (
//                 <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
//               )}
//             </motion.button>
//           </div>

//           {/* Progress bar */}
//           <div className="mt-6 sm:mt-8">
//             <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//               <motion.div
//                 className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
//                 initial={{ width: "0%" }}
//                 animate={{
//                   width: `${((activeIndex + 1) / testimonials.length) * 100}%`,
//                 }}
//                 transition={{ duration: 0.5, ease: "easeInOut" }}
//               />
//             </div>
//             <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
//               <span>
//                 {activeIndex + 1} of {testimonials.length}
//               </span>
//               <span>Student Reviews</span>
//             </div>
//           </div>
//         </div>

//         {/* Simple Progress Counter */}
//         <motion.div
//           className="mt-12 sm:mt-16 text-center"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           viewport={{ once: true }}
//         >
//           <div className="inline-flex items-center space-x-4 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full shadow-sm">
//             <span className="text-sm text-gray-600 dark:text-gray-300">
//               {activeIndex + 1} of {testimonials.length} reviews
//             </span>
//             <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
//             <div className="flex items-center space-x-1">
//               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 4.8 average
//               </span>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

/// =========================================================================================

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
import { dmSans } from "@/lib/config/fonts";
import { usePlatformTestimonails } from "@/hooks/usePlatformStats";

// Fallback images in case user doesn't have profile image
const fallbackImages = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1494790108755-2616b612b372?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Use the reviews hook
  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
  } = usePlatformTestimonails(6);

  // Transform reviews to match the component's expected format
  const testimonials = reviews.map((review, index) => ({
    id: review.id,
    imgUrl:
      review.user.profileImageUrl ||
      fallbackImages[index % fallbackImages.length],
    name: review.user.name,
    role: "Student", // You might want to store user roles in your schema
    courseName: review.course.title,
    comment: review.comment,
    rating: review.rating,
    company: "CourseWave Alumni",
    verified: true,
    createdAt: review.createdAt,
  }));

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isPaused || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, testimonials.length]);

  // Navigation functions
  const nextTestimonial = useCallback(() => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    if (testimonials.length === 0) return;
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  }, [testimonials.length]);

  const goToTestimonial = useCallback(
    (index: number) => {
      if (testimonials.length === 0) return;
      setActiveIndex(index);
      setIsAutoPlaying(false);
    },
    [testimonials.length]
  );

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
    if (!touchStart || !touchEnd || testimonials.length === 0) return;

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
      if (testimonials.length === 0) return;

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
  }, [nextTestimonial, prevTestimonial, isPaused, testimonials.length]);

  // Calculate average rating
  const averageRating =
    testimonials.length > 0
      ? testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0) /
        testimonials.length
      : 4.8;

  const currentTestimonial = testimonials[activeIndex];

  // Loading state
  if (isLoading) {
    return (
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-transparent overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
          </div>

          {/* Testimonial Card Skeleton */}
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-transparent overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h3 className="text-red-800 font-medium text-lg mb-2">
                Failed to load testimonials
              </h3>
              <p className="text-red-600 text-sm">
                {error?.message || "Please try refreshing the page"}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (testimonials.length === 0) {
    return (
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-transparent overflow-hidden">
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

            <h2
              className={`${dmSans.className} text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6`}
            >
              What Our Students
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r tracking-tighter from-blue-600 via-cyan-600 to-blue-800 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-600 bg-clip-text text-transparent">
                Say About Us
              </span>
            </h2>

            <p className="mx-auto max-w-2xl lg:max-w-3xl text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Join thousands of successful learners who transformed their
              careers with our AI-powered learning platform
            </p>
          </motion.div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No testimonials available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

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

          <h2
            className={`${dmSans.className} text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6`}
          >
            What Our Students
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r tracking-tighter from-blue-600 via-cyan-600 to-blue-800 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-600 bg-clip-text text-transparent">
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
                <div className="absolute top-6 left-6 sm:left-8 z-10">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                    <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>

                <div className="relative p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                    {/* Testimonial Content */}
                    <div className="lg:col-span-8 order-2 lg:order-1 pt-16">
                      <blockquote className="text-md sm:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 font-medium">
                        "{currentTestimonial.comment}"
                      </blockquote>

                      {/* Course badge */}
                      <div
                        className={`${dmSans.className} inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4`}
                      >
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
                          <h4
                            className={`${dmSans.className} text-lg sm:text-2xl font-bold text-gray-900 dark:text-white`}
                          >
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
                {averageRating.toFixed(1)} average
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
