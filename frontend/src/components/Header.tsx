"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Menu,
  X,
  Phone,
  MessageSquare,
  ChevronDown,
  LayoutGrid,
  Compass,
} from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showroomDropdownOpen, setShowroomDropdownOpen] = useState(false);
  const [mobileShowroomOpen, setMobileShowroomOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || "";
  const t = useTranslations("nav");

  // Close desktop dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowroomDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isShowroomActive =
    pathname === "/products" ||
    pathname.startsWith("/products/") ||
    pathname === "/categories" ||
    pathname.startsWith("/categories/");

  const isCustomActive =
    pathname === "/custom-furniture" || pathname.startsWith("/custom-furniture/");
  const isGalleryActive =
    pathname === "/gallery" || pathname.startsWith("/gallery/");
  const isAboutActive =
    pathname === "/about" || pathname.startsWith("/about/");
  const isContactActive =
    pathname === "/contact" || pathname.startsWith("/contact/");

  return (
    <header className="sticky top-0 z-50 bg-wood-cream/95 backdrop-blur-md border-b border-wood-walnut/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="WOOD CARVO Home"
          onClick={() => {
            setMobileMenuOpen(false);
            setShowroomDropdownOpen(false);
          }}
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-wood-dark/85">
          {/* Showroom Dropdown (Option A: Consolidating Products & Categories) */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setShowroomDropdownOpen(true)}
            onMouseLeave={() => setShowroomDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setShowroomDropdownOpen(!showroomDropdownOpen)}
              className={`flex items-center gap-1.5 py-2 px-1 transition-colors rounded-lg group ${
                isShowroomActive
                  ? "text-wood-walnut font-semibold"
                  : "text-wood-dark/85 hover:text-wood-walnut"
              }`}
              aria-expanded={showroomDropdownOpen}
              aria-haspopup="true"
            >
              <span>{t("showroom")}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 text-wood-walnut/70 group-hover:text-wood-walnut ${
                  showroomDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showroomDropdownOpen && (
              <div className="absolute top-full left-0 pt-2 w-72 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                <div className="bg-wood-cream/98 backdrop-blur-xl border border-wood-walnut/20 rounded-2xl shadow-xl p-2 flex flex-col gap-1">
                  <Link
                    href="/products"
                    onClick={() => setShowroomDropdownOpen(false)}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                      pathname === "/products" || pathname.startsWith("/products/")
                        ? "bg-wood-walnut/15 text-wood-dark"
                        : "hover:bg-wood-walnut/10 text-wood-dark"
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-wood-dark text-wood-warm mt-0.5 shrink-0">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-wood-dark flex items-center justify-between">
                        <span>{t("allProducts")}</span>
                      </div>
                      <p className="text-xs text-wood-dark/65 mt-0.5 leading-snug">
                        {t("allProductsDesc")}
                      </p>
                    </div>
                  </Link>

                  <div className="h-px bg-wood-walnut/10 my-0.5" />

                  <Link
                    href="/categories"
                    onClick={() => setShowroomDropdownOpen(false)}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                      pathname === "/categories" || pathname.startsWith("/categories/")
                        ? "bg-wood-walnut/15 text-wood-dark"
                        : "hover:bg-wood-walnut/10 text-wood-dark"
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-wood-walnut text-wood-cream mt-0.5 shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-wood-dark">
                        {t("livingSpaces")}
                      </div>
                      <p className="text-xs text-wood-dark/65 mt-0.5 leading-snug">
                        {t("livingSpacesDesc")}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/custom-furniture"
            className={`py-2 px-1 transition-colors ${
              isCustomActive
                ? "text-wood-walnut font-semibold"
                : "text-wood-dark/85 hover:text-wood-walnut"
            }`}
          >
            {t("custom")}
          </Link>

          <Link
            href="/gallery"
            className={`py-2 px-1 transition-colors ${
              isGalleryActive
                ? "text-wood-walnut font-semibold"
                : "text-wood-dark/85 hover:text-wood-walnut"
            }`}
          >
            {t("gallery")}
          </Link>

          <Link
            href="/about"
            className={`py-2 px-1 transition-colors ${
              isAboutActive
                ? "text-wood-walnut font-semibold"
                : "text-wood-dark/85 hover:text-wood-walnut"
            }`}
          >
            {t("about")}
          </Link>

          <Link
            href="/contact"
            className={`py-2 px-1 transition-colors ${
              isContactActive
                ? "text-wood-walnut font-semibold"
                : "text-wood-dark/85 hover:text-wood-walnut"
            }`}
          >
            {t("contact")}
          </Link>
        </nav>

        {/* Controls: Language + Contact */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="https://wa.me/251910842430"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all min-h-[40px]"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile menu button & Language for small screens */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="sm:hidden">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-wood-dark hover:bg-wood-walnut/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-wood-walnut/15 bg-wood-cream/98 backdrop-blur-lg px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {/* Showroom Accordion in Mobile */}
            <div className="rounded-xl overflow-hidden bg-wood-walnut/5 border border-wood-walnut/10 p-1">
              <button
                type="button"
                onClick={() => setMobileShowroomOpen(!mobileShowroomOpen)}
                className="w-full flex items-center justify-between py-2 px-3 text-base font-semibold text-wood-dark min-h-[44px]"
              >
                <span>{t("showroom")}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileShowroomOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileShowroomOpen && (
                <div className="pb-1 pl-2 pr-1 space-y-1">
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm transition-colors ${
                      pathname === "/products"
                        ? "bg-wood-walnut/15 font-semibold text-wood-dark"
                        : "text-wood-dark/80 hover:bg-wood-walnut/10"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4 text-wood-walnut" />
                    <span>{t("allProducts")}</span>
                  </Link>
                  <Link
                    href="/categories"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm transition-colors ${
                      pathname === "/categories"
                        ? "bg-wood-walnut/15 font-semibold text-wood-dark"
                        : "text-wood-dark/80 hover:bg-wood-walnut/10"
                    }`}
                  >
                    <Compass className="w-4 h-4 text-wood-walnut" />
                    <span>{t("livingSpaces")}</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/custom-furniture"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 px-3 rounded-xl text-base font-medium transition-colors flex items-center min-h-[44px] ${
                isCustomActive
                  ? "bg-wood-walnut/15 font-semibold text-wood-dark"
                  : "text-wood-dark hover:bg-wood-walnut/10"
              }`}
            >
              {t("custom")}
            </Link>

            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 px-3 rounded-xl text-base font-medium transition-colors flex items-center min-h-[44px] ${
                isGalleryActive
                  ? "bg-wood-walnut/15 font-semibold text-wood-dark"
                  : "text-wood-dark hover:bg-wood-walnut/10"
              }`}
            >
              {t("gallery")}
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 px-3 rounded-xl text-base font-medium transition-colors flex items-center min-h-[44px] ${
                isAboutActive
                  ? "bg-wood-walnut/15 font-semibold text-wood-dark"
                  : "text-wood-dark hover:bg-wood-walnut/10"
              }`}
            >
              {t("about")}
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 px-3 rounded-xl text-base font-medium transition-colors flex items-center min-h-[44px] ${
                isContactActive
                  ? "bg-wood-walnut/15 font-semibold text-wood-dark"
                  : "text-wood-dark hover:bg-wood-walnut/10"
              }`}
            >
              {t("contact")}
            </Link>
          </nav>

          <div className="mt-5 pt-4 border-t border-wood-walnut/15 flex flex-col gap-3">
            <a
              href="tel:+251910842430"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-wood-dark text-wood-warm font-semibold text-sm min-h-[44px]"
            >
              <Phone className="w-4 h-4" />
              <span>+251 910 84 24 30</span>
            </a>
            <a
              href="https://wa.me/251910842430"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 text-white font-semibold text-sm min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
