import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "../../../../utils/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      notes // We pass notes back from frontend since we need domain, category, etc.
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";

    // Verify signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Payment is valid! Now update Supabase.
    const supabase = await createClient();
    const amountUSD = Number(notes.amountUSD);

    // Fetch existing total to add to it (for outbids)
    const { data: existing } = await supabase
      .from("listings")
      .select("total_paid_usd")
      .eq("domain", notes.domain)
      .single();

    const newTotal = (existing?.total_paid_usd || 0) + amountUSD;

    const { error: upsertError } = await supabase
      .from("listings")
      .upsert(
        {
          domain: notes.domain,
          name: notes.name || notes.domain,
          url: `https://${notes.domain}`,
          tagline: notes.tagline || "",
          category: notes.category,
          total_paid_usd: newTotal,
          favicon: notes.favicon || "",
          last_clicked_at: existing ? undefined : new Date().toISOString(),
        },
        { onConflict: "domain" }
      );

    if (upsertError) {
      console.error("Supabase upsert failed:", upsertError);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Razorpay verification failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
