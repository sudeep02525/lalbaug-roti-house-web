import { motion } from "framer-motion"
import { ShieldCheck, CheckCircle2, Sprout } from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function AboutStandards() {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeIn}
      className="bg-[#FDFBF7] text-[#14452F] rounded-[3rem] p-10 lg:p-20 relative overflow-hidden shadow-sm border border-[#E8E1D5]"
    >
      {/* Decorative Background Icon */}
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
        <Sprout className="w-[400px] h-[400px] -translate-y-20 translate-x-20 text-[#8B5E3C]" />
      </div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14452F]/5 border border-[#14452F]/10 backdrop-blur-md mb-8">
          <ShieldCheck className="w-5 h-5 text-[#8B5E3C]" />
          <span className="text-sm font-bold text-[#14452F] tracking-widest uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Pure & Authentic</span>
        </div>
        
        <h2 className="text-4xl lg:text-5xl font-bold mb-16 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
          Uncompromising <br/> <span className="text-[#8B5E3C] italic pr-2">Quality Standards</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          
          <div className="flex items-start gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8E1D5] flex items-center justify-center shrink-0 group-hover:bg-[#FAF5E9] group-hover:border-[#8B5E3C]/30 transition-all duration-300">
              <CheckCircle2 className="w-8 h-8 text-[#8B5E3C]" />
            </div>
            <div>
              <h4 className="font-bold text-2xl mb-3" style={{ fontFamily: "var(--font-playfair)" }}>Premium Ingredients</h4>
              <p className="text-[#73706A] text-lg leading-relaxed" style={{ fontFamily: "var(--font-outfit)" }}>We source only the finest quality grains, fresh vegetables, and pure ghee. No artificial preservatives are ever used in our kitchen.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8E1D5] flex items-center justify-center shrink-0 group-hover:bg-[#FAF5E9] group-hover:border-[#8B5E3C]/30 transition-all duration-300">
              <CheckCircle2 className="w-8 h-8 text-[#8B5E3C]" />
            </div>
            <div>
              <h4 className="font-bold text-2xl mb-3" style={{ fontFamily: "var(--font-playfair)" }}>100% Pure Veg</h4>
              <p className="text-[#73706A] text-lg leading-relaxed" style={{ fontFamily: "var(--font-outfit)" }}>Our kitchen follows strict sanitation protocols. It is a dedicated 100% vegetarian workspace ensuring absolute purity.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8E1D5] flex items-center justify-center shrink-0 group-hover:bg-[#FAF5E9] group-hover:border-[#8B5E3C]/30 transition-all duration-300">
              <CheckCircle2 className="w-8 h-8 text-[#8B5E3C]" />
            </div>
            <div>
              <h4 className="font-bold text-2xl mb-3" style={{ fontFamily: "var(--font-playfair)" }}>Handmade Daily</h4>
              <p className="text-[#73706A] text-lg leading-relaxed" style={{ fontFamily: "var(--font-outfit)" }}>Every roti and bhakari is kneaded and rolled by hand daily. We do not mass-produce; we craft food with love.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8E1D5] flex items-center justify-center shrink-0 group-hover:bg-[#FAF5E9] group-hover:border-[#8B5E3C]/30 transition-all duration-300">
              <CheckCircle2 className="w-8 h-8 text-[#8B5E3C]" />
            </div>
            <div>
              <h4 className="font-bold text-2xl mb-3" style={{ fontFamily: "var(--font-playfair)" }}>Traditional Recipes</h4>
              <p className="text-[#73706A] text-lg leading-relaxed" style={{ fontFamily: "var(--font-outfit)" }}>We preserve authentic traditional cooking methods, keeping the nostalgic taste alive in every bite.</p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
