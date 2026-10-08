import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { getCategories, getProducts, getSiteSettings } from "@/lib/api";
import { ArrowRight, MapPin, Clock, MessageSquare } from "lucide-react";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const [categories, productsData, settings] = await Promise.all([
    getCategories(locale),
    getProducts({ locale, sort: "featured" }),
    getSiteSettings(locale),
  ]);

  const featuredProducts = productsData.results.slice(0, 6);

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-wood-cream via-wood-cream to-wood-surface border-b border-wood-walnut/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-block py-1.5 px-4 rounded-full bg-wood-walnut/15 text-wood-walnut text-xs font-semibold tracking-widest uppercase mb-6">
              Addis Ababa • Handcrafted Hardwood Furniture
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-wood-dark tracking-tight max-w-4xl mx-auto leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-base sm:text-lg text-wood-dark/75 max-w-2xl mx-auto leading-relaxed">
              {t("heroSubtitle")}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/${locale}/products`}
                className="bg-wood-dark hover:bg-wood-walnut text-wood-warm font-semibold text-sm px-8 py-4 rounded-full shadow-md hover:shadow-xl transition-all"
                id="hero-cta-explore"
              >
                {tCommon("exploreFurniture")}
              </Link>
              <Link
                href={`/${locale}/custom-furniture`}
                className="bg-transparent hover:bg-wood-walnut/10 text-wood-dark font-semibold text-sm px-8 py-4 rounded-full border border-wood-walnut/30 transition-all"
                id="hero-cta-custom"
              >
                {tCommon("customFurniture")}
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Categories Showcase */}
        {categories.length > 0 && (
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-wood-dark">
                  {t("categoriesTitle")}
                </h2>
                <div className="w-16 h-1 bg-wood-warm mt-3 rounded-full" />
              </div>
              <Link
                href={`/${locale}/categories`}
                className="mt-4 sm:mt-0 text-sm font-semibold text-wood-walnut hover:text-wood-dark flex items-center gap-1 group"
              >
                <span>View all categories</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.slice(0, 3).map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </section>
        )}

        {/* 3. Featured / Latest Furniture */}
        <section className="py-20 bg-wood-surface/60 border-y border-wood-walnut/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-wood-dark">
                  {t("latestTitle")}
                </h2>
                <p className="mt-2 text-sm text-wood-dark/70">
                  {t("latestSubtitle")}
                </p>
                <div className="w-16 h-1 bg-wood-warm mt-3 rounded-full" />
              </div>
              <Link
                href={`/${locale}/products`}
                className="mt-4 sm:mt-0 text-sm font-semibold text-wood-walnut hover:text-wood-dark flex items-center gap-1 group"
              >
                <span>Browse all pieces</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/70 rounded-3xl border border-wood-walnut/15 p-8">
                <span className="text-4xl block mb-2">🪵</span>
                <p className="text-wood-dark/70 text-sm">{tCommon("emptyState")}</p>
              </div>
            )}
          </div>
        </section>

        {/* 4. Why Choose Wood Carvo */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-wood-dark">
              {t("whyTitle")}
            </h2>
            <div className="w-16 h-1 bg-wood-warm mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-7 rounded-3xl bg-white border border-wood-walnut/15 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🪵</div>
              <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">{t("why1Title")}</h3>
              <p className="text-xs sm:text-sm text-wood-dark/70 leading-relaxed">{t("why1Desc")}</p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-wood-walnut/15 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🔨</div>
              <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">{t("why2Title")}</h3>
              <p className="text-xs sm:text-sm text-wood-dark/70 leading-relaxed">{t("why2Desc")}</p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-wood-walnut/15 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">📐</div>
              <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">{t("why3Title")}</h3>
              <p className="text-xs sm:text-sm text-wood-dark/70 leading-relaxed">{t("why3Desc")}</p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-wood-walnut/15 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">{t("why4Title")}</h3>
              <p className="text-xs sm:text-sm text-wood-dark/70 leading-relaxed">{t("why4Desc")}</p>
            </div>
          </div>
        </section>

        {/* 5. Custom Furniture CTA Banner */}
        <section className="py-16 bg-wood-dark text-wood-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-wood-walnut/40 to-wood-dark p-8 sm:p-14 rounded-3xl border border-wood-walnut/40 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="text-wood-warm text-xs font-semibold uppercase tracking-wider">
                  Bespoke Commissions
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-2">
                  {t("customBannerTitle")}
                </h2>
                <p className="mt-3 text-wood-cream/80 text-sm sm:text-base leading-relaxed">
                  {t("customBannerDesc")}
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link
                  href={`/${locale}/custom-furniture`}
                  className="inline-flex items-center gap-2 bg-wood-warm hover:bg-amber-400 text-wood-dark font-bold text-sm px-8 py-4 rounded-full shadow-lg transition-all"
                  id="home-cta-custom-banner"
                >
                  <span>{t("customBannerCta")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Workshop Visit Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl overflow-hidden border border-wood-walnut/15 shadow-sm grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full bg-wood-surface">
              {settings?.showroom_photo ? (
                <Image
                  src={settings.showroom_photo}
                  alt="WOOD CARVO Showroom & Workshop in Addis Ababa"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-wood-walnut/10 text-wood-walnut/70 p-8 text-center">
                  <span className="text-5xl mb-3">📍</span>
                  <span className="font-serif font-bold text-xl text-wood-dark">WOOD CARVO Workshop</span>
                  <span className="text-xs mt-1">Addis Ababa, Ethiopia</span>
                </div>
              )}
            </div>

            <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-wood-walnut">
                  Visit Our Workshop
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-wood-dark mt-1">
                  {t("showroomCtaTitle")}
                </h3>
                <p className="text-sm text-wood-dark/75 mt-2">
                  {t("showroomCtaSubtitle")}
                </p>
              </div>

              <div className="space-y-3 text-sm text-wood-dark/85">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-wood-walnut flex-shrink-0 mt-0.5" />
                  <span>{settings?.address || "Bole Sub-city, Addis Ababa, Ethiopia"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-wood-walnut flex-shrink-0 mt-0.5" />
                  <span>{settings?.working_hours || "Monday – Saturday: 8:30 AM – 6:00 PM"}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/contact`}
                  className="bg-wood-dark hover:bg-wood-walnut text-wood-warm text-xs font-semibold px-6 py-3 rounded-full transition-all"
                >
                  View Map & Directions
                </Link>
                <a
                  href={`https://wa.me/${(settings?.whatsapp_number || "+251911223344").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-wood-walnut/30 hover:bg-wood-walnut/10 text-wood-dark text-xs font-semibold px-6 py-3 rounded-full transition-all inline-flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Message Ahead</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
