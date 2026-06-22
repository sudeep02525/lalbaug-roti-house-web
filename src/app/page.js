"use client"
import { useState, useEffect } from "react"
import axios from 'axios'
import { preload } from 'react-dom'

// Import extracted sections
import HeroSection from '@/components/home/HeroSection'
import CraftSection from '@/components/home/CraftSection'
import MenuCarousel from '@/components/home/MenuCarousel'
import FeaturesSection from '@/components/home/FeaturesSection'
import VideosSection from '@/components/home/VideosSection'
import ReviewsSection from '@/components/home/ReviewsSection'

export default function Home() {
  preload('/images/hero-platter.png', { as: 'image', fetchPriority: 'high' })
  
  const [isWheatFront, setIsWheatFront] = useState(false)
  const [videos, setVideos] = useState([])
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  
  // Reviews state
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" })
  const [submittingReview, setSubmittingReview] = useState(false)

  // Hydration-safe cache check
  useEffect(() => {
    if (localStorage.getItem('hasVideos') === 'false') {
      setLoadingVideos(false)
    }
    if (localStorage.getItem('hasReviews') === 'false') {
      setLoadingReviews(false)
    }
  }, [])
  
  // Dynamic Menu State
  const [bestsellers, setBestsellers] = useState([])
  const [combos, setCombos] = useState([])
  const [loadingMenu, setLoadingMenu] = useState(true)

  // Global Settings State
  const [settings, setSettings] = useState(null)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [currentCraftImageIndex, setCurrentCraftImageIndex] = useState(0)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/videos`, { validateStatus: () => true })
        const data = res.data
        if (data.success) {
          setVideos(data.data)
          if (typeof window !== 'undefined') localStorage.setItem('hasVideos', data.data.length > 0 ? 'true' : 'false')
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
          if (typeof window !== 'undefined') localStorage.setItem('hasReviews', data.data.length > 0 ? 'true' : 'false')
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
      } finally {
        setLoadingMenu(false)
      }
    }

    fetchVideos()
    fetchReviews()
    fetchMenu()
  }, [])

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}/api/v1/settings`, { validateStatus: () => true })
      .then(res => res.data)
      .then(data => {
        if (data.success) {
          setSettings(data.data)
        }
      })
      .catch(err => console.error('Failed to fetch settings:', err))
      .finally(() => setLoadingSettings(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWheatFront(prev => !prev)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
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

  return (
    <div className="bg-[#FAF8F5]">
      <HeroSection settings={settings} isLoading={loadingSettings} />
      <CraftSection settings={settings} isWheatFront={isWheatFront} currentCraftImageIndex={currentCraftImageIndex} isLoading={loadingSettings} />
      <MenuCarousel combos={combos} bestsellers={bestsellers} isLoading={loadingMenu} />
      <FeaturesSection isLoading={loadingSettings} />
      <VideosSection 
        videos={videos} 
        loadingVideos={loadingVideos} 
        selectedVideo={selectedVideo} 
        setSelectedVideo={setSelectedVideo} 
      />
      <ReviewsSection 
        reviews={reviews}
        loadingReviews={loadingReviews}
        showReviewModal={showReviewModal}
        setShowReviewModal={setShowReviewModal}
        reviewForm={reviewForm}
        setReviewForm={setReviewForm}
        handleReviewSubmit={handleReviewSubmit}
        submittingReview={submittingReview}
      />
    </div>
  )
}
