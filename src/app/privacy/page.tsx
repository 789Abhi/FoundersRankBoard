import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, Server } from "lucide-react";
import { BrandLogo } from "../../components/BrandLogo";
import { Footer } from "../../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - FoundersRankBoard",
  description: "Privacy Policy for FoundersRankBoard: zero registration, no password collection, safe outbound links.",
};

export default function PrivacyPage() {
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
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Privacy & Data Protection</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          Privacy <span className="text-emerald-600 dark:text-emerald-400">Policy</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Last updated: September 2026. Designed with a strict zero-data-hoarding philosophy.
        </p>

        {/* Content Sections */}
        <div className="mt-8 space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed border-t border-zinc-200 dark:border-[#162319] pt-8">
          <div className="rounded-2xl border border-zinc-200 dark:border-[#1b2b1f] bg-white dark:bg-[#0c140f] p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
              <Lock className="h-4 w-4" />
              <span>1. Zero Login & No Account Data</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We never ask you to create an account, enter a password, or provide social media logins. We believe modern web applications should respect your time and privacy.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-[#1b2b1f] bg-white dark:bg-[#0c140f] p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
              <Eye className="h-4 w-4" />
              <span>2. Public Information We Display</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              When you pay to list your domain, the following details are publicly visible on the leaderboard:
            </p>
            <ul className="list-disc pl-5 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
              <li>Your public website URL and domain name</li>
              <li>Your product tagline / description</li>
              <li>The category you chose (from 29 supported categories)</li>
              <li>The cumulative USD amount paid and the timestamp of your latest boost</li>
              <li>Outbound referral clicks generated via our board</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-[#1b2b1f] bg-white dark:bg-[#0c140f] p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
              <Database className="h-4 w-4" />
              <span>3. Payment Information</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              All payment transactions are conducted through secure, PCI-DSS compliant third-party payment gateways (UPI, debit/credit cards). FoundersRankBoard does not capture, process, or store credit card numbers or UPI PINs on its infrastructure.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-[#1b2b1f] bg-white dark:bg-[#0c140f] p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
              <Server className="h-4 w-4" />
              <span>4. Outbound Links & Tracking</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              When a visitor clicks on a domain listing, they are redirected directly to the external website with standard <code>rel=&quot;noopener noreferrer&quot;</code> tags for security. We record aggregate click counts to showcase marketing performance.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Questions or Removal Requests</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              If you own a listed domain and wish to edit its tagline or request its removal, you can verify ownership via domain DNS TXT record or by contacting our team.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to FoundersRankBoard Leaderboard</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
