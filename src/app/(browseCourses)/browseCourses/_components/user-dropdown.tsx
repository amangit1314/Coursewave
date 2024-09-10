import Image from "next/image";
import Link from "next/link";
import React from "react";

const UserDropdown = () => {
  return (
    <div>
      {/* user image */}
      <Image
        id="avatarButton"
        typeof="button"
        data-dropdown-toggle="userDropdown"
        data-dropdown-placement="bottom-start"
        className="h-10 w-10 cursor-pointer rounded-full"
        src="/images1.jpg"
        alt="User dropdown"
        height={10}
        width={10}
      />

      <div
        id="userDropdown"
        className="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
      >
        {/* name and email */}
        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
          <div>Bonnie Green</div>
          <div className="truncate font-medium">name@flowbite.com</div>
        </div>

        {/* dropdown options list  */}
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="avatarButton"
        >
          <li>
            <Link
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="hover-bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white block px-4 py-2"
            >
              Settings
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="hover-bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white block px-4 py-2"
            >
              Earnings
            </Link>
          </li>
        </ul>

        {/* signout */}
        <div className="py-1">
          <Link
            href="#"
            className="hover-bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
          >
            Sign out
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
