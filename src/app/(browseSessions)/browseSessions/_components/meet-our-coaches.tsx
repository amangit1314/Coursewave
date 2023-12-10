import React from 'react'
import { CoachCard } from './coach-card';

export const MeetOurCoaches = () => {
    return (
        <div>
            <p className='text-xl font-semibold tracking-tight  pb-2'>Meet our Coaches</p>
            <div className='grid grid-cols-4 gap-2'>
                <CoachCard />
                <CoachCard />
            </div>
        </div>
    );
}

