"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CategoryType, LeaderboardStats, PaymentSubmission, WebsiteListing } from "../types";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  getStoredListings,
  getListingsFromCache,
  calculateStats, 
  trackOutboundClick, 
  registerActiveSession
} from "../lib/storage";
import { Navbar } from "../components/Navbar";
import { CleanHero } from "../components/CleanHero";
import { Leaderboard } from "../components/Leaderboard";
import { BigBottomRevenue } from "../components/BigBottomRevenue";
import { SplashScreen } from "../components/SplashScreen";
import { formatUSD } from "../lib/utils";
import { Trophy, RefreshCw } from "lucide-react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
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
      // We don't save to DB here anymore because we don't want metadata syncing to override DB clicks/amounts without caution.
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const cleanupSession = registerActiveSession();
    let isMounted = true;

    async function loadData() {
      // 1. Show cached data INSTANTLY (zero wait) so user sees content immediately
      const cached = getListingsFromCache();
      if (cached.length > 0 && isMounted) {
        setListings(cached);
        setStats(calculateStats(cached));
        setIsLoaded(true);
      }

      // 2. Fetch fresh data from Supabase in the background
      const fresh = await getStoredListings();
      if (!isMounted) return;
      if (fresh.length > 0) {
        setListings(fresh);
        setStats(calculateStats(fresh));
      }
      setIsLoaded(true);
      syncLiveWebsiteMeta(fresh.length > 0 ? fresh : cached);
    }
    
    loadData();

    // Refresh from Supabase every 30s to pick up new payments from other users
    const timer = setInterval(async () => {
      const data = await getStoredListings();
      if (!isMounted) return;
      if (data.length > 0) {
        setListings(data);
        setStats(calculateStats(data));
      }
    }, 30000);

    return () => {
      isMounted = false;
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

  const router = useRouter();

  // Quick submit from Hero
  const handleQuickSubmit = (data: {
    domain: string;
    name?: string;
    tagline?: string;
    category: CategoryType;
    amountUSD: number;
    favicon?: string;
  }) => {
    router.push(`/submit?domain=${encodeURIComponent(data.domain)}&category=${encodeURIComponent(data.category)}&amount=${data.amountUSD}`);
  };

  // General submit modal
  const handleOpenSubmit = (amount?: number, category?: CategoryType) => {
    let url = '/submit?';
    if (amount) url += `amount=${amount}&`;
    if (category) url += `category=${encodeURIComponent(category)}`;
    router.push(url);
  };

  // Outbid from card with dynamic suggested amount
  const handleBoost = (listing: WebsiteListing, suggestedAddAmount: number) => {
    router.push(`/submit?targetId=${listing.id}&domain=${encodeURIComponent(listing.domain)}&category=${encodeURIComponent(listing.category)}&amount=${Math.max(5, suggestedAddAmount)}`);
  };

  const handleTrackClick = async (listingId: string) => {
    await trackOutboundClick(listingId);
    // Optimistic UI update for click
    const updated = listings.map(l => l.id === listingId ? { ...l, clicks: (l.clicks || 0) + 1 } : l);
    setListings(updated);
    setStats(calculateStats(updated));
  };

  return (
    <>
      {/* Beautiful splash screen — shown on first visit, fades out automatically */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

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
        <div className="mx-auto max-w-5xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:items-start items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-zinc-900 dark:text-zinc-200">BidToRankUp</span>
              <span>·</span>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
            <span className="text-[11px] text-zinc-400">The Pay-to-Rank Domain Board • Secured by Razorpay</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-zinc-600 dark:text-zinc-400 font-medium">
            <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Contact Us
            </Link>
            <Link href="/rules" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Privacy Policy
            </Link>
            <Link href="/refund-policy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Cancellation & Refund Policy
            </Link>
          </div>
        </div>
      </footer>

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
    </>
  );
}
