"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";

export const ThemeModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex justify-center cursor-pointer items-center h-10 w-10 rounded-md dark:bg-transparent dark:hover:bg-zinc-800 transition-all duration-200"
        >
          {theme === 'dark' ? (
            <SunIcon className="h-9 w-9" />
          ) : (
            <MoonIcon className="h-9 w-9" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-800 border-stroke border-zinc-100 shadow-xl shadow-zinc-400 dark:shadow-zinc-900 dark:border-zinc-800 text-sm z-50">
        <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer rounded-md">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer rounded-md">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer rounded-md">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
