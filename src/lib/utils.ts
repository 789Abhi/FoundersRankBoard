import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CategoryType, WebsiteListing } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency into Indian Rupees ($ 1,50,000)
 */
export function formatUSD(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "$0";
  }

  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount);

  return `$${formatted}`;
}

/**
 * Clean domain string (e.g. https://www.kombai.com/pricing -> kombai.com)
 */
export function cleanDomain(urlOrDomain: string): string {
  if (!urlOrDomain) return "";
  try {
    let clean = urlOrDomain.trim().toLowerCase();
    clean = clean.replace(/^https?:\/\//i, "");
    clean = clean.replace(/^www\./i, "");
    clean = clean.split("/")[0];
    clean = clean.split("?")[0];
    clean = clean.split("#")[0];
    return clean;
  } catch {
    return urlOrDomain.trim();
  }
}

/**
 * Ensures URL starts with https://
 */
export function ensureProtocol(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Returns high-resolution favicon URL via Google S2
 */
export function getFaviconUrl(domain: string, directFavicon?: string): string {
  if (directFavicon && directFavicon.startsWith("http")) {
    return directFavicon;
  }
  const cleaned = cleanDomain(domain);
  if (!cleaned || cleaned.length < 3) return "";
  return `https://www.google.com/s2/favicons?domain=${cleaned}&sz=128&default_icon=none`;
}

/**
 * Secondary fallback favicon URL via Google with default_icon=none so it doesn't return blurry globe
 */
export function getFallbackFaviconUrl(domain: string): string {
  const cleaned = cleanDomain(domain);
  if (!cleaned || cleaned.length < 3) return "";
  return `https://www.google.com/s2/favicons?domain=${cleaned}&sz=128&default_icon=none`;
}

/**
 * Deterministic modern gradient and initial for domains without a favicon
 */
export function getDomainColor(domain: string): { gradient: string; text: string; initial: string } {
  const clean = cleanDomain(domain);
  const initial = (clean.charAt(0) || "W").toUpperCase();
  const gradients = [
    { gradient: "from-emerald-500 to-teal-700", text: "text-white" },
    { gradient: "from-indigo-500 to-violet-700", text: "text-white" },
    { gradient: "from-amber-500 to-orange-700", text: "text-white" },
    { gradient: "from-rose-500 to-pink-700", text: "text-white" },
    { gradient: "from-sky-500 to-blue-700", text: "text-white" },
    { gradient: "from-fuchsia-500 to-purple-700", text: "text-white" },
  ];
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return {
    ...gradients[index],
    initial,
  };
}

/**
 * Calculate both Category Rank and Global Rank for a potential bid amount
 */
export function calculateRanks(
  listings: WebsiteListing[],
  amountUSD: number,
  category: CategoryType,
  existingListingId?: string
): { categoryRank: number; totalInCategory: number; globalRank: number; totalGlobal: number } {
  const existing = listings.find((item) => item.id === existingListingId);
  const totalAmount = (existing ? existing.totalPaidUSD : 0) + amountUSD;

  // Global Rank
  const higherGlobal = listings.filter((item) => {
    if (existing && item.id === existing.id) return false;
    return item.totalPaidUSD > totalAmount;
  }).length;

  // Category Rank
  const categoryListings = listings.filter((item) => item.category === category);
  const higherCategory = categoryListings.filter((item) => {
    if (existing && item.id === existing.id) return false;
    return item.totalPaidUSD > totalAmount;
  }).length;

  return {
    categoryRank: higherCategory + 1,
    totalInCategory: categoryListings.length + (existing && existing.category === category ? 0 : 1),
    globalRank: higherGlobal + 1,
    totalGlobal: listings.length + (existing ? 0 : 1),
  };
}

/**
 * Suggest amount to overtake the website directly above
 */
export function getSuggestedOutbidAmount(
  listings: WebsiteListing[],
  listingId: string
): { targetListing: WebsiteListing | null; suggestedAddAmount: number } {
  const sorted = [...listings].sort((a, b) => b.totalPaidUSD - a.totalPaidUSD);
  const currentIndex = sorted.findIndex((i) => i.id === listingId);

  if (currentIndex <= 0) {
    // Already #1 or not found
    return { targetListing: null, suggestedAddAmount: 5 };
  }

  const siteAbove = sorted[currentIndex - 1];
  const currentSite = sorted[currentIndex];
  const difference = siteAbove.totalPaidUSD - currentSite.totalPaidUSD;
  // Outbid by difference + $5
  const bump = 5;
  const suggestedAddAmount = difference + bump;

  return { targetListing: siteAbove, suggestedAddAmount };
}

/**
 * Accurately gauges real elapsed time from a timestamp.
 * Returns: "just now", "5m ago", "10m ago", "2h ago", "1d ago", "1w ago", etc.
 */
export function formatTimeAgo(timestamp?: string | number | Date): string {
  if (!timestamp) return "recently";

  const date = typeof timestamp === "number" ? new Date(timestamp) : new Date(timestamp);
  const time = date.getTime();
  if (isNaN(time)) return "recently";

  const diffMs = Date.now() - time;
  if (diffMs < 0) return "just now";

  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 45) return "just now";

  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "1w ago";
  if (diffWeeks < 4) return `${diffWeeks}w ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths <= 1) return "1mo ago";
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}
