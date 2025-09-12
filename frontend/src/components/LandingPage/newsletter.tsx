import Link from "next/link";
import React from "react";

const Newsletter = () => {
  return (
    <section className="bg-zinc-900">
      <div className="mx-auto w-full px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-md sm:text-center">
          {/* heading text */}
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white dark:text-white sm:text-4xl">
            Sign up for our newsletter
          </h2>

          {/* sub text */}
          <p className="mx-auto mb-8 max-w-2xl text-base font-light text-gray-400 sm:text-xl md:mb-12">
            Stay up to date with the roadmap progress, announcements and
            exclusive discounts feel free to sign up with your email.
          </p>

          {/* form */}
          <form action="#">
            <div className="mx-auto mb-3 max-w-screen-sm items-center space-y-4 sm:flex sm:space-y-0">
              <div className="relative w-full">
                <label
                  htmlFor="email"
                  className="mb-2 hidden text-sm font-medium text-gray-300"
                >
                  Email address
                </label>

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <input
                  className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-3 pl-10 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:rounded-none sm:rounded-l-lg"
                  placeholder="Enter your email"
                  type="email"
                  id="email"
                  required={true}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="dark:hover:blue-700 w-full cursor-pointer rounded-lg border border-blue-600 bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-800 sm:rounded-none sm:rounded-r-lg"
                >
                  Subscribe
                </button>
              </div>
            </div>
            <div className="newsletter-form-footer mx-auto max-w-screen-sm text-left text-sm text-gray-500 dark:text-gray-300">
              We care about the protection of your data.{" "}
              <Link
                href="#"
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                Read our Privacy Policy
              </Link>
              .
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
