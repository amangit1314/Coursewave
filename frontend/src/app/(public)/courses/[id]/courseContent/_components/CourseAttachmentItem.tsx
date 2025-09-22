import React from "react";
import Link from "next/link";
import {
  FaLink,
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFile,
} from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";

type CourseAttachmentCardProps = {
  id: string;
  url: string;
  name: string;
  type?: string;
};

const CourseAttachmentItem = ({
  id,
  url,
  name,
  type,
}: CourseAttachmentCardProps) => {
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

export default CourseAttachmentItem;