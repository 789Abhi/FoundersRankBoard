"use client";

import React from "react";

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  showText = true,
  size = "md",
}) => {
  const iconSize = size === "sm" ? "h-6 w-6 sm:h-7 sm:w-7" : size === "lg" ? "h-9 w-9 sm:h-10 sm:w-10" : "h-7 w-7 sm:h-8 sm:w-8";
  const textSize = size === "sm" ? "text-xs sm:text-sm" : size === "lg" ? "text-lg sm:text-2xl" : "text-xs sm:text-base md:text-lg";

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2.5 ${className}`}>
      {/* Clean Aerodynamic Rank-Up Emblem */}
      <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-zinc-950 dark:bg-[#070b08] border border-zinc-200 dark:border-emerald-500/30 p-1 sm:p-1.5 shadow-sm flex-shrink-0 transition-transform hover:scale-105 ${iconSize}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Subtle background glow */}
          <circle cx="16" cy="16" r="13" fill="#10B981" fillOpacity="0.1" />

          {/* Primary ascending rank chevron */}
          <path
            d="M7 19L16 10L25 19"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Secondary supporting foundation chevron */}
          <path
            d="M10 24L16 18L22 24"
            stroke="#34D399"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.75"
          />

          {/* Golden #1 Summit Beacon */}
          <circle cx="16" cy="5.5" r="2" fill="#F59E0B" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1 min-w-0">
          <span className={`font-black tracking-tight text-zinc-900 dark:text-white ${textSize} whitespace-nowrap`}>
            Founders<span className="text-emerald-600 dark:text-emerald-400">RankBoard</span>
          </span>
          <span className="hidden md:inline-flex items-center rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
            .com
          </span>
        </div>
      )}
    </div>
  );
};
