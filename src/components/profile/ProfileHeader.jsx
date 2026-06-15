import { User, Phone } from 'lucide-react'

export default function ProfileHeader({ user }) {
  if (!user) return null;

  return (
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
  )
}
