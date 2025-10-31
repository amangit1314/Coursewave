// "use client";

// import React, { useRef, useEffect } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import {
//   ArrowRight,
//   Sparkles,
//   Target,
//   TrendingUp,
//   Users,
//   Award,
//   CheckCircle,
//   Zap,
//   Globe,
// } from "lucide-react";
// import { dmSans } from "@/lib/config/fonts";

// gsap.registerPlugin(ScrollTrigger);

// const AchieveCodingGoals = () => {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const cardsRef = useRef<HTMLDivElement>(null);

//   const goals = [
//     {
//       icon: Target,
//       title: "Set Clear Goals",
//       description:
//         "Define your learning objectives and create a personalized roadmap to achieve them",
//       features: [
//         "Personalized Learning Path",
//         "Progress Tracking",
//         "Milestone Setting",
//       ],
//       gradient: "from-blue-500 to-cyan-500",
//       bgGradient: "from-blue-50 to-cyan-50",
//       darkBgGradient: "from-blue-950/20 to-cyan-950/20",
//     },
//     {
//       icon: TrendingUp,
//       title: "Track Progress",
//       description:
//         "Monitor your advancement with detailed analytics and performance insights",
//       features: [
//         "Real-time Analytics",
//         "Skill Assessment",
//         "Performance Reports",
//       ],
//       gradient: "from-emerald-500 to-teal-500",
//       bgGradient: "from-emerald-50 to-teal-50",
//       darkBgGradient: "from-emerald-950/20 to-teal-950/20",
//     },
//     // {
//     //   icon: Users,
//     //   title: "Join Community",
//     //   description:
//     //     "Connect with fellow developers and learn from their experiences",
//     //   features: ["Peer Learning", "Code Reviews", "Collaboration"],
//     //   gradient: "from-purple-500 to-pink-500",
//     //   bgGradient: "from-purple-50 to-pink-50",
//     //   darkBgGradient: "from-purple-950/20 to-pink-950/20",
//     // },
//     {
//       icon: Award,
//       title: "Earn Certificates",
//       description:
//         "Get recognized for your achievements with industry-standard certifications",
//       features: [
//         "Verified Certificates",
//         "Portfolio Building",
//         "Career Recognition",
//       ],
//       gradient: "from-orange-500 to-red-500",
//       bgGradient: "from-orange-50 to-red-50",
//       darkBgGradient: "from-orange-950/20 to-red-950/20",
//     },
//   ];

//   const benefits = [
//     "Learn at your own pace with flexible scheduling",
//     "Access to expert instructors and industry professionals",
//     "Hands-on projects and real-world applications",
//     "Lifetime access to course materials and updates",
//     "24/7 community support and mentorship",
//     "Career guidance and job placement assistance",
//   ];

//   useEffect(() => {
//     if (!sectionRef.current) return;

//     // Animate section title
//     gsap.fromTo(
//       ".goals-title",
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

//     // Animate cards with stagger
//     gsap.fromTo(
//       ".goal-card",
//       { y: 60, opacity: 0, scale: 0.9 },
//       {
//         y: 0,
//         opacity: 1,
//         scale: 1,
//         duration: 0.6,
//         stagger: 0.2,
//         ease: "back.out(1.2)",
//         scrollTrigger: {
//           trigger: cardsRef.current,
//           start: "top 70%",
//         },
//       }
//     );

//     // Animate benefits list
//     gsap.fromTo(
//       ".benefit-item",
//       { x: -30, opacity: 0 },
//       {
//         x: 0,
//         opacity: 1,
//         duration: 0.5,
//         stagger: 0.1,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 70%",
//         },
//       }
//     );

//     // Floating animation for icons
//     gsap.to(".floating-goal-icon", {
//       scale: 1.1,
//       opacity: 0.7,
//       duration: 1.5,
//       repeat: -1,
//       yoyo: true,
//       ease: "sine.inOut",
//     });
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
//               Your Success Journey
//             </span>
//             <Sparkles className="h-6 w-6 text-blue-500" />
//           </div>
//           <h2
//             className={`${dmSans.className} goals-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl`}
//           >
//             Achieve Your
//             <span className="bg-gradient-to-r tracking-tighter from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//               {" "}
//               Coding Goals
//             </span>
//           </h2>
//           <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
//             Transform your career with our proven learning methodology and
//             comprehensive support system
//           </p>
//         </motion.div>

