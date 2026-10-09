import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import { getGalleryItems, getCategories } from "@/lib/api";

interface GalleryPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: GalleryPageProps): Promise<Metadata> {
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://woodcarvo.com";
  return {
    title: `${tNav("gallery")} | WOOD CARVO — Workshop Portfolio Addis Ababa`,
    description: "Visual portfolio of custom hardwood furniture, timber grains, joinery details, and finished workshop pieces in Addis Ababa.",
    alternates: {
      canonical: `${siteUrl}/gallery`,
    },
    openGraph: {
      title: `${tNav("gallery")} | WOOD CARVO`,
      description: "Portfolio of handcrafted furniture pieces by WOOD CARVO.",
      url: `${siteUrl}/gallery`,
    },
  };
}

export default async function GalleryPage({ params: { locale } }: GalleryPageProps) {
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const [items, categories] = await Promise.all([
    getGalleryItems(locale),
    getCategories(locale),
  ]);

  return (
    <>
      <Header />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-wood-walnut">
            From the Workshop Floor
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-wood-dark mt-2">
            {tNav("gallery")}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-wood-dark/70">
            A visual showcase of finished commissions, timber grains, joinery details, and workshop craftsmanship in Addis Ababa.
          </p>
          <div className="w-16 h-1 bg-wood-warm mx-auto mt-4 rounded-full" />
        </div>

        <GalleryGrid items={items} categories={categories} />
      </main>

      <Footer />
    </>
  );
}
