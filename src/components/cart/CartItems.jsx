import { Plus, Minus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { getImageUrl } from '@/components/ProductCard'

export default function CartItems({ items, calculateItemTotal, updateQuantity, removeFromCart }) {
  return (
    <div className="lg:col-span-7 space-y-4">
      {items.map((item) => {
        const itemTotal = calculateItemTotal(item)
        
        // Base price calculation for UI comparison
        const basePrice = item.variant ? item.variant.price : item.product.price
        const addonsPrice = (item.addons || []).reduce((sum, a) => sum + (a.price * (a.quantity || 1)), 0)
        const originalTotal = (basePrice * item.quantity) + addonsPrice

        return (
          <div key={item.cartItemId} className="bg-white rounded-3xl border border-[#EAE5D9] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] group">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Image */}
              <div className="w-full sm:w-28 h-40 sm:h-28 rounded-2xl overflow-hidden bg-[#FAF8F5] shrink-0 relative">
                <img
                  src={getImageUrl(item.product.image)}
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
                        {item.addons.map((a, idx) => (
                          <span key={a._id || a.id || idx} className="inline-block text-[10px] font-bold bg-[#FAF8F5] border border-[#EAE5D9] text-[#73706A] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            + {a.name} {a.quantity && a.quantity > 1 ? `x${a.quantity}` : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    {originalTotal > itemTotal && (
                      <span className="text-sm text-[#E8A359] line-through mb-1 font-medium" style={{ fontFamily: "var(--font-outfit)" }}>₹{originalTotal}</span>
                    )}
                    <span className="font-bold text-[#114D3C] text-2xl tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>₹{itemTotal}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-white border border-[#EAE5D9] rounded-full p-1 shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-[#114D3C] hover:bg-[#FAF8F5] transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-base font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-outfit)" }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-[#114D3C] hover:bg-[#FAF8F5] transition-all"
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
  )
}
