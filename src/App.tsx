/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { SignatureSoupsSection } from './components/SignatureSoupsSection';
import { MealCustomizerModal } from './components/MealCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveTrackerModal } from './components/LiveTrackerModal';
import { KitchenOperatorModal } from './components/KitchenOperatorModal';
import { DeliveryZonesModal } from './components/DeliveryZonesModal';
import { Footer } from './components/Footer';
import { CustomizedCartItem, DeliveryZone, MenuItem, Order, OrderStatus } from './types';
import { DELIVERY_ZONES, INITIAL_ORDERS } from './data/menuData';

export default function App() {
  // Cart state
  const [cartItems, setCartItems] = useState<CustomizedCartItem[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[3]); // Victoria Island default
  const [includeCutlery, setIncludeCutlery] = useState<boolean>(true);
  const [specialDeliveryNote, setSpecialDeliveryNote] = useState<string>('');

  // Modals state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isKitchenHubOpen, setIsKitchenHubOpen] = useState(false);
  const [isZonesOpen, setIsZonesOpen] = useState(false);

  // Orders state
  const [allOrders, setAllOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(INITIAL_ORDERS[0]);

  // Toast feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart Handlers
  const handleOpenCustomizer = (item: MenuItem) => {
    setCustomizingItem(item);
    setIsCustomizerOpen(true);
  };

  const handleAddToCart = (customizedItem: CustomizedCartItem) => {
    setCartItems((prev) => {
      // Check if an identical customization already exists
      const existingIdx = prev.findIndex(
        (i) =>
          i.menuItem.id === customizedItem.menuItem.id &&
          i.selectedProtein?.id === customizedItem.selectedProtein?.id &&
          i.selectedSwallow === customizedItem.selectedSwallow &&
          i.spiceLevel === customizedItem.spiceLevel &&
          i.specialNotes === customizedItem.specialNotes
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const existing = updated[existingIdx];
        const newQty = existing.quantity + customizedItem.quantity;
        updated[existingIdx] = {
          ...existing,
          quantity: newQty,
          totalPrice: existing.unitPrice * newQty,
        };
        return updated;
      }
      return [...prev, customizedItem];
    });

    showToast(`Added ${customizedItem.quantity}x ${customizedItem.menuItem.name} to your bag`);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CustomizedCartItem[]
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // Order Placement Handler
  const handleOrderPlaced = (newOrder: Order) => {
    setAllOrders((prev) => [newOrder, ...prev]);
    setTrackedOrder(newOrder);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsTrackerOpen(true);
    showToast(`Order ${newOrder.orderId} placed! Dispatch rider assigned.`);
  };

  // Kitchen Operator Status Update Handler
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setAllOrders((prev) =>
      prev.map((order) => {
        if (order.orderId === orderId) {
          const updatedHistory = [
            ...order.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: note || `Status updated to ${newStatus}`,
            },
          ];
          const updatedOrder: Order = {
            ...order,
            status: newStatus,
            statusHistory: updatedHistory,
          };
          if (trackedOrder?.orderId === orderId) {
            setTrackedOrder(updatedOrder);
          }
          return updatedOrder;
        }
        return order;
      })
    );
    showToast(`Order ${orderId} updated to ${newStatus.toUpperCase()}`);
  };

  const handleSelectZoneById = (zoneId: string) => {
    const found = DELIVERY_ZONES.find((z) => z.id === zoneId);
    if (found) {
      setSelectedZone(found);
      showToast(`Delivery zone updated to ${found.name}`);
    }
  };

  const handleExploreMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col text-stone-900 selection:bg-amber-400 selection:text-stone-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-stone-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200 border border-stone-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation */}
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenKitchenHub={() => setIsKitchenHubOpen(true)}
        onOpenZones={() => setIsZonesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero & Value Proposition */}
        <HeroSection
          onExploreMenu={handleExploreMenu}
          onOpenTracker={() => setIsTrackerOpen(true)}
          onSelectZone={handleSelectZoneById}
        />

        {/* Dynamic Filterable Menu */}
        <MenuSection onSelectItem={handleOpenCustomizer} />

        {/* Signature Heritage Soups Showcase */}
        <SignatureSoupsSection onSelectItem={handleOpenCustomizer} />
      </main>

      {/* Footer */}
      <Footer
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenKitchenHub={() => setIsKitchenHubOpen(true)}
        onOpenZones={() => setIsZonesOpen(true)}
      />

      {/* Customization Item Builder Modal */}
      <MealCustomizerModal
        item={customizingItem}
        isOpen={isCustomizerOpen}
        onClose={() => {
          setIsCustomizerOpen(false);
          setCustomizingItem(null);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Bag & Neighborhood Calculator Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        includeCutlery={includeCutlery}
        onToggleCutlery={setIncludeCutlery}
        specialDeliveryNote={specialDeliveryNote}
        onUpdateDeliveryNote={setSpecialDeliveryNote}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        selectedZone={selectedZone}
        includeCutlery={includeCutlery}
        specialDeliveryNote={specialDeliveryNote}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Live Dispatch Tracker Modal */}
      <LiveTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        activeOrder={trackedOrder}
        allOrders={allOrders}
        onSelectOrder={(ord) => setTrackedOrder(ord)}
        onOpenKitchenHub={() => {
          setIsTrackerOpen(false);
          setIsKitchenHubOpen(true);
        }}
      />

      {/* Kitchen & Dispatch Operator Console */}
      <KitchenOperatorModal
        isOpen={isKitchenHubOpen}
        onClose={() => setIsKitchenHubOpen(false)}
        orders={allOrders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onTrackOrder={(ord) => {
          setTrackedOrder(ord);
          setIsTrackerOpen(true);
        }}
      />

      {/* Delivery Zones & Rates Reference Modal */}
      <DeliveryZonesModal
        isOpen={isZonesOpen}
        onClose={() => setIsZonesOpen(false)}
        selectedZone={selectedZone}
        onSelectZone={(zone) => {
          setSelectedZone(zone);
          showToast(`Zone set to ${zone.name}`);
        }}
      />

    </div>
  );
}
