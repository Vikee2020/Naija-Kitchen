import React from 'react';
import { ShoppingBag, Navigation, Phone, UtensilsCrossed, ChefHat } from 'lucide-react';
import { CustomizedCartItem } from '../types';
import { formatNaira } from '../utils/formatters';

interface NavbarProps {
  cartItems: CustomizedCartItem[];
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onOpenKitchenHub: () => void;
  onOpenZones: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  onOpenCart,
  onOpenTracker,
  onOpenKitchenHub,
  onOpenZones,
}) => {
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Top operational announcement ticker */}
      <div className="bg-[#064E3B] text-emerald-100 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-white truncate">Kitchen is Open & Firing</span>
            <span className="hidden sm:inline text-emerald-200/80">· Average Lagos Delivery: 25–40 mins</span>
          </div>
          <div className="flex items-center gap-4 text-xs shrink-0">
            <a
              href="tel:+2348001234567"
              className="flex items-center gap-1.5 text-emerald-100 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">+234 800 123 4567</span>
              <span className="md:hidden">Call Order</span>
            </a>
            <span className="text-emerald-400/40">|</span>
            <button
              onClick={onOpenZones}
              className="hover:text-white text-emerald-200 transition-colors cursor-pointer"
            >
              Delivery Zones
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6 md:gap-8">
        {/* Zone 1: Brand title wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-slate-900 group whitespace-nowrap shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#064E3B] flex items-center justify-center text-amber-400 shadow-sm group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-[#064E3B]">
              Mummy&apos;s Kitchen
            </span>
            <span className="text-[11px] font-medium text-stone-500 tracking-wide uppercase">
              Homestyle Nigerian Cooking
            </span>
          </div>
        </a>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
          <a
            href="#menu-section"
            className="hover:text-[#064E3B] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#064E3B]"
          >
            Explore Menu
          </a>
          <a
            href="#specialties-section"
            className="hover:text-[#064E3B] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#064E3B]"
          >
            Signature Soups
          </a>
          <button
            onClick={onOpenZones}
            className="hover:text-[#064E3B] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#064E3B] cursor-pointer"
          >
            Neighborhood Rates
          </button>
          <button
            onClick={onOpenTracker}
            className="flex items-center gap-1.5 hover:text-[#064E3B] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#064E3B] cursor-pointer text-amber-800"
          >
            <Navigation className="w-4 h-4 text-amber-600" />
            Track Order
          </button>
        </nav>

        {/* Zone 3: Actions (Kitchen Ops Toggle + Cart CTA) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Kitchen Operator Hub Button */}
          <button
            onClick={onOpenKitchenHub}
            title="Kitchen & Dispatch Operator Mode"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ChefHat className="w-4 h-4 text-[#064E3B]" />
            <span>Kitchen & Dispatch Hub</span>
          </button>

          {/* Quick Track button for mobile */}
          <button
            onClick={onOpenTracker}
            className="lg:hidden p-2 text-stone-700 hover:text-[#064E3B] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Track Order"
          >
            <Navigation className="w-5 h-5 text-amber-600" />
          </button>

          {/* Primary Action: Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-[#064E3B] hover:bg-[#04382a] text-white rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
            aria-label="View shopping bag"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {totalItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col items-start text-left leading-tight">
              <span className="text-[11px] text-emerald-200 font-medium">Cart</span>
              <span className="text-xs font-bold font-mono tabular-nums text-white">
                {totalItemCount > 0 ? formatNaira(cartSubtotal) : '₦0'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
