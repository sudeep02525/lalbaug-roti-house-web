import Link from "next/link"
import ProductCard from '@/components/ProductCard'
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

export default function MenuCarousel({ combos, bestsellers }) {
  const bestsellersRef = useRef(null)
  
  const scrollBestsellers = (dir) => {
    if (bestsellersRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 276 : 304;
      bestsellersRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* ── DAILY COMBOS ── */}
      <section className="bg-[#F2ECE4] py-24 border-y border-[#E6DCCF]">
        <div className="container max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-12 h-[2px] bg-[#16A34A]"></span>
                <span className="text-sm font-bold text-[#16A34A] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Complete Meals</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-playfair)" }}>Daily Combo Meals</h2>
            </div>
            <Link
              href="/menu?cat=Daily Combo"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#114D3C] font-bold rounded-full border border-[#E6DCCF] hover:bg-[#114D3C] hover:text-white transition-all shadow-sm"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              See All Combos
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {combos.map((item) => (
              <div key={item.id} className="h-fit">
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIGNATURE BESTSELLERS ── */}
      <section className="bg-white py-24 relative">
        <div className="container max-w-7xl">
          <div className="flex items-center justify-between mb-16">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-12 h-[2px] bg-[#16A34A]"></span>
                <span className="text-sm font-bold text-[#16A34A] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Crowd Favorites</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-playfair)" }}>Signature Bestsellers</h2>
            </div>
            
            {/* Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => scrollBestsellers('left')} className="w-12 h-12 rounded-full bg-white border border-[#E6DCCF] flex items-center justify-center text-[#114D3C] hover:bg-[#F2ECE4] transition-colors shadow-sm">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={() => scrollBestsellers('right')} className="w-12 h-12 rounded-full bg-white border border-[#E6DCCF] flex items-center justify-center text-[#114D3C] hover:bg-[#F2ECE4] transition-colors shadow-sm">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div 
            ref={bestsellersRef}
            className="flex items-start overflow-x-auto gap-4 sm:gap-6 pb-8 pt-4 -mx-4 px-4 sm:-mx-8 sm:px-8 xl:-mx-12 xl:px-12 hide-scrollbar scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {bestsellers.map((item) => (
              <div key={item.id} className="shrink-0 w-[260px] sm:w-[280px]">
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