//         {/* Goals Grid */}
//         <div
//           ref={cardsRef}
//           className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
//         >
//           {goals.map((goal, index) => (
//             <GoalCard key={index} {...goal} index={index} />
//           ))}
//         </div>

//         {/* Benefits Section */}
//         <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
//           {/* Benefits List */}
//           <motion.div
//             className="space-y-7 px-1 sm:px-2"
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//             viewport={{ once: true, margin: "-50px" }}
//           >
//             <h3
//               className={`${dmSans.className} text-2xl font-bold text-zinc-800 dark:text-white sm:text-3xl md:text-4xl`}
//             >
//               {/* Why Choose{" "}
//               <span className="bg-gradient-to-r tracking-tighter from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//                 Coursewave
//               </span> */}
//               Trusted by a Global Wave of Developers!
//             </h3>
//             <p className="max-w-xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
//               Join thousands of successful developers who transformed their
//               careers with our platform
//             </p>

//             <div className="space-y-5">
//               {benefits.map((benefit, index) => (
//                 <motion.div
//                   key={index}
//                   className="benefit-item flex items-start space-x-4 rounded-lg p-1 transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
//                   initial={{ opacity: 0, y: 10 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4, delay: index * 0.1 }}
//                   viewport={{ once: true }}
//                 >
//                   <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-1">
//                     <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <span className="text-base font-medium text-zinc-700 dark:text-gray-200 sm:text-lg">
//                     {benefit}
//                   </span>
//                 </motion.div>
//               ))}
//             </div>

//             <Link href="/browse" className="mt-2 inline-block">
//               <motion.button
//                 className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 sm:px-8 sm:py-4 sm:text-lg"
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.97 }}
//               >
//                 <span className={`${dmSans.className} `}>
//                   Start Your Journey
//                 </span>
//                 <ArrowRight className="h-5 w-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30" />
//               </motion.button>
//             </Link>
//           </motion.div>

//           {/* Visual Element */}
//           <motion.div
//             className="relative"
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             viewport={{ once: true, margin: "-50px" }}
//           >
//             <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 p-8 shadow-2xl shadow-blue-500/10 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-indigo-950/20 sm:p-12 overflow-hidden">
//               {/* Animated Background Gradient */}
//               <div className="absolute inset-0 rounded-3xl overflow-hidden">
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10"
//                   animate={{
//                     background: [
//                       "linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(99, 102, 241, 0.1) 100%)",
//                       "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%)",
//                       "linear-gradient(225deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)",
//                       "linear-gradient(315deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(99, 102, 241, 0.1) 100%)",
//                     ],
//                   }}
//                   transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
//                 />

//                 {/* Floating Particles */}
//                 {[...Array(12)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
//                     initial={{
//                       x: Math.random() * 400 - 200,
//                       y: Math.random() * 400 - 200,
//                       scale: 0,
//                     }}
//                     animate={{
//                       x: Math.random() * 400 - 200,
//                       y: Math.random() * 400 - 200,
//                       scale: [0, 1, 0],
//                     }}
//                     transition={{
//                       duration: 4 + Math.random() * 4,
//                       repeat: Infinity,
//                       delay: Math.random() * 2,
//                       ease: "easeInOut",
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* Central Icon Container */}
//               <div className="relative flex items-center justify-center mb-8">
//                 {/* Outer Glow Ring */}
//                 <motion.div
//                   className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl"
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
//                 />

//                 {/* Main Icon Circle */}
//                 <motion.div
//                   className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/50 z-10"
//                   whileHover={{ scale: 1.05, rotate: 5 }}
//                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                 >
//                   <motion.div
//                     initial={{ scale: 0, rotate: -180 }}
//                     whileInView={{ scale: 1, rotate: 0 }}
//                     transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
//                   >
//                     <Globe className="h-16 w-16 text-white" />
//                   </motion.div>

//                   {/* Inner Pulse Effect */}
//                   <motion.div
//                     className="absolute inset-0 rounded-full border-2 border-white/30"
//                     animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       ease: "easeInOut",
//                     }}
//                   />
//                 </motion.div>

