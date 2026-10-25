import React from 'react';
import { X, Trash2, Plus, Minus, MapPin, ShoppingBag, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { CustomizedCartItem, DeliveryZone } from '../types';
import { DELIVERY_ZONES } from '../data/menuData';
import { formatNaira } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CustomizedCartItem[];
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  includeCutlery: boolean;
  onToggleCutlery: (val: boolean) => void;
  specialDeliveryNote: string;
  onUpdateDeliveryNote: (note: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  selectedZone,
  onSelectZone,
  onUpdateQuantity,
  onRemoveItem,
  includeCutlery,
  onToggleCutlery,
  specialDeliveryNote,
  onUpdateDeliveryNote,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const packagingFee = cartItems.length > 0 ? 300 : 0;
  const deliveryFee = cartItems.length > 0 ? selectedZone.fee : 0;
  const grandTotal = subtotal + packagingFee + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-heading"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 id="cart-drawer-heading" className="font-display font-bold text-base text-stone-900 leading-tight">
                Your Order Bag
              </h2>
              <span className="text-xs text-stone-500">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Itemized List & Delivery Selector */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {cartItems.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-700 text-base">Your bag is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our authentic menu and add sizzling Jollof, Egusi soup, or beef suya.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold rounded-xl hover:bg-[#053d2e] transition-colors cursor-pointer"
              >
                Start Ordering
              </button>
            </div>
          ) : (
            <>
              {/* Itemized Order List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-800 uppercase tracking-wider">
                  <span>Customized Meals</span>
                  <span>Price</span>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col gap-2.5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-stone-900 leading-snug">
                          {item.menuItem.name}
                        </h4>
                        
                        {/* Customization Details */}
                        <div className="mt-1 text-xs text-stone-600 space-y-0.5">
                          {item.selectedProtein && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-stone-800">Protein:</span>
                              <span>{item.selectedProtein.name}</span>
                            </div>
                          )}
                          {item.selectedSwallow && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-stone-800">Swallow:</span>
                              <span className="text-[#064E3B] font-medium">{item.selectedSwallow}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-stone-500">
                            <span>Pepper: {item.spiceLevel}</span>
                            {item.specialNotes && (
                              <>
                                <span>·</span>
                                <span className="italic truncate">&ldquo;{item.specialNotes}&rdquo;</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="font-mono font-bold text-sm text-stone-900 tabular-nums shrink-0">
                        {formatNaira(item.totalPrice)}
                      </span>
                    </div>

                    {/* Stepper & Remove */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/80">
                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title="Remove dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-mono text-xs font-bold text-stone-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lagos Delivery Neighborhood Zone Selector */}
              <div className="pt-4 border-t border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="neighborhood-selector" className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#064E3B]" />
                    <span>Select Lagos Delivery Zone</span>
                  </label>
                  <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedZone.estimatedMinutes}
                  </span>
                </div>

                <div className="relative">
                  <select
                    id="neighborhood-selector"
                    value={selectedZone.id}
                    onChange={(e) => {
                      const zone = DELIVERY_ZONES.find((z) => z.id === e.target.value);
                      if (zone) onSelectZone(zone);
                    }}
                    className="w-full text-xs font-medium p-3 bg-white rounded-xl border border-stone-300 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] outline-hidden cursor-pointer"
                  >
                    {DELIVERY_ZONES.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} — {formatNaira(zone.fee)} ({zone.estimatedMinutes})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cutlery & Notes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700 select-none">
                  <input
                    type="checkbox"
                    checked={includeCutlery}
                    onChange={(e) => onToggleCutlery(e.target.checked)}
                    className="w-4 h-4 rounded text-[#064E3B] focus:ring-[#064E3B] border-stone-300"
                  />
                  <span>Include disposable cutlery &amp; napkins (Free)</span>
                </label>

                <div>
                  <label htmlFor="delivery-notes-input" className="block text-[11px] font-bold text-stone-600 mb-1">
                    Delivery Instructions / Landmark Note
                  </label>
                  <input
                    id="delivery-notes-input"
                    type="text"
                    value={specialDeliveryNote}
                    onChange={(e) => onUpdateDeliveryNote(e.target.value)}
                    placeholder="e.g. Ring the bell at gate, call when at junction"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden focus:border-[#064E3B]"
                  />
                </div>
              </div>

              {/* Bill Breakdown */}
              <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Meal Subtotal</span>
                  <span className="font-mono tabular-nums">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    <span>Delivery ({selectedZone.name})</span>
                  </span>
                  <span className="font-mono tabular-nums">{formatNaira(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Thermal Packaging &amp; Sealed Bags</span>
                  </span>
                  <span className="font-mono tabular-nums">{formatNaira(packagingFee)}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="font-mono text-base text-[#064E3B] tabular-nums">
                    {formatNaira(grandTotal)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Action Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 shrink-0">
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 bg-[#064E3B] hover:bg-[#053d2e] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-between cursor-pointer active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-amber-300">
                  {formatNaira(grandTotal)}
                </span>
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>
            <p className="text-[11px] text-center text-stone-500 mt-2">
              Pay on Delivery or Instant Bank Transfer supported
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
