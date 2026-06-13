import { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function openDrawer() { setDrawerOpen(true); }
  function closeDrawer() { setDrawerOpen(false); }

  function addItem(product) {
    setItems(prev => {
      const existing = prev.find(i => i.product_id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
          image_url: product.image_url,
        },
      ];
    });
  }

  function removeItem(product_id) {
    setItems(prev => {
      const item = prev.find(i => i.product_id === product_id);
      if (!item) return prev;
      if (item.quantity === 1) return prev.filter(i => i.product_id !== product_id);
      return prev.map(i =>
        i.product_id === product_id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }

  function clearCart() {
    setItems([]);
  }

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, itemCount, drawerOpen, openDrawer, closeDrawer }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
