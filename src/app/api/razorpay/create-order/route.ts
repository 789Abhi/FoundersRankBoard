import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { domain, name, tagline, category, amountUSD, favicon } = body;

    // Calculate INR amount. Fallback to 84, but try to fetch live rate
    let conversionRate = 84;
    try {
      const rateRes = await fetch("https://open.er-api.com/v6/latest/USD");
      const rateData = await rateRes.json();
      if (rateData?.rates?.INR) {
        conversionRate = rateData.rates.INR;
      }
    } catch (err) {
      console.error("Exchange rate fetch failed, using fallback", err);
    }
    
    // Amount in INR
    const amountINR = Math.round(amountUSD * conversionRate);
    // Amount in paise
    const unitAmountPaise = amountINR * 100;

    const options = {
      amount: unitAmountPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${domain.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20)}`,
      notes: {
        domain,
        name: name || "",
        tagline: tagline || "",
        category,
        amountUSD: amountUSD.toString(),
        favicon: favicon || "",
      },
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({ order });
  } catch (err: any) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
