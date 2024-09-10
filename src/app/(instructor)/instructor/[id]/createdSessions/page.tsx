import { SessionCard } from "@/app/(browseSessions)/browseSessions/_components/session-card";
import React from "react";

function CreatedSessions() {
  return (
    <div className="mx-12 pt-[80px]">
      <div className="grid h-full w-full grid-cols-4 gap-4 rounded-xl bg-gray-200 p-8 dark:bg-gray-700">
        <SessionCard
          sessionImage={"/assets/images/cover/cover-01.png"}
          sessionName={"Webinar on building a course website"}
          instructor={"Aman Soni"}
        />
        {/* <SessionCard />
          <SessionCard />
          <SessionCard />
          <SessionCard />
          <SessionCard /> */}
      </div>
    </div>
  );
}

export default CreatedSessions;
