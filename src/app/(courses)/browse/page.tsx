import React, { Suspense } from "react";
import BrowseSection from "./_components/BrowseSection";

const BrowseCourses = () => {
  return (
    <div className="flex h-full pt-16">
      <Suspense>
        <BrowseSection />
      </Suspense>
    </div>
  );
};

export default BrowseCourses;
