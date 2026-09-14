import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { MenuItem } from '@/data/menu';

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSize: string | null;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: MenuItem, size: string | null, unitPrice: number) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartIdFor(item: MenuItem, size: string | null): string {
  return size ? `${item.id}__${size}` : item.id;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: MenuItem, size: string | null, unitPrice: number) => {
    const cartId = cartIdFor(item, size);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, id: cartId, quantity: 1, selectedSize: size, unitPrice }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === cartId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
