
import { SessionCard } from '@/app/(browseSessions)/browseSessions/_components/session-card'
import React from 'react'

function CreatedSessions() {
    return (
      <div className="pt-[80px] mx-12">
        <div className="h-full grid grid-cols-4 gap-4 w-full rounded-xl bg-gray-200 dark:bg-gray-700 p-8">
          <SessionCard />
          <SessionCard />
          <SessionCard />
          <SessionCard />
          <SessionCard />
          <SessionCard />

        </div>
      </div>
    );
}

export default CreatedSessions