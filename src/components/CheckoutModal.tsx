import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Phone, User, Landmark, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { CustomizedCartItem, DeliveryZone, Order } from '../types';
import { formatNaira, generateOrderId, getCurrentFormattedTime } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CustomizedCartItem[];
  selectedZone: DeliveryZone;
  includeCutlery: boolean;
  specialDeliveryNote: string;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  selectedZone,
  includeCutlery,
  specialDeliveryNote,
  onOrderPlaced,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pay_on_delivery' | 'bank_transfer' | 'card'>('pay_on_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const packagingFee = 300;
  const deliveryFee = selectedZone.fee;
  const grandTotal = subtotal + packagingFee + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setErrorMessage('Please provide a valid Nigerian contact number.');
      return;
    }
    if (!deliveryAddress.trim()) {
      setErrorMessage('Please provide your street delivery address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    // Simulate order generation & dispatch assignment
    setTimeout(() => {
      const newOrderId = generateOrderId();
      const newOrder: Order = {
        orderId: newOrderId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        landmark: landmark.trim(),
        neighborhoodZone: selectedZone,
        items: [...cartItems],
        subtotal,
        deliveryFee,
        packagingFee,
        grandTotal,
        paymentMethod,
        status: 'received',
        statusHistory: [
          {
            status: 'received',
            timestamp: getCurrentFormattedTime(),
            note: 'Order docket generated & routed to Lagos Central Kitchen dispatch screen.',
          },
        ],
        rider: {
          name: 'Ibrahim Aliyu',
          phone: '+234 814 982 3410',
          vehicle: 'Bajaj Boxer 150 (Red Insulated Box)',
          plateNumber: 'LAG-492-KT',
          rating: 4.9,
          deliveriesCount: 1421,
        },
        etaMinutes: parseInt(selectedZone.estimatedMinutes.split('–')[0]) || 25,
        createdAt: `Today, ${getCurrentFormattedTime()}`,
        includeCutlery,
        specialDeliveryNote: specialDeliveryNote.trim(),
      };

      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#064E3B] text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-amber-400 text-[11px] font-bold tracking-wider uppercase">
              Secure Delivery Checkout
            </span>
            <h2 id="checkout-modal-title" className="font-display font-bold text-lg sm:text-xl leading-tight">
              Complete Your Meal Order
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Delivery Zone Reminder */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <MapPin className="w-4 h-4 text-[#064E3B]" />
              <span className="font-medium">Zone: <strong>{selectedZone.name}</strong></span>
            </div>
            <span className="font-mono font-bold text-[#064E3B]">
              Fee: {formatNaira(selectedZone.fee)}
            </span>
          </div>

          {/* Customer Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              1. Delivery Contact Details
            </h3>

            <div>
              <label htmlFor="checkout-customer-name" className="block text-xs font-medium text-stone-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="checkout-customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Funke Adebayo or Emeka Nwosu"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-customer-phone" className="block text-xs font-medium text-stone-700 mb-1">
                Nigerian Phone Number (For Rider Ibrahim) *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="checkout-customer-phone"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 0802 345 6789 or +234 812..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-delivery-address" className="block text-xs font-medium text-stone-700 mb-1">
                Street Address *
              </label>
              <textarea
                id="checkout-delivery-address"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. Plot 14, Adeola Odeku Street, Victoria Island, Lagos"
                rows={2}
                className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="checkout-landmark" className="block text-xs font-medium text-stone-700 mb-1">
                Nearest Landmark (Optional)
              </label>
              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="checkout-landmark"
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Palms Mall / Beside Access Bank"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="pt-3 border-t border-stone-200 space-y-2.5">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              2. Payment Method
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <label
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  paymentMethod === 'pay_on_delivery'
                    ? 'border-[#064E3B] bg-emerald-50/60 ring-1 ring-[#064E3B]'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'pay_on_delivery'}
                    onChange={() => setPaymentMethod('pay_on_delivery')}
                    className="text-[#064E3B] focus:ring-[#064E3B]"
                  />
                  <div>
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Banknote className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Pay on Delivery (Cash or POS/Transfer to Rider)</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Pay rider Ibrahim upon physical package handover.</p>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#064E3B] bg-emerald-50/60 ring-1 ring-[#064E3B]'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="text-[#064E3B] focus:ring-[#064E3B]"
                  />
                  <div>
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-amber-700" />
                      <span>Instant Bank Transfer</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Providus Bank · Instant automated receipt recognition.</p>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#064E3B] bg-emerald-50/60 ring-1 ring-[#064E3B]'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-[#064E3B] focus:ring-[#064E3B]"
                  />
                  <div>
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                      <span>Debit Card (Mastercard / Visa / Verve)</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Zero transaction fees via Paystack gateway.</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Total & Summary */}
          <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items ({cartItems.length})</span>
              <span className="font-mono">{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Lagos Dispatch Fee</span>
              <span className="font-mono">{formatNaira(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Thermal Food Packaging</span>
              <span className="font-mono">{formatNaira(packagingFee)}</span>
            </div>
            <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-200">
              <span>Total Payable</span>
              <span className="font-mono text-base text-[#064E3B] tabular-nums">
                {formatNaira(grandTotal)}
              </span>
            </div>
          </div>

          {/* Place Order CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#064E3B] hover:bg-[#053d2e] disabled:bg-stone-400 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isSubmitting ? (
                <span>Firing kitchen docket...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Place Order • {formatNaira(grandTotal)}</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant order routing to Lead Dispatch Rider Ibrahim</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
