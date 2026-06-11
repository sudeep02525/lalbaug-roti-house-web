"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { MapPicker } from '@/components/MapPicker'
import { getImageUrl } from '@/components/ProductCard'
import { CheckCircle2, AlertCircle, CreditCard, MapPin, Loader2, ChevronLeft, ShieldCheck, ArrowRight, Receipt, Map, Plus } from 'lucide-react'
import axios from 'axios'

const KITCHEN_LAT = 18.9910
const KITCHEN_LNG = 72.8356

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1))
}

function getDeliveryCharge(distance) {
  if (distance <= 3) return 20
  if (distance <= 5) return 30
  if (distance <= 8) return 50
  if (distance <= 12) return 70
  if (distance <= 20) return 100
  return -1
}

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
      className="absolute text-[#8B5E3C]/60 font-medium duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#8B5E3C] pointer-events-none" 
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      {label} {required && '*'}
    </label>
  </div>
)

export default function CheckoutPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { items, subtotal, calculateItemTotal, clearCart, mounted, storeStatus } = useCart()

  // 1 = Delivery Address
  // 2 = Billing Details & Payment
  const [step, setStep] = useState(1) // 1: Delivery, 2: Billing
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [isOrderSuccess, setIsOrderSuccess] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null)

  const [formData, setFormData] = useState({ name: '', mobile: '', address: '', landmark: '', notes: '' })
  const [loc, setLoc] = useState({ detected: false, lat: null, lng: null, distanceKm: 0 })
  const [initialPos, setInitialPos] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Load saved addresses
  useEffect(() => {
    if (user && mounted) {
      const arr = localStorage.getItem('savedAddresses')
      let loadedAddresses = []
      if (arr) {
        try {
          loadedAddresses = JSON.parse(arr)
          setSavedAddresses(loadedAddresses)
        } catch (e) { }
      }

      if (loadedAddresses.length === 0) {
        setShowNewAddressForm(true)
        setFormData(prev => ({ ...prev, name: user.name || '', mobile: user.phone || '' }))
      } else {
        // Pre-select default address
        const defaultIdx = loadedAddresses.findIndex(a => a.isDefault)
        if (defaultIdx !== -1) {
          handleSelectSavedAddress(loadedAddresses[defaultIdx], defaultIdx)
        } else {
          handleSelectSavedAddress(loadedAddresses[0], 0)
        }
      }
      setDataLoaded(true)
    }
  }, [user, mounted])

  // Redirect to cart if empty
  useEffect(() => {
    if (mounted && items.length === 0 && !isOrderSuccess) router.push('/cart')
  }, [mounted, items, router, isOrderSuccess])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push('/signup?redirect=/checkout')
    }
  }, [user, authLoading, mounted, router])

  if (!mounted || items.length === 0 || authLoading || !user || !dataLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF5E9]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#8B5E3C]" />
        <p className="text-[#1A4D2E] font-bold tracking-widest uppercase text-sm" style={{ fontFamily: "var(--font-outfit)" }}>Loading checkout...</p>
      </div>
    </div>
  )

  const deliveryCharge = loc.detected ? getDeliveryCharge(loc.distanceKm) : 0
  const isDeliverable = loc.detected && deliveryCharge !== -1
  const grandTotal = subtotal + (isDeliverable ? deliveryCharge : 0)

  function handleSelectSavedAddress(addr, index) {
    setSelectedAddressIndex(index)
    setFormData({
      name: addr.name,
      mobile: addr.mobile,
      address: addr.address,
      landmark: addr.landmark || '',
      notes: addr.notes || ''
    })
    const d = calculateDistance(KITCHEN_LAT, KITCHEN_LNG, addr.lat, addr.lng)
    setLoc({ detected: true, lat: addr.lat, lng: addr.lng, distanceKm: d })
  }

  const handleLocationSelect = (lat, lng) => {
    const d = calculateDistance(KITCHEN_LAT, KITCHEN_LNG, lat, lng)
    setLoc({ detected: true, lat, lng, distanceKm: d })
    setLocationError('')
  }

  const handleProceedToBillingFromForm = () => {
    if (!loc.detected) return setLocationError('Please pin your delivery location on the map.')
    if (!isDeliverable) return alert('Sorry, we do not deliver to this location.')
    if (!formData.name || !formData.mobile || !formData.address) return alert('Please fill all required details (Name, Mobile, Address).')
    
    // Save new address locally
    const newAddr = {
      ...formData,
      lat: loc.lat,
      lng: loc.lng,
      isDefault: savedAddresses.length === 0
    }
    const updatedAddrs = [...savedAddresses, newAddr]
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddrs))
    setSavedAddresses(updatedAddrs)
    setShowNewAddressForm(false)
    setStep(2)
  }

  const handleProceedToBillingFromSaved = () => {
    if (!loc.detected) return alert("Please select a valid address.")
    if (!isDeliverable) return alert('Sorry, we do not deliver to the selected location.')
    setStep(2)
  }

  const handlePay = async (e) => {
    e.preventDefault()

    setLoading(true)
    try {
      const payload = {
        paymentMethod,
        items: items.map(item => ({
          productId: item.product.id || item.product._id,
          variantId: item.variant?.id || item.variant?._id || 'base',
          quantity: item.quantity,
          addons: item.addons || [],
        })),
        address: {
          customerName: formData.name,
          phone: formData.mobile,
          addressLine1: formData.address,
          landmark: formData.landmark,
          city: 'Mumbai',
          pincode: '400012',
          latitude: loc.lat,
          longitude: loc.lng,
        },
        notes: formData.notes,
      }

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`, payload, {
        headers: { 
          'Authorization': `Bearer ${user.token}`
        },
        validateStatus: () => true
      })
      const data = res.data
      if (res.status !== 200 && res.status !== 201) throw new Error(data.message || 'Failed to create order')

      const { razorpayOrderId, amount, currency, keyId, order } = data.data

      const loadScript = () => new Promise(resolve => {
        if (window.Razorpay) return resolve(true)
        const s = document.createElement('script')
        s.src = 'https://checkout.razorpay.com/v1/checkout.js'
        s.onload = () => resolve(true)
        s.onerror = () => resolve(false)
        document.body.appendChild(s)
      })

      if (!(await loadScript())) throw new Error('Failed to load payment gateway')

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: 'Lalbaug Roti House',
        description: 'Premium Food Order',
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, {
              headers: { 
                'Authorization': `Bearer ${user.token}`
              },
              validateStatus: () => true
            })
            if (verifyRes.status !== 200 && verifyRes.status !== 201) throw new Error('Payment verification failed')
            
            setIsOrderSuccess(true)
            clearCart()
            router.push(`/order-success?id=${order.orderNumber}&oid=${order._id}&total=${grandTotal}&addr=${encodeURIComponent(formData.address)}&paymentId=${response.razorpay_payment_id}`)
          } catch (err) {
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: { name: formData.name, contact: formData.mobile, email: user.email },
        theme: { color: '#1A4D2E' },
        modal: {
          ondismiss: async function() {
            setLoading(false);
            try {
              await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${order._id}/cancel`, {
                headers: { 'Authorization': `Bearer ${user.token}` },
                validateStatus: () => true
              });
            } catch (err) {
              console.error('Failed to cancel order:', err);
            }
          }
        }
      })
      rzp.open()
    } catch (err) {
      alert(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF5E9] pb-24 font-outfit selection:bg-[#8B5E3C] selection:text-white">
      <style jsx global>{`
        header, footer { display: none !important; }
        .font-playfair { font-family: var(--font-playfair); }
        .font-outfit { font-family: var(--font-outfit); }
      `}</style>
      
      {/* Store Closed Global Banner */}
      {!storeStatus?.isOpen && storeStatus?.message && (
        <div className="w-full bg-[#E53E3E] text-white text-center py-2.5 px-4 text-xs md:text-sm font-bold shadow-sm flex items-center justify-center gap-2 tracking-wide sticky top-0 z-50" style={{ fontFamily: "var(--font-outfit)" }}>
          <AlertCircle className="w-4 h-4" />
          <span>{storeStatus.message}</span>
        </div>
      )}
      
      {/* Premium Header */}
      <div className={`bg-[#FDFBF7] border-b border-[#E8E1D5] sticky z-40 shadow-[0_2px_15px_rgba(139,94,60,0.05)] backdrop-blur-md bg-[#FDFBF7]/90 ${!storeStatus?.isOpen ? 'top-[40px]' : 'top-0'}`}>
        <div className="container max-w-6xl mx-auto px-4 lg:px-8 py-5 flex items-center justify-between">
          <button 
            onClick={() => step === 2 ? setStep(1) : router.back()} 
            className="flex items-center gap-2 text-[#8B5E3C] hover:text-[#1A4D2E] transition-colors font-bold text-sm tracking-widest uppercase" 
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          
          <div className="flex items-center gap-4">
            <div className={`font-bold ${step === 1 ? 'text-[#1A4D2E] drop-shadow-sm' : 'text-[#8B5E3C]/50'} text-xs sm:text-sm tracking-widest uppercase flex items-center gap-2 transition-colors`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${step >= 1 ? 'bg-[#1A4D2E]' : 'bg-[#E8E1D5]'}`}>1</div>
              <span className="hidden sm:inline">Delivery</span>
            </div>
            <div className={`w-8 sm:w-16 h-px ${step === 2 ? 'bg-[#1A4D2E]' : 'bg-[#E8E1D5]'} transition-colors`}></div>
            <div className={`font-bold ${step === 2 ? 'text-[#1A4D2E] drop-shadow-sm' : 'text-[#8B5E3C]/50'} text-xs sm:text-sm tracking-widest uppercase flex items-center gap-2 transition-colors`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${step === 2 ? 'bg-[#1A4D2E]' : 'bg-[#E8E1D5]'}`}>2</div>
              <span className="hidden sm:inline">Billing</span>
            </div>
          </div>
          
          <div className="w-20 flex justify-end">
            <div className="flex items-center gap-2 text-[#8B5E3C] text-xs font-bold uppercase tracking-widest bg-[#8B5E3C]/10 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4" /> <span className="hidden sm:inline">Secure</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 lg:px-8 pt-8 lg:pt-12">
        {step === 1 ? (
          // STEP 1: DELIVERY ADDRESS
          <div className="animate-fade-in">
            {savedAddresses.length > 0 && !showNewAddressForm ? (
              // SHOW SAVED ADDRESSES TO SELECT
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-[#1A4D2E] font-playfair mb-3">Select Address</h1>
                    <p className="text-[#8B5E3C] text-lg">Where should we deliver your order?</p>
                  </div>
                  {savedAddresses.length < 5 && (
                    <button 
                      onClick={() => setShowNewAddressForm(true)}
                      className="hidden sm:flex items-center gap-2 px-6 py-3 bg-[#FDFBF7] text-[#8B5E3C] font-bold rounded-2xl hover:bg-[#FAF5E9] border border-[#E8E1D5] transition-all"
                    >
                      <Plus className="w-5 h-5" /> Add New Address
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedAddresses.map((addr, index) => (
                    <div 
                      key={index} 
                      onClick={() => handleSelectSavedAddress(addr, index)}
                      className={`relative cursor-pointer p-6 sm:p-8 rounded-[2rem] border-2 transition-all duration-300 overflow-hidden ${selectedAddressIndex === index ? 'bg-white border-[#16A34A] shadow-[0_8px_30px_rgba(22,163,74,0.12)] -translate-y-1' : 'bg-[#FDFBF7] border-[#E8E1D5] hover:border-[#1A4D2E]/30 hover:shadow-md'}`}
                    >
                      {/* Selection Indicator Badge */}
                      {selectedAddressIndex === index && (
                        <div className="absolute top-0 right-0 bg-[#16A34A] text-white px-4 py-2 rounded-bl-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                          <CheckCircle2 className="w-4 h-4" /> Selected
                        </div>
                      )}

                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedAddressIndex === index ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#E8E1D5]/50 text-[#8B5E3C]'}`}>
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0 pr-16">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-[#1A4D2E] text-xl truncate">{addr.name}</h3>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold bg-[#E8E1D5] text-[#8B5E3C] px-2.5 py-1 rounded-full uppercase tracking-widest shrink-0">Default</span>
                            )}
                          </div>
                          <p className="text-[#8B5E3C] font-semibold text-sm tracking-wide">{addr.mobile}</p>
                        </div>
                      </div>
                      
                      <div className="pl-16">
                        <p className="text-[#1A4D2E]/70 leading-relaxed mb-6 break-words break-all sm:break-words whitespace-pre-wrap">{addr.address}</p>
                        
                        {selectedAddressIndex === index && (
                          <div className="animate-fade-in">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleProceedToBillingFromSaved(); }}
                              disabled={!storeStatus?.isOpen}
                              className={`w-full py-4 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${!storeStatus?.isOpen ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#16A34A] hover:bg-[#15803d] shadow-[0_8px_20px_rgba(22,163,74,0.25)] hover:-translate-y-0.5'}`}
                            >
                              {!storeStatus?.isOpen ? 'Store Closed' : <><>Deliver Here</> <ArrowRight className="w-5 h-5" /></>}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {savedAddresses.length < 5 && (
                  <button 
                    onClick={() => setShowNewAddressForm(true)}
                    className="sm:hidden w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-[#FDFBF7] text-[#8B5E3C] font-bold rounded-2xl hover:bg-[#FAF5E9] border border-[#E8E1D5] transition-all"
                  >
                    <Plus className="w-5 h-5" /> Add New Address
                  </button>
                )}
              </div>
            ) : (
              // SHOW ADD NEW ADDRESS FORM & MAP
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left Column: Premium Map */}
                <div className="bg-[#FDFBF7] rounded-[2.5rem] p-4 shadow-2xl shadow-[#8B5E3C]/5 border border-[#E8E1D5] relative overflow-hidden group">
                  <div className="absolute top-8 left-8 z-10 bg-[#FDFBF7]/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/50">
                    <h2 className="text-[#1A4D2E] font-bold flex items-center gap-2 text-sm uppercase tracking-widest"><MapPin className="w-4 h-4 text-[#8B5E3C]" /> Pin Location</h2>
                  </div>
                  <div className="h-[400px] lg:h-[650px] w-full rounded-[2rem] overflow-hidden border border-[#E8E1D5] relative transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(139,94,60,0.15)]">
                    <MapPicker error={locationError} onLocationSelect={handleLocationSelect} initialPosition={initialPos} />
                  </div>
                  
                  {/* Delivery Availability Status Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 z-10">
                    {loc.detected && (
                      <div className={`p-4 rounded-2xl shadow-lg border backdrop-blur-xl flex items-start gap-3 ${isDeliverable ? 'bg-[#FDFBF7]/95 border-[#8B5E3C]/20' : 'bg-red-50/95 border-red-200'}`}>
                        {isDeliverable ? <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-[#8B5E3C]" /> : <AlertCircle className="w-6 h-6 shrink-0 mt-0.5 text-red-600" />}
                        <div>
                          <p className={`font-bold ${isDeliverable ? 'text-[#1A4D2E]' : 'text-red-700'}`}>{isDeliverable ? 'Delivery available to this location' : 'Out of delivery range'}</p>
                          <p className="text-sm mt-1 opacity-80 font-medium text-[#8B5E3C]">
                            {loc.distanceKm} km from our kitchen
                            {isDeliverable && ` • Est. Charge: ₹${deliveryCharge}`}
                          </p>
                        </div>
                      </div>
                    )}
                    {locationError && !loc.detected && (
                      <div className="p-4 rounded-2xl shadow-lg border bg-red-50/95 border-red-200 backdrop-blur-xl flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 shrink-0 text-red-600" />
                        <p className="font-bold text-red-700 text-sm">{locationError}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Premium Form */}
                <div className="lg:pl-4 space-y-8 flex flex-col justify-center min-h-[650px]">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col mb-8">
                      <h1 className="text-4xl lg:text-5xl font-bold text-[#1A4D2E] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>Delivery Address</h1>
                      <p className="text-[#8B5E3C] text-lg" style={{ fontFamily: "var(--font-outfit)" }}>Enter your details to finalize delivery.</p>
                    </div>

                    {!storeStatus?.isOpen && storeStatus?.message && (
                      <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
                        <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                        <p className="font-bold font-outfit">{storeStatus.message}</p>
                      </div>
                    )}
                    {savedAddresses.length > 0 && (
                      <button 
                        onClick={() => setShowNewAddressForm(false)}
                        className="text-[#8B5E3C] font-bold text-sm uppercase tracking-widest hover:text-[#1A4D2E]"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="bg-[#FDFBF7] p-8 lg:p-10 rounded-[2.5rem] border border-[#E8E1D5] shadow-sm">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FloatingInput 
                          label="Full Name" 
                          value={formData.name} 
                          onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} 
                          required 
                        />
                        <FloatingInput 
                          label="Mobile Number" 
                          value={formData.mobile} 
                          onChange={e => setFormData(f => ({ ...f, mobile: e.target.value }))} 
                          type="tel"
                          required 
                        />
                      </div>
                      
                      <FloatingInput 
                        label="Complete Address (Flat, Building, Street)" 
                        value={formData.address} 
                        onChange={e => setFormData(f => ({ ...f, address: e.target.value }))} 
                        required 
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FloatingInput 
                          label="Landmark (Optional)" 
                          value={formData.landmark} 
                          onChange={e => setFormData(f => ({ ...f, landmark: e.target.value }))} 
                        />
                        <FloatingInput 
                          label="Delivery Notes (Optional)" 
                          value={formData.notes} 
                          onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))} 
                        />
                      </div>
                    </div>

                    <div className="mt-10">
                      <button
                        onClick={handleProceedToBillingFromForm}
                        disabled={!storeStatus?.isOpen}
                        className={`w-full flex items-center justify-between px-8 py-5 text-white rounded-2xl font-bold text-lg transition-all duration-300 group ${!storeStatus?.isOpen ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8B5E3C] hover:bg-[#734A2E] shadow-[0_10px_30px_rgba(139,94,60,0.25)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(139,94,60,0.35)]'}`}
                      >
                        <span>{!storeStatus?.isOpen ? 'Store Closed' : 'Save & Proceed to Billing'}</span>
                        {storeStatus?.isOpen && (
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // STEP 2: BILLING DETAILS & PAYMENT (Split Layout)
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Order Items */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-[#1A4D2E]" style={{ fontFamily: "var(--font-playfair)" }}>Review Order</h1>
                <span className="bg-[#FDFBF7] text-[#8B5E3C] font-bold px-4 py-2 rounded-xl text-sm border border-[#E8E1D5]" style={{ fontFamily: "var(--font-outfit)" }}>
                  {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              <div className="bg-[#FDFBF7] rounded-[2.5rem] p-6 lg:p-10 shadow-sm border border-[#E8E1D5]">
                <div className="space-y-8">
                  {items.map((item, index) => {
                    const itemTotal = calculateItemTotal(item)
                    const basePrice = item.variant ? item.variant.price : item.product.price
                    const addonsPrice = item.addons?.reduce((sum, a) => sum + a.price, 0) || 0
                    const originalTotal = (basePrice + addonsPrice) * item.quantity

                    return (
                      <div key={item.cartItemId} className={`flex gap-6 pb-8 ${index !== items.length - 1 ? 'border-b border-[#E8E1D5]' : ''}`}>
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[1.5rem] overflow-hidden border border-[#E8E1D5] bg-[#FAF5E9] shrink-0 relative group shadow-sm">
                          <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="font-bold text-[#1A4D2E] text-xl sm:text-2xl leading-tight mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{item.product.name}</h4>
                          {item.variant && <p className="text-xs sm:text-sm text-[#8B5E3C] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-outfit)" }}>{item.variant.name}</p>}
                          {item.addons?.length > 0 && (
                            <p className="text-xs sm:text-sm text-[#8B5E3C]/70 mb-2 font-medium" style={{ fontFamily: "var(--font-outfit)" }}>
                              With: {item.addons.map(a => a.name).join(', ')}
                            </p>
                          )}
                          <div className="mt-auto inline-flex items-center gap-2 bg-white border border-[#E8E1D5] px-3 py-1.5 rounded-lg w-fit shadow-sm">
                            <span className="text-[10px] text-[#73706A] uppercase tracking-widest font-bold" style={{ fontFamily: "var(--font-outfit)" }}>Qty:</span>
                            <span className="text-[#1A4D2E] font-bold text-base" style={{ fontFamily: "var(--font-outfit)" }}>{item.quantity}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-center">
                          {originalTotal > itemTotal && (
                            <span className="text-sm text-[#E8A359] line-through mb-1 font-medium" style={{ fontFamily: "var(--font-outfit)" }}>₹{originalTotal}</span>
                          )}
                          <span className="font-bold text-2xl sm:text-3xl text-[#1A4D2E] tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>₹{itemTotal}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Payment Summary (Sticky) */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32">
              <div className="bg-[#FDFBF7] rounded-[2.5rem] p-8 lg:p-10 text-[#1A4D2E] shadow-sm relative overflow-hidden border border-[#E8E1D5]">

                <h3 className="text-3xl font-bold mb-8 relative z-10 text-[#8B5E3C]" style={{ fontFamily: "var(--font-playfair)" }}>Payment Summary</h3>
                
                <div className="space-y-4 relative z-10" style={{ fontFamily: "var(--font-outfit)" }}>
                  {(() => {
                    const originalSubtotal = items.reduce((sum, item) => {
                      const basePrice = item.variant ? item.variant.price : item.product.price;
                      const addonsPrice = (item.addons || []).reduce((addSum, add) => addSum + add.price, 0);
                      return sum + ((basePrice + addonsPrice) * item.quantity);
                    }, 0);
                    const totalDiscount = originalSubtotal - subtotal;
                    
                    return (
                      <>
                        <div className="flex justify-between text-[#73706A] pb-4">
                          <span className="text-lg font-medium">Item Total</span>
                          <span className="font-bold text-[#1A4D2E] text-lg">₹{originalSubtotal}</span>
                        </div>
                        {totalDiscount > 0 && (
                          <div className="flex justify-between items-center text-[#16A34A] pb-4">
                            <span className="text-sm font-bold bg-[#16A34A]/10 px-2 py-1 rounded-md border border-[#16A34A]/20 uppercase tracking-widest">Discount Applied</span>
                            <span className="font-bold text-lg">- ₹{totalDiscount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[#73706A] pb-4 border-b border-[#E8E1D5]/50">
                          <span className="text-lg font-medium">Delivery Fee</span>
                          <span className="font-bold text-[#1A4D2E] text-lg">₹{deliveryCharge}</span>
                        </div>
                        
                        <div className="flex justify-between items-end pt-4 mb-6">
                          <div className="flex flex-col">
                            <span className="font-bold uppercase tracking-widest text-xs text-[#8B5E3C] mb-1">To Pay</span>
                            <span className="font-bold text-5xl text-[#16A34A] tracking-tight">₹{grandTotal}</span>
                          </div>
                        </div>
                      </>
                    )
                  })()}

                  <div className="bg-white rounded-xl p-4 border border-[#E8E1D5] mb-6 shadow-sm">
                    <div className="flex items-center gap-3 text-[#1A4D2E]">
                      <Receipt className="w-5 h-5 text-[#8B5E3C]" />
                      <span className="font-bold text-sm tracking-wide">Pay Online (Razorpay)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 relative z-10">
                  {!storeStatus?.isOpen ? (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-3 bg-gray-400 text-white py-5 rounded-2xl font-bold text-xl cursor-not-allowed"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      Store Closed
                    </button>
                  ) : (
                    <button
                      onClick={handlePay}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 bg-[#1A4D2E] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#0B382B] transition-all duration-300 shadow-[0_8px_25px_rgba(26,77,46,0.35)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(26,77,46,0.45)] disabled:opacity-50 disabled:transform-none"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {loading ? (
                        <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
                      ) : (
                        <><CreditCard className="w-6 h-6" /> Pay ₹{grandTotal}</>
                      )}
                    </button>
                  )}
                  <div className="flex items-center justify-center gap-2 text-[#8B5E3C]/80 text-xs font-bold uppercase tracking-widest mt-6" style={{ fontFamily: "var(--font-outfit)" }}>
                    <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" /> 100% Safe & Secure
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
