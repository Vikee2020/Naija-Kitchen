export type MenuCategory = 'all' | 'rice' | 'soups' | 'suya' | 'drinks_sides';

export type SpiceLevel = 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';

export interface ProteinOption {
  id: string;
  name: string;
  extraPrice: number;
}

export interface SwallowOption {
  id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'rice' | 'soups' | 'suya' | 'drinks_sides';
  price: number;
  description: string;
  image: string;
  defaultSpice: SpiceLevel;
  requiresSwallow: boolean;
  allowsProteinSelection: boolean;
  badge?: string;
  prepTime: string;
}

export interface CustomizedCartItem {
  cartItemId: string;
  menuItem: MenuItem;
  selectedProtein?: ProteinOption;
  selectedSwallow?: string;
  spiceLevel: SpiceLevel;
  specialNotes: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedMinutes: string;
  hub: 'Island' | 'Mainland';
}

export type OrderStatus = 'received' | 'preparing' | 'packaged' | 'en_route' | 'delivered';

export interface OrderStatusStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  landmark: string;
  neighborhoodZone: DeliveryZone;
  items: CustomizedCartItem[];
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  grandTotal: number;
  paymentMethod: 'pay_on_delivery' | 'bank_transfer' | 'card';
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  rider: {
    name: string;
    phone: string;
    vehicle: string;
    plateNumber: string;
    rating: number;
    deliveriesCount: number;
  };
  etaMinutes: number;
  createdAt: string;
  includeCutlery: boolean;
  specialDeliveryNote?: string;
}
