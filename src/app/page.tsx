"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CategoryType, LeaderboardStats, PaymentSubmission, WebsiteListing } from "../types";
import { 
  getStoredListings, 
  saveListings,
  calculateStats, 
  processSubmission, 
  trackOutboundClick, 
  resetToDefaults,
  registerActiveSession
} from "../lib/storage";
import { Navbar } from "../components/Navbar";
import { CleanHero } from "../components/CleanHero";
import { Leaderboard } from "../components/Leaderboard";
import { BigBottomRevenue } from "../components/BigBottomRevenue";
import { SubmitModal } from "../components/SubmitModal";
import { PaymentModal } from "../components/PaymentModal";
import { formatUSD } from "../lib/utils";
import { Trophy, RefreshCw } from "lucide-react";

export default function Home() {
  const [listings, setListings] = useState<WebsiteListing[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    totalRevenueUSD: 0,
    totalListings: 0,
    totalClicksDelivered: 0,
    topBidUSD: 0,
    onlineCount: 1,
    totalVisitors: 1,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const [targetListing, setTargetListing] = useState<WebsiteListing | null>(null);
  const [initialAmount, setInitialAmount] = useState<number | undefined>(undefined);
  const [initialCategory, setInitialCategory] = useState<CategoryType | undefined>(undefined);
  const [pendingSubmission, setPendingSubmission] = useState<Omit<PaymentSubmission, "paymentMethod"> | null>(null);

  // Live Toast
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Auto-fetch real titles & descriptions live from the target websites
  const syncLiveWebsiteMeta = async (currentListings: WebsiteListing[]) => {
    try {
      const updated = await Promise.all(
        currentListings.map(async (item) => {
          try {
            const res = await fetch(`/api/fetch-meta?domain=${encodeURIComponent(item.domain)}`);
            if (res.ok) {
              const data = await res.json();
              const validFavicon = data.favicon && !data.favicon.includes("duckduckgo") ? data.favicon : undefined;
              const resolvedName = data.titleFound && data.title ? data.title : item.name;
              const resolvedTagline = data.descriptionFound && data.description ? data.description : item.tagline;
              const resolvedFavicon = validFavicon ?? item.favicon;

              return {
                ...item,
                name: resolvedName,
                tagline: resolvedTagline,
                favicon: resolvedFavicon,
              };
            }
          } catch {
            // fallback
          }
          return item;
        })
      );

      setListings(updated);
      saveListings(updated);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const cleanupSession = registerActiveSession();
    const data = getStoredListings();
    setListings(data);
    setStats(calculateStats(data));
    setIsLoaded(true);

    const timer = setInterval(() => {
      setStats(calculateStats(getStoredListings()));
    }, 4000);

    // Automatically sync live titles and descriptions from real websites
    syncLiveWebsiteMeta(data);

    return () => {
      cleanupSession();
      clearInterval(timer);
    };
  }, []);

  const triggerToast = (title: string, description: string) => {
    setToastMessage({ title, description });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Quick submit from Hero with auto-fetched real title & description
  const handleQuickSubmit = (data: {
    domain: string;
    name?: string;
    tagline?: string;
    category: CategoryType;
    amountUSD: number;
    favicon?: string;
  }) => {
    setTargetListing(null);
    setPendingSubmission({
      domain: data.domain,
      name: data.name,
      tagline: data.tagline,
      url: data.domain,
      category: data.category,
      amountUSD: Math.max(5, data.amountUSD),
      favicon: data.favicon,
    });
    setIsPaymentOpen(true);
  };

  // General submit modal
  const handleOpenSubmit = (amount?: number, category?: CategoryType) => {
    setTargetListing(null);
    setInitialAmount(amount || 500);
    setInitialCategory(category);
    setIsSubmitOpen(true);
  };

  // Outbid from card with dynamic suggested amount
  const handleBoost = (listing: WebsiteListing, suggestedAddAmount: number) => {
    setTargetListing(listing);
    setInitialAmount(Math.max(5, suggestedAddAmount));
    setInitialCategory(listing.category);
    setIsSubmitOpen(true);
  };

  const handleProceedToPayment = (data: {
    domain: string;
    name?: string;
    url: string;
    tagline?: string;
    category: CategoryType;
    amountUSD: number;
    targetListingId?: string;
    favicon?: string;
  }) => {
    setIsSubmitOpen(false);
    setPendingSubmission(data);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (payment: PaymentSubmission) => {
    const result = processSubmission(payment);
    setListings(result.updatedListings);
    setStats(calculateStats(result.updatedListings));
    setIsPaymentOpen(false);
    setPendingSubmission(null);

    const rankTitle =
      result.newRank === 1
        ? `👑 ${result.newListing.name || result.newListing.domain} is now #1 Overall!`
        : `🚀 ${result.newListing.name || result.newListing.domain} climbed to Rank #${result.newRank}!`;

    triggerToast(
      rankTitle,
      `Paid ${formatUSD(payment.amountUSD)}. Platform revenue is now ${formatUSD(
        calculateStats(result.updatedListings).totalRevenueUSD
      )}.`
    );
  };

  const handleTrackClick = (listingId: string) => {
    const updated = trackOutboundClick(listingId);
    setListings(updated);
    setStats(calculateStats(updated));
  };

  const handleResetData = () => {
    if (confirm("Reset leaderboard back to original seed data?")) {
      const reset = resetToDefaults();
      setListings(reset);
      setStats(calculateStats(reset));
      triggerToast("Reset Complete", "Listings restored.");
      syncLiveWebsiteMeta(reset);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f8faf9] dark:bg-[#060907] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          Loading BidToRankUp...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf9] text-zinc-800 dark:bg-[#060907] dark:text-zinc-200 bg-mesh-pattern relative selection:bg-emerald-500 selection:text-black transition-colors duration-200">
      {/* Sticky Header */}
      <Navbar onOpenSubmit={() => handleOpenSubmit()} stats={stats} />

      {/* Hero Section with Auto Metadata Extraction */}
      <CleanHero
        listings={listings}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickSubmit={handleQuickSubmit}
        onOpenRules={() => { window.location.href = "/rules"; }}
        stats={stats}
      />

      {/* Leaderboard Table / Cards */}
      <Leaderboard
        listings={listings}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onBoost={handleBoost}
        onTrackClick={handleTrackClick}
        onOpenSubmit={handleOpenSubmit}
      />

      {/* The BIG Bottom Revenue Showcase */}
      <BigBottomRevenue
        stats={stats}
        onOpenSubmit={handleOpenSubmit}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 dark:border-[#121c15] bg-white dark:bg-[#040705] py-10 text-xs text-zinc-500 text-center transition-colors">
        <div className="mx-auto max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-zinc-900 dark:text-zinc-200">BidToRankUp</span>
            <span>·</span>
            <span>Zero-Login Pay-to-Rank Domain Board</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
            <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              About Us
            </Link>
            <Link href="/rules" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Rules
            </Link>
            <Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Privacy Policy
            </Link>
            <button
              onClick={handleResetData}
              className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SubmitModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        listings={listings}
        initialAmount={initialAmount}
        initialCategory={initialCategory}
        targetListing={targetListing}
        onProceedToPayment={handleProceedToPayment}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        submissionData={pendingSubmission}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Real-time notification toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-zinc-200 dark:border-emerald-500/40 bg-white/95 dark:bg-[#0c140f]/95 p-4 text-zinc-900 dark:text-white shadow-2xl shadow-emerald-500/10 backdrop-blur-md animate-in slide-in-from-bottom-3">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Trophy className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-300">{toastMessage.title}</div>
              <p className="mt-0.5 text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {toastMessage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
