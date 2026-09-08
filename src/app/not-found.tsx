"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const handleOpenSubmit = () => {
    window.location.href = "/";
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f8faf9] text-zinc-800 dark:bg-[#060907] dark:text-zinc-200 bg-mesh-pattern relative selection:bg-emerald-500 selection:text-black transition-colors duration-200">
      <Navbar onOpenSubmit={handleOpenSubmit} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 blur-3xl opacity-20 bg-emerald-500 rounded-full w-40 h-40 mx-auto"></div>
          <AlertCircle className="h-32 w-32 text-emerald-500 relative z-10 drop-shadow-xl" strokeWidth={1} />
        </div>
        
        <h1 className="text-7xl sm:text-9xl font-black tracking-tighter text-zinc-900 dark:text-white drop-shadow-sm mb-4">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-200 mb-4">
          Page Not Found
        </h2>
        
        <p className="max-w-md text-zinc-500 dark:text-zinc-400 mb-10 text-sm sm:text-base leading-relaxed mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back to the leaderboard!
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-zinc-950 transition-all hover:bg-emerald-400 active:scale-95 shadow-md shadow-emerald-500/20"
        >
          <ArrowLeft className="h-4 w-4 stroke-[3]" />
          <span>Back to Leaderboard</span>
        </Link>
      </div>

      <Footer />
    </main>
  );
}
