import Image from 'next/image';
import React from 'react';

const UserDropdown = () => {
    return (
        <div>
            <Image
                id="avatarButton"
                typeof='button'
                data-dropdown-toggle="userDropdown"
                data-dropdown-placement="bottom-start"
                className="w-10 h-10 rounded-full cursor-pointer"
                src="/images1.jpg"
                alt="User dropdown"
                height={10}
                width={10}
                // fill={true}
            />
            <div id="userDropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div>Bonnie Green</div>
                    <div className="font-medium truncate">name@flowbite.com</div>
                </div>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover-bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white">Settings</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover-bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white">Earnings</a>
                    </li>
                </ul>
                <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover-bg-gray-100 dark:hover-bg-gray-600 dark:text-gray-200 dark:hover-text-white">Sign out</a>
                </div>
            </div>
        </div>
    );
}

export default UserDropdown;
