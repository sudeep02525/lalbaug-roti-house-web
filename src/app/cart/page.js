"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { ArrowRight, ShoppingBag, ChevronLeft, AlertCircle } from 'lucide-react'

import CartItems from '@/components/cart/CartItems'
import CartSummary from '@/components/cart/CartSummary'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeFromCart, subtotal, calculateItemTotal, mounted, storeStatus } = useCart()
  const { user } = useAuth()

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pb-24">
        <style jsx global>{`
          header, footer { display: none !important; }
        `}</style>
        
        {/* Header */}
        <div className="bg-white border-b border-[#EAE5D9] sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-2">
            <Link href="/menu" className="flex items-center gap-1 sm:gap-2 text-[#73706A] hover:text-[#114D3C] transition-colors font-bold text-sm shrink-0" style={{ fontFamily: "var(--font-outfit)" }}>
              <ChevronLeft className="w-5 h-5 shrink-0" /> 
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="font-bold text-[#114D3C] text-base sm:text-lg tracking-widest uppercase truncate text-center" style={{ fontFamily: "var(--font-outfit)" }}>
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
          <h2 className="text-3xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>Your cart is empty</h2>
          <p className="text-[#73706A] text-lg mb-8 max-w-sm" style={{ fontFamily: "var(--font-outfit)" }}>
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
    )
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      <style jsx global>{`
        header, footer { display: none !important; }
      `}</style>
      
      {/* Store Closed Global Banner */}
      {!storeStatus?.isOpen && storeStatus?.message && (
        <div className="w-full bg-[#E53E3E] text-white text-center py-2.5 px-4 text-xs md:text-sm font-bold shadow-sm flex items-center justify-center gap-2 tracking-wide sticky top-0 z-50" style={{ fontFamily: "var(--font-outfit)" }}>
          <AlertCircle className="w-4 h-4" />
          <span>{storeStatus.message}</span>
        </div>
      )}
      
      {/* Header */}
      <div className={`bg-white border-b border-[#EAE5D9] sticky z-40 shadow-sm ${!storeStatus?.isOpen ? 'top-[40px]' : 'top-0'}`}>
          <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-2">
            <Link href="/menu" className="flex items-center gap-1 sm:gap-2 text-[#73706A] hover:text-[#114D3C] transition-colors font-bold text-sm shrink-0" style={{ fontFamily: "var(--font-outfit)" }}>
              <ChevronLeft className="w-5 h-5 shrink-0" /> 
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="font-bold text-[#114D3C] text-base sm:text-lg tracking-widest uppercase truncate text-center" style={{ fontFamily: "var(--font-outfit)" }}>
              Your Cart
            </div>
            <div className="w-10 flex justify-end shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#C19B6C]" />
            </div>
          </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-8 lg:pt-12">

        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#8B5E3C] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Review Order</h1>
          <p className="text-lg text-[#73706A]" style={{ fontFamily: "var(--font-outfit)" }}>You have {totalQuantity} items ready for checkout.</p>
        </div>

        {!storeStatus?.isOpen && storeStatus?.message && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <p className="font-bold font-outfit">{storeStatus.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left - Items */}
          <CartItems 
            items={items}
            calculateItemTotal={calculateItemTotal}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />

          {/* Right - Summary */}
          <CartSummary 
            items={items}
            subtotal={subtotal}
            storeStatus={storeStatus}
          />
        </div>
      </div>
    </div>
  )
}
