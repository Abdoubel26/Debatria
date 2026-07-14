"use client";

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lightbulb, UserRoundPlus, MessageSquare } from "lucide-react";

interface SidebarLinksProps {
  isCollapsed?: boolean;
  mode?: "sidebar" | "bottombar";
}

export default function SidebarLinks({ isCollapsed = false, mode = "sidebar" }: SidebarLinksProps) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Feed", icon: Home },
    { href: "/mytopics", label: "My Topics", icon: Lightbulb },
    { href: "/joineddebates", label: "Joined", icon: UserRoundPlus },
    { href: "/chat", label: "Chat", icon: MessageSquare },
  ];

  if (mode === "bottombar") {
    return (
      <div className="flex flex-row items-center justify-around w-full h-full px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? "text-indigo-600 dark:text-violet-400 font-semibold"
                  : "text-zinc-500 dark:text-gray-400"
              }`}
            >
              <Icon 
                className={isActive ? "text-indigo-600 dark:text-violet-400" : "text-zinc-400 dark:text-gray-400"} 
                size={20} 
              />
              <span className="text-[10px] tracking-tight">{link.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  // Desktop Sidebar mode (your existing UI)
  return (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            title={isCollapsed ? link.label : undefined}
            className={`flex flex-row items-center gap-2 rounded-2xl p-3 transition-all active:bg-zinc-300 dark:active:bg-gray-700 ${
              isCollapsed 
                ? "justify-center w-full" 
                : "lg:text-lg md:text-sm md:whitespace-nowrap"
            } ${
              isActive
                ? "bg-zinc-200/70 text-zinc-900 font-medium dark:bg-gray-900 dark:text-white"
                : "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-gray-900/50 dark:hover:text-white"
            }`}
          >
            <Icon 
              className={`${isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-gray-400"} shrink-0`} 
              size={20} 
            />
            {!isCollapsed && (
              <span className="transition-opacity duration-200">{link.label}</span>
            )}
          </Link>
        );
      })}
    </>
  );
}