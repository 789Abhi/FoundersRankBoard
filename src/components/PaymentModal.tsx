"use client";

import React, { useState } from "react";
import { PaymentMethodType, PaymentSubmission } from "../types";
import { formatUSD } from "../lib/utils";
import { DomainFavicon } from "./DomainFavicon";
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  QrCode, 
  ShieldCheck, 
  Loader2, 
  Trophy 
} from "lucide-react";
import confetti from "canvas-confetti";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionData: Omit<PaymentSubmission, "paymentMethod"> | null;
  onPaymentSuccess: (submission: PaymentSubmission) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  submissionData,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<PaymentMethodType>("UPI");
  const [upiId, setUpiId] = useState("founder@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !submissionData) return null;

  const handlePay = () => {
    setIsProcessing(true);

    // Simulate instant payment gateway verification (1.5s)
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#34d399", "#6ee7b7", "#ffffff", "#f59e0b"],
        });
      } catch {
        // fallback
      }

      // Automatically finalize and close after celebration
      setTimeout(() => {
        onPaymentSuccess({
          ...submissionData,
          paymentMethod: method,
        });
        setIsSuccess(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 dark:border-[#1f2d22] bg-white dark:bg-[#0c120e] p-6 sm:p-7 shadow-2xl overflow-hidden transition-colors">
        {!isProcessing && !isSuccess && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#141d16] hover:text-zinc-900 dark:hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">Payment Confirmed!</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {formatUSD(submissionData.amountUSD)} recorded for <strong className="text-emerald-600 dark:text-emerald-400">{submissionData.domain}</strong>
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/30 p-3.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <Trophy className="h-4 w-4" />
                <span>Listed Live on Leaderboard!</span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                Updating positions and categories in real-time...
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#1b281f] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Instant Checkout
                </span>
                <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                  Pay {formatUSD(submissionData.amountUSD)}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-end gap-1.5 mt-0.5">
                  <DomainFavicon
                    domain={submissionData.domain}
                    customFavicon={submissionData.favicon}
                    size="md"
                  />
                  <span>{submissionData.domain}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod("UPI")}
                className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-semibold transition ${
                  method === "UPI"
                    ? "border border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                    : "border border-zinc-200 dark:border-[#1f2d22] bg-zinc-50 dark:bg-[#111712] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200"
                }`}
              >
                <Smartphone className="h-4 w-4 mb-1" />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("Card")}
                className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-semibold transition ${
                  method === "Card"
                    ? "border border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                    : "border border-zinc-200 dark:border-[#1f2d22] bg-zinc-50 dark:bg-[#111712] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200"
                }`}
              >
                <CreditCard className="h-4 w-4 mb-1" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("NetBanking")}
                className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-semibold transition ${
                  method === "NetBanking"
                    ? "border border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                    : "border border-zinc-200 dark:border-[#1f2d22] bg-zinc-50 dark:bg-[#111712] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200"
                }`}
              >
                <QrCode className="h-4 w-4 mb-1" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* Method Content */}
            <div className="mt-5">
              {method === "UPI" && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-zinc-200 dark:border-[#1b281f] bg-zinc-50 dark:bg-[#090e0b] p-4 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-white p-2.5 shadow-md border border-zinc-200 dark:border-transparent">
                      <div className="h-full w-full border-2 border-black flex flex-col items-center justify-center bg-zinc-950 text-white rounded-lg">
                        <QrCode className="h-10 w-10 text-emerald-400" />
                        <span className="text-[7px] font-mono text-zinc-400">BHIM UPI</span>
                      </div>
                    </div>
                    <p className="mt-2.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      Scan with Google Pay, PhonePe, Paytm, or BHIM
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                      UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="mobile@upi"
                      className="w-full rounded-xl border border-zinc-200 dark:border-[#223326] bg-zinc-50 dark:bg-[#111712] px-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {method === "Card" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-[#223326] bg-zinc-50 dark:bg-[#111712] px-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full rounded-xl border border-zinc-200 dark:border-[#223326] bg-zinc-50 dark:bg-[#111712] px-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        defaultValue="•••"
                        className="w-full rounded-xl border border-zinc-200 dark:border-[#223326] bg-zinc-50 dark:bg-[#111712] px-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === "NetBanking" && (
                <div className="space-y-3">
                  <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                    Select Indian Bank
                  </label>
                  <select className="w-full rounded-xl border border-zinc-200 dark:border-[#223326] bg-zinc-50 dark:bg-[#111712] px-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none cursor-pointer">
                    <option className="bg-white dark:bg-[#111712] text-zinc-900 dark:text-white">HDFC Bank</option>
                    <option className="bg-white dark:bg-[#111712] text-zinc-900 dark:text-white">State Bank of India (SBI)</option>
                    <option className="bg-white dark:bg-[#111712] text-zinc-900 dark:text-white">ICICI Bank</option>
                    <option className="bg-white dark:bg-[#111712] text-zinc-900 dark:text-white">Axis Bank</option>
                    <option className="bg-white dark:bg-[#111712] text-zinc-900 dark:text-white">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Action */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] py-3 text-xs sm:text-sm font-bold text-zinc-950 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying {formatUSD(submissionData.amountUSD)}...</span>
                  </>
                ) : (
                  <span>Authorize & Pay {formatUSD(submissionData.amountUSD)}</span>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-zinc-500">
                <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span>256-Bit Encrypted • PCI DSS Compliant</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
