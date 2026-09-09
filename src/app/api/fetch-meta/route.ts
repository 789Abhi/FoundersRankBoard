import { NextResponse } from "next/server";
import { cleanDomain } from "../../../lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let rawDomain = searchParams.get("domain") || "";

  if (!rawDomain) {
    return NextResponse.json({ error: "Missing domain" }, { status: 400 });
  }

  // Clean domain string
  let domain = cleanDomain(rawDomain);

  const browserHeaders = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "max-age=0",
  };

  // Protocols to try in sequence
  // If YouTube channel, prioritize https://www.youtube.com directly
  const candidateUrls = domain.includes("youtube.com")
    ? [`https://www.${domain.replace(/^www\./, "")}`, `https://${domain}`]
    : [
        `https://${domain}`,
        `https://www.${domain}`,
        `http://${domain}`,
      ];

  let html = "";
  let finalUrl = `https://${domain}`;
  let responseOk = false;

  for (const targetUrl of candidateUrls) {
    try {
      const res = await fetch(targetUrl, {
        signal: AbortSignal.timeout(8000),
        headers: browserHeaders,
        redirect: "follow",
      });

      if (res.ok) {
        html = await res.text();
        finalUrl = res.url || targetUrl;
        responseOk = true;
        break;
      }
    } catch {
      // Try next candidate protocol / host
      continue;
    }
  }

  let title = "";
  let description = "";
  let iconUrl = "";
  let titleFound = false;
  let descriptionFound = false;

  if (responseOk && html) {
    // 1. Title Extraction
    const ogTitle =
      extractMetaContent(html, "property", "og:title") ||
      extractMetaContent(html, "name", "twitter:title");
    const titleTagMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

    if (ogTitle) {
      title = ogTitle.trim();
      titleFound = title.length > 0;
    } else if (titleTagMatch && titleTagMatch[1]) {
      title = titleTagMatch[1].trim();
      titleFound = title.length > 0;
    }

    if (title) {
      title = cleanEntities(title);
      // Clean separator formatting: "Company - Slogan" -> "Company · Slogan"
      title = title.replace(/\s+[-|]\s+/, " · ");
    }

    // 2. Description Extraction
    const ogDesc =
      extractMetaContent(html, "property", "og:description") ||
      extractMetaContent(html, "name", "twitter:description") ||
      extractMetaContent(html, "name", "description");

    if (ogDesc) {
      description = ogDesc.trim();
      descriptionFound = description.length > 0;
    }

    if (description) {
      description = cleanEntities(description);
    }

    // 3. Favicon Extraction from HTML
    const appleIconMatch =
      html.match(/<link[^>]+rel=["'](?:apple-touch-icon|apple-touch-icon-precomposed)["'][^>]+href=["']([^"']+)["']/i) ||
      html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:apple-touch-icon|apple-touch-icon-precomposed)["']/i);

    const svgIconMatch =
      html.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+type=["']image\/svg\+xml["'][^>]+href=["']([^"']+)["']/i) ||
      html.match(/<link[^>]+href=["']([^"']+)["'][^>]+type=["']image\/svg\+xml["'][^>]+rel=["'](?:icon|shortcut icon)["']/i);

    const standardIconMatch =
      html.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i) ||
      html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:icon|shortcut icon)["']/i);

    let rawIcon = appleIconMatch?.[1] || svgIconMatch?.[1] || standardIconMatch?.[1];

    // For YouTube handles, prefer the og:image as it contains the high-res profile picture
    if (domain.includes("youtube.com")) {
      const ogImage = extractMetaContent(html, "property", "og:image") || extractMetaContent(html, "name", "twitter:image");
      if (ogImage) {
        rawIcon = ogImage;
      }
    }

    if (rawIcon) {
      try {
        iconUrl = new URL(rawIcon, finalUrl).href;
      } catch {
        iconUrl = "";
      }
    }

    // Check standard /favicon.ico at final destination host
    if (!iconUrl) {
      try {
        const rootUrl = new URL("/favicon.ico", finalUrl).href;
        const testRes = await fetch(rootUrl, {
          method: "HEAD",
          signal: AbortSignal.timeout(2000),
        });
        if (testRes.ok && testRes.status === 200) {
          iconUrl = rootUrl;
        }
      } catch {
        // ignore
      }
    }
  }

  // 4. Secondary Favicon Verification (Google S2 404 Check)
  // Only use if Google S2 returns HTTP 200 (real icon), NOT 404
  if (!iconUrl) {
    try {
      const gS2Endpoint = `https://www.google.com/s2/favicons?domain=${domain}&sz=128&default_icon=none`;
      const gS2Check = await fetch(gS2Endpoint, {
        method: "HEAD",
        signal: AbortSignal.timeout(2500),
      });
      if (gS2Check.ok && gS2Check.status === 200) {
        iconUrl = gS2Endpoint;
      }
    } catch {
      // ignore
    }
  }

  // Fallback brand title if not found in HTML
  if (!title || title.length < 2) {
    title = capitalizeDomain(domain);
  }

  return NextResponse.json({
    title: title.slice(0, 85),
    description: description.slice(0, 190),
    favicon: iconUrl || "",
    titleFound,
    descriptionFound,
  });
}

function cleanEntities(str: string): string {
  return str
    .replace(/&#0*38;/g, "&")   // &#038; &#38; -> &
    .replace(/&amp;/g, "&")
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#0*34;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&bull;/g, "·")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

function capitalizeDomain(domain: string): string {
  const name = domain.split(".")[0] || domain;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function extractMetaContent(html: string, attrName: "property" | "name", attrValue: string): string {
  const escaped = escapeRegex(attrValue);
  const patterns = [
    new RegExp(`<meta[^>]*\\b${attrName}=["']${escaped}["'][^>]*\\bcontent=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]*\\bcontent=["']([^"']*)["'][^>]*\\b${attrName}=["']${escaped}["'][^>]*>`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return "";
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
