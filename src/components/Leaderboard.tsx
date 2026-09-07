"use client";

import React, { useMemo } from "react";
import { CategoryType, WebsiteListing } from "../types";
import { LeaderboardCard } from "./LeaderboardCard";
import { Search, Plus, Trophy } from "lucide-react";
import { getSuggestedOutbidAmount } from "../lib/utils";

interface LeaderboardProps {
  listings: WebsiteListing[];
  selectedCategory: CategoryType;
  searchQuery: string;
  onBoost: (listing: WebsiteListing, suggestedAddAmount: number) => void;
  onTrackClick: (listingId: string) => void;
  onOpenSubmit: (initialAmount?: number, initialCategory?: CategoryType) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  listings,
  selectedCategory,
  searchQuery,
  onBoost,
  onTrackClick,
  onOpenSubmit,
}) => {
  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.domain.toLowerCase().includes(q) ||
          item.tagline.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [listings, selectedCategory, searchQuery]);

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-1">
      {/* Header bar */}
      <div className="flex items-center justify-between py-2 border-b border-zinc-200/80 dark:border-[#142017] mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-white">
          <Trophy className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>
            {selectedCategory === "All" ? "Global Leaderboard" : `${selectedCategory} Board`}
          </span>
          <span className="rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.2 text-[10px] font-bold">
            {filteredListings.length} {filteredListings.length === 1 ? "domain" : "domains"}
          </span>
        </div>
        <span className="text-[11px] text-zinc-500">Sorted by cumulative USD paid</span>
      </div>

      {/* Cards List */}
      <div className="space-y-2.5 sm:space-y-3">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing, index) => {
            const globalRank =
              listings.findIndex((item) => item.id === listing.id) + 1;

            const categoryList = listings.filter((item) => item.category === listing.category);
            const categoryRank =
              categoryList.findIndex((item) => item.id === listing.id) + 1;

            const { targetListing, suggestedAddAmount } = getSuggestedOutbidAmount(
              selectedCategory === "All" ? listings : categoryList,
              listing.id
            );

            return (
              <LeaderboardCard
                key={listing.id}
                listing={listing}
                rank={globalRank > 0 ? globalRank : index + 1}
                categoryRank={categoryRank > 0 ? categoryRank : 1}
                outbidAmountSuggested={suggestedAddAmount}
                targetDomainAbove={targetListing?.domain}
                onBoost={onBoost}
                onTrackClick={onTrackClick}
              />
            );
          })
        ) : (
          <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-[#1d2d21] bg-white dark:bg-[#0c140f] p-10 text-center shadow-sm">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-[#142218] text-emerald-600 dark:text-emerald-400 mb-3">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">No websites listed yet</h3>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
              No domains listed in &quot;{selectedCategory}&quot; yet. Be the first to claim #1 spot for $5!
            </p>
            <button
              onClick={() => onOpenSubmit(100, selectedCategory !== "All" ? selectedCategory : undefined)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition active:scale-95 shadow-md shadow-emerald-500/20"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              <span>List First in {selectedCategory} (from $5)</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
