import { NextResponse } from "next/server";
import Stripe from "stripe";

// Provide a dummy key if env var is missing during Next.js static build
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummyKeyForBuildTime", {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { domain, name, tagline, category, amountUSD, currencyPref, favicon } = body;

    // Determine the actual amount and currency to charge
    // If USD: amount is direct. If INR: assume roughly 84 INR = 1 USD
    let currency = "usd";
    let unitAmount = Math.round(amountUSD * 100); // Stripe expects cents

    if (currencyPref === "inr") {
      currency = "inr";
      let conversionRate = 84; // Fallback
      
      try {
        const rateRes = await fetch("https://open.er-api.com/v6/latest/USD");
        const rateData = await rateRes.json();
        if (rateData?.rates?.INR) {
          conversionRate = rateData.rates.INR;
        }
      } catch (err) {
        console.error("Exchange rate fetch failed, using fallback", err);
      }
      
      // Round to the nearest whole Rupee (looks cleaner for UPI), then multiply by 100 for paise
      unitAmount = Math.round(amountUSD * conversionRate) * 100;
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      // We omit payment_method_types so Stripe uses your Dashboard defaults (which automatically enables Apple Pay, Cards, and UPI based on the currency)
      
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `RankUp: ${domain}`,
              description: `Listing ${domain} on BidToRankUp in ${category}`,
              images: favicon ? [favicon] : [],
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}?success=true&domain=${encodeURIComponent(domain)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}?canceled=true`,
      metadata: {
        domain,
        name,
        tagline: tagline || "",
        category,
        amountUSD: amountUSD.toString(), // we store the base USD amount in metadata so the webhook knows their rank power
        favicon: favicon || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
