import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/api";
import { Sparkles, MessageSquare, Send, CheckCircle2, Ruler, TreePine, Hammer, Truck } from "lucide-react";

interface CustomFurniturePageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: CustomFurniturePageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "custom" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://woodcarvo.com";
  return {
    title: `${t("title")} | WOOD CARVO — Addis Ababa Workshop`,
    description: t("subtitle"),
    alternates: {
      canonical: `${siteUrl}/${locale}/custom-furniture`,
    },
    openGraph: {
      title: `${t("title")} | WOOD CARVO`,
      description: t("subtitle"),
      url: `${siteUrl}/${locale}/custom-furniture`,
    },
  };
}

export default async function CustomFurniturePage({ params: { locale } }: CustomFurniturePageProps) {
  const t = await getTranslations({ locale, namespace: "custom" });
  const tInquiry = await getTranslations({ locale, namespace: "inquiry" });
  const settings = await getSiteSettings(locale);

  const cleanWa = (settings?.whatsapp_number || "+251911223344").replace(/[^0-9]/g, "");
  const cleanTg = (settings?.telegram_username || "woodcarvo").replace("@", "");
  const customWaText = encodeURIComponent(
    "Hello WOOD CARVO, I would like to inquire about a custom bespoke furniture commission. I have photos/measurements to share."
  );

  const steps = [
    {
      num: "01",
      icon: Ruler,
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      num: "02",
      icon: TreePine,
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      num: "03",
      icon: Hammer,
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
    {
      num: "04",
      icon: Truck,
      title: t("step4Title"),
      desc: t("step4Desc"),
    },
  ];

  return (
    <>
      <Header />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-wood-walnut/15 text-wood-walnut text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Bespoke Orders
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-wood-dark tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-wood-dark/75 leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="w-16 h-1 bg-wood-warm mx-auto mt-6 rounded-full" />
        </div>

        {/* 4 Steps Grid */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-wood-dark">
              How Our Workshop Commission Process Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative p-8 rounded-3xl bg-white border border-wood-walnut/15 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-2xl font-bold text-wood-warm">
                        {step.num}
                      </span>
                      <span className="p-3 rounded-2xl bg-wood-walnut/10 text-wood-walnut">
                        <Icon className="w-5 h-5" />
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-wood-dark/70 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Timber Selection Guide */}
        <section className="mb-20 bg-wood-surface/80 rounded-3xl p-8 sm:p-12 border border-wood-walnut/20">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl font-serif font-bold text-wood-dark">
              Hardwood Species Available in Addis Ababa
            </h2>
            <p className="text-sm text-wood-dark/70 mt-2">
              Every tree has unique grain structure, density, and natural tone. We only use properly seasoned solid timbers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-wood-walnut/15">
              <h3 className="font-serif font-bold text-wood-dark text-base">Wanza (ዋንዛ / Cordia)</h3>
              <p className="text-xs text-wood-dark/70 mt-2">
                Ethiopia&apos;s beloved indigenous timber. Warm golden-brown hue, medium-soft grain, resistant to warping.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-wood-walnut/15">
              <h3 className="font-serif font-bold text-wood-dark text-base">Mahogany (ማሆጋኒ)</h3>
              <p className="text-xs text-wood-dark/70 mt-2">
                Deep reddish-brown luxury hardwood. Exceptional stability, lustrous finish, ideal for executive furniture.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-wood-walnut/15">
              <h3 className="font-serif font-bold text-wood-dark text-base">Tid (ጽድ / Juniper)</h3>
              <p className="text-xs text-wood-dark/70 mt-2">
                Aromatic indigenous conifer hardwood. Distinctive swirling grain patterns and natural insect resistance.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-wood-walnut/15">
              <h3 className="font-serif font-bold text-wood-dark text-base">White & Red Oak (ኦክ)</h3>
              <p className="text-xs text-wood-dark/70 mt-2">
                Heavy, dense hardwood with prominent rays. Incredible structural strength for heavy dining tables and beds.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Card */}
        <section className="bg-wood-dark text-wood-cream rounded-3xl p-8 sm:p-14 border border-wood-walnut/40 text-center max-w-4xl mx-auto shadow-xl">
          <span className="text-xs uppercase font-bold tracking-widest text-wood-warm">
            Start Your Commission
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mt-2">
            Have a Specific Design in Mind?
          </h2>
          <p className="mt-3 text-wood-cream/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Send us your photos, sketches, or room dimensions directly via WhatsApp. Our master woodworkers will review and send you a detailed quote.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://wa.me/${cleanWa}?text=${customWaText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-8 py-4 rounded-full shadow-lg transition-all inline-flex items-center gap-2"
              id="custom-cta-whatsapp"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Send Design via WhatsApp</span>
            </a>

            <a
              href={`https://t.me/${cleanTg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-8 py-4 rounded-full shadow-lg transition-all inline-flex items-center gap-2"
              id="custom-cta-telegram"
            >
              <Send className="w-4 h-4" />
              <span>Message on Telegram</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
