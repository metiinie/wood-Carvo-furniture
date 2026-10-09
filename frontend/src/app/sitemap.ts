import { MetadataRoute } from "next";
import { getSitemapData } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://woodcarvo.com";
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

  // 1. Static Pages
  for (const page of staticPages) {
    const pagePath = page ? `/${page}` : "";
    sitemapEntries.push({
      url: `${siteUrl}${pagePath}`,
      lastModified: new Date(),
      changeFrequency: page === "" || page === "products" ? "daily" : "weekly",
      priority: page === "" ? 1.0 : page === "products" ? 0.9 : 0.8,
    });
  }

  // 2. Categories
  for (const cat of categories) {
    sitemapEntries.push({
      url: `${siteUrl}/products?category=${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // 3. Products
  for (const prod of products) {
    sitemapEntries.push({
      url: `${siteUrl}/products/${prod.slug}`,
      lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  return sitemapEntries;
}
