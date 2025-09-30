"use client"

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { FaAppStoreIos, FaAtlas, FaBell, FaBan } from "react-icons/fa";
import Image from "next/image";
import { SearchUsers } from "./searchuser";




export default function AppNav() {

  const { theme, setTheme } = useTheme();

  const users = [
  {
    id: "1",
    name: "Hi Paul",
    avatar: "https://i.pravatar.cc/300?u=iu",
  },]
  
  return (
    <div className="w-full top-0 z-40 dark:bg-muted dark:text-white bg-white border-b">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
        {/* Left side: search bar */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SearchUsers  />
        </div>

        {/* Scrollable Buttons on mobile */}
        <div className="flex gap-2 overflow-x-auto sm:overflow-visible w-full sm:w-auto py-2 sm:py-0">
          <Button variant="outline">
            <FaAtlas />
          </Button>
          <Button variant="outline">
            <FaAppStoreIos />
          </Button>
          <Button className="bg-blue-900 text-white hover:bg-blue-800">
            Toggle Mode
          </Button>
          <Button className="bg-teal-600 text-white hover:bg-teal-700">
            VIM
          </Button>
          <Button className="bg-purple-600 text-white hover:bg-purple-700">
            HIK
          </Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            BHV
          </Button>
          <Button className="bg-gray-600 text-white hover:bg-gray-700">
            Bataleka
          </Button>
          <Button className="bg-yellow-600 text-white hover:bg-yellow-700">
            <FaBan />
          </Button>
          <Button className="bg-gray-600 text-white hover:bg-gray-700 rounded-full">
            <FaBell />
          </Button>
        </div>

        {/* User avatar and theme toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
          <Button variant="outline" className="rounded-full pl-0 pr-2 gap-2">
            <Image
              src={users[0].avatar}
              alt={users[0].name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
            <span className="hidden md:inline">{users[0].name}</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </div>
  );
}