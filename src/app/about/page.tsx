import React from "react";
import Link from "next/link";
import { ArrowLeft, Target, Globe, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import { BrandLogo } from "../../components/BrandLogo";
import { Footer } from "../../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - BidToRankUp",
  description: "Learn about BidToRankUp: the frictionless pay-to-rank domain leaderboard in USD.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8faf9] text-zinc-800 dark:bg-[#060907] dark:text-zinc-200 bg-mesh-pattern selection:bg-emerald-500 selection:text-black transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-200/80 dark:border-[#141f17] bg-white/85 dark:bg-[#060907]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Leaderboard</span>
          </Link>

          <Link href="/" className="cursor-pointer">
            <BrandLogo size="sm" />
          </Link>

          <Link
            href="/"
            className="rounded-full bg-emerald-500 hover:bg-emerald-400 px-4 py-1.5 text-xs font-bold text-zinc-950 transition"
          >
            List Domain
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4">
          <Target className="h-3.5 w-3.5" />
          <span>Our Vision & Mission</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          About <span className="text-emerald-600 dark:text-emerald-400">BidToRankUp</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The frictionless, algorithmic marketing board designed for founders, indie builders, and innovative tech products.
        </p>

        {/* Narrative Section */}
        <div className="mt-8 space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed border-t border-zinc-200 dark:border-[#162319] pt-8">
          <p>
            BidToRankUp was created to solve a fundamental problem in internet marketing: <strong className="text-zinc-900 dark:text-white">distribution is broken, expensive, and filled with friction.</strong>
          </p>

          <p>
            Traditional ad platforms (Google Ads, Meta, LinkedIn) force founders through complex account setups, delayed reviews, credit checks, and confusing bidding algorithms that charge for transient impressions. Most directory platforms demand lengthy sign-ups, passwords, email verifications, and weeks of pending approval.
          </p>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            <div className="rounded-2xl border border-zinc-200 dark:border-[#1b2b1f] bg-white dark:bg-[#0c140f] p-5 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-1.5">
                <Zap className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                <span>100% Frictionless</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Zero signups, zero passwords. Enter your URL, pick an amount in USD, pay via UPI or card, and you are live on the leaderboard in under 30 seconds.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-[#1b2b1f] bg-white dark:bg-[#0c140f] p-5 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-1.5">
                <TrendingUp className="h-4 w-4" />
                <span>Cumulative Bidding</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every dollar you bid adds up. If you start with $5 and add $500 later, your cumulative score becomes $505, permanently preserving your rank equity.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-[#1b2b1f] bg-white dark:bg-[#0c140f] p-5 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-1.5">
                <Globe className="h-4 w-4" />
                <span>Direct Referral Clicks</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                High-intent visitors, early adopters, and investors browse our leaderboard daily. Clicking your domain takes them straight to your website.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-[#1b2b1f] bg-white dark:bg-[#0c140f] p-5 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>100% Transparent</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The revenue pool, bid amounts, and positions are public. No hidden algorithms or backdoor sponsorships.
              </p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-zinc-900 dark:text-white pt-4">Global Leaderboard, Local Payments</h2>
          <p>
            While the leaderboard rankings are priced globally in USD ($), BidToRankUp natively supports seamless checkout in Indian Rupees (₹). You can easily pay using UPI (Google Pay, PhonePe, Paytm, BHIM) alongside standard debit/credit cards, removing the friction typically associated with global ad platforms.
          </p>

          {/* CTA Box */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-white dark:to-[#0c140f] p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between mt-10 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Ready to showcase your website?</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Join high-growth founders and claim your spot from $5.
              </p>
            </div>
            <Link
              href="/"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-zinc-950 transition shadow-md shadow-emerald-500/20"
            >
              <span>Go to Leaderboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
