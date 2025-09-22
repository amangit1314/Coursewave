import Link from "next/link";
import { FaLink } from "react-icons/fa6";

type CourseAttachmentCardProps = {
  id: string;
  url: string;
  name: string;
};

const CourseAttachmentItem = ({ id, url, name }: CourseAttachmentCardProps) => {
  return (
    <div
      className="text-md group hover flex cursor-pointer items-center justify-between pb-1 text-base text-gray-700 transition-all duration-200 hover:rounded-md hover:text-blue-500 dark:text-gray-400"
      key={id}
    >
      <Link
        className="text-sm tracking-tight group-hover:font-medium dark:hover:text-blue-500"
        href={url}
      >
        {name}
      </Link>
      <FaLink className="text-blue-600" />
    </div>
  );
};

export default CourseAttachmentItem;
