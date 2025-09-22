

// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { Sparkles, Play, Users, Award, Globe, Zap } from "lucide-react";

// gsap.registerPlugin(ScrollTrigger);

// const About = () => {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const videoRef = useRef<HTMLDivElement>(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const features = [
//     {
//       icon: Users,
//       title: "Expert Instructors",
//       description:
//         "Learn from industry professionals with years of real-world experience",
//     },
//     {
//       icon: Award,
//       title: "Quality Content",
//       description:
//         "Meticulously crafted courses designed for practical application",
//     },
//     {
//       icon: Globe,
//       title: "Global Community",
//       description: "Connect with developers worldwide and share knowledge",
//     },
//     {
//       icon: Zap,
//       title: "Fast Learning",
//       description: "Accelerated learning paths designed for career growth",
//     },
//   ];

//   useEffect(() => {
//     if (!sectionRef.current) return;

//     gsap.fromTo(
//       ".about-title",
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

//     gsap.fromTo(
//       ".about-content",
//       { y: 60, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.8,
//         stagger: 0.2,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 70%",
//         },
//       }
//     );

//     gsap.fromTo(
//       ".feature-item",
//       { y: 30, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.6,
//         stagger: 0.1,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 60%",
//         },
//       }
//     );
//   }, []);

//   return (
//     <div
//       ref={sectionRef}
//       className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
//     >
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
//               About CourseWave
//             </span>
//             <Sparkles className="h-6 w-6 text-blue-500" />
//           </div>
//           <h2 className="about-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl">
//             Empowering Developers
//             <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//               {" "}
//               Worldwide
//             </span>
//           </h2>
//           <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
//             We're on a mission to democratize tech education and help developers
//             achieve their career dreams
//           </p>
//         </motion.div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
//           {/* Video Section */}
//           <motion.div
//             ref={videoRef}
//             className="about-content relative"
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//           >
//             <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-2 shadow-2xl dark:from-blue-950/20 dark:to-cyan-950/20">
//               <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
//                 {isPlaying ? (
//                   <video
//                     src="https://cdn.pixabay.com/vimeo/26452/hourglass-26452-640.mp4?width=640&hash=4a72f010b5f1f84e38a5f6f39b4b2c621f081e0a"
//                     className="h-full w-full rounded-xl object-cover"
//                     controls
//                     autoPlay
//                   />
//                 ) : (
//                   <>
//                     {/* Play Button Overlay */}
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <button
//                         onClick={() => setIsPlaying(true)}
//                         className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm hover:scale-105 transition"
//                       >
//                         <Play className="h-8 w-8 text-blue-600" />
//                       </button>
//                     </div>

//                     {/* Overlay Stats */}
//                     <div className="absolute bottom-4 left-4 right-4">
//                       <div className="flex items-center justify-between rounded-lg bg-white/90 px-4 py-2 backdrop-blur-sm dark:bg-gray-800/90">
//                         <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                           Watch Our Story
//                         </span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">
//                           2 min
//                         </span>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </motion.div>

//           {/* Content Section */}
//           <motion.div
//             className="about-content space-y-8"
//             initial={{ opacity: 0, x: 30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//           >
//             <div className="space-y-6">
//               <h3 className="text-2xl font-bold text-zinc-800 dark:text-white sm:text-3xl">
//                 Your Gateway to Tech Excellence
//               </h3>

//               <div className="space-y-4 text-lg text-zinc-600 dark:text-gray-300">
//                 <p>
//                   CourseWave is more than just a learning platform—it's a
//                   comprehensive ecosystem designed to accelerate your career in
//                   technology. We believe that quality education should be
//                   accessible to everyone, regardless of their background or
//                   location.
//                 </p>
//                 <p>
//                   Our expert-led courses, hands-on projects, and vibrant
//                   community create the perfect environment for you to master
//                   in-demand skills and build a successful career in tech.
//                 </p>
//               </div>
//             </div>

//             {/* Features Grid */}
//             <div className="grid grid-cols-1 gap-4">
//               {features.map((feature, index) => (
//                 <FeatureCard key={index} {...feature} />
//               ))}
//             </div>

