import Link from "next/link";
import React from "react";

function Offerings() {
  const offerings = [
    {
      link: "",
      title: "Courses",
      description: "Find in-depth informative courses on various courses.",
    },
    {
      link: "",
      title: "Community Articles",
      description:
        "Read technical articles on vast development and technical topics!",
    },
    {
      link: "",
      title: "One on One Sessions",
      description: "Book one to one mentorships on various tech and projects.",
    },
    {
      link: "",
      title: "Sessions",
      description: "We organize sessions on latest technology trends.",
    },
  ];

  return (
    <div className="h-screen max-w-7xl mb-12 w-full">
      <div>
        <div className="font-bold tracking-tight text-center text-2xl text-zinc-800 dark:text-white ">
          What we Offer!
        </div>
        <p className="pt-4 text-[1rem] text-center text-zinc-700 dark:text-gray-200">
          Unlock Your Infinte Learning and Professional Protential with <br />
          our wide range of courses
          {/* <span className="text-blue-500 ml-1">Coursewave!</span> */}
        </p>
      </div>

      {/* links grid */}
      <div className="mx-auto mt-8 mb-16 grid gap-x-5 text-center grid-cols-2 lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        {offerings.map((offering, index) => {
          return (
            <OfferingsLinkItem
              key={index}
              link={offering.link}
              title={offering.title}
              description={offering.description}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Offerings;

const OfferingsLinkItem = ({
  key,
  link,
  title,
  description,
}: {
    key: any;
  link: string;
  title: string;
  description: string;
}) => {
  return (
    <Link
      key={key}
      href={
        link
          ? link
          : `https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app`
      }
      className="group rounded-3xl border border-transparent p-4 transition-all duration-300 hover:border-stroke hover:shadow-xl hover:border-zinc-800 dark:hover:border-zinc-400"
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2
        className={`mb-3 text-[1.2rem] tracking-tight text-zinc-800 dark:text-gray-50 font-semibold`}
      >
        {title ? title : "Courses"}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
      </h2>
      <p
        className={`m-0 max-w-[30ch] text-[1rem]  text-zinc-700 dark:text-gray-200`}
      >
        {description
          ? description
          : "Find in-depth informative courses on various courses."}
      </p>
    </Link>
  );
};
