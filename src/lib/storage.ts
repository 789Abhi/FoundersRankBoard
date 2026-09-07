import { INITIAL_WEBSITES } from "../data/initialData";
import { LeaderboardStats, PaymentSubmission, WebsiteListing } from "../types";
import { cleanDomain, ensureProtocol } from "./utils";

const STORAGE_KEY = "rankmeup_clean_v6";

function cleanListingFavicon(listing: WebsiteListing): WebsiteListing {
  let cleaned = { ...listing };
  if (!cleaned.lastClickedAt) {
    cleaned.lastClickedAt = cleaned.createdAt || new Date().toISOString();
  }
  return cleaned;
}

export function getStoredListings(): WebsiteListing[] {
  if (typeof window === "undefined") {
    return sortListings(INITIAL_WEBSITES);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WEBSITES));
      return sortListings(INITIAL_WEBSITES);
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return sortListings(parsed.map(cleanListingFavicon));
    }
    return sortListings(INITIAL_WEBSITES);
  } catch {
    return sortListings(INITIAL_WEBSITES);
  }
}

export function saveListings(listings: WebsiteListing[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings.map(cleanListingFavicon)));
  } catch (err) {
    console.error("Failed to save to localStorage", err);
  }
}

export function sortListings(listings: WebsiteListing[]): WebsiteListing[] {
  return [...listings].sort((a, b) => {
    if (b.totalPaidUSD !== a.totalPaidUSD) {
      return b.totalPaidUSD - a.totalPaidUSD;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

const VISITORS_KEY = "rankmeup_real_visitors_count";
const TAB_PREFIX = "rankmeup_active_tab_";

export function recordAndGetRealVisitors(): number {
  if (typeof window === "undefined") return 1;
  try {
    const sessionMarked = sessionStorage.getItem("rankmeup_session_recorded");
    let count = parseInt(localStorage.getItem(VISITORS_KEY) || "0", 10);
    if (isNaN(count) || count < 0) count = 0;

    if (!sessionMarked) {
      sessionStorage.setItem("rankmeup_session_recorded", "true");
      count += 1;
      localStorage.setItem(VISITORS_KEY, count.toString());
    }
    return Math.max(1, count);
  } catch {
    return 1;
  }
}

export function registerActiveSession(): () => void {
  if (typeof window === "undefined") return () => {};
  try {
    const tabId = Math.random().toString(36).substring(2, 9);
    const key = `${TAB_PREFIX}${tabId}`;

    const updateHeartbeat = () => {
      localStorage.setItem(key, Date.now().toString());
    };

    updateHeartbeat();
    const interval = setInterval(updateHeartbeat, 4000);

    const cleanup = () => {
      clearInterval(interval);
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    };

    window.addEventListener("beforeunload", cleanup);
    return cleanup;
  } catch {
    return () => {};
  }
}

export function getRealOnlineCount(): number {
  if (typeof window === "undefined") return 1;
  try {
    const now = Date.now();
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(TAB_PREFIX)) {
        const lastSeen = parseInt(localStorage.getItem(k) || "0", 10);
        if (now - lastSeen < 10000) {
          count++;
        } else {
          localStorage.removeItem(k);
        }
      }
    }
    return Math.max(1, count);
  } catch {
    return 1;
  }
}

export function calculateStats(listings: WebsiteListing[]): LeaderboardStats {
  const totalRevenueUSD = listings.reduce((sum, item) => sum + (item.totalPaidUSD || 0), 0);
  const totalClicksDelivered = listings.reduce((sum, item) => sum + (item.clicks || 0), 0);
  const topBidUSD = listings.length > 0 ? Math.max(...listings.map((item) => item.totalPaidUSD || 0)) : 0;
  const onlineCount = getRealOnlineCount();
  const totalVisitors = recordAndGetRealVisitors();

  return {
    totalRevenueUSD,
    totalListings: listings.length,
    totalClicksDelivered,
    topBidUSD,
    onlineCount,
    totalVisitors,
  };
}

export function processSubmission(submission: PaymentSubmission): {
  updatedListings: WebsiteListing[];
  newListing: WebsiteListing;
  newRank: number;
} {
  const currentListings = getStoredListings();
  const cleanedDomain = cleanDomain(submission.domain || submission.url);
  const fullUrl = ensureProtocol(submission.url || submission.domain);
  const now = new Date().toISOString();

  const existingIndex = currentListings.findIndex(
    (item) =>
      cleanDomain(item.domain) === cleanedDomain ||
      (submission.targetListingId && item.id === submission.targetListingId)
  );

  let updatedListings: WebsiteListing[];
  let affectedListing: WebsiteListing;

  const bgPalette = ["#064e3b", "#0f172a", "#14532d", "#0c4a6e", "#3b0764", "#18181b"];
  const randomBg = bgPalette[Math.floor(Math.random() * bgPalette.length)];

  if (existingIndex !== -1) {
    const existing = currentListings[existingIndex];
    affectedListing = {
      ...existing,
      name: submission.name || existing.name,
      url: fullUrl || existing.url,
      tagline: submission.tagline || existing.tagline,
      category: submission.category || existing.category,
      totalPaidUSD: existing.totalPaidUSD + submission.amountUSD,
      favicon: submission.favicon || existing.favicon,
      timeAgo: "just now",
    };

    updatedListings = currentListings.map((item, idx) =>
      idx === existingIndex ? affectedListing : item
    );
  } else {
    // Generate clean brand title or use real site title
    const brandName = submission.name || `${cleanedDomain.split(".")[0].charAt(0).toUpperCase() + cleanedDomain.split(".")[0].slice(1)} · ${submission.tagline?.slice(0, 30) || "Official Website"}`;

    affectedListing = {
      id: `site-${Date.now()}`,
      domain: cleanedDomain,
      name: brandName,
      url: fullUrl,
      tagline: submission.tagline || "Discover this innovative tool on BidToRankUp.",
      category: submission.category,
      totalPaidUSD: submission.amountUSD,
      clicks: 1,
      timeAgo: "just now",
      bgColor: randomBg,
      createdAt: now,
      lastClickedAt: now,
      favicon: submission.favicon,
    };

    updatedListings = [...currentListings, affectedListing];
  }

  const sorted = sortListings(updatedListings);
  saveListings(sorted);
  const newRank = sorted.findIndex((item) => item.id === affectedListing.id) + 1;

  return {
    updatedListings: sorted,
    newListing: affectedListing,
    newRank,
  };
}

export function trackOutboundClick(listingId: string): WebsiteListing[] {
  const now = new Date().toISOString();
  const current = getStoredListings();
  const updated = current.map((item) =>
    item.id === listingId
      ? {
          ...item,
          clicks: (item.clicks || 0) + 1,
          lastClickedAt: now,
          timeAgo: "just now",
        }
      : item
  );
  saveListings(updated);
  return updated;
}

export function resetToDefaults(): WebsiteListing[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WEBSITES));
  }
  return sortListings(INITIAL_WEBSITES);
}
