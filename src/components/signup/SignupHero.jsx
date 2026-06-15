import { Leaf } from 'lucide-react'

export default function SignupHero() {
  return (
    <>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FAF8F5] pointer-events-none -z-10 hidden lg:block" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#16A34A]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#C19B6C]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Left side: Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative bg-[#114D3C] overflow-hidden p-12 flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/wheat_background.png"
            alt="Wheat"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B382B] via-transparent to-[#0B382B]/80" />
        </div>
        <div
          className="relative z-10 text-white/80 self-end font-bold text-sm tracking-widest uppercase"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Lalbaug Roti House
        </div>
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-[#16A34A] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Leaf className="w-3 h-3" />
            100% Pure Veg
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Fresh meals delivered to your door.
          </h2>
          <p
            className="text-white/80 text-lg leading-relaxed mb-8"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Sign up to save your addresses, track past orders, and checkout in
            seconds. Fresh, handmade rotis await!
          </p>
          <div className="flex gap-4">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border-2 border-[#114D3C] flex items-center justify-center font-bold text-[#114D3C]">
                4.9
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-[#114D3C] bg-white overflow-hidden">
                <img
                  src="/images/Plain-Roti.jpeg"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-[#114D3C] bg-white overflow-hidden">
                <img
                  src="/images/Sabji-Roti.png"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-white text-sm flex flex-col justify-center font-medium">
              <span>Trusted by 10k+</span>
              <span className="text-white/60">happy customers</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
