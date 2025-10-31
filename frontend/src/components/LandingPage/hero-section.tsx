// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import { IoArrowForward } from "react-icons/io5";
// import { FiChevronDown } from "react-icons/fi";
// import { motion } from "framer-motion";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { Sparkles, Play, Users, Award, Zap } from "lucide-react";
// import { dmSans } from "@/lib/config/fonts";

// gsap.registerPlugin(useGSAP, ScrollTrigger);

// // Pre-calculate particle positions using a deterministic pattern
// const particles = Array.from({ length: 20 }, (_, i) => {
//   const angle = (i / 20) * Math.PI * 2; // Distribute particles in a circular pattern
//   const radius = 40 + (i % 3) * 20; // Vary the radius to create depth
//   const spiralFactor = i * 0.2; // Add a spiral effect

//   return {
//     left: 50 + Math.cos(angle) * radius + spiralFactor,
//     top: 50 + Math.sin(angle) * radius + spiralFactor,
//     delay: (i / 20) * 5, // Evenly distribute delays
//   };
// });

// const HeroSection = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const titleRef = useRef<HTMLHeadingElement>(null);
//   const subtitleRef = useRef<HTMLParagraphElement>(null);
//   const ctaRef = useRef<HTMLDivElement>(null);
//   const gridRef = useRef<HTMLDivElement>(null);
//   const scrollIndicatorRef = useRef<HTMLDivElement>(null);
//   const statsRef = useRef<HTMLDivElement>(null);
//   const [mounted, setMounted] = useState(false);

