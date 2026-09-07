import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Provide a dummy key if env var is missing during Next.js static build
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummyKeyForBuildTime", {
  apiVersion: "2024-04-10" as any,
});

// We need to use the Service Role Key or Anon Key to bypass RLS and securely insert data
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("Stripe-Signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      // If we have a webhook secret configured, verify the signature
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } else {
      // In local development, if you haven't set up the Stripe CLI, we fallback to parsing the payload directly.
      // WARNING: Do not do this in production without verifying the signature!
      console.warn("⚠️ No STRIPE_WEBHOOK_SECRET found. Bypassing signature verification (Development only).");
      event = JSON.parse(payload);
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the checkout session completing
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve the metadata we passed in route.ts
    const { domain, name, tagline, category, amountUSD, favicon } = session.metadata || {};

    if (!domain) {
      console.error("Missing domain in session metadata");
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    try {
      const amountToAdd = Number(amountUSD || 0);

      // Check if this domain already exists
      const { data: existing } = await supabase
        .from("listings")
        .select("total_paid_usd")
        .eq("domain", domain)
        .single();

      const newTotal = existing ? Number(existing.total_paid_usd || 0) + amountToAdd : amountToAdd;

      // Insert or update into Supabase
      const { error } = await supabase
        .from("listings")
        .upsert({
          domain,
          name: name || domain,
          url: `https://${domain}`,
          tagline: tagline || "Discover this innovative tool on BidToRankUp.",
          category: category || "Other",
          total_paid_usd: newTotal,
          favicon: favicon || null,
        }, { onConflict: "domain" });

      if (error) {
        console.error("Failed to insert into Supabase via Webhook", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      console.log(`✅ Successfully processed payment for ${domain} ($${amountUSD})`);
    } catch (err) {
      console.error("Webhook Supabase insert failed", err);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
