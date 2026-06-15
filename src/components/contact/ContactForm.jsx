import { motion } from 'framer-motion'
import { Send } from "lucide-react"

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

export default function ContactForm({ formData, handleChange, handleSubmit, isSubmitting }) {
  return (
    <motion.div 
      variants={slideInRight}
      initial="hidden"
      animate="visible"
      className="lg:col-span-3"
    >
      <div className="bg-[#FDFBF7] p-10 lg:p-12 rounded-[2.5rem] border border-[#E8E1D5] shadow-[0_20px_60px_-15px_rgba(139,94,60,0.08)] h-full relative overflow-hidden">
        <h3 className="text-3xl font-bold mb-8 text-[#1A4D2E] font-playfair">Help & Queries</h3>
        
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group mt-2">
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="peer w-full bg-white border-b-2 border-[#E8E1D5] rounded-t-xl px-5 pt-7 pb-3 text-[#1A4D2E] font-medium focus:outline-none focus:border-[#8B5E3C] focus:bg-[#FAF5E9] transition-all shadow-sm"
                    placeholder=" "
                  />
                  <label className="absolute pointer-events-none text-[#8B5E3C]/60 font-medium duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#8B5E3C] font-outfit">Your Name</label>
                </div>
                <div className="relative group mt-2">
                  <input 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="peer w-full bg-white border-b-2 border-[#E8E1D5] rounded-t-xl px-5 pt-7 pb-3 text-[#1A4D2E] font-medium focus:outline-none focus:border-[#8B5E3C] focus:bg-[#FAF5E9] transition-all shadow-sm"
                    placeholder=" "
                  />
                  <label className="absolute pointer-events-none text-[#8B5E3C]/60 font-medium duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#8B5E3C] font-outfit">Email Address</label>
                </div>
              </div>
              <div className="relative group mt-2">
                <input 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  required 
                  className="peer w-full bg-white border-b-2 border-[#E8E1D5] rounded-t-xl px-5 pt-7 pb-3 text-[#1A4D2E] font-medium focus:outline-none focus:border-[#8B5E3C] focus:bg-[#FAF5E9] transition-all shadow-sm"
                  placeholder=" "
                />
                <label className="absolute pointer-events-none text-[#8B5E3C]/60 font-medium duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#8B5E3C] font-outfit">Subject</label>
              </div>
              <div className="relative group mt-2">
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  className="peer w-full bg-white border-b-2 border-[#E8E1D5] rounded-t-xl px-5 pt-7 pb-3 text-[#1A4D2E] font-medium focus:outline-none focus:border-[#8B5E3C] focus:bg-[#FAF5E9] transition-all shadow-sm min-h-[160px] resize-none"
                  placeholder=" "
                  required
                ></textarea>
                <label className="absolute pointer-events-none text-[#8B5E3C]/60 font-medium duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#8B5E3C] font-outfit">Message</label>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#8B5E3C] text-white font-bold px-10 py-4 rounded-full hover:bg-[#734A2E] hover:shadow-[0_8px_25px_rgba(139,94,60,0.35)] hover:-translate-y-1 transition-all duration-300 group disabled:opacity-70 disabled:hover:translate-y-0 font-outfit"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
                {isSubmitting ? 'Opening WhatsApp...' : 'Send on WhatsApp'}
              </button>
            </motion.form>
      </div>
    </motion.div>
  )
}
