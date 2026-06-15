"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import axios from "axios"

import ProductHero from "@/components/product/ProductHero"
import ProductDetails from "@/components/product/ProductDetails"
import ProductAddons from "@/components/product/ProductAddons"
import ProductActions from "@/components/product/ProductActions"

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

  const updateAddonQuantity = (addon, delta) => {
    setSelectedAddons(prev => {
      const existing = prev.find(a => a._id === addon._id);
      if (existing) {
        const newQty = (existing.quantity || 1) + delta;
        if (newQty <= 0) {
          return prev.filter(a => a._id !== addon._id);
        }
        return prev.map(a => a._id === addon._id ? { ...a, quantity: newQty } : a);
      } else if (delta > 0) {
        return [...prev, { ...addon, quantity: 1 }];
      }
      return prev;
    });
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
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + (a.price * (a.quantity || 1)), 0)
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
        
        <ProductHero product={product} imageSrc={imageSrc} router={router} />

        {/* Right Side: Professional Product Details */}
        <div className="lg:w-1/2 lg:ml-[50%] bg-[#FAF8F5] px-6 py-8 lg:p-16 xl:p-20 pb-48 lg:pb-24">
          <div className="max-w-2xl mx-auto lg:mx-0 bg-white rounded-3xl p-6 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-[#EAE5D9]">
            
            <ProductDetails 
              product={product} 
              nutritionFacts={nutritionFacts} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />

            <ProductAddons 
              product={product} 
              selectedAddons={selectedAddons} 
              updateAddonQuantity={updateAddonQuantity} 
            />

            <ProductActions 
              quantity={quantity} 
              setQuantity={setQuantity} 
              discountAmt={discountAmt} 
              originalTotal={originalTotal} 
              addonsTotal={addonsTotal} 
              totalPrice={totalPrice} 
              handleAddToCart={handleAddToCart} 
              addedToCart={addedToCart} 
              handleProceedToPay={handleProceedToPay} 
              items={items}
              product={product}
              id={id}
            />
            
          </div>
        </div>
      </div>
    </div>
  )
}
