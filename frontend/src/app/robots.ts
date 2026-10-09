import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://woodcarvo.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/manage/", "/_next/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
