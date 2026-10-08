"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { GalleryItem, Category } from "@/lib/api";

interface GalleryGridProps {
  items: GalleryItem[];
  categories: Category[];
}

export default function GalleryGrid({ items, categories }: GalleryGridProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategoryId
    ? items.filter((item) => item.category === activeCategoryId)
    : items;

  return (
    <div>
      {/* Category Filter Chips */}
      {categories.length > 0 && (
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          <button
            type="button"
            onClick={() => setActiveCategoryId(null)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeCategoryId === null
                ? "bg-wood-dark text-wood-warm shadow-sm"
                : "bg-white text-wood-dark/70 hover:bg-white/90 border border-wood-walnut/15"
            }`}
          >
            All Work
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategoryId === cat.id
                  ? "bg-wood-dark text-wood-warm shadow-sm"
                  : "bg-white text-wood-dark/70 hover:bg-white/90 border border-wood-walnut/15"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative aspect-square rounded-3xl overflow-hidden bg-wood-surface border border-wood-walnut/20 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300"
            >
              <Image
                src={item.image}
                alt={item.title || "WOOD CARVO Handcrafted Furniture"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Dark Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-wood-dark via-wood-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="flex items-center justify-between text-wood-cream">
                  <span className="font-serif font-bold text-lg">{item.title}</span>
                  <span className="p-2 rounded-full bg-white/20 text-white">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-wood-walnut/15">
          <span className="text-4xl block mb-2">📸</span>
          <p className="text-wood-dark/70 text-sm">No portfolio items found in this section.</p>
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveItem(null)}
        >
          <button
            type="button"
            onClick={() => setActiveItem(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close photo preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-[80vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                className="object-contain"
              />
            </div>
            {activeItem.title && (
              <p className="text-wood-cream font-serif text-lg mt-4 text-center">
                {activeItem.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
