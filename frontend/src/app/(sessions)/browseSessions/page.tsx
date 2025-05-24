import React from "react";
import { MeetOurCoaches } from "./_components/meet-our-coaches";
import { PopularTalksAndSessions } from "./_components/popular-taks-and-sessions";
import { YourUpComingSessions } from "./_components/your-upcomming-sessions";
import { QueryClient } from "@tanstack/react-query";

const BrowseSessions = () => {
  const queryClient = new QueryClient();

  return (
    <div className="px-10 py-8 max-w-7xl overflow-x-hidden space-y-8">
      {/* <MeetOurCoaches /> */}

      <PopularTalksAndSessions />
    </div>
  );
};

export default BrowseSessions;
