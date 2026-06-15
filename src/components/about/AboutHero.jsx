import { motion } from "framer-motion"
import { Leaf } from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function AboutHero({ settings }) {
  return (
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
      
      <h1 className="text-5xl lg:text-7xl font-bold text-[#14452F] mb-8 tracking-tight leading-tight whitespace-pre-line" style={{ fontFamily: "var(--font-playfair)" }}>
        {settings?.aboutHeroTitle || 'The Story Behind'} <br/>
        <span className="text-[#E8A359] italic pr-2">{settings?.aboutHeroSubtitle || 'Har Roti, Dil Se'}</span>
      </h1>
      
      <p className="text-xl text-[#73706A] leading-relaxed max-w-3xl mx-auto whitespace-pre-line" style={{ fontFamily: "var(--font-outfit)" }}>
        {settings?.aboutHeroDescription || 'At Lalbaug Roti House, we believe that nothing beats the taste of a warm, handmade roti. \nBorn out of a passion for authentic traditional food, our journey started with a simple goal: \nto bring the comfort of freshly prepared meals to every dining table in Mumbai.'}
      </p>
    </motion.div>
  )
}
