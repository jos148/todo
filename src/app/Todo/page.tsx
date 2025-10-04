"use client"
import AppNav from "./components/app-nav"
import { Suspense } from "react";
import Main from "./components/main"


export default function Home() {

  return (
    <div className="bg-white dark:bg-muted w-full">
      <div className="border-b-2 border-gray-300">
        <Suspense fallback={<div>Loading...</div>}>
          <AppNav />
        </Suspense>
      </div>

      <div className="flex h-screen mt-7 mx-10 mb-10">
        <Main />
      </div>
    </div>
  );
}