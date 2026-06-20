"use client";

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lightbulb, UserRoundPlus, MessageSquare, User } from "lucide-react";

export default function SidebarLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Feed", icon: Home },
    { href: "/mytopics", label: "My Topics", icon: Lightbulb },
    { href: "/joineddebates", label: "Joined Debates", icon: UserRoundPlus },
    { href: "/chat", label: "Debate Chat", icon: MessageSquare },
  ] 
 

  return (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-row items-center lg:text-lg md:text-sm md:whitespace-nowrap gap-2 rounded-2xl p-3 transition-all active:bg-zinc-300 dark:active:bg-gray-700 ${
              isActive
                ? "bg-zinc-200/70 text-zinc-900 font-medium dark:bg-gray-900 dark:text-white"
                : "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-gray-900/50 dark:hover:text-white"
            }`}
          >
            <Icon className={isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-gray-400"} size={20} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </>
  );
}