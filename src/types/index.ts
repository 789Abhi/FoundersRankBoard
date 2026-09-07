export type CategoryType =
  | "All"
  | "Leaderboards"
  | "SEO"
  | "Marketing"
  | "Productivity"
  | "Agents"
  | "Other"
  | "Crypto"
  | "Developer"
  | "Health"
  | "Business"
  | "Games"
  | "Ecommerce"
  | "Travel"
  | "Directories"
  | "Agencies"
  | "AI Media"
  | "Education"
  | "Social"
  | "People"
  | "Design"
  | "Hiring"
  | "Domains"
  | "Security"
  | "Sales"
  | "News"
  | "Real Estate"
  | "Writing"
  | "Audio";

export interface WebsiteListing {
  id: string;
  domain: string;
  name: string;
  url: string;
  tagline: string;
  category: CategoryType;
  totalPaidUSD: number;
  clicks: number;
  createdAt: string;
  lastClickedAt?: string;
  timeAgo?: string;
  bgColor?: string;
  favicon?: string;
}

export type PaymentMethodType = "UPI" | "Card" | "NetBanking";

export interface PaymentSubmission {
  domain: string;
  name?: string;
  url: string;
  tagline?: string;
  category: CategoryType;
  amountUSD: number;
  paymentMethod: PaymentMethodType;
  targetListingId?: string;
  favicon?: string;
}

export interface LeaderboardStats {
  totalRevenueUSD: number;
  totalListings: number;
  totalClicksDelivered: number;
  topBidUSD: number;
  onlineCount: number;
  totalVisitors: number;
}
