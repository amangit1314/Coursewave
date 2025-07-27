"use client"; // required for {HeroSection} lottie-react because it use (useState) internally

import React from "react";
import { useRouter } from "next/navigation";
import LandingPageHeader from "./(shared)/LandingPage/header";
import HeroSection from "./(shared)/LandingPage/hero-section";
import About from "./(shared)/LandingPage/about";
import AchieveCodingGoals from "./(shared)/LandingPage/achieve-coding-goals";
import HomeBrowseSection from "./(shared)/LandingPage/home-browse-section";
import LandingCoursewaveStats from "./(shared)/LandingPage/landing-stats";
import Offerings from "./(shared)/LandingPage/offerings";
import Testimonials from "./(shared)/LandingPage/testimonials";
import { Footer } from "./(shared)/LandingPage/footer";
import FeaturedCourses from "./(shared)/LandingPage/featured-courses";

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
