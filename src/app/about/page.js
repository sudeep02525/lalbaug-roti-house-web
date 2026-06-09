"use client"
import { motion } from "framer-motion"
import { Leaf, Award, Heart, ShieldCheck, CheckCircle2, Sprout } from "lucide-react"
import Image from "next/image"

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-24 overflow-hidden relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8A359]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0"></div>
      <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-[#14452F]/5 rounded-full blur-[120px] -translate-x-1/2 pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E8A359]/20 shadow-sm mb-8">
            <Leaf className="w-5 h-5 text-[#E8A359]" />
            <span className="text-sm font-bold text-[#14452F] tracking-widest uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Our Heritage</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-[#14452F] mb-8 tracking-tight leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
            The Story Behind <br/>
            <span className="text-[#E8A359] italic pr-2">Har Roti, Dil Se</span>
          </h1>
          
          <p className="text-xl text-[#73706A] leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "var(--font-outfit)" }}>
            At Lalbaug Roti House, we believe that nothing beats the taste of a warm, handmade roti. 
            Born out of a passion for authentic traditional food, our journey started with a simple goal: 
            to bring the comfort of home-cooked meals to every dining table in Mumbai.
          </p>
        </motion.div>

        {/* Mission & Vision (Glassmorphic Cards) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32"
        >
          <motion.div variants={fadeIn} className="bg-white/80 backdrop-blur-xl p-10 lg:p-12 rounded-[2.5rem] border border-white shadow-[0_20px_40px_-15px_rgba(20,69,47,0.08)] group hover:-translate-y-2 transition-transform duration-500">
            <div className="w-20 h-20 bg-[#FAF8F5] rounded-full flex items-center justify-center mb-8 shadow-inner border border-[#E8A359]/20 group-hover:scale-110 transition-transform duration-500">
              <Heart className="w-10 h-10 text-[#E8A359]" />
            </div>
            <h3 className="text-3xl font-bold mb-6 text-[#14452F]" style={{ fontFamily: "var(--font-playfair)" }}>Our Mission</h3>
            <p className="text-[#73706A] leading-relaxed text-lg" style={{ fontFamily: "var(--font-outfit)" }}>
              To provide fresh, hygienic, and authentic handmade breads and meals daily. We strive to be the 
              reliable kitchen for busy professionals, families, and events by never compromising on the 
              quality of ingredients or the traditional methods of cooking.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-white/80 backdrop-blur-xl p-10 lg:p-12 rounded-[2.5rem] border border-white shadow-[0_20px_40px_-15px_rgba(20,69,47,0.08)] group hover:-translate-y-2 transition-transform duration-500">
            <div className="w-20 h-20 bg-[#FAF8F5] rounded-full flex items-center justify-center mb-8 shadow-inner border border-[#E8A359]/20 group-hover:scale-110 transition-transform duration-500">
              <Award className="w-10 h-10 text-[#E8A359]" />
            </div>
            <h3 className="text-3xl font-bold mb-6 text-[#14452F]" style={{ fontFamily: "var(--font-playfair)" }}>Our Vision</h3>
            <p className="text-[#73706A] leading-relaxed text-lg" style={{ fontFamily: "var(--font-outfit)" }}>
              To become the most trusted food brand in Mumbai for traditional staples. We envision a future 
              where our name resonates with every customer, symbolizing our unwavering commitment 
              to health, taste, and premium service.
            </p>
          </motion.div>
        </motion.div>

        {/* Premium Food Quality Standards (Dark Theme Section) */}
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

      </div>
    </div>
  )
}
