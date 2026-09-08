import React from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { BrandLogo } from "../../components/BrandLogo";
import { Footer } from "../../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - FoundersRankBoard",
  description: "Find answers to commonly asked questions about FoundersRankBoard.",
};

export default function FAQPage() {
  const faqs = [
    {
      num: "01",
      title: "What is FoundersRankBoard?",
      desc: "FoundersRankBoard is a global attention market and directory for startups, indie hackers, and creators. It acts as a digital billboard where rankings are completely driven by transparent bids.",
    },
    {
      num: "02",
      title: "How is the rank calculated?",
      desc: "Your rank is determined strictly by your total cumulative USD paid. There is no editorial bias. If you want the #1 spot, you simply outbid the current #1 holder.",
    },
    {
      num: "03",
      title: "Do I need to create an account?",
      desc: "No account or password is required. You simply submit your domain, pitch, and payment. If you outbid/boost an existing domain later, the system automatically detects it and adds the payment to your domain's total cumulative score.",
    },
    {
      num: "04",
      title: "Is this a recurring subscription?",
      desc: "Absolutely not. Payments are one-time. Once you bid and secure a rank, you stay there permanently until someone else outbids you.",
    },
    {
      num: "05",
      title: "Can I update my website details?",
      desc: "Yes! If you want to change your tagline, category, or domain spelling, simply use the 'Outbid' button on the leaderboard to make a new boost payment. The new details you submit will automatically overwrite the old ones.",
    },
    {
      num: "06",
      title: "How do payments work?",
      desc: "Payments are securely processed via Razorpay natively in Indian Rupees (INR) at real-time exchange rates. We support all major Credit/Debit Cards, UPI (GPay, PhonePe), and NetBanking.",
    },
    {
      num: "07",
      title: "Can I list my YouTube channel or podcast?",
      desc: "Yes! FoundersRankBoard natively supports YouTube channels and creator profiles. Just enter your YouTube link (e.g. youtube.com/@channel) or handle (e.g. @channel). Our system automatically extracts your official high-res circular profile photo, bio, and adds a verified YouTube badge to your leaderboard card under 'Social Media & Creator Tools'.",
    },
  ];

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
          <BrandLogo size="sm" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-inner mb-6">
            <HelpCircle className="h-8 w-8 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Frequently Asked <span className="text-emerald-600 dark:text-emerald-400">Questions</span>
          </h1>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about how the Founders Rank Board operates.
          </p>
        </div>

        {/* FAQ List */}
        <div className="mt-16 space-y-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0f0c] p-6 sm:p-8 shadow-sm transition hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/30"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="text-8xl font-black italic">{faq.num}</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {faq.num}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {faq.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 pl-12">
                  {faq.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="mt-16 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center sm:p-12">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Still have questions?</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            We are always here to help. Reach out to our support team and we will get back to you within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-600 transition"
          >
            Contact Support
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
