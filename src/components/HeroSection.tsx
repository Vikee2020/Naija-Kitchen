import React from 'react';
import { ArrowDown, Flame, Navigation, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { DELIVERY_ZONES } from '../data/menuData';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onOpenTracker: () => void;
  onSelectZone: (zoneId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMenu,
  onOpenTracker,
  onSelectZone,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-emerald-50/20 to-white pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-stone-200">
      {/* Background subtle authentic texture */}
      <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#064E3B_0.75px,transparent_0.75px)] [background-size:16px_16px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <span className="flex items-center gap-1.5 text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-md">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                Lagos Fresh Woodsmoke Cooking
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-600">Dispatched in Insulated Boxes</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-stone-900 leading-[1.12] tracking-tight text-balance">
              Authentic Nigerian Meals Delivered{' '}
              <span className="text-[#064E3B] underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-6">
                Hot &amp; Fresh
              </span>{' '}
              to Your Doorstep.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
              From rich firewood-infused Party Jollof and velvety Egusi with pounded yam to sizzling Kano suya. Custom-tailored proteins, spice levels, and neighborhood-speed dispatch across Lagos.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onExploreMenu}
                className="px-6 py-3.5 bg-[#064E3B] hover:bg-[#053d2e] text-white font-semibold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 cursor-pointer active:scale-95"
              >
                <span>Explore Menu &amp; Order</span>
                <ArrowDown className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={onOpenTracker}
                className="px-5 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm sm:text-base rounded-xl border border-stone-300 shadow-xs hover:border-stone-400 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Navigation className="w-4 h-4 text-amber-600" />
                <span>Track Existing Order</span>
              </button>
            </div>

            {/* Quick Delivery Neighborhood Selector Strip */}
            <div className="pt-4 border-t border-stone-200/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 mb-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#064E3B]" />
                <span>Popular Delivery Hubs in Lagos:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DELIVERY_ZONES.slice(0, 5).map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => onSelectZone(zone.id)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100/90 hover:bg-emerald-50 hover:text-[#064E3B] hover:border-emerald-200 border border-stone-200 text-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{zone.name}</span>
                    <span className="font-mono text-[11px] text-stone-500">₦{zone.fee.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2.5 text-stone-700">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-medium">25–40 min Avg. ETA</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-700">
                <ShieldCheck className="w-4 h-4 text-[#064E3B] shrink-0" />
                <span className="text-xs font-medium">100% Sealed Thermal Bags</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-700">
                <Navigation className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-medium">Direct Rider WhatsApp</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden bg-white border border-stone-200/90 shadow-xl transition-transform hover:-translate-y-1 duration-300">
              {/* Image banner */}
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <img
                  src="/src/assets/images/jollof_rice_platter_1792872076207.jpg"
                  alt="Mummy's Signature Party Jollof Rice Platter"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                  ★ Mummy’s No. 1 Best Seller
                </div>
                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                  From ₦4,500
                </div>
              </div>

              {/* Showcase Card Details */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-display font-bold text-lg text-stone-900">
                      Smoky Party Jollof &amp; Fried Dodo
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Parboiled long-grain · Scotch bonnet reduction · Firewood aroma
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    Medium 🌶️
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <div className="text-xs text-stone-600">
                    <span className="font-semibold text-stone-800">Proteins:</span> Beef, Goat (+₦1.4k), Croaker Fish
                  </div>
                  <button
                    onClick={onExploreMenu}
                    className="text-xs font-bold text-[#064E3B] hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Order This</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
