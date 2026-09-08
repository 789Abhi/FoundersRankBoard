"use client";

import React from "react";
import Link from "next/link";
import { Plus, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { BrandLogo } from "./BrandLogo";
import { LeaderboardStats } from "../types";

interface NavbarProps {
  onOpenSubmit: () => void;
  stats?: LeaderboardStats;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSubmit, stats }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-[#141f17] bg-white/85 dark:bg-[#060907]/85 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="cursor-pointer"
        >
          <BrandLogo size="md" />
        </Link>

        {/* Live Traffic Pill with REAL numbers */}
        <a
          href="#revenue-section"
          className="hidden lg:inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-[#2d2220] bg-zinc-50 dark:bg-[#140e0c] px-3.5 py-1 text-xs text-zinc-700 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-[#42322f] shadow-sm transition"
        >
          <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-[#22c55e]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {stats?.onlineCount || 1} online
          </span>
          <span className="text-zinc-400 dark:text-zinc-600">·</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {(stats?.totalVisitors || 1).toLocaleString("en-IN")} {(stats?.totalVisitors || 1) === 1 ? "visitor" : "visitors"}
          </span>
          <span className="text-zinc-400 dark:text-zinc-600">·</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">
            stats&rarr;
          </span>
        </a>

        {/* Navigation Links + Theme Toggle + CTA */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <Link
            href="/about"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition hidden sm:block"
          >
            About Us
          </Link>
          <Link
            href="/rules"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition hidden sm:block"
          >
            Rules
          </Link>
          <Link
            href="/faq"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition hidden sm:block"
          >
            FAQ
          </Link>
          <Link
            href="/privacy"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition hidden md:block"
          >
            Privacy
          </Link>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark Theme"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 dark:border-[#223526] bg-zinc-100 dark:bg-[#0c140f] text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition active:scale-90 shadow-sm"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-700 transition-transform rotate-0" />
            )}
          </button>

          {/* List Domain CTA */}
          <button
            onClick={onOpenSubmit}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>List Domain ($5)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
