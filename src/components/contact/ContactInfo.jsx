import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from "lucide-react"

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

export default function ContactInfo({ settings }) {
  return (
    <motion.div 
      variants={slideInLeft}
      initial="hidden"
      animate="visible"
      className="lg:col-span-2 space-y-8"
    >
      <div className="bg-[#FDFBF7] p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden border border-[#E8E1D5]">
        {/* Decorative rings */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5E3C]/5 rounded-full blur-xl translate-x-1/2 -translate-y-1/2"></div>
        
        <h3 className="text-3xl font-bold mb-10 text-[#1A4D2E] font-playfair">Contact Info</h3>
        
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
          
          <motion.div variants={slideInLeft} className="flex items-start gap-5 group">
            <div className="w-14 h-14 bg-[#FAF5E9] rounded-2xl flex items-center justify-center shrink-0 border border-[#E8E1D5] group-hover:bg-[#8B5E3C]/10 transition-all duration-300 shadow-sm">
              <MapPin className="w-6 h-6 text-[#8B5E3C]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#73706A] uppercase tracking-widest mb-2 font-outfit">Visit Us</h4>
              <p className="font-medium text-[#1A4D2E] leading-relaxed text-lg font-outfit whitespace-pre-line">
                {settings?.restaurantAddress || 'Shop No 17/45, HY, Ganesh Nagar, Lal Baug, Mumbai - 400012'}
              </p>
            </div>
          </motion.div>

          <motion.div variants={slideInLeft} className="flex items-start gap-5 group">
            <div className="w-14 h-14 bg-[#FAF5E9] rounded-2xl flex items-center justify-center shrink-0 border border-[#E8E1D5] group-hover:bg-[#8B5E3C]/10 transition-all duration-300 shadow-sm">
              <Phone className="w-6 h-6 text-[#8B5E3C]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#73706A] uppercase tracking-widest mb-2 font-outfit">Call / WhatsApp</h4>
              <p className="font-medium text-[#1A4D2E] text-lg font-outfit">
                {settings?.restaurantPhone ? `+91 ${settings.restaurantPhone}` : '+91 93246 88099'}<br />
                {settings?.whatsappNumber ? `+${settings.whatsappNumber}` : '+91 99206 88099'}
              </p>
            </div>
          </motion.div>

          <motion.div variants={slideInLeft} className="flex items-start gap-5 group">
            <div className="w-14 h-14 bg-[#FAF5E9] rounded-2xl flex items-center justify-center shrink-0 border border-[#E8E1D5] group-hover:bg-[#8B5E3C]/10 transition-all duration-300 shadow-sm">
              <Mail className="w-6 h-6 text-[#8B5E3C]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#73706A] uppercase tracking-widest mb-2 font-outfit">Email</h4>
              <p className="font-medium text-[#1A4D2E] text-base sm:text-lg font-outfit break-all">
                {settings?.restaurantEmail || 'lalbaugrotihouse@gmail.com'}
              </p>
            </div>
          </motion.div>

          <motion.div variants={slideInLeft} className="flex items-start gap-5 group">
            <div className="w-14 h-14 bg-[#FAF5E9] rounded-2xl flex items-center justify-center shrink-0 border border-[#E8E1D5] group-hover:bg-[#8B5E3C]/10 transition-all duration-300 shadow-sm">
              <Clock className="w-6 h-6 text-[#8B5E3C]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#73706A] uppercase tracking-widest mb-2 font-outfit">Timings</h4>
              <p className="font-medium text-[#1A4D2E] text-lg font-outfit">
                10:00 AM - 10:00 PM<br />
                Monday to Sunday
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  )
}
