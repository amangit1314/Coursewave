// import Link from "next/link";
// import { FaLink } from "react-icons/fa6";

// type CourseAttachmentCardProps = {
//   id: string;
//   url: string;
//   name: string;
// };

// const CourseAttachmentItem = ({ id, url, name }: CourseAttachmentCardProps) => {
//   return (
//     <div
//       className="text-md group hover flex cursor-pointer items-center justify-between pb-1 text-base text-gray-700 transition-all duration-200 hover:rounded-md hover:text-blue-500 dark:text-gray-400"
//       key={id}
//     >
//       <Link
//         className="text-sm tracking-tight group-hover:font-medium dark:hover:text-blue-500"
//         href={url}
//       >
//         {name}
//       </Link>
//       <FaLink className="text-blue-600" />
//     </div>
//   );
// };

// export default CourseAttachmentItem;


import Link from "next/link";
import { FaLink } from "react-icons/fa6";

type CourseAttachmentItemProps = {
  id: string;
  url: string;
  name: string;
};

const CourseAttachmentItem = ({ id, url, name }: CourseAttachmentItemProps) => {
  return (
    <li key={id}>
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-blue-500"
      >
        <span className="truncate">{name}</span>
        <FaLink className="shrink-0 text-blue-600" />
      </Link>
    </li>
  );
};

export default CourseAttachmentItem;
