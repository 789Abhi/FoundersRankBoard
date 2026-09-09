import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

export async function POST(req: Request) {
  try {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("Missing Razorpay credentials in environment:", { key_id: !!key_id, key_secret: !!key_secret });
      return NextResponse.json({ error: "Razorpay credentials not configured." }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const body = await req.json();
    const { domain, name, tagline, category, amountUSD, favicon } = body;

    // Calculate INR amount. Fallback to 84, but try to fetch live rate
    let conversionRate = 84;
    try {
      const rateRes = await fetch("https://open.er-api.com/v6/latest/USD", {
        signal: AbortSignal.timeout(3000),
      });
      const rateData = await rateRes.json();
      if (rateData?.rates?.INR) {
        conversionRate = rateData.rates.INR;
      }
    } catch (err) {
      console.error("Exchange rate fetch failed, using fallback", err);
    }
    
    // Amount in INR
    const amountINR = Math.round((Number(amountUSD) || 5) * conversionRate);
    // Amount in paise
    const unitAmountPaise = Math.max(100, amountINR * 100);

    // Razorpay notes API strictly requires standard ASCII characters. 
    // Emojis (e.g. 🙏) from YouTube channel titles/descriptions cause Razorpay to reject with:
    // "The notes field should contain valid UTF-8 encoded characters."
    const sanitizeForNotes = (str: string, maxLen = 200) => {
      return (str || "")
        .replace(/[^\x20-\x7E]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLen);
    };

    const shortRandom = Math.random().toString(36).substring(2, 7);
    const options = {
      amount: unitAmountPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${shortRandom}`.slice(0, 40),
      payment_capture: 1, // Auto-capture the payment immediately
      notes: {
        domain: sanitizeForNotes(domain, 200),
        name: sanitizeForNotes(name || domain, 200),
        tagline: sanitizeForNotes(tagline, 200),
        category: sanitizeForNotes(category || "Social Media & Creator Tools", 200),
        amountUSD: String(amountUSD || 5).slice(0, 50),
        favicon: String(favicon || "").trim().slice(0, 255),
      },
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({ order });
  } catch (err: any) {
    const errorDetails = err?.error?.description || err?.message || "Payment order creation failed";
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json({ error: errorDetails }, { status: 500 });
  }
}
