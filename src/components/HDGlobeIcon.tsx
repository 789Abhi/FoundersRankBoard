"use client";

import React from "react";

interface HDGlobeIconProps {
  className?: string;
  size?: number | string;
  variant?: "emerald" | "blue" | "silver";
}

/**
 * High-Definition (HD) 3D Vector Globe
 * Features:
 * - 23.5-degree axial tilt perspective
 * - Specular 3D lighting gradient & atmospheric rim light
 * - Precision vector continental landmasses (Americas, Eurasia, Africa)
 * - Geodetic latitude & longitude curved meridians
 * - Crystal clear at all retina & 4K resolutions
 */
export const HDGlobeIcon: React.FC<HDGlobeIconProps> = ({
  className = "",
  size = 32,
  variant = "emerald",
}) => {
  const idSuffix = React.useId().replace(/:/g, "_");

  // Variant themes
  const themes = {
    emerald: {
      oceanStart: "#064e3b",
      oceanEnd: "#022c22",
      oceanSurface: "#0f3a2f",
      atmosphere: "#10b981",
      landFill: "#34d399",
      landStroke: "#6ee7b7",
      grid: "#10b981",
      highlight: "#a7f3d0",
    },
    blue: {
      oceanStart: "#1e3a8a",
      oceanEnd: "#0f172a",
      oceanSurface: "#1e293b",
      atmosphere: "#38bdf8",
      landFill: "#60a5fa",
      landStroke: "#93c5fd",
      grid: "#38bdf8",
      highlight: "#e0f2fe",
    },
    silver: {
      oceanStart: "#27272a",
      oceanEnd: "#09090b",
      oceanSurface: "#18181b",
      atmosphere: "#a1a1aa",
      landFill: "#e4e4e7",
      landStroke: "#ffffff",
      grid: "#71717a",
      highlight: "#fafafa",
    },
  };

  const currentTheme = themes[variant] || themes.emerald;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-300 ${className}`}
    >
      <defs>
        {/* Ocean Spherical Shading: realistic light source from upper-left */}
        <radialGradient
          id={`oceanGrad_${idSuffix}`}
          cx="35%"
          cy="30%"
          r="65%"
          fx="25%"
          fy="20%"
        >
          <stop offset="0%" stopColor={currentTheme.oceanSurface} />
          <stop offset="45%" stopColor={currentTheme.oceanStart} />
          <stop offset="90%" stopColor={currentTheme.oceanEnd} />
          <stop offset="100%" stopColor="#01140e" />
        </radialGradient>

        {/* Outer Atmospheric Glow / Rim light */}
        <linearGradient
          id={`atmosphereRim_${idSuffix}`}
          x1="8"
          y1="8"
          x2="56"
          y2="56"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={currentTheme.atmosphere} stopOpacity="0.8" />
          <stop offset="60%" stopColor={currentTheme.atmosphere} stopOpacity="0.2" />
          <stop offset="100%" stopColor={currentTheme.atmosphere} stopOpacity="0.05" />
        </linearGradient>

        {/* Specular Highlight on upper sphere edge */}
        <linearGradient
          id={`specular_${idSuffix}`}
          x1="14"
          y1="10"
          x2="28"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Landmass Shading */}
        <linearGradient
          id={`landGrad_${idSuffix}`}
          x1="12"
          y1="12"
          x2="52"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={currentTheme.landStroke} />
          <stop offset="50%" stopColor={currentTheme.landFill} />
          <stop offset="100%" stopColor={currentTheme.atmosphere} stopOpacity="0.85" />
        </linearGradient>

        {/* Clip path to keep continents precisely within globe perimeter */}
        <clipPath id={`globeClip_${idSuffix}`}>
          <circle cx="32" cy="32" r="27.5" />
        </clipPath>
      </defs>

      {/* Atmospheric Halo (Outer soft ring) */}
      <circle
        cx="32"
        cy="32"
        r="29.5"
        stroke={currentTheme.atmosphere}
        strokeWidth="1.2"
        strokeOpacity="0.3"
        strokeDasharray="2 3"
      />
      <circle
        cx="32"
        cy="32"
        r="28.5"
        stroke="url(#atmosphereRim_"
        strokeWidth="1.5"
      />

      {/* Main Globe Sphere Body */}
      <circle
        cx="32"
        cy="32"
        r="27.5"
        fill={`url(#oceanGrad_${idSuffix})`}
      />

      {/* Clipped Globe Content: Meridians & Continents */}
      <g clipPath={`url(#globeClip_${idSuffix})`}>
        {/* Geodetic Grid: Latitude Lines */}
        {/* Equator */}
        <line
          x1="4.5"
          y1="32"
          x2="59.5"
          y2="32"
          stroke={currentTheme.grid}
          strokeWidth="0.9"
          strokeOpacity="0.35"
        />
        {/* Tropic of Cancer */}
        <path
          d="M 10 20 Q 32 25 54 20"
          stroke={currentTheme.grid}
          strokeWidth="0.8"
          strokeOpacity="0.25"
          fill="none"
        />
        {/* Tropic of Capricorn */}
        <path
          d="M 10 44 Q 32 39 54 44"
          stroke={currentTheme.grid}
          strokeWidth="0.8"
          strokeOpacity="0.25"
          fill="none"
        />
        {/* Arctic Circle */}
        <path
          d="M 18 12 Q 32 15 46 12"
          stroke={currentTheme.grid}
          strokeWidth="0.6"
          strokeOpacity="0.2"
          fill="none"
        />
        {/* Antarctic Circle */}
        <path
          d="M 18 52 Q 32 49 46 52"
          stroke={currentTheme.grid}
          strokeWidth="0.6"
          strokeOpacity="0.2"
          fill="none"
        />

        {/* Geodetic Grid: Longitude Ellipses */}
        {/* Central Prime Meridian */}
        <ellipse
          cx="32"
          cy="32"
          rx="12"
          ry="27.5"
          stroke={currentTheme.grid}
          strokeWidth="0.85"
          strokeOpacity="0.3"
          fill="none"
        />
        {/* Outer Meridian Arc */}
        <ellipse
          cx="32"
          cy="32"
          rx="21"
          ry="27.5"
          stroke={currentTheme.grid}
          strokeWidth="0.75"
          strokeOpacity="0.25"
          fill="none"
        />
        {/* Axis line */}
        <line
          x1="32"
          y1="4.5"
          x2="32"
          y2="59.5"
          stroke={currentTheme.grid}
          strokeWidth="0.9"
          strokeOpacity="0.3"
        />

        {/* High-Definition Continental Landmasses */}
        {/* 1. North America / Greenland */}
        <path
          d="M 17 14 C 20 12, 25 13, 27 16 C 28 18, 25 21, 23 23 C 21 25, 23 27, 24 29 C 22 30, 20 28, 19 26 C 18 24, 16 23, 14 20 C 13 17, 15 15, 17 14 Z"
          fill={`url(#landGrad_${idSuffix})`}
          opacity="0.92"
        />
        {/* Greenland */}
        <path
          d="M 29 10 C 31 9, 34 10, 33 13 C 31 14, 28 13, 29 10 Z"
          fill={`url(#landGrad_${idSuffix})`}
          opacity="0.85"
        />

        {/* 2. South America */}
        <path
          d="M 23 33 C 27 34, 29 37, 28 41 C 27 45, 25 48, 23 50 C 22 47, 21 43, 21 38 C 21 35, 22 33, 23 33 Z"
          fill={`url(#landGrad_${idSuffix})`}
          opacity="0.9"
        />

        {/* 3. Europe & Africa */}
        <path
          d="M 36 17 C 39 16, 43 17, 42 20 C 40 22, 38 21, 37 23 C 35 21, 35 18, 36 17 Z"
          fill={`url(#landGrad_${idSuffix})`}
          opacity="0.92"
        />
        {/* Africa */}
        <path
          d="M 37 25 C 42 25, 45 28, 44 33 C 43 37, 41 42, 38 45 C 36 43, 36 38, 35 34 C 35 30, 36 26, 37 25 Z"
          fill={`url(#landGrad_${idSuffix})`}
          opacity="0.92"
        />

        {/* 4. Asia & India */}
        <path
          d="M 45 15 C 50 14, 55 17, 54 22 C 52 24, 49 23, 47 26 C 45 25, 44 22, 45 18 Z"
          fill={`url(#landGrad_${idSuffix})`}
          opacity="0.9"
        />
        {/* Indian Subcontinent / SE Asia */}
        <path
          d="M 47 27 C 49 27, 50 29, 49 32 C 48 34, 46 32, 47 27 Z"
          fill={`url(#landGrad_${idSuffix})`}
          opacity="0.88"
        />

        {/* Island Archipelago Points */}
        <circle cx="28" cy="27" r="0.9" fill={currentTheme.landStroke} opacity="0.9" />
        <circle cx="51" cy="35" r="1.1" fill={currentTheme.landStroke} opacity="0.9" />
        <circle cx="53" cy="38" r="0.9" fill={currentTheme.landStroke} opacity="0.85" />
        <circle cx="43" cy="47" r="0.9" fill={currentTheme.landStroke} opacity="0.85" />

        {/* Night / Terminator Shadow Gradient (Right half subtle depth) */}
        <path
          d="M 32 4.5 C 44 4.5, 59.5 17, 59.5 32 C 59.5 47, 44 59.5, 32 59.5 C 38 52, 42 42, 42 32 C 42 22, 38 12, 32 4.5 Z"
          fill="#000000"
          opacity="0.32"
        />

        {/* Atmospheric Upper-Left Specular Sheen (Gives real 3D Glass / Planet look) */}
        <ellipse
          cx="24"
          cy="18"
          rx="12"
          ry="7"
          transform="rotate(-25 24 18)"
          fill={`url(#specular_${idSuffix})`}
        />
      </g>

      {/* Outer Crisp Precision Border */}
      <circle
        cx="32"
        cy="32"
        r="27.5"
        stroke={`url(#atmosphereRim_${idSuffix})`}
        strokeWidth="1.2"
      />

      {/* Orbit Satellite Beacon (Active Ping Dot) */}
      <circle cx="49" cy="15" r="1.75" fill="#34d399" />
      <circle
        cx="49"
        cy="15"
        r="3"
        stroke="#34d399"
        strokeWidth="0.75"
        strokeOpacity="0.7"
        className="animate-ping"
        style={{ transformOrigin: "49px 15px", animationDuration: "2.5s" }}
      />
    </svg>
  );
};
