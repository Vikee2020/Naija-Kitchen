import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Flame, MessageSquare, Utensils } from 'lucide-react';
import { MenuItem, ProteinOption, SpiceLevel, CustomizedCartItem } from '../types';
import { PROTEIN_OPTIONS, SWALLOW_OPTIONS } from '../data/menuData';
import { formatNaira } from '../utils/formatters';

interface MealCustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (customizedItem: CustomizedCartItem) => void;
}

const SPICE_OPTIONS: { level: SpiceLevel; label: string; icon: string; desc: string }[] = [
  { level: 'Mild', label: 'Mild', icon: '🟢', desc: 'Gentle heat, family friendly' },
  { level: 'Medium', label: 'Medium', icon: '🌶️', desc: 'Authentic Lagos homestyle pepper' },
  { level: 'Hot', label: 'Hot', icon: '🌶️🌶️', desc: 'Fiery scotch bonnet kick' },
  { level: 'Extra Hot', label: 'Extra Hot', icon: '🌶️🌶️🌶️', desc: 'Naija native heat level' },
];

export const MealCustomizerModal: React.FC<MealCustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedProtein, setSelectedProtein] = useState<ProteinOption>(PROTEIN_OPTIONS[0]);
  const [selectedSwallow, setSelectedSwallow] = useState<string>(SWALLOW_OPTIONS[0].name);
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel>('Medium');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Sync defaults when item opens
  useEffect(() => {
    if (item) {
      setSelectedProtein(PROTEIN_OPTIONS[0]);
      setSelectedSwallow(SWALLOW_OPTIONS[0].name);
      setSelectedSpice(item.defaultSpice || 'Medium');
      setSpecialNotes('');
      setQuantity(1);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  // Calculate pricing
  const proteinExtra = item.allowsProteinSelection ? selectedProtein.extraPrice : 0;
  const unitPrice = item.price + proteinExtra;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const customized: CustomizedCartItem = {
      cartItemId: `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItem: item,
      selectedProtein: item.allowsProteinSelection ? selectedProtein : undefined,
      selectedSwallow: item.requiresSwallow ? selectedSwallow : undefined,
      spiceLevel: selectedSpice,
      specialNotes: specialNotes.trim(),
      quantity,
      unitPrice,
      totalPrice,
    };
    onAddToCart(customized);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="meal-customizer-title"
      >
        {/* Header with image */}
        <div className="relative h-44 sm:h-48 bg-stone-100 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <button
            onClick={onClose}
            aria-label="Close customizer"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              {item.category === 'rice' && 'Rice Special'}
              {item.category === 'soups' && 'Authentic Soup & Swallow'}
              {item.category === 'suya' && 'Suya & Grills'}
              {item.category === 'drinks_sides' && 'Drink & Refreshment'}
            </span>
            <h2 id="meal-customizer-title" className="text-lg sm:text-xl font-display font-bold leading-tight">
              {item.name}
            </h2>
            <p className="text-xs text-stone-200 mt-1 line-clamp-1">{item.description}</p>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 divide-y divide-stone-100">
          
          {/* Section 1: Protein Selection (if applicable) */}
          {item.allowsProteinSelection && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <span>1. Choice of Protein</span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      Required
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500">Pick your favorite Nigerian meat or fish cut</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {PROTEIN_OPTIONS.map((protein) => {
                  const isSelected = selectedProtein.id === protein.id;
                  return (
                    <button
                      key={protein.id}
                      type="button"
                      onClick={() => setSelectedProtein(protein)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#064E3B] bg-emerald-50/60 ring-1 ring-[#064E3B]'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#064E3B] bg-[#064E3B]' : 'border-stone-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${isSelected ? 'font-bold text-stone-900' : 'text-stone-700'}`}>
                          {protein.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-stone-600">
                        {protein.extraPrice === 0 ? 'Included' : `+${formatNaira(protein.extraPrice)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Swallow Selection (Required for soups) */}
          {item.requiresSwallow && (
            <div className="pt-5 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-[#064E3B]" />
                  <span>Choice of Fresh Swallow</span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Included with Soup
                  </span>
                </h3>
                <p className="text-xs text-stone-500">Served piping hot in traditional food wrap</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SWALLOW_OPTIONS.map((swallow) => {
                  const isSelected = selectedSwallow === swallow.name;
                  return (
                    <button
                      key={swallow.id}
                      type="button"
                      onClick={() => setSelectedSwallow(swallow.name)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#064E3B] bg-emerald-50/60 ring-1 ring-[#064E3B]'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#064E3B] bg-[#064E3B]' : 'border-stone-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-xs ${isSelected ? 'font-bold text-stone-900' : 'text-stone-700'}`}>
                        {swallow.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Spice Level */}
          <div className="pt-5 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Spice &amp; Pepper Level</span>
              </h3>
              <p className="text-xs text-stone-500">Instructs the chef on habanero pepper intensity</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SPICE_OPTIONS.map((opt) => {
                const isSelected = selectedSpice === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setSelectedSpice(opt.level)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-stone-900">
                        {opt.label}
                      </span>
                      <span className="text-sm">{opt.icon}</span>
                    </div>
                    <span className="text-[11px] text-stone-500 block leading-tight">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Special Notes */}
          <div className="pt-5 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="special-notes-input" className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                <span>Special Kitchen Instructions (Optional)</span>
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                {specialNotes.length}/120
              </span>
            </div>
            <textarea
              id="special-notes-input"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value.slice(0, 120))}
              placeholder="e.g., No onions, extra pepper sauce on side, separate soup bowl..."
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] outline-hidden placeholder:text-stone-400"
            />
          </div>

        </div>

        {/* Sticky Footer: Quantity and Add CTA */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-xl p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center font-mono font-bold text-sm text-stone-900 tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 px-4 bg-[#064E3B] hover:bg-[#053d2e] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-between cursor-pointer active:scale-98"
          >
            <span>Add to Order</span>
            <span className="font-mono tabular-nums bg-white/20 px-2 py-0.5 rounded text-xs">
              {formatNaira(totalPrice)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
