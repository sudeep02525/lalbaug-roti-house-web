"use client";

import { useCart } from "@/context/CartContext";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getImageUrl } from "@/components/ProductCard";

export default function FloatingCart() {
  const { items, subtotal } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const prevItemsCount = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const total = items.reduce((acc, item) => acc + item.quantity, 0);
    if (mounted && total > prevItemsCount.current) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 300);
      prevItemsCount.current = total;
      return () => clearTimeout(timer);
    }
    prevItemsCount.current = total;
  }, [items, mounted]);

  // Do not render until mounted on client to prevent hydration mismatch
  if (!mounted) return null;

  // Don't show if cart is empty
  if (items.length === 0) return null;

  // Don't show on cart or checkout pages
  if (pathname === "/cart" || pathname === "/checkout" || pathname === "/order-success") {
    return null;
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const uniqueImages = Array.from(new Set(items.map(item => {
    return item.product?.image || item.product?.images?.[0] || "/images/indian_roti_meal.png";
  }).filter(Boolean)));
  const displayImages = uniqueImages.slice(0, 3);
  const extraCount = uniqueImages.length > 3 ? uniqueImages.length - 3 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none flex justify-center animate-in slide-in-from-bottom-10 fade-in duration-300 md:hidden">
      <div 
        onClick={() => router.push("/cart")}
        className={`pointer-events-auto w-full max-w-md bg-[#16A34A] text-white rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-[0_10px_40px_rgba(22,163,74,0.5)] cursor-pointer hover:bg-[#15803d] transition-all duration-300 relative overflow-hidden group ${isBouncing ? '-translate-y-2' : 'translate-y-0'}`}
      >
        <div className="flex items-center gap-3 relative z-10">
          {/* Overlapping Circular Images */}
          <div className="flex items-center -space-x-3 pl-1">
            {displayImages.map((img, i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#16A34A] bg-white shrink-0 relative flex items-center justify-center overflow-hidden shadow-sm" style={{ zIndex: 10 - i }}>
                <img 
                  src={getImageUrl(img) || "/images/indian_roti_meal.png"} 
                  alt="Item" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "/images/indian_roti_meal.png" }}
                />
              </div>
            ))}
            {extraCount > 0 && (
              <div className="w-10 h-10 rounded-full border-2 border-[#16A34A] bg-white shrink-0 relative flex items-center justify-center text-xs font-bold shadow-inner text-[#16A34A]" style={{ zIndex: 0 }}>
                +{extraCount}
              </div>
            )}
          </div>
          
          {/* Price & Details */}
          <div className="flex flex-col ml-2">
            <div className={`flex items-center gap-1.5 font-bold transition-transform duration-300 ${isBouncing ? 'scale-110 origin-left' : 'scale-100'}`} style={{ fontFamily: "var(--font-outfit)" }}>
              <span className="text-white text-sm">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
              <span className="text-white/70 font-normal">|</span>
              <span className="text-white text-base tracking-wide">₹{subtotal}</span>
            </div>
            <p className="text-[10px] text-white/80 font-medium mt-0.5">Extra charges may apply</p>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="flex items-center gap-1.5 font-bold text-sm uppercase tracking-wider relative z-10" style={{ fontFamily: "var(--font-outfit)" }}>
          View Cart
          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
