import React from 'react'
import { MeetOurCoaches } from './_components/meet-our-coaches';
import { PopularTalksAndSessions } from './_components/popular-taks-and-sessions';
import { YourUpComingSessions } from './_components/your-upcomming-sessions';

export default function BrowseSessions() {
  return (
    <div className='p-12 mt-[3rem] max-w-7xl'>
      <YourUpComingSessions />

      <MeetOurCoaches />

      <PopularTalksAndSessions /> 
    </div>
  )
}