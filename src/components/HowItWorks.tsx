"use client";

import React from "react";
import { Zap, Trophy, MousePointerClick, ShieldCheck, ArrowRight, Flame } from "lucide-react";

export const HowItWorks: React.FC<{ onOpenSubmit: () => void }> = ({ onOpenSubmit }) => {
  const steps = [
    {
      step: "01",
      icon: <Zap className="h-6 w-6 text-amber-400" />,
      title: "Enter Domain (Zero Signup)",
      desc: "No password, no email verification. Simply submit your domain, pitch tagline, and choose your tech category.",
    },
    {
      step: "02",
      icon: <Trophy className="h-6 w-6 text-orange-400" />,
      title: "Pay in USD to Rank Higher",
      desc: "Rankings are determined by total amount paid in USD. Outbid competitors by $5 or $10,000 to instantly capture the #1 spot.",
    },
    {
      step: "03",
      icon: <MousePointerClick className="h-6 w-6 text-emerald-400" />,
      title: "Get Maximum Clicks & Backlinks",
      desc: "Thousands of tech founders, investors, and early adopters browse FoundersRankBoard daily. Your rank drives high-intent referral traffic.",
    },
  ];

  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 border border-orange-500/20 mb-3">
            <Flame className="h-3.5 w-3.5" />
            Simple & Transparent Economics
          </div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            How Does FoundersRankBoard Work?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            A frictionless marketing channel inspired by internet legends. Designed for ambitious founders who want immediate distribution.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl transition hover:border-zinc-700 hover:bg-zinc-900/80"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700/80">
                  {item.icon}
                </div>
                <span className="text-2xl font-black text-zinc-600">{item.step}</span>
              </div>
              <h3 className="mt-5 text-base font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-12 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 p-8 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
          <div>
            <h3 className="text-lg font-bold text-white">Ready to showcase your website?</h3>
            <p className="text-xs text-zinc-400 mt-1">
              List your domain in under 30 seconds and start climbing the ranks today.
            </p>
          </div>
          <button
            onClick={onOpenSubmit}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-orange-500/20 hover:scale-105 transition"
          >
            <span>List Your Website Now</span>
            <ArrowRight className="h-4 w-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </section>
  );
};
