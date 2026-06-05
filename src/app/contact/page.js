"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, MessageSquareHeart } from "lucide-react"

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const waText = `*New Query / Help Request*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Subject:* ${formData.subject}\n*Message:* ${formData.message}`
    const encodedText = encodeURIComponent(waText)
    window.open(`https://wa.me/919920688099?text=${encodedText}`, '_blank')
    
    setIsSubmitting(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-[#FAF5E9] pt-32 pb-24 relative overflow-hidden font-outfit selection:bg-[#8B5E3C] selection:text-white">
      <style jsx global>{`
        .font-playfair { font-family: var(--font-playfair); }
        .font-outfit { font-family: var(--font-outfit); }
      `}</style>
      
      {/* Background Decorators */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#8B5E3C]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#1A4D2E]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FDFBF7] border border-[#8B5E3C]/20 shadow-sm mb-6">
            <MessageSquareHeart className="w-4 h-4 text-[#8B5E3C]" />
            <span className="text-sm font-bold text-[#1A4D2E] tracking-widest uppercase font-outfit">Always Listening</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-[#1A4D2E] mb-6 tracking-tight font-playfair">Get in Touch</h1>
          <p className="text-xl text-[#8B5E3C] max-w-2xl mx-auto leading-relaxed font-outfit">
            Whether you have a query about a bulk order, want to partner with us, or just want to say hi — we're here for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Contact Details (Dark Sidebar) */}
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
                    <p className="font-medium text-[#1A4D2E] leading-relaxed text-lg font-outfit">
                      Lalbaug Roti House<br />
                      Shop No. 1, Near Kalachowki,<br />
                      Lalbaug, Mumbai - 400012
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
                      +91 93246 88099<br />
                      +91 99206 88099
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={slideInLeft} className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-[#FAF5E9] rounded-2xl flex items-center justify-center shrink-0 border border-[#E8E1D5] group-hover:bg-[#8B5E3C]/10 transition-all duration-300 shadow-sm">
                    <Mail className="w-6 h-6 text-[#8B5E3C]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#73706A] uppercase tracking-widest mb-2 font-outfit">Email</h4>
                    <p className="font-medium text-[#1A4D2E] text-base sm:text-lg font-outfit break-all">lalbaugrotihouse@gmail.com</p>
                  </div>
                </motion.div>

                <motion.div variants={slideInLeft} className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-[#FAF5E9] rounded-2xl flex items-center justify-center shrink-0 border border-[#E8E1D5] group-hover:bg-[#8B5E3C]/10 transition-all duration-300 shadow-sm">
                    <Clock className="w-6 h-6 text-[#8B5E3C]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#73706A] uppercase tracking-widest mb-2 font-outfit">Timings</h4>
                    <p className="font-medium text-[#1A4D2E] text-lg font-outfit">
                      7:00 AM - 11:00 PM<br />
                      Monday to Sunday
                    </p>
                  </div>
                </motion.div>

              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form (Premium Styling) */}
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
                        <label className="absolute text-[#8B5E3C]/60 font-medium duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#8B5E3C] font-outfit">Your Name</label>
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
                        <label className="absolute text-[#8B5E3C]/60 font-medium duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#8B5E3C] font-outfit">Email Address</label>
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
                      <label className="absolute text-[#8B5E3C]/60 font-medium duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#8B5E3C] font-outfit">Subject</label>
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
                      <label className="absolute text-[#8B5E3C]/60 font-medium duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#8B5E3C] font-outfit">Message</label>
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

        </div>

        {/* Embedded Map */}
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

      </div>
    </div>
  )
}
