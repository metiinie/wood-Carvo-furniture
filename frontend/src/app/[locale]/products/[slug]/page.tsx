import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import InquiryButtons from "@/components/InquiryButtons";
import ProductCard from "@/components/ProductCard";
import { getProductBySlug, getProducts, getSiteSettings } from "@/lib/api";
import { ChevronRight, ShieldCheck, Truck, Sparkles, Clock, Ruler } from "lucide-react";

interface ProductPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params: { locale, slug } }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(slug, locale);
  if (!product) {
    return { title: "Product Not Found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://woodcarvo.com";
  const ogImg = product.primary_image?.image || product.images?.[0]?.image;

  return {
    title: product.seo_title || `${product.name} | WOOD CARVO Furniture Addis Ababa`,
    description:
      product.seo_description ||
      product.description ||
      `Handcrafted ${product.name} by WOOD CARVO furniture workshop in Addis Ababa, Ethiopia.`,
    alternates: {
      canonical: `${siteUrl}/${locale}/products/${slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description || "Handcrafted furniture piece by WOOD CARVO.",
      url: `${siteUrl}/${locale}/products/${slug}`,
      images: ogImg ? [{ url: ogImg, width: 1200, height: 630, alt: product.name }] : [],
    },
  };
}

export default async function ProductDetailPage({ params: { locale, slug } }: ProductPageProps) {
  const t = await getTranslations({ locale, namespace: "products" });
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const [settings, relatedData] = await Promise.all([
    getSiteSettings(locale),
    getProducts({
      locale,
      category: product.category?.slug,
    }),
  ]);

  const relatedProducts = relatedData.results
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const availabilityBadge = () => {
    switch (product.availability) {
      case "READY":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t("availabilityReady")}
          </span>
        );
      case "MADE_TO_ORDER":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            {t("availabilityMadeToOrder")}
          </span>
        );
      case "SOLD":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-stone-200 text-stone-700 border border-stone-300">
            {t("availabilitySold")}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-xs text-wood-dark/60">
          <Link href={`/${locale}`} className="hover:text-wood-dark transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-wood-dark/40" />
          <Link href={`/${locale}/products`} className="hover:text-wood-dark transition-colors">
            Furniture
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 mx-2 text-wood-dark/40" />
              <Link
                href={`/${locale}/products?category=${product.category.slug}`}
                className="hover:text-wood-dark transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-wood-dark/40" />
          <span className="text-wood-dark font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Photo Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Details & Inquiry CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Badges: Code & Availability */}
              <div className="flex items-center gap-2 mb-3">
                {product.code && (
                  <span className="bg-wood-dark text-wood-warm font-mono font-bold text-xs px-2.5 py-1 rounded-md">
                    {product.code}
                  </span>
                )}
                {availabilityBadge()}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-wood-dark tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price Display */}
              <div className="mt-4 p-4 rounded-2xl bg-white border border-wood-walnut/15 flex items-baseline justify-between shadow-sm">
                <div>
                  <span className="text-xs text-wood-dark/60 block font-medium">
                    {product.price_mode === "FROM" ? "Starting from" : "Workshop Direct Price"}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-wood-dark tracking-tight">
                    {product.formatted_price}
                  </span>
                </div>
                {product.lead_time && (
                  <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full font-medium border border-amber-200/60">
                    {product.lead_time}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mt-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-wood-walnut mb-2">
                    Description
                  </h2>
                  <p className="text-sm text-wood-dark/80 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Specs Table */}
              <div className="mt-6 border-t border-wood-walnut/15 pt-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-wood-walnut mb-3">
                  {t("specs")}
                </h2>
                <dl className="grid grid-cols-2 gap-3 text-xs bg-white/70 p-4 rounded-2xl border border-wood-walnut/10">
                  {product.material && (
                    <div>
                      <dt className="text-wood-dark/60 font-medium">{t("material")}</dt>
                      <dd className="font-semibold text-wood-dark mt-0.5">{product.material}</dd>
                    </div>
                  )}
                  {product.color && (
                    <div>
                      <dt className="text-wood-dark/60 font-medium">{t("color")}</dt>
                      <dd className="font-semibold text-wood-dark mt-0.5">{product.color}</dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <dt className="text-wood-dark/60 font-medium flex items-center gap-1">
                        <Ruler className="w-3 h-3 text-wood-walnut" />
                        {t("dimensions")}
                      </dt>
                      <dd className="font-semibold text-wood-dark mt-0.5">{product.dimensions}</dd>
                    </div>
                  )}
                  {product.is_customizable && (
                    <div>
                      <dt className="text-wood-dark/60 font-medium">{t("customizable")}</dt>
                      <dd className="font-semibold text-emerald-700 mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {t("yes")}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-wood-dark/75">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-wood-walnut/5">
                  <ShieldCheck className="w-4 h-4 text-wood-walnut flex-shrink-0" />
                  <span>Solid hardwood guarantee</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-wood-walnut/5">
                  <Truck className="w-4 h-4 text-wood-walnut flex-shrink-0" />
                  <span>Delivery across Addis Ababa</span>
                </div>
              </div>
            </div>

            {/* Inquiry Action Buttons */}
            <div className="mt-8 pt-6 border-t border-wood-walnut/15">
              <span className="text-xs uppercase font-bold text-wood-dark/60 block mb-3">
                Direct Inquiries & Workshop Orders
              </span>
              <InquiryButtons
                productId={product.id}
                productName={product.name}
                productCode={product.code}
                whatsappNumber={settings?.whatsapp_number}
                telegramUsername={settings?.telegram_username}
                phoneNumber={settings?.phone_number}
              />
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-12 border-t border-wood-walnut/15">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-wood-dark">
                  {t("relatedTitle")}
                </h2>
                <div className="w-12 h-1 bg-wood-warm mt-2 rounded-full" />
              </div>
              {product.category && (
                <Link
                  href={`/${locale}/products?category=${product.category.slug}`}
                  className="text-xs font-semibold text-wood-walnut hover:underline"
                >
                  View full {product.category.name} collection
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
