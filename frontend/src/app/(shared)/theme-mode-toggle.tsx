"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { BiSun, BiMoon } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ThemeModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex justify-center cursor-pointer items-center h-10 w-10 rounded-md dark:bg-transparent dark:hover:bg-zinc-800 transition-all duration-200"
        >
          <BiSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <BiMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
