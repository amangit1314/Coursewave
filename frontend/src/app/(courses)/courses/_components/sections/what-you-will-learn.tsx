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
    <div className="grid grid-cols-2 gap-2 p-2 text-left md:grid-cols-3 md:gap-4 md:p-0">
      {defaults.map((point: any, index: any) => (
        <li key={index} className="flex items-center space-x-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
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
    <div className="mt-2 flex w-full pr-8 md:mt-0 md:max-w-3xl md:p-0">
      <div className="flex w-full flex-col space-y-4 bg-white text-start text-gray-900 dark:bg-transparent dark:text-white md:max-w-3xl">
        <h3 className="text-xl font-semibold tracking-tight text-gray-800 dark:text-slate-200">
          What you will learn!
        </h3>

        {whatYouWillLearn ? (
          <div className="grid grid-cols-1 gap-2 text-left md:gap-2 md:p-0">
            {whatYouWillLearn.map((point: string, index: any) => (
              <li key={index} className="flex items-center space-x-3">
                <TbPoint className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" />
                <span className="text-md text-base dark:text-gray-400">
                  {point}
                </span>
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

export default WhatYouWillLearn;
