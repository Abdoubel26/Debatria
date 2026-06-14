"use client";

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lightbulb, UserRoundPlus, MessageSquare, User } from "lucide-react";

type PropTypes = {
  userId: string | null
}

export default function SidebarLinks({userId} : PropTypes) {
  const pathname = usePathname();

  const links =  userId ? [
    { href: "/", label: "Feed", icon: Home },
    { href: "/mytopics", label: "My Topics", icon: Lightbulb },
    { href: "/joineddebates", label: "Joined Debates", icon: UserRoundPlus },
    { href: "/chat", label: "Debate Chat", icon: MessageSquare },
  ] 
  : 
  [
    { href: "/", label: "Feed", icon: Home },
    { href: "/mytopics", label: "My Topics", icon: Lightbulb },
    { href: "/joineddebates", label: "Joined Debates", icon: UserRoundPlus },
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
            className={`flex flex-row items-center text-lg gap-2 rounded-2xl p-3 transition-all active:bg-gray-700 ${
              isActive
                ? "bg-gray-900 text-white font-medium"
                : "text-gray-400 hover:bg-gray-900/50 hover:text-white"
            }`}
          >
            <Icon className={isActive ? "text-white" : "text-gray-400"} size={20} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </>
  );
}