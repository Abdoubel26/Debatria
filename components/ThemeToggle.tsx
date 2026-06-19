"use client";

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from "lucide-react";
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-22 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-800/60" />;
  }

  return (
    <div 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
      className="flex items-center gap-2 rounded-lg cursor-pointer px-3 py-1.5 bg-slate-100/70 hover:bg-slate-200/70 text-slate-600 dark:bg-slate-800/60 dark:hover:bg-slate-800/80 transition text-sm font-medium dark:text-slate-100"
    >
      { theme === "dark" ? (
        <Sun className="text-amber-500 dark:text-white" size={20} />
      ) : (
        <Moon className="text-slate-500 dark:text-white" size={20} />
      ) }  
    </div>

  );
}

export default ThemeToggle;