import Link from "next/link"
import ProductCard from '@/components/ProductCard'
import ProductCardSkeleton from '@/components/ProductCardSkeleton'
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/Skeleton"
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import { motion } from 'framer-motion'

export default function MenuCarousel({ combos, bestsellers, isLoading }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    skipSnaps: false,
    inViewThreshold: 0.7
  }, [WheelGesturesPlugin({
    forceWheelAxis: 'x',
  })])
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  const isScrollable = prevBtnEnabled || nextBtnEnabled;

  return (
    <>
      {/* ── DAILY COMBOS ── */}
      <section className="bg-[#F2ECE4] py-24 border-y border-[#E6DCCF]">
        <div className="container max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-32 mb-3 rounded-md" />
                  <Skeleton className="h-10 lg:h-12 w-64 rounded-lg" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="w-12 h-[2px] bg-[#16A34A]"></span>
                    <span className="text-sm font-bold text-[#16A34A] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Complete Meals</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-playfair)" }}>Daily Combo Meals</h2>
                </>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-12 w-40 rounded-full" />
            ) : (
              <Link
                href="/menu?cat=Daily Combo"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#114D3C] font-bold rounded-full border border-[#E6DCCF] hover:bg-[#114D3C] hover:text-white transition-all shadow-sm"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                See All Combos
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-fit">
                  <ProductCardSkeleton />
                </div>
              ))
            ) : combos.length > 0 ? (
              combos.map((item, index) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.4) }}
                  className="h-fit"
                >
                  <ProductCard item={item} />
                </motion.div>
              ))
            ) : (
              <p className="text-[#73706A] col-span-full">No daily combos available right now.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── SIGNATURE BESTSELLERS ── */}
      <section className="bg-white py-24 relative">
        <div className="container max-w-7xl">
          <div className="flex items-center justify-between mb-16">
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-32 mb-3 rounded-md" />
                  <Skeleton className="h-10 lg:h-12 w-64 rounded-lg" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="w-12 h-[2px] bg-[#16A34A]"></span>
                    <span className="text-sm font-bold text-[#16A34A] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Crowd Favorites</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-playfair)" }}>Signature Bestsellers</h2>
                </>
              )}
            </div>
            
            {/* Arrows */}
            {isLoading ? (
              <div className="hidden sm:flex items-center gap-2">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-12 h-12 rounded-full" />
              </div>
            ) : isScrollable ? (
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  onClick={scrollPrev} 
                  disabled={!prevBtnEnabled}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${prevBtnEnabled ? 'bg-white border border-[#EAE5D9] text-[#114D3C] hover:bg-[#F2ECE4] active:scale-95' : 'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed'}`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={scrollNext} 
                  disabled={!nextBtnEnabled}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${nextBtnEnabled ? 'bg-white border border-[#EAE5D9] text-[#114D3C] hover:bg-[#F2ECE4] active:scale-95' : 'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed'}`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Embla Carousel */}
          <div className="overflow-hidden -mx-4 px-4 sm:-mx-8 sm:px-8 xl:-mx-12 xl:px-12 py-4" ref={emblaRef}>
            <div className="flex -ml-4 sm:-ml-6 items-start">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="flex-[0_0_calc(260px+16px)] sm:flex-[0_0_calc(280px+24px)] min-w-0 pl-4 sm:pl-6">
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : bestsellers.length > 0 ? (
                bestsellers.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
                    className="flex-[0_0_calc(260px+16px)] sm:flex-[0_0_calc(280px+24px)] min-w-0 pl-4 sm:pl-6"
                  >
                    <ProductCard item={item} />
                  </motion.div>
                ))
              ) : (
                <p className="text-[#73706A]">No bestsellers available right now.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
