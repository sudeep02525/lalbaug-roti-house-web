export default function FloatingInput({ label, value, onChange, placeholder, type = 'text', required = false }) {
  return (
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
        className="absolute pointer-events-none text-[#8B5E3C]/60 font-medium duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 truncate max-w-[calc(133%-2.5rem)] peer-placeholder-shown:max-w-[calc(100%-2.5rem)] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:max-w-[calc(133%-2.5rem)] peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#8B5E3C]" 
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {label} {required && '*'}
      </label>
    </div>
  )
}
