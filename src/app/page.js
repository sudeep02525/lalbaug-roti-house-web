"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useCart } from "@/context/CartContext"
import { Leaf, ShieldCheck, Clock, Truck, Star, ChevronLeft, ChevronRight, ShoppingBag, Sparkles, ChefHat, HeartHandshake, Phone, ShoppingCart, MapPin, Award, X, Play } from "lucide-react"
import ProductCard from '@/components/ProductCard'
import axios from 'axios'
import { preload } from 'react-dom'

const FOOD_IMG = "/images/indian_roti_meal.png"
const KITCHEN_IMG = "/images/dough_preparation.png"

const VideoCard = ({ video, onClick }) => {
  const videoRef = useRef(null)

  return (
    <div 
      className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_-15px_rgba(22,163,74,0.2)] hover:-translate-y-2 transition-all duration-500 border border-[#E6DCCF] cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0
        }
      }}
    >
      <div className="relative aspect-video w-full bg-black group-hover:scale-[1.02] transition-transform duration-700">
        <video
          ref={videoRef}
          src={`${process.env.NEXT_PUBLIC_API_URL}${video.url}`}
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:bg-[#16A34A]/90 group-hover:scale-110 transition-all duration-500">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-outfit)" }}>{video.title}</h3>
      </div>
    </div>
  )
}

