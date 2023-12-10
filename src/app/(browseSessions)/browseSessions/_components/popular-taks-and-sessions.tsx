import React from 'react'
import { SessionCard } from './session-card';

export const PopularTalksAndSessions = () => {
    return (
        <div>
            <p className='text-xl  pb-2 font-semibold tracking-tight'>Today Popular Talks and Sessions</p>
            <div className='grid grid-cols-4 gap-8'>
                <SessionCard />
                <SessionCard />
                <SessionCard />
                <SessionCard />
            </div>
        </div>
    );
}