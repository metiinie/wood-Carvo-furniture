import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/api";
import { MapPin, Phone, Clock, MessageSquare, Send, ExternalLink, Instagram, Facebook, Video } from "lucide-react";

interface ContactPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: ContactPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "contact" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://woodcarvo.com";
  return {
    title: `${t("title")} | WOOD CARVO — Addis Ababa Workshop`,
    description: t("subtitle"),
    alternates: {
      canonical: `${siteUrl}/contact`,
    },
    openGraph: {
      title: `${t("title")} | WOOD CARVO`,
      description: t("subtitle"),
      url: `${siteUrl}/contact`,
    },
  };
}

export default async function ContactPage({ params: { locale } }: ContactPageProps) {
  const t = await getTranslations({ locale, namespace: "contact" });
  const settings = await getSiteSettings(locale);

  const cleanPhone = (settings?.phone_number || "+251911223344").replace(/[^0-9+]/g, "");
  const cleanWa = (settings?.whatsapp_number || "+251911223344").replace(/[^0-9]/g, "");
  const cleanTg = (settings?.telegram_username || "woodcarvo").replace("@", "");
  const mapsUrl = settings?.google_maps_url || "https://maps.google.com/?q=Bole+Addis+Ababa";

  return (
    <>
      <Header />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-wood-walnut">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-wood-dark mt-2">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-wood-dark/70">
            {t("subtitle")}
          </p>
          <div className="w-16 h-1 bg-wood-warm mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Inquiries */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-wood-walnut/15 shadow-sm space-y-6">
              <h2 className="text-xl font-serif font-bold text-wood-dark">
                Direct Workshop Channels
              </h2>

              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/${cleanWa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-emerald-600 text-white">
                    <MessageSquare className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-emerald-950 text-sm">WhatsApp Chat</h3>
                    <p className="text-xs text-emerald-800/80">Instant responses, share photos</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                  Chat →
                </span>
              </a>

              {/* Telegram Card */}
              <a
                href={`https://t.me/${cleanTg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-sky-600 text-white">
                    <Send className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-sky-950 text-sm">Telegram Channel & Chat</h3>
                    <p className="text-xs text-sky-800/80">@{cleanTg}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-700 group-hover:translate-x-1 transition-transform">
                  Open →
                </span>
              </a>

              {/* Phone Card */}
              <a
                href={`tel:${cleanPhone}`}
                className="group flex items-center justify-between p-4 rounded-2xl bg-wood-walnut/10 hover:bg-wood-walnut/20 border border-wood-walnut/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-wood-dark text-wood-warm">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-wood-dark text-sm">Direct Phone Call</h3>
                    <p className="text-xs text-wood-dark/70">{settings?.phone_number || "+251 911 22 33 44"}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-wood-dark group-hover:translate-x-1 transition-transform">
                  Call →
                </span>
              </a>
            </div>

            {/* Social Media Links */}
            {(settings?.instagram || settings?.tiktok || settings?.facebook) && (
              <div className="bg-white rounded-3xl p-6 border border-wood-walnut/15 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-wood-walnut mb-4">
                  {t("social")}
                </h3>
                <div className="flex items-center gap-3">
                  {settings.instagram && (
                    <a
                      href={settings.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-wood-walnut/10 hover:bg-wood-walnut/20 text-wood-dark transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {settings.tiktok && (
                    <a
                      href={settings.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-wood-walnut/10 hover:bg-wood-walnut/20 text-wood-dark transition-colors"
                      aria-label="TikTok"
                    >
                      <Video className="w-5 h-5" />
                    </a>
                  )}
                  {settings.facebook && (
                    <a
                      href={settings.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-wood-walnut/10 hover:bg-wood-walnut/20 text-wood-dark transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Workshop Location & Hours */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-wood-walnut/15 shadow-sm space-y-6">
              <h2 className="text-xl font-serif font-bold text-wood-dark">
                Workshop & Showroom Location
              </h2>

              <div className="space-y-4 text-sm text-wood-dark/85">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-wood-walnut flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-wood-dark">{t("address")}</h3>
                    <p className="mt-0.5 text-wood-dark/75">
                      {settings?.address || "Bole Sub-city, Addis Ababa, Ethiopia"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-wood-walnut flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-wood-dark">{t("workingHours")}</h3>
                    <p className="mt-0.5 text-wood-dark/75">
                      {settings?.working_hours || "Monday – Saturday: 8:30 AM – 6:00 PM (Closed on Sundays)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Preview Banner */}
              <div className="rounded-2xl overflow-hidden border border-wood-walnut/20 bg-wood-surface p-6 text-center space-y-3">
                <span className="text-4xl block">🗺️</span>
                <h4 className="font-serif font-bold text-wood-dark text-lg">
                  Navigate via Google Maps
                </h4>
                <p className="text-xs text-wood-dark/70 max-w-md mx-auto">
                  Click below to open GPS directions directly in Google Maps for smartphone navigation to our workshop.
                </p>
                <div className="pt-2">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-wood-dark hover:bg-wood-walnut text-wood-warm text-xs font-semibold px-6 py-3 rounded-full shadow-md transition-all"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
