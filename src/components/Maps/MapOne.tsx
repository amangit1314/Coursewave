"use client";
import React from "react";
import { VectorMap } from "@react-jvectormap/core";
import { usAea } from "@react-jvectormap/unitedstates";

const MapOne = () => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 px-6 shadow-default dark:bg-gray-800 xl:col-span-7">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Region labels
      </h4>
      <div id="mapOne" className="mapOne bottom-0 top-auto right-0 left-auto flex items-center justify-center w-7.5 h-7.5 rounded border border-stroke dark:border-strokedark hover:border-primary dark:hover:border-primary bg-white hover:bg-primary text-body hover:text-white dark:text-bodydark dark:hover:text-white text-2xl leading-none px-0 pt-0 pb-0.5;
 h-90">
        <VectorMap
          map={usAea}
          backgroundColor="white"
          regionStyle={{
            initial: {
              fill: "#D1D5DB",
            },
            hover: {
              fillOpacity: 1,
              fill: "blue",
            },
            selected: {
              fill: "#FFFB00",
            },
          }}
          onRegionTipShow={function reginalTip(event, label, code) {
            //@ts-ignore
            return label.html(`
                  <div style="background-color: #F8FAFC; color: black; padding: 2px 8px"; >
                    ${
                      //@ts-ignore
                      label.html()
                    }
                  </div>`);
          }}
        />
      </div>
    </div>
  );
};

export default MapOne;
