import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/api";
import { ShieldCheck, HeartHandshake, Sparkles, Award } from "lucide-react";

interface AboutPageProps {
  params: { locale: string };
}

export default async function AboutPage({ params: { locale } }: AboutPageProps) {
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const settings = await getSiteSettings(locale);

  return (
    <>
      <Header />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-wood-walnut">
            Our Story & Craft
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-wood-dark mt-2 tracking-tight">
            {tNav("about")} — WOOD CARVO
          </h1>
          <p className="mt-4 text-base sm:text-lg text-wood-dark/75 leading-relaxed">
            Handcrafted solid wood furniture built with precision, pride, and patience in the heart of Addis Ababa, Ethiopia.
          </p>
          <div className="w-16 h-1 bg-wood-warm mx-auto mt-6 rounded-full" />
        </div>

        {/* Story Section with Showroom Image */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-wood-surface border border-wood-walnut/20 shadow-md">
            {settings?.showroom_photo ? (
              <Image
                src={settings.showroom_photo}
                alt="WOOD CARVO Workshop Craftsmen in Addis Ababa"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-wood-dark text-wood-cream text-center">
                <span className="text-5xl mb-3">🪵</span>
                <span className="font-serif font-bold text-2xl text-wood-warm">WOOD CARVO</span>
                <span className="text-xs text-wood-cream/70 mt-1">Master Artisans • Addis Ababa</span>
              </div>
            )}
          </div>

          <div className="space-y-6 text-sm sm:text-base text-wood-dark/80 leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-wood-dark">
              Built to Outlive Fast Furniture
            </h2>
            <p>
              Founded in Addis Ababa, WOOD CARVO was established on a simple conviction: furniture should be an heirloom, not a disposable commodity. In a market flooded with flimsy chipboard and imported particleboard that sags and breaks within months, our workshop returned to the timeless tradition of solid timber.
            </p>
            <p>
              Every dining table, platform bed, and console that leaves our workshop is cut from kiln-dried, seasoned hardwoods such as indigenous Wanza, Tid, fine Mahogany, and Oak. We hand-select timber boards for character, balance the grain patterns, and hand-finish every edge.
            </p>
            <p>
              When you commission a piece with WOOD CARVO, you deal directly with the artisans crafting it. No showroom markups, no overseas shipping delays — just authentic, enduring Ethiopian craftsmanship.
            </p>
          </div>
        </section>

        {/* Core Workshop Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-wood-dark">
              Our Craftsmanship Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-wood-walnut/15 shadow-sm">
              <span className="p-3 rounded-2xl bg-wood-walnut/10 text-wood-walnut inline-block mb-4">
                <Award className="w-6 h-6" />
              </span>
              <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">Kiln-Dried Timber</h3>
              <p className="text-xs sm:text-sm text-wood-dark/70 leading-relaxed">
                We properly air and kiln-season our wood to ensure minimal moisture, preventing cracking and seasonal warping.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-wood-walnut/15 shadow-sm">
              <span className="p-3 rounded-2xl bg-wood-walnut/10 text-wood-walnut inline-block mb-4">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">Mortise & Tenon</h3>
              <p className="text-xs sm:text-sm text-wood-dark/70 leading-relaxed">
                Traditional joinery techniques that bind wood to wood structurally, eliminating wobbly screws and loosening joints.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-wood-walnut/15 shadow-sm">
              <span className="p-3 rounded-2xl bg-wood-walnut/10 text-wood-walnut inline-block mb-4">
                <Sparkles className="w-6 h-6" />
              </span>
              <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">Tailored Dimensions</h3>
              <p className="text-xs sm:text-sm text-wood-dark/70 leading-relaxed">
                Every apartment or residence in Addis Ababa has unique layouts. We build each piece to your exact centimeters.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-wood-walnut/15 shadow-sm">
              <span className="p-3 rounded-2xl bg-wood-walnut/10 text-wood-walnut inline-block mb-4">
                <HeartHandshake className="w-6 h-6" />
              </span>
              <h3 className="font-serif font-bold text-wood-dark text-lg mb-2">Workshop Direct</h3>
              <p className="text-xs sm:text-sm text-wood-dark/70 leading-relaxed">
                Fair, transparent workshop pricing without retail gallery middleman markups.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-wood-dark text-wood-cream rounded-3xl p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-xl border border-wood-walnut/30">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">
            Visit Us in Person
          </h2>
          <p className="mt-3 text-wood-cream/80 text-sm sm:text-base">
            Feel the natural timber grains and inspect our joinery in our Addis Ababa showroom.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="bg-wood-warm hover:bg-amber-400 text-wood-dark font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full transition-all"
            >
              Get Workshop Directions
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
