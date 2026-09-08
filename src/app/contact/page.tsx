import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../../components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-[#060907] py-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-emerald-600 transition mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Leaderboard
        </Link>
        
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight sm:text-5xl mb-12">
          Contact Us
        </h1>

        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
          <p className="text-lg font-medium text-zinc-900 dark:text-white mb-6">
            We'd love to hear from you. Please reach out to us using the details below.
          </p>

          <div className="bg-white dark:bg-[#0c120e] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 mb-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">Email Address</h3>
                <p>bidtorankup@gmail.com</p>
                <p className="text-sm text-zinc-500 mt-1">We aim to respond to all inquiries within 24-48 business hours.</p>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">Business Address</h3>
                <p>BidToRankUp</p>
                <p>Akashaya Nilaya ,Alape,padil post,Mangalore, Karnataka - 575007</p>
                <p>India</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">Phone Number</h3>
                <p>+91 8792816959</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
