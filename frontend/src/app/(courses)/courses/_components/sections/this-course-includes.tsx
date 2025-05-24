import React from "react";
import { TbCertificate } from "react-icons/tb";
import { BsPersonVideo2 } from "react-icons/bs";
import { GoProjectTemplate } from "react-icons/go";
import { FaDownload } from "react-icons/fa";

export default function ThisCourseIncludes() {
  return (
    <div className="flex justify-between items-center py-auto">
      <div className="flex flex-col items-start mt-2 p-6 md:p-0">
        <h3 className="mb-4 tracking-tight text-xl font-semibold">
          This course includes:
        </h3>
        <div className="grid grid-cols-2 md:gap-x-8 gap-6 justify-start md:pb-6 ">
          <ThisCourseIncludesItem
            icon={<BsPersonVideo2 />}
            text="300+ video lectures"
          />
          <ThisCourseIncludesItem
            icon={<TbCertificate />}
            text="Certificate of Completion"
          />
          <ThisCourseIncludesItem
            icon={<FaDownload />}
            text="20+ Downloadable Resources"
          />
          <ThisCourseIncludesItem
            icon={<GoProjectTemplate />}
            text="Complete E-commerce Project"
          />
        </div>
      </div>

      {/* <TechnologiesLearned /> */}
    </div>
  );
}

function ThisCourseIncludesItem({ icon, text }: any) {
  return (
    <div className="flex justify-start items-center">
      <div>{icon}</div>
      <p className="pl-3 md:pl-2 text-md text-base text-gray-700 dark:text-gray-400">
        {text}
      </p>
    </div>
  );
}
