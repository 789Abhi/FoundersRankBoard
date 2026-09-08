"use client";

import React, { useMemo, useState, useEffect } from "react";
import { CategoryType, WebsiteListing } from "../types";
import { LeaderboardCard } from "./LeaderboardCard";
import { Search, Plus, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);

  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredListings, currentPage]);

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-1">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-zinc-200/80 dark:border-[#142017] mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex flex-wrap items-center gap-1.5 font-semibold text-zinc-900 dark:text-white">
          <Trophy className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>
            {selectedCategory === "All" ? "Global Leaderboard" : `${selectedCategory} Board`}
          </span>
          <span className="rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.2 text-[10px] font-bold">
            {filteredListings.length} {filteredListings.length === 1 ? "domain" : "domains"}
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] text-zinc-500 whitespace-nowrap">Sorted by cumulative USD paid</span>
      </div>

      {/* Cards List */}
      <div className="space-y-2.5 sm:space-y-3 pb-8">
        {paginatedListings.length > 0 ? (
          paginatedListings.map((listing, index) => {
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
                rank={globalRank > 0 ? globalRank : ((currentPage - 1) * ITEMS_PER_PAGE) + index + 1}
                categoryRank={categoryRank > 0 ? categoryRank : 1}
                outbidAmountSuggested={suggestedAddAmount}
                targetDomainAbove={targetListing?.domain}
                isCategoryView={selectedCategory !== "All"}
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-zinc-200 dark:border-[#1d2d21]">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-[#0c140f] border border-zinc-300 dark:border-[#1d2d21] rounded-full hover:bg-zinc-50 dark:hover:bg-[#142218] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-[#0c140f] border border-zinc-300 dark:border-[#1d2d21] rounded-full hover:bg-zinc-50 dark:hover:bg-[#142218] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
