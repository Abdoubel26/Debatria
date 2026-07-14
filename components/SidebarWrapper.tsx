"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export default function SidebarWrapper({ children }: SidebarWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`relative hidden md:flex flex-col gap-2 p-3 h-full border-r border-zinc-200/80 bg-zinc-50 text-zinc-800 select-none dark:border-gray-800 dark:bg-gray-900 dark:text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[70px]" : "w-[22%] min-w-[200px] max-w-[300px]"
      }`}
    >

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-40 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-xs hover:bg-zinc-50 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-400 dark:hover:bg-gray-800"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>


      <div className={`h-full flex flex-col gap-2 ${isCollapsed ? "items-center" : ""}`}>

        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // @ts-ignore
            return React.cloneElement(child, { isCollapsed });
          }
          return child;
        })}
      </div>
    </div>
  );
}