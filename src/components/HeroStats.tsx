"use client";

import React from "react";
import { LeaderboardStats } from "../types";
import { formatUSD } from "../lib/utils";
import { 
  Trophy, 
  MousePointerClick, 
  Globe, 
  IndianRupee, 
  Zap, 
  Sparkles, 
  Flame,
  ArrowUpRight
} from "lucide-react";

interface HeroStatsProps {
  stats: LeaderboardStats;
  onOpenSubmit: (initialAmount?: number) => void;
}

export const HeroStats: React.FC<HeroStatsProps> = ({ stats, onOpenSubmit }) => {
  const outbidOneAmount = stats.topBidUSD > 0 ? stats.topBidUSD + 5 : 500;

  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-14 sm:pb-14">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-orange-500/10 to-rose-500/5 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Sub-badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md mb-6 shadow-sm">
          <Flame className="h-4 w-4 text-orange-400 animate-pulse" />
          <span>Frictionless Marketing • 0 Login • 100% Instant Ranking</span>
        </div>

        {/* Main Headline */}
        <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          The <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">Pay-to-Rank</span> Leaderboard for High-Growth Startups
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-300 sm:text-lg sm:leading-relaxed">
          Pay with your domain to climb the leaderboard. The more you pay, the higher your website ranks. Gain maximum clicks, brand prestige, and high-intent traffic.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onOpenSubmit()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-3.5 text-sm font-bold text-zinc-950 shadow-xl shadow-orange-500/25 transition-all hover:scale-105 hover:shadow-orange-500/40 active:scale-95"
          >
            <Zap className="h-4 w-4 fill-zinc-950 stroke-zinc-950" />
            <span>List & Boost Your Domain</span>
          </button>

          <button
            onClick={() => onOpenSubmit(outbidOneAmount)}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-zinc-900/80 px-6 py-3.5 text-sm font-bold text-amber-300 shadow-md backdrop-blur-md transition-all hover:border-amber-400 hover:bg-zinc-800/80 hover:text-amber-200"
          >
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>Claim #1 Spot for {formatUSD(outbidOneAmount)}</span>
          </button>
        </div>

        {/* Quick Highlights / Value Props */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            No Registration Needed
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            Priced in USD (UPI / Cards)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
            Instant Live Position Update
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
            Direct Outbound Clicks
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {/* Card 1: Total Revenue in USD */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-zinc-900/80 to-zinc-900/90 p-5 text-left backdrop-blur-xl shadow-lg shadow-amber-500/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">
                Revenue Collected
              </span>
              <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
                <IndianRupee className="h-4 w-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              {formatUSD(stats.totalRevenueUSD)}
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">100% transparent bidding volume</p>
          </div>

          {/* Card 2: Websites Listed */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-left backdrop-blur-xl transition hover:border-zinc-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Domains Listed
              </span>
              <div className="rounded-lg bg-zinc-800 p-2 text-zinc-300">
                <Globe className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              {stats.totalListings}
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">Active startups on the board</p>
          </div>

          {/* Card 3: Outbound Clicks Delivered */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-left backdrop-blur-xl transition hover:border-zinc-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Clicks Delivered
              </span>
              <div className="rounded-lg bg-zinc-800 p-2 text-emerald-400">
                <MousePointerClick className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black tracking-tight text-emerald-400 sm:text-3xl lg:text-4xl">
              {stats.totalClicksDelivered.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">Direct referral visitors</p>
          </div>

          {/* Card 4: Top Bid (#1 Spot) */}
          <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-zinc-900/60 p-5 text-left backdrop-blur-xl transition hover:border-orange-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                Current #1 Bid
              </span>
              <div className="rounded-lg bg-orange-500/10 p-2 text-orange-400">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black tracking-tight text-orange-300 sm:text-3xl lg:text-4xl">
              {formatUSD(stats.topBidUSD)}
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">Outbid by $5 to take #1</p>
          </div>
        </div>
      </div>
    </section>
  );
};
