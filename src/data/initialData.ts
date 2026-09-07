import { CategoryType, WebsiteListing } from "../types";

export const CATEGORIES: { name: CategoryType }[] = [
  { name: "All" },
  { name: "SEO" },
  { name: "Marketing" },
  { name: "Productivity" },
  { name: "Agents" },
  { name: "Crypto" },
  { name: "Developer" },
  { name: "Health" },
  { name: "Business" },
  { name: "Games" },
  { name: "Ecommerce" },
  { name: "Travel" },
  { name: "Directories" },
  { name: "Agencies" },
  { name: "AI Media" },
  { name: "Education" },
  { name: "Social" },
  { name: "People" },
  { name: "Design" },
  { name: "Hiring" },
  { name: "Domains" },
  { name: "Security" },
  { name: "Sales" },
  { name: "News" },
  { name: "Real Estate" },
  { name: "Writing" },
  { name: "Audio" },
   { name: "Other" },
];

// No static mock data. Clean directory starts at 0 or real user-submitted listings.
export const INITIAL_WEBSITES: WebsiteListing[] = [];

