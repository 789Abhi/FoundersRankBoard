"use client";

import React from "react";
import { X, BookOpen, CheckCircle2, IndianRupee, Trophy, Layers } from "lucide-react";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rules = [
    {
      num: "01",
      title: "Minimum Starting Bid: $5",
      desc: "Anyone can list their domain starting at $5 in USD. Every rupee paid counts towards your cumulative ranking position.",
    },
    {
      num: "02",
      title: "Dynamic Bidding & Instant Outbidding",
      desc: "If someone above you has paid $50 and you pay $55, you instantly overtake them! The system automatically suggests the exact minimum amount needed to jump ahead of any competitor.",
    },
    {
      num: "03",
      title: "Category Rankings & Overall Board",
      desc: "Websites compete both in their specific niche (e.g. #1 in AI Tools, #1 in Developer) as well as the global overall leaderboard.",
    },
    {
      num: "04",
      title: "Tie-Breakers",
      desc: "If two domains have paid the exact same total amount, the one that made the most recent payment or boost ranks higher.",
    },
    {
      num: "05",
      title: "Safe & Verified Content",
      desc: "Only legitimate websites, SaaS tools, apps, newsletters, and agencies are permitted. Malicious links, phishing, or illegal content will be removed immediately without refund.",
    },
  ];

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
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Rules</h2>
            <p className="text-xs text-zinc-400">Fair, transparent, and algorithmic pay-to-rank rules</p>
          </div>
        </div>

        {/* Rules List */}
        <div className="mt-6 space-y-3.5">
          {rules.map((rule) => (
            <div
              key={rule.num}
              className="flex items-start gap-3.5 rounded-2xl border border-[#18261b] bg-[#070b08] p-3.5 sm:p-4"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-black text-emerald-400 border border-emerald-500/20">
                {rule.num}
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">{rule.title}</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-[#18241b]">
          <button
            onClick={onClose}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2 text-xs font-bold text-zinc-950 transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
