"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { ProductImage } from "@/lib/api";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] rounded-3xl bg-wood-walnut/10 border border-wood-walnut/15 flex flex-col items-center justify-center text-wood-walnut/60">
        <span className="text-5xl mb-2">🪑</span>
        <span className="text-sm font-semibold uppercase tracking-wider">Photo coming soon</span>
      </div>
    );
  }

  const currentImage = images[selectedIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image Frame */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="group relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-wood-surface border border-wood-walnut/15 cursor-zoom-in shadow-sm hover:shadow-md transition-shadow"
      >
        <Image
          src={currentImage.image}
          alt={currentImage.alt_text || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center group-hover:scale-102 transition-transform duration-300"
        />

        {/* Zoom Overlay Icon */}
        <div className="absolute top-4 right-4 bg-wood-dark/70 backdrop-blur-md p-2 rounded-full text-wood-warm opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4" />
        </div>

        {/* Navigation Arrows for multi-photo */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-wood-dark/70 text-wood-warm hover:bg-wood-dark transition-all touch-target"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-wood-dark/70 text-wood-warm hover:bg-wood-dark transition-all touch-target"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Photo Counter */}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-wood-dark/80 text-wood-warm text-xs px-2.5 py-1 rounded-md font-mono font-medium">
            {selectedIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? "border-wood-warm scale-102 shadow-md ring-2 ring-wood-warm/30"
                  : "border-wood-walnut/20 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.image}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close fullscreen view"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.image}
              alt={productName}
              fill
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
