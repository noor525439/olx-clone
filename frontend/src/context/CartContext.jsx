import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import React from 'react';
const CartContext = createContext(null);

const LS_KEY = 'cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const api = useMemo(() => {
    function add(item, qty = 1) {
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.id === item.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
          return copy;
        }
        return [...prev, { ...item, qty }];
      });
    }

    function remove(id) {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }

    function setQty(id, qty) {
      setItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, Number(qty) || 1) } : p))
      );
    }

    function clear() {
      setItems([]);
    }

    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

    return { items, add, remove, setQty, clear, subtotal };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

