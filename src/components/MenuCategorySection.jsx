import { useRef } from 'react'
import { Leaf, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function MenuCategorySection({ category, items }) {
  const scrollRef = useRef(null)
  
  const scrollCategory = (dir) => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector('.shrink-0');
      if (card) {
        const gap = window.innerWidth < 640 ? 16 : 24;
        const scrollAmount = card.offsetWidth + gap;
        scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
      }
    }
  }

  if (items.length === 0) return null;
  return (
    <div id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`} className="mb-16 scroll-mt-32 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-[#EAE5D9] pb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#114D3C]/10 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-[#114D3C]" />
          </div>
          <h2 className="text-3xl font-bold text-[#114D3C] tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{category}</h2>
        </div>
        
        {/* Arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={() => scrollCategory('left')} className="w-10 h-10 rounded-full bg-white border border-[#EAE5D9] flex items-center justify-center text-[#114D3C] hover:bg-[#FAF8F5] transition-colors shadow-sm">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scrollCategory('right')} className="w-10 h-10 rounded-full bg-white border border-[#EAE5D9] flex items-center justify-center text-[#114D3C] hover:bg-[#FAF8F5] transition-colors shadow-sm">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll List (Perfectly fits 4 items on desktop) */}
      <div 
        ref={scrollRef}
        className="flex items-start overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-8 pt-4 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 hide-scrollbar scroll-smooth" 
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {items.map(item => (
          <div key={item.id} className="shrink-0 snap-start scroll-ml-4 sm:scroll-ml-8 lg:scroll-ml-0 w-[85vw] sm:w-[calc(50vw-48px)] md:w-[calc(33vw-48px)] lg:w-[calc((100%-72px)/4)]">
            <ProductCard item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}
