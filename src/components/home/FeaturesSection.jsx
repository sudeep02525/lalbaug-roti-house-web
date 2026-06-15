import { Award, ShieldCheck, MapPin, ShoppingBag, ChefHat, Truck } from "lucide-react"

export default function FeaturesSection() {
  return (
    <>
      {/* ── INGREDIENTS & QUALITY ── */}
      <section className="bg-[#FAF8F5] py-20 border-y border-[#E6DCCF]">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6DCCF]">
              <div className="w-16 h-16 mx-auto bg-[#F2ECE4] rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-[#16A34A]" />
              </div>
              <h3 className="text-xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>Premium Quality</h3>
              <p className="text-[#8B5A2B]">We source only the highest grade whole wheat and ingredients, directly from trusted local farmers.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6DCCF]">
              <div className="w-16 h-16 mx-auto bg-[#F2ECE4] rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-[#16A34A]" />
              </div>
              <h3 className="text-xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>Zero Preservatives</h3>
              <p className="text-[#8B5A2B]">No artificial colors, no additives, and no preservatives. Just natural, wholesome ingredients.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6DCCF]">
              <div className="w-16 h-16 mx-auto bg-[#F2ECE4] rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-[#16A34A]" />
              </div>
              <h3 className="text-xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>Local Delivery</h3>
              <p className="text-[#8B5A2B]">We deliver hot and fresh across Mumbai. Prompt service ensuring you enjoy your meal at its best.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#114D3C] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>How It Works</h2>
            <p className="text-lg text-[#8B5A2B] max-w-2xl mx-auto" style={{ fontFamily: "var(--font-outfit)" }}>
              From our kitchen to your dining table in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#16A34A] to-transparent z-0 opacity-30"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#F2ECE4] border-2 border-[#16A34A] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(22,163,74,0.2)]">
                <ShoppingBag className="w-10 h-10 text-[#114D3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>1. Place Your Order</h3>
              <p className="text-[#8B5A2B] text-sm mt-3" style={{ fontFamily: "var(--font-outfit)" }}>
                Browse our menu online and easily place your order.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#F2ECE4] border-2 border-[#16A34A] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(22,163,74,0.2)]">
                <ChefHat className="w-10 h-10 text-[#114D3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>2. Freshly Prepared</h3>
              <p className="text-[#8B5A2B] px-4 leading-relaxed" style={{ fontFamily: "var(--font-outfit)" }}>Our chefs start rolling your rotis and preparing sabjis right after you order.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#F2ECE4] border-2 border-[#16A34A] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(22,163,74,0.2)]">
                <Truck className="w-10 h-10 text-[#114D3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>3. Hot Delivery</h3>
              <p className="text-[#8B5A2B] px-4 leading-relaxed" style={{ fontFamily: "var(--font-outfit)" }}>Securely packed to retain heat and delivered fresh to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
