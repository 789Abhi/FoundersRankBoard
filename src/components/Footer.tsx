"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

interface FooterProps {
  onResetData: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onResetData }) => {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-10 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo & tagline */}
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <p className="text-[11px] text-zinc-500">
              The Pay-to-Rank Domain Board • Priced in USD ($)
            </p>
          </div>

          {/* Reset Demo Data Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-black dark:hover:text-zinc-200 transition"
              title="Reset leaderboard data"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset Board</span>
            </button>
            <span className="text-xs text-zinc-500">
              © {new Date().getFullYear()} BidToRankUp. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
