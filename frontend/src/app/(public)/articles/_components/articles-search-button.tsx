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
      className={`hidden text-gray-800 dark:text-white lg:ml-4 lg:flex lg:items-center lg:justify-start lg:rounded-md lg:border lg:py-3 lg:pl-2 lg:pr-3 lg:hover:lg:border-blue-500 ${
        isFormOpen ? "" : "hidden"
      }`}
      onSubmit={onSearch}
    >
      <BiSearchAlt className="ml-1 mr-2" size={20} />
      <input
        className="item-center flex justify-start border-none bg-transparent text-sm outline-none dark:text-white"
        type="text"
        placeholder="Search article ..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      <div className="ml-4 flex items-center justify-center space-x-2">
        {/* <FaSort /> */}
        <CiCircleRemove
          size={20}
          className="cursor-pointer rounded-full hover:shadow-xl"
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
      className="relative mr-2 rounded-md border bg-transparent transition duration-150 ease-in-out dark:text-white"
    >
      <BiSearchAlt
        size={14}
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-200 dark:text-white"
      />
    </Button>
  );

  return (
    <div className="flex items-center justify-center">
      {isFormOpen ? form : searchButton}
    </div>
  );
};

export default ArticlesSearchButton;
