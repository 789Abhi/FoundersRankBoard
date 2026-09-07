"use client";

import React, { useState } from "react";
import { CategoryType } from "../types";
import { CATEGORIES } from "../data/initialData";
import { formatUSD } from "../lib/utils";
import { HDGlobeIcon } from "./HDGlobeIcon";
import { Trophy, Minus, Plus, ChevronDown } from "lucide-react";

interface HeroBidBarProps {
  topBidUSD: number;
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  timeframe: "all-time" | "today";
  onSelectTimeframe: (tf: "all-time" | "today") => void;
  onClaimRank: (data: { url: string; category: CategoryType; amountUSD: number }) => void;
}

export const HeroBidBar: React.FC<HeroBidBarProps> = ({
  topBidUSD,
  selectedCategory,
  onSelectCategory,
  timeframe,
  onSelectTimeframe,
  onClaimRank,
}) => {
  // Base amount: 5 higher than current top bid
  const initialTopAmount = topBidUSD > 0 ? topBidUSD + 500 : 5000;
  const [bidAmount, setBidAmount] = useState<number>(initialTopAmount);
  const [productUrl, setProductUrl] = useState("");
  const [category, setCategory] = useState<CategoryType>("AI Agents & Infrastructure");
  const [error, setError] = useState<string | null>(null);

  const handleMinus = () => {
    setBidAmount((prev) => Math.max(500, prev - 500));
  };

  const handlePlus = () => {
    setBidAmount((prev) => prev + 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl.trim()) {
      setError("Please enter your website URL");
      return;
    }
    setError(null);
    onClaimRank({
      url: productUrl.trim(),
      category: category !== "All" ? category : "AI Agents & Infrastructure",
      amountUSD: bidAmount,
    });
  };

  return (
    <section className="pt-8 pb-10 sm:pt-10 sm:pb-12 text-center max-w-5xl mx-auto px-4">
      {/* Category Pills Row */}
      <div id="categories" className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-7">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm shadow-emerald-500/20"
                  : "bg-[#111712] text-zinc-400 border border-[#1b281f] hover:border-emerald-500/40 hover:text-zinc-200"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Timeframe Toggle: All-time | Today */}
      <div className="inline-flex items-center rounded-full border border-[#1b281f] bg-[#0d130f] p-1 mb-8 shadow-sm">
        <button
          onClick={() => onSelectTimeframe("all-time")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold transition-all ${
            timeframe === "all-time"
              ? "bg-emerald-500 text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Trophy className="h-3 w-3" />
          <span>All-time</span>
        </button>
        <button
          onClick={() => onSelectTimeframe("today")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-medium transition-all ${
            timeframe === "today"
              ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>Today</span>
        </button>
      </div>

      {/* Massive Headline: Claim #1 for - $[Amount] + */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-7 select-none">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          <span>Claim #1 for</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleMinus}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#141d16] border border-[#223326] text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/40 transition"
              title="Decrease amount"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="text-emerald-400 font-black tracking-tight drop-shadow-sm">
              {formatUSD(bidAmount)}
            </span>

            <button
              type="button"
              onClick={handlePlus}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#141d16] border border-[#223326] text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/40 transition"
              title="Increase amount"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </h1>
      </div>

      {/* Inline Input Bar */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center rounded-2xl sm:rounded-full border border-[#223326] bg-[#0e1410] p-1.5 sm:p-1.5 shadow-xl transition-all focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30">
          {/* Input: URL */}
          <div className="relative flex-1 w-full flex items-center">
            <div className="absolute left-3.5 pointer-events-none flex items-center justify-center">
              <HDGlobeIcon size={18} variant="emerald" />
            </div>
            <input
              type="text"
              placeholder="Your product URL or @handle"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              className="w-full bg-transparent pl-11 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full sm:w-auto relative border-t sm:border-t-0 sm:border-l border-[#1b281f] py-1 sm:py-0">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full sm:w-44 bg-transparent pl-3 pr-8 py-2 text-xs text-zinc-300 focus:outline-none appearance-none cursor-pointer"
            >
              {CATEGORIES.filter((c) => c.name !== "All").map((cat) => (
                <option key={cat.name} value={cat.name} className="bg-[#0e1410] text-zinc-200">
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
          </div>

          {/* Claim Rank Button */}
          <button
            type="submit"
            className="w-full sm:w-auto mt-2 sm:mt-0 rounded-xl sm:rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-6 py-2.5 text-xs sm:text-sm font-bold text-zinc-950 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
          >
            Claim rank
          </button>
        </div>

        {error && (
          <p className="mt-2 text-xs text-rose-400 font-medium">{error}</p>
        )}
      </form>
    </section>
  );
};
