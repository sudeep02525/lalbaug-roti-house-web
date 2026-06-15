import { MapPin, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import FloatingInput from '@/components/FloatingInput'
import { MapPicker } from '@/components/MapPicker'

export default function AddressForm({
  formData,
  setFormData,
  loc,
  initialPos,
  locationError,
  handleLocationSelect,
  isDeliverable,
  deliveryCharge,
  storeStatus,
  savedAddresses,
  setShowNewAddressForm,
  handleProceedToBillingFromForm
}) {
  return (
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
  )
}