//   // Only render particles on client side to prevent hydration mismatch
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useGSAP(
//     () => {
//       // Title character animation with enhanced timing
//       gsap.from(".char", {
//         y: 100,
//         opacity: 0,
//         duration: 0.8,
//         ease: "back.out(1.7)",
//         stagger: 0.03,
//         delay: 0.3,
//       });

//       // Subtitle animation
//       gsap.from(subtitleRef.current, {
//         y: 30,
//         opacity: 0,
//         duration: 1,
//         delay: 1.2,
//         ease: "power3.out",
//       });

//       // CTA animation
//       gsap.from(ctaRef.current, {
//         y: 30,
//         opacity: 0,
//         duration: 1,
//         delay: 1.6,
//         ease: "power3.out",
//       });

//       // Stats animation
//       gsap.from(".stat-item", {
//         y: 50,
//         opacity: 0,
//         duration: 0.8,
//         stagger: 0.2,
//         delay: 2,
//         ease: "back.out(1.2)",
//       });

//       // Enhanced grid animation
//       gsap.fromTo(
//         ".grid-line",
//         { opacity: 0, scaleY: 0 },
//         {
//           opacity: 0.1,
//           scaleY: 1,
//           duration: 2,
//           stagger: 0.05,
//           ease: "power3.out",
//           delay: 0.5,
//         }
//       );

//       // Floating elements with more complex animation
//       gsap.to(".floating-shape", {
//         y: "+=30",
//         x: "+=15",
//         rotation: "+=8",
//         duration: 12,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//         stagger: 0.3,
//       });

//       // Pulsing dots with enhanced effect
//       gsap.to(".pulsing-dot", {
//         scale: 1.5,
//         opacity: 0.8,
//         duration: 3,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//         stagger: 0.6,
//       });

//       // Scroll indicator with bounce effect
//       gsap.to(scrollIndicatorRef.current, {
//         y: 15,
//         duration: 2,
//         repeat: -1,
//         yoyo: true,
//         ease: "power2.inOut",
//         delay: 3,
//       });

//       // Background particles animation with deterministic pattern
//       gsap.to(".bg-particle", {
//         y: "-=100",
//         opacity: 0,
//         duration: 8,
//         repeat: -1,
//         ease: "none",
//         stagger: {
//           each: 0.1,
//           from: "random",
//         },
//       });
//     },
//     { scope: containerRef }
//   );

//   const renderAnimatedTitle = (text: string) => {
//     return text.split("").map((char, index) => (
//       <span key={index} className="char inline-block">
//         {char === " " ? "\u00A0" : char}
//       </span>
//     ));
//   };

//   const stats = [
//     { icon: Users, value: "10K+", label: "Active Students" },
//     { icon: Award, value: "200+", label: "Expert Courses" },
//     { icon: Zap, value: "95%", label: "Success Rate" },
//   ];

//   return (
//     <div
//       ref={containerRef}
//       className="relative pt-8 flex min-h-screen w-full items-center justify-center overflow-hidden dark:bg-gradient-to-br dark:from-neutral-950 dark:via-neutral-900 dark:to-black px-4 sm:px-6 lg:px-8"
//     >
//       {/* Background Particles */}
//       {/* <div className="absolute inset-0 overflow-hidden">
//         {mounted &&
//           particles.map((particle, i) => (
//             <div
//               key={i}
//               className="bg-particle absolute h-1 w-1 rounded-full bg-transparent
//               "
//               style={{
//                 left: `${particle.left}%`,
//                 top: `${particle.top}%`,
//                 animationDelay: `${particle.delay}s`,
//               }}
//             />
//           ))}
//       </div> */}

//       {/* Animated grid background */}
//       {/* <div ref={gridRef} className="absolute inset-0 z-0 flex justify-center">
//         <div className="absolute h-full w-full max-w-6xl">
//           {[...Array(20)].map((_, i) => (
//             <div
//               key={i}
//               className="grid-line absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-blue-500/20 to-transparent"
//               style={{ left: `${(i + 1) * 5}%` }}
//             />
//           ))}
//         </div>
//       </div> */}

//       {/* Enhanced floating futuristic shapes */}
//       <div className="absolute inset-0 overflow-hidden opacity-40">
//         <div className="floating-shape absolute left-[10%] top-[15%] h-32 w-32 rounded-full bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 blur-[80px] sm:h-40 sm:w-40" />
//         <div className="floating-shape absolute right-[15%] top-[25%] h-40 w-40 rotate-45 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-[100px] sm:h-48 sm:w-48" />
//         <div className="floating-shape absolute bottom-[20%] left-[20%] h-24 w-24 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-[60px] sm:h-32 sm:w-32" />
//         <div className="floating-shape absolute bottom-[10%] right-[10%] h-36 w-36 rotate-12 bg-gradient-to-r from-amber-500/30 to-orange-500/30 blur-[90px] sm:h-44 sm:w-44" />
//       </div>

//       {/* Enhanced pulsing connection dots */}
//       {/* <div className="absolute inset-0 z-0">
//         {[...Array(12)].map((_, i) => (
//           <div
//             key={i}
//             className="pulsing-dot absolute h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-60"
//             style={{
//               left: `${5 + i * 8}%`,
//               top: `${20 + Math.sin(i) * 30}%`,
//             }}
//           />
//         ))}
//       </div> */}

//       {/* Main Content */}
//       <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
//         {/* Sparkles decoration */}
//         <motion.div
//           className="mb-8 flex items-center justify-center space-x-2"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.5 }}
//         >
//           <Sparkles className="h-5 w-5 text-blue-400" />
//           <span className="text-sm font-medium text-blue-400">
//             Welcome to CourseWave
//           </span>
//           <Sparkles className="h-5 w-5 text-blue-400" />
//         </motion.div>

//         {/* Main Title */}
//         <h1
//           ref={titleRef}
//           className={`${dmSans.className} mb-6 text-4xl font-bold tracking-tighter dark:text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl`}
//         >
//           {renderAnimatedTitle("Master the Future")}
//           <br />
//           <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">
//             {/* {renderAnimatedTitle("of Technology")} */}
//             {"of Technology"}
//           </span>
//         </h1>

//         {/* Subtitle */}
//         <p
//           ref={subtitleRef}
//           className="mx-auto mb-10 max-w-3xl text-base text-md sm:text-lg dark:text-neutral-300"
//         >
//           Join thousands of developers mastering cutting-edge skills with our
//           <span className="text-blue-400 font-semibold">
//             {" "}
//             interactive courses
//           </span>
//           ,
//           <span className="text-cyan-400 font-semibold">
//             {" "}
//             expert mentorship
//           </span>
//           , and
//           <span className="text-purple-400 font-semibold">
//             {" "}
//             vibrant community
//           </span>
//         </p>

//         {/* CTA Section */}
//         <div
//           // ref={ctaRef}
//           className="mb-16 flex flex-col items-center space-y-1 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0"
//         >
//           <motion.button
//             onClick={() => (window.location.href = "/browse")}
//             className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:shadow-blue-500/25"
//             // whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <span>Start Learning Now</span>
//             <IoArrowForward className="hidden group-hover:flex transition-transform group-hover:translate-x-1 group-hover:animate-pulse" />
//             {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 blur transition-opacity group-hover:opacity-20" /> */}
//           </motion.button>

//           {/* <motion.button
//             className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Play className="h-5 w-5" />
//             <span>Watch Demo</span>
//           </motion.button> */}
//         </div>

//         {/* Stats Section */}
//         <div
//           ref={statsRef}
//           className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-16"
//         >
//           {stats.map((stat, index) => (
//             <motion.div
//               key={index}
//               className="stat-item group relative rounded-2xl border border-blue-200 dark:border-white/10 bg-blue-500 group-hover:bg-blue-600 dark:bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 dark:hover:bg-white/10 hover:scale-105"
//               whileHover={{ y: -5 }}
//             >
//               <div className="flex items-center justify-center space-x-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-500/20 dark:to-cyan-500/20">
//                   <stat.icon className="h-6 w-6 text-white dark:text-blue-400 group-hover:text-white dark:group-hover:text-blue-400" />
//                 </div>
//                 <div className="text-left">
//                   <div className="text-2xl font-bold text-white group-hover:text-white dark:text-white dark:group-hover:text-white sm:text-3xl">
//                     {stat.value}
//                   </div>
//                   <div className="text-sm text-neutral-300/60 group-hover:text-white/85 dark:text-neutral-300 dark:group-hover:text-neutral-300 sm:text-base">
//                     {stat.label}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <div className="h-12 w-2"></div>
//       </div>

//       {/* Enhanced scanning line */}
//       <div className="absolute left-0 top-0 z-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500/70 to-transparent opacity-70" />

//       {/* Scroll indicator */}
//       <div
//         ref={scrollIndicatorRef}
//         className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform"
//       >
//         <motion.div
//           className="flex flex-col items-center"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 2.5 }}
//         >
//           <div className="h-8 w-5 rounded-full border-2 border-blue-400  p-1">
//             <div className="h-3 w-1 rounded-full bg-gradient-to-b from-blue-400 to-cyan-400" />
//           </div>
//           <FiChevronDown className="mt-2 text-cyan-400" size={20} />
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;

/// --------------------------------------------------------------------------------------------------------------------

// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import { IoArrowForward } from "react-icons/io5";
// import { FiChevronDown } from "react-icons/fi";
// import { motion } from "framer-motion";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import {
//   Sparkles,
//   Play,
//   Users,
//   Award,
//   Zap,
//   Code,
//   Brain,
//   Rocket,
// } from "lucide-react";
// import { dmSans } from "@/lib/config/fonts";

// gsap.registerPlugin(useGSAP, ScrollTrigger);

// const HeroSection = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const titleRef = useRef<HTMLHeadingElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const floatingIconsRef = useRef<HTMLDivElement>(null);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // 3D Particle System
//   useEffect(() => {
//     if (!mounted || !canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     // Set canvas size
//     const resizeCanvas = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     resizeCanvas();
//     window.addEventListener("resize", resizeCanvas);

//     // Particle system
//     class Particle {
//       x: number;
//       y: number;
//       z: number;
//       vx: number;
//       vy: number;
//       vz: number;
//       size: number;
//       color: string;

//       constructor() {
//         this.x = Math.random() * canvas.width;
//         this.y = Math.random() * canvas.height;
//         this.z = Math.random() * 1000;
//         this.vx = (Math.random() - 0.5) * 2;
//         this.vy = (Math.random() - 0.5) * 2;
//         this.vz = Math.random() * 2 + 1;
//         this.size = Math.random() * 2 + 1;
//         this.color = `hsl(${200 + Math.random() * 60}, 70%, 60%)`;
//       }

//       update() {
//         this.x += this.vx;
//         this.y += this.vy;
//         this.z -= this.vz;

//         if (this.z <= 0) {
//           this.z = 1000;
//           this.x = Math.random() * canvas.width;
//           this.y = Math.random() * canvas.height;
//         }

//         if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
//         if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
//       }

//       draw() {
//         const scale = 1000 / (1000 + this.z);
//         const x2d = this.x * scale;
//         const y2d = this.y * scale;
//         const size2d = this.size * scale;

//         ctx!.save();
//         ctx!.globalAlpha = scale * 0.8;
//         ctx!.fillStyle = this.color;
//         ctx!.beginPath();
//         ctx!.arc(x2d, y2d, size2d, 0, Math.PI * 2);
//         ctx!.fill();

//         // Glow effect
//         ctx!.shadowBlur = 15;
//         ctx!.shadowColor = this.color;
//         ctx!.fill();
//         ctx!.restore();
//       }
//     }

//     const particles = Array.from({ length: 150 }, () => new Particle());

//     const animate = () => {
//       ctx.fillStyle = "rgba(10, 10, 20, 0.1)";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       particles.forEach((particle) => {
//         particle.update();
//         particle.draw();
//       });

//       requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       window.removeEventListener("resize", resizeCanvas);
//     };
//   }, [mounted]);

//   useGSAP(
//     () => {
//       // Magnetic floating icons
//       const icons = gsap.utils.toArray(".floating-icon");

//       icons.forEach((icon: any) => {
//         icon.addEventListener("mousemove", (e: MouseEvent) => {
//           const rect = icon.getBoundingClientRect();
//           const x = e.clientX - rect.left;
//           const y = e.clientY - rect.top;

//           const centerX = rect.width / 2;
//           const centerY = rect.height / 2;

//           const angleX = (y - centerY) / 20;
//           const angleY = (centerX - x) / 20;

//           gsap.to(icon, {
//             rotationX: angleX,
//             rotationY: angleY,
//             transformPerspective: 500,
//             duration: 0.5,
//             ease: "power2.out",
//           });
//         });

//         icon.addEventListener("mouseleave", () => {
//           gsap.to(icon, {
//             rotationX: 0,
//             rotationY: 0,
//             duration: 1,
//             ease: "elastic.out(1, 0.3)",
//           });
//         });
//       });

//       // Title animation with splitting and morphing
//       const chars = gsap.utils.toArray(".char");

//       gsap.from(chars, {
//         duration: 1.5,
//         opacity: 0,
//         scale: 0,
//         y: 100,
//         rotationX: 90,
//         transformOrigin: "0% 50% -50",
//         stagger: 0.03,
//         ease: "back.out(1.7)",
//         delay: 0.5,
//       });

//       // Gradient sweep animation
//       gsap.to(".gradient-sweep", {
//         backgroundPosition: "200% 0%",
//         duration: 3,
//         ease: "sine.inOut",
//         repeat: -1,
//         yoyo: true,
//       });

//       // Orbital animation for floating elements
//       gsap.to(".orbit-1", {
//         rotation: 360,
//         duration: 20,
//         repeat: -1,
//         ease: "none",
//         transformOrigin: "center center",
//       });

//       gsap.to(".orbit-2", {
//         rotation: -360,
//         duration: 25,
//         repeat: -1,
//         ease: "none",
//         transformOrigin: "center center",
//       });

//       // Pulse glow effect
//       gsap.to(".pulse-glow", {
//         scale: 1.1,
//         opacity: 0.8,
//         duration: 2,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//       });

//       // Staggered stats animation
//       gsap.from(".stat-item", {
//         y: 100,
//         opacity: 0,
//         duration: 1,
//         stagger: 0.2,
//         delay: 1.5,
//         ease: "back.out(1.2)",
//         scrollTrigger: {
//           trigger: ".stats-container",
//           start: "top 80%",
//           toggleActions: "play none none reverse",
//         },
//       });
//     },
//     { scope: containerRef }
//   );

//   const renderAnimatedTitle = (text: string) => {
//     return text.split("").map((char, index) => (
//       <span key={index} className="char inline-block transform-style-3d">
//         {char === " " ? "\u00A0" : char}
//       </span>
//     ));
//   };

//   const floatingIcons = [
//     { icon: Code, class: "orbit-1", delay: 0 },
//     { icon: Brain, class: "orbit-2", delay: 0.3 },
//     { icon: Rocket, class: "orbit-1", delay: 0.6 },
//     { icon: Zap, class: "orbit-2", delay: 0.9 },
//   ];

//   const stats = [
//     { icon: Users, value: "10K+", label: "Active Students" },
//     { icon: Award, value: "200+", label: "Expert Courses" },
//     { icon: Zap, value: "95%", label: "Success Rate" },
//   ];

//   return (
//     <div
//       ref={containerRef}
//       className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 px-4 sm:px-6 lg:px-8"
//     >
//       {/* 3D Particle Canvas */}
//       <canvas ref={canvasRef} className="absolute inset-0 z-0" />

//       {/* Animated Grid */}
//       <div className="absolute inset-0 z-1 opacity-20">
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(100,100,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(100,100,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
//       </div>

//       {/* Floating Tech Icons */}
//       <div
//         ref={floatingIconsRef}
//         className="absolute inset-0 z-2 overflow-hidden"
//       >
//         {floatingIcons.map((item, index) => (
//           <motion.div
//             key={index}
//             className={`floating-icon absolute ${item.class} pulse-glow`}
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ delay: item.delay, duration: 1 }}
//             style={{
//               left: `${20 + ((index * 20) % 60)}%`,
//               top: `${30 + ((index * 15) % 40)}%`,
//             }}
//           >
//             <div className="relative">
//               <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 blur-xl opacity-30" />
//               <item.icon className="relative h-8 w-8 text-blue-400 drop-shadow-lg" />
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Central Orbital System */}
//       <div className="absolute left-1/2 top-1/2 z-3 -translate-x-1/2 -translate-y-1/2 transform">
//         <div className="relative h-96 w-96">
//           {/* Orbital Rings */}
//           <div className="absolute inset-0 rounded-full border border-blue-500/20" />
//           <div className="absolute inset-8 rounded-full border border-cyan-500/20" />
//           <div className="absolute inset-16 rounded-full border border-purple-500/20" />

