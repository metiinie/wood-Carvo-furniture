"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, Phone, MessageSquare } from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/products", label: t("products") },
    { href: "/categories", label: t("categories") },
    { href: "/custom-furniture", label: t("custom") },
    { href: "/gallery", label: t("gallery") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-wood-cream/95 backdrop-blur-md border-b border-wood-walnut/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="WOOD CARVO Home"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-wood-dark/85">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-wood-walnut transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controls: Language + Contact */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="https://wa.me/251911223344"
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
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl text-base font-medium text-wood-dark hover:bg-wood-walnut/10 transition-colors flex items-center min-h-[44px]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 pt-4 border-t border-wood-walnut/15 flex flex-col gap-3">
            <a
              href="tel:+251911223344"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-wood-dark text-wood-warm font-semibold text-sm min-h-[44px]"
            >
              <Phone className="w-4 h-4" />
              <span>+251 911 22 33 44</span>
            </a>
            <a
              href="https://wa.me/251911223344"
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
