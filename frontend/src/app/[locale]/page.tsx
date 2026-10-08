import Link from "next/link";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <div className="min-h-screen flex flex-col bg-wood-cream text-wood-text">
      <Header />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-wood-cream via-wood-cream to-wood-walnut/10 border-b border-wood-walnut/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-block py-1.5 px-4 rounded-full bg-wood-walnut/15 text-wood-walnut text-xs font-semibold tracking-widest uppercase mb-6">
              Addis Ababa • Handcrafted Furniture
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
                className="bg-wood-dark hover:bg-wood-walnut text-wood-warm font-semibold text-sm px-7 py-3.5 rounded-full shadow-md transition-all hover:shadow-lg"
              >
                {tCommon("exploreFurniture")}
              </Link>
              <Link
                href={`/${locale}/custom-furniture`}
                className="bg-transparent hover:bg-wood-walnut/10 text-wood-dark font-semibold text-sm px-7 py-3.5 rounded-full border border-wood-walnut/30 transition-all"
              >
                {tCommon("customFurniture")}
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Wood Carvo */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-wood-dark">
              {t("whyTitle")}
            </h2>
            <div className="w-16 h-1 bg-wood-warm mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-white/70 border border-wood-walnut/15 shadow-sm">
              <div className="text-2xl mb-3">🪵</div>
              <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">{t("why1Title")}</h3>
              <p className="text-sm text-wood-dark/70 leading-relaxed">{t("why1Desc")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/70 border border-wood-walnut/15 shadow-sm">
              <div className="text-2xl mb-3">🔨</div>
              <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">{t("why2Title")}</h3>
              <p className="text-sm text-wood-dark/70 leading-relaxed">{t("why2Desc")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/70 border border-wood-walnut/15 shadow-sm">
              <div className="text-2xl mb-3">📐</div>
              <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">{t("why3Title")}</h3>
              <p className="text-sm text-wood-dark/70 leading-relaxed">{t("why3Desc")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/70 border border-wood-walnut/15 shadow-sm">
              <div className="text-2xl mb-3">🤝</div>
              <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">{t("why4Title")}</h3>
              <p className="text-sm text-wood-dark/70 leading-relaxed">{t("why4Desc")}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
