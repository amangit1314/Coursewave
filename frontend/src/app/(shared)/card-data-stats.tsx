// import React, { ReactNode } from "react";

// interface CardDataStatsProps {
//   title: string;
//   total: string;
//   rate?: string;
//   levelUp?: boolean;
//   levelDown?: boolean;
//   children: ReactNode;
// }

// const CardDataStats: React.FC<CardDataStatsProps> = ({
//   title,
//   total,
//   rate,
//   levelUp,
//   levelDown,
//   children,
// }) => {
//   return (
//     <div className="border-stroke shadow-default dark:border-strokedark h-[162px] w-[229px] rounded-md border bg-white px-6 py-6 dark:bg-zinc-900">
//       <div className="h-11.5 w-11.5 bg-meta-2 dark:bg-meta-4 flex items-start justify-start rounded-full">
//         {children}
//       </div>

//       <div className="mt-4 flex items-end justify-between">
//         <div>
//           <h4 className="text-2xl font-bold text-black dark:text-white">
//             {total}
//           </h4>
//           <span className="text-sm font-normal text-zinc-400">{title}</span>
//         </div>

//         <span
//           className={`flex items-center gap-1 text-sm font-medium ${
//             levelUp && "text-green-400"
//           } ${levelDown && "text-blue-400"} `}
//         >
//           {rate ?? 0}
//           {levelUp && (
//             <svg
//               className="fill-green-400"
//               width="10"
//               height="11"
//               viewBox="0 0 10 11"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
//                 fill=""
//               />
//             </svg>
//           )}
//           {levelDown && (
//             <svg
//               className="fill-blue-400"
//               width="10"
//               height="11"
//               viewBox="0 0 10 11"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
//                 fill=""
//               />
//             </svg>
//           )}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default CardDataStats;


import React, { ReactNode } from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate?: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-stroke bg-white px-6 py-6 shadow-default dark:border-strokedark dark:bg-zinc-900 w-full h-full">
      <div className="flex items-center justify-start">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          {children}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-bold text-black dark:text-white">
            {total}
          </h4>
          <span className="text-sm font-normal text-zinc-400">{title}</span>
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            levelUp ? "text-green-400" : ""
          } ${levelDown ? "text-blue-400" : ""}`}
        >
          {rate ?? "0"}
          {levelUp && (
            <svg
              className="h-3 w-3 fill-green-400"
              viewBox="0 0 10 11"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.35716 2.47737L0.908974 5.82987L0 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737V10.0849H4.35716V2.47737Z" />
            </svg>
          )}
          {levelDown && (
            <svg
              className="h-3 w-3 fill-blue-400"
              viewBox="0 0 10 11"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L0 5.22362L0.908973 4.33987L4.35716 7.69237V0.0848704H5.64284V7.69237Z" />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;
