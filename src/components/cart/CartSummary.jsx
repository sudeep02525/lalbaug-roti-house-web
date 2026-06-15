import { ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CartSummary({ items, subtotal, storeStatus }) {
  const originalSubtotal = items.reduce((sum, item) => {
    const basePrice = item.variant ? item.variant.price : item.product.price;
    const addonsPrice = (item.addons || []).reduce((addSum, add) => addSum + (add.price * (add.quantity || 1)), 0);
    return sum + (basePrice * item.quantity) + addonsPrice;
  }, 0);
  const totalDiscount = originalSubtotal - subtotal;

  return (
    <div className="lg:col-span-5">
      <div className="bg-[#FDFBF7] border border-[#E8E1D5] rounded-[2.5rem] p-6 lg:p-8 text-[#114D3C] sticky top-24 shadow-sm relative overflow-hidden">
        <h2 className="font-bold text-2xl mb-6 font-playfair flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#8B5E3C]" /> Order Summary
        </h2>

        <div className="space-y-4 mb-6" style={{ fontFamily: "var(--font-outfit)" }}>
          <div className="flex justify-between text-[#73706A] pb-4">
            <span className="text-lg font-medium">Item Total</span>
            <span className="font-bold text-[#114D3C] text-lg">₹{originalSubtotal}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between items-center text-[#16A34A] pb-4">
              <span className="text-sm font-bold bg-[#16A34A]/10 px-2 py-1 rounded-md border border-[#16A34A]/20 uppercase tracking-widest">Discount Applied</span>
              <span className="font-bold text-lg">- ₹{totalDiscount}</span>
            </div>
          )}
          <div className="flex justify-between text-[#73706A] pb-4 border-b border-[#E8E1D5]/50">
            <span className="text-lg font-medium">Delivery fee</span>
            <span className="text-[#8B5E3C] font-bold text-sm tracking-widest uppercase flex items-center">Calculated at checkout</span>
          </div>
          <div className="flex justify-between items-end pt-4 mb-2">
            <div className="flex flex-col">
              <span className="font-bold uppercase tracking-widest text-xs text-[#8B5E3C] mb-1">Subtotal</span>
              <span className="font-bold text-5xl text-[#16A34A] tracking-tight">₹{subtotal}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E8E1D5] mt-6 pt-6 flex justify-between items-center mb-8">
          <span className="font-bold text-lg text-[#114D3C]/70 uppercase tracking-widest text-xs">Total Amount</span>
          <span className="font-bold text-4xl text-[#16A34A]">₹{subtotal}</span>
        </div>

        {!storeStatus?.isOpen ? (
          <button
            disabled
            className="w-full flex items-center justify-center gap-3 bg-gray-400 text-white py-5 rounded-2xl font-bold text-xl cursor-not-allowed"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Store Closed
          </button>
        ) : (
          <Link href="/checkout">
            <button
              className="w-full flex items-center justify-center gap-3 bg-[#1A4D2E] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#0B382B] transition-all duration-300 shadow-[0_8px_25px_rgba(26,77,46,0.35)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(26,77,46,0.45)]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
