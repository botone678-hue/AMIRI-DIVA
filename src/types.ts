export interface ProductShade {
  name: string;
  colorHex: string;
  image?: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'skincare' | 'lips' | 'eyes' | 'complexion' | 'fragrance' | 'hair';
  subtitle: string;
  priceKES: number;
  originalPriceKES?: number;
  rating: number;
  reviewCount: number;
  image: string;
  additionalImages?: string[];
  shades?: ProductShade[];
  description: string;
  ingredients: string;
  howToUse: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  stockQuantity: number;
  volumeOrWeight?: string;
}

export interface CartItem {
  id: string; // unique identifier (productId + shade)
  productId: string;
  product: Product;
  quantity: number;
  selectedShade?: string;
}

export type PaymentStatus = 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
export type OrderStatus = 'PLACED' | 'APPROVED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCounty: string;
  deliveryTown: string;
  specialInstructions?: string;
  items: {
    productId: string;
    productName: string;
    selectedShade?: string;
    quantity: number;
    unitPriceKES: number;
    totalPriceKES: number;
    image: string;
  }[];
  subtotalKES: number;
  shippingFeeKES: number;
  discountKES: number;
  totalAmountKES: number;
  paymentMethod: 'POCHI_LA_BIASHARA';
  pochiNumber: string;
  mpesaReference?: string;
  paymentSubmittedAt?: string;
  paymentVerifiedAt?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  rejectionReason?: string;
  managerNotes?: string;
  auditLogs: AuditLogEntry[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  location?: string;
}

export interface CategoryInfo {
  id: 'skincare' | 'lips' | 'eyes' | 'complexion' | 'fragrance' | 'hair';
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}
