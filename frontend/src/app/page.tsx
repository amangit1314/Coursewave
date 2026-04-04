"use client";

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
    <main className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden bg-white dark:bg-[hsl(222,47%,6%)]">
      {/* Header */}
      <LandingPageHeader handleLoginClick={handleLoginClick} />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="w-full space-y-24 px-4 py-12 sm:space-y-32 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Stats */}
        <section className="mx-auto w-full max-w-7xl">
          <LandingCoursewaveStats />
        </section>

        {/* About */}
        <section className="mx-auto w-full max-w-7xl">
          <About />
        </section>

        {/* Offerings */}
        <section className="mx-auto w-full max-w-7xl">
          <Offerings />
        </section>

        {/* Featured Courses */}
        <section className="mx-auto w-full max-w-7xl">
          <FeaturedCourses />
        </section>

        {/* Browse Categories */}
        <section className="mx-auto w-full max-w-7xl">
          <HomeBrowseSection />
        </section>

        {/* Testimonials */}
        <section className="mx-auto w-full max-w-7xl">
          <Testimonials />
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-7xl">
          <AchieveCodingGoals />
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Home;
