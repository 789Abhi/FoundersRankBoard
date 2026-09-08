"use client";

import React from "react";
import { X, TrendingUp, Sparkles, ShieldCheck, Zap, Globe, Target } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubmit: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenSubmit,
}) => {
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
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-zinc-950 font-black shadow-md shadow-emerald-500/20">
            <TrendingUp className="h-5 w-5 stroke-[3]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">About FoundersRankBoard</h2>
            <p className="text-xs text-emerald-400">The Frictionless Pay-to-Rank Marketing Board</p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-white">FoundersRankBoard</strong> is a transparent digital billboard and dynamic marketing directory built for indie hackers, startup founders, and modern creators.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="rounded-2xl border border-[#1a281d] bg-[#080d0a] p-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <Target className="h-4 w-4" />
                <span>Zero Friction</span>
              </div>
              <p className="text-xs text-zinc-400">
                No signups, no passwords, no email verification. Enter domain, pick USD amount, pay instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-[#1a281d] bg-[#080d0a] p-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Cumulative Bids</span>
              </div>
              <p className="text-xs text-zinc-400">
                Every rupee you pay stays on your score. Boost your position whenever someone bids over you.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Why Not Traditional Ads?
            </h4>
            <p className="text-xs text-zinc-400">
              Traditional ads charge per impression with zero permanence. On FoundersRankBoard, your domain stays listed on the board permanently unless outbid, and your payment is credited transparently to your cumulative domain score.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#18241b]">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenSubmit();
            }}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2 text-xs font-bold text-zinc-950 transition shadow-md shadow-emerald-500/20"
          >
            List My Website
          </button>
        </div>
      </div>
    </div>
  );
};
