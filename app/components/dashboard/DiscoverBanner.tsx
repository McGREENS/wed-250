import Link from "next/link";
import { MapPin, Star } from "lucide-react";

export default function DiscoverBanner() {
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
      <Link href="/venues">
        <div className="group relative overflow-hidden rounded-xl border border-burgundy/20 bg-gradient-to-br from-burgundy/5 to-burgundy/10 hover:from-burgundy/10 hover:to-burgundy/20 transition-all duration-200 p-5 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-burgundy rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-burgundy uppercase tracking-wide">Venues</span>
              </div>
              <p className="text-base font-bold text-charcoal mt-2">Browse Venues</p>
              <p className="text-xs text-charcoal/60 mt-0.5">Find the perfect venue for your big day</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-burgundy/10 group-hover:bg-burgundy/20 flex items-center justify-center transition-colors flex-shrink-0">
              <span className="text-burgundy text-lg font-bold leading-none">→</span>
            </div>
          </div>
        </div>
      </Link>

      <Link href="/vendors">
        <div className="group relative overflow-hidden rounded-xl border border-gold/30 bg-gradient-to-br from-gold/5 to-gold/10 hover:from-gold/10 hover:to-gold/20 transition-all duration-200 p-5 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-gold uppercase tracking-wide">Vendors</span>
              </div>
              <p className="text-base font-bold text-charcoal mt-2">Find Vendors</p>
              <p className="text-xs text-charcoal/60 mt-0.5">Photographers, caterers, decorators & more</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center transition-colors flex-shrink-0">
              <span className="text-gold text-lg font-bold leading-none">→</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
