import React, { Suspense } from "react";
import BrowseSection from "../_components/browse-section";
import DataComponent from "../_components/data-component";

const BrowseCourses = () => {
  return (
    <div className="flex mt-30 h-full">
      <Suspense>
        <BrowseSection>
          <DataComponent />
        </BrowseSection>
      </Suspense>
    </div>
  );
};

export default BrowseCourses;
