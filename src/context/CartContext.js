"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [storeStatus, setStoreStatus] = useState({ isOpen: true, message: "" });

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("lrh_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart data");
      }
    }
    setMounted(true);
  }, []);

  // Save to local storage when items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("lrh_cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  // Fetch store status
  useEffect(() => {
    const fetchStoreStatus = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings?t=${new Date().getTime()}`,
          { validateStatus: () => true }
        );
        if (res.status === 200) {
          const data = res.data;
          const settings = data.data;

          if (settings.isAcceptingOrders === false) {
            setStoreStatus({
              isOpen: false,
              message: "Our store is temporarily closed. We are not accepting new orders right now.",
            });
            return;
          }

          if (settings.serviceStartTime && settings.serviceEndTime) {
            const now = new Date();
            const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
            const hours = istTime.getUTCHours().toString().padStart(2, "0");
            const minutes = istTime.getUTCMinutes().toString().padStart(2, "0");
            const currentTime = `${hours}:${minutes}`;

            if (
              currentTime < settings.serviceStartTime ||
              currentTime > settings.serviceEndTime
            ) {
              // Format time to AM/PM for display
              const formatAMPM = (timeStr) => {
                const [h, m] = timeStr.split(':');
                let hours = parseInt(h);
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                return `${hours}:${m} ${ampm}`;
              };
              
              setStoreStatus({
                isOpen: false,
                message: `Store is closed. Our operating hours are ${formatAMPM(settings.serviceStartTime)} to ${formatAMPM(settings.serviceEndTime)}.`,
              });
            } else {
              setStoreStatus({ isOpen: true, message: "" });
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    
    fetchStoreStatus();
    
    // Auto-refresh (polling) every 15 seconds
    const intervalId = setInterval(fetchStoreStatus, 15000);
    
    // Also refresh immediately when the user switches back to this tab
    const handleFocus = () => fetchStoreStatus();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStoreStatus();
      }
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const addToCart = (product, quantity = 1, variant = null, addons = []) => {
    setItems((prevItems) => {
      // Create a unique hash for the item based on ID, variant, and addons
      const addonIds = addons
        .map((a) => a.id)
        .sort()
        .join(",");
      const cartItemId = `${product.id}-${variant?.id || "base"}-${addonIds}`;

      const existingItemIndex = prevItems.findIndex(
        (item) => item.cartItemId === cartItemId,
      );

      if (existingItemIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            product,
            variant,
            addons,
            quantity,
          },
        ];
      }
    });
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const removeFromCart = (cartItemId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId),
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.length;

  const calculateItemTotal = (item) => {
    let itemPrice = item.variant ? item.variant.price : item.product.price;
    let addonsPrice = item.addons.reduce(
      (addSum, add) => addSum + add.price,
      0,
    );
    let totalAddons = addonsPrice * item.quantity;

    let productTotal = 0;
    const isSingle =
      !item.variant ||
      item.variant.name === "Single" ||
      item.variant.name === "Regular";

    if (isSingle && item.product.packPrice && item.product.packQty) {
      const packs = Math.floor(item.quantity / item.product.packQty);
      const singles = item.quantity % item.product.packQty;
      productTotal = packs * item.product.packPrice + singles * itemPrice;
    } else {
      productTotal = itemPrice * item.quantity;
    }

    return productTotal + totalAddons;
  };

  const subtotal = items.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        calculateItemTotal,
        mounted,
        storeStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
