"use client"; // required for {HeroSection} lottie-react because it use (useState) internally

// import TestimonialsSection from "@/components/LandingPage/ai_generated_testimonials_section";
// import CTASection from "@/components/LandingPage/cta-section";
// import FeaturesSection from "@/components/LandingPage/features-section";
// import HeroSection from "@/components/LandingPage/hero-section";
// import StatsSection from "@/components/LandingPage/stats-section";

import React from "react";
import { useRouter } from "next/navigation";
import LandingPageHeader from "../components/LandingPage/header";
import HeroSection from "../components/LandingPage/hero-section";
import About from "../components/LandingPage/about";
import AchieveCodingGoals from "../components/LandingPage/achieve-coding-goals";
import HomeBrowseSection from "../components/LandingPage/home-browse-section";
import LandingCoursewaveStats from "../components/LandingPage/landing-stats";
import Offerings from "../components/LandingPage/offerings";
import Testimonials from "../components/LandingPage/testimonials";
import { Footer } from "../components/LandingPage/footer";
import FeaturedCourses from "../components/LandingPage/featured-courses";

const Home = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden bg-white dark:bg-black dark:bg-opacity-80">
      {/* Header */}
      <LandingPageHeader handleLoginClick={handleLoginClick} />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Sections */}
      <div className="w-full space-y-16 px-4 py-8 sm:space-y-20 sm:px-6 sm:py-12 md:space-y-24 md:px-8 lg:space-y-32 lg:px-12 xl:px-16">
        {/* Stats Section */}
        <section className="mx-auto w-full max-w-7xl">
          <LandingCoursewaveStats />
        </section>

        {/* About Section */}
        <section className="mx-auto w-full max-w-7xl">
          <About />
        </section>

        {/* Offerings Section */}
        <section className="mx-auto w-full max-w-7xl">
          <Offerings />
        </section>

        {/* Featured Courses Section */}
        <section className="mx-auto w-full max-w-7xl">
          <FeaturedCourses />
        </section>

        {/* Browse Section */}
        <section className="mx-auto w-full max-w-7xl">
          <HomeBrowseSection />
        </section>

        {/* Achieve Coding Goals Section */}
        <section className="mx-auto w-full max-w-7xl">
          <AchieveCodingGoals />
        </section>

        {/* Testimonials Section */}
        <section className="mx-auto w-full max-w-7xl">
          <Testimonials />
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Home;

// export default function HomePage() {
//   return (
//     <main className="min-h-screen">
//       <HeroSection />
//       <FeaturesSection />
//       <StatsSection />
//       <TestimonialsSection />
//       <CTASection />
//     </main>
//   );
// }
