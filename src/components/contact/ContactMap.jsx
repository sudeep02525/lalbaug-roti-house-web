import { motion } from 'framer-motion'

export default function ContactMap() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-16 bg-[#FDFBF7] p-3 lg:p-4 rounded-[2rem] border border-[#E8E1D5] shadow-[0_20px_40px_-15px_rgba(139,94,60,0.08)] group hover:shadow-[0_25px_50px_-15px_rgba(139,94,60,0.12)] transition-shadow duration-500"
    >
      <div className="w-full h-[450px] rounded-[1.5rem] overflow-hidden bg-[#FAF5E9] relative">
        <div className="absolute inset-0 bg-[#8B5E3C]/5 pointer-events-none mix-blend-overlay"></div>
        <iframe 
          src="https://maps.google.com/maps?q=Lalbaug%20Roti%20House,%20Mumbai&t=&z=15&ie=UTF8&iwloc=&output=embed" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale-[20%] contrast-125"
        ></iframe>
      </div>
    </motion.div>
  )
}
