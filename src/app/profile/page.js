"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { User, Phone, MapPin, Package, Clock, ShieldCheck, Loader2, ChevronRight, LogOut, CheckCircle2, Plus, Edit2, Trash2, X, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { MapPicker } from '@/components/MapPicker'
import axios from 'axios'

// Same floating input component used in checkout
const FloatingInput = ({ label, value, onChange, placeholder, type = 'text', required = false }) => (
  <div className="relative group">
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="peer w-full bg-[#FDFBF7] border-b-2 border-[#E8E1D5] rounded-t-xl px-5 pt-7 pb-3 text-[#1A4D2E] font-medium focus:outline-none focus:border-[#8B5E3C] focus:bg-[#FAF5E9] transition-all shadow-sm"
      placeholder=" "
    />
    <label 
      className="absolute text-[#8B5E3C]/60 font-medium duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#8B5E3C]" 
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      {label} {required && '*'}
    </label>
  </div>
)

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

  const handleLocationSelect = (lat, lng) => {
    setAddressForm(prev => ({ ...prev, lat, lng }))
    setLocationError('')
  }

  const handleSaveAddress = () => {
    if (!addressForm.lat || !addressForm.lng) return setLocationError("Please pin your location on the map.")
    if (!addressForm.name || !addressForm.mobile || !addressForm.address) return alert("Please fill all required details (Name, Mobile, Address).")
    
    const newAddrs = [...savedAddresses]
    if (editingIndex !== null) {
      newAddrs[editingIndex] = { ...addressForm, isDefault: newAddrs[editingIndex].isDefault }
    } else {
      const isDefault = newAddrs.length === 0
      newAddrs.push({ ...addressForm, isDefault })
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PREPARING': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'OUT_FOR_DELIVERY': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

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

      {/* Address Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A4D2E]/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#FDFBF7] rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden border border-[#E8E1D5] my-8 relative">
            <div className="flex items-center justify-between p-6 lg:p-8 border-b border-[#E8E1D5]">
              <h2 className="text-3xl font-bold text-[#1A4D2E] font-playfair">{editingIndex !== null ? 'Edit Address' : 'Add New Address'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#FAF5E9] rounded-full transition-colors text-[#8B5E3C]">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Map Column */}
              <div className="space-y-4">
                <div className="h-[300px] lg:h-[450px] w-full rounded-[2rem] overflow-hidden border border-[#E8E1D5] shadow-sm relative">
                  <MapPicker 
                    error={locationError} 
                    onLocationSelect={handleLocationSelect} 
                    initialPosition={addressForm.lat && addressForm.lng ? [addressForm.lat, addressForm.lng] : null} 
                  />
                </div>
                {locationError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 text-sm font-medium">{locationError}</p>
                  </div>
                )}
                <p className="text-sm text-[#8B5E3C] font-medium"><MapPin className="w-4 h-4 inline mr-1" /> Pin your exact location on the map.</p>
              </div>

              {/* Form Column */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FloatingInput 
                    label="Full Name" 
                    value={addressForm.name} 
                    onChange={e => setAddressForm(f => ({ ...f, name: e.target.value }))} 
                    required 
                  />
                  <FloatingInput 
                    label="Mobile Number" 
                    value={addressForm.mobile} 
                    onChange={e => setAddressForm(f => ({ ...f, mobile: e.target.value }))} 
                    type="tel"
                    required 
                  />
                </div>
                
                <FloatingInput 
                  label="Complete Address (Flat, Building, Street)" 
                  value={addressForm.address} 
                  onChange={e => setAddressForm(f => ({ ...f, address: e.target.value }))} 
                  required 
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FloatingInput 
                    label="Landmark (Optional)" 
                    value={addressForm.landmark || ''} 
                    onChange={e => setAddressForm(f => ({ ...f, landmark: e.target.value }))} 
                  />
                  <FloatingInput 
                    label="Delivery Notes (Optional)" 
                    value={addressForm.notes || ''} 
                    onChange={e => setAddressForm(f => ({ ...f, notes: e.target.value }))} 
                  />
                </div>

                <div className="pt-6 border-t border-[#E8E1D5] mt-auto">
                  <button
                    onClick={handleSaveAddress}
                    className="w-full py-5 bg-[#8B5E3C] text-white rounded-2xl font-bold text-lg hover:bg-[#734A2E] transition-all shadow-[0_8px_25px_rgba(139,94,60,0.25)] hover:-translate-y-1"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
            
            {/* Personal Details */}
            <div className="bg-[#FDFBF7] rounded-[2.5rem] p-8 shadow-sm border border-[#E8E1D5] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5E3C]/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#1A4D2E] text-white flex items-center justify-center font-playfair text-3xl font-bold shadow-inner">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1A4D2E] font-playfair">{user.name}</h3>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 pb-4 border-b border-[#E8E1D5]">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5E9] flex items-center justify-center shrink-0 border border-[#E8E1D5]">
                    <Phone className="w-5 h-5 text-[#1A4D2E]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8B5E3C] uppercase tracking-widest font-bold mb-1">Phone Number</p>
                    <p className="font-bold text-[#1A4D2E] text-lg">{user.phone}</p>
                  </div>
                </div>
                
                {user.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF5E9] flex items-center justify-center shrink-0 border border-[#E8E1D5]">
                      <User className="w-5 h-5 text-[#1A4D2E]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8B5E3C] uppercase tracking-widest font-bold mb-1">Email</p>
                      <p className="font-bold text-[#1A4D2E]">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Addresses Manager */}
            <div className="bg-[#FDFBF7] rounded-[2.5rem] p-8 shadow-sm border border-[#E8E1D5]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#1A4D2E] font-playfair flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-[#8B5E3C]" /> Addresses
                </h3>
                <span className="text-[#8B5E3C] font-bold text-sm bg-[#FAF5E9] px-3 py-1 rounded-full border border-[#E8E1D5]">
                  {savedAddresses.length}/5
                </span>
              </div>
              
              <div className="space-y-4">
                {savedAddresses.length > 0 ? (
                  savedAddresses.map((addr, index) => (
                    <div key={index} className={`p-5 rounded-2xl border transition-all ${addr.isDefault ? 'bg-[#FAF5E9] border-[#8B5E3C]/30 shadow-sm' : 'bg-white border-[#E8E1D5]'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {addr.isDefault && <CheckCircle2 className="w-4 h-4 text-[#8B5E3C]" />}
                          <p className="font-bold text-[#1A4D2E] text-lg">{addr.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenEditModal(index)} className="p-1.5 text-[#8B5E3C] hover:bg-[#E8E1D5]/50 rounded-lg transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteAddress(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-[#8B5E3C] font-medium text-sm mb-1">{addr.mobile}</p>
                      <p className="text-[#1A4D2E]/70 text-sm leading-relaxed mb-3 break-words">
                        {addr.address}
                        {addr.landmark && <><br/>Landmark: {addr.landmark}</>}
                      </p>

                      {!addr.isDefault && (
                        <button 
                          onClick={() => handleSetDefault(index)}
                          className="text-xs font-bold text-[#8B5E3C] uppercase tracking-widest hover:text-[#1A4D2E] transition-colors"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-[#FAF5E9] rounded-2xl border border-dashed border-[#E8E1D5]">
                    <p className="text-[#8B5E3C] font-medium">No addresses saved.</p>
                  </div>
                )}

                {savedAddresses.length < 5 && (
                  <button 
                    onClick={handleOpenAddModal}
                    className="w-full flex items-center justify-center gap-2 py-4 mt-2 border-2 border-dashed border-[#8B5E3C]/30 text-[#8B5E3C] font-bold rounded-2xl hover:bg-[#FAF5E9] hover:border-[#8B5E3C]/60 transition-all uppercase tracking-widest text-sm"
                  >
                    <Plus className="w-5 h-5" /> Add New Address
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-8">
            <div className="bg-[#FDFBF7] rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-[#E8E1D5] min-h-[600px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[#1A4D2E] font-playfair flex items-center gap-3">
                  <Package className="w-7 h-7 text-[#8B5E3C]" /> Order History
                </h2>
                <span className="bg-[#FAF5E9] text-[#8B5E3C] font-bold px-4 py-2 rounded-xl text-sm border border-[#E8E1D5]">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#8B5E3C]">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p className="font-bold uppercase tracking-widest text-sm">Fetching your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto bg-[#FAF5E9] rounded-full flex items-center justify-center mb-6 border border-[#E8E1D5]">
                    <Package className="w-10 h-10 text-[#8B5E3C]/50" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A4D2E] font-playfair mb-2">No orders yet</h3>
                  <p className="text-[#8B5E3C] mb-8">Looks like you haven't placed any orders with us.</p>
                  <Link 
                    href="/menu" 
                    className="inline-flex items-center justify-center gap-2 bg-[#8B5E3C] text-white px-8 py-4 rounded-full font-bold hover:bg-[#734A2E] transition-all shadow-[0_8px_25px_rgba(139,94,60,0.25)] hover:-translate-y-1"
                  >
                    Start Ordering <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                      
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E8E1D5]/50">
                        <div>
                          <p className="text-xs font-bold text-[#8B5E3C] uppercase tracking-widest mb-1">Order #{order.orderNumber}</p>
                          <p className="text-[#1A4D2E]/70 flex items-center gap-2 text-sm font-medium">
                            <Clock className="w-4 h-4" /> 
                            {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Delivery Boy Info */}
                      {order.assignedDeliveryBoy && (
                        <div className="bg-[#FAF5E9] border border-[#E8E1D5] rounded-2xl p-4 mb-6 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#1A4D2E]/10 rounded-full flex items-center justify-center text-[#1A4D2E]">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#8B5E3C] uppercase tracking-widest mb-0.5">Assigned Delivery Partner</p>
                              <p className="font-bold text-[#1A4D2E]">{order.assignedDeliveryBoy.name}</p>
                            </div>
                          </div>
                          {order.assignedDeliveryBoy.phone && (
                            <a 
                              href={`tel:${order.assignedDeliveryBoy.phone}`}
                              className="w-10 h-10 bg-[#1A4D2E] text-white rounded-full flex items-center justify-center hover:bg-[#11331e] shadow-md transition-colors shrink-0"
                              title="Call Delivery Partner"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Order Items */}
                      <div className="space-y-4 mb-6">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-[#1A4D2E] text-lg font-playfair">
                                <span className="text-[#8B5E3C] mr-2">{item.quantity}x</span> {item.name}
                              </p>
                              {item.addons?.length > 0 && (
                                <p className="text-[#1A4D2E]/60 text-sm ml-7">
                                  + {item.addons.map(a => a.name).join(', ')}
                                </p>
                              )}
                            </div>
                            <span className="font-bold text-[#8B5E3C] font-outfit">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="flex flex-col gap-3 pt-6 border-t border-[#E8E1D5]/50 bg-[#FAF5E9]/50 -mx-6 -mb-6 px-6 py-4 rounded-b-3xl">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#8B5E3C] uppercase tracking-widest">Payment Status</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-widest ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                            {order.paymentStatus || 'PENDING'}
                          </span>
                        </div>
                        {order.razorpayPaymentId && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#8B5E3C] uppercase tracking-widest">Transaction ID</span>
                            <span className="text-xs font-mono text-[#8B5E3C]">{order.razorpayPaymentId}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-[#E8E1D5]/50">
                          <span className="text-sm font-bold text-[#1A4D2E] uppercase tracking-widest">Total Amount</span>
                          <span className="text-2xl font-bold text-[#1A4D2E] font-outfit">₹{order.totalAmount}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Mobile Logout Button */}
        <div className="mt-8 mb-4 sm:hidden">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#FDFBF7] text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 font-bold rounded-2xl transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>
    </div>
  )
}
