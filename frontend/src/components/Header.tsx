import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 bg-wood-cream/90 backdrop-blur-md border-b border-wood-walnut/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2" aria-label="WOOD CARVO Home">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-wood-dark/85">
          <Link href={`/${locale}/products`} className="hover:text-wood-walnut transition-colors">
            {t("products")}
          </Link>
          <Link href={`/${locale}/categories`} className="hover:text-wood-walnut transition-colors">
            {t("categories")}
          </Link>
          <Link href={`/${locale}/custom-furniture`} className="hover:text-wood-walnut transition-colors">
            {t("custom")}
          </Link>
          <Link href={`/${locale}/gallery`} className="hover:text-wood-walnut transition-colors">
            {t("gallery")}
          </Link>
          <Link href={`/${locale}/about`} className="hover:text-wood-walnut transition-colors">
            {t("about")}
          </Link>
          <Link href={`/${locale}/contact`} className="hover:text-wood-walnut transition-colors">
            {t("contact")}
          </Link>
        </nav>

        {/* Controls: Language + WhatsApp */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="https://wa.me/251911223344"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm transition-all"
          >
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}
