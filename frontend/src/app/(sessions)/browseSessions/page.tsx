import React from "react";
import { MeetOurCoaches } from "./_components/meet-our-coaches";
import PopularTalksAndSessions from "./_components/popular-taks-and-sessions";
import { YourUpComingSessions } from "./_components/your-upcomming-sessions";
import { SearchAndFilter } from "./_components/search-and-filter";
import { HeroSection } from "./_components/hero-section";
import { FeaturedCategories } from "./_components/featured-categories";

const BrowseSessions = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <HeroSection />
      
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-12">
        <SearchAndFilter />
        
        <YourUpComingSessions />
        
        <FeaturedCategories />
        
        <MeetOurCoaches />
        
        <PopularTalksAndSessions />
      </div>
    </div>
  );
};

export default BrowseSessions;
