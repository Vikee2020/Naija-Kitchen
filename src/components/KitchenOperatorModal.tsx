import React, { useState } from 'react';
import { X, ChefHat, Navigation, Printer, CheckCircle, Flame, Package, MapPin, Phone, User, Clock, Filter } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatNaira, getCurrentFormattedTime } from '../utils/formatters';

interface KitchenOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  onTrackOrder: (order: Order) => void;
}

export const KitchenOperatorModal: React.FC<KitchenOperatorModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onTrackOrder,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDocketOrder, setSelectedDocketOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[11px]">Received</span>;
      case 'preparing':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">Cooking 🔥</span>;
      case 'packaged':
        return <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[11px]">Packaged 📦</span>;
      case 'en_route':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">On Bike 🏍️</span>;
      case 'delivered':
        return <span className="bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded text-[11px]">Delivered ✓</span>;
    }
  };

  const advanceStatus = (order: Order) => {
    const time = getCurrentFormattedTime();
    if (order.status === 'received') {
      onUpdateOrderStatus(order.orderId, 'preparing', `Cooking started at ${time} by kitchen chefs.`);
    } else if (order.status === 'preparing') {
      onUpdateOrderStatus(order.orderId, 'packaged', `Meal sealed in thermal insulation and staged for rider at ${time}.`);
    } else if (order.status === 'packaged') {
      onUpdateOrderStatus(order.orderId, 'en_route', `Rider Ibrahim departed dispatch hub at ${time}.`);
    } else if (order.status === 'en_route') {
      onUpdateOrderStatus(order.orderId, 'delivered', `Delivered successfully to customer at ${time}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kitchen-hub-heading"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-amber-400 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="kitchen-hub-heading" className="font-display font-bold text-lg sm:text-xl text-white">
                  Kitchen Operations &amp; Dispatch Console
                </h2>
                <span className="text-[11px] font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded">
                  Operator Mode
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Lead Rider: Ibrahim Aliyu · Surulere Central Kitchen &amp; Island Dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close kitchen hub"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-semibold text-stone-700">Filter Queue:</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'received', label: 'Received' },
                { id: 'preparing', label: 'Cooking' },
                { id: 'packaged', label: 'Packaged' },
                { id: 'en_route', label: 'In Transit' },
                { id: 'delivered', label: 'Delivered' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                    filterStatus === tab.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-stone-500 font-mono text-xs">
            Active Orders: <strong>{orders.length}</strong>
          </div>
        </div>

        {/* Orders Queue Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-stone-500 space-y-2">
              <Package className="w-8 h-8 mx-auto text-stone-300" />
              <p className="font-medium text-sm">No orders matching current filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-stone-300 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div>
                    {/* Top Order Row */}
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-base text-[#064E3B]">
                            {order.orderId}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <span className="text-[11px] text-stone-500">
                          {order.createdAt} · {order.neighborhoodZone.name}
                        </span>
                      </div>

                      <span className="font-mono font-bold text-sm text-stone-900">
                        {formatNaira(order.grandTotal)}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="py-2 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-stone-900">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>{order.customerName}</span>
                        <span className="text-stone-400">·</span>
                        <a href={`tel:${order.customerPhone}`} className="text-emerald-700 hover:underline">
                          {order.customerPhone}
                        </a>
                      </div>
                      <div className="flex items-start gap-1.5 text-stone-600">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{order.deliveryAddress} {order.landmark && `(Near: ${order.landmark})`}</span>
                      </div>
                    </div>

                    {/* Meal Customization Notes (Chef's Critical Instructions) */}
                    <div className="py-2.5 px-3 bg-white rounded-lg border border-stone-200 space-y-1.5 text-xs">
                      <div className="font-bold text-stone-800 text-[11px] uppercase tracking-wider flex items-center justify-between">
                        <span>Items &amp; Kitchen Notes</span>
                        {order.includeCutlery && (
                          <span className="text-emerald-700 text-[10px] font-semibold">
                            + Cutlery
                          </span>
                        )}
                      </div>

                      {order.items.map((item, idx) => (
                        <div key={idx} className="pb-1 border-b border-stone-100 last:border-0 last:pb-0">
                          <div className="font-semibold text-stone-900 flex justify-between">
                            <span>{item.quantity}x {item.menuItem.name}</span>
                            <span className="font-mono text-stone-500">{item.spiceLevel}</span>
                          </div>
                          
                          <div className="text-[11px] text-stone-600">
                            {item.selectedProtein && <span>Protein: <strong>{item.selectedProtein.name}</strong> · </span>}
                            {item.selectedSwallow && <span className="text-[#064E3B]">Swallow: <strong>{item.selectedSwallow}</strong></span>}
                          </div>

                          {item.specialNotes && (
                            <div className="text-[11px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5">
                              Note: {item.specialNotes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-200">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedDocketOrder(order)}
                        className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="View Kitchen Docket Ticket"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Docket</span>
                      </button>

                      <button
                        onClick={() => {
                          onTrackOrder(order);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Live GPS view"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-600" />
                        <span>Track</span>
                      </button>
                    </div>

                    {order.status !== 'delivered' ? (
                      <button
                        onClick={() => advanceStatus(order)}
                        className="px-3 py-1.5 bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs"
                      >
                        {order.status === 'received' && 'Start Cooking 🔥'}
                        {order.status === 'preparing' && 'Package & Seal 📦'}
                        {order.status === 'packaged' && 'Hand to Rider 🏍️'}
                        {order.status === 'en_route' && 'Mark Delivered ✓'}
                      </button>
                    ) : (
                      <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kitchen Order Docket Modal (Thermal Ticket Print Simulation) */}
        {selectedDocketOrder && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full rounded-xl p-5 shadow-2xl border border-stone-300 font-mono text-xs space-y-3">
              <div className="text-center border-b border-dashed border-stone-400 pb-3">
                <h3 className="font-extrabold text-base tracking-widest uppercase">
                  MUMMY&apos;S KITCHEN
                </h3>
                <p className="text-[10px] text-stone-500">
                  Lagos Central Kitchen · Cook Line Docket
                </p>
                <div className="font-bold text-sm mt-1 text-stone-900">
                  ORDER: {selectedDocketOrder.orderId}
                </div>
                <div className="text-[10px] text-stone-500">
                  {selectedDocketOrder.createdAt} · {selectedDocketOrder.neighborhoodZone.name}
                </div>
              </div>

              <div className="space-y-2 border-b border-dashed border-stone-400 pb-3">
                <div className="font-bold">CUSTOMER: {selectedDocketOrder.customerName}</div>
                <div>TEL: {selectedDocketOrder.customerPhone}</div>
                <div>ADDR: {selectedDocketOrder.deliveryAddress}</div>
                {selectedDocketOrder.landmark && <div>NEAR: {selectedDocketOrder.landmark}</div>}
              </div>

              <div className="space-y-2 border-b border-dashed border-stone-400 pb-3">
                <div className="font-bold uppercase">PREPARATION ITEMS:</div>
                {selectedDocketOrder.items.map((item, i) => (
                  <div key={i} className="pl-1">
                    <div className="font-bold text-sm">
                      [{item.quantity}x] {item.menuItem.name}
                    </div>
                    {item.selectedProtein && <div>&gt; PROTEIN: {item.selectedProtein.name}</div>}
                    {item.selectedSwallow && <div className="font-bold text-emerald-800">&gt; SWALLOW: {item.selectedSwallow}</div>}
                    <div>&gt; HEAT LEVEL: {item.spiceLevel}</div>
                    {item.specialNotes && (
                      <div className="bg-amber-100 p-1 font-bold text-amber-900 mt-0.5">
                        ** CHEF NOTE: {item.specialNotes} **
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center pt-1 text-[11px]">
                <div>RIDER: {selectedDocketOrder.rider.name} ({selectedDocketOrder.rider.vehicle})</div>
                <div className="font-bold text-stone-900 mt-1">
                  TOTAL: {formatNaira(selectedDocketOrder.grandTotal)} ({selectedDocketOrder.paymentMethod.toUpperCase()})
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-stone-900 text-white font-bold rounded-lg text-xs hover:bg-black cursor-pointer"
                >
                  Print Ticket
                </button>
                <button
                  onClick={() => setSelectedDocketOrder(null)}
                  className="px-4 py-2 bg-stone-200 text-stone-700 font-bold rounded-lg text-xs hover:bg-stone-300 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
