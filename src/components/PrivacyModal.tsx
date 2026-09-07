"use client";

import React from "react";
import { X, ShieldCheck, Lock, Eye, Database } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-[#1f2d22] bg-[#0c130e] p-6 sm:p-8 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-zinc-400 hover:bg-[#152218] hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Privacy Policy</h2>
            <p className="text-xs text-zinc-400">Zero data hoarding • Maximum user respect</p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <div className="rounded-2xl border border-[#18261b] bg-[#070b08] p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Lock className="h-4 w-4" />
              <span>1. No Registration or Passwords</span>
            </div>
            <p className="text-xs text-zinc-400">
              We never require users or founders to create an account, enter a password, or submit sensitive personal identity info. You only provide your public website URL and a short pitch.
            </p>
          </div>

          <div className="rounded-2xl border border-[#18261b] bg-[#070b08] p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Eye className="h-4 w-4" />
              <span>2. Public Transparency</span>
            </div>
            <p className="text-xs text-zinc-400">
              Listed domains, categories, and total amounts paid in USD are public by design, creating an open, un-manipulated leaderboard.
            </p>
          </div>

          <div className="rounded-2xl border border-[#18261b] bg-[#070b08] p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Database className="h-4 w-4" />
              <span>3. Payments & Security</span>
            </div>
            <p className="text-xs text-zinc-400">
              All payment transactions are handled directly through authorized gateways (UPI/Card). We do not store credit card numbers or banking credentials on our servers.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-[#18241b]">
          <button
            onClick={onClose}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2 text-xs font-bold text-zinc-950 transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
