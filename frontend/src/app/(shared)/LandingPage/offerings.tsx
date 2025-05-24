// import { absoluteUrl } from "@/utils/utils";
import Link from "next/link";
import React from "react";

const Offerings = () => {
  const offerings = [
    {
      // link: absoluteUrl("/browseCourses"),
      link: "/browseCourses",
      title: "Courses",
      description: "Find in-depth informative courses on various courses.",
    },
    {
      // link: absoluteUrl("/browseArticles"),
      link: "/articles",
      title: "Community Articles",
      description:
        "Read technical articles on vast development and technical topics!",
    },
    {
      // link: absoluteUrl("/browseSessions"),
      link: "/browseSessions",
      title: "One on One Sessions",
      description: "Book one to one mentorships on various tech and projects.",
    },
    {
      // link: absoluteUrl("/browseSessions"),
      link: "/browseSessions",
      title: "Sessions",
      description: "We organize sessions on latest technology trends.",
    },
  ];

  return (
    <div className="h-full w-full max-w-7xl">
      <div>
        <div className="text-center text-2xl font-bold tracking-tight text-zinc-800 dark:text-white">
          What we Offer!
        </div>
        <p className="pt-4 text-center text-[1rem] text-zinc-700 dark:text-gray-200">
          Unlock Your Infinte Learning and Professional Protential with <br />
          our wide range of courses
          {/* <span className="text-blue-500 ml-1">Coursewave!</span> */}
        </p>
      </div>

      {/* links grid */}
      <div className="mx-auto mt-8 grid grid-cols-2 gap-5 text-center lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:gap-x-5 lg:text-left">
        {offerings.map((offering, index) => {
          return (
            <div key={index}>
              <OfferingsLinkItem
                link={offering.link}
                title={offering.title}
                description={offering.description}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Offerings;

const OfferingsLinkItem = ({
  link,
  title,
  description,
}: {
  link: string;
  title: string;
  description: string;
}) => {
  return (
    <Link
      href={
        link
          ? link
          : `https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app`
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* h-[140px] w-[241px] */}
      <div className="border-stroke hover:border-stroke group h-[12.5rem] md:h-[9rem] space-y-3 rounded-2xl border p-4 transition-all duration-300 hover:border-zinc-800 hover:shadow-xl dark:hover:border-zinc-400">
        <h2 className="text-[1.2rem] font-semibold tracking-tight text-zinc-800 dark:text-gray-50">
          {title ? title : "Courses"}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </h2>
        <p className="w-full text-[1rem] text-zinc-700 dark:text-gray-200">
          {description
            ? description
            : "Find in-depth informative courses on various courses."}
        </p>
      </div>
    </Link>
  );
};
