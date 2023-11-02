import React from 'react'

function Offerings() {
  return (
      <div className="max-h-screen max-w-7xl mb-12 w-full h-full">
          <div className="font-bold text-center text-2xl">What we Offer!</div>
          <p className="pt-4 text-md opacity-80  text-center">Unlock Your Infinte Learning and Professional Protential with <br /> wide range of courses of <span className="text-blue-500">Coursewave!</span></p>
          <div className="mx-auto mt-8 mb-16 grid text-center grid-cols-2 lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
              <a
                  href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                  className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-blue-500 hover:bg-white hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <h2 className={`mb-3 text-2xl font-semibold`}>
                      Courses{' '}
                      <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                          {/* -&gt; */}
                      </span>
                  </h2>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-80`}>
                      Find in-depth informative courses on various courses.
                  </p>
              </a>

              <a
                  href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-blue-500 hover:bg-white hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <h2 className={`mb-3 text-2xl font-semibold`}>
                      Articles{' '}
                      <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                          {/* -&gt; */}
                      </span>
                  </h2>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-80`}>
                      Read technical articles on vast development and technical topics!
                  </p>
              </a>

              {/* <a
                  href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                  className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-blue-500 hover:bg-white hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                  target="_blank"
                  rel="noopener noreferrer"
              > */}
                  {/* <h2 className={`mb-3 text-2xl font-semibold`}> */}
                      {/* Roadmaps{' '} */}
                      {/* <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"> */}
                          {/* -&gt; */}
                      {/* </span>
                  </h2> */}
                  {/* <p className={`m-0 max-w-[30ch] text-sm opacity-80`}>
                      We have a comprehensive collection of roadmaps and guides on many career paths.
                  </p> */}
              {/* </a> */}

              <a
                  href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                  className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-blue-500 hover:bg-white hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <h2 className={`mb-3 text-2xl font-semibold`}>
                      Mentorships{' '}
                      <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                          {/* -&gt; */}
                      </span>
                  </h2>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-80`}>
                      Book one to one mentorships on various tech and projects.
                  </p>
              </a>

              <a
                  href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                  className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-blue-500 hover:bg-white hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <h2 className={`mb-3 text-2xl font-semibold`}>
                      Sessions{' '}
                      <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                          {/* -&gt; */}
                      </span>
                  </h2>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-80`}>
                      We organize sessions on latest technology trends.
                  </p>
              </a>
          </div></div>
  )
}

export default Offerings