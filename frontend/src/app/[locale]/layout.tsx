import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Sans_Ethiopic } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales, Locale } from "@/i18n";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-ethiopic",
  display: "swap",
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://woodcarvo.com";
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "WOOD CARVO — Bespoke Furniture Workshop Addis Ababa",
      template: "%s | WOOD CARVO",
    },
    description:
      "Handcrafted living, dining, and bedroom furniture in Addis Ababa, Ethiopia. Custom orders made from indigenous hardwoods.",
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        am: `${siteUrl}/am`,
        om: `${siteUrl}/om`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "am" ? "am_ET" : locale === "om" ? "om_ET" : "en_US",
      url: `${siteUrl}/${locale}`,
      siteName: "WOOD CARVO",
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isAmharic = locale === "am";

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} ${isAmharic ? notoEthiopic.variable : ""}`}
    >
      <body className={isAmharic ? "font-ethiopic" : "font-sans"}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
