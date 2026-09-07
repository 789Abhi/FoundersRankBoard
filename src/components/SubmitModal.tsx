"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CategoryType, WebsiteListing } from "../types";
import { CATEGORIES } from "../data/initialData";
import { cleanDomain, ensureProtocol, formatUSD, getFaviconUrl, calculateRanks } from "../lib/utils";
import { HDGlobeIcon } from "./HDGlobeIcon";
import { X, IndianRupee, Trophy, ArrowRight, Loader2 } from "lucide-react";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: WebsiteListing[];
  initialAmount?: number;
  initialCategory?: CategoryType;
  targetListing?: WebsiteListing | null;
  onProceedToPayment: (data: {
    domain: string;
    name?: string;
    url: string;
    tagline?: string;
    category: CategoryType;
    amountUSD: number;
    targetListingId?: string;
    favicon?: string;
  }) => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  listings,
  initialAmount,
  initialCategory,
  targetListing,
  onProceedToPayment,
}) => {
  const [domain, setDomain] = useState("");
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<CategoryType>("Marketing");
  const [amount, setAmount] = useState<number>(25);
  const [error, setError] = useState<string | null>(null);
  const [faviconSrc, setFaviconSrc] = useState<string>("");

  // Real metadata fetched directly from the target website (no static fallback text)
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDesc, setMetaDesc] = useState<string>("");
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const topBid = listings.length > 0 ? listings[0].totalPaidUSD : 0;
  const takeOneSpotPrice = topBid > 0 ? topBid + 5 : 5;

  useEffect(() => {
    if (targetListing) {
      setDomain(targetListing.domain);
      setName(targetListing.name);
      setTagline(targetListing.tagline);
      setCategory(targetListing.category);
      setAmount(initialAmount || 5);
    } else {
      setDomain("");
      setName("");
      setTagline("");
      setCategory(initialCategory && initialCategory !== "All" ? initialCategory : "Marketing");
      setAmount(initialAmount || 5);
    }
    setError(null);
  }, [isOpen, targetListing, initialAmount, initialCategory]);

  useEffect(() => {
    const cleaned = cleanDomain(domain);
    if (cleaned && cleaned.includes(".")) {
      setFaviconSrc(getFaviconUrl(cleaned));

      // Fetch real title & description directly from the target website
      const timer = setTimeout(async () => {
        try {
          setIsFetchingMeta(true);
          const res = await fetch(`/api/fetch-meta?domain=${encodeURIComponent(cleaned)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.titleFound && data.title) setMetaTitle(data.title);
            if (data.descriptionFound && data.description) setMetaDesc(data.description);
            if (data.favicon) setFaviconSrc(data.favicon);
          }
        } catch {
          // ignore, will retry a direct fetch on submit
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
  }, [domain]);

  const existingListing = useMemo(() => {
    if (targetListing) return targetListing;
    const cleaned = cleanDomain(domain);
    return listings.find((l) => cleanDomain(l.domain) === cleaned) || null;
  }, [domain, targetListing, listings]);

  const ranks = calculateRanks(
    listings,
    amount || 5,
    category,
    existingListing ? existingListing.id : undefined
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) {
      setError("Please enter your website domain or URL.");
      return;
    }
    if (!amount || amount < 5) {
      setError("Minimum starting bid is $5.");
      return;
    }

    const clean = cleanDomain(domain);
    setIsSubmitting(true);

    try {
      let activeTitle = metaTitle;
      let activeDesc = metaDesc;
      let activeFavicon = faviconSrc;

      // If metadata hasn't finished fetching yet, fetch it directly now
      if (!activeTitle || !activeDesc || !activeFavicon) {
        try {
          const res = await fetch(`/api/fetch-meta?domain=${encodeURIComponent(clean)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.titleFound && data.title) activeTitle = data.title;
            if (data.descriptionFound && data.description) activeDesc = data.description;
            if (data.favicon) activeFavicon = data.favicon;
          }
        } catch {
          // fall back to whatever the user typed / already fetched
        }
      }

      onProceedToPayment({
        domain: clean,
        name: activeTitle || name.trim() || undefined,
        url: ensureProtocol(domain),
        tagline: activeDesc || tagline.trim() || undefined,
        category,
        amountUSD: Number(amount),
        targetListingId: targetListing?.id,
        favicon: activeFavicon || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-[#1f2d22] bg-white dark:bg-[#0c130e] p-6 sm:p-7 shadow-2xl transition-colors">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#141d16] hover:text-zinc-900 dark:hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {targetListing ? `Outbid "${targetListing.name}"` : "List Domain & Rank Up"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Starting from $5. Pay more to rank higher both in category & overall.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-600 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Domain with Auto-Favicon Preview */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <HDGlobeIcon size={16} variant="emerald" />
                <span>Website URL or Domain *</span>
              </span>
              {faviconSrc && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={faviconSrc} alt="favicon" className="h-6 w-6 rounded" />
                </span>
              )}
            </label>
            <input
              type="text"
              placeholder="e.g. yoursite.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={!!targetListing}
              className="w-full rounded-xl border border-zinc-200 dark:border-[#223326] bg-zinc-50 dark:bg-[#111712] px-3.5 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:outline-none disabled:opacity-60"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>Pitch / Short Description</span>
            </label>
            <input
              type="text"
              placeholder={metaDesc || "e.g. AI that turns ideas into fully built live websites in minutes"}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-[#223326] bg-zinc-50 dark:bg-[#111712] px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full rounded-xl border border-zinc-200 dark:border-[#223326] bg-zinc-50 dark:bg-[#111712] px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              {CATEGORIES.filter((c) => c.name !== "All").map((cat) => (
                <option key={cat.name} value={cat.name} className="bg-white dark:bg-[#111712] text-zinc-900 dark:text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bid Amount in USD */}
          <div className="rounded-2xl border border-zinc-200 dark:border-emerald-950 bg-zinc-50 dark:bg-[#0d140f] p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5" />
                Amount in USD ($) (Min $5)
              </label>

              <button
                type="button"
                onClick={() => setAmount(takeOneSpotPrice)}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Claim Global #1 ({formatUSD(takeOneSpotPrice)})
              </button>
            </div>

            {/* Amount input without spinners */}
            <div className="mt-2 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-black text-emerald-600 dark:text-emerald-400">
                $
              </span>
              <input
                type="number"
                min={5}
                step={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 dark:border-[#223326] bg-white dark:bg-[#070b08] pl-8 pr-4 py-2.5 text-base font-extrabold text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Projected Position Pills */}
            <div className="mt-2.5 flex items-center gap-2 text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">Rank:</span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                #{ranks.categoryRank} in {category}
              </span>
              <span className="rounded-full bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                #{ranks.globalRank} Overall
              </span>
            </div>

            {/* Quick chips */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[5, 20, 50, 100, 500].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                    amount === preset
                      ? "bg-emerald-500 text-black font-bold"
                      : "bg-zinc-200 dark:bg-[#141e16] text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {formatUSD(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] py-3 text-xs sm:text-sm font-bold text-zinc-950 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Proceed to Instant Pay ({formatUSD(amount)})</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