//                 {/* Orbiting Elements - Enhanced */}
//                 <div className="absolute inset-0">
//                   {[...Array(8)].map((_, i) => (
//                     <motion.div
//                       key={i}
//                       className={`absolute h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg z-20`}
//                       initial={{ scale: 0, opacity: 0 }}
//                       whileInView={{ scale: 1, opacity: 1 }}
//                       transition={{ delay: 0.5 + i * 0.1 }}
//                       animate={{
//                         rotate: 360,
//                         x: Math.cos((i * 45 * Math.PI) / 180) * 70,
//                         y: Math.sin((i * 45 * Math.PI) / 180) * 70,
//                       }}
//                       style={{
//                         transformOrigin: `0px 0px`,
//                       }}
//                     >
//                       {/* Trail Effect */}
//                       <motion.div
//                         className="absolute -inset-1 rounded-full bg-blue-400/20"
//                         animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
//                         transition={{
//                           duration: 2,
//                           repeat: Infinity,
//                           delay: i * 0.2,
//                         }}
//                       />
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>

//               {/* Stats with Enhanced Animations */}
//               <div className="relative grid grid-cols-2 gap-6 text-center z-10">
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.8 }}
//                   whileHover={{ scale: 1.05 }}
//                   className="group"
//                 >
//                   <motion.div
//                     className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400"
//                     animate={{
//                       backgroundPosition: ["0%", "100%", "0%"],
//                     }}
//                     transition={{ duration: 3, repeat: Infinity }}
//                     style={{
//                       backgroundSize: "200% 100%",
//                     }}
//                   >
//                     50K+
//                   </motion.div>
//                   <div className="text-sm text-zinc-600 dark:text-gray-400 mt-2 group-hover:text-zinc-800 dark:group-hover:text-gray-300 transition-colors">
//                     Active Learners
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 1.0 }}
//                   whileHover={{ scale: 1.05 }}
//                   className="group"
//                 >
//                   <motion.div
//                     className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-400"
//                     animate={{
//                       backgroundPosition: ["0%", "100%", "0%"],
//                     }}
//                     transition={{ duration: 3, repeat: Infinity, delay: 1 }}
//                     style={{
//                       backgroundSize: "200% 100%",
//                     }}
//                   >
//                     95%
//                   </motion.div>
//                   <div className="text-sm text-zinc-600 dark:text-gray-400 mt-2 group-hover:text-zinc-800 dark:group-hover:text-gray-300 transition-colors">
//                     Success Rate
//                   </div>
//                 </motion.div>
//               </div>

//               {/* Bottom Shine Effect */}
//               <motion.div
//                 className="absolute bottom-0 left-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
//                 initial={{ x: "-100%", opacity: 0 }}
//                 whileInView={{ x: "100%", opacity: 1 }}
//                 transition={{ duration: 1.5, delay: 1.2 }}
//               />
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const GoalCard = ({
//   icon: Icon,
//   title,
//   description,
//   features,
//   gradient,
//   bgGradient,
//   darkBgGradient,
//   index,
// }: any) => {
//   return (
//     <motion.div
//       className="goal-card group relative h-full cursor-pointer"
//       initial={{ opacity: 0, y: 30 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -8, scale: 1.00 }}
//       transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
//       viewport={{ once: true, margin: "-50px" }}
//     >
//       <div
//         className={`relative h-full overflow-hidden rounded-2xl border border-gray-200/50 bg-gradient-to-br ${bgGradient} p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-gray-800/50 dark:shadow-xl dark:bg-gradient-to-br ${darkBgGradient} group-hover:border-gray-300/70 dark:group-hover:border-gray-700/70`}
//       >
//         {/* Background Pattern - Different for light/dark */}
//         <div className="absolute inset-0">
//           {/* Light mode pattern */}
//           <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,currentColor,transparent_70%)] opacity-5 dark:opacity-10" />
//           {/* Dark mode pattern */}
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,currentColor,transparent_70%)] opacity-0 dark:opacity-5" />
          
