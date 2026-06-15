"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2, ChevronLeft, LogOut, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

import ProfileHeader from '@/components/profile/ProfileHeader'
import OrderHistory from '@/components/profile/OrderHistory'
import AddressManager from '@/components/profile/AddressManager'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  
  // Addresses State
  const [savedAddresses, setSavedAddresses] = useState([])
  const [mounted, setMounted] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [addressForm, setAddressForm] = useState({ name: '', mobile: '', address: '', landmark: '', notes: '', lat: null, lng: null })
  const [locationError, setLocationError] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if not logged in
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push('/login?redirect=/profile')
    }
  }, [user, authLoading, mounted, router])

  // Fetch Order History
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          },
          validateStatus: () => true
        })
        const data = res.data
        if ((res.status === 200 || res.status === 201) && data.success) {
          setOrders(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch orders", err)
      } finally {
        setLoadingOrders(false)
      }
    }
    fetchOrders()
  }, [user])

  // Get Saved Addresses
  useEffect(() => {
    if (mounted) {
      const arrSaved = localStorage.getItem('savedAddresses')
      const singleSaved = localStorage.getItem('savedDeliveryAddress')
      
      if (arrSaved) {
        try {
          setSavedAddresses(JSON.parse(arrSaved))
        } catch (e) { }
      } else if (singleSaved) {
        // Migrate old single address to array
        try {
          const parsed = JSON.parse(singleSaved)
          const migrated = [{ ...parsed, isDefault: true }]
          setSavedAddresses(migrated)
          localStorage.setItem('savedAddresses', JSON.stringify(migrated))
          localStorage.removeItem('savedDeliveryAddress')
        } catch (e) {}
      }
    }
  }, [mounted])

  const saveAddressesToStorage = (addresses) => {
    setSavedAddresses(addresses)
    localStorage.setItem('savedAddresses', JSON.stringify(addresses))
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Address Management Logic
  const handleOpenAddModal = () => {
    if (savedAddresses.length >= 5) return alert("You can only save up to 5 addresses.")
    setAddressForm({ name: user.name, mobile: user.phone, address: '', landmark: '', notes: '', lat: null, lng: null })
    setEditingIndex(null)
    setLocationError('')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (index) => {
    const addr = savedAddresses[index]
    setAddressForm({ ...addr })
    setEditingIndex(index)
    setLocationError('')
    setIsModalOpen(true)
  }

  const handleDeleteAddress = (index) => {
    if (confirm("Are you sure you want to delete this address?")) {
      const newAddrs = [...savedAddresses]
      const wasDefault = newAddrs[index].isDefault
      newAddrs.splice(index, 1)
      if (wasDefault && newAddrs.length > 0) {
        newAddrs[0].isDefault = true
      }
      saveAddressesToStorage(newAddrs)
    }
  }

  const handleSetDefault = (index) => {
    const newAddrs = savedAddresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }))
    saveAddressesToStorage(newAddrs)
  }

  const handleLocationSelect = (loc) => {
    setAddressForm(prev => ({ ...prev, lat: loc.lat, lng: loc.lng }))
    setLocationError('')
  }

  const handleSaveAddress = () => {
    if (!addressForm.name || !addressForm.mobile || !addressForm.address) {
      return alert("Please fill name, mobile, and complete address.")
    }
    if (!addressForm.lat || !addressForm.lng) {
      setLocationError("Please select a location on the map.")
      return
    }

    const newAddrs = [...savedAddresses]
    if (editingIndex !== null) {
      newAddrs[editingIndex] = addressForm
    } else {
      newAddrs.push({
        ...addressForm,
        isDefault: newAddrs.length === 0
      })
    }

    saveAddressesToStorage(newAddrs)
    setIsModalOpen(false)
  }

  if (!mounted || authLoading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF5E9]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#8B5E3C]" />
        <p className="text-[#1A4D2E] font-bold tracking-widest uppercase text-sm" style={{ fontFamily: "var(--font-outfit)" }}>Loading profile...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF5E9] pb-24 font-outfit selection:bg-[#8B5E3C] selection:text-white">
      <style jsx global>{`
        @media (min-width: 1024px) {
          header, footer { display: none !important; }
        }
        @media (max-width: 1023px) {
          footer { display: none !important; }
        }
        .font-playfair { font-family: var(--font-playfair); }
        .font-outfit { font-family: var(--font-outfit); }
      `}</style>

      {/* Premium Header/Back Bar */}
      <div className="hidden lg:block bg-[#FDFBF7] border-b border-[#E8E1D5] sticky top-0 z-40 shadow-[0_2px_15px_rgba(139,94,60,0.05)] backdrop-blur-md bg-[#FDFBF7]/90 mb-8 lg:mb-12">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-5 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[#8B5E3C] hover:text-[#1A4D2E] transition-colors font-bold text-sm tracking-widest uppercase" 
          >
            <ChevronLeft className="w-5 h-5" /> Back to Home
          </Link>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A4D2E]/10 border border-[#1A4D2E]/20">
            <ShieldCheck className="w-4 h-4 text-[#1A4D2E]" />
            <span className="text-xs font-bold text-[#1A4D2E] tracking-widest uppercase font-outfit">My Account</span>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 lg:px-8 pt-24 lg:pt-0">
        
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1A4D2E] font-playfair">Welcome back, {user.name.split(' ')[0]}</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-[#FDFBF7] text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 font-bold rounded-2xl transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Profile Card & Saved Address */}
          <div className="lg:col-span-4 space-y-8">
            <ProfileHeader user={user} />
            <AddressManager 
              savedAddresses={savedAddresses}
              handleOpenEditModal={handleOpenEditModal}
              handleDeleteAddress={handleDeleteAddress}
              handleSetDefault={handleSetDefault}
              handleOpenAddModal={handleOpenAddModal}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              editingIndex={editingIndex}
              addressForm={addressForm}
              setAddressForm={setAddressForm}
              locationError={locationError}
              handleLocationSelect={handleLocationSelect}
              handleSaveAddress={handleSaveAddress}
            />
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-8">
            <OrderHistory orders={orders} loadingOrders={loadingOrders} />
          </div>
          
        </div>
      </div>
    </div>
  )
}
