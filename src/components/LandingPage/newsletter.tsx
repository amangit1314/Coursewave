import Link from "next/link";
import React from "react";

const Newsletter = () => {
  return (
    <section className="bg-zinc-900">
      <div className="py-8 px-4 mx-auto w-full lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md sm:text-center">
          {/* heading text */}
          <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-white sm:text-4xl dark:text-white">
            Sign up for our newsletter
          </h2>

          {/* sub text */}
          <p className="mx-auto mb-8 max-w-2xl font-light md:mb-12 sm:text-xl text-gray-400 text-base">
            Stay up to date with the roadmap progress, announcements and
            exclusive discounts feel free to sign up with your email.
          </p>

        {/* form */}
          <form action="#">
            <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
              <div className="relative w-full">
                <label
                  htmlFor="email"
                  className="hidden mb-2 text-sm font-medium text-gray-300"
                >
                  Email address
                </label>

                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <input
                  className="block p-3 pl-10 w-full text-sm rounded-lg border sm:rounded-none sm:rounded-l-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  type="email"
                  id="email"
                  required={true}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer border-blue-600 sm:rounded-none sm:rounded-r-lg hover:bg-blue-800 focus:ring-4 bg-blue-600 dark:hover:blue-700 focus:ring-blue-800"
                >
                  Subscribe
                </button>
              </div>
            </div>
            <div className="mx-auto max-w-screen-sm text-sm text-left text-gray-500 newsletter-form-footer dark:text-gray-300">
              We care about the protection of your data.{" "}
              <Link
                href="#"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
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
