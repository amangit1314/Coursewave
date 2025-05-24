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

const Home = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <main className="relative flex dark:bg-black dark:bg-opacity-80 h-full flex-col items-center justify-between overflow-hidden ">
      <LandingPageHeader handleLoginClick={handleLoginClick} />

      <HeroSection />

      <div className="space-y-32 w-full h-full p-10">
        <LandingCoursewaveStats />

        <About />

        <Offerings />

        <HomeBrowseSection />

        <AchieveCodingGoals />

        <Testimonials />
      </div>

      <Footer />
    </main>
  );
};

export default Home;
