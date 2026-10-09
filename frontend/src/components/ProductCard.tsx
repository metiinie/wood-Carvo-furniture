import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("products");

  const primaryPhoto =
    product.primary_image?.image ||
    (product.images && product.images.length > 0 ? product.images[0].image : null);

  const availabilityBadge = () => {
    switch (product.availability) {
      case "READY":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            {t("availabilityReady")}
          </span>
        );
      case "MADE_TO_ORDER":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
            {t("availabilityMadeToOrder")}
          </span>
        );
      case "SOLD":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-200 text-stone-700 border border-stone-300">
            {t("availabilitySold")}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-wood-walnut/15 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] w-full bg-wood-surface overflow-hidden"
      >
        {primaryPhoto ? (
          <Image
            src={primaryPhoto}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-wood-walnut/10 text-wood-walnut/60">
            <span className="text-3xl mb-1">🪑</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Photo coming soon</span>
          </div>
        )}

        {/* Code Badge */}
        {product.code && (
          <span className="absolute top-3 left-3 bg-wood-dark/85 backdrop-blur-md text-wood-warm text-[11px] font-mono font-bold px-2.5 py-1 rounded-md shadow-sm">
            {product.code}
          </span>
        )}

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">{availabilityBadge()}</div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & customizable indicator */}
          <div className="flex items-center justify-between text-xs text-wood-walnut/80 mb-1.5 font-medium">
            <span>{product.category?.name || "Handcrafted"}</span>
            {product.is_customizable && (
              <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                Customizable
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-wood-dark text-lg sm:text-xl group-hover:text-wood-walnut transition-colors line-clamp-1">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Material & Specs */}
          {product.material && (
            <p className="text-xs text-wood-dark/65 mt-1 line-clamp-1">
              {product.material} {product.color ? `• ${product.color}` : ""}
            </p>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-3.5 border-t border-wood-walnut/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-wood-dark/60 block font-medium">
              {product.price_mode === "FROM" ? "Starting from" : "Workshop Price"}
            </span>
            <span className="font-bold text-wood-dark text-base sm:text-lg tracking-tight">
              {product.formatted_price}
            </span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-full bg-wood-dark hover:bg-wood-walnut text-wood-warm shadow-sm transition-all"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
