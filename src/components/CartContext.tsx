'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, MenuItem, PortionOption, SpiceLevel } from '@/types/restaurant';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, portion?: PortionOption, spice?: SpiceLevel) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nalli_nahari_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('nalli_nahari_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (item: MenuItem, portion?: PortionOption, spice?: SpiceLevel) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.item.id === item.id && ci.selectedPortion?.name === portion?.name && ci.selectedSpice === spice
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { item, selectedPortion: portion, selectedSpice: spice, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, ci) => {
    const itemPrice = ci.selectedPortion ? ci.selectedPortion.price : ci.item.price;
    return total + itemPrice * ci.quantity;
  }, 0);

  const totalCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        totalCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
