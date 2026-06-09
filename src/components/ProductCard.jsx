"use client"
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Plus, Minus, Leaf } from 'lucide-react'
import Link from 'next/link'

const FOOD_IMG = "/images/indian_roti_meal.png"

export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('/uploads')) return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  return url;
}

export default function ProductCard({ item }) {
  const { items, addToCart, updateQuantity } = useCart()
  const hasVariants = !!(item.price && item.packPrice)
  const [selectedVariant, setSelectedVariant] = useState(item.packPrice ? 'pack' : 'single')
  const [selectedAddons, setSelectedAddons] = useState([])
  const [qty, setQty] = useState(1)
  const [showAddons, setShowAddons] = useState(false)

  const toggleAddon = (addon) =>
    setSelectedAddons(prev =>
      prev.some(a => a._id === addon._id)
        ? prev.filter(a => a._id !== addon._id)
        : [...prev, addon]
    )

  const handleAdd = (e) => {
    e?.preventDefault?.()
    if (item.price === null && item.packPrice) {
      const productObj = { ...item, price: item.packPrice, name: item.name + ` (Pack of ${item.packQty})` }
      const variantObj = { id: item.packVariantId || 'pack', name: `Pack of ${item.packQty}`, price: item.packPrice }
      addToCart(productObj, 1, variantObj, selectedAddons)
    } else {
      const productObj = { ...item, price: item.price }
      const variantObj = item.singleVariantId ? { id: item.singleVariantId, name: 'Single', price: item.price } : null
      addToCart(productObj, 1, variantObj, selectedAddons)
    }
    setSelectedAddons([])
    setShowAddons(false)
  }

  const cartItemsForProduct = items.filter(i => i.product.id === item.id)
  const totalQtyInCart = cartItemsForProduct.reduce((sum, i) => sum + i.quantity, 0)
  
  const displayQty = totalQtyInCart > 0 ? totalQtyInCart : 1;
  let originalTotal = (item.price || 0) * displayQty;
  let productTotal = originalTotal;
  
  if (item.price !== null && item.packPrice && item.packQty) {
    const packs = Math.floor(displayQty / item.packQty);
    const singles = displayQty % item.packQty;
    productTotal = (packs * item.packPrice) + (singles * item.price);
  } else if (item.price === null) {
    productTotal = item.packPrice * displayQty;
    originalTotal = productTotal;
  }
  
  // For the stepper, we will modify the first matching cart item
  const handleIncrement = (e) => {
    e?.preventDefault?.()
    if (cartItemsForProduct.length > 0) {
      const cartItem = cartItemsForProduct[0]
      updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)
    } else {
      handleAdd(e)
    }
  }

  const handleDecrement = (e) => {
    e?.preventDefault?.()
    if (cartItemsForProduct.length > 0) {
      const cartItem = cartItemsForProduct[0]
      updateQuantity(cartItem.cartItemId, cartItem.quantity - 1)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EAE5D9] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_-15px_rgba(22,163,74,0.2)] hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full w-full">
      {/* Image Container */}
      <Link href={`/product/${item.id}`} className="relative h-48 sm:h-52 w-full overflow-hidden shrink-0 border-b border-[#EAE5D9] bg-[#FAF8F5] block cursor-pointer transition-colors hover:bg-[#F3EFE6]">
        <img
          src={getImageUrl(item.image) || FOOD_IMG}
          alt={item.name}
          className="relative w-full h-full object-cover transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full border border-[#E6DCCF] flex items-center gap-1 shadow-sm z-10">
          <Leaf className="w-3 h-3 text-[#114D3C]" />
          <span className="text-[10px] font-bold text-[#114D3C] uppercase tracking-wider" style={{ fontFamily: "var(--font-outfit)" }}>Pure Veg</span>
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="mb-3">
          <Link href={`/product/${item.id}`} className="hover:text-[#16A34A] transition-colors">
            <h3 className="font-bold text-[#2C3E35] text-lg sm:text-xl leading-tight mb-1" style={{ fontFamily: "var(--font-outfit)" }}>{item.name}</h3>
          </Link>
          {(item.description || item.desc) && <p className="text-xs sm:text-sm text-[#73706A] line-clamp-2 leading-relaxed" style={{ fontFamily: "var(--font-outfit)" }}>{item.description || item.desc}</p>}
        </div>    
        <div className="mt-auto">

          {/* Add-ons Toggle */}
          {(item.addons && item.addons.length > 0) && (
            <button 
              onClick={(e) => { e.preventDefault(); setShowAddons(!showAddons); }}
              className="text-xs text-[#16A34A] font-bold mb-3 flex items-center gap-1 hover:underline"
            >
              {showAddons ? <Minus className="w-3 h-3"/> : <Plus className="w-3 h-3"/>}
              {showAddons ? 'Hide Add-ons' : 'Add Extras'}
            </button>
          )}

          {/* Add-ons List */}
          {showAddons && (item.addons && item.addons.length > 0) && (
            <div className="flex flex-col gap-2 mb-4 bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE5D9]">
              {item.addons.map(addon => {
                const isSelected = selectedAddons.some(a => a._id === addon._id)
                return (
                  <label key={addon._id} className="flex items-center gap-3 text-sm cursor-pointer group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'bg-[#114D3C] border-[#114D3C]' : 'border-[#C19B6C] bg-white group-hover:border-[#114D3C]'}`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                    {addon.image && <img src={getImageUrl(addon.image)} alt={addon.name} className="w-8 h-8 rounded-md object-cover border border-[#EAE5D9]" />}
                    <span className="text-[#2C3E35] flex-1 text-[13px] font-medium leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>{addon.name}</span>
                    <span className="text-[#114D3C] font-bold text-xs whitespace-nowrap">+₹{addon.price}</span>
                    <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleAddon(addon)} />
                  </label>
                )
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-[#EAE5D9]/50 mt-auto min-h-[3rem]">
             <div className="flex flex-col gap-0.5" style={{ fontFamily: "var(--font-outfit)" }}>
               {item.price === null ? (
                 <span className="text-[15px] font-bold text-[#114D3C]">₹{productTotal} / {item.packQty * displayQty} Pcs</span>
               ) : (
                 <>
                   <div className="flex items-baseline gap-1">
                     <span className="text-[16px] font-bold text-[#114D3C] tracking-tight">₹{productTotal}</span>
                     <span className="text-[12px] font-medium text-[#73706A]">/ {displayQty} Pc{displayQty > 1 ? 's' : ''}</span>
                   </div>
                   {item.packPrice && (
                     totalQtyInCart >= item.packQty ? (
                       <div className="flex items-center gap-1.5 mt-0.5 animate-[pulse_2s_ease-in-out_infinite]">
                         <span className="text-[10px] text-white font-bold bg-gradient-to-r from-[#16A34A] to-[#114D3C] px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                           ₹{originalTotal - productTotal} DISCOUNT
                         </span>
                         {originalTotal > productTotal && (
                           <span className="text-[11px] text-[#73706A] line-through font-medium opacity-80">₹{originalTotal}</span>
                         )}
                       </div>
                     ) : (
                       <span className="text-[10px] text-[#16A34A] font-bold bg-[#16A34A]/10 px-1.5 py-0.5 rounded uppercase tracking-wider w-fit mt-0.5">
                         Buy {item.packQty} for ₹{item.packPrice}
                       </span>
                     )
                   )}
                 </>
               )}
             </div>
             
             {totalQtyInCart > 0 ? (
                <div className="flex items-center bg-[#FAF8F5] border border-[#16A34A] rounded-lg h-9 shadow-sm overflow-hidden">
                  <button 
                    onClick={handleDecrement} 
                    className="w-8 h-full flex items-center justify-center text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-[#114D3C] min-w-[1.5rem] text-center" style={{ fontFamily: "var(--font-outfit)" }}>
                    {totalQtyInCart}
                  </span>
                  <button 
                    onClick={handleIncrement} 
                    className="w-8 h-full flex items-center justify-center text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAdd}
                  className="flex items-center justify-center gap-1.5 bg-white text-[#16A34A] border border-[#16A34A] text-[15px] font-bold px-3 py-2 rounded-lg hover:bg-[#16A34A] hover:text-white transition-colors shadow-sm"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  ADD
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
