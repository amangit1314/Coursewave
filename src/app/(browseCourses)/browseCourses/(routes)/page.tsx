import React, { Suspense } from "react";
import BrowseSection from "../_components/browse-section";
import DataComponent from "../_components/data-component";

const BrowseCourses = () => {
  return (
    <div className="flex h-full pt-16">
      <Suspense>
        <BrowseSection>
          {/* <DataComponent /> */}
        </BrowseSection>
      </Suspense>
    </div>
  );
};

export default BrowseCourses;
