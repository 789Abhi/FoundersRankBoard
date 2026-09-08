import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../../components/Footer';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-[#060907] py-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-emerald-600 transition mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Leaderboard
        </Link>
        
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight sm:text-5xl mb-12">
          Cancellation & Refund Policy
        </h1>

        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">1. General Policy</h2>
          <p>
            FoundersRankBoard provides a digital advertising space in the form of a leaderboard. Due to the nature of digital goods and immediate visibility of your listing upon payment, all sales are considered final. 
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">2. Cancellations</h2>
          <p>
            Once a domain is submitted and the payment is successfully processed, the listing goes live immediately. Therefore, we do not offer cancellations for successful submissions.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">3. Refunds</h2>
          <p>
            Refunds will only be considered under the following exceptional circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Duplicate payments due to technical errors on our platform or the payment gateway.</li>
            <li>If your domain is rejected by our moderation team for violating our Terms & Conditions (e.g., illegal content, spam).</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">4. Non-Refundable Scenarios</h2>
          <p>
            We do not issue refunds for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Being outbid by another user (this is the core mechanic of the platform).</li>
            <li>Change of mind after a successful listing.</li>
            <li>Typos or mistakes made by the user in the domain URL, name, or description.</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you believe you are eligible for a refund based on the criteria above, please contact us at <strong>foundersrankboard@gmail.com</strong> within 7 days of your transaction.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
