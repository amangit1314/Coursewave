"use client";

import React from "react";

import { cn } from "@/lib/utils/utils";
import Image from "next/image";

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: string[];
}

const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
}: AvatarCirclesProps) => {
  const remaining = (numPeople ?? 0) - avatarUrls.length;

  if (avatarUrls.length === 0 && remaining <= 0) {
    return null;
  }

  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => (
        <Image
          key={index}
          className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
          src={url}
          width={40}
          height={40}
          alt={`Avatar ${index + 1}`}
        />
      ))}
      {remaining > 0 && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white dark:border-gray-800 dark:bg-white dark:text-black">
          +{remaining}
        </span>
      )}
    </div>
  );
};

export default AvatarCircles;
