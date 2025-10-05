"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative p-0 w-9 h-9 lg:w-12 lg:h-12 flex items-center justify-center"
        >
          <Sun className="h-5 w-5 scale-100 transition-all dark:scale-0" />
          <Moon className="absolute h-5 w-5 scale-0 transition-all dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="mt-2 w-24 p-0 rounded-md shadow-lg"
      >
        <DropdownMenuItem
          className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
