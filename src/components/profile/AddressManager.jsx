import { MapPin, CheckCircle2, Edit2, Trash2, Plus, X, AlertCircle } from 'lucide-react'
import FloatingInput from '@/components/FloatingInput'
import { MapPicker } from '@/components/MapPicker'

export default function AddressManager({
  savedAddresses,
  handleOpenEditModal,
  handleDeleteAddress,
  handleSetDefault,
  handleOpenAddModal,
  isModalOpen,
  setIsModalOpen,
  editingIndex,
  addressForm,
  setAddressForm,
  locationError,
  handleLocationSelect,
  handleSaveAddress
}) {
  return (
    <>
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
    </>
  )
}
