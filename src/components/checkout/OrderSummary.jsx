import { getImageUrl } from '@/components/ProductCard'

export default function OrderSummary({ items, calculateItemTotal }) {
  return (
    <div className="lg:col-span-7 xl:col-span-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1A4D2E]" style={{ fontFamily: "var(--font-playfair)" }}>Review Order</h1>
        <span className="bg-[#FDFBF7] text-[#8B5E3C] font-bold px-4 py-2 rounded-xl text-sm border border-[#E8E1D5]" style={{ fontFamily: "var(--font-outfit)" }}>
          {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="bg-[#FDFBF7] rounded-[2.5rem] p-6 lg:p-10 shadow-sm border border-[#E8E1D5]">
        <div className="space-y-8">
          {items.map((item, index) => {
            const itemTotal = calculateItemTotal(item)
            const basePrice = item.variant ? item.variant.price : item.product.price
            const addonsPrice = item.addons?.reduce((sum, a) => sum + a.price, 0) || 0
            const originalTotal = (basePrice + addonsPrice) * item.quantity

            return (
              <div key={item.cartItemId} className={`flex gap-6 pb-8 ${index !== items.length - 1 ? 'border-b border-[#E8E1D5]' : ''}`}>
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[1.5rem] overflow-hidden border border-[#E8E1D5] bg-[#FAF5E9] shrink-0 relative group shadow-sm">
                  <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="font-bold text-[#1A4D2E] text-xl sm:text-2xl leading-tight mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{item.product.name}</h4>
                  {item.variant && <p className="text-xs sm:text-sm text-[#8B5E3C] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-outfit)" }}>{item.variant.name}</p>}
                  {item.addons?.length > 0 && (
                    <p className="text-xs sm:text-sm text-[#8B5E3C]/70 mb-2 font-medium" style={{ fontFamily: "var(--font-outfit)" }}>
                      With: {item.addons.map(a => a.name).join(', ')}
                    </p>
                  )}
                  <div className="mt-auto inline-flex items-center gap-2 bg-white border border-[#E8E1D5] px-3 py-1.5 rounded-lg w-fit shadow-sm">
                    <span className="text-[10px] text-[#73706A] uppercase tracking-widest font-bold" style={{ fontFamily: "var(--font-outfit)" }}>Qty:</span>
                    <span className="text-[#1A4D2E] font-bold text-base" style={{ fontFamily: "var(--font-outfit)" }}>{item.quantity}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-center">
                  {originalTotal > itemTotal && (
                    <span className="text-sm text-[#E8A359] line-through mb-1 font-medium" style={{ fontFamily: "var(--font-outfit)" }}>₹{originalTotal}</span>
                  )}
                  <span className="font-bold text-2xl sm:text-3xl text-[#1A4D2E] tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>₹{itemTotal}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