//           {/* Rotating Elements */}
//           <div className="orbit-1 absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 transform">
//             <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg" />
//           </div>
//           <div className="orbit-2 absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 transform">
//             <div className="h-3 w-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg" />
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
//         {/* Animated Badge */}
//         <motion.div
//           className="mt-8 mb-4 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-blue-500/10 px-6 py-3 backdrop-blur-sm"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//         >
//           <Sparkles className="h-4 w-4 text-blue-400" />
//           <span className="text-sm font-medium text-blue-300">
//             Welcome to CourseWave - Future of Learning
//           </span>
//           <div className="h-1 w-1 rounded-full bg-blue-400" />
//         </motion.div>

//         {/* Main Title */}
//         <h1
//           ref={titleRef}
//           className={`${dmSans.className} mb-6  font-bold tracking-tighter text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl`}
//         >
//           <div className="gradient-sweep bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-[length:200%_auto] bg-clip-text text-transparent">
//             {/* {renderAnimatedTitle( */}
//             Master the Future
//             {/* )} */}
//           </div>
//           <div className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
//             <span className="text-white/90">of </span>
//             <span className="gradient-sweep bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-[length:200%_auto] bg-clip-text text-transparent">
//               Technology
//             </span>
//           </div>
//         </h1>

//         {/* Subtitle */}
//         <motion.p
//           className="mx-auto mb-12 max-w-3xl text-lg text-blue-100/80 sm:text-xl md:text-2xl"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 1 }}
//         >
//           Transform your career with{" "}
//           <span className="font-semibold text-cyan-300">
//             immersive learning
//           </span>
//           ,{" "}
//           <span className="font-semibold text-blue-300">expert mentorship</span>
//           , and{" "}
//           <span className="font-semibold text-purple-300">
//             cutting-edge tech
//           </span>
//         </motion.p>

