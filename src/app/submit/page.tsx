"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CATEGORIES } from "../../data/initialData";
import { CategoryType, WebsiteListing } from "../../types";
import {
  cleanDomain,
  ensureProtocol,
  formatUSD,
  getFaviconUrl,
  calculateRanks,
} from "../../lib/utils";
import { getStoredListings } from "../../lib/storage";
import { HDGlobeIcon } from "../../components/HDGlobeIcon";
import {
  ShieldCheck,
  Trophy,
  ArrowLeft,
  Loader2,
} from "lucide-react";

function SubmitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read URL parameters for pre-filling
  const urlDomain = searchParams.get("domain") || "";
  const urlCategory = (searchParams.get("category") as CategoryType) || "Marketing & Advertising";
  const urlAmount = Number(searchParams.get("amount")) || 5;
  const targetId = searchParams.get("targetId") || undefined;

  const [domain, setDomain] = useState(urlDomain);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<CategoryType>(urlCategory);
  const [amount, setAmount] = useState<number>(urlAmount);
  
  const [error, setError] = useState<string | null>(null);
  const [faviconSrc, setFaviconSrc] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(84); // Fallback rate

  // Fetch live exchange rate on load
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (data?.rates?.INR) {
          setExchangeRate(data.rates.INR);
        }
      })
      .catch(() => console.error("Could not fetch live exchange rate"));
  }, []);

  // Load listings from storage to calculate outbid data
  const [listings, setListings] = useState<WebsiteListing[]>([]);

  useEffect(() => {
    let isMounted = true;
    getStoredListings().then(data => {
      if (isMounted) setListings(data);
    });
    return () => { isMounted = false; };
  }, []);

  // Real-time favicon and metadata fetch
  useEffect(() => {
    const cleaned = cleanDomain(domain);
    if (cleaned && cleaned.includes(".")) {
      setFaviconSrc(getFaviconUrl(cleaned));
      
      // Auto-fetch metadata so the preview updates before they click submit
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/fetch-meta?domain=${encodeURIComponent(cleaned)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.favicon) {
              setFaviconSrc(data.favicon);
            }
          }
        } catch {
          // ignore
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setFaviconSrc("");
    }
  }, [domain]);

  const targetListing = useMemo(() => {
    if (!targetId) return null;
    return listings.find((l) => l.id === targetId) || null;
  }, [targetId, listings]);

  const existingListing = useMemo(() => {
    if (targetListing) return targetListing;
    const cleaned = cleanDomain(domain);
    return listings.find((l) => cleanDomain(l.domain) === cleaned) || null;
  }, [domain, targetListing, listings]);

  // Generate Rank Prediction based on input amount
  const rankPrediction = useMemo(() => {
    return calculateRanks(listings, Number(amount) || 5, category, existingListing?.id);
  }, [listings, amount, category, existingListing]);

  const ranks = calculateRanks(
    listings,
    amount || 5,
    category,
    existingListing ? existingListing.id : undefined
  );

  const handleProceed = async (currencyPref: "usd" | "inr") => {
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

      if (!activeTitle || !activeDesc || !activeFavicon) {
        try {
          const res = await fetch(`/api/fetch-meta?domain=${encodeURIComponent(clean)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.titleFound && data.title) activeTitle = data.title;
            if (data.descriptionFound && data.description) activeDesc = data.description;
            if (data.favicon) activeFavicon = data.favicon;
          }
        } catch {}
      }

      const orderPayload = {
        domain: clean,
        name: activeTitle || name.trim() || undefined,
        url: ensureProtocol(domain),
        tagline: activeDesc || tagline.trim() || undefined,
        category,
        amountUSD: Number(amount),
        favicon: activeFavicon || undefined,
      };

      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();
      if (!data.order) {
        setError(data.error || "Failed to initialize Razorpay payment.");
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy", // Enter the Key ID generated from the Dashboard
        amount: data.order.amount, 
        currency: data.order.currency,
        name: "FoundersRankBoard",
        description: `Boost ${clean} on Leaderboard`,
        order_id: data.order.id,
        handler: async function (response: any) {
          setIsSubmitting(true);
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                notes: data.order.notes
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              router.push(`/?success=true&domain=${encodeURIComponent(clean)}`);
            } else {
              setError("Payment verification failed. Contact support.");
              setIsSubmitting(false);
            }
          } catch (e) {
            setError("Payment verification failed.");
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#10b981" // emerald-500
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description || "Payment failed.");
        setIsSubmitting(false);
      });
      rzp.open();

    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
    // removed finally block so isSubmitting stays true while modal is open
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-[#060907] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg mb-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leaderboard
        </button>
      </div>

      <div className="w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-[#1f2d22] bg-white dark:bg-[#0c130e] p-6 sm:p-8 shadow-2xl transition-colors">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white leading-tight">
              {targetListing
                ? `Outbid "${targetListing.name || targetListing.domain}"`
                : existingListing
                ? "Boost Your Rank"
                : "List Your Domain"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
              Starting from $5. Pay more to rank higher both in category & overall.
            </p>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Domain Input */}
          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 ml-1">
              Website URL, Domain, or YouTube Channel *
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 z-10 flex h-6 w-6 items-center justify-center overflow-hidden rounded-md bg-zinc-100 dark:bg-[#111712]">
                {faviconSrc ? (
                  <img
                    src={faviconSrc}
                    alt="Favicon"
                    className="h-4 w-4 object-contain"
                    onError={() => setFaviconSrc("")}
                  />
                ) : (
                  <HDGlobeIcon className="h-4 w-4 text-zinc-400" />
                )}
              </div>
              <input
                type="text"
                autoFocus={!urlDomain}
                placeholder="e.g. yoursite.com or youtube.com/@channel"
                value={domain}
                onChange={(e) => !urlDomain && setDomain(e.target.value)}
                readOnly={!!urlDomain}
                className={`w-full rounded-xl border pl-11 pr-4 py-3.5 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors
                  ${urlDomain
                    ? "border-zinc-200 dark:border-[#1b281f] bg-zinc-100 dark:bg-[#0a0f0c] cursor-not-allowed opacity-80 select-none"
                    : "border-zinc-200 dark:border-[#1b281f] bg-zinc-50 dark:bg-[#0c120e] focus:border-emerald-500 cursor-text"
                  }`}
                required
              />
              
            </div>
          </div>

          {/* Category Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 ml-1">
              Category *
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => !urlDomain && setCategory(e.target.value as CategoryType)}
                disabled={!!urlDomain}
                className={`w-full rounded-xl border px-4 py-3.5 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors appearance-none
                  ${urlDomain
                    ? "border-zinc-200 dark:border-[#1b281f] bg-zinc-100 dark:bg-[#0a0f0c] cursor-not-allowed opacity-80"
                    : "border-zinc-200 dark:border-[#1b281f] bg-zinc-50 dark:bg-[#0c120e] focus:border-emerald-500 cursor-pointer"
                  }`}
              >
                {CATEGORIES.filter((c) => c.name !== "All").map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount Input */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Amount in USD ($) (Min $5)
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 font-black">
                $
              </span>
              <input
                type="number"
                min={5}
                step={1}
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-emerald-500/50 bg-white dark:bg-[#060907] pl-8 pr-4 py-3 text-lg font-black text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none shadow-sm"
              />
            </div>

            {/* Live Rank Prediction */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500">Will rank:</span>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                #{ranks.categoryRank} in {category}
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-200/50 dark:bg-white/5 px-2.5 py-1 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-300/50 dark:border-white/10">
                #{ranks.globalRank} Overall
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {[5, 20, 50, 100, 500].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c120e] px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:border-emerald-500 hover:text-emerald-600 transition"
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleProceed("inr")}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] py-4 text-sm font-bold text-zinc-950 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Preparing Checkout...</span>
                </>
              ) : (
                <span>Pay {formatUSD(Math.max(5, amount))} (Cards / UPI / Netbanking)</span>
              )}
            </button>
            
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Secured by Razorpay</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] dark:bg-[#060907]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    }>
      <SubmitContent />
    </Suspense>
  );
}
