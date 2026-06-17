"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { CartItem, Product } from "@/types/api";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  replaceCart: (items: CartItem[]) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const storageKey = "hn-electronics-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as any[];
        // Validate schema: Old WooCommerce items had 'id', new ones have '_id'
        const validItems = parsed.filter((item) => item?.product?._id);
        setItems(validItems);
      }
    } catch {
      // Corrupt or unreadable cart data — nuke it and start fresh
      window.localStorage.removeItem(storageKey);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product._id === product._id);
      if (existing) {
        return current.map((item) =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...current, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.product._id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((current) =>
      current.map((item) =>
        item.product._id === id ? { ...item, quantity: Math.max(1, qty || 1) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const replaceCart = useCallback((newItems: CartItem[]) => setItems(newItems), []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce(
        (total, item) => total + Number(item.product.price || 0) * item.quantity,
        0
      ),
      addItem,
      removeItem,
      updateQty,
      clearCart,
      replaceCart
    }),
    [addItem, clearCart, items, removeItem, updateQty, replaceCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider.");
  return context;
}
