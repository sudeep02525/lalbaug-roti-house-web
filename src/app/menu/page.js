"use client"
import { useState, Suspense, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Plus, Minus, Search, Leaf, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

import MenuCategorySection from '@/components/MenuCategorySection'
import ProductCard from '@/components/ProductCard'

function MenuContent() {
  const searchParams = useSearchParams()
  const initialCat = searchParams.get('cat') || 'All'
  const { storeStatus } = useCart()
  const [menuData, setMenuData] = useState({})
  const [loading, setLoading] = useState(true)
  const categories = ['All', ...Object.keys(menuData)]
  
  const [activeCategory, setActiveCategory] = useState(initialCat)
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/catalog/menu`, { validateStatus: () => true })
      .then(res => res.data)
      .then(data => {
        if(data.success) {
          setMenuData(data.data)
        }
      })
      .catch(err => console.error("Failed to load menu", err))
      .finally(() => setLoading(false))
  }, [])

  const getFilteredData = () => {
    let data = activeCategory === 'All' ? menuData : { [activeCategory]: menuData[activeCategory] || [] }
    if (search.trim()) {
      const q = search.toLowerCase()
      const filtered = {}
      for (const [cat, items] of Object.entries(data)) {
        const matched = items.filter(item => item.name.toLowerCase().includes(q) || item.desc?.toLowerCase().includes(q))
        if (matched.length > 0) filtered[cat] = matched
      }
      return filtered
    }
    return data
  }

  const filteredData = getFilteredData()

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat)
    if (cat !== 'All') {
      const el = document.getElementById(`category-${cat.replace(/\s+/g, '-').toLowerCase()}`)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-28">

      {loading ? (
        <div className="container max-w-7xl py-24 text-center">
          <div className="w-12 h-12 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#114D3C] font-bold text-xl font-outfit">Loading Fresh Menu...</p>
        </div>
      ) : (
        <>
          {/* Top header */}
      <div className="bg-white border-b border-[#EAE5D9] pt-8 pb-6">
        <div className="container max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-[1px] bg-[#C19B6C]"></span>
                <p className="text-xs font-bold text-[#C19B6C] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-outfit)" }}>Made Fresh Everyday</p>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#114D3C] tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Explore Our Menu</h1>
            </div>
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C19B6C]" />
              <input
                type="text"
                placeholder="Search for rotis, sabjis, thalis..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-base bg-[#FAF8F5] border border-[#EAE5D9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C19B6C]/50 focus:border-[#C19B6C] transition-all text-[#2C3E35]"
                style={{ fontFamily: "var(--font-outfit)" }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Category filter pills — horizontally scrollable & STICKY */}
      <div className={`sticky z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#EAE5D9] py-4 transition-all ${!storeStatus?.isOpen && storeStatus?.message ? 'top-[120px]' : 'top-[80px]'}`}>
        <div className="container max-w-7xl">
          <div
            className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-[#114D3C] text-white border-[#114D3C] shadow-md'
                    : 'bg-white text-[#73706A] border-[#EAE5D9] hover:border-[#114D3C] hover:text-[#114D3C]'
                }`}
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Rows (Grid Layout) */}
      <div className="container max-w-7xl py-12">
        {Object.keys(filteredData).length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[#EAE5D9]">
            <Leaf className="w-12 h-12 text-[#114D3C]/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#114D3C] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>No items found</h3>
            <p className="text-[#2C3E35] opacity-70" style={{ fontFamily: "var(--font-outfit)" }}>Try adjusting your search or category filter.</p>
          </div>
        ) : (
          Object.entries(filteredData).map(([cat, items]) => (
            <MenuCategorySection key={cat} category={cat} items={items} />
          ))
        )}
      </div>
      </>
      )}
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#114D3C] border-t-[#C19B6C] rounded-full animate-spin mb-4" />
        <p className="text-[#114D3C] font-bold tracking-widest uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Loading Menu...</p>
      </div>
    }>
      <MenuContent />
    </Suspense>
  )
}
