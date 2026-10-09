import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import Logo from "./Logo";

export default function Footer() {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-wood-dark text-wood-cream border-t border-wood-walnut/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-2">
            <Logo className="text-wood-cream [&_span]:text-wood-cream [&_.text-wood-walnut]:text-wood-warm" />
            <p className="text-sm text-wood-cream/70 max-w-md leading-relaxed">
              Bespoke furniture workshop in Addis Ababa, Ethiopia. Specializing in handcrafted
              solid hardwood dining tables, platform beds, living sets, and commercial fit-outs.
            </p>
            <p className="text-xs text-wood-warm font-semibold">
              Bole Sub-city, Addis Ababa, Ethiopia • +251 911 22 33 44
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-wood-warm mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-wood-cream/80">
              <li>
                <Link href="/products" className="hover:text-wood-warm transition-colors">
                  {tNav("products")}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-wood-warm transition-colors">
                  {tNav("categories")}
                </Link>
              </li>
              <li>
                <Link href="/custom-furniture" className="hover:text-wood-warm transition-colors">
                  {tNav("custom")}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-wood-warm transition-colors">
                  {tNav("gallery")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-wood-warm mb-4">
              Connect & Visit
            </h4>
            <ul className="space-y-2 text-sm text-wood-cream/80">
              <li>
                <a
                  href="https://wa.me/251911223344"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp Inquiry
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/woodcarvo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-colors"
                >
                  Telegram Channel
                </a>
              </li>
              <li>
                <a href="tel:+251911223344" className="hover:text-wood-warm transition-colors">
                  Direct Phone Call
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-wood-warm transition-colors">
                  Workshop Map & Hours
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-wood-walnut/40 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-wood-cream/60 gap-4">
          <p>{t("copyright", { year: currentYear })}</p>
          <p className="tracking-wide">Your Vision, Our Craft</p>
        </div>
      </div>
    </footer>
  );
}
