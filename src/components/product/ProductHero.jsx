import { Leaf, Clock, Award, ChevronLeft } from 'lucide-react'
import { getImageUrl } from '@/components/ProductCard'

export default function ProductHero({ product, imageSrc, router }) {
  return (
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
  )
}
