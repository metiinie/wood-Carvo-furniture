import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/api";
import { Search, Filter, Sparkles, ArrowRight } from "lucide-react";

interface ProductsPageProps {
  params: { locale: string };
  searchParams: {
    category?: string;
    availability?: string;
    sort?: "newest" | "featured";
    q?: string;
  };
}

export async function generateMetadata({ params: { locale } }: ProductsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "products" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://woodcarvo.com";
  return {
    title: `${t("title")} | WOOD CARVO — Bespoke Furniture Addis Ababa`,
    description: t("subtitle"),
    alternates: {
      canonical: `${siteUrl}/products`,
    },
    openGraph: {
      title: `${t("title")} | WOOD CARVO`,
      description: t("subtitle"),
      url: `${siteUrl}/products`,
    },
  };
}

export default async function ProductsPage({ params: { locale }, searchParams }: ProductsPageProps) {
  const t = await getTranslations({ locale, namespace: "products" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const activeCategory = searchParams.category || "";
  const activeAvailability = searchParams.availability || "";
  const activeSort = searchParams.sort || "newest";
  const searchQuery = searchParams.q || "";

  const [categories, productsData] = await Promise.all([
    getCategories(locale),
    getProducts({
      locale,
      category: activeCategory || undefined,
      availability: activeAvailability || undefined,
      sort: activeSort,
      q: searchQuery || undefined,
    }),
  ]);

  const availabilityOptions = [
    { value: "", label: t("filterAll") },
    { value: "READY", label: t("filterReady") },
    { value: "MADE_TO_ORDER", label: t("filterMadeToOrder") },
    { value: "SOLD", label: t("filterPreviouslyMade") },
  ];

  return (
    <>
      <Header />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header & Search */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-widest text-wood-walnut">
            Catalog & Showroom
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-wood-dark mt-1">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-wood-dark/70 max-w-2xl">
            {t("subtitle")}
          </p>

          {/* Search Form */}
          <form
            method="GET"
            action="/products"
            className="mt-6 max-w-xl flex items-center bg-white rounded-2xl border border-wood-walnut/20 shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-wood-warm"
          >
            {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
            {activeAvailability && <input type="hidden" name="availability" value={activeAvailability} />}
            {activeSort && <input type="hidden" name="sort" value={activeSort} />}
            <Search className="w-5 h-5 text-wood-walnut/60 ml-3" />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder={tCommon("searchPlaceholder")}
              className="w-full px-3 py-2 text-sm bg-transparent outline-none text-wood-dark placeholder-wood-dark/40"
            />
            <button
              type="submit"
              className="bg-wood-dark hover:bg-wood-walnut text-wood-warm text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4 mb-8">
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              href={`/products?${new URLSearchParams({
                ...(activeAvailability ? { availability: activeAvailability } : {}),
                ...(activeSort ? { sort: activeSort } : {}),
                ...(searchQuery ? { q: searchQuery } : {}),
              }).toString()}`}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                !activeCategory
                  ? "bg-wood-dark text-wood-warm shadow-sm"
                  : "bg-white text-wood-dark/70 hover:bg-white/80 border border-wood-walnut/15"
              }`}
            >
              {tCommon("allCategories")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?${new URLSearchParams({
                  category: cat.slug,
                  ...(activeAvailability ? { availability: activeAvailability } : {}),
                  ...(activeSort ? { sort: activeSort } : {}),
                  ...(searchQuery ? { q: searchQuery } : {}),
                }).toString()}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.slug
                    ? "bg-wood-dark text-wood-warm shadow-sm"
                    : "bg-white text-wood-dark/70 hover:bg-white/80 border border-wood-walnut/15"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Sub-filters: Availability & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-wood-walnut/10">
            {/* Availability Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-wood-dark/60 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Status:
              </span>
              {availabilityOptions.map((opt) => (
                <Link
                  key={opt.value}
                  href={`/products?${new URLSearchParams({
                    ...(activeCategory ? { category: activeCategory } : {}),
                    ...(opt.value ? { availability: opt.value } : {}),
                    ...(activeSort ? { sort: activeSort } : {}),
                    ...(searchQuery ? { q: searchQuery } : {}),
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeAvailability === opt.value
                      ? "bg-wood-walnut text-wood-cream shadow-sm"
                      : "bg-white/70 text-wood-dark/70 hover:bg-white border border-wood-walnut/10"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>

            {/* Sort Switcher */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-wood-dark/60">Sort:</span>
              <Link
                href={`/products?${new URLSearchParams({
                  ...(activeCategory ? { category: activeCategory } : {}),
                  ...(activeAvailability ? { availability: activeAvailability } : {}),
                  sort: "newest",
                  ...(searchQuery ? { q: searchQuery } : {}),
                }).toString()}`}
                className={`font-semibold ${
                  activeSort === "newest" ? "text-wood-dark underline underline-offset-4" : "text-wood-dark/60 hover:text-wood-dark"
                }`}
              >
                {t("sortNewest")}
              </Link>
              <span className="text-wood-dark/30">•</span>
              <Link
                href={`/products?${new URLSearchParams({
                  ...(activeCategory ? { category: activeCategory } : {}),
                  ...(activeAvailability ? { availability: activeAvailability } : {}),
                  sort: "featured",
                  ...(searchQuery ? { q: searchQuery } : {}),
                }).toString()}`}
                className={`font-semibold ${
                  activeSort === "featured" ? "text-wood-dark underline underline-offset-4" : "text-wood-dark/60 hover:text-wood-dark"
                }`}
              >
                {t("sortFeatured")}
              </Link>
            </div>
          </div>
        </div>

        {/* Count Header */}
        <div className="mb-6 flex items-center justify-between text-xs text-wood-dark/60 font-medium">
          <span>Showing {productsData.results.length} piece{productsData.results.length === 1 ? "" : "s"}</span>
          {(activeCategory || activeAvailability || searchQuery) && (
            <Link
              href="/products"
              className="text-wood-walnut hover:underline font-semibold"
            >
              Reset filters
            </Link>
          )}
        </div>

        {/* Product Grid */}
        {productsData.results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsData.results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State with Bespoke CTA */
          <div className="py-20 px-4 text-center bg-white rounded-3xl border border-wood-walnut/15 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-wood-walnut/10 flex items-center justify-center mx-auto mb-4 text-3xl">
              🪵
            </div>
            <h3 className="font-serif font-bold text-2xl text-wood-dark">
              {tCommon("emptyState")}
            </h3>
            <p className="mt-2 text-sm text-wood-dark/70 max-w-md mx-auto">
              We specialize in custom orders. If you have a photo or dimensions of a specific table, sofa, or bed, our artisans can craft it for you.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/custom-furniture"
                className="bg-wood-dark hover:bg-wood-walnut text-wood-warm text-xs font-semibold px-6 py-3 rounded-full shadow-sm transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request Custom Order</span>
              </Link>
              <Link
                href="/products"
                className="border border-wood-walnut/30 text-wood-dark hover:bg-wood-walnut/10 text-xs font-semibold px-6 py-3 rounded-full transition-all"
              >
                Clear all filters
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
