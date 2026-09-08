"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { BrandLogo } from "./BrandLogo";
import { LeaderboardStats } from "../types";

interface NavbarProps {
  onOpenSubmit: () => void;
  stats?: LeaderboardStats;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSubmit, stats }) => {
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-[#141f17] bg-white/85 dark:bg-[#060907]/85 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Brand */}
        <Link
          href="/"
          className="cursor-pointer flex-shrink-0 min-w-0"
        >
          <BrandLogo size="md" />
        </Link>

        {/* Live Traffic Pill with REAL numbers (Desktop) */}
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
        <div className="flex items-center gap-1.5 sm:gap-3 text-xs font-medium text-zinc-600 dark:text-zinc-400 flex-shrink-0">
          <Link
            href="/about"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition hidden md:block"
          >
            About Us
          </Link>
          <Link
            href="/rules"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition hidden md:block"
          >
            Rules
          </Link>
          <Link
            href="/faq"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition hidden md:block"
          >
            FAQ
          </Link>
          <Link
            href="/privacy"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition hidden lg:block"
          >
            Privacy
          </Link>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            suppressHydrationWarning
            aria-label="Toggle Light/Dark Theme"
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl border border-zinc-200 dark:border-[#223526] bg-zinc-100 dark:bg-[#0c140f] text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition active:scale-90 shadow-sm flex-shrink-0"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 transition-transform rotate-0" />
              ) : (
                <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-700 transition-transform rotate-0" />
              )
            ) : (
              <div className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </button>

          {/* List Domain CTA */}
          <button
            onClick={onOpenSubmit}
            suppressHydrationWarning
            className="inline-flex items-center gap-1 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-zinc-950 shadow-md shadow-emerald-500/20 transition-all flex-shrink-0 whitespace-nowrap"
          >
            <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3]" />
            <span className="hidden sm:inline">List Domain ($5)</span>
            <span className="sm:hidden">List ($5)</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            suppressHydrationWarning
            className="flex h-7 w-7 sm:h-8 sm:w-8 md:hidden items-center justify-center rounded-xl border border-zinc-200 dark:border-[#223526] bg-zinc-100 dark:bg-[#0c140f] text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200/80 dark:border-[#162319] bg-white dark:bg-[#080d09] px-4 py-3 space-y-2 shadow-2xl animate-in slide-in-from-top-2">
          {/* Live Mobile Stats */}
          <div className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-zinc-50 dark:bg-[#0f1712] text-[11px] border border-zinc-200/60 dark:border-[#1a2b1f]">
            <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {stats?.onlineCount || 1} online
            </span>
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">
              {(stats?.totalVisitors || 1).toLocaleString("en-IN")} total visitors
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-semibold">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-[#0e1610] hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              About Us
            </Link>
            <Link
              href="/rules"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-[#0e1610] hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              Rules
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-[#0e1610] hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              FAQ
            </Link>
            <Link
              href="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-[#0e1610] hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
