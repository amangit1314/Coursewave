// import Image from "next/image";

// const ScheduledSessionCard = () => {
//   return (
//     <div className="border-stroke mx-[2px] my-4 flex w-full max-w-[30rem] cursor-pointer justify-start overflow-hidden rounded-xl border pr-4 transition-all duration-300 hover:text-blue-800 hover:bg-blend-saturation hover:ring-1 hover:ring-blue-600 dark:border-none dark:bg-zinc-950 dark:hover:text-white">
//       <div className={`h-25 w-1 rounded-full bg-blue-500 py-4`}></div>

//       <div className="mx-4 flex w-full max-w-[25rem] items-center justify-start space-x-3">
//         {/* image and speaker name */}
//         <div className="flex flex-col items-start justify-center space-y-2">
//           <Image
//             src={
//               "https://static.vecteezy.com/system/resources/thumbnails/003/857/434/small/group-discuss-session-in-modern-flat-style-free-vector.jpg"
//             }
//             alt={`Image`}
//             height={100}
//             width={100}
//             objectFit="cover"
//             quality={100}
//             className="flex h-[6rem] w-full max-w-[8rem] items-center justify-start rounded-md object-cover ring-1 ring-white md:w-[16rem]"
//           />
//           {/* 
//           <p className="line-clamp-2 max-w-[8rem] overflow-hidden text-ellipsis text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
//             {"Jemmison Carl"}
//           </p> */}
//         </div>

//         {/* content */}
//         <div className="flex flex-col items-start justify-start py-4 space-y-2">
//           {/* <p className="text-xs uppercase text-zinc-600 dark:text-gray-300 dark:opacity-70">
//             <span className="text-blue-500">Tuesday</span>,{" "}
//             <span className="text-blue-500">jan 3</span> @{" "}
//             <span className="text-blue-500">3:40 PM(IST)</span>
//           </p> */}
//           <p className="text-xs uppercase text-zinc-600 dark:text-gray-300 dark:opacity-70">
//             Tuesday, jan 3 @ 3:40 PM(IST)
//           </p>

//           <div className="flex flex-col justify-start">
//             <p className="line-clamp-1 w-full max-w-[20rem] overflow-hidden text-ellipsis text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
//               Introduction to Rust
//               asdifapdfasdofmas;dkfmas;dfasdfjpasdfjpasdfpwiepqiewjrp;wekdmfa;sodf-pwoej=3=23rj23wejorq[woerjqwke;rjq;ewlrjwlekjrk]
//             </p>
//             <p className="text-xs tracking-tighter text-zinc-600 dark:text-gray-300 dark:opacity-70">
//               One-on-One Session (Duration: 40m)
//             </p>
//           </div>

//           <div className=" flex items-center justify-start">
//             <div className="flex justify-center rounded-badge bg-green-600 px-1 py-0.5 text-xs font-medium text-white">
//               confirmed
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScheduledSessionCard;


import Image from "next/image";
import { CalendarIcon, ClockIcon, CheckCircleIcon } from "lucide-react";

const ScheduledSessionCard = () => {
  return (
    <div className="min-w-[260px] max-w-xs md:max-w-sm flex flex-col rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 flex-shrink-0">
      {/* Image Section */}
      <div className="relative h-36 w-full">
        <div className="absolute top-0 left-0 w-full h-full">
          <Image
            src="https://static.vecteezy.com/system/resources/thumbnails/003/857/434/small/group-discuss-session-in-modern-flat-style-free-vector.jpg"
            alt="Session Image"
            layout="fill"
            objectFit="cover"
            className="object-center"
          />
        </div>
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
          <CheckCircleIcon className="w-3 h-3" />
          <span>Confirmed</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">
          Introduction to Rust
        </h3>
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
          One-on-One Session (Duration: 40m)
        </p>

        {/* Date and Time */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
            <span>Tuesday, Jan 3</span>
          </div>
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <ClockIcon className="w-4 h-4 mr-2 text-blue-600" />
            <span>3:40 PM (IST)</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 flex justify-between items-center">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400">
          Details
        </button>
        <div className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-xs font-medium text-blue-800 dark:text-blue-400 flex items-center">
          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
          Upcoming
        </div>
      </div>
    </div>
  );
};

export default ScheduledSessionCard;