import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { MenuItem, AddOn } from '@/data/menu';

export interface CartItem extends MenuItem {
  cartId: string;
  quantity: number;
  selectedSize: string | null;
  unitPrice: number;
  selectedAddOns: AddOn[];
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: MenuItem, size: string | null, unitPrice: number, addOns?: AddOn[]) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartIdFor(item: MenuItem, size: string | null, addOns: AddOn[]): string {
  const addonKey = addOns.map((a) => a.name).join('+');
  return [item.id, size ?? '', addonKey].join('__');
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: MenuItem, size: string | null, unitPrice: number, addOns: AddOn[] = []) => {
    const cartId = cartIdFor(item, size, addOns);
    setItems((prev) => {
      const existing = prev.find((i) => i.cartId === cartId);
      if (existing) {
        return prev.map((i) =>
          i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, cartId, quantity: 1, selectedSize: size, unitPrice, selectedAddOns: addOns }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.cartId === cartId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const addonTotal = (i.selectedAddOns ?? []).reduce((s, a) => s + a.price, 0);
    return sum + (i.unitPrice + addonTotal) * i.quantity;
  }, 0);

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
