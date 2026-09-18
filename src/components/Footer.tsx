"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo, tagline & verified badge */}
          <div className="flex flex-col items-center md:items-start gap-2.5 text-center md:text-left">
            <BrandLogo size="sm" />
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-normal">
              The Pay-to-Rank Global Leaderboard • Startups, SaaS & Creators
            </p>
          </div>

          {/* Official Social Media Links */}
          <div className="flex items-center gap-3">
            {/* X (Twitter) */}
            <a
              href="https://x.com/THEFRB"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Founders Rank Board on X (Twitter)"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition shadow-sm group"
            >
              <svg className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/foundersrankboard/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Founders Rank Board on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-50/30 dark:hover:bg-pink-950/20 transition shadow-sm group"
            >
              <svg className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/foundersrankboard/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Founders Rank Board on LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition shadow-sm group"
            >
              <svg className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.94 0 1.7-.76 1.7-1.7s-.76-1.7-1.7-1.7-1.7.76-1.7 1.7.76 1.7 1.7 1.7m1.4 9.74v-8.37H5.06v8.37z" />
              </svg>
            </a>
          </div>

          {/* Links for Compliance & Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-zinc-500 dark:text-zinc-400 font-medium">
            <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">About Us</Link>
            <Link href="/rules" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Rules</Link>
            <Link href="/faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">FAQ</Link>
            <Link href="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Contact</Link>
            <Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Privacy</Link>
            <Link href="/refund-policy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Refunds</Link>
          </div>
        </div>

        {/* Featured Badges: Product Hunt & FrogDR */}
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900/80 flex flex-wrap items-center justify-center gap-5">
          {/* Product Hunt Badge */}
          <a
            href="https://www.producthunt.com/products/founders-rank-board?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-founders-rank-board"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-[1.02] inline-flex items-center"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1245486&theme=light&t=1789741148684"
              alt="Founders Rank Board - The pay-to-rank leaderboard for founders &amp; Youtube creators | Product Hunt"
              width="220"
              height="48"
              className="h-[44px] w-auto object-contain rounded-lg"
            />
          </a>

          {/* FrogDR Domain Rating Badge */}
          <a
            href="https://frogdr.com/foundersrankboard.com?utm_source=foundersrankboard.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-[1.02] inline-flex items-center"
          >
            <img
              src="https://frogdr.com/foundersrankboard.com/badge-white.svg"
              alt="Monitor your Domain Rating with FrogDR"
              width="220"
              height="48"
              className="h-[44px] w-auto object-contain rounded-lg"
            />
          </a>
        </div>

        {/* Bottom Bar: Copyright & Secured by Razorpay */}
        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} FoundersRankBoard.com • All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Secured 256-bit SSL Encrypted • Powered by Razorpay
          </p>
        </div>
      </div>
    </footer>
  );
};
