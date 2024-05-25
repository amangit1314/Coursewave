"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BiSearchAlt } from "react-icons/bi";
import { CiCircleRemove } from "react-icons/ci";
import { Button } from "@/components/ui/button";

const ArticlesSearchButton = () => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const encodedSearchQuery = encodeURI(searchQuery);
    router.push(`/articles/?q=${encodedSearchQuery}`);
    console.log("current query", encodedSearchQuery);
  };

  const form = (
    <form
      className={`hidden lg:ml-4 lg:flex text-gray-800 dark:text-white lg:pl-2 lg:pr-3 lg:py-3 lg:border lg:hover:lg:border-blue-500 lg:justify-start lg:rounded-md lg:items-center ${
        isFormOpen ? "" : "hidden"
      }`}
      onSubmit={onSearch}
    >
      <BiSearchAlt className="ml-1 mr-2" size={20} />
      <input
        className="bg-transparent border-none outline-none flex justify-start item-center text-sm dark:text-white"
        type="text"
        placeholder="Search article ..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      <div className="flex justify-center items-center space-x-2 ml-4">
        {/* <FaSort /> */}
        <CiCircleRemove
          size={20}
          className="cursor-pointer hover:shadow-xl rounded-full"
          onClick={toggleForm}
        />
      </div>
    </form>
  );

  const searchButton = (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleForm} // Trigger form opening on button click
      className="relative bg-transparent border dark:text-white mr-2 rounded-md transition duration-150 ease-in-out"
    >
      <BiSearchAlt
        size={14}
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-200  dark:text-white "
      />
    </Button>
  );

  return (
    <div className="flex justify-center items-center">
      {isFormOpen ? form : searchButton}
    </div>
  );
};

export default ArticlesSearchButton;
