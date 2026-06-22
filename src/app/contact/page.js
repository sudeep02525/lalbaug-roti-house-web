"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquareHeart } from "lucide-react"
import axios from 'axios'

import ContactInfo from '@/components/contact/ContactInfo'
import ContactForm from '@/components/contact/ContactForm'
import ContactMap from '@/components/contact/ContactMap'

import { Skeleton } from "@/components/ui/Skeleton"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, { validateStatus: () => true })
        const data = res.data
        if (data.success && data.data) {
          setSettings(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch settings", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF5E9] pt-32 pb-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-20 flex flex-col items-center">
            <Skeleton className="h-10 w-48 mb-6 rounded-full" />
            <Skeleton className="h-16 w-96 mb-6 rounded-lg" />
            <Skeleton className="h-6 w-[600px]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-[500px] w-full rounded-3xl" />
            </div>
          </div>
          
          {/* Skeleton for Contact Map */}
          <div className="mt-16 bg-white/50 p-3 lg:p-4 rounded-[2rem] border border-[#E8E1D5]/50">
            <Skeleton className="w-full h-[450px] rounded-[1.5rem]" />
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const waNumber = settings?.whatsappNumber || '919920688099';
    const waText = `Hello *Lalbaug Roti House* Team! \\u{1F44B}\n\nI have a new query from your website contact form:\n\n\\u{1F464} *Customer Details:*\n• *Name:* ${formData.name}\n• *Email:* ${formData.email}\n\n\\u{1F4DD} *Query Information:*\n• *Subject:* ${formData.subject}\n• *Message:*\n"${formData.message}"\n\nPlease reply to me as soon as possible. Thank you! \\u{1F64F}`;
    const encodedText = encodeURIComponent(waText)
    window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank')
    
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
          <ContactInfo settings={settings} />
          
          <ContactForm 
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        <ContactMap />

      </div>
    </div>
  )
}
