import { useCallback, useEffect, useState } from 'react'
import { Leaf, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import { motion } from 'framer-motion'

export default function MenuCategorySection({ category, items }) {
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

  if (items.length === 0) return null;
  
  const isScrollable = prevBtnEnabled || nextBtnEnabled;

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
        {isScrollable && (
          <div className="hidden sm:flex items-center gap-2">
            <button 
              onClick={scrollPrev} 
              disabled={!prevBtnEnabled}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${prevBtnEnabled ? 'bg-white border border-[#EAE5D9] text-[#114D3C] hover:bg-[#FAF8F5] active:scale-95' : 'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollNext} 
              disabled={!nextBtnEnabled}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${nextBtnEnabled ? 'bg-white border border-[#EAE5D9] text-[#114D3C] hover:bg-[#FAF8F5] active:scale-95' : 'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Embla Carousel */}
      <div className="overflow-hidden -mx-4 px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 py-4" ref={emblaRef}>
        <div className="flex -ml-4 sm:-ml-6 items-start">
          {items.map((item, index) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
              className="flex-[0_0_calc(85vw+16px)] sm:flex-[0_0_50%] md:flex-[0_0_33.333333%] lg:flex-[0_0_25%] min-w-0 pl-4 sm:pl-6"
            >
              <ProductCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
