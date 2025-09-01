// import Link from "next/link";
// import { FaLink } from "react-icons/fa6";

// type Attachment = {
//   id: string;
//   url: string;
//   name: string;
//   type?: "IMAGE" | "DOC" | "PDF" | string;
// };

// export default function CourseAttachments({
//   courseAttachments,
// }: {
//   courseAttachments: Attachment[];
// }) {
//   console.log("Course Attachments: ", courseAttachments);

//   return (
//     <div>
//       {courseAttachments && courseAttachments.length > 0 ? (
//         <ul className="w-full list-disc py-4 font-normal md:ml-4 md:p-0 md:py-2">
//           {courseAttachments.map((attachment: any) => (
//             <CourseAttachmentItem
//               key={attachment.id}
//               id={attachment.id}
//               url={attachment.url}
//               name={attachment.name}
//             />
//           ))}
//         </ul>
//       ) : (
//         <ul className="text-md md:text-md font-noraml ml-4 w-auto list-disc py-4 text-base text-gray-700 dark:text-gray-400 md:p-0 md:py-2">
//           <li className="pb-1">
//             <Link href="">
//               Connect with Martin on YouTube, Instagram, Spotify, and his
//               website.
//             </Link>
//           </li>
//           <li className="pb-1">
//             <Link href="">
//               Discover Martin’s best-selling book, “Modern Rock Guitar Soloing:
//               Master Intermediate and Advanced Lead Guitar Concepts, Licks,
//               Theory, & Technique for Rock Soloing & Improvisation”
//             </Link>
//           </li>
//           <li>
//             <Link href="">Resources PDF</Link>
//           </li>
//         </ul>
//       )}
//     </div>
//   );
// }

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


// app/(course)/courses/[courseId]/courseContent/_components/CourseAttachments.tsx

import React from "react";
import Link from "next/link";
import { FaLink, FaFilePdf, FaFileImage,  FaFileVideo, FaFile } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";

type Attachment = {
  id: string;
  url: string;
  name: string;
  type?: "IMAGE" | "DOC" | "PDF" | "VIDEO" | string;
};

export default function CourseAttachments({
  courseAttachments,
}: {
  courseAttachments: Attachment[];
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Resources</h3>
      {courseAttachments && courseAttachments.length > 0 ? (
        <ul className="space-y-2">
          {courseAttachments.map((attachment) => (
            <CourseAttachmentItem
              key={attachment.id}
              id={attachment.id}
              url={attachment.url}
              name={attachment.name}
              type={attachment.type}
            />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">No attachments available for this course.</p>
      )}
    </div>
  );
}

type CourseAttachmentCardProps = {
  id: string;
  url: string;
  name: string;
  type?: string;
};

const CourseAttachmentItem = ({ id, url, name, type }: CourseAttachmentCardProps) => {
  const getIcon = () => {
    switch (type?.toUpperCase()) {
      case "PDF":
        return <FaFilePdf className="text-red-500" size={18} />;
      case "IMAGE":
        return <FaFileImage className="text-green-500" size={18} />;
      case "DOC":
        return <FaFileAlt className="text-blue-500" size={18} />;
      case "VIDEO":
        return <FaFileVideo className="text-purple-500" size={18} />;
      default:
        return <FaFile className="text-gray-400" size={18} />;
    }
  };

  const truncate = (str: string, len: number) =>
    str.length > len ? `${str.slice(0, len - 3)}...` : str;

  return (
    <li
      key={id}
      className="flex items-center justify-between rounded-md border px-4 py-3 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center space-x-3 text-sm text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
      >
        {getIcon()}
        <span>{truncate(name, 50)}</span>
      </Link>
      <FaLink className="ml-2 text-blue-500" />
    </li>
  );
};
