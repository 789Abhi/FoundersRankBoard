import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Trophy } from "lucide-react";
import { BrandLogo } from "../../components/BrandLogo";
import { Footer } from "../../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rules & How It Works - BidToRankUp",
  description: "Official rules, bidding mechanics, and outbid system for BidToRankUp.",
};

export default function RulesPage() {
  const rules = [
    {
      num: "01",
      title: "Minimum Bid is $5",
      desc: "Anyone can submit their website starting at $5. Any amount of $5 or more will immediately list your domain on both the Global and Category boards.",
    },
    {
      num: "02",
      title: "Pay More to Rank Higher",
      desc: "Rankings are determined strictly and algorithmically by the cumulative amount paid in USD. There are no editorial biases or backdoor deals.",
    },
    {
      num: "03",
      title: "Real-Time Outbidding",
      desc: "If Competitor A has paid $500 and you want to jump ahead of them, paying $505 or $600 instantly overtakes them and pushes them down one rank. The platform automatically suggests the exact minimum amount to climb ahead.",
    },
    {
      num: "04",
      title: "Category Bidding vs Global Bidding",
      desc: "Every domain belongs to one of 29 categories (Leaderboards, SEO, Marketing, Productivity, Agents, Developer, Business, Crypto, etc.). You compete for the #1 spot within your category AND for the overall #1 spot globally.",
    },
    {
      num: "05",
      title: "Cumulative Bids Never Expire",
      desc: "Your payments are cumulative. If you pay $5 today and $500 next week, your total bidding score is $600, permanently preserving your rank equity.",
    },
    {
      num: "06",
      title: "Tie-Breaking Rule",
      desc: "If two domains have paid the exact same total USD amount, the domain that made the most recent payment or boost will rank higher.",
    },
    {
      num: "07",
      title: "Permitted & Prohibited Content",
      desc: "Only legitimate websites, startups, apps, SaaS products, agencies, and newsletters are allowed. Phishing, malware, illegal gambling, or adult content will be removed immediately without refund.",
    },
  ];

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
          <BookOpen className="h-3.5 w-3.5" />
          <span>Platform Guidelines & Mechanics</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          Rules & <span className="text-emerald-600 dark:text-emerald-400">How It Works</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The official bidding guide, outbid calculations, and content standards for BidToRankUp.
        </p>

        {/* Rules Grid */}
        <div className="mt-8 space-y-4 border-t border-zinc-200 dark:border-[#162319] pt-8">
          {rules.map((rule) => (
            <div
              key={rule.num}
              className="flex items-start gap-4 rounded-2xl border border-zinc-200 dark:border-[#1b2b1f] bg-white dark:bg-[#0c140f] p-4 sm:p-5 shadow-sm"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-black text-sm border border-emerald-500/20">
                {rule.num}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">{rule.title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}

          {/* Outbid Example Scenario */}
          <div className="rounded-3xl border border-emerald-500/20 bg-white dark:bg-[#0c140f] p-6 mt-8 shadow-sm">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Example Outbid Scenario</span>
            </h3>
            <div className="mt-4 space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-[#070b08] border border-zinc-200 dark:border-[#1b2b1f]">
                <span>Rank #1: <strong>alpha.io</strong></span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Total Paid: $1,500</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-[#070b08] border border-zinc-200 dark:border-[#1b2b1f]">
                <span>Rank #2: <strong>beta.dev</strong></span>
                <span className="font-bold text-zinc-800 dark:text-zinc-300">Total Paid: $1,000</span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 pt-2 leading-relaxed">
                👉 If Beta.dev wants to overtake Alpha.io for the #1 spot, they need to add: <strong className="text-zinc-900 dark:text-white">$505</strong> (the $500 difference + $5). Once paid, their total becomes $1,505 and they instantly claim #1!
              </p>
            </div>
          </div>
        </div>

        {/* Back CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-xs sm:text-sm font-bold text-zinc-950 transition shadow-lg shadow-emerald-500/20"
          >
            <span>Start Bidding on Leaderboard</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
