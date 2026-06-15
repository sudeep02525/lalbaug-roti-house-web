import { Plus } from 'lucide-react'
import { getImageUrl } from '@/components/ProductCard'

export default function ProductAddons({ product, selectedAddons, updateAddonQuantity }) {
  if (!product.addons || product.addons.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-[#14452F] mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-outfit)" }}>
        <Plus className="w-5 h-5 text-[#E8A359]" /> Add Extras
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {product.addons.map(addon => {
          const selectedAddon = selectedAddons.find(a => a._id === addon._id)
          const isSelected = !!selectedAddon
          const addonQty = selectedAddon ? (selectedAddon.quantity || 1) : 0
          return (
            <div 
              key={addon._id} 
              className={`flex items-center justify-between gap-3 p-3 rounded-2xl border-2 transition-all ${isSelected ? 'border-[#14452F] bg-[#14452F]/5' : 'border-[#EAE5D9] bg-white hover:border-[#14452F]/30 hover:bg-[#FAF8F5]'}`}
            >
              <div className="flex items-center gap-3">
                {addon.image && <img src={getImageUrl(addon.image)} alt={addon.name} className="w-10 h-10 rounded-xl object-cover border border-[#EAE5D9]" />}
                <div>
                  <span className="text-[#2C3E35] font-medium block" style={{ fontFamily: "var(--font-outfit)" }}>{addon.name}</span>
                  <span className="text-[#E8A359] font-bold text-sm">+₹{addon.price}</span>
                </div>
              </div>
              
              {isSelected ? (
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-[#14452F]/20">
                  <button 
                    onClick={() => updateAddonQuantity(addon, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-[#FAF8F5] text-[#14452F] hover:bg-[#14452F]/10 font-bold"
                  >-</button>
                  <span className="w-4 text-center font-bold text-[#14452F] text-sm">{addonQty}</span>
                  <button 
                    onClick={() => updateAddonQuantity(addon, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-[#FAF8F5] text-[#14452F] hover:bg-[#14452F]/10 font-bold"
                  >+</button>
                </div>
              ) : (
                <button 
                  onClick={() => updateAddonQuantity(addon, 1)}
                  className="px-4 py-1.5 rounded-lg border-2 border-[#14452F] text-[#14452F] font-bold text-xs hover:bg-[#14452F] hover:text-white transition-colors uppercase tracking-wider"
                >
                  Add
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
