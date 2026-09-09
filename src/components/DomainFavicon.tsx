"use client";

import React, { useState, useEffect } from "react";
import { cleanDomain } from "../lib/utils";
import { HDGlobeIcon } from "./HDGlobeIcon";

interface DomainFaviconProps {
  domain: string;
  name?: string;
  customFavicon?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

/**
 * Domain Favicon component:
 * 1. Attempts to load website's direct scraped favicon (e.g. from HTML).
 * 2. If not available or fails, attempts direct `https://${domain}/favicon.ico`.
 * 3. If website has no favicon (or fails to load), displays the High-Definition (HD) 3D Vector Globe.
 * Zero external fallback services (no Google S2 gstatic blurry globe and no DuckDuckGo grey arrow).
 */
export const DomainFavicon: React.FC<DomainFaviconProps> = ({
  domain,
  name,
  customFavicon,
  size = "md",
  className = "",
}) => {
  const cleaned = cleanDomain(domain);

  // Check if custom favicon is a direct asset or validated Google S2
  const isDirectCustom = Boolean(
    customFavicon &&
    customFavicon.startsWith("http") &&
    !customFavicon.includes("icons.duckduckgo.com")
  );

  const isYouTube = cleaned.startsWith("youtube.com");

  const resolveInitialSrc = () => {
    if (!cleaned || cleaned.length < 3) return "";
    if (isDirectCustom && customFavicon) return customFavicon;
    if (isYouTube) return ""; // Wait for custom avatar or fallback
    return `https://${cleaned}/favicon.ico`;
  };

  const [currentSrc, setCurrentSrc] = useState<string>(resolveInitialSrc());
  const [tier, setTier] = useState<"custom" | "root_ico" | "none">(
    !cleaned || cleaned.length < 3 ? "none" : isDirectCustom ? "custom" : isYouTube ? "none" : "root_ico"
  );
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">(
    !cleaned || cleaned.length < 3 ? "error" : isYouTube && !isDirectCustom ? "error" : "loading"
  );

  useEffect(() => {
    if (!cleaned || cleaned.length < 3) {
      setLoadState("error");
      setTier("none");
      setCurrentSrc("");
      return;
    }

    if (isDirectCustom && customFavicon) {
      setTier("custom");
      setCurrentSrc(customFavicon);
      setLoadState("loading");
      return;
    }

    if (isYouTube) {
      setTier("none");
      setCurrentSrc("");
      setLoadState("error");
      return;
    }

    // Try direct root favicon from the target domain
    setTier("root_ico");
    setCurrentSrc(`https://${cleaned}/favicon.ico`);
    setLoadState("loading");
  }, [cleaned, customFavicon, isDirectCustom, isYouTube]);

  const handleError = () => {
    // If Tier 1 (custom) failed, try root /favicon.ico directly from domain
    if (tier === "custom" && cleaned && currentSrc !== `https://${cleaned}/favicon.ico`) {
      setTier("root_ico");
      setCurrentSrc(`https://${cleaned}/favicon.ico`);
      setLoadState("loading");
      return;
    }

    // If root_ico (or custom that WAS root_ico) failed, try Google S2 as a final safety net
    if ((tier === "root_ico" || tier === "custom") && cleaned) {
      const gS2 = `https://www.google.com/s2/favicons?domain=${cleaned}&sz=128&default_icon=none`;
      if (currentSrc !== gS2) {
        setTier("none"); 
        setCurrentSrc(gS2);
        setLoadState("loading");
        return;
      }
    }

    // The website has NO favicon -> display the HD Globe
    setLoadState("error");
    setTier("none");
    setCurrentSrc("");
  };

  const isXs = size === "xs";
  const isSm = size === "sm";
  const isLg = size === "lg";

  // Dimension mapping
  const globeSize = isXs ? 16 : isSm ? 22 : isLg ? 40 : 28;
  const imgSize = isXs ? "h-3.5 w-3.5" : isSm ? "h-4 w-4" : isLg ? "h-8 w-8 sm:h-9 sm:w-9" : "h-5 w-5";

  // Squircle container classes
  const containerSize = isXs
    ? "h-5 w-5 rounded"
    : isSm
    ? "h-7 w-7 rounded-lg"
    : isLg
    ? "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl"
    : "h-9 w-9 rounded-xl";

  // If website has no favicon or loading failed, display the HD Globe
  if (loadState === "error" || tier === "none" || !cleaned || !currentSrc) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden border border-zinc-200/80 dark:border-[#223326] bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-[#0b140f] dark:to-[#050b07] shadow-inner transition-all ${containerSize} ${className}`}
        title={domain || "Website Domain"}
      >
        <HDGlobeIcon size={globeSize} variant="emerald" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border border-zinc-200/80 dark:border-[#223326] bg-white dark:bg-[#0b120d]  shadow-sm transition-all ${containerSize} ${className}`}
      title={name || domain}
    >
      {/* While loading, show HD Globe smoothly in background */}
      {loadState === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-50/70 dark:bg-[#070e0a]/70 backdrop-blur-[1px]">
          <HDGlobeIcon size={globeSize} variant="emerald" />
        </div>
      )}

      {/* Real Favicon Image from website */}
      {currentSrc ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={currentSrc}
          src={currentSrc || undefined}
          alt={name || domain}
          className={` object-contain w-full h-full transition-opacity duration-200 ${
            loadState === "loaded" ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          onLoad={() => setLoadState("loaded")}
          onError={handleError}
          loading="lazy"
          referrerPolicy="no-referrer"
          ref={(img) => {
            if (img?.complete && img.naturalWidth > 0 && loadState !== "loaded") {
              setLoadState("loaded");
            }
          }}
        />
      ) : null}
    </div>
  );
};
