import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "header" | "footer" | "hero" | "compact";
  showSlogan?: boolean;
}

export default function Logo({
  className = "",
  variant = "header",
  showSlogan = true,
}: LogoProps) {
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2.5 select-none ${className}`}>
        <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-wood-walnut/30 shadow-sm bg-wood-dark flex-shrink-0">
          <Image
            src="/images/logo.webp"
            alt="WOOD CARVO"
            fill
            sizes="36px"
            className="object-cover"
            priority
          />
        </div>
        <span className="font-serif font-bold tracking-wider text-wood-dark text-base">
          WOOD CARVO
        </span>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`flex flex-col items-start gap-3 select-none ${className}`}>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-wood-warm/40 shadow-md bg-wood-dark flex-shrink-0 ring-1 ring-wood-warm/20">
            <Image
              src="/images/logo.webp"
              alt="WOOD CARVO"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold tracking-widest text-wood-cream text-xl leading-tight">
              WOOD CARVO
            </span>
            <span className="text-[11px] tracking-wider text-wood-warm font-sans font-medium">
              Your Vision, Our Craft
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default Header variant
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D Carved Logo Emblem */}
      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border border-wood-walnut/30 shadow-md bg-wood-dark flex-shrink-0 group-hover:scale-105 transition-transform duration-300 ring-1 ring-wood-walnut/15">
        <Image
          src="/images/logo.webp"
          alt="WOOD CARVO Logo"
          fill
          sizes="44px"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col">
        <span className="font-serif font-bold tracking-widest text-wood-dark text-lg sm:text-xl leading-tight">
          WOOD CARVO
        </span>
        {showSlogan && (
          <span className="text-[10px] tracking-wider text-wood-walnut font-sans font-medium">
            Your Vision, Our Craft
          </span>
        )}
      </div>
    </div>
  );
}
