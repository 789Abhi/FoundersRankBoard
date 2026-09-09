import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://foundersrankboard.com"),
  title: {
    default: "Founders Rank Board - The Pay-to-Rank Startup & Creator Leaderboard",
    template: "%s | Founders Rank Board"
  },
  description: "Founders Rank Board is the premier pay-to-rank leaderboard for founders, startups, and creators. Outbid competitors to rank #1, gain instant exposure, dofollow backlinks, and massive traffic.",
  keywords: [
    "Founders Rank Board", "FoundersRankBoard", "Founders Rank", "Rank Board",
    "domain leaderboard", "startup leaderboard", "pay to rank", "startup directory", 
    "dofollow backlinks", "indie hackers", "SaaS marketing", "website ranking",
    "creator leaderboard", "launch directory", "founder tools"
  ],
  authors: [{ name: "Founders Rank Board" }],
  creator: "Founders Rank Board",
  publisher: "Founders Rank Board",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://foundersrankboard.com",
    title: "Founders Rank Board - #1 Startup & Creator Leaderboard",
    description: "The premier pay-to-rank leaderboard where the highest bid claims rank #1. Outbid competitors, dominate your niche, and unlock high-converting traffic.",
    siteName: "Founders Rank Board",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Founders Rank Board Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Founders Rank Board - The Global Domain & Creator Leaderboard",
    description: "Climb the leaderboard and drive high-intent traffic to your startup or channel. Outbid to reach #1.",
    creator: "@FoundersRankBoard",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://foundersrankboard.com",
  },
  verification: {
    google: "YwFGEl8S9-CJ0h7xMTi8GVkSFzH1CLMugcLTyN5vYIk",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://foundersrankboard.com/#website",
      "url": "https://foundersrankboard.com",
      "name": "Founders Rank Board",
      "alternateName": [
        "FoundersRankBoard",
        "Founders Rank Board",
        "FoundersRankBoard.com",
        "foundersrankboard.com"
      ],
      "description": "The Pay-to-Rank Domain and Creator Leaderboard for founders, startups, and innovators.",
      "publisher": {
        "@id": "https://foundersrankboard.com/#organization"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://foundersrankboard.com/#organization",
      "name": "Founders Rank Board",
      "url": "https://foundersrankboard.com",
      "logo": "https://foundersrankboard.com/icon.svg",
      "sameAs": []
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-screen bg-[#f8faf9] text-zinc-900 dark:bg-[#060907] dark:text-zinc-100 antialiased selection:bg-emerald-500 selection:text-zinc-950 transition-colors duration-200"
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
