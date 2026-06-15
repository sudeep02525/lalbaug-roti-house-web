import { Plus, CheckCircle2, MapPin, ArrowRight } from 'lucide-react'

export default function AddressSelector({
  savedAddresses,
  selectedAddressIndex,
  handleSelectSavedAddress,
  setShowNewAddressForm,
  handleProceedToBillingFromSaved,
  storeStatus
}) {
  return (
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
  )
}
