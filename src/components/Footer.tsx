import React from 'react';
import { UtensilsCrossed, Phone, Mail, MapPin, Clock, Navigation } from 'lucide-react';

interface FooterProps {
  onOpenTracker: () => void;
  onOpenKitchenHub: () => void;
  onOpenZones: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTracker,
  onOpenKitchenHub,
  onOpenZones,
}) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#064E3B] text-amber-400 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-xl text-white">
                Mummy&apos;s Kitchen
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Lagos&apos; favorite homestyle Nigerian kitchen. Authentic woodsmoke jollof, slow-simmered native soups, and sizzling grills delivered across Mainland &amp; Island hubs.
            </p>
          </div>

          {/* Hub Locations & Hours */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Kitchen Hubs &amp; Hours
            </h4>
            <div className="space-y-2 text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
                <span>Mainland: 14 Adeniran Ogunsanya St, Surulere, Lagos</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Island Hub: Plot 12A, Victoria Island Boulevard</span>
              </div>
              <div className="flex items-center gap-2 pt-1 text-stone-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Monday – Sunday: 10:00 AM – 10:30 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Quick Actions
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#menu-section" className="hover:text-amber-400 transition-colors">
                  Explore Full Menu
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-500" />
                  <span>Live Dispatch Tracker</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenZones}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Neighborhood Rates &amp; Hubs
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenKitchenHub}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-emerald-400"
                >
                  Kitchen Operator Console
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Instant Dispatch Line
            </h4>
            <div className="space-y-2 text-stone-400">
              <a
                href="tel:+2348001234567"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">+234 800 123 4567</span>
              </a>
              <a
                href="https://wa.me/2348001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors text-emerald-400"
              >
                <span>WhatsApp Instant Orders</span>
              </a>
              <div className="flex items-center gap-2 text-stone-400">
                <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                <span>orders@mummyskitchen.ng</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Mummy&apos;s Kitchen Nigeria. All rights reserved.</p>
          <p className="text-[11px] text-stone-600">
            Freshly prepared with love · Dispatched with speed across Lagos
          </p>
        </div>
      </div>
    </footer>
  );
};
