import { motion } from "framer-motion"
import { Heart, Award } from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
}

export default function AboutMission({ settings }) {
  return (
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
        <p className="text-[#73706A] leading-relaxed text-lg whitespace-pre-line" style={{ fontFamily: "var(--font-outfit)" }}>
          {settings?.missionDescription || 'To provide fresh, hygienic, and authentic handmade breads and meals daily. We strive to be the \nreliable kitchen for busy professionals, families, and events by never compromising on the \nquality of ingredients or the traditional methods of cooking.'}
        </p>
      </motion.div>

      <motion.div variants={fadeIn} className="bg-white/80 backdrop-blur-xl p-10 lg:p-12 rounded-[2.5rem] border border-white shadow-[0_20px_40px_-15px_rgba(20,69,47,0.08)] group hover:-translate-y-2 transition-transform duration-500">
        <div className="w-20 h-20 bg-[#FAF8F5] rounded-full flex items-center justify-center mb-8 shadow-inner border border-[#E8A359]/20 group-hover:scale-110 transition-transform duration-500">
          <Award className="w-10 h-10 text-[#E8A359]" />
        </div>
        <h3 className="text-3xl font-bold mb-6 text-[#14452F]" style={{ fontFamily: "var(--font-playfair)" }}>Our Vision</h3>
        <p className="text-[#73706A] leading-relaxed text-lg whitespace-pre-line" style={{ fontFamily: "var(--font-outfit)" }}>
          {settings?.visionDescription || 'To become the most trusted food brand in Mumbai for traditional staples. We envision a future \nwhere our name resonates with every customer, symbolizing our unwavering commitment \nto health, taste, and premium service.'}
        </p>
      </motion.div>
    </motion.div>
  )
}
