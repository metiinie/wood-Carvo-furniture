import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-serif select-none ${className}`}>
      <div className="w-9 h-9 rounded-lg bg-wood-dark border border-wood-warm/40 flex items-center justify-center text-wood-warm font-bold text-lg shadow-sm">
        WC
      </div>
      <div className="flex flex-col">
        <span className="font-bold tracking-widest text-wood-dark text-lg leading-tight">
          WOOD CARVO
        </span>
        <span className="text-[10px] tracking-wider uppercase text-wood-walnut font-sans font-medium">
          Addis Ababa • Workshop
        </span>
      </div>
    </div>
  );
}
