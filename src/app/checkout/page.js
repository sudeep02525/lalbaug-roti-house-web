"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { AlertCircle, Loader2, ChevronLeft, ShieldCheck } from 'lucide-react'
import axios from 'axios'

import AddressSelector from '@/components/checkout/AddressSelector'
import AddressForm from '@/components/checkout/AddressForm'
import OrderSummary from '@/components/checkout/OrderSummary'
import PaymentSummary from '@/components/checkout/PaymentSummary'

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

  const handleAddNewAddress = () => {
    // Clear form data for a fresh address entry
    setFormData({
      name: user?.name || '',
      mobile: user?.phone || '',
      address: '',
      landmark: '',
      notes: ''
    })
    setLoc({ detected: false, lat: null, lng: null, distanceKm: 0 })
    setLocationError('')
    setShowNewAddressForm(true)
  }

  const handleCancelNewAddress = () => {
    setShowNewAddressForm(false)
    // Restore previous selection if it exists
    if (selectedAddressIndex !== null && savedAddresses[selectedAddressIndex]) {
      handleSelectSavedAddress(savedAddresses[selectedAddressIndex], selectedAddressIndex)
    }
  }

  const handleLocationSelect = async (lat, lng) => {
    const d = calculateDistance(KITCHEN_LAT, KITCHEN_LNG, lat, lng)
    setLoc({ detected: true, lat, lng, distanceKm: d })
    setLocationError('')

    // Use FREE Nominatim Reverse Geocoding API directly
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      if (!response.ok) {
        throw new Error('Nominatim reverse geocoding failed')
      }
      const data = await response.json()
      if (data && data.display_name) {
        setFormData(prev => ({ ...prev, address: data.display_name }))
      }
    } catch (err) {
      console.error("Reverse Geocoding Error:", err)
    }
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
    // Select the newly added address
    handleSelectSavedAddress(newAddr, updatedAddrs.length - 1)
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
    <div className="min-h-screen bg-[#FAF5E9] pb-12 font-outfit selection:bg-[#8B5E3C] selection:text-white">
      <style jsx global>{`
        body { background-color: #FAF5E9 !important; }
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
              <AddressSelector 
                savedAddresses={savedAddresses}
                selectedAddressIndex={selectedAddressIndex}
                handleSelectSavedAddress={handleSelectSavedAddress}
                handleAddNewAddress={handleAddNewAddress}
                handleProceedToBillingFromSaved={handleProceedToBillingFromSaved}
                storeStatus={storeStatus}
              />
            ) : (
              <AddressForm 
                formData={formData}
                setFormData={setFormData}
                loc={loc}
                initialPos={initialPos}
                locationError={locationError}
                handleLocationSelect={handleLocationSelect}
                isDeliverable={isDeliverable}
                deliveryCharge={deliveryCharge}
                storeStatus={storeStatus}
                savedAddresses={savedAddresses}
                handleCancelNewAddress={handleCancelNewAddress}
                handleProceedToBillingFromForm={handleProceedToBillingFromForm}
              />
            )}
          </div>
        ) : (
          // STEP 2: BILLING DETAILS & PAYMENT
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <OrderSummary items={items} calculateItemTotal={calculateItemTotal} />
            <PaymentSummary 
              items={items}
              subtotal={subtotal}
              deliveryCharge={deliveryCharge}
              grandTotal={grandTotal}
              storeStatus={storeStatus}
              handlePay={handlePay}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  )
}