//         {/* CTA Buttons */}
//         <motion.div
//           className="mb-20 flex flex-col items-center justify-center gap-6 sm:flex-row"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 1.2 }}
//         >
//           <motion.button
//             className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-12 py-5 text-xl font-bold text-white shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:shadow-blue-500/50"
//             whileHover={{ scale: 1.05, y: -2 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <span className="relative z-10 flex items-center gap-3">
//               Start Learning Free
//               <IoArrowForward className="transition-transform group-hover:translate-x-1" />
//             </span>
//             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
//             <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 blur transition-all duration-300 group-hover:opacity-70 group-hover:blur-xl" />
//           </motion.button>

//           <motion.button
//             className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 px-12 py-5 text-xl font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
//             whileHover={{ scale: 1.05, y: -2 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <span className="relative z-10 flex items-center gap-3">
//               <Play className="h-5 w-5" />
//               Watch Demo
//             </span>
//             <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
//           </motion.button>
//         </motion.div>

//         {/* Stats Section */}
//       </div>

//       {/* Scroll Indicator */}
//       <motion.div
//         className="absolute bottom-8 mt-4 left-1/2 z-10 -translate-x-1/2 transform"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, delay: 2 }}
//       >
//         <div className="flex flex-col items-center space-y-2">
//           <motion.div
//             className="h-12 w-px bg-gradient-to-b from-blue-400 to-transparent"
//             animate={{ height: [0, 24, 0] }}
//             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//           />
//           <FiChevronDown className="text-cyan-400" size={20} />
//           <span className="text-sm font-medium text-blue-300">
//             Scroll to Explore
//           </span>
//         </div>
//       </motion.div>

