"use client";

import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 2000);
    const t3 = setTimeout(() => onComplete(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050807] transition-all duration-700 ease-in-out
        ${phase === "exit" ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"}`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[200px] bg-teal-500/8 blur-[100px] rounded-full pointer-events-none" />

      {/* Main content */}
      <div className={`flex flex-col items-center gap-6 transition-all duration-700
        ${phase === "enter" ? "opacity-0 translate-y-6 scale-95" : "opacity-100 translate-y-0 scale-100"}`}
      >
        {/* Logo Icon */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute h-28 w-28 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse" />
          {/* Icon box */}
          <div className="relative h-20 w-20 rounded-2xl bg-zinc-950 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 flex items-center justify-center">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
              <circle cx="16" cy="16" r="13" fill="#10B981" fillOpacity="0.1" />
              <path d="M7 19L16 10L25 19" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 24L16 18L22 24" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.75" />
              <circle cx="16" cy="5.5" r="2" fill="#F59E0B" />
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-black tracking-tight text-white">
            BidTo<span className="text-emerald-400">RankUp</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 tracking-widest uppercase">
            Pay · Rank · Dominate
          </p>
        </div>

        {/* Animated progress bar */}
        <div className="w-48 h-[2px] rounded-full bg-zinc-800 overflow-hidden mt-2">
          <div
            className={`h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-[1800ms] ease-out
              ${phase === "enter" ? "w-0" : "w-full"}`}
          />
        </div>

        {/* Tagline */}
        <p className={`text-xs text-zinc-600 transition-all duration-500 delay-500
          ${phase === "enter" ? "opacity-0" : "opacity-100"}`}>
          The Global Domain Leaderboard
        </p>
      </div>

      {/* Corner dots decoration */}
      <div className="absolute top-8 left-8 h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
      <div className="absolute top-8 right-8 h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
      <div className="absolute bottom-8 left-8 h-1.5 w-1.5 rounded-full bg-emerald-500/20" />
      <div className="absolute bottom-8 right-8 h-1.5 w-1.5 rounded-full bg-emerald-500/20" />
    </div>
  );
};
