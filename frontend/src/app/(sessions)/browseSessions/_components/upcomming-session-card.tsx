"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Badge, Select, SelectItem } from "@tremor/react";
import { CalculatorIcon } from "lucide-react";

export function UpcommingSessionsCard() {
  const [value, setValue] = React.useState("");
  const [randomColor, setRandomColor] = React.useState("");

  useEffect(() => {
    // Generate a random color on page load
    const colors = ["red", "green", "blue", "orange", "purple", "yellow"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    setRandomColor(colors[randomIndex]);
  }, []); // Empty dependency array runs the effect only once on mount

  return (
    <div className="rounded-xl w-full cursor-pointer backdrop-blur-xl p-4 hover:shadow-xl flex border border-gray-300 mt-2 mb-8">
      {/* <div
        className={`bg-${randomColor} h-[4.5rem] w-[2px] rounded-full`}
      ></div> */}

      <div className="justify-start items-start py-auto">
        <p className="uppercase text-gray-600 text-xs dark:text-gray-300">
          Tuesday, jan 3 at 3:40 pm (pt)
        </p>
        <div className="justify-between">
          <div className="flex">
            <p className="text-base font-medium tracking-tight">
              One-on-One Session (40m){" "}
            </p>
          </div>
        </div>
        <div className="flex justify-start">
          {/* instructor name and image */}
          <div className="flex justify-start items-center mt-[6px]">
            <Image
              className="h-8 w-8 ring-1 ring-blue-500 rounded-full"
              src="/assets/images/user/user-01.png"
              alt="p"
              height={31}
              width={31}
              content="cover"
            />
            <p className="text-sm ml-[6px] tracking-tight dark:text-gray-300">John Doe</p>
          </div>

          {/* <div
            className=" mx-2 text-xs px-2 flex justify-between items-center font-medium border border-green-500 text-green-500 tracking-tight bg-transparent rounded-full"
          
          >
            Confirmed
          </div> */}
        </div>
      </div>
    </div>
  );
}

{
  /* modify */
}
{
  /* <div className="max-w-sm mx-auto space-y-6">
            <Select value={value} onValueChange={setValue}>
              <SelectItem value="1">Kilometers</SelectItem>
              <SelectItem value="2">Meters</SelectItem>
              <SelectItem value="3">Miles</SelectItem>
              <SelectItem value="4">Nautical Miles</SelectItem>
            </Select>
          </div> */
}
