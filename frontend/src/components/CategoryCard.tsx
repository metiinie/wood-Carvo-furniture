import Image from "next/image";
import Link from "next/link";
import { Category } from "@/lib/api";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative flex flex-col justify-end p-6 rounded-3xl overflow-hidden aspect-[4/3] bg-wood-surface border border-wood-walnut/20 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Background Image */}
      {category.image ? (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-wood-dark to-wood-walnut" />
      )}

      {/* Gradient Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-wood-dark via-wood-dark/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-wood-cream group-hover:text-wood-warm transition-colors">
            {category.name}
          </h3>
          <span className="p-2 rounded-full bg-white/10 group-hover:bg-wood-warm group-hover:text-wood-dark transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
        {category.description && (
          <p className="text-xs sm:text-sm text-wood-cream/80 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
