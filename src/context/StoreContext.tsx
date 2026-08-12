import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import {
  getLocalOrders,
  createOrderSecurely,
  submitMpesaPaymentReference,
  updatePaymentVerification,
  updateOrderStatus,
  recordAuditLog
} from '../services/supabase';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedShade?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalKES: number;
  activePromo: { code: string; percent: number } | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  orders: Order[];
  refreshOrders: () => void;
  createOrder: (customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    county: string;
    town: string;
    instructions?: string;
  }, shippingFeeKES: number) => Promise<Order>;
  submitMpesaCode: (orderId: string, mpesaCode: string) => Promise<Order | null>;
  managerVerifyPayment: (orderId: string, verified: boolean, reason?: string) => Promise<Order | null>;
  managerUpdateStatus: (orderId: string, status: OrderStatus, notes?: string) => Promise<Order | null>;
  managerSaveProduct: (product: Product) => void;
  managerDeleteProduct: (productId: string) => void;
  
  // Navigation & UI state
  currentRoute: string;
  routeSlug: string | null;
  navigateTo: (route: string, slug?: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  managerMode: boolean;
  setManagerMode: (active: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'amiri_diva_products_v2';
const CART_STORAGE_KEY = 'amiri_diva_cart_v2';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  // Promo code state
  const [activePromo, setActivePromo] = useState<{ code: string; percent: number } | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => getLocalOrders());

  // UI & Navigation
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeSlug, setRouteSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [managerMode, setManagerMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save products when modified
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }, [products]);

  // Save cart when modified
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  // Toast handler
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Handle URL hash navigation and route synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (!hash || hash === '' || hash === 'home') {
        setCurrentRoute('home');
        setRouteSlug(null);
      } else if (hash.startsWith('product/')) {
        const slug = hash.replace('product/', '');
        setCurrentRoute('product');
        setRouteSlug(slug);
      } else if (hash.startsWith('order/')) {
        const slug = hash.replace('order/', '');
        setCurrentRoute('orders');
        setRouteSlug(slug);
      } else {
        setCurrentRoute(hash);
        setRouteSlug(null);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string, slug?: string) => {
    setCurrentRoute(route);
    setRouteSlug(slug || null);
    if (route === 'product' && slug) {
      window.location.hash = `#/product/${slug}`;
    } else if (route === 'orders' && slug) {
      window.location.hash = `#/order/${slug}`;
    } else {
      window.location.hash = `#/${route}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1, selectedShade?: string) => {
    const cartItemId = `${product.id}-${selectedShade || 'default'}`;
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            product,
            quantity,
            selectedShade
          }
        ];
      }
    });
    showToast(`Added ${product.name} ${selectedShade ? `(${selectedShade})` : ''} to your bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from your bag.');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotalKES = cart.reduce(
    (sum, item) => sum + item.product.priceKES * item.quantity,
    0
  );

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DIVA10' || clean === 'WELCOME10') {
      setActivePromo({ code: clean, percent: 10 });
      return { success: true, message: '10% Diva discount code applied!' };
    } else if (clean === 'ELDORET20') {
      setActivePromo({ code: clean, percent: 20 });
      return { success: true, message: '20% Eldoret Diva launch discount applied!' };
    } else {
      return { success: false, message: 'Invalid discount code. Try WELCOME10 or DIVA10.' };
    }
  };

  // Orders refresh
  const refreshOrders = () => {
    setOrders(getLocalOrders());
  };

  // Create Order
  const createOrder = async (
    customerInfo: {
      name: string;
      email: string;
      phone: string;
      address: string;
      county: string;
      town: string;
      instructions?: string;
    },
    shippingFeeKES: number
  ) => {
    const discountAmountKES = activePromo
      ? Math.round((cartSubtotalKES * activePromo.percent) / 100)
      : 0;
    const totalAmountKES = Math.max(0, cartSubtotalKES + shippingFeeKES - discountAmountKES);

    const items = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      selectedShade: item.selectedShade,
      quantity: item.quantity,
      unitPriceKES: item.product.priceKES,
      totalPriceKES: item.product.priceKES * item.quantity,
      image: item.product.image
    }));

    const newOrder = await createOrderSecurely({
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      deliveryAddress: customerInfo.address,
      deliveryCounty: customerInfo.county,
      deliveryTown: customerInfo.town,
      specialInstructions: customerInfo.instructions,
      items,
      subtotalKES: cartSubtotalKES,
      shippingFeeKES,
      discountKES: discountAmountKES,
      totalAmountKES,
      paymentMethod: 'POCHI_LA_BIASHARA',
      pochiNumber: '07417758'
    });

    // Reduce stock locally
    setProducts((prev) =>
      prev.map((prod) => {
        const itemInCart = items.find((i) => i.productId === prod.id);
        if (itemInCart) {
          return {
            ...prod,
            stockQuantity: Math.max(0, prod.stockQuantity - itemInCart.quantity)
          };
        }
        return prod;
      })
    );

    clearCart();
    refreshOrders();
    return newOrder;
  };

  // Submit M-Pesa Code
  const submitMpesaCode = async (orderId: string, mpesaCode: string) => {
    const updated = await submitMpesaPaymentReference(orderId, mpesaCode);
    refreshOrders();
    showToast(`M-Pesa code ${mpesaCode.toUpperCase()} submitted for Order verification.`);
    return updated;
  };

  // Manager Actions
  const managerVerifyPayment = async (orderId: string, verified: boolean, reason?: string) => {
    const updated = await updatePaymentVerification(
      orderId,
      verified,
      'Manager (Amiri Diva Eldoret)',
      reason
    );
    refreshOrders();
    showToast(
      verified
        ? `Payment verified & order approved!`
        : `Payment rejected.`
    );
    return updated;
  };

  const managerUpdateStatus = async (orderId: string, status: OrderStatus, notes?: string) => {
    const updated = await updateOrderStatus(
      orderId,
      status,
      'Manager (Amiri Diva Eldoret)',
      notes
    );
    refreshOrders();
    showToast(`Order status updated to ${status}.`);
    return updated;
  };

  const managerSaveProduct = (updatedProduct: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === updatedProduct.id);
      if (idx > -1) {
        const newArr = [...prev];
        newArr[idx] = updatedProduct;
        return newArr;
      } else {
        return [updatedProduct, ...prev];
      }
    });
    recordAuditLog(
      'PRODUCT_CATALOG_UPDATE',
      'Manager (Amiri Diva)',
      `Updated product listing: ${updatedProduct.name}`
    );
    showToast(`Catalog updated for ${updatedProduct.name}.`);
  };

  const managerDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    recordAuditLog(
      'PRODUCT_CATALOG_DELETE',
      'Manager (Amiri Diva)',
      `Removed product ID: ${productId}`
    );
    showToast('Product removed from catalog.');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotalKES,
        activePromo,
        applyPromoCode,
        orders,
        refreshOrders,
        createOrder,
        submitMpesaCode,
        managerVerifyPayment,
        managerUpdateStatus,
        managerSaveProduct,
        managerDeleteProduct,
        currentRoute,
        routeSlug,
        navigateTo,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        managerMode,
        setManagerMode,
        toastMessage,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
