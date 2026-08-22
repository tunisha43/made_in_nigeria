'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem } from '@/lib/cart/types';

const STORAGE_KEY = 'made-in-nigeria-cart';

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotalKobo: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // Ignore malformed local cart data.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotalKobo: items.reduce((sum, item) => sum + item.priceKobo * item.quantity, 0),
    addItem: (item) => setItems((current) => {
      const existing = current.find((entry) => entry.productId === item.productId);
      if (existing) {
        return current.map((entry) => entry.productId === item.productId
          ? { ...entry, quantity: entry.quantity + item.quantity }
          : entry);
      }
      return [...current, item];
    }),
    updateQuantity: (productId, quantity) => setItems((current) => quantity <= 0
      ? current.filter((item) => item.productId !== productId)
      : current.map((item) => item.productId === productId ? { ...item, quantity } : item)),
    removeItem: (productId) => setItems((current) => current.filter((item) => item.productId !== productId)),
    clear: () => setItems([]),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
