import React from "react";
import { MeetOurCoaches } from "./_components/MeetOurCoaches";
import PopularTalksAndSessions from "./_components/PopularTaksAndSessions";
import { YourUpComingSessions } from "./_components/YourUpcommingSessions";
import { SearchAndFilter } from "./_components/SearchAndFilter";
import { HeroSection } from "./_components/BrowseSessionsHeroSection";
import { FeaturedCategories } from "./_components/FeaturedCategories";

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
