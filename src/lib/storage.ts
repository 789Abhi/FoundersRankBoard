import { LeaderboardStats, PaymentSubmission, WebsiteListing } from "../types";
import { cleanDomain, ensureProtocol } from "./utils";
import { createClient } from "../utils/supabase/client";

const supabase = createClient();

// Helper to map DB snake_case to frontend camelCase
function mapListing(dbItem: any): WebsiteListing {
  return {
    id: dbItem.id,
    domain: dbItem.domain,
    name: dbItem.name || dbItem.domain,
    url: dbItem.url,
    tagline: dbItem.tagline,
    category: dbItem.category,
    totalPaidUSD: Number(dbItem.total_paid_usd),
    clicks: dbItem.clicks,
    createdAt: dbItem.created_at,
    lastClickedAt: dbItem.last_clicked_at,
    favicon: dbItem.favicon,
    bgColor: dbItem.bg_color,
    timeAgo: "recently", // we can calculate this live in components
  };
}

const CACHE_KEY = "FoundersRankBoard_listings_cache";
const CACHE_TTL_MS = 30_000; // 30 seconds

// In-memory cache for the current session (fastest access)
let memoryCache: { data: WebsiteListing[]; ts: number } | null = null;

function readSessionCache(): WebsiteListing[] | null {
  if (typeof window === "undefined") return null;
  if (memoryCache && Date.now() - memoryCache.ts < CACHE_TTL_MS) {
    return memoryCache.data;
  }
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts < CACHE_TTL_MS) {
      memoryCache = { data, ts };
      return data;
    }
  } catch {}
  return null;
}

function writeSessionCache(data: WebsiteListing[]) {
  if (typeof window === "undefined") return;
  const entry = { data, ts: Date.now() };
  memoryCache = entry;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {}
}

export async function getStoredListings(): Promise<WebsiteListing[]> {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('total_paid_usd', { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      // Return cached data on error so UI doesn't break
      return readSessionCache() ?? [];
    }
    
    const mapped = data
      ? data.filter((item: any) => item.domain !== '__frb_system_stats__').map(mapListing)
      : [];
    writeSessionCache(mapped);
    return mapped;
  } catch (err) {
    console.error("Failed to fetch from Supabase", err);
    return readSessionCache() ?? [];
  }
}

// Returns cached data INSTANTLY (sync), then triggers a background refresh
export function getListingsFromCache(): WebsiteListing[] {
  return readSessionCache() ?? [];
}

export async function saveListingToDB(listing: WebsiteListing): Promise<void> {
  const dbItem = {
    id: listing.id.startsWith("site-") ? undefined : listing.id, // let uuid generate if new
    domain: listing.domain,
    name: listing.name,
    url: listing.url,
    tagline: listing.tagline,
    category: listing.category,
    total_paid_usd: listing.totalPaidUSD,
    clicks: listing.clicks || 0,
    favicon: listing.favicon,
    bg_color: listing.bgColor,
  };

  // Upsert by domain
  const { error } = await supabase
    .from('listings')
    .upsert(dbItem, { onConflict: 'domain' });

  if (error) {
    console.error("Failed to save to Supabase", error);
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
    const rawStored = localStorage.getItem(VISITORS_KEY);
    let count = rawStored ? parseInt(rawStored, 10) : 0;
    if (isNaN(count) || count <= 0) {
      count = 390; // Default baseline so it never collapses to 1
      localStorage.setItem(VISITORS_KEY, count.toString());
    }

    const sessionMarked = sessionStorage.getItem("rankmeup_session_recorded");
    if (!sessionMarked) {
      sessionStorage.setItem("rankmeup_session_recorded", "true");
      count += 1;
      localStorage.setItem(VISITORS_KEY, count.toString());
    }
    return count;
  } catch {
    return 390;
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
      } catch {}
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

export async function recordAndSyncGlobalVisitors(): Promise<number> {
  if (typeof window === "undefined") return 1;
  try {
    const sessionMarked = sessionStorage.getItem("rankmeup_session_recorded");
    const method = sessionMarked ? "GET" : "POST";
    if (!sessionMarked) {
      sessionStorage.setItem("rankmeup_session_recorded", "true");
    }

    const res = await fetch("/api/stats", { method });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.totalVisitors === "number" && data.totalVisitors > 0) {
        localStorage.setItem(VISITORS_KEY, data.totalVisitors.toString());
        return data.totalVisitors;
      }
    }
  } catch {
    // Fallback to local count if offline
  }
  return recordAndGetRealVisitors();
}

export function calculateStats(listings: WebsiteListing[], overrideVisitors?: number): LeaderboardStats {
  const totalRevenueUSD = listings.reduce((sum, item) => sum + (item.totalPaidUSD || 0), 0);
  const totalClicksDelivered = listings.reduce((sum, item) => sum + (item.clicks || 0), 0);
  const topBidUSD = listings.length > 0 ? Math.max(...listings.map((item) => item.totalPaidUSD || 0)) : 0;
  const onlineCount = getRealOnlineCount();
  const totalVisitors = overrideVisitors !== undefined ? overrideVisitors : recordAndGetRealVisitors();

  return {
    totalRevenueUSD,
    totalListings: listings.length,
    totalClicksDelivered,
    topBidUSD,
    onlineCount,
    totalVisitors,
  };
}

export async function trackOutboundClick(listingId: string): Promise<void> {
  // Read current clicks first
  const { data: item } = await supabase.from('listings').select('clicks').eq('id', listingId).single();
  if (item) {
    await supabase.from('listings').update({ 
      clicks: (item.clicks || 0) + 1,
      last_clicked_at: new Date().toISOString()
    }).eq('id', listingId);
  }
}
