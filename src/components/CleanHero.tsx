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
  X,
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Plus,
  Minus,
  Loader2,
  Rocket,
  Crown,
  Bot,
  Share2,
  Megaphone,
  Coins,
  Code2,
  Briefcase,
  ShieldCheck,
  HeartPulse,
  Trophy,
  UserCheck,
  GraduationCap,
  Building2,
  ShoppingCart,
  Globe2,
  Gamepad2,
  Users,
  CheckSquare,
  Palette,
  PenTool,
  Compass,
  Video,
  Mic,
  TrendingUp,
  Plane,
  Home,
  Newspaper,
  Layers
} from "lucide-react";

const CATEGORY_META: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
  All: { icon: Sparkles, color: "text-emerald-500" },
  "AI Agents & Infrastructure": { icon: Bot, color: "text-purple-500" },
  "SEO & AI Visibility": { icon: Search, color: "text-cyan-500" },
  "Social Media & Creator Tools": { icon: Share2, color: "text-rose-500" },
  "Marketing & Advertising": { icon: Megaphone, color: "text-amber-500" },
  "Crypto, Web3 & Investing": { icon: Coins, color: "text-yellow-500" },
  "Developer Tools": { icon: Code2, color: "text-blue-500" },
  "Business, Finance & Legal": { icon: Briefcase, color: "text-emerald-500" },
  "Security, Privacy & Compliance": { icon: ShieldCheck, color: "text-teal-500" },
  "Health, Fitness & Wellness": { icon: HeartPulse, color: "text-pink-500" },
  "Leaderboards & Attention Markets": { icon: Trophy, color: "text-amber-400" },
  "Hiring, Jobs & Careers": { icon: UserCheck, color: "text-indigo-500" },
  "Education & Learning": { icon: GraduationCap, color: "text-orange-500" },
  "Agencies, Studios & Services": { icon: Building2, color: "text-sky-500" },
  "Ecommerce & Retail": { icon: ShoppingCart, color: "text-lime-500" },
  "Domains & Web Assets": { icon: Globe2, color: "text-emerald-400" },
  "Games & Entertainment": { icon: Gamepad2, color: "text-violet-500" },
  "People & Profiles": { icon: Users, color: "text-fuchsia-500" },
  "Productivity & Personal Tools": { icon: CheckSquare, color: "text-teal-400" },
  "Design & Creative": { icon: Palette, color: "text-pink-400" },
  "Writing & Content": { icon: PenTool, color: "text-amber-500" },
  "Directories, Launch & Discovery": { icon: Compass, color: "text-cyan-400" },
  "AI Media Generation": { icon: Video, color: "text-indigo-400" },
  "Audio, Voice & Podcasting": { icon: Mic, color: "text-red-500" },
  "Sales & Lead Generation": { icon: TrendingUp, color: "text-emerald-400" },
  "Travel, Local & Lifestyle": { icon: Plane, color: "text-sky-400" },
  "Real Estate & Property": { icon: Home, color: "text-amber-600" },
  "Media & News": { icon: Newspaper, color: "text-blue-400" },
  Other: { icon: Layers, color: "text-zinc-400" },
};

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

  // Rotating placeholder showcasing websites and YouTube handles
  const placeholders = [
    "Enter website: e.g. yoursite.com",
    "Enter YouTube: e.g. youtube.com/@channel",
    "Enter YouTube handle: e.g. @mkbhd",
    "Enter startup: e.g. saasproduct.io",
  ];

  const categoryContainerRef = React.useRef<HTMLDivElement>(null);

  const handleCategoryClick = (catName: CategoryType, e: React.MouseEvent<HTMLButtonElement>) => {
    onSelectCategory(catName);
    // Smoothly scroll the clicked button into full view within the container
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryContainerRef.current) {
      categoryContainerRef.current.scrollBy({
        left: direction === "left" ? -220 : 220,
        behavior: "smooth",
      });
    }
  };
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  // Auto-detect domain, favicon, and real website title/description
  useEffect(() => {
    const cleaned = cleanDomain(domainInput);
    if (cleaned && cleaned.includes(".")) {
      setFaviconSrc(getFaviconUrl(cleaned));

      // If user typed a YouTube link or handle, automatically suggest the Social Media & Creator Tools category
      if (cleaned.startsWith("youtube.com")) {
        setCategory("Social Media & Creator Tools");
      }

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

      const isYouTube = cleaned.startsWith("youtube.com");
      const fallbackBrand = cleaned.split(".")[0];
      const brandCapital = fallbackBrand.charAt(0).toUpperCase() + fallbackBrand.slice(1);

      let resolvedName = activeTitle;
      if (!resolvedName) {
        if (isYouTube) {
          const handlePart = cleaned.replace(/^youtube\.com\/?/, "");
          resolvedName = handlePart.startsWith("@") ? handlePart : `@${handlePart}`;
        } else {
          resolvedName = `${brandCapital} · ${cleaned}`;
        }
      }

      const targetCategory = category !== "All"
        ? category
        : (isYouTube ? "Social Media & Creator Tools" : "Marketing & Advertising");

      onQuickSubmit({
        domain: cleaned,
        name: resolvedName,
        tagline: activeDesc || (isYouTube ? "YouTube Channel on FoundersRankBoard." : `Discover ${cleaned} live on FoundersRankBoard.`),
        category: targetCategory,
        amountUSD: Math.max(5, amount),
        favicon: activeFavicon || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pt-4 pb-4 sm:pt-6 sm:pb-4 max-w-4xl mx-auto px-4 text-center">
      {/* Premium Badge Pill */}
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 dark:bg-[#0c1a12] text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>The Pay-to-Rank Global Leaderboard</span>
          <span className="inline-block w-1 h-1 rounded-full bg-emerald-500/50" />
          <span className="text-zinc-500 dark:text-zinc-400 font-normal">Startups & Creators</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.15]">
          Outbid to Claim{" "}
          <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Rank #1
          </span>
        </h1>

        {/* Targeted Platform Highlights with Icons & Brand Colors */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-3.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold shadow-sm">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            Founders
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm">
            <Rocket className="w-3.5 h-3.5 text-emerald-500" />
            Startups & SaaS
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold shadow-sm">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-red-500">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube Creators
          </span>
        </div>

        <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
          Promote your website or channel, get real visitors, and claim permanent exposure at the top.
        </p>
      </div>

      {/* High-Density Quick Bid Bar */}
      <div className="mt-4 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-[#1e3023] bg-white dark:bg-[#0c140f] p-3 sm:p-3.5 shadow-xl text-left max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 sm:gap-2.5">
            {/* Domain URL Input with Favicon or HD Globe (Huge room for long URLs) */}
            <div className="relative flex-1 w-full min-w-0">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 pointer-events-none">
                {isFetchingMeta ? (
                  <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
                ) : faviconSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={faviconSrc}
                    alt="Favicon"
                    className="h-6 w-6 rounded-md object-cover shadow-sm ring-1 ring-black/10 dark:ring-white/10"
                    onError={() => setFaviconSrc("")}
                  />
                ) : (
                  <HDGlobeIcon size={22} variant="emerald" />
                )}
              </div>

              <input
                type="text"
                suppressHydrationWarning
                placeholder={placeholders[placeholderIndex]}
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-[#223526] bg-zinc-50 dark:bg-[#070b08] pl-11 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-all font-medium"
              />
            </div>

            {/* Actions toolbar: neatly structured on mobile & tablet, compact on desktop */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
              {/* Custom Category Dropdown - Compact */}
              <div className="relative w-full sm:w-48 md:w-52 flex-1 sm:flex-initial flex-shrink-0">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full flex items-center justify-between rounded-xl border border-zinc-200 dark:border-[#223526] bg-zinc-50 dark:bg-[#070b08] px-2.5 py-2 sm:py-2.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:border-emerald-500/50 gap-1.5"
                >
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    {(() => {
                      const meta = CATEGORY_META[category] || CATEGORY_META.Other;
                      const IconComp = meta.icon;
                      return <IconComp className={`h-3.5 w-3.5 flex-shrink-0 ${meta.color}`} />;
                    })()}
                    <span className="truncate text-left">{category}</span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 text-zinc-400 dark:text-zinc-500 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 mt-1 min-w-full w-max rounded-xl border border-zinc-200 dark:border-[#223526] bg-white dark:bg-[#0a110d] py-1 shadow-2xl z-30 max-h-56 overflow-y-auto">
                    {CATEGORIES.filter((c) => c.name !== "All").map((c) => {
                      const meta = CATEGORY_META[c.name] || CATEGORY_META.Other;
                      const IconComp = meta.icon;
                      const isSel = category === c.name;
                      return (
                        <div
                          key={c.name}
                          onClick={() => {
                            setCategory(c.name);
                            setIsCategoryOpen(false);
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 text-xs cursor-pointer whitespace-nowrap transition-colors ${
                            isSel
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#121c15]"
                          }`}
                        >
                          <IconComp className={`h-3.5 w-3.5 flex-shrink-0 ${meta.color}`} />
                          <span>{c.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Amount Steppers & Rank Up Button */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Compact Amount Stepper */}
                <div className="relative flex-1 sm:w-20 md:w-24 flex-shrink-0">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    $
                  </span>
                  <input
                    type="number"
                    min={5}
                    step={1}
                    suppressHydrationWarning
                    value={amount}
                    onChange={(e) => handleAmountChange(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 dark:border-[#223526] bg-zinc-50 dark:bg-[#070b08] pl-5 pr-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => handleAmountChange(amount + 5)}
                      className="text-zinc-400 hover:text-emerald-500 leading-none px-0.5"
                    >
                      <Plus className="h-2 w-2" />
                    </button>
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => handleAmountChange(amount - 5)}
                      className="text-zinc-400 hover:text-rose-500 leading-none px-0.5"
                    >
                      <Minus className="h-2 w-2" />
                    </button>
                  </div>
                </div>

                {/* Rank Up CTA */}
                <button
                  type="submit"
                  suppressHydrationWarning
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-zinc-950 transition shadow-md shadow-emerald-500/25 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
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
            </div>
          </div>

          {/* Compact Prediction & Outbid Hint */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] sm:text-[11px] pt-2 border-t border-zinc-100 dark:border-[#16241a]">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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

        {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
      </div>

      {/* Category Pills & Search Row right above listings */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 max-w-4xl mx-auto">
        <div className="relative flex items-center min-w-0 flex-1 group/cats">
          {/* Left Arrow button for desktop/click scroll */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => scrollCategories("left")}
            aria-label="Scroll left"
            className="hidden sm:flex items-center justify-center h-6 w-6 rounded-full bg-white/80 dark:bg-[#0c140f]/90 border border-zinc-200 dark:border-[#1e3023] text-zinc-500 hover:text-emerald-500 shadow-sm flex-shrink-0 mr-1 transition-opacity opacity-70 hover:opacity-100"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          {/* Horizontally scrollable container with smooth scrolling */}
          <div
            ref={categoryContainerRef}
            className="flex items-center gap-1.5 overflow-x-auto pb-1.5 w-full scroll-smooth scrollbar-none"
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.name;
              const meta = CATEGORY_META[cat.name] || CATEGORY_META.Other;
              const IconComp = meta.icon;

              return (
                <button
                  key={cat.name}
                  type="button"
                  suppressHydrationWarning
                  onClick={(e) => handleCategoryClick(cat.name, e)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer active:scale-95 ${
                    isActive
                      ? "bg-emerald-500 text-zinc-950 shadow-sm font-bold"
                      : "bg-white dark:bg-[#0c140f] text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-[#19271c] hover:border-zinc-300 dark:hover:border-[#2b4431] dark:hover:text-zinc-200"
                  }`}
                >
                  <IconComp
                    className={`h-3 w-3 flex-shrink-0 ${
                      isActive ? "text-zinc-950" : meta.color
                    }`}
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow button for desktop/click scroll */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => scrollCategories("right")}
            aria-label="Scroll right"
            className="hidden sm:flex items-center justify-center h-6 w-6 rounded-full bg-white/80 dark:bg-[#0c140f]/90 border border-zinc-200 dark:border-[#1e3023] text-zinc-500 hover:text-emerald-500 shadow-sm flex-shrink-0 ml-1 transition-opacity opacity-70 hover:opacity-100"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="relative w-full sm:w-52 md:w-60 flex-shrink-0">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors ${searchQuery.trim() ? "text-emerald-500" : "text-zinc-400 dark:text-zinc-500"}`} />
          <input
            type="text"
            suppressHydrationWarning
            placeholder="Search domain or creator..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full rounded-full border bg-white dark:bg-[#0c140f] pl-8.5 pr-8 py-1.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none transition-all ${
              searchQuery.trim()
                ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                : "border-zinc-200 dark:border-[#19271c] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            }`}
          />
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 rounded-full hover:bg-zinc-100 dark:hover:bg-[#1a2c1f]"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
