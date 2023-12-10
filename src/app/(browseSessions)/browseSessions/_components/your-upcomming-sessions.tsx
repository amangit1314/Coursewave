import React from 'react'
import { UpcommingSessionsCard } from './upcomming-session-card';

export const YourUpComingSessions = () => {
    return (
        <div>
            <p className='text-xl font-semibold tracking-tight pb-2'>Your Upcoming Sessions</p>
            <div className='grid grid-cols-2 gap-2'>
                <UpcommingSessionsCard />
                <UpcommingSessionsCard />
            </div>
        </div>
    )
}




