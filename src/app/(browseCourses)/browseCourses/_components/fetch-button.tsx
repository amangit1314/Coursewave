"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const FetchButton = (printCourses: any) => {
  return (
    <Button
      onClick={() => printCourses}
      className="flex justify-center my-8 mx-auto p-2 dark:text-white rounded-md bg-gray-900 dark:hover:text-gray-950 dark:hover:bg-gray-300 "
    >
      Fetch Courses
    </Button>
  );
};

export default FetchButton;
