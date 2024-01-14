'use client'; // required for {HeroSection} lottie-react because it use (useState) internally

import React from "react";

import About from "@/components/LandingPage/about";
import Footer from "@/components/LandingPage/footer";
import * as scrollAnimation from "./ScrollAnimation.json";
import Offerings from "@/components/LandingPage/offerings";
import SessionsSection from "@/components/LandingPage/sessions";
import HeroSection from "@/components/LandingPage/hero-section";
import Testimonials from "@/components/LandingPage/testimonials";
import HomeBrowseSection from "@/components/LandingPage/homeBrowseSection";

export default function Home() {
  return (
    <main className="flex dark:bg-black dark:bg-opacity-80 min-h-screen flex-col items-center justify-between  ">
      <div className="p-10">
        <HeroSection scrollAnimation={scrollAnimation} />

        <About />

        <Offerings />

        <SessionsSection />

        <Testimonials />

        <HomeBrowseSection />
      </div>

      <Footer />
    </main>
  );
}
