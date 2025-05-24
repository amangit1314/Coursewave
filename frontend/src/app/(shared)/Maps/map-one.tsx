"use client";
import React from "react";
import { VectorMap } from "@react-jvectormap/core";
import { usAea } from "@react-jvectormap/unitedstates";

const MapOne = () => {
  return (
    <div className="border-stroke shadow-default col-span-12 rounded-sm border bg-white px-6 py-6 dark:bg-gray-800 xl:col-span-7">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Region labels
      </h4>
      <div
        id="mapOne"
        className="mapOne w-7.5 h-7.5 border-stroke dark:border-strokedark text-body dark:text-bodydark pb-0.5; h-90 bottom-0 left-auto right-0 top-auto flex items-center justify-center rounded border bg-white px-0 pt-0 text-2xl leading-none hover:border-primary hover:bg-primary hover:text-white dark:hover:border-primary dark:hover:text-white"
      >
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
