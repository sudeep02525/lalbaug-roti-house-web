"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { Leaf, ChevronLeft, ShoppingCart, CreditCard, Check, ShieldCheck, Clock, Award, Info, Flame, Droplets, Plus } from "lucide-react"
import Link from "next/link"
import axios from "axios"

import { getImageUrl } from '@/components/ProductCard'

const FOOD_IMG = "/images/indian_roti_meal.png"

export default function ProductDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart, items, removeFromCart } = useCart()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // State
  const [selectedAddons, setSelectedAddons] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [initializedFromCart, setInitializedFromCart] = useState(false)

  const toggleAddon = (addon) => {
    setSelectedAddons(prev =>
      prev.some(a => a._id === addon._id)
        ? prev.filter(a => a._id !== addon._id)
        : [...prev, addon]
    )
  }

  // Variant parsing
  const singleVariant = product?.variants?.find(v => v.minQuantity === 1)
  const packVariant = product?.variants?.find(v => v.minQuantity > 1)
  
  const price = singleVariant ? singleVariant.price : null
  const packPrice = packVariant ? packVariant.price : null
  const packQty = packVariant ? packVariant.minQuantity : null

  // Price Calculation
  let originalTotal = (price || 0) * quantity
  let productTotal = originalTotal

  if (price !== null && packPrice && packQty) {
    const packs = Math.floor(quantity / packQty)
    const singles = quantity % packQty
    productTotal = (packs * packPrice) + (singles * price)
  } else if (price === null && packPrice) {
    productTotal = packPrice * quantity
    originalTotal = productTotal
  }

  const discountAmt = originalTotal - productTotal
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0) * quantity
  const totalPrice = productTotal + addonsTotal

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/catalog/products/${id}`, { validateStatus: () => true })
        const data = res.data
        if (data.success && data.data) {
          setProduct(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch product", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  useEffect(() => {
    if (product && items && !initializedFromCart) {
      const existingItems = items.filter(i => i.product.id === (product._id || product.id || id))
      if (existingItems.length > 0) {
        const totalQty = existingItems.reduce((sum, i) => sum + i.quantity, 0)
        setQuantity(totalQty)
        setSelectedAddons(existingItems[0].addons || [])
      }
      setInitializedFromCart(true)
    }
  }, [product, items, id, initializedFromCart])

  const handleAddToCart = () => {
    if (!product) return

    // Remove existing items for this product to replace them with the new configuration
    const existingItems = items.filter(i => i.product.id === (product.id || product._id || id))
    existingItems.forEach(i => removeFromCart(i.cartItemId))

    const cartItem = {
      id: product.id || product._id || id,
      name: product.name,
      price: price,
      packPrice: packPrice,
      packQty: packQty,
      singleVariantId: singleVariant?._id,
      packVariantId: packVariant?._id,
      image: product.images?.[0] || FOOD_IMG,
      category: product.categoryId?.name || ""
    }

    const variantObj = price !== null && singleVariant 
      ? { id: singleVariant._id, name: singleVariant.name, price: price } 
      : packVariant ? { id: packVariant._id, name: packVariant.name, price: packPrice } : null

    addToCart(cartItem, quantity, variantObj, selectedAddons)
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleProceedToPay = () => {
    handleAddToCart()
    if (!user) {
      router.push('/signup?redirect=/checkout')
    } else {
      router.push('/checkout')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 bg-[#FAF8F5] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#114D3C] font-bold text-xl font-outfit">Loading premium details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 bg-[#FAF8F5] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-[#114D3C] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Product Not Found</h1>
        <p className="text-[#2C3E35] opacity-70 mb-8" style={{ fontFamily: "var(--font-outfit)" }}>We couldn't find the product you're looking for.</p>
        <Link href="/menu" className="bg-[#114D3C] text-white px-8 py-3 rounded-full font-bold hover:bg-[#0B382B] transition-colors">
          Back to Menu
        </Link>
      </div>
    )
  }

  const imageSrc = product.images?.[0] || FOOD_IMG
  const catName = product.categoryId?.name || "Premium Item"

  // Professional dummy details based on category
  const hash = id.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
  const nutritionFacts = {
    cal: 150 + Math.abs(hash % 300),
    protein: 2 + Math.abs(hash % 10),
    carbs: 15 + Math.abs(hash % 40),
  }

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        footer {
          display: none !important;
        }
      `}</style>
      
      {/* Mobile Header (Back button & Category) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#EAE5D9] px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FAF8F5] text-[#114D3C] shadow-sm border border-[#EAE5D9]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-xs font-bold text-[#C19B6C] uppercase tracking-widest" style={{ fontFamily: "var(--font-outfit)" }}>
          {catName}
        </div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Side: Premium Image Area */}
        <div className="lg:w-1/2 lg:fixed lg:top-0 lg:bottom-0 lg:left-0 bg-[#114D3C] relative overflow-hidden flex flex-col h-[50vh] lg:h-full">
          
          {/* Back button for Desktop */}
          <button 
            onClick={() => router.back()} 
            className="hidden lg:flex absolute top-8 left-8 items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-[#114D3C] transition-all shadow-md z-30 font-bold border border-white/30"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Menu
          </button>
          
          {/* Premium Food Image (Object Cover) */}
          <div className="absolute inset-0 z-10">
            <img 
              src={getImageUrl(imageSrc)} 
              alt={product.name} 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Elegant Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>

          {/* Image Overlay Content (Bottom Left) */}
          <div className="relative z-20 mt-auto p-6 lg:p-12 pb-10">
            <div className="inline-flex items-center gap-2 bg-[#16A34A] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <Leaf className="w-3 h-3" />
              100% Pure Veg
            </div>
            <h2 className="text-white text-3xl lg:text-5xl font-bold leading-tight mb-2 drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
              {product.name}
            </h2>
            <div className="flex items-center gap-6 text-white/90">
              <span className="flex items-center gap-2 text-sm font-medium" style={{ fontFamily: "var(--font-outfit)" }}>
                <Clock className="w-4 h-4 text-[#C19B6C]" /> Prep time: 10-15 mins
              </span>
              <span className="flex items-center gap-2 text-sm font-medium" style={{ fontFamily: "var(--font-outfit)" }}>
                <Award className="w-4 h-4 text-[#C19B6C]" /> Premium Quality
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Product Details */}
        <div className="lg:w-1/2 lg:ml-[50%] bg-[#FAF8F5] px-6 py-8 lg:p-16 xl:p-20 pb-48 lg:pb-24">
          <div className="max-w-2xl mx-auto lg:mx-0 bg-white rounded-3xl p-6 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-[#EAE5D9]">
            
            {/* Tab Navigation */}
            <div className="flex items-center gap-6 border-b border-[#EAE5D9] mb-8 pb-4">
              <button 
                onClick={() => setActiveTab('description')}
                className={`text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'description' ? 'text-[#114D3C]' : 'text-[#A09D96] hover:text-[#73706A]'}`}
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Description
                {activeTab === 'description' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#16A34A]" />}
              </button>
              <button 
                onClick={() => setActiveTab('ingredients')}
                className={`text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'ingredients' ? 'text-[#114D3C]' : 'text-[#A09D96] hover:text-[#73706A]'}`}
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Details
                {activeTab === 'ingredients' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#16A34A]" />}
              </button>
            </div>

            {/* Tab Content */}
            <div className="mb-10 min-h-[120px]">
              {activeTab === 'description' && (
                <div className="animate-fade-in">
                  <p className="text-[#4A5568] text-lg leading-relaxed" style={{ fontFamily: "var(--font-outfit)" }}>
                    {product.description || "A delicious and wholesome meal prepared with fresh ingredients and authentic spices. Perfect for your daily cravings."}
                  </p>
                  
                  {/* Nutritional Info Badges */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <div className="flex items-center gap-3 bg-[#FAF8F5] px-4 py-3 rounded-2xl border border-[#EAE5D9]">
                      <div className="w-8 h-8 rounded-full bg-[#16A34A]/10 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-[#16A34A]" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-[#73706A]">Calories</p>
                        <p className="text-sm font-bold text-[#114D3C]">{nutritionFacts.cal} kcal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-[#FAF8F5] px-4 py-3 rounded-2xl border border-[#EAE5D9]">
                      <div className="w-8 h-8 rounded-full bg-[#C19B6C]/10 flex items-center justify-center">
                        <Droplets className="w-4 h-4 text-[#C19B6C]" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-[#73706A]">Protein</p>
                        <p className="text-sm font-bold text-[#114D3C]">{nutritionFacts.protein}g</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'ingredients' && (
                <div className="animate-fade-in text-[#4A5568]" style={{ fontFamily: "var(--font-outfit)" }}>
                  <h4 className="font-bold text-[#114D3C] mb-3">Chef's Note</h4>
                  <p className="text-md leading-relaxed mb-6">
                    Our {product.name.toLowerCase()} is prepared daily in small batches to ensure maximum freshness. We source our grains, vegetables, and spices directly from premium local markets, ensuring an authentic taste that reminds you of home.
                  </p>
                  <h4 className="font-bold text-[#114D3C] mb-3">Allergen Information</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Prepared in a 100% vegetarian kitchen.</li>
                    <li>May contain traces of gluten or dairy depending on the item.</li>
                    <li>No artificial colors or preservatives added.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Removed Manual Variant Selection */}

            {/* Add-ons Section */}
            {(product.addons && product.addons.length > 0) && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#14452F] mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-outfit)" }}>
                  <Plus className="w-5 h-5 text-[#E8A359]" /> Add Extras
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.addons.map(addon => {
                    const isSelected = selectedAddons.some(a => a._id === addon._id)
                    return (
                      <label 
                        key={addon._id} 
                        className={`flex items-center gap-4 p-3 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-[#14452F] bg-[#14452F]/5' : 'border-[#EAE5D9] bg-white hover:border-[#14452F]/30 hover:bg-[#FAF8F5]'}`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'bg-[#14452F] border-[#14452F]' : 'border-2 border-[#C19B6C] bg-white'}`}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                        {addon.image && <img src={getImageUrl(addon.image)} alt={addon.name} className="w-10 h-10 rounded-xl object-cover border border-[#EAE5D9]" />}
                        <span className="text-[#2C3E35] flex-1 font-medium" style={{ fontFamily: "var(--font-outfit)" }}>{addon.name}</span>
                        <span className="text-[#E8A359] font-bold">+₹{addon.price}</span>
                        <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleAddon(addon)} />
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

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
            
          </div>
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

    </div>
  )
}
