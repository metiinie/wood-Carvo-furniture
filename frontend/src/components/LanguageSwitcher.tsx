"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { locales, Locale } from "@/i18n";

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    // Replace the locale prefix in current pathname
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    // Store in cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(newPath);
  };

  const labels: Record<Locale, string> = {
    en: "EN",
    am: "አማ",
    om: "OM",
  };

  return (
    <div className="flex items-center gap-1 bg-wood-walnut/10 p-1 rounded-full border border-wood-walnut/20">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-all min-h-[32px] min-w-[36px] ${
            currentLocale === loc
              ? "bg-wood-dark text-wood-warm shadow-sm"
              : "text-wood-dark/70 hover:text-wood-dark"
          }`}
          aria-label={`Switch language to ${loc}`}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