//           {/* Animated gradient orb */}
//           <motion.div
//             className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 blur-2xl`}
//             animate={{ 
//               scale: [1, 1.2, 1],
//               opacity: [0, 0.08, 0]
//             }}
//             transition={{ duration: 4, repeat: Infinity, delay: index * 0.2 }}
//           />
//         </div>

//         {/* Icon with dual-mode styling */}
//         <div className="relative mb-8">
//           {/* Light mode shadow */}
//           <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-gray-100 to-transparent blur-xl opacity-60 group-hover:opacity-80 dark:from-white/10 dark:opacity-100" />
          
//           {/* Main icon container */}
//           <motion.div
//             className={`relative inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-r ${gradient} p-4 shadow-lg ring-1 ring-white/20 dark:ring-white/10 group-hover:shadow-xl group-hover:ring-white/30`}
//             whileHover={{ 
//               scale: 1.05,
//               rotate: [0, -5, 5, 0]
//             }}
//             transition={{ duration: 0.3 }}
//           >
//             {/* Icon background shine */}
//             <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
            
//             <motion.div
//               whileHover={{ scale: 1.1 }}
//               transition={{ type: "spring", stiffness: 400, damping: 10 }}
//             >
//               <Icon className="floating-goal-icon h-9 w-9 text-white drop-shadow-md" />
//             </motion.div>
//           </motion.div>

//           {/* Floating dots - visible in light mode */}
//           <div className="absolute -right-2 -top-2 flex space-x-1">
//             {[...Array(3)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="h-1.5 w-1.5 rounded-full bg-gray-400/60 dark:bg-gray-500/60"
//                 animate={{ 
//                   scale: [1, 1.5, 1],
//                   opacity: [0.6, 1, 0.6]
//                 }}
//                 transition={{ 
//                   duration: 2, 
//                   repeat: Infinity, 
//                   delay: i * 0.3 
//                 }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="relative space-y-3">
//           {/* Title with gradient in light mode */}
//           <motion.h3
//             className={`${dmSans.className} text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-200`}
//             whileInView={{ opacity: 1, x: 0 }}
//             initial={{ opacity: 0, x: -10 }}
//             transition={{ delay: 0.1 + index * 0.1 }}
//           >
//             {title}
//           </motion.h3>

//           {/* Description with better contrast */}
//           <motion.p 
//             className="text-base leading-relaxed text-gray-700 dark:text-gray-300"
//             whileInView={{ opacity: 1, x: 0 }}
//             initial={{ opacity: 0, x: -10 }}
//             transition={{ delay: 0.2 + index * 0.1 }}
//           >
//             {description}
//           </motion.p>

//           {/* Features section */}
//           <motion.div 
//             className="space-y-3 pt-3"
//             whileInView={{ opacity: 1, y: 0 }}
//             initial={{ opacity: 0, y: 10 }}
//             transition={{ delay: 0.3 + index * 0.1 }}
//           >
//             <div className={`${dmSans.className} tracking-normal font-semibold text-gray-800 dark:text-gray-200`}>
//               Features:
//             </div>
//             <div className="space-y-3">
//               {features.map((feature: string, idx: number) => (
//                 <motion.div 
//                   key={idx} 
//                   className="flex items-center space-x-3 group/feature"
//                   whileHover={{ x: 5 }}
//                   transition={{ type: "spring", stiffness: 400 }}
//                 >
//                   {/* Animated bullet */}
//                   <motion.div
//                     className={`h-2 w-2 rounded-full bg-gradient-to-r ${gradient} shadow-sm group-hover/feature:scale-150 transition-transform duration-200`}
//                     animate={{
//                       scale: [1, 1.2, 1],
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       delay: idx * 0.5,
//                     }}
//                   />
//                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/feature:text-gray-900 dark:group-hover/feature:text-white transition-colors">
//                     {feature}
//                   </span>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>

//         {/* Enhanced hover effects for both modes */}
//         <motion.div
//           className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 transition-all duration-500 group-hover:opacity-[0.03] dark:group-hover:opacity-5`}
//           whileHover={{ opacity: 0.03 }}
//         />

//         {/* Subtle border glow - different for light/dark */}
//         <div className="absolute inset-0 rounded-2xl border-2 border-transparent opacity-0 transition-all duration-300 group-hover:border-gray-200/50 group-hover:opacity-100 dark:group-hover:border-white/10" />

