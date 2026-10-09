import { MetadataRoute } from "next";
import { getSitemapData } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://woodcarvo.com";
  const locales = ["en", "am", "om"];
  const staticPages = [
    "",
    "products",
    "categories",
    "custom-furniture",
    "gallery",
    "about",
    "contact",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Try fetching live sitemap data from backend
  const liveData = await getSitemapData();

  const products = liveData?.products || [];
  const categories = liveData?.categories || [];

  // 1. Static Pages for all 3 locales
  for (const page of staticPages) {
    for (const locale of locales) {
      const pagePath = page ? `/${page}` : "";
      sitemapEntries.push({
        url: `${siteUrl}/${locale}${pagePath}`,
        lastModified: new Date(),
        changeFrequency: page === "" || page === "products" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : page === "products" ? 0.9 : 0.8,
        alternates: {
          languages: {
            en: `${siteUrl}/en${pagePath}`,
            am: `${siteUrl}/am${pagePath}`,
            om: `${siteUrl}/om${pagePath}`,
            "x-default": `${siteUrl}/en${pagePath}`,
          },
        },
      });
    }
  }

  // 2. Categories
  for (const cat of categories) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}/products?category=${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            en: `${siteUrl}/en/products?category=${cat.slug}`,
            am: `${siteUrl}/am/products?category=${cat.slug}`,
            om: `${siteUrl}/om/products?category=${cat.slug}`,
          },
        },
      });
    }
  }

  // 3. Products
  for (const prod of products) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}/products/${prod.slug}`,
        lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: {
          languages: {
            en: `${siteUrl}/en/products/${prod.slug}`,
            am: `${siteUrl}/am/products/${prod.slug}`,
            om: `${siteUrl}/om/products/${prod.slug}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
