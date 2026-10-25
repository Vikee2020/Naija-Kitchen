import React, { useState } from 'react';
import { Plus, Search, Utensils, Flame, Sparkles } from 'lucide-react';
import { MenuCategory, MenuItem } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { formatNaira } from '../utils/formatters';

interface MenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
}

const CATEGORY_TABS: { id: MenuCategory; label: string; count: number }[] = [
  { id: 'all', label: 'All Dishes', count: MENU_ITEMS.length },
  { id: 'rice', label: 'Rice Specialties', count: MENU_ITEMS.filter((i) => i.category === 'rice').length },
  { id: 'soups', label: 'Soups & Swallows', count: MENU_ITEMS.filter((i) => i.category === 'soups').length },
  { id: 'suya', label: 'Suya & Grills', count: MENU_ITEMS.filter((i) => i.category === 'suya').length },
  { id: 'drinks_sides', label: 'Drinks & Sides', count: MENU_ITEMS.filter((i) => i.category === 'drinks_sides').length },
];

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectItem }) => {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Prepared Fresh Daily</span>
            <span className="text-stone-300">·</span>
            <span>Mummy’s Secret Recipes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
            Our Homestyle Menu
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-1.5 max-w-xl">
            Select an authentic meal to customize protein choices, pepper heat levels, and your favorite swallow.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Jollof, Egusi, Suya..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] outline-hidden placeholder:text-stone-400 shadow-2xs"
          />
        </div>
      </div>

      {/* Filter Tabs / Segmented Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-5 no-scrollbar border-b border-stone-100">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] font-mono rounded-md px-1.5 py-0.2 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dishes Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center">
          <Utensils className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-700">No dishes found matching your search</h3>
          <p className="text-xs text-stone-500 mt-1">Try another keyword or change your category filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-[#064E3B] bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 pt-8">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Product Photo with Fallback & Badges */}
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {item.badge && (
                  <span className="absolute top-3 left-3 bg-[#064E3B] text-white text-[11px] font-bold px-2.5 py-0.5 rounded shadow-xs">
                    {item.badge}
                  </span>
                )}

                <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-xs font-mono font-bold px-2 py-0.5 rounded">
                  {formatNaira(item.price)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Clean unboxed metadata with separators (Anti-Slop Zero-Pill) */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                    <span className="capitalize font-medium text-amber-800">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Prep: {item.prepTime}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-0.5 text-stone-600">
                      <Flame className="w-3 h-3 text-red-500 fill-red-400" />
                      {item.defaultSpice}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-base text-stone-900 group-hover:text-[#064E3B] transition-colors leading-snug">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Card Action Row */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-stone-400 block">Starting at</span>
                    <span className="font-mono font-bold text-base text-stone-900 tabular-nums">
                      {formatNaira(item.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectItem(item)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                    aria-label={`Customize ${item.name}`}
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Customize &amp; Add</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
