"use client";

import { useTranslations, useLocale } from "next-intl";
import { MessageSquare, Send, Phone } from "lucide-react";
import { recordContactClick } from "@/lib/api";

interface StickyContactBarProps {
  productId?: number;
  productName?: string;
  whatsappNumber?: string;
  telegramUsername?: string;
  phoneNumber?: string;
}

export default function StickyContactBar({
  productId,
  productName,
  whatsappNumber = "+251911223344",
  telegramUsername = "woodcarvo",
  phoneNumber = "+251911223344",
}: StickyContactBarProps) {
  const t = useTranslations("common");
  const locale = useLocale();

  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");
  const cleanWa = whatsappNumber.replace(/[^0-9]/g, "");
  const cleanTg = telegramUsername.replace("@", "");

  const inquiryText = productName
    ? `Hello WOOD CARVO, I am interested in "${productName}". Is it currently available?`
    : "Hello WOOD CARVO, I would like to inquire about your furniture.";

  const whatsappUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(inquiryText)}`;
  const telegramUrl = `https://t.me/${cleanTg}`;
  const phoneUrl = `tel:${cleanPhone}`;

  const handleClick = (channel: "whatsapp" | "telegram" | "phone") => {
    recordContactClick({
      product_id: productId || null,
      channel,
      locale,
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    });
  };

  return (
    <aside
      aria-label="Quick contact"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-wood-dark/95 backdrop-blur-md border-t border-wood-walnut/30 px-3 py-2 shadow-2xl safe-area-bottom"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick("whatsapp")}
          className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 active:scale-95 transition-all min-h-[48px]"
          aria-label="WhatsApp Inquiry"
        >
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          <span className="text-[11px] font-semibold tracking-wide">WhatsApp</span>
        </a>

        {/* Telegram */}
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick("telegram")}
          className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 active:scale-95 transition-all min-h-[48px]"
          aria-label="Telegram Inquiry"
        >
          <Send className="w-5 h-5 text-sky-400" />
          <span className="text-[11px] font-semibold tracking-wide">Telegram</span>
        </a>

        {/* Call */}
        <a
          href={phoneUrl}
          onClick={() => handleClick("phone")}
          className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-wood-warm/20 hover:bg-wood-warm/30 text-wood-warm active:scale-95 transition-all min-h-[48px]"
          aria-label="Direct Phone Call"
        >
          <Phone className="w-5 h-5 text-wood-warm" />
          <span className="text-[11px] font-semibold tracking-wide">Call</span>
        </a>
      </div>
    </aside>
  );
}
