// export default function WhatYouWillLearn() {
//   return (
//     <div className="mt-2 max-w-3xl w-full md:py-8 md:mt-0 md:p-0 p-6 flex ">
//       <div className="flex flex-col p-4 max-w-3xl text-start text-gray-900 bg-white rounded-xl border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
//         <h3 className="mb-4 text-xl tracking-tight font-semibold">
//           What you will learn!
//         </h3>

//         <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 p-2 md:p-0 text-left">
//           <li className="flex items-center space-x-3">
//             <svg
//               className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fill-rule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               ></path>
//             </svg>
//             <span className="text-sm">Individual configuration</span>
//           </li>
//           <li className="flex items-center space-x-3">
//             <svg
//               className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fill-rule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               ></path>
//             </svg>
//             <span className="text-sm">No setup, or hidden fees</span>
//           </li>
//           <li className="flex items-center space-x-3">
//             <svg
//               className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fill-rule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               ></path>
//             </svg>
//             <span className="text-sm">
//               Team size:{" "}
//               <span className="text-sm font-semibold">1 developer</span>
//             </span>
//           </li>
//           <li className="flex items-center space-x-3">
//             <svg
//               className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fill-rule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               ></path>
//             </svg>
//             <span className="text-sm">
//               Premium support:{" "}
//               <span className=" text-sm font-semibold">6 months</span>
//             </span>
//           </li>
//           <li className="flex items-center space-x-3">
//             <svg
//               className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fill-rule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               ></path>
//             </svg>
//             <span className="text-sm">
//               Free updates:{" "}
//               <span className="text-sm  font-semibold">6 months</span>
//             </span>
//           </li>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useQuery } from "@apollo/client";
// import { GET_COURSE } from "./graphql/queries"; // Assuming your GraphQL query is located here
import { TbPoint } from "react-icons/tb";
const Default = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 p-2 md:p-0 text-left">
      <li className="flex items-center space-x-3">
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
        <span className="text-sm">Individual configuration</span>
      </li>
      <li className="flex items-center space-x-3">
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
        <span className="text-sm">No setup, or hidden fees</span>
      </li>
      <li className="flex items-center space-x-3">
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
        <span className="text-sm">
          Team size: <span className="text-sm font-semibold">1 developer</span>
        </span>
      </li>
      <li className="flex items-center space-x-3">
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
        <span className="text-sm">
          Premium support:{" "}
          <span className=" text-sm font-semibold">6 months</span>
        </span>
      </li>
      <li className="flex items-center space-x-3">
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
        <span className="text-sm">
          Free updates: <span className="text-sm  font-semibold">6 months</span>
        </span>
      </li>
    </div>
  );
};

export default function WhatYouWillLearn({ whatYouWillLearn }: any) {
  return (
    <div className="mt-2 md:max-w-3xl w-full md:py-8 md:mt-0 md:p-0 pr-8 flex ">
      <div className="flex flex-col p-4 md:max-w-3xl w-full text-start text-gray-900 bg-white rounded-2xl border border-gray-100 shadow dark:border-none xl:p-6 dark:bg-gray-800 dark:text-white">
        <h3 className="mb-2 md:mb-4 text-xl tracking-tight font-semibold">
          What you will learn!
        </h3>
        {whatYouWillLearn ? (
          <div className="grid grid-cols-1  gap-2 md:gap-4  md:p-0 text-left">
            {whatYouWillLearn.map((point: string, index: any) => (
              <li key={index} className="flex items-center space-x-3">
                <TbPoint className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span className="text-sm">{point}</span>
              </li>
            ))}
          </div>
        ) : (
          <Default />
        )}
      </div>
    </div>
  );
}
