"use client"
import { useState, useEffect } from "react"
import axios from "axios"

import AboutHero from "@/components/about/AboutHero"
import AboutMission from "@/components/about/AboutMission"
import AboutStandards from "@/components/about/AboutStandards"

import { Skeleton } from "@/components/ui/Skeleton"

export default function AboutPage() {
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
      <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-24 overflow-hidden relative">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          
          {/* Skeleton for AboutHero */}
          <div className="text-center max-w-4xl mx-auto mb-24 flex flex-col items-center">
            <Skeleton className="h-10 w-40 rounded-full mb-8" />
            <Skeleton className="h-16 md:h-20 w-3/4 rounded-lg mb-4" />
            <Skeleton className="h-16 md:h-20 w-1/2 rounded-lg mb-8" />
            <Skeleton className="h-5 md:h-6 w-full mb-3" />
            <Skeleton className="h-5 md:h-6 w-5/6 mb-3" />
            <Skeleton className="h-5 md:h-6 w-4/6" />
          </div>

          {/* Skeleton for AboutMission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            {[1, 2].map(i => (
              <div key={i} className="bg-white/50 p-10 lg:p-12 rounded-[2.5rem] border border-white">
                <Skeleton className="w-20 h-20 rounded-full mb-8" />
                <Skeleton className="h-10 w-48 mb-6" />
                <Skeleton className="h-5 w-full mb-3" />
                <Skeleton className="h-5 w-5/6 mb-3" />
                <Skeleton className="h-5 w-4/6" />
              </div>
            ))}
          </div>

          {/* Skeleton for AboutStandards */}
          <div className="bg-white/50 rounded-[3rem] p-10 lg:p-20 border border-[#E8E1D5]/50">
            <Skeleton className="h-10 w-48 rounded-full mb-8" />
            <Skeleton className="h-12 md:h-16 w-3/4 md:w-1/2 mb-16" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-6">
                  <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                  <div className="w-full">
                    <Skeleton className="h-8 w-48 mb-3" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    )
  }
  
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
