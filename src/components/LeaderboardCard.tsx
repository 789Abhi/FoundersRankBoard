"use client";

import React, { useState } from "react";
import { WebsiteListing } from "../types";
import { formatUSD, formatTimeAgo } from "../lib/utils";
import { DomainFavicon } from "./DomainFavicon";

// Decode HTML entities like &#038; -> &, &amp; -> &, etc.
function decodeHtml(str: string): string {
  if (!str) return str;
  return str
    .replace(/&#0*38;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}
import { 
  ExternalLink, 
  MousePointerClick, 
  Zap, 
  Bot, 
  Code2, 
  Megaphone, 
  Search, 
  Sparkles, 
  Coins, 
  HeartPulse, 
  Briefcase, 
  Gamepad2, 
  ShoppingCart, 
  Plane, 
  FolderTree, 
  Building2, 
  Clapperboard, 
  GraduationCap, 
  Share2, 
  Users, 
  Palette, 
  UserCheck, 
  Globe, 
  ShieldCheck, 
  BadgePercent, 
  Newspaper, 
  Home, 
  PenTool, 
  Headphones, 
  Trophy
} from "lucide-react";

interface LeaderboardCardProps {
  listing: WebsiteListing;
  rank: number;
  categoryRank: number;
  outbidAmountSuggested: number;
  targetDomainAbove?: string;
  isCategoryView?: boolean;
  onBoost: (listing: WebsiteListing, suggestedAddAmount: number) => void;
  onTrackClick: (listingId: string) => void;
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "Agents": return <Bot className="h-3 w-3" />;
    case "Developer": return <Code2 className="h-3 w-3" />;
    case "Marketing": return <Megaphone className="h-3 w-3" />;
    case "SEO": return <Search className="h-3 w-3" />;
    case "Productivity": return <Sparkles className="h-3 w-3" />;
    case "Crypto": return <Coins className="h-3 w-3" />;
    case "Health": return <HeartPulse className="h-3 w-3" />;
    case "Business": return <Briefcase className="h-3 w-3" />;
    case "Games": return <Gamepad2 className="h-3 w-3" />;
    case "Ecommerce": return <ShoppingCart className="h-3 w-3" />;
    case "Travel": return <Plane className="h-3 w-3" />;
    case "Directories": return <FolderTree className="h-3 w-3" />;
    case "Agencies": return <Building2 className="h-3 w-3" />;
    case "AI Media": return <Clapperboard className="h-3 w-3" />;
    case "Education": return <GraduationCap className="h-3 w-3" />;
    case "Social": return <Share2 className="h-3 w-3" />;
    case "People": return <Users className="h-3 w-3" />;
    case "Design": return <Palette className="h-3 w-3" />;
    case "Hiring": return <UserCheck className="h-3 w-3" />;
    case "Domains": return <Globe className="h-3 w-3" />;
    case "Security": return <ShieldCheck className="h-3 w-3" />;
    case "Sales": return <BadgePercent className="h-3 w-3" />;
    case "News": return <Newspaper className="h-3 w-3" />;
    case "Real Estate": return <Home className="h-3 w-3" />;
    case "Writing": return <PenTool className="h-3 w-3" />;
    case "Audio": return <Headphones className="h-3 w-3" />;
    case "Leaderboards": return <Trophy className="h-3 w-3" />;
    default: return <Globe className="h-3 w-3" />;
  }
}

const LeaderboardCardInner: React.FC<LeaderboardCardProps> = ({
  listing,
  rank,
  categoryRank,
  outbidAmountSuggested,
  isCategoryView = false,
  onBoost,
  onTrackClick,
}) => {
  const [imgError, setImgError] = useState(false);
  const isFirst = isCategoryView ? categoryRank === 1 : rank === 1;

  // Live timer tick to continuously gauge relative time ("just now", "10m ago", etc.)
  const [, setTick] = useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => setTick((prev) => prev + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  // Format title display: "Website Name · Domain"
  const displayName = React.useMemo(() => {
    if (!listing.name) return listing.domain;
    if (listing.name.toLowerCase().includes(listing.domain.toLowerCase())) {
      return listing.name;
    }
    return `${listing.name} · ${listing.domain}`;
  }, [listing.domain, listing.name]);

  return (
    <div
      onClick={() => {
        onTrackClick(listing.id);
        window.open(listing.url, "_blank", "noopener,noreferrer");
      }}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-200 ${
        isFirst
          ? "border-[#f06e53]/30 dark:border-[#f06e53]/25 bg-white dark:bg-[#181210] hover:border-[#f06e53]/60 dark:hover:border-[#f06e53]/50 shadow-md shadow-[#f06e53]/5"
          : "border-zinc-200/80 dark:border-[#221c1a] bg-white dark:bg-[#140f0e] hover:border-zinc-300 dark:hover:border-[#332926] shadow-sm hover:shadow-md"
      } p-4 sm:p-5`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Section: Rank + Logo Tile + Info */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          {/* Rank Number */}
          <div className="flex-shrink-0 text-center min-w-[32px] sm:min-w-[38px]">
            <span
              className={`text-base sm:text-lg font-black tracking-tight ${
                isFirst
                  ? "text-[#e05638] dark:text-[#f06e53]"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              #{isCategoryView ? categoryRank : rank}
            </span>
            <div className="text-[9px] sm:text-[10px] font-semibold text-emerald-600 dark:text-emerald-400/90 leading-tight whitespace-nowrap mt-0.5">
              #{isCategoryView ? `${rank} Overall` : `${categoryRank} cat`}
            </div>
          </div>

          {/* Logo Tile with HD Globe fallback & crisp favicon */}
          <div className="flex-shrink-0 relative">
            <DomainFavicon
              domain={listing.domain}
              name={listing.name}
              customFavicon={listing.favicon}
              size="lg"
            />
            {listing.domain.includes('youtube.com') && (
              <div 
                className="absolute -bottom-1 -right-1 bg-[#ff0000] rounded-full p-0.5 border-2 border-white dark:border-[#0a0f0c] shadow-sm flex items-center justify-center"
                title="YouTube Channel"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Middle Content */}
          <div className="min-w-0 flex-1">
            {/* Header: Website Name · Website Tagline */}
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {displayName}
              </h3>
            </div>

            {/* Description Body */}
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
              {decodeHtml(listing.tagline)}
            </p>

            {/* Meta Line: [Icon] Category · timeAgo · domain · clicks · see details */}
            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-2.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              {/* Category with Icon */}
              <span className="inline-flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300">
                {getCategoryIcon(listing.category)}
                <span>{listing.category}</span>
              </span>

              <span>·</span>

              {/* Domain Link */}
              <a
                href={listing.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackClick(listing.id);
                }}
                className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline inline-flex items-center gap-0.5"
              >
                <span>{listing.domain}</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </a>

              <span>·</span>

              {/* Clicks */}
              <span 
                className="inline-flex items-center gap-1"
                title={listing.clicks > 0 && listing.lastClickedAt ? `Last clicked: ${formatTimeAgo(listing.lastClickedAt)}` : undefined}
              >
                <MousePointerClick className="h-3 w-3 opacity-60" />
                <span>{listing.clicks.toLocaleString("en-IN")} clicks</span>
              </span>

            </div>
          </div>
        </div>

        {/* Right Section: Price in coral accent + Outbid Action */}
        <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2 sm:gap-1.5 border-t border-zinc-100 dark:border-[#201918] pt-3 sm:border-t-0 sm:pt-0 flex-shrink-0">
          <div className="text-right">
            <span className="text-base sm:text-xl font-extrabold tracking-tight text-[#e05638] dark:text-[#f06e53]">
              {formatUSD(listing.totalPaidUSD)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBoost(listing, outbidAmountSuggested);
            }}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-[#f06e53]/30 bg-[#f06e53]/10 hover:bg-[#f06e53] hover:text-white dark:hover:text-black text-[#e05638] dark:text-[#f06e53] px-3 py-1.5 text-xs font-bold transition active:scale-95 whitespace-nowrap shadow-sm"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>
              {isFirst ? "Boost Lead" : `Outbid (+${formatUSD(outbidAmountSuggested)})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const LeaderboardCard = React.memo(LeaderboardCardInner);
