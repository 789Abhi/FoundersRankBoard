import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const STATS_DOMAIN = "__frb_system_stats__";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("clicks")
      .eq("domain", STATS_DOMAIN)
      .single();

    if (error || !data) {
      return NextResponse.json({ totalVisitors: 1 });
    }

    return NextResponse.json({ totalVisitors: Math.max(1, data.clicks || 1) });
  } catch {
    return NextResponse.json({ totalVisitors: 1 }, { status: 200 });
  }
}

export async function POST() {
  try {
    const { data: existing } = await supabase
      .from("listings")
      .select("id, clicks")
      .eq("domain", STATS_DOMAIN)
      .single();

    let newCount = (existing?.clicks || 0) + 1;

    if (existing) {
      await supabase
        .from("listings")
        .update({ clicks: newCount, last_clicked_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("listings").insert({
        domain: STATS_DOMAIN,
        name: "System Stats",
        url: "https://foundersrankboard.com",
        tagline: "Global visitor telemetry",
        category: "Developer Tools",
        total_paid_usd: 0,
        clicks: newCount,
      });
    }

    return NextResponse.json({ totalVisitors: newCount });
  } catch {
    return NextResponse.json({ totalVisitors: 1 }, { status: 200 });
  }
}
