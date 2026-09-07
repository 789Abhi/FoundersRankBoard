"use client";

import React from "react";
import { LeaderboardStats } from "../types";
import { formatUSD } from "../lib/utils";
import { IndianRupee, Globe, MousePointerClick, Trophy, ArrowUpRight, ShieldCheck } from "lucide-react";

interface BigBottomRevenueProps {
  stats: LeaderboardStats;
  onOpenSubmit: (initialAmount?: number) => void;
}

export const BigBottomRevenue: React.FC<BigBottomRevenueProps> = ({
  stats,
  onOpenSubmit,
}) => {
  const outbidOneAmount = stats.topBidUSD > 0 ? stats.topBidUSD + 5 : 5;

  return (
    <section id="revenue-section" className="relative mt-12 border-t border-zinc-200/80 dark:border-[#16241a] bg-gradient-to-b from-zinc-100/80 via-emerald-50/30 to-zinc-50 dark:from-[#080d0a] dark:via-[#09120c] dark:to-[#060a08] py-14 sm:py-18 overflow-hidden transition-colors">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Small pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
          <IndianRupee className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Platform Transparency Ledger</span>
        </div>

        {/* Small label above giant number */}
        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Total OnBoard
        </p>

        {/* The BIG REVENUE in USD */}
        <div className="mt-2 text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight select-none">
          <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 dark:from-emerald-300 dark:via-emerald-400 dark:to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
            {formatUSD(stats.totalRevenueUSD)}
          </span>
        </div>

        <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Every rupee directly boosts ranking priority and fuels platform marketing to drive outbound clicks to listed domains.
        </p>

        {/* Supporting Metric Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
          {/* Box 1: Domains Listed */}
          <div className="rounded-2xl border border-zinc-200 dark:border-[#1b2b1f] bg-white/90 dark:bg-[#0c140f]/80 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Websites Listed
              </span>
              <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">
              {stats.totalListings}
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Active domains on the leaderboard</p>
          </div>

          {/* Box 2: Total Clicks Delivered */}
          <div className="rounded-2xl border border-zinc-200 dark:border-[#1b2b1f] bg-white/90 dark:bg-[#0c140f]/80 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Clicks Delivered
              </span>
              <MousePointerClick className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.totalClicksDelivered.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Direct referral visitors generated</p>
          </div>

          {/* Box 3: Top Bid */}
          <div className="rounded-2xl border border-emerald-500/30 dark:border-emerald-500/20 bg-white/90 dark:bg-[#0c140f]/80 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Current #1 Spot
              </span>
              <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">
              {formatUSD(stats.topBidUSD)}
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {stats.topBidUSD > 0 ? `Outbid with ${formatUSD(outbidOneAmount)}` : `Be first to claim with $5`}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-7 flex justify-center">
          <button
            onClick={() => onOpenSubmit(outbidOneAmount)}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-6 py-2.5 text-xs sm:text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/25 transition-all"
          >
            <span>
              {stats.topBidUSD > 0 ? `Claim #1 Spot with ${formatUSD(outbidOneAmount)}` : "Claim #1 Spot from $5"}
            </span>
            <ArrowUpRight className="h-4 w-4 stroke-[3]" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Instant live placement • Zero login required</span>
        </div>
      </div>
    </section>
  );
};
