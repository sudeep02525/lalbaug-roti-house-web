import { Receipt, Loader2, CreditCard, ShieldCheck } from 'lucide-react'

export default function PaymentSummary({
  items,
  subtotal,
  deliveryCharge,
  grandTotal,
  storeStatus,
  handlePay,
  loading
}) {
  const originalSubtotal = items.reduce((sum, item) => {
    const basePrice = item.variant ? item.variant.price : item.product.price;
    const addonsPrice = (item.addons || []).reduce((addSum, add) => addSum + add.price, 0);
    return sum + ((basePrice + addonsPrice) * item.quantity);
  }, 0);
  const totalDiscount = originalSubtotal - subtotal;

  return (
    <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32">
      <div className="bg-[#FDFBF7] rounded-[2.5rem] p-8 lg:p-10 text-[#1A4D2E] shadow-sm relative overflow-hidden border border-[#E8E1D5]">

        <h3 className="text-3xl font-bold mb-8 relative z-10 text-[#8B5E3C]" style={{ fontFamily: "var(--font-playfair)" }}>Payment Summary</h3>
        
        <div className="space-y-4 relative z-10" style={{ fontFamily: "var(--font-outfit)" }}>
          <div className="flex justify-between text-[#73706A] pb-4">
            <span className="text-lg font-medium">Item Total</span>
            <span className="font-bold text-[#1A4D2E] text-lg">₹{originalSubtotal}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between items-center text-[#16A34A] pb-4">
              <span className="text-sm font-bold bg-[#16A34A]/10 px-2 py-1 rounded-md border border-[#16A34A]/20 uppercase tracking-widest">Discount Applied</span>
              <span className="font-bold text-lg">- ₹{totalDiscount}</span>
            </div>
          )}
          <div className="flex justify-between text-[#73706A] pb-4 border-b border-[#E8E1D5]/50">
            <span className="text-lg font-medium">Delivery Fee</span>
            <span className="font-bold text-[#1A4D2E] text-lg">₹{deliveryCharge}</span>
          </div>
          
          <div className="flex justify-between items-end pt-4 mb-6">
            <div className="flex flex-col">
              <span className="font-bold uppercase tracking-widest text-xs text-[#8B5E3C] mb-1">To Pay</span>
              <span className="font-bold text-5xl text-[#16A34A] tracking-tight">₹{grandTotal}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#E8E1D5] mb-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#1A4D2E]">
              <Receipt className="w-5 h-5 text-[#8B5E3C]" />
              <span className="font-bold text-sm tracking-wide">Pay Online (Razorpay)</span>
            </div>
          </div>
        </div>

        <div className="mt-8 relative z-10">
          {!storeStatus?.isOpen ? (
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 bg-gray-400 text-white py-5 rounded-2xl font-bold text-xl cursor-not-allowed"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Store Closed
            </button>
          ) : (
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#1A4D2E] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#0B382B] transition-all duration-300 shadow-[0_8px_25px_rgba(26,77,46,0.35)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(26,77,46,0.45)] disabled:opacity-50 disabled:transform-none"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {loading ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
              ) : (
                <><CreditCard className="w-6 h-6" /> Pay ₹{grandTotal}</>
              )}
            </button>
          )}
          <div className="flex items-center justify-center gap-2 text-[#8B5E3C]/80 text-xs font-bold uppercase tracking-widest mt-6" style={{ fontFamily: "var(--font-outfit)" }}>
            <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" /> 100% Safe & Secure
          </div>
        </div>
      </div>
    </div>
  )
}