//         {/* Corner accents */}
//         <div className="absolute top-0 left-0 h-px w-8 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent dark:via-gray-600/50" />
//         <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-transparent via-gray-400/50 to-transparent dark:via-gray-600/50" />
//         <div className="absolute bottom-0 right-0 h-px w-8 bg-gradient-to-l from-transparent via-gray-400/50 to-transparent dark:via-gray-600/50" />
//       </div>

//       {/* External glow effect */}
//       <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20 -z-10`} />
//     </motion.div>
//   );
// };

// export default AchieveCodingGoals;

/// ==================================================================================================

"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Zap,
  Globe,
} from "lucide-react";
import { dmSans } from "@/lib/config/fonts";

gsap.registerPlugin(ScrollTrigger);

const AchieveCodingGoals = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const goals = [
    {
      icon: Target,
      title: "Set Clear Goals",
      description:
        "Define your learning objectives and create a personalized roadmap to achieve them",
      features: [
        "Personalized Learning Path",
        "Progress Tracking",
        "Milestone Setting",
      ],
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      darkBgGradient: "from-blue-950/20 to-cyan-950/20",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Monitor your advancement with detailed analytics and performance insights",
      features: [
        "Real-time Analytics",
        "Skill Assessment",
        "Performance Reports",
      ],
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      darkBgGradient: "from-emerald-950/20 to-teal-950/20",
    },
    {
      icon: Award,
      title: "Earn Certificates",
      description:
        "Get recognized for your achievements with industry-standard certifications",
      features: [
        "Verified Certificates",
        "Portfolio Building",
        "Career Recognition",
      ],
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      darkBgGradient: "from-orange-950/20 to-red-950/20",
    },
  ];

  const benefits = [
    "Learn at your own pace with flexible scheduling",
    "Access to expert instructors and industry professionals",
    "Hands-on projects and real-world applications",
    "Lifetime access to course materials and updates",
    "24/7 community support and mentorship",
    "Career guidance and job placement assistance",
  ];

  // Fixed particle positions that are the same on server and client
  const particlePositions = [
    { x: -50, y: -50 },
    { x: 50, y: -50 },
    { x: -150, y: 50 },
    { x: 100, y: -150 },
    { x: -100, y: -100 },
    { x: 150, y: 100 },
    { x: -200, y: 0 },
    { x: 100, y: 200 },
    { x: -100, y: 150 },
    { x: 200, y: -100 },
    { x: -50, y: 200 },
    { x: 150, y: -50 },
  ];

  useEffect(() => {
    if (!sectionRef.current || !isMounted) return;

    // Animate section title
    gsap.fromTo(
      ".goals-title",
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

    // Animate cards with stagger
    gsap.fromTo(
      ".goal-card",
      { y: 60, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 70%",
        },
      }
    );

    // Animate benefits list
    gsap.fromTo(
      ".benefit-item",
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    // Floating animation for icons
    gsap.to(".floating-goal-icon", {
      scale: 1.1,
      opacity: 0.7,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [isMounted]);

  // Don't render animations until mounted
  if (!isMounted) {
    return (
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col space-y-16">
          {/* Simplified static version for SSR */}
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center space-x-2">
              <Sparkles className="h-6 w-6 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Your Success Journey
              </span>
              <Sparkles className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className={`${dmSans.className} text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl`}>
              Achieve Your
              <span className="bg-gradient-to-r tracking-tighter from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {" "}
                Coding Goals
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
              Transform your career with our proven learning methodology and
              comprehensive support system
            </p>
          </div>

          <div
            ref={cardsRef}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {goals.map((goal, index) => (
              <StaticGoalCard key={index} {...goal} index={index} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-7 px-1 sm:px-2">
              <h3 className={`${dmSans.className} text-2xl font-bold text-zinc-800 dark:text-white sm:text-3xl md:text-4xl`}>
                Trusted by a Global Wave of Developers!
              </h3>
              <p className="max-w-xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
                Join thousands of successful developers who transformed their
                careers with our platform
              </p>

              <div className="space-y-5">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 rounded-lg p-1"
                  >
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-1">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-base font-medium text-zinc-700 dark:text-gray-200 sm:text-lg">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/browse" className="mt-2 inline-block">
                <button className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 sm:px-8 sm:py-4 sm:text-lg">
                  <span className={`${dmSans.className}`}>
                    Start Your Journey
                  </span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </button>
              </Link>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 p-8 shadow-2xl shadow-blue-500/10 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-indigo-950/20 sm:p-12 overflow-hidden">
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10" />
                </div>

                <div className="relative flex items-center justify-center mb-8">
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/50 z-10">
                    <Globe className="h-16 w-16 text-white" />
                  </div>
                </div>

                <div className="relative grid grid-cols-2 gap-6 text-center z-10">
                  <div className="group">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                      50K+
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-gray-400 mt-2">
                      Active Learners
                    </div>
                  </div>

                  <div className="group">
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-400">
                      95%
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-gray-400 mt-2">
                      Success Rate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
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
              Your Success Journey
            </span>
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
          <h2
            className={`${dmSans.className} goals-title text-3xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-4xl lg:text-5xl`}
          >
            Achieve Your
            <span className="bg-gradient-to-r tracking-tighter from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              Coding Goals
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
            Transform your career with our proven learning methodology and
            comprehensive support system
          </p>
        </motion.div>

        {/* Goals Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {goals.map((goal, index) => (
            <GoalCard key={index} {...goal} index={index} />
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Benefits List */}
          <motion.div
            className="space-y-7 px-1 sm:px-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3
              className={`${dmSans.className} text-2xl font-bold text-zinc-800 dark:text-white sm:text-3xl md:text-4xl`}
            >
              Trusted by a Global Wave of Developers!
            </h3>
            <p className="max-w-xl text-lg text-zinc-600 dark:text-gray-300 sm:text-xl">
              Join thousands of successful developers who transformed their
              careers with our platform
            </p>

            <div className="space-y-5">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="benefit-item flex items-start space-x-4 rounded-lg p-1 transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-1">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-base font-medium text-zinc-700 dark:text-gray-200 sm:text-lg">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>

            <Link href="/browse" className="mt-2 inline-block">
              <motion.button
                className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 sm:px-8 sm:py-4 sm:text-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className={`${dmSans.className} `}>
                  Start Your Journey
                </span>
                <ArrowRight className="h-5 w-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 p-8 shadow-2xl shadow-blue-500/10 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-indigo-950/20 sm:p-12 overflow-hidden">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(99, 102, 241, 0.1) 100%)",
                      "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%)",
                      "linear-gradient(225deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)",
                      "linear-gradient(315deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(99, 102, 241, 0.1) 100%)",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Fixed Floating Particles - No Math.random() */}
                {particlePositions.map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
                    initial={{
                      x: pos.x,
                      y: pos.y,
                      scale: 0,
                    }}
                    animate={{
                      x: pos.x + (i % 2 === 0 ? 50 : -50),
                      y: pos.y + (i % 3 === 0 ? 50 : -50),
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 4 + (i % 3),
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Central Icon Container */}
              <div className="relative flex items-center justify-center mb-8">
                {/* Outer Glow Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Main Icon Circle */}
                <motion.div
                  className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/50 z-10"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <Globe className="h-16 w-16 text-white" />
                  </motion.div>

                  {/* Inner Pulse Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                {/* Orbiting Elements - Fixed positions */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg z-20`}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      animate={{
                        rotate: 360,
                        x: Math.cos((i * 45 * Math.PI) / 180) * 70,
                        y: Math.sin((i * 45 * Math.PI) / 180) * 70,
                      }}
                      style={{
                        transformOrigin: `0px 0px`,
                      }}
                    >
                      {/* Trail Effect */}
                      <motion.div
                        className="absolute -inset-1 rounded-full bg-blue-400/20"
                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stats with Enhanced Animations */}
              <div className="relative grid grid-cols-2 gap-6 text-center z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <motion.div
                    className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400"
                    animate={{
                      backgroundPosition: ["0%", "100%", "0%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                      backgroundSize: "200% 100%",
                    }}
                  >
                    50K+
                  </motion.div>
                  <div className="text-sm text-zinc-600 dark:text-gray-400 mt-2 group-hover:text-zinc-800 dark:group-hover:text-gray-300 transition-colors">
                    Active Learners
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <motion.div
                    className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-400"
                    animate={{
                      backgroundPosition: ["0%", "100%", "0%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    style={{
                      backgroundSize: "200% 100%",
                    }}
                  >
                    95%
                  </motion.div>
                  <div className="text-sm text-zinc-600 dark:text-gray-400 mt-2 group-hover:text-zinc-800 dark:group-hover:text-gray-300 transition-colors">
                    Success Rate
                  </div>
                </motion.div>
              </div>

              {/* Bottom Shine Effect */}
              <motion.div
                className="absolute bottom-0 left-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
                initial={{ x: "-100%", opacity: 0 }}
                whileInView={{ x: "100%", opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.2 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Static version for SSR
const StaticGoalCard = ({
  icon: Icon,
  title,
  description,
  features,
  gradient,
  bgGradient,
  darkBgGradient,
  index,
}: any) => {
  return (
    <div className="group relative h-full cursor-pointer">
      <div
        className={`relative h-full overflow-hidden rounded-2xl border border-gray-200/50 bg-gradient-to-br ${bgGradient} p-8 shadow-lg backdrop-blur-sm dark:border-gray-800/50 dark:shadow-xl dark:bg-gradient-to-br ${darkBgGradient}`}
      >
        <div className="relative mb-8">
          <div
            className={`relative inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-r ${gradient} p-4 shadow-lg ring-1 ring-white/20 dark:ring-white/10`}
          >
            <Icon className="h-9 w-9 text-white drop-shadow-md" />
          </div>
        </div>

        <div className="relative space-y-3">
          <h3 className={`${dmSans.className} text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-200`}>
            {title}
          </h3>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {description}
          </p>

          <div className="space-y-3 pt-3">
            <div className={`${dmSans.className} tracking-normal font-semibold text-gray-800 dark:text-gray-200`}>
              Features:
            </div>
            <div className="space-y-3">
              {features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${gradient} shadow-sm`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoalCard = ({
  icon: Icon,
  title,
  description,
  features,
  gradient,
  bgGradient,
  darkBgGradient,
  index,
}: any) => {
  return (
    <motion.div
      className="goal-card group relative h-full cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.00 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div
        className={`relative h-full overflow-hidden rounded-2xl border border-gray-200/50 bg-gradient-to-br ${bgGradient} p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-gray-800/50 dark:shadow-xl dark:bg-gradient-to-br ${darkBgGradient} group-hover:border-gray-300/70 dark:group-hover:border-gray-700/70`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,currentColor,transparent_70%)] opacity-5 dark:opacity-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,currentColor,transparent_70%)] opacity-0 dark:opacity-5" />
        </div>

        {/* Icon */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-gray-100 to-transparent blur-xl opacity-60 group-hover:opacity-80 dark:from-white/10 dark:opacity-100" />
          
          <motion.div
            className={`relative inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-r ${gradient} p-4 shadow-lg ring-1 ring-white/20 dark:ring-white/10 group-hover:shadow-xl group-hover:ring-white/30`}
            whileHover={{ 
              scale: 1.05,
              rotate: [0, -5, 5, 0]
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon className="floating-goal-icon h-9 w-9 text-white drop-shadow-md" />
            </motion.div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative space-y-3">
          <motion.h3
            className={`${dmSans.className} text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-200`}
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -10 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            {title}
          </motion.h3>

          <motion.p 
            className="text-base leading-relaxed text-gray-700 dark:text-gray-300"
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -10 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            {description}
          </motion.p>

          <motion.div 
            className="space-y-3 pt-3"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className={`${dmSans.className} tracking-normal font-semibold text-gray-800 dark:text-gray-200`}>
              Features:
            </div>
            <div className="space-y-3">
              {features.map((feature: string, idx: number) => (
                <motion.div 
                  key={idx} 
                  className="flex items-center space-x-3 group/feature"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${gradient} shadow-sm group-hover/feature:scale-150 transition-transform duration-200`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/feature:text-gray-900 dark:group-hover/feature:text-white transition-colors">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AchieveCodingGoals;