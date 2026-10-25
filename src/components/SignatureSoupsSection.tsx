import React from 'react';
import { Utensils, Flame, Sparkles } from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { formatNaira } from '../utils/formatters';

interface SignatureSoupsSectionProps {
  onSelectItem: (item: MenuItem) => void;
}

export const SignatureSoupsSection: React.FC<SignatureSoupsSectionProps> = ({ onSelectItem }) => {
  const soupItems = MENU_ITEMS.filter((i) => i.category === 'soups');

  return (
    <section id="specialties-section" className="py-14 sm:py-20 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Traditional Heritage Soups</span>
            <span className="text-stone-600">·</span>
            <span>Always Served with Hot Swallow</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            The Soul of Nigerian Homestyle Cooking
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mt-2 leading-relaxed">
            Every pot is simmered with authentic crayfish, smoked stockfish heads, and cold-pressed Nigerian palm oil. Paired with freshly wrapped Pounded Yam, smooth Amala Dudu, or tangy Yellow Eba.
          </p>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {soupItems.map((item) => (
            <div
              key={item.id}
              className="bg-stone-800/80 rounded-2xl border border-stone-700/80 overflow-hidden flex flex-col sm:flex-row group hover:border-amber-500/50 transition-all duration-300"
            >
              <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto relative overflow-hidden bg-stone-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 bg-[#064E3B] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                  Includes Swallow
                </div>
              </div>

              <div className="sm:w-3/5 p-5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400/90 mb-1">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                      {item.defaultSpice} Heat
                    </span>
                    <span className="text-stone-600">·</span>
                    <span className="text-stone-400">Prep: {item.prepTime}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs text-stone-300 mt-1.5 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Base Portion</span>
                    <span className="font-mono font-bold text-base text-amber-400">
                      {formatNaira(item.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectItem(item)}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Choose Swallow &amp; Meat</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
