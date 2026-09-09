import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://foundersrankboard.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/razorpay/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/razorpay/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/razorpay/"],
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/api/razorpay/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
