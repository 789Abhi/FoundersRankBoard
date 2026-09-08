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
    default: "FoundersRankBoard - The Pay-to-Rank Domain Leaderboard",
    template: "%s | FoundersRankBoard"
  },
  description: "Climb the ultimate domain leaderboard. Bid with your website to rank #1 and get instant high-quality traffic, exposure, and backlinks for ambitious startups.",
  keywords: [
    "founders rank board", "domain leaderboard", "startup directory", "pay to rank", 
    "dofollow backlinks", "indie hackers", "SaaS marketing", "website ranking",
    "launch directory", "founder tools"
  ],
  authors: [{ name: "FoundersRankBoard" }],
  creator: "FoundersRankBoard",
  publisher: "FoundersRankBoard",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://foundersrankboard.com",
    title: "FoundersRankBoard - Rank #1 on the Global Leaderboard",
    description: "The leaderboard where the highest bid ranks #1. Outbid competitors, dominate your category, and drive massive traffic to your startup.",
    siteName: "FoundersRankBoard",
  },
  twitter: {
    card: "summary_large_image",
    title: "FoundersRankBoard - The Global Domain Leaderboard",
    description: "Climb the leaderboard and drive traffic to your startup. Highest bid ranks #1.",
    creator: "@FoundersRankBoard",
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
    google: "google2c583da9c5172027",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://foundersrankboard.com/#website",
      "url": "https://foundersrankboard.com",
      "name": "FoundersRankBoard",
      "description": "The Pay-to-Rank Domain Leaderboard for founders and startups.",
      "publisher": {
        "@id": "https://foundersrankboard.com/#organization"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://foundersrankboard.com/#organization",
      "name": "FoundersRankBoard",
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
      <body className="min-h-screen bg-[#f8faf9] text-zinc-900 dark:bg-[#060907] dark:text-zinc-100 antialiased selection:bg-emerald-500 selection:text-zinc-950 transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
