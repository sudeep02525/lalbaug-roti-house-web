"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus, ChevronLeft, ShieldCheck } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeFromCart, subtotal, calculateItemTotal, mounted } = useCart()
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

      <div className="container mx-auto px-4 lg:px-8 pt-8 lg:pt-12">

        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#8B5E3C] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Review Order</h1>
          <p className="text-lg text-[#73706A]" style={{ fontFamily: "var(--font-outfit)" }}>You have {totalQuantity} items ready for checkout.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left - Items */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => {
              const itemTotal = calculateItemTotal(item)
              
              // Base price calculation for UI comparison
              const basePrice = item.variant ? item.variant.price : item.product.price
              const addonsPrice = item.addons.reduce((sum, a) => sum + a.price, 0)
              const originalTotal = (basePrice + addonsPrice) * item.quantity

              return (
                <div key={item.cartItemId} className="bg-white rounded-3xl border border-[#EAE5D9] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] group">
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Image */}
                    <div className="w-full sm:w-28 h-40 sm:h-28 rounded-2xl overflow-hidden bg-[#FAF8F5] shrink-0 relative">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent sm:hidden" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-4 mb-4 sm:mb-0">

                        <div>
                          <h3 className="font-bold text-[#114D3C] text-xl" style={{ fontFamily: "var(--font-playfair)" }}>{item.product.name}</h3>
                          {item.variant && (
                            <p className="text-sm text-[#16A34A] font-bold mt-1 tracking-widest uppercase" style={{ fontFamily: "var(--font-outfit)" }}>{item.variant.name}</p>
                          )}
                          {item.addons?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.addons.map(a => (
                                <span key={a.id} className="inline-block text-[10px] font-bold bg-[#FAF8F5] border border-[#EAE5D9] text-[#73706A] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  + {a.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          {originalTotal > itemTotal && (
                            <span className="text-[13px] text-[#73706A] line-through opacity-70 mb-0.5">₹{originalTotal}</span>
                          )}
                          <span className="font-bold text-[#114D3C] text-xl">₹{itemTotal}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-[#FAF8F5] border border-[#EAE5D9] rounded-full p-1">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-[#114D3C] hover:bg-white hover:shadow-sm transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-[#114D3C]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-[#114D3C] hover:bg-white hover:shadow-sm transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="flex items-center gap-1.5 text-xs font-bold text-[#73706A] hover:text-red-500 transition-colors uppercase tracking-widest"
                        >
                          <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#16A34A] hover:text-[#114D3C] transition-colors tracking-widest uppercase p-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              <Plus className="w-4 h-4" /> Add more items
            </Link>
          </div>

          {/* Right - Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#FDFBF7] border border-[#E8E1D5] rounded-[2.5rem] p-6 lg:p-8 text-[#114D3C] sticky top-24 shadow-sm relative overflow-hidden">
              <h2 className="font-bold text-2xl mb-6 font-playfair flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#8B5E3C]" /> Order Summary
              </h2>

              <div className="space-y-4 mb-6 font-outfit">
                <div className="flex justify-between text-[#73706A] text-lg font-medium">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span className="font-bold text-[#114D3C]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#73706A] text-lg font-medium">
                  <span>Delivery fee</span>
                  <span className="text-[#8B5E3C] font-bold text-sm tracking-widest uppercase flex items-center">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-[#E8E1D5] mt-6 pt-6 flex justify-between items-center mb-8">
                <span className="font-bold text-lg text-[#114D3C]/70 uppercase tracking-widest text-xs">Total Amount</span>
                <span className="font-bold text-4xl text-[#16A34A]">₹{subtotal}</span>
              </div>

              <Link href={user ? "/checkout" : "/signup?redirect=/checkout"}>
                <button
                  className="w-full flex items-center justify-center gap-3 bg-[#C19B6C] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#A9845B] transition-all shadow-[0_8px_25px_rgba(193,155,108,0.35)] hover:-translate-y-0.5"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
