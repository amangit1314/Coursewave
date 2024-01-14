import Link from "next/link";
import React from "react";

function Offerings() {
  return (
    <div className="h-screen max-w-7xl mb-12 w-full">
      <div>
        <div className="font-bold tracking-tight text-center text-2xl text-[#333333] dark:text-white ">
          What we Offer!
        </div>
        <p className="pt-4 text-[1rem] text-center text-[#333333] dark:text-gray-200">
          Unlock Your Infinte Learning and Professional Protential with <br />
          our wide range of courses
          {/* <span className="text-blue-500 ml-1">Coursewave!</span> */}
        </p>
      </div>

      {/* links grid */}
      <div className="mx-auto mt-8 mb-16 grid text-center grid-cols-2 lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:border-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-[1.2rem] tracking-tight font-semibold`}>
            Courses
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
          </h2>
          <p
            className={`m-0 max-w-[30ch] text-[1rem]  text-[#333333] dark:text-gray-200`}
          >
            Find in-depth informative courses on various courses.
          </p>
        </Link>

        <Link
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:border-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-[1.2rem] tracking-tight font-semibold`}>
            Community Articles
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
          </h2>
          <p
            className={`m-0 max-w-[30ch] text-[1rem] text-[#333333] dark:text-gray-200  `}
          >
            Read technical articles on vast development and technical topics!
          </p>
        </Link>

        <Link
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:border-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-[1.2rem] tracking-tight font-semibold`}>
            One on One Sessions
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
          </h2>
          <p
            className={`m-0 max-w-[30ch] text-[1rem] text-[#333333] dark:text-gray-200`}
          >
            Book one to one mentorships on various tech and projects.
          </p>
        </Link>

        <Link
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:border-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-[1.2rem] tracking-tight  font-semibold`}>
            Sessions
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
          </h2>
          <p
            className={`m-0 max-w-[30ch] text-[1rem] text-[#333333] dark:text-gray-200`}
          >
            We organize sessions on latest technology trends.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Offerings;