//             {/* Stats */}
//             <div className="flex items-center space-x-6">
//               <div className="flex items-center space-x-2">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
//                   <Users className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <div className="text-xl font-bold text-zinc-800 dark:text-white">
//                     50K+
//                   </div>
//                   <div className="text-sm text-zinc-600 dark:text-gray-400">
//                     Active Learners
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
//                   <Award className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <div className="text-xl font-bold text-zinc-800 dark:text-white">
//                     95%
//                   </div>
//                   <div className="text-sm text-zinc-600 dark:text-gray-400">
//                     Success Rate
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const FeatureCard = ({ icon: Icon, title, description }: any) => {
//   return (
//     <motion.div
//       className="feature-item group relative rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900"
//       whileHover={{ y: -5 }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="flex items-start space-x-3">
//         {/* h-10 w-10  */}
//         <div className="flex items-center p-5 justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
//           <Icon className="h-5 w-5 text-white" />
//         </div>
//         <div>
//           <h4 className="font-semibold text-zinc-800 dark:text-white">
//             {title}
//           </h4>
//           <p className="mt-1 text-sm text-zinc-600 dark:text-gray-300">
//             {description}
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default About;



"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Sparkles, 
  Play, 
  Users, 
  Award, 
  Globe, 
  Zap, 
  BookOpen,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  Star
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const features = [
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from industry professionals with 10+ years of experience at top tech companies",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Award,
      title: "Quality Content",
      description: "Comprehensive courses with hands-on projects, quizzes, and real-world applications",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join 50,000+ developers worldwide. Network, collaborate, and grow together",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Zap,
      title: "Fast Learning",
      description: "Accelerated learning paths with AI-powered recommendations and progress tracking",
      color: "from-orange-500 to-red-600",
    },
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Active Learners", color: "from-blue-500 to-cyan-500" },
    { icon: BookOpen, value: "200+", label: "Expert Courses", color: "from-emerald-500 to-teal-500" },
    { icon: Award, value: "95%", label: "Success Rate", color: "from-purple-500 to-pink-500" },
    { icon: TrendingUp, value: "85%", label: "Career Growth", color: "from-orange-500 to-red-500" },
  ];

  const benefits = [
    "Industry-recognized certifications",
    "24/7 community support",
    "Lifetime access to course materials",
    "Career placement assistance",
    "Mobile and offline learning",
    "Regular content updates"
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header animations
      gsap.fromTo(
        ".about-badge",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".about-title",
        { y: 60, opacity: 0 },
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

      gsap.fromTo(
        ".about-subtitle",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Content animations
      gsap.fromTo(
        ".about-content",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      // Feature cards animation
      gsap.fromTo(
        ".feature-item",
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 75%",
          },
        }
      );

      // Stats animation
      gsap.fromTo(
        ".stat-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stats-grid",
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePlayVideo = () => {
    setIsPlaying(true);
    setVideoLoaded(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-12 sm:space-y-16 lg:space-y-20">
          {/* Header Section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="about-badge mb-4 sm:mb-6 flex items-center justify-center">
              <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 border border-blue-200/50 dark:from-blue-950/50 dark:to-cyan-950/50 dark:border-blue-800/50">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  About CourseWave
                </span>
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <h1
              id="about-heading"
              className="about-title text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl xl:text-6xl"
            >
              Empowering Developers{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h1>

            <p className="about-subtitle mx-auto mt-4 sm:mt-6 max-w-3xl text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Join the global community of developers who are transforming their careers 
              with our comprehensive, industry-aligned learning platform
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-12 lg:gap-16 xl:gap-20 lg:grid-cols-2 lg:items-center">
            {/* Video Section */}
            <motion.div
              ref={videoRef}
              className="about-content order-2 lg:order-1"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative group">
                {/* Main video container */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-2 shadow-2xl dark:from-slate-900 dark:to-slate-800 transition-all duration-500 group-hover:shadow-3xl">
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                    {isPlaying ? (
                      <video
                        src="https://cdn.pixabay.com/vimeo/26452/hourglass-26452-640.mp4?width=640&hash=4a72f010b5f1f84e38a5f6f39b4b2c621f081e0a"
                        className="h-full w-full rounded-xl object-cover"
                        controls
                        autoPlay
                        onLoadedData={() => setVideoLoaded(true)}
                        aria-label="CourseWave introduction video"
                      />
                    ) : (
                      <>
                        {/* Thumbnail/Preview */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20" />
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={handlePlayVideo}
                            className="group/play flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/95 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/50 dark:bg-slate-800/95 dark:hover:bg-slate-800"
                            aria-label="Play CourseWave introduction video"
                          >
                            <Play className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 ml-1 transition-transform group-hover/play:scale-110" />
                          </button>
                        </div>

                        {/* Video Info Overlay */}
                        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                          <div className="flex items-center justify-between rounded-lg bg-white/95 px-3 sm:px-4 py-2 backdrop-blur-sm shadow-lg dark:bg-slate-800/95">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Watch Our Story
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                              <Clock className="h-3 w-3" />
                              <span>3:24</span>
                            </div>
                          </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-4 right-4 flex space-x-1">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="h-2 w-2 rounded-full bg-white/40 animate-pulse"
                              style={{ animationDelay: `${i * 0.3}s` }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Floating achievement badges */}
                <div className="absolute -bottom-4 -left-4 hidden sm:block">
                  <div className="flex items-center space-x-2 rounded-full bg-emerald-500 px-3 py-2 shadow-lg">
                    <Shield className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">Trusted Platform</span>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 hidden sm:block">
                  <div className="flex items-center space-x-2 rounded-full bg-purple-500 px-3 py-2 shadow-lg">
                    <Star className="h-4 w-4 text-white fill-current" />
                    <span className="text-sm font-medium text-white">4.9 Rating</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              className="about-content order-1 lg:order-2 space-y-6 sm:space-y-8"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Main content */}
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl lg:text-4xl leading-tight">
                  Your Gateway to{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Tech Excellence
                  </span>
                </h2>

                <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    CourseWave is more than just a learning platform—it's a comprehensive 
                    ecosystem designed to accelerate your career in technology. We believe 
                    that quality education should be accessible to everyone, regardless of 
                    their background or location.
                  </p>
                  <p>
                    Our expert-led courses, hands-on projects, and vibrant community create 
                    the perfect environment for you to master in-demand skills and build a 
                    successful career in tech.
                  </p>
                </div>
              </div>

              {/* Benefits list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 sm:space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                className="pt-2 sm:pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <button className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
                  <span>Start Learning Today</span>
                  <TrendingUp className="h-4 w-4" />
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            className="features-grid"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
                Why Choose CourseWave?
              </h3>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Experience the difference with our comprehensive learning ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-800 p-6 sm:p-8 shadow-xl">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Trusted by Developers Worldwide
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Join thousands of successful developers who've transformed their careers
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color, index }: any) => {
  return (
    <motion.div
      className="feature-item group relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-transparent dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-transparent">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-blue-950/20 dark:to-purple-950/20" />
        
        <div className="relative flex flex-col space-y-4">
          {/* Icon */}
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {title}
            </h4>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, value, label, color, index }: any) => {
  return (
    <motion.div
      className="stat-item text-center group"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="space-y-2 sm:space-y-3">
        <div className={`mx-auto inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r ${color} shadow-lg transition-transform group-hover:scale-110`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <div className="space-y-1">
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;