export default function Home() {
  preload('/images/hero-platter.png', { as: 'image', fetchPriority: 'high' })
  
  const [isWheatFront, setIsWheatFront] = useState(false)
  const { addToCart } = useCart()
  const [videos, setVideos] = useState([])
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  
  // Reviews state
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" })
  const [submittingReview, setSubmittingReview] = useState(false)
  
  // Dynamic Menu State
  const [bestsellers, setBestsellers] = useState([])
  const [combos, setCombos] = useState([])

  // Global Settings State
  const [settings, setSettings] = useState(null)

  const bestsellersRef = useRef(null)
  const scrollBestsellers = (dir) => {
    if (bestsellersRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 276 : 304;
      bestsellersRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/videos`, { validateStatus: () => true })
        const data = res.data
        if (data.success) {
          setVideos(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch videos", err)
      } finally {
        setLoadingVideos(false)
      }
    }
    
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews`, { validateStatus: () => true })
        const data = res.data
        if (data.success) {
          setReviews(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err)
      } finally {
        setLoadingReviews(false)
      }
    }

    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/catalog/menu`, { validateStatus: () => true })
        const data = res.data
        if (data.success && data.data) {
          const menu = data.data
          const allProducts = Object.values(menu).flat()
          setBestsellers(allProducts.filter(p => p.isBestseller))
          setCombos(allProducts.filter(p => p.isDailyCombo))
        }
      } catch (err) {
        console.error("Failed to fetch menu", err)
      }
    }

    fetchVideos()
    fetchReviews()
    fetchMenu()
  }, [])

  const [currentCraftImageIndex, setCurrentCraftImageIndex] = useState(0)

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}/api/v1/settings`, { validateStatus: () => true })
      .then(res => res.data)
      .then(data => {
        if (data.success) {
          setSettings(data.data)
        }
      })
      .catch(err => console.error('Failed to fetch settings:', err))
  }, [])

  useEffect(() => {
    // Original hover animation logic for Wheat vs Kitchen
    const interval = setInterval(() => {
      setIsWheatFront(prev => !prev)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Slideshow for craft images (excluding the first image used for the front)
    const galleryImages = (settings?.craftImages || []).slice(1)
    if (galleryImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentCraftImageIndex(prev => (prev + 1) % galleryImages.length)
      }, 3500)
      return () => clearInterval(interval)
    }
  }, [settings?.craftImages])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setSubmittingReview(true)
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews`, reviewForm, { validateStatus: () => true })
      const data = res.data
      if (data.success) {
        setReviews([data.data, ...reviews])
        setShowReviewModal(false)
        setReviewForm({ name: "", rating: 5, comment: "" })
      }
    } catch (err) {
      console.error("Failed to submit review", err)
    } finally {
      setSubmittingReview(false)
    }
  }

  const trustBadges = [
    { icon: Leaf, label: "100% Pure Veg" },
    { icon: ShieldCheck, label: "Hygienic Kitchen" },
    { icon: Clock, label: "Daily Fresh" },
    { icon: Truck, label: "Fast Delivery" },
  ]

  return (
    <div className="bg-[#FAF8F5]">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-b from-[#FAF8F5] to-[#F2ECE4] overflow-hidden relative border-b border-[#E6DCCF]">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center min-h-screen pt-32 pb-12 lg:pt-40 lg:pb-16">

            {/* Left */}
            <div className="space-y-4 pl-0 lg:pl-16 xl:pl-20">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E6DCCF] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                <span className="text-xs font-bold tracking-widest uppercase text-[#114D3C]" style={{ fontFamily: "var(--font-outfit)" }}>Authentic & Fresh</span>
              </div>
              <h1 className="text-[4rem] lg:text-[5.5rem] font-bold leading-none text-[#114D3C] tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                {settings?.heroTitle1 || 'Har Roti,'}<br />
                <em className="text-[#16A34A] font-normal not-italic tracking-normal pr-1" style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1.1em", lineHeight: "0.8" }}>{settings?.heroTitle2 || 'Dil Se!'}</em> <span className="text-4xl inline-block -rotate-6">🌿</span>
              </h1>

              <p className="text-[#8B5A2B] text-xl leading-relaxed font-medium max-w-lg whitespace-pre-line" style={{ fontFamily: "var(--font-outfit)" }}>
                {settings?.heroSubtitle || 'Fresh Handmade Roti, Bhakari,\nThepla & Delicious Food'}
              </p>

              {/* Trust badges */}
              <div className="grid grid-cols-4 gap-4 max-w-sm pt-2">
                {trustBadges.map((b, i) => {
                  const Icon = b.icon
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 text-center group cursor-default">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#E6DCCF] group-hover:-translate-y-1.5 group-hover:shadow-[0_10px_30px_rgb(22,163,74,0.2)] group-hover:bg-white transition-all duration-500">
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-[#16A34A] group-hover:text-[#114D3C] group-hover:scale-110 transition-all duration-500" />
                      </div>
                      <span className="text-[10px] lg:text-[11px] font-bold text-[#8B5A2B] leading-tight group-hover:text-[#114D3C] transition-colors uppercase tracking-wide" style={{ fontFamily: "var(--font-outfit)" }}>{b.label}</span>
                    </div>
                  )
                })}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-5">
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-3 bg-[#16A34A] text-white font-semibold px-10 py-4 rounded-full shadow-[0_8px_30px_rgba(22,163,74,0.3)] hover:bg-[#15803D] hover:shadow-[0_12px_40px_rgba(22,163,74,0.4)] hover:-translate-y-1 transition-all duration-500 text-base w-full sm:w-auto border border-[#16A34A]"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                  Explore Menu
                </Link>
                <Link
                  href="/menu"
                  className="group inline-flex items-center justify-center gap-2 text-[#114D3C] font-bold text-base hover:text-[#16A34A] transition-colors w-full sm:w-auto"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  View full menu 
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            {/* Right — Food image spacer for grid */}
            <div className="hidden lg:block"></div>

          </div>
        </div>

        {/* Bleeding Background Image */}
        <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[55%] h-full z-0 pointer-events-none opacity-20 lg:opacity-100 flex items-center justify-end">
          <img
            src={settings?.heroImage ? (settings.heroImage.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${settings.heroImage}` : settings.heroImage) : "/images/hero-platter.png"}
            alt="Fresh traditional food"
            className="w-full h-full object-cover scale-105 origin-right"
            fetchPriority="high"
            decoding="sync"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, black 45%)',
              maskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, black 45%)'
            }}
          />
        </div>
      </section>

      {/* ── OUR CRAFT ── */}
      <section className="py-24 bg-white">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div 
              className="relative h-[400px] sm:h-[500px] w-full group" 
            >
              {/* Front Image (First uploaded image) */}
              <div className={`absolute inset-0 rounded-[2rem] overflow-hidden transition-all duration-1000 ease-in-out ${isWheatFront ? 'z-20 shadow-2xl scale-100 rotate-0' : 'z-10 shadow-lg -rotate-3 scale-105'}`}>
                {settings?.craftImages && settings.craftImages.length > 0 ? (
                  <img src={settings.craftImages[0].startsWith('/uploads') || settings.craftImages[0].startsWith('/images') ? `${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}${settings.craftImages[0]}` : settings.craftImages[0]} alt="Our Craft" className={`w-full h-full object-cover transition-all duration-1000 ${isWheatFront ? 'opacity-100' : 'opacity-90'}`} />
                ) : (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}/images/wheat_background.png`} alt="Our Craft" className={`w-full h-full object-cover transition-all duration-1000 ${isWheatFront ? 'opacity-100' : 'opacity-90'}`} />
                )}
                <div className={`absolute inset-0 bg-[#114D3C]/10 mix-blend-multiply transition-opacity duration-1000 pointer-events-none ${isWheatFront ? 'opacity-0' : 'opacity-100'}`}></div>
              </div>

              {/* Back Image Gallery (Remaining uploaded images) */}
              <div className={`absolute inset-0 rounded-[2rem] overflow-hidden transition-all duration-1000 ease-in-out ${!isWheatFront ? 'z-20 shadow-2xl scale-100 rotate-0' : 'z-10 shadow-lg -rotate-3 scale-105'}`}>
                {settings?.craftImages && settings.craftImages.length > 1 ? (
                  settings.craftImages.slice(1).map((img, idx) => {
                    const imgUrl = img.startsWith('/uploads') || img.startsWith('/images') ? `${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}${img}` : img;
                    return (
                      <img 
                        key={idx} 
                        src={imgUrl} 
                        alt="Our Kitchen" 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentCraftImageIndex === idx ? 'opacity-100' : 'opacity-0'}`} 
                      />
                    );
                  })
                ) : (
                  <img src={settings?.craftImage ? (settings.craftImage.startsWith('/uploads') || settings.craftImage.startsWith('/images') ? `${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}${settings.craftImage}` : settings.craftImage) : `${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}${KITCHEN_IMG}`} alt="Our Kitchen" className={`w-full h-full object-cover transition-all duration-1000 ${!isWheatFront ? 'opacity-100' : 'opacity-90'}`} />
                )}
                <div className={`absolute inset-0 bg-[#114D3C]/10 mix-blend-multiply transition-opacity duration-1000 pointer-events-none ${!isWheatFront ? 'opacity-0' : 'opacity-100'}`}></div>
              </div>

              {/* 100% Pure Veg Badge */}
              <div className="absolute -bottom-8 -right-4 sm:-right-8 z-30 bg-white p-5 sm:p-6 rounded-3xl shadow-[0_10px_40px_rgba(22,163,74,0.15)] border border-[#EAE5D9]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#F2ECE4] rounded-full flex items-center justify-center">
                    <ChefHat className="w-8 h-8 text-[#16A34A]" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl text-[#114D3C]">100%</p>
                    <p className="text-sm font-semibold text-[#16A34A] uppercase tracking-wider" style={{ fontFamily: "var(--font-outfit)" }}>Pure Veg</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="w-12 h-[2px] bg-[#16A34A]"></span>
                <span className="text-sm font-bold text-[#16A34A] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Our Philosophy</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#114D3C] leading-tight whitespace-pre-line" style={{ fontFamily: "var(--font-playfair)" }}>
                {settings?.craftTitle || 'The Art of \nPerfect Dough'}
              </h2>
              <p className="text-lg text-[#8B5A2B] leading-relaxed pb-4 whitespace-pre-line" style={{ fontFamily: "var(--font-outfit)" }}>
                {settings?.craftDescription || 'We believe that good food starts with pure ingredients. Every morning, our dough is freshly kneaded using premium wheat flour without any preservatives or artificial additives.\n\nRolled with care and cooked to perfection, our rotis offer the authentic taste of home, delivering warmth and comfort straight to your table.'}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 text-[#114D3C] font-bold text-lg hover:text-[#16A34A] transition-colors"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Read our story 
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── DAILY COMBOS (NEW ADDED DETAIL) ── */}
      <section className="bg-[#F2ECE4] py-24 border-y border-[#E6DCCF]">
        <div className="container max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-12 h-[2px] bg-[#16A34A]"></span>
                <span className="text-sm font-bold text-[#16A34A] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Complete Meals</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-playfair)" }}>Daily Combo Meals</h2>
            </div>
            <Link
              href="/menu?cat=Daily Combo"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#114D3C] font-bold rounded-full border border-[#E6DCCF] hover:bg-[#114D3C] hover:text-white transition-all shadow-sm"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              See All Combos
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {combos.map((item) => (
              <div key={item.id} className="h-fit">
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIGNATURE BESTSELLERS ── */}
      <section className="bg-white py-24 relative">
        <div className="container max-w-7xl">
          <div className="flex items-center justify-between mb-16">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-12 h-[2px] bg-[#16A34A]"></span>
                <span className="text-sm font-bold text-[#16A34A] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Crowd Favorites</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-playfair)" }}>Signature Bestsellers</h2>
            </div>
            
            {/* Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => scrollBestsellers('left')} className="w-12 h-12 rounded-full bg-white border border-[#E6DCCF] flex items-center justify-center text-[#114D3C] hover:bg-[#F2ECE4] transition-colors shadow-sm">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={() => scrollBestsellers('right')} className="w-12 h-12 rounded-full bg-white border border-[#E6DCCF] flex items-center justify-center text-[#114D3C] hover:bg-[#F2ECE4] transition-colors shadow-sm">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div 
            ref={bestsellersRef}
            className="flex items-start overflow-x-auto gap-4 sm:gap-6 pb-8 pt-4 -mx-4 px-4 sm:-mx-8 sm:px-8 xl:-mx-12 xl:px-12 hide-scrollbar scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {bestsellers.map((item) => (
              <div key={item.id} className="shrink-0 w-[260px] sm:w-[280px]">
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INGREDIENTS & QUALITY (NEW DETAILS SECTION) ── */}
      <section className="bg-[#FAF8F5] py-20 border-y border-[#E6DCCF]">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6DCCF]">
              <div className="w-16 h-16 mx-auto bg-[#F2ECE4] rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-[#16A34A]" />
              </div>
              <h3 className="text-xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>Premium Quality</h3>
              <p className="text-[#8B5A2B]">We source only the highest grade whole wheat and ingredients, directly from trusted local farmers.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6DCCF]">
              <div className="w-16 h-16 mx-auto bg-[#F2ECE4] rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-[#16A34A]" />
              </div>
              <h3 className="text-xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>Zero Preservatives</h3>
              <p className="text-[#8B5A2B]">No artificial colors, no additives, and no preservatives. Just natural, wholesome ingredients.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6DCCF]">
              <div className="w-16 h-16 mx-auto bg-[#F2ECE4] rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-[#16A34A]" />
              </div>
              <h3 className="text-xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>Local Delivery</h3>
              <p className="text-[#8B5A2B]">We deliver hot and fresh across Mumbai. Prompt service ensuring you enjoy your meal at its best.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#114D3C] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>How It Works</h2>
            <p className="text-lg text-[#8B5A2B] max-w-2xl mx-auto" style={{ fontFamily: "var(--font-outfit)" }}>
              From our kitchen to your dining table in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#16A34A] to-transparent z-0 opacity-30"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#F2ECE4] border-2 border-[#16A34A] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(22,163,74,0.2)]">
                <ShoppingBag className="w-10 h-10 text-[#114D3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>1. Place Your Order</h3>
              <p className="text-[#8B5A2B] text-sm mt-3" style={{ fontFamily: "var(--font-outfit)" }}>
                Browse our menu online and easily place your order.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#F2ECE4] border-2 border-[#16A34A] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(22,163,74,0.2)]">
                <ChefHat className="w-10 h-10 text-[#114D3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>2. Freshly Prepared</h3>
              <p className="text-[#8B5A2B] px-4 leading-relaxed" style={{ fontFamily: "var(--font-outfit)" }}>Our chefs start rolling your rotis and preparing sabjis right after you order.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#F2ECE4] border-2 border-[#16A34A] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(22,163,74,0.2)]">
                <Truck className="w-10 h-10 text-[#114D3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>3. Hot Delivery</h3>
              <p className="text-[#8B5A2B] px-4 leading-relaxed" style={{ fontFamily: "var(--font-outfit)" }}>Securely packed to retain heat and delivered fresh to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIDEOS (SEE US IN ACTION) ── */}
      {!loadingVideos && videos.length > 0 && (
        <section className="bg-white py-24 border-t border-[#E6DCCF]">
          <div className="container max-w-7xl">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="w-12 h-[2px] bg-[#16A34A]"></span>
                <span className="text-sm font-bold text-[#16A34A] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Behind The Scenes</span>
                <span className="w-12 h-[2px] bg-[#16A34A]"></span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-playfair)" }}>See Us In Action</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} onClick={() => setSelectedVideo(video)} />
              ))}
            </div>
          </div>

          {/* Video Modal */}
          {selectedVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedVideo(null)}>
              <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                >
                  <X className="w-6 h-6" />
                </button>
                <video
                  src={`${process.env.NEXT_PUBLIC_API_URL}${selectedVideo.url}`}
                  controls
                  autoPlay
                  className="w-full h-full max-h-[80vh] object-contain"
                />
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── CUSTOMER REVIEWS (PREMIUM CAROUSEL) ── */}
      <section className="bg-white py-24 relative overflow-hidden border-t border-[#E6DCCF]">
        <div className="container max-w-7xl relative z-10 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-12 h-[2px] bg-[#16A34A]"></span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-playfair)" }}>Real Feedback</h2>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#16A34A] fill-[#16A34A]" />
                  ))}
                </div>
                <p className="text-lg font-bold text-[#8B5A2B]" style={{ fontFamily: "var(--font-outfit)" }}>
                  {reviews.length > 0 ? (reviews.reduce((a, r) => a + (r.rating || 5), 0) / reviews.length).toFixed(1) : "4.9"} / 5.0
                  <span className="font-normal text-sm ml-2">({reviews.length > 0 ? reviews.length + 142 : "142"} Reviews)</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#114D3C] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#16A34A] hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_20px_rgba(17,77,60,0.2)] shrink-0"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              <Star className="w-4 h-4 text-white fill-white" />
              Write a Review
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Carousel */}
        <div className="w-full relative">
          <div className="flex overflow-x-auto gap-6 px-4 md:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2))] pb-12 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            
            {reviews.map((t, i) => (
              <div 
                key={i} 
                className="bg-[#FAF8F5] p-8 rounded-3xl min-w-[320px] max-w-[320px] md:min-w-[400px] md:max-w-[400px] shrink-0 snap-center border border-[#EAE5D9] shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[...Array(t.rating || 5)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 text-[#16A34A] fill-[#16A34A]" />
                    ))}
                    {[...Array(5 - (t.rating || 5))].map((_, j) => (
                      <Star key={j} className="w-5 h-5 text-[#E6DCCF]" />
                    ))}
                  </div>
                  {/* Quote Icon watermark */}
                  <span className="text-6xl text-[#16A34A] opacity-10 absolute top-4 right-6 font-serif leading-none">"</span>
                </div>
                
                <p className="text-[#114D3C] text-lg leading-relaxed mb-8 italic min-h-[80px]" style={{ fontFamily: "var(--font-playfair)" }}>"{t.comment}"</p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-[#16A34A] text-xl border border-[#E6DCCF] shadow-sm">
                    {t.name?.[0]?.toUpperCase() || 'G'}
                  </div>
                  <div>
                    <p className="font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-outfit)" }}>{t.name}</p>
                    <p className="text-xs text-[#8B5A2B] font-medium mt-0.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-outfit)" }}>
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Verified Customer"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}>
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="absolute top-6 right-6 text-[#8B5A2B] hover:text-[#114D3C] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-[#114D3C] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Share Your Experience</h3>
                <p className="text-[#8B5A2B]" style={{ fontFamily: "var(--font-outfit)" }}>We'd love to hear about your meal!</p>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#114D3C] mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Your Name</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full bg-[#FAF8F5] border border-[#E6DCCF] rounded-xl px-4 py-3 text-[#114D3C] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#114D3C] mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className="focus:outline-none"
                      >
                        <Star className={`w-8 h-8 transition-colors ${reviewForm.rating >= star ? 'text-[#16A34A] fill-[#16A34A]' : 'text-[#E6DCCF]'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#114D3C] mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Your Comment</label>
                  <textarea
                    required
                    maxLength={500}
                    rows={4}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    className="w-full bg-[#FAF8F5] border border-[#E6DCCF] rounded-xl px-4 py-3 text-[#114D3C] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all resize-none"
                    placeholder="The food was amazing..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-[#16A34A] text-white font-bold py-4 rounded-xl hover:bg-[#15803D] transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(22,163,74,0.3)]"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        )}
      </section>

    </div>
  )
}
