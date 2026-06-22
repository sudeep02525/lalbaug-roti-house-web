"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowRight,
  ShoppingBag,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import CartItems from "@/components/cart/CartItems";
import CartSummary from "@/components/cart/CartSummary";

function MiniCrossSellCard({
  item,
  items,
  addToCart,
  updateQuantity,
  removeFromCart,
}) {
  const basePrice = item.price || 0;

  // Find if item is already in cart, regardless of whether it was added from menu or cross-sell
  const cartItem = items.find((i) => i.product.id === item.id);
  const qty = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    const variant = item.packPrice
      ? { type: "single", name: "Single", price: item.price }
      : null;
    // Add flag so CartItems.jsx can hide it from the top list
    addToCart({ ...item, isCrossSell: true }, 1, variant, []);
  };

  const handlePlus = () => {
    if (cartItem) updateQuantity(cartItem.cartItemId, qty + 1);
  };

  const handleMinus = () => {
    if (cartItem) {
      if (qty === 1) removeFromCart(cartItem.cartItemId);
      else updateQuantity(cartItem.cartItemId, qty - 1);
    }
  };

  const getImgUrl = (url) => {
    if (!url) return "/images/indian_roti_meal.png";
    if (url.startsWith("/uploads"))
      return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    return url;
  };

  return (
    <div className="flex flex-col bg-[#FAF8F5] border border-[#EAE5D9] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full">
      <div className="h-28 w-full bg-gray-100 relative shrink-0">
        <img
          src={getImgUrl(item.image)}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
        <div>
          <h3
            className="font-bold text-[#114D3C] text-sm line-clamp-1"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {item.name}
          </h3>
          <p className="text-[11px] text-[#73706A] line-clamp-1 mt-0.5">
            {item.desc || "Authentic taste"}
          </p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="font-bold text-[#114D3C] text-sm">₹{basePrice}</span>
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className="bg-white border border-[#16A34A] text-[#16A34A] hover:bg-[#16A34A] hover:text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-colors"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center bg-white border border-[#16A34A] rounded-full overflow-hidden shadow-sm h-7">
              <button
                onClick={handleMinus}
                className="w-7 h-full flex items-center justify-center text-[#16A34A] font-bold text-lg hover:bg-[#16A34A] hover:text-white transition-colors"
              >
                -
              </button>
              <span className="w-6 text-center text-xs font-bold text-[#114D3C]">
                {qty}
              </span>
              <button
                onClick={handlePlus}
                className="w-7 h-full flex items-center justify-center text-[#16A34A] font-bold text-lg hover:bg-[#16A34A] hover:text-white transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    calculateItemTotal,
    mounted,
    storeStatus,
    addToCart,
  } = useCart();
  const { user } = useAuth();
  const [recommendedItems, setRecommendedItems] = useState([]);

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    // Fetch menu for cross-selling
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/catalog/menu`, {
        validateStatus: () => true,
      })
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const allItems = [];
          Object.values(res.data.data).forEach((catItems) =>
            allItems.push(...catItems),
          );
          // Randomize
          const shuffled = allItems.sort(() => 0.5 - Math.random());
          setRecommendedItems(shuffled);
        }
      })
      .catch((err) => console.error("Failed to fetch recommendations", err));
  }, []);

  if (!mounted) return null;

  // ... (rest of the component) ...

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pb-24">
        <style jsx global>{`
          header,
          footer {
            display: none !important;
          }
        `}</style>

        {/* Header */}
        <div className="bg-white border-b border-[#EAE5D9] sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-2">
            <Link
              href="/menu"
              className="flex items-center gap-1 sm:gap-2 text-[#73706A] hover:text-[#114D3C] transition-colors font-bold text-sm shrink-0"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              <ChevronLeft className="w-5 h-5 shrink-0" />
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div
              className="font-bold text-[#114D3C] text-base sm:text-lg tracking-widest uppercase truncate text-center"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Your Cart
            </div>
            <div className="w-10 flex justify-end shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#C19B6C]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center px-4 mt-20 sm:mt-32">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border border-[#EAE5D9]">
            <ShoppingBag className="w-10 h-10 text-[#C19B6C]" />
          </div>
          <h2
            className="text-3xl font-bold text-[#114D3C] mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your cart is empty
          </h2>
          <p
            className="text-[#73706A] text-lg mb-8 max-w-sm"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Looks like you haven't added anything yet. Let's fix that!
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-[#114D3C] text-white font-bold px-8 py-4 rounded-full hover:bg-[#0B382B] transition-all shadow-[0_8px_20px_rgba(17,77,60,0.2)] hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Explore Menu
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-12">
      <style jsx global>{`
        body {
          background-color: #FAF8F5 !important;
        }
        header,
        footer {
          display: none !important;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Store Closed Global Banner */}
      {!storeStatus?.isOpen && storeStatus?.message && (
        <div
          className="w-full bg-[#E53E3E] text-white text-center py-2.5 px-4 text-xs md:text-sm font-bold shadow-sm flex items-center justify-center gap-2 tracking-wide sticky top-0 z-50"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{storeStatus.message}</span>
        </div>
      )}

      {/* Header */}
      <div
        className={`bg-white border-b border-[#EAE5D9] sticky z-40 shadow-sm ${!storeStatus?.isOpen ? "top-[40px]" : "top-0"}`}
      >
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-2">
          <Link
            href="/menu"
            className="flex items-center gap-1 sm:gap-2 text-[#73706A] hover:text-[#114D3C] transition-colors font-bold text-sm shrink-0"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            <ChevronLeft className="w-5 h-5 shrink-0" />
            <span className="hidden sm:inline">Continue Shopping</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div
            className="font-bold text-[#114D3C] text-base sm:text-lg tracking-widest uppercase truncate text-center"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Your Cart
          </div>
          <div className="w-10 flex justify-end shrink-0">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#C19B6C]" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-8 lg:pt-12">
        <div className="mb-6">
          <h1
            className="text-3xl lg:text-4xl font-bold text-[#8B5E3C] mb-1.5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Review Order
          </h1>
          <p
            className="text-base text-[#73706A]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            You have {totalQuantity} items ready for checkout.
          </p>
        </div>

        {!storeStatus?.isOpen && storeStatus?.message && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <p className="font-bold font-outfit">{storeStatus.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left - Items & Cross Selling */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
            <CartItems
              items={items}
              calculateItemTotal={calculateItemTotal}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />

            {/* Cross-selling Section */}
            {recommendedItems.length > 0 && (
              <div className="bg-white pt-6 sm:pt-8 pb-6 sm:pb-8 rounded-[2rem] border border-[#EAE5D9] shadow-sm overflow-hidden w-full max-w-full">
                <h2
                  className="text-2xl sm:text-3xl font-bold text-[#114D3C] mb-6 px-8 sm:px-10"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Add More Items
                </h2>
                <div
                  ref={scrollRef}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  className="flex overflow-x-auto hide-scrollbar gap-5 px-8 sm:px-10 pb-4 cursor-grab active:cursor-grabbing"
                >
                  {recommendedItems.map((item) => (
                    <div
                      key={item.id}
                      className="w-[180px] sm:w-[220px] shrink-0"
                    >
                      <MiniCrossSellCard
                        item={item}
                        items={items}
                        addToCart={addToCart}
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Summary */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <CartSummary
              items={items}
              subtotal={subtotal}
              storeStatus={storeStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
