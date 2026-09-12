import React from "react";
import Link from "next/link";
import { ArrowLeft, Target, Globe, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import { BrandLogo } from "../../components/BrandLogo";
import { Footer } from "../../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - FoundersRankBoard",
  description: "Learn about FoundersRankBoard: the premier pay-to-rank domain and creator leaderboard.",
  alternates: {
    canonical: "https://foundersrankboard.com/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8faf9] text-zinc-800 dark:bg-[#060907] dark:text-zinc-200 bg-mesh-pattern selection:bg-emerald-500 selection:text-black transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-200/80 dark:border-[#141f17] bg-white/85 dark:bg-[#060907]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition whitespace-nowrap flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Leaderboard</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <Link href="/" className="cursor-pointer flex-shrink-0">
            <BrandLogo size="sm" />
          </Link>

          <Link
            href="/"
            className="rounded-full bg-emerald-500 hover:bg-emerald-400 px-3 sm:px-4 py-1.5 text-xs font-bold text-zinc-950 transition whitespace-nowrap flex-shrink-0"
          >
            <span className="hidden sm:inline">List Domain</span>
            <span className="sm:hidden">+ List</span>
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
          About <span className="text-emerald-600 dark:text-emerald-400">FoundersRankBoard</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The frictionless, algorithmic marketing board designed for founders, indie builders, YouTube creators, and innovative digital brands.
        </p>

        {/* Narrative Section */}
        <div className="mt-8 space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed border-t border-zinc-200 dark:border-[#162319] pt-8">
          <p>
            FoundersRankBoard was created to solve a fundamental problem in internet marketing: <strong className="text-zinc-900 dark:text-white">distribution is broken, expensive, and filled with friction.</strong>
          </p>

          <p>
            Traditional ad platforms (Google Ads, Meta, LinkedIn) force founders and creators through complex account setups, delayed reviews, credit checks, and confusing bidding algorithms that charge for transient impressions. Most directory platforms demand lengthy sign-ups, passwords, email verifications, and weeks of pending approval.
          </p>

          {/* Dedicated Creator & YouTube Channels Showcase Box */}
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 via-zinc-50 to-white dark:via-[#0c140f] dark:to-[#080d09] p-5 sm:p-6 my-6 shadow-sm">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-base mb-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Now Welcoming YouTube Channels &amp; Content Creators</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
              FoundersRankBoard is the first pay-to-rank discovery board that places modern video creators, podcasters, and YouTube channels right alongside software startups.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="rounded-xl bg-white/80 dark:bg-[#121c15] p-3 border border-zinc-200/80 dark:border-[#1a2d20]">
                <div className="font-semibold text-zinc-900 dark:text-white mb-1">Instant Avatar &amp; Bio Extraction</div>
                Simply enter your YouTube URL (<code className="text-emerald-600 dark:text-emerald-400 font-mono">youtube.com/@channel</code>) or handle (<code className="text-emerald-600 dark:text-emerald-400 font-mono">@handle</code>). Our engine automatically extracts your high-resolution circular profile photo and bio.
              </div>
              <div className="rounded-xl bg-white/80 dark:bg-[#121c15] p-3 border border-zinc-200/80 dark:border-[#1a2d20]">
                <div className="font-semibold text-zinc-900 dark:text-white mb-1">Verified YouTube Emblem</div>
                All YouTube listings are badged with an official YouTube indicator badge and categorized under <strong>Social Media &amp; Creator Tools</strong> for direct subscriber traffic.
              </div>
            </div>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            <div className="rounded-2xl border border-zinc-200 dark:border-[#1b2b1f] bg-white dark:bg-[#0c140f] p-5 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-1.5">
                <Zap className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                <span>100% Frictionless</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Zero signups, zero passwords. Enter your website URL or YouTube handle, pick an amount in USD, pay via UPI or card, and you are live on the leaderboard in under 30 seconds.
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
                High-intent visitors, early adopters, and investors browse our leaderboard daily. Clicking your domain takes them straight to your website or YouTube channel.
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
            While the leaderboard rankings are priced globally in USD ($), FoundersRankBoard natively supports seamless checkout in Indian Rupees (₹). You can easily pay using UPI (Google Pay, PhonePe, Paytm, BHIM) alongside standard debit/credit cards, removing the friction typically associated with global ad platforms.
          </p>

          {/* CTA Box */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-white dark:to-[#0c140f] p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between mt-10 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Ready to showcase your website or channel?</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Join high-growth founders and creators to claim your spot from $5.
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
