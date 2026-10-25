import React, { useState, useEffect } from 'react';
import { X, Navigation, Phone, MessageCircle, Clock, MapPin, CheckCircle, Package, Flame, ChefHat, Search, Printer, Share2 } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatNaira } from '../utils/formatters';

interface LiveTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeOrder: Order | null;
  allOrders: Order[];
  onSelectOrder: (order: Order) => void;
  onOpenKitchenHub: () => void;
}

const STAGES: { status: OrderStatus; label: string; desc: string; icon: React.ElementType }[] = [
  { status: 'received', label: 'Order Received', desc: 'Docket verified by kitchen counter', icon: CheckCircle },
  { status: 'preparing', label: 'Kitchen Cooking', desc: 'Chefs are frying & simmering on the fire', icon: Flame },
  { status: 'packaged', label: 'Handed to Dispatch', desc: 'Thermal insulated packaging sealed', icon: Package },
  { status: 'en_route', label: 'Out for Delivery', desc: 'Rider is on bike en route to your location', icon: Navigation },
  { status: 'delivered', label: 'Delivered Fresh', desc: 'Meal received hot and enjoyed!', icon: ChefHat },
];

export const LiveTrackerModal: React.FC<LiveTrackerModalProps> = ({
  isOpen,
  onClose,
  activeOrder,
  allOrders,
  onSelectOrder,
  onOpenKitchenHub,
}) => {
  const [searchId, setSearchId] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentEta, setCurrentEta] = useState(activeOrder ? activeOrder.etaMinutes : 22);

  // Sync ETA countdown simulation
  useEffect(() => {
    if (activeOrder) {
      setCurrentEta(activeOrder.etaMinutes);
      const interval = setInterval(() => {
        setCurrentEta((prev) => (prev > 1 ? prev - 1 : 1));
      }, 45000);
      return () => clearInterval(interval);
    }
  }, [activeOrder]);

  if (!isOpen) return null;

  const currentOrder = activeOrder || (allOrders.length > 0 ? allOrders[0] : null);

  const getStageIndex = (status: OrderStatus) => {
    const map: Record<OrderStatus, number> = {
      received: 0,
      preparing: 1,
      packaged: 2,
      en_route: 3,
      delivered: 4,
    };
    return map[status] ?? 0;
  };

  const currentStageIndex = currentOrder ? getStageIndex(currentOrder.status) : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toUpperCase();
    const found = allOrders.find(
      (o) => o.orderId.toUpperCase() === query || o.orderId.toUpperCase().includes(query)
    );
    if (found) {
      onSelectOrder(found);
      setSearchId('');
    } else {
      alert(`No order found matching "${query}". Try ${allOrders[0]?.orderId || 'MK-48219'}`);
    }
  };

  const handleShare = () => {
    if (currentOrder && navigator.clipboard) {
      navigator.clipboard.writeText(`Tracking Mummy's Kitchen Order: ${currentOrder.orderId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracker-modal-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#064E3B] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-400 flex items-center justify-center">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-amber-400 text-[11px] font-bold tracking-wider uppercase">
                Real-Time Dispatch Radar
              </span>
              <h2 id="tracker-modal-title" className="font-display font-bold text-lg sm:text-xl leading-tight">
                Live Order Fulfillment Tracker
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Copy Order ID"
              className="px-2.5 py-1 text-xs rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close tracking"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Selection / Quick Search Bar */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Track by Order # (e.g. MK-48219)"
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono text-xs focus:border-[#064E3B] outline-hidden uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#064E3B] text-white font-semibold rounded-lg hover:bg-[#053d2e] cursor-pointer"
            >
              Find
            </button>
          </form>

          {/* Quick order pills switch */}
          {allOrders.length > 1 && (
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              <span className="text-[11px] text-stone-500 font-medium">Recent:</span>
              {allOrders.map((ord) => (
                <button
                  key={ord.orderId}
                  onClick={() => onSelectOrder(ord)}
                  className={`px-2 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                    currentOrder?.orderId === ord.orderId
                      ? 'bg-[#064E3B] text-white font-bold'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {ord.orderId}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tracker Body */}
        {currentOrder ? (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            
            {/* Top Order Badge & ETA Strip */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-stone-50 to-amber-50/50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-base text-[#064E3B]">
                    {currentOrder.orderId}
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-600 font-medium">
                    {currentOrder.neighborhoodZone.name}
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-500">{currentOrder.createdAt}</span>
                </div>
                <p className="text-xs text-stone-700 mt-1">
                  Recipient: <strong className="text-stone-900">{currentOrder.customerName}</strong> ({currentOrder.customerPhone})
                </p>
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  <MapPin className="w-3 h-3 inline text-amber-600 mr-1" />
                  {currentOrder.deliveryAddress}
                </p>
              </div>

              {/* ETA Display */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200 shrink-0">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  Estimated Arrival
                </span>
                <div className="flex items-center gap-1.5 text-lg sm:text-2xl font-display font-extrabold text-[#064E3B]">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="font-mono tabular-nums">
                    {currentOrder.status === 'delivered' ? 'Delivered' : `~${currentEta} mins`}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual 5-Stage Step Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Fulfillment Progression
              </h3>

              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-4.5 top-6 bottom-6 w-0.5 bg-stone-200"></div>

                <div className="space-y-5">
                  {STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const Icon = stage.icon;

                    return (
                      <div key={stage.status} className="relative flex items-start gap-4">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                            isCurrent
                              ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 shadow-md scale-110'
                              : isCompleted
                              ? 'bg-[#064E3B] text-white shadow-xs'
                              : 'bg-stone-200 text-stone-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`text-sm ${
                                isCurrent
                                  ? 'font-extrabold text-[#064E3B]'
                                  : isCompleted
                                  ? 'font-bold text-stone-900'
                                  : 'font-medium text-stone-400'
                              }`}
                            >
                              {stage.label}
                            </h4>
                            {isCurrent && (
                              <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interactive Animated Lagos GPS Dispatch Route Map */}
            <div className="rounded-xl overflow-hidden border border-stone-200 bg-slate-900 p-4 relative text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Lagos Transit Radar: Live Dispatch Corridors</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">
                  Rider Speed: ~38 km/h
                </span>
              </div>

              {/* Map Illustration (SVG) */}
              <div className="relative h-44 bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                {/* SVG Route Canvas */}
                <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
                  {/* Water / Lagoon representation */}
                  <path d="M 0,110 Q 150,130 300,90 T 500,100 L 500,180 L 0,180 Z" fill="#0c1d2e" opacity="0.6" />
                  
                  {/* Road Network Grid */}
                  <line x1="20" y1="50" x2="480" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="20" y1="130" x2="480" y2="130" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="120" y1="10" x2="120" y2="170" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="380" y1="10" x2="380" y2="170" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Main Route Path: Surulere Kitchen -> 3rd Mainland Bridge -> Destination */}
                  <path
                    d="M 60,110 C 140,110 180,60 260,60 C 340,60 380,120 440,120"
                    fill="none"
                    stroke="#064E3B"
                    strokeWidth="4"
                  />
                  <path
                    d="M 60,110 C 140,110 180,60 260,60 C 340,60 380,120 440,120"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    className="animate-pulse"
                  />

                  {/* Kitchen Marker */}
                  <circle cx="60" cy="110" r="7" fill="#064E3B" stroke="#ffffff" strokeWidth="2" />
                  <text x="60" y="132" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                    Mummy’s Kitchen Hub
                  </text>

                  {/* Customer Destination Marker */}
                  <circle cx="440" cy="120" r="7" fill="#DC2626" stroke="#ffffff" strokeWidth="2" />
                  <text x="440" y="142" fill="#fca5a5" fontSize="10" textAnchor="middle" fontWeight="bold">
                    {currentOrder.neighborhoodZone.name}
                  </text>

                  {/* Animated Rider Marker */}
                  {currentOrder.status === 'en_route' && (
                    <g transform="translate(260, 60)">
                      <circle cx="0" cy="0" r="14" fill="#F59E0B" opacity="0.3" className="animate-ping" />
                      <circle cx="0" cy="0" r="8" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="-12" fill="#F59E0B" fontSize="9" textAnchor="middle" fontWeight="bold">
                        Ibrahim (Boxer 150)
                      </text>
                    </g>
                  )}
                </svg>

                <div className="absolute bottom-2 left-3 text-[10px] text-slate-400">
                  Route: Adeniran Ogunsanya ➔ Third Mainland Bridge ➔ {currentOrder.neighborhoodZone.name}
                </div>
              </div>
            </div>

            {/* Rider Card (Persona C - Lead Dispatch Rider Ibrahim) */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#064E3B] text-amber-400 flex items-center justify-center font-bold text-lg shadow-xs">
                  IA
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-stone-900 text-sm">{currentOrder.rider.name}</h4>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                      ★ {currentOrder.rider.rating}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Lead Rider · {currentOrder.rider.vehicle}
                  </p>
                  <p className="text-[11px] font-mono text-stone-500">
                    Plate: {currentOrder.rider.plateNumber} · {currentOrder.rider.deliveriesCount} deliveries
                  </p>
                </div>
              </div>

              {/* Rider Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${currentOrder.rider.phone}`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Rider</span>
                </a>
                <a
                  href={`https://wa.me/${currentOrder.rider.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Itemized Order Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Order Docket Summary
                </h4>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 bg-white">
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 text-xs flex justify-between items-start">
                    <div>
                      <div className="font-bold text-stone-900">
                        {item.quantity}x {item.menuItem.name}
                      </div>
                      <div className="text-stone-600 mt-0.5">
                        {item.selectedProtein && <span>Protein: {item.selectedProtein.name} · </span>}
                        {item.selectedSwallow && <span className="text-[#064E3B] font-medium">Swallow: {item.selectedSwallow} · </span>}
                        <span>Heat: {item.spiceLevel}</span>
                      </div>
                      {item.specialNotes && (
                        <div className="text-stone-500 italic mt-0.5">
                          Note: &ldquo;{item.specialNotes}&rdquo;
                        </div>
                      )}
                    </div>
                    <span className="font-mono font-bold text-stone-900 tabular-nums">
                      {formatNaira(item.totalPrice)}
                    </span>
                  </div>
                ))}

                <div className="p-3 bg-stone-50 text-xs space-y-1">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatNaira(currentOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery ({currentOrder.neighborhoodZone.name})</span>
                    <span className="font-mono">{formatNaira(currentOrder.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Sealed Packaging Fee</span>
                    <span className="font-mono">{formatNaira(currentOrder.packagingFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 pt-1.5 border-t border-stone-200 text-sm">
                    <span>Grand Total</span>
                    <span className="font-mono text-[#064E3B]">{formatNaira(currentOrder.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Kitchen Operator link */}
            <div className="pt-2 text-center">
              <button
                onClick={onOpenKitchenHub}
                className="text-xs text-stone-500 hover:text-[#064E3B] underline underline-offset-4 cursor-pointer"
              >
                Switch to Kitchen &amp; Dispatch Operator View to update order status ➔
              </button>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm text-stone-600">No active orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