//       {/* Interactive Background Elements */}
//       <div className="absolute bottom-10 left-10 z-5">
//         <motion.div
//           className="h-32 w-32 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl"
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.3, 0.6, 0.3],
//           }}
//           transition={{ duration: 4, repeat: Infinity }}
//         />
//       </div>

//       <div className="absolute top-10 right-10 z-5">
//         <motion.div
//           className="h-40 w-40 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
//           animate={{
//             scale: [1.2, 1, 1.2],
//             opacity: [0.4, 0.7, 0.4],
//           }}
//           transition={{ duration: 5, repeat: Infinity }}
//         />
//       </div>
//     </div>
//   );
// };

// export default HeroSection;

/// ====================================================================================

"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Sparkles, ArrowRight, Play, Users, Award, TrendingUp, BookOpen, Zap, Target } from "lucide-react"
import { dmSans } from "@/lib/config/fonts"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.size = Math.random() * 1 + 0.5
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }

      draw() {
        ctx!.save()
        ctx!.globalAlpha = this.opacity
        ctx!.fillStyle = "#06b6d4"
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.restore()
      }
    }

    const particles = Array.from({ length: 40 }, () => new Particle())

    const animate = () => {
      ctx.fillStyle = "rgba(8, 15, 30, 0.02)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [mounted])

  useGSAP(
    () => {
      gsap.from(".hero-badge", {
        duration: 0.8,
        opacity: 0,
        y: 20,
        ease: "power2.out",
      })

      gsap.from(".hero-title", {
        duration: 1.2,
        opacity: 0,
        y: 40,
        ease: "power2.out",
        delay: 0.2,
      })

      gsap.from(".hero-subtitle", {
        duration: 1,
        opacity: 0,
        y: 30,
        ease: "power2.out",
        delay: 0.4,
      })

      gsap.from(".hero-cta", {
        duration: 0.8,
        opacity: 0,
        y: 20,
        ease: "power2.out",
        delay: 0.6,
        stagger: 0.15,
      })

      gsap.from(".bento-item", {
        duration: 0.8,
        opacity: 0,
        y: 20,
        ease: "power2.out",
        delay: 0.8,
        stagger: 0.1,
      })
    },
    { scope: containerRef },
  )

  const stats = [
    { icon: Users, value: "50K+", label: "Active Learners" },
    { icon: Award, value: "500+", label: "Expert Courses" },
    { icon: TrendingUp, value: "98%", label: "Success Rate" },
  ]

  const features = [
    { icon: BookOpen, title: "Expert Courses", description: "Learn from industry leaders" },
    { icon: Zap, title: "Fast Learning", description: "Accelerated skill development" },
    { icon: Target, title: "Goal Oriented", description: "Achieve your career goals" },
  ]

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30" />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto w-full max-w-6xl">
          {/* Header Section */}
          <div className="mb-16 text-center">
            {/* Badge */}
            <motion.div className="hero-badge mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">Welcome to CourseWave</span>
            </motion.div>

            {/* Main Title */}
            <h1 className={`${dmSans.className} hero-title mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-6xl`}>
              <span className="block">Master the</span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Future of Learning
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle mx-auto mb-12 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Transform your career with <span className="font-semibold text-cyan-300">immersive courses</span>, learn
              from <span className="font-semibold text-blue-300">industry experts</span>, and unlock{" "}
              <span className="font-semibold text-teal-300">unlimited potential</span>
            </p>

            {/* CTA Buttons */}
            <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.button
                className="hero-cta group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-10 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/40"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={`${dmSans.className} relative z-10 flex items-center gap-2`}>
                  Start Learning Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>

             

              {/* <motion.button
                className="hero-cta relative overflow-hidden rounded-full border border-slate-600 bg-slate-800/50 px-10 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-slate-500 hover:bg-slate-700/50"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Watch Demo
                </span>
              </motion.button> */}
            </div>
          </div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs font-medium text-slate-400">Scroll to explore</span>
              <motion.div
              animate={{
                y: [0, 8, 0],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              >
              <ArrowRight className="h-6 w-6 text-cyan-400" style={{ transform: 'rotate(90deg)' }} />
              </motion.div>
            </div>

             <div className="h-8 w-2"></div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
