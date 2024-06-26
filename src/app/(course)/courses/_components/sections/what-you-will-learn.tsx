import { TbPoint } from "react-icons/tb";

const defaults = [
  "Individual configuration",
  "No setup, or hidden fees",
  "Team size: 1 developer",
  "Premium Support: 6 months",
  "Free updates: 6 months",
];

const Default = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 p-2 md:p-0 text-left">
      {defaults.map((point: any, index: any) => (
        <li key={index} className="flex items-center space-x-3">
          <svg
            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="text-sm">{point}</span>
        </li>
      ))}
    </div>
  );
};

export const WhatYouWillLearn = ({ whatYouWillLearn }: any) => {
  return (
    <div className="mt-2 md:max-w-3xl w-full md:mt-0 md:p-0 pr-8 flex ">
      <div className="flex flex-col md:max-w-3xl space-y-4 w-full text-start text-gray-900 bg-white dark:bg-transparent dark:text-white">
        <h3 className=" text-xl tracking-tight font-semibold text-gray-800 dark:text-slate-200">
          What you will learn!
        </h3>

        {whatYouWillLearn ? (
          <div className="grid grid-cols-1 gap-2 md:gap-2 md:p-0 text-left">
            {whatYouWillLearn.map((point: string, index: any) => (
              <li key={index} className="flex items-center space-x-3">
                <TbPoint className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span className="text-md text-base dark:text-gray-400">{point}</span>
              </li>
            ))}
          </div>
        ) : (
          <Default />
        )}
      </div>
    </div>
  );
};
