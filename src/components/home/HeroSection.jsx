import Link from "next/link"
import { Sparkles, ShoppingBag, ChevronRight, Leaf, ShieldCheck, Clock, Truck } from "lucide-react"
import { Skeleton } from "@/components/ui/Skeleton"

export default function HeroSection({ settings, isLoading }) {
  if (isLoading) {
    return (
      <section className="bg-gradient-to-b from-[#FAF8F5] to-[#F2ECE4] overflow-hidden relative border-b border-[#E6DCCF]">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center min-h-screen pt-32 pb-12 lg:pt-40 lg:pb-16">
            <div className="space-y-4 pl-0 lg:pl-16 xl:pl-20">
              <Skeleton className="h-8 w-40 rounded-full mb-4" />
              <Skeleton className="h-[4rem] lg:h-[6rem] w-[80%] rounded-2xl mb-2" />
              <Skeleton className="h-[4rem] lg:h-[6rem] w-[60%] rounded-2xl mb-6" />
              <Skeleton className="h-6 w-full max-w-lg mb-2" />
              <Skeleton className="h-6 w-3/4 max-w-lg mb-8" />
              
              <div className="grid grid-cols-4 gap-4 max-w-sm pt-2 mb-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="w-12 h-12 lg:w-14 lg:h-14 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-5">
                <Skeleton className="h-14 w-48 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            <div className="hidden lg:block relative h-full min-h-[500px]">
              <Skeleton className="absolute inset-0 w-full h-full rounded-[3rem]" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  const trustBadges = [
    { icon: Leaf, label: "100% Pure Veg" },
    { icon: ShieldCheck, label: "Hygienic Kitchen" },
    { icon: Clock, label: "Daily Fresh" },
    { icon: Truck, label: "Fast Delivery" },
  ]

  return (
    <section className="bg-gradient-to-b from-[#FAF8F5] to-[#F2ECE4] overflow-hidden relative border-b border-[#E6DCCF]">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center min-h-screen pt-32 pb-12 lg:pt-40 lg:pb-16">

          {/* Left */}
          <div className="space-y-4 pl-0 lg:pl-16 xl:pl-20">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E6DCCF] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="text-xs font-bold tracking-widest uppercase text-[#114D3C]" style={{ fontFamily: "var(--font-outfit)" }}>Authentic & Fresh</span>
            </div>
            <h1 className="text-[4rem] lg:text-[5.5rem] font-bold leading-none text-[#114D3C] tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              {settings?.heroTitle1 || 'Har Roti,'}<br />
              <em className="text-[#16A34A] font-normal not-italic tracking-normal pr-1" style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1.1em", lineHeight: "0.8" }}>{settings?.heroTitle2 || 'Dil Se!'}</em> <span className="text-4xl inline-block -rotate-6">🌿</span>
            </h1>

            <p className="text-[#8B5A2B] text-xl leading-relaxed font-medium max-w-lg whitespace-pre-line" style={{ fontFamily: "var(--font-outfit)" }}>
              {settings?.heroSubtitle || 'Fresh Handmade Roti, Bhakari,\nThepla & Delicious Food'}
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-4 gap-4 max-w-sm pt-2">
              {trustBadges.map((b, i) => {
                const Icon = b.icon
                return (
                  <div key={i} className="flex flex-col items-center gap-2 text-center group cursor-default">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#E6DCCF] group-hover:-translate-y-1.5 group-hover:shadow-[0_10px_30px_rgb(22,163,74,0.2)] group-hover:bg-white transition-all duration-500">
                      <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-[#16A34A] group-hover:text-[#114D3C] group-hover:scale-110 transition-all duration-500" />
                    </div>
                    <span className="text-[10px] lg:text-[11px] font-bold text-[#8B5A2B] leading-tight group-hover:text-[#114D3C] transition-colors uppercase tracking-wide" style={{ fontFamily: "var(--font-outfit)" }}>{b.label}</span>
                  </div>
                )
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-5">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-3 bg-[#16A34A] text-white font-semibold px-10 py-4 rounded-full shadow-[0_8px_30px_rgba(22,163,74,0.3)] hover:bg-[#15803D] hover:shadow-[0_12px_40px_rgba(22,163,74,0.4)] hover:-translate-y-1 transition-all duration-500 text-base w-full sm:w-auto border border-[#16A34A]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                <ShoppingBag className="w-5 h-5 text-white" />
                Explore Menu
              </Link>
              <Link
                href="/menu"
                className="group inline-flex items-center justify-center gap-2 text-[#114D3C] font-bold text-base hover:text-[#16A34A] transition-colors w-full sm:w-auto"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                View full menu 
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Right — Food image spacer for grid */}
          <div className="hidden lg:block"></div>

        </div>
      </div>

      {/* Bleeding Background Image */}
      <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[55%] h-full z-0 pointer-events-none opacity-20 lg:opacity-100 flex items-center justify-end">
        <img
          src={settings?.heroImage ? (settings.heroImage.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${settings.heroImage}` : settings.heroImage) : "/images/hero-platter.png"}
          alt="Fresh traditional food"
          className="w-full h-full object-cover scale-105 origin-right"
          fetchPriority="high"
          decoding="sync"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, black 45%)',
            maskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, black 45%)'
          }}
        />
      </div>
    </section>
  )
}
