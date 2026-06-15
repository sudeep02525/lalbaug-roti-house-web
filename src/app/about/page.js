"use client"
import { useState, useEffect } from "react"
import axios from "axios"

import AboutHero from "@/components/about/AboutHero"
import AboutMission from "@/components/about/AboutMission"
import AboutStandards from "@/components/about/AboutStandards"

export default function AboutPage() {
  const [settings, setSettings] = useState(null)

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
      }
    }
    fetchSettings()
  }, [])
  
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-24 overflow-hidden relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8A359]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0"></div>
      <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-[#14452F]/5 rounded-full blur-[120px] -translate-x-1/2 pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <AboutHero settings={settings} />

        <AboutMission settings={settings} />

        <AboutStandards />

      </div>
    </div>
  )
}
