"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { MessageSquare, Send, Phone, Share2, Check } from "lucide-react";
import { recordContactClick } from "@/lib/api";

interface InquiryButtonsProps {
  productId?: number;
  productName: string;
  productCode?: string;
  whatsappNumber?: string;
  telegramUsername?: string;
  phoneNumber?: string;
}

export default function InquiryButtons({
  productId,
  productName,
  productCode,
  whatsappNumber = "+251910842430",
  telegramUsername = "woodcarvo",
  phoneNumber = "+251910842430",
}: InquiryButtonsProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const t = useTranslations("inquiry");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");
  const cleanWa = whatsappNumber.replace(/[^0-9]/g, "");
  const cleanTg = telegramUsername.replace("@", "");

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const codeSuffix = productCode ? ` (${productCode})` : "";
  const inquiryText = `Hello WOOD CARVO, I am interested in "${productName}"${codeSuffix}. Is it available? ${currentUrl}`;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleWhatsApp = () => {
    recordContactClick({
      product_id: productId || null,
      channel: "whatsapp",
      locale,
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    });
    const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(inquiryText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleTelegram = async () => {
    recordContactClick({
      product_id: productId || null,
      channel: "telegram",
      locale,
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    });

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(inquiryText);
      }
    } catch (e) {
      console.warn("Clipboard access denied", e);
    }

    triggerToast(tCommon("telegramCopied"));
    setTimeout(() => {
      window.open(`https://t.me/${cleanTg}`, "_blank", "noopener,noreferrer");
    }, 600);
  };

  const handlePhone = () => {
    recordContactClick({
      product_id: productId || null,
      channel: "phone",
      locale,
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    });
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `WOOD CARVO — ${productName}`,
          text: `Check out ${productName} by WOOD CARVO furniture workshop in Addis Ababa.`,
          url: currentUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
      }
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
        triggerToast(tCommon("copied"));
      }
    } catch {
      triggerToast("URL copied to clipboard");
    }
  };

  return (
    <div className="space-y-3 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-wood-dark text-wood-warm px-5 py-3 rounded-xl shadow-2xl border border-wood-warm/30 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary: WhatsApp */}
      <button
        type="button"
        onClick={handleWhatsApp}
        className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 touch-target"
        id="btn-inquire-whatsapp"
      >
        <MessageSquare className="w-5 h-5 text-emerald-100" />
        <span>{t("whatsappCta")}</span>
      </button>

      {/* Secondary Row: Telegram & Call */}
      <div className="grid grid-cols-2 gap-3">
        {/* Telegram with copy-and-toast */}
        <button
          type="button"
          onClick={handleTelegram}
          className="py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 touch-target"
          id="btn-inquire-telegram"
        >
          <Send className="w-4 h-4 text-sky-100" />
          <span>{t("telegramCta")}</span>
        </button>

        {/* Direct Call */}
        <button
          type="button"
          onClick={handlePhone}
          className="py-3 px-4 rounded-xl bg-wood-dark hover:bg-wood-walnut active:scale-[0.99] text-wood-warm font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 touch-target"
          id="btn-inquire-call"
        >
          <Phone className="w-4 h-4 text-wood-warm" />
          <span>{t("callCta")}</span>
        </button>
      </div>

      {/* Share action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleShare}
          className="w-full py-2.5 px-4 rounded-xl bg-white/70 hover:bg-white text-wood-dark/80 hover:text-wood-dark border border-wood-walnut/20 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          id="btn-share-product"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{tCommon("share")}</span>
        </button>
      </div>
    </div>
  );
}
