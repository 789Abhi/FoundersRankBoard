"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

interface FooterProps {
  onResetData: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onResetData }) => {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-10 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <BrandLogo size="sm" />
            <p className="text-[11px] text-zinc-500">
              The Pay-to-Rank Domain Board • Secured by Razorpay
            </p>
          </div>

          {/* Links for Compliance */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-zinc-500 font-medium">
            <a href="/about" className="hover:text-zinc-800 dark:hover:text-zinc-300">About Us</a>
            <a href="/contact" className="hover:text-zinc-800 dark:hover:text-zinc-300">Contact Us</a>
            <a href="/rules" className="hover:text-zinc-800 dark:hover:text-zinc-300">Terms & Conditions</a>
            <a href="/privacy" className="hover:text-zinc-800 dark:hover:text-zinc-300">Privacy Policy</a>
            <a href="/refund-policy" className="hover:text-zinc-800 dark:hover:text-zinc-300">Cancellation & Refund Policy</a>
          </div>

          {/* Footer Rights */}
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-zinc-500 text-center md:text-right">
              © {new Date().getFullYear()} BidToRankUp. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
