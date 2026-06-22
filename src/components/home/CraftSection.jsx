import Link from "next/link"
import { ChefHat, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/Skeleton"

const KITCHEN_IMG = "/images/dough_preparation.png"

export default function CraftSection({ settings, isWheatFront, currentCraftImageIndex, isLoading }) {
  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[400px] sm:h-[500px] w-full group">
              <Skeleton className="absolute inset-0 rounded-[2rem] w-full h-full" />
              <div className="absolute -bottom-8 -right-4 sm:-right-8 z-30 bg-white p-5 sm:p-6 rounded-3xl shadow-[0_10px_40px_rgba(22,163,74,0.15)] border border-[#EAE5D9]">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-2 w-12" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-16 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-6 w-32 mt-6" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-white">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[400px] sm:h-[500px] w-full group">
            {/* Front Image (First uploaded image) */}
            <div className={`absolute inset-0 rounded-[2rem] overflow-hidden transition-all duration-1000 ease-in-out ${isWheatFront ? 'z-20 shadow-2xl scale-100 rotate-0' : 'z-10 shadow-lg -rotate-3 scale-105'}`}>
              {settings?.craftImages && settings.craftImages.length > 0 ? (
                <img src={settings.craftImages[0].startsWith('/uploads') || settings.craftImages[0].startsWith('/images') ? `${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}${settings.craftImages[0]}` : settings.craftImages[0]} alt="Our Craft" className={`w-full h-full object-cover transition-all duration-1000 ${isWheatFront ? 'opacity-100' : 'opacity-90'}`} />
              ) : (
                <img src={`${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}/images/wheat_background.png`} alt="Our Craft" className={`w-full h-full object-cover transition-all duration-1000 ${isWheatFront ? 'opacity-100' : 'opacity-90'}`} />
              )}
              <div className={`absolute inset-0 bg-[#114D3C]/10 mix-blend-multiply transition-opacity duration-1000 pointer-events-none ${isWheatFront ? 'opacity-0' : 'opacity-100'}`}></div>
            </div>

            {/* Back Image Gallery (Remaining uploaded images) */}
            <div className={`absolute inset-0 rounded-[2rem] overflow-hidden transition-all duration-1000 ease-in-out ${!isWheatFront ? 'z-20 shadow-2xl scale-100 rotate-0' : 'z-10 shadow-lg -rotate-3 scale-105'}`}>
              {settings?.craftImages && settings.craftImages.length > 1 ? (
                settings.craftImages.slice(1).map((img, idx) => {
                  const imgUrl = img.startsWith('/uploads') || img.startsWith('/images') ? `${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}${img}` : img;
                  return (
                    <img 
                      key={idx} 
                      src={imgUrl} 
                      alt="Our Kitchen" 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentCraftImageIndex === idx ? 'opacity-100' : 'opacity-0'}`} 
                    />
                  );
                })
              ) : (
                <img src={settings?.craftImage ? (settings.craftImage.startsWith('/uploads') || settings.craftImage.startsWith('/images') ? `${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}${settings.craftImage}` : settings.craftImage) : `${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}${KITCHEN_IMG}`} alt="Our Kitchen" className={`w-full h-full object-cover transition-all duration-1000 ${!isWheatFront ? 'opacity-100' : 'opacity-90'}`} />
              )}
              <div className={`absolute inset-0 bg-[#114D3C]/10 mix-blend-multiply transition-opacity duration-1000 pointer-events-none ${!isWheatFront ? 'opacity-0' : 'opacity-100'}`}></div>
            </div>

            {/* 100% Pure Veg Badge */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 z-30 bg-white p-5 sm:p-6 rounded-3xl shadow-[0_10px_40px_rgba(22,163,74,0.15)] border border-[#EAE5D9]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#F2ECE4] rounded-full flex items-center justify-center">
                  <ChefHat className="w-8 h-8 text-[#16A34A]" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-[#114D3C]">100%</p>
                  <p className="text-sm font-semibold text-[#16A34A] uppercase tracking-wider" style={{ fontFamily: "var(--font-outfit)" }}>Pure Veg</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-12 h-[2px] bg-[#16A34A]"></span>
              <span className="text-sm font-bold text-[#16A34A] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Our Philosophy</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#114D3C] leading-tight whitespace-pre-line" style={{ fontFamily: "var(--font-playfair)" }}>
              {settings?.craftTitle || 'The Art of \nPerfect Dough'}
            </h2>
            <p className="text-lg text-[#8B5A2B] leading-relaxed pb-4 whitespace-pre-line" style={{ fontFamily: "var(--font-outfit)" }}>
              {settings?.craftDescription || 'We believe that good food starts with pure ingredients. Every morning, our dough is freshly kneaded using premium wheat flour without any preservatives or artificial additives.\n\nRolled with care and cooked to perfection, our rotis offer the authentic taste of home, delivering warmth and comfort straight to your table.'}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 text-[#114D3C] font-bold text-lg hover:text-[#16A34A] transition-colors"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Read our story 
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
