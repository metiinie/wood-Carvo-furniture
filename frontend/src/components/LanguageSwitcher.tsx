"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { Globe, ChevronDown, Check } from "lucide-react";
import { locales, Locale } from "@/i18n";

interface LanguageOption {
  code: Locale;
  nativeLabel: string;
  englishLabel: string;
  flag: string;
}

const languages: LanguageOption[] = [
  {
    code: "en",
    nativeLabel: "English",
    englishLabel: "English",
    flag: "🇬🇧",
  },
  {
    code: "am",
    nativeLabel: "አማርኛ",
    englishLabel: "Amharic",
    flag: "🇪🇹",
  },
  {
    code: "om",
    nativeLabel: "Afaan Oromoo",
    englishLabel: "Oromo",
    flag: "🌳",
  },
];

export default function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    // Persist language in cookie with 1-year expiration
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    try {
      localStorage.setItem("NEXT_LOCALE", newLocale);
    } catch {
      // Ignore if localStorage unavailable
    }

    setIsOpen(false);

    // Refresh the page in-place: Keep the exact same clean URL (NO /en, /am, /om prefix)
    window.location.reload();
  };

  const activeLang = languages.find((l) => l.code === currentLocale) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
        className="inline-flex items-center gap-2 bg-wood-walnut/10 hover:bg-wood-walnut/20 text-wood-dark border border-wood-walnut/20 px-3 py-2 rounded-full text-xs font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-wood-walnut/30 min-h-[38px]"
      >
        <Globe className="w-3.5 h-3.5 text-wood-walnut" />
        <span className="font-semibold">{activeLang.flag} {activeLang.nativeLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-wood-walnut/70 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className="absolute right-0 mt-2 w-48 bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-wood-walnut/20 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-wood-walnut/60 border-b border-wood-walnut/10">
            Select Language
          </div>
          {languages.map((lang) => {
            const isSelected = lang.code === currentLocale;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-wood-walnut/15 text-wood-dark font-semibold"
                    : "text-wood-dark/80 hover:bg-wood-walnut/10 hover:text-wood-dark"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs leading-snug">{lang.nativeLabel}</span>
                    <span className="text-[10px] text-wood-walnut/70 leading-none">{lang.englishLabel}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-wood-walnut ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
