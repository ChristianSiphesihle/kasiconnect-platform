import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const GUEST_KEY = "kasiconnect_cart_guest";
const keyFor = (uid) => (uid ? `kasiconnect_cart_${uid}` : GUEST_KEY);

// Reads a saved cart from the browser; falls back to an empty cart
const readCart = (key) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Combines two carts: same product = add the quantities (capped at stock)
const mergeCarts = (base, extra) => {
  const merged = [...base];
  extra.forEach((item) => {
    const existing = merged.find((i) => i.productId === item.productId);
    if (existing) {
      const max = existing.maxStock ?? Infinity;
      existing.quantity = Math.min(existing.quantity + item.quantity, max);
    } else {
      merged.push(item);
    }
  });
  return merged;
};

export function CartProvider({ children }) {
  const { user, loading } = useAuth();
  const uid = user?.uid ?? null;

  const [items, setItems] = useState([]);
  const [activeKey, setActiveKey] = useState(null); // which saved cart `items` belongs to

  // 1. When we know who is using the site (or who changed), load THEIR cart
  useEffect(() => {
    if (loading) return;

    const key = keyFor(uid);
    let loaded = readCart(key);

    if (uid) {
      // logged in: fold any guest cart into the account cart
      const guestItems = readCart(GUEST_KEY);
      if (guestItems.length > 0) {
        loaded = mergeCarts(loaded, guestItems);
        localStorage.removeItem(GUEST_KEY);
      }
    }

    setItems(loaded);
    setActiveKey(key);
  }, [uid, loading]);

  // 2. Whenever the cart changes, save it under the current key
  useEffect(() => {
    if (!activeKey) return; // not loaded yet: saving now would wipe the real cart
    localStorage.setItem(activeKey, JSON.stringify(items));
  }, [items, activeKey]);

  const addToCart = (product, business, quantity = 1) => {
    setItems((current) => {
      const max = product.stock ?? Infinity; // null stock = not tracked = no limit
      const existing = current.find((i) => i.productId === product.productId);

      if (existing) {
        return current.map((i) =>
          i.productId === product.productId
            ? {
                ...i,
                quantity: Math.min(i.quantity + quantity, max),
                maxStock: product.stock ?? null,
              }
            : i,
        );
      }

      return [
        ...current,
        {
          productId: product.productId,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          type: product.type,
          maxStock: product.stock ?? null,
          businessId: business.businessId,
          businessName: business.businessName,
          quantity: Math.min(quantity, max),
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setItems((current) =>
      current.map((i) => {
        if (i.productId !== productId) return i;
        const max = i.maxStock ?? Infinity;
        return { ...i, quantity: Math.max(1, Math.min(quantity, max)) };
      }),
    );
  };

  const removeFromCart = (productId) =>
    setItems((current) => current.filter((i) => i.productId !== productId));

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
