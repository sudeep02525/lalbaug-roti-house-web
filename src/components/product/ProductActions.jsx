import { ShoppingCart, Check, CreditCard } from 'lucide-react'

export default function ProductActions({ 
  quantity, 
  setQuantity, 
  discountAmt, 
  originalTotal, 
  addonsTotal, 
  totalPrice, 
  handleAddToCart, 
  addedToCart, 
  handleProceedToPay,
  items,
  product,
  id
}) {
  return (
    <>
      {/* Desktop Action Area */}
      <div className="hidden lg:block bg-[#FDFBF7] p-6 rounded-3xl text-[#114D3C] shadow-sm border border-[#E8E1D5]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-[#73706A] font-bold text-sm tracking-widest uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Quantity</span>
            <div className="flex items-center gap-4 bg-white p-1 rounded-full border border-[#E8E1D5] shadow-sm">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#114D3C] hover:bg-[#FAF8F5] transition-colors text-xl font-medium"
              >-</button>
              <span className="w-6 text-center font-bold text-xl">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#114D3C] hover:bg-[#FAF8F5] transition-colors text-xl font-medium"
              >+</button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#73706A] font-bold mb-1 tracking-widest uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Total Price</p>
            <div className="flex flex-col items-end">
              {discountAmt > 0 && (
                <span className="text-sm font-bold bg-[#16A34A] text-white px-2 py-0.5 rounded-md mb-1 uppercase tracking-wider text-[10px]">
                  ₹{discountAmt} Discount
                </span>
              )}
              <div className="flex items-center gap-2">
                {discountAmt > 0 && (
                  <span className="text-lg font-bold text-gray-400 line-through">₹{originalTotal + addonsTotal}</span>
                )}
                <p className="text-4xl font-bold text-[#16A34A]">₹{totalPrice}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2 ${
              addedToCart 
                ? 'bg-[#16A34A] border-[#16A34A] text-white shadow-[0_8px_20px_rgba(22,163,74,0.3)]'
                : 'bg-white border-[#114D3C] text-[#114D3C] hover:bg-[#FAF8F5] shadow-sm'
            }`}
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {addedToCart ? (
              <><Check className="w-5 h-5" /> Saved to Cart</>
            ) : (
              <><ShoppingCart className="w-5 h-5" /> {items.some(i => i.product.id === (product.id || product._id || id)) ? 'Update Cart' : 'Add to Cart'}</>
            )}
          </button>
          <button
            onClick={handleProceedToPay}
            className="flex-1 flex items-center justify-center gap-2 bg-[#C19B6C] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#A9845B] transition-all shadow-[0_8px_25px_rgba(193,155,108,0.35)]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            <CreditCard className="w-5 h-5" />
            Proceed to Pay
          </button>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAE5D9] p-4 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 bg-[#FAF8F5] border border-[#EAE5D9] p-1 rounded-full">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#114D3C] hover:bg-white transition-colors text-xl font-medium"
            >-</button>
            <span className="w-6 text-center font-bold text-[#114D3C]">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#114D3C] hover:bg-white transition-colors text-xl font-medium"
            >+</button>
          </div>
          <div className="text-right">
              <div className="flex flex-col items-end">
                {discountAmt > 0 && (
                  <span className="text-[10px] font-bold bg-[#16A34A] text-white px-1.5 py-0.5 rounded-md mb-0.5 uppercase tracking-wider">
                    ₹{discountAmt} Off
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  {discountAmt > 0 && (
                    <span className="text-sm font-bold text-gray-400 line-through">₹{originalTotal + addonsTotal}</span>
                  )}
                  <p className="text-2xl font-bold text-[#16A34A]">₹{totalPrice}</p>
                </div>
              </div>
        </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            className={`w-[4.5rem] flex-shrink-0 flex items-center justify-center rounded-2xl border-2 transition-all ${
              addedToCart
                ? 'bg-[#16A34A] border-[#16A34A] text-white'
                : 'bg-white border-[#114D3C] text-[#114D3C]'
            }`}
          >
            {addedToCart ? <Check className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
          </button>
          <button
            onClick={handleProceedToPay}
            className="flex-1 flex items-center justify-center gap-2 bg-[#114D3C] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#0B382B] transition-all shadow-[0_8px_20px_rgba(17,77,60,0.3)]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </>
  )
}
