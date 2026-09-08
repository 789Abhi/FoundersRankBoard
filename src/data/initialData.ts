import { CategoryType, WebsiteListing } from "../types";

export const CATEGORIES: { name: CategoryType }[] = [
  { name: "All" },
  { name: "AI Agents & Infrastructure" },
  { name: "SEO & AI Visibility" },
   { name: "Social Media & Creator Tools" },
  { name: "Marketing & Advertising" },
  { name: "Crypto, Web3 & Investing" },
  { name: "Developer Tools" },
  { name: "Business, Finance & Legal" },
  { name: "Security, Privacy & Compliance" },
  { name: "Health, Fitness & Wellness" },
  { name: "Leaderboards & Attention Markets" },
  { name: "Hiring, Jobs & Careers" },
  { name: "Education & Learning" },
  { name: "Agencies, Studios & Services" },
  { name: "Ecommerce & Retail" },
  { name: "Domains & Web Assets" },
  { name: "Games & Entertainment" },
  { name: "People & Profiles" },
  { name: "Productivity & Personal Tools" },
  { name: "Design & Creative" },
  { name: "Writing & Content" },
  { name: "Directories, Launch & Discovery" },
  { name: "AI Media Generation" },
  { name: "Audio, Voice & Podcasting" },
  { name: "Sales & Lead Generation" },
  { name: "Travel, Local & Lifestyle" },
  { name: "Real Estate & Property" },
  { name: "Media & News" },
  { name: "Other" },
];

// No static mock data. Clean directory starts at 0 or real user-submitted listings.
export const INITIAL_WEBSITES: WebsiteListing[] = [];

