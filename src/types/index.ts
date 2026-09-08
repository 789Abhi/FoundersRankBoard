export type CategoryType =
  | "All"
  | "AI Agents & Infrastructure"
  | "SEO & AI Visibility"
  | "Marketing & Advertising"
  | "Social Media & Creator Tools"
  | "Crypto, Web3 & Investing"
  | "Developer Tools"
  | "Business, Finance & Legal"
  | "Security, Privacy & Compliance"
  | "Health, Fitness & Wellness"
  | "Leaderboards & Attention Markets"
  | "Hiring, Jobs & Careers"
  | "Education & Learning"
  | "Agencies, Studios & Services"
  | "Ecommerce & Retail"
  | "Domains & Web Assets"
  | "Games & Entertainment"
  | "People & Profiles"
  | "Productivity & Personal Tools"
  | "Design & Creative"
  | "Writing & Content"
  | "Directories, Launch & Discovery"
  | "AI Media Generation"
  | "Audio, Voice & Podcasting"
  | "Sales & Lead Generation"
  | "Travel, Local & Lifestyle"
  | "Real Estate & Property"
  | "Media & News"
  | "Other";

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
