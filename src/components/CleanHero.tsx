"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CategoryType, LeaderboardStats, WebsiteListing } from "../types";
import { CATEGORIES } from "../data/initialData";
import { formatUSD, cleanDomain, getFaviconUrl, calculateRanks } from "../lib/utils";
import { HDGlobeIcon } from "./HDGlobeIcon";
import { 
  ArrowRight, 
  Zap, 
  Search, 
  ChevronDown, 
  Sparkles,
  Plus,
  Minus,
  Loader2
} from "lucide-react";

interface CleanHeroProps {
  listings: WebsiteListing[];
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickSubmit: (data: { domain: string; name?: string; tagline?: string; category: CategoryType; amountUSD: number; favicon?: string }) => void;
  onOpenRules?: () => void;
  stats?: LeaderboardStats;
}

export const CleanHero: React.FC<CleanHeroProps> = ({
  listings,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onQuickSubmit,
  stats,
}) => {
  const [domainInput, setDomainInput] = useState("");
  const [category, setCategory] = useState<CategoryType>("Marketing & Advertising");
  const [amount, setAmount] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);
  const [faviconSrc, setFaviconSrc] = useState<string>("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Auto-fetched metadata
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDesc, setMetaDesc] = useState<string>("");
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect domain, favicon, and real website title/description
  useEffect(() => {
    const cleaned = cleanDomain(domainInput);
    if (cleaned && cleaned.includes(".")) {
      setFaviconSrc(getFaviconUrl(cleaned));

      // Fetch real metadata from the website via our API route
      const timer = setTimeout(async () => {
        try {
          setIsFetchingMeta(true);
          const res = await fetch(`/api/fetch-meta?domain=${encodeURIComponent(cleaned)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.title) setMetaTitle(data.title);
            if (data.description) setMetaDesc(data.description);
            if (data.favicon) setFaviconSrc(data.favicon);
          }
        } catch {
          // ignore error, fall back to capitalized domain
        } finally {
          setIsFetchingMeta(false);
        }
      }, 400);

      return () => clearTimeout(timer);
    } else {
      setFaviconSrc("");
      setMetaTitle("");
      setMetaDesc("");
    }
  }, [domainInput]);

  // Check if the typed domain is already in the list
  const existingListing = useMemo(() => {
    const cleaned = cleanDomain(domainInput);
    return listings.find((l) => cleanDomain(l.domain) === cleaned) || null;
  }, [domainInput, listings]);

  // Real-time rank calculation accounting for existing cumulative paid amount
  const rankPrediction = useMemo(() => {
    return calculateRanks(listings, amount || 5, category, existingListing?.id);
  }, [listings, amount, category, existingListing]);

  // Dynamic Outbid or Boost Suggestion
  const outbidSuggestion = useMemo(() => {
    const projectedTotal = (existingListing?.totalPaidUSD || 0) + (amount || 0);
    const sortedGlobal = [...listings].sort((a, b) => b.totalPaidUSD - a.totalPaidUSD);
    
    // Filter out the existing listing from the targets to overtake
    const otherSites = sortedGlobal.filter((item) => item.id !== existingListing?.id);
    const higherSites = otherSites.filter((item) => item.totalPaidUSD >= projectedTotal);
    
    if (higherSites.length > 0) {
      const nextTarget = higherSites[higherSites.length - 1]; // nearest site above
      const diff = nextTarget.totalPaidUSD - projectedTotal;
      const outbidAmount = (amount || 0) + diff + 5;
      return {
        type: "overtake",
        targetDomain: nextTarget.domain,
        diffToAdd: diff + 5,
        newSuggestedAmount: outbidAmount,
      };
    } else if (existingListing) {
      // They are already #1 or their new projected total makes them #1
      return {
        type: "boost",
        targetDomain: existingListing.domain,
        diffToAdd: 5,
        newSuggestedAmount: (amount || 0) + 5,
      };
    }
    return null;
  }, [listings, amount, existingListing]);

  const handleAmountChange = (newVal: number) => {
    setAmount(Math.max(5, newVal));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) {
      setError("Please enter your website URL or domain.");
      return;
    }
    if (!amount || amount < 5) {
      setError("Minimum starting bid is $5.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    
    try {
      const cleaned = cleanDomain(domainInput);

      let activeTitle = metaTitle;
      let activeDesc = metaDesc;
      let activeFavicon = faviconSrc;

      // If metadata was still loading or hasn't finished, fetch it directly now
      if (!activeTitle || !activeDesc || !activeFavicon) {
        try {
          const res = await fetch(`/api/fetch-meta?domain=${encodeURIComponent(cleaned)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.title) activeTitle = data.title;
            if (data.description) activeDesc = data.description;
            if (data.favicon) activeFavicon = data.favicon;
          }
        } catch {
          // fallback
        }
      }

      const fallbackBrand = cleaned.split(".")[0];
      const brandCapital = fallbackBrand.charAt(0).toUpperCase() + fallbackBrand.slice(1);

      onQuickSubmit({
        domain: cleaned,
        name: activeTitle || `${brandCapital} · ${cleaned}`,
        tagline: activeDesc || `Discover ${cleaned} live on BidToRankUp.`,
        category: category !== "All" ? category : "Marketing & Advertising",
        amountUSD: Math.max(5, amount),
        favicon: activeFavicon || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pt-4 pb-4 sm:pt-6 sm:pb-4 max-w-4xl mx-auto px-4 text-center">
      {/* Live Traffic & Social Proof Pill matching reference screenshot */}
      <div className="flex flex-col items-center">
        <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          The Leaderboard Where{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
            Highest Bid Ranks #1
          </span>
        </h1>
      </div>

      {/* High-Density Quick Bid Bar */}
      <div className="mt-4 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-[#1e3023] bg-white dark:bg-[#0c140f] p-3 sm:p-3.5 shadow-xl text-left max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Domain URL Input with Favicon or HD Globe */}
            <div className="relative flex-1 w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5">
                {isFetchingMeta ? (
                  <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
                ) : faviconSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={faviconSrc}
                    alt="Favicon"
                    className="h-4 w-4 rounded object-contain"
                    onError={() => setFaviconSrc("")}
                  />
                ) : (
                  <HDGlobeIcon size={18} variant="emerald" />
                )}
              </div>

              <input
                type="text"
                placeholder="Enter domain: e.g. yoursite.com"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-[#223526] bg-zinc-50 dark:bg-[#070b08] pl-9 pr-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Custom Category Dropdown */}
            <div className="relative w-full sm:w-56 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full flex items-center justify-between rounded-xl border border-zinc-200 dark:border-[#223526] bg-zinc-50 dark:bg-[#070b08] px-3 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:border-emerald-500/50"
              >
                <span className="truncate text-left flex-1 mr-2">{category}</span>
                <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 text-zinc-400 dark:text-zinc-500 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-1 min-w-full w-max rounded-xl border border-zinc-200 dark:border-[#223526] bg-white dark:bg-[#0a110d] py-1 shadow-2xl z-30 max-h-52 overflow-y-auto">
                  {CATEGORIES.filter((c) => c.name !== "All").map((c) => (
                    <div
                      key={c.name}
                      onClick={() => {
                        setCategory(c.name);
                        setIsCategoryOpen(false);
                      }}
                      className={`px-3 py-1.5 text-xs cursor-pointer whitespace-nowrap ${
                        category === c.name
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#121c15]"
                      }`}
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amount with Steppers */}
            <div className="relative w-full sm:w-32 flex-shrink-0">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                $
              </span>
              <input
                type="number"
                min={5}
                step={1}
                value={amount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 dark:border-[#223526] bg-zinc-50 dark:bg-[#070b08] pl-6 pr-6 py-2 text-xs sm:text-sm font-bold text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col">
                <button
                  type="button"
                  onClick={() => handleAmountChange(amount + 5)}
                  className="text-zinc-400 hover:text-emerald-500 leading-none px-1"
                >
                  <Plus className="h-2.5 w-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAmountChange(amount - 5)}
                  className="text-zinc-400 hover:text-rose-500 leading-none px-1"
                >
                  <Minus className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>

            {/* Rank Up CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-5 py-2 text-xs font-bold text-zinc-950 transition shadow-md shadow-emerald-500/25 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Rank Up</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                </>
              )}
            </button>
          </div>

          {/* Compact Prediction & Outbid Hint */}
          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] pt-1.5 border-t border-zinc-100 dark:border-[#16241a]">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-400">Will rank:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                🏆 #{rankPrediction.categoryRank} in {category}
              </span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">#{rankPrediction.globalRank} Overall</span>
            </div>

            {outbidSuggestion && (
              <button
                type="button"
                onClick={() => setAmount(outbidSuggestion.newSuggestedAmount)}
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold whitespace-nowrap"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  {outbidSuggestion.type === "boost"
                    ? `Boost Lead (+${formatUSD(outbidSuggestion.diffToAdd)})`
                    : `Overtake ${outbidSuggestion.targetDomain} (+${formatUSD(outbidSuggestion.diffToAdd)})`}
                </span>
              </button>
            )}
          </div>
        </form>

        {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      </div>

      {/* Category Pills & Search Row right above listings */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-4xl mx-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-500 text-zinc-950 shadow-sm"
                    : "bg-white dark:bg-[#0c140f] text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-[#19271c] hover:border-zinc-300 dark:hover:text-zinc-200"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-52 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search domain..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-zinc-200 dark:border-[#19271c] bg-white dark:bg-[#0c140f] pl-8 pr-3 py-1 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
};
