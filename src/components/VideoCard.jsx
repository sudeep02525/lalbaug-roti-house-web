import { useRef } from "react"
import { Play } from "lucide-react"

export default function VideoCard({ video, onClick }) {
  const videoRef = useRef(null)

  return (
    <div 
      className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_-15px_rgba(22,163,74,0.2)] hover:-translate-y-2 transition-all duration-500 border border-[#E6DCCF] cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0
        }
      }}
    >
      <div className="relative aspect-video w-full bg-black group-hover:scale-[1.02] transition-transform duration-700">
        <video
          ref={videoRef}
          src={`${process.env.NEXT_PUBLIC_API_URL}${video.url}`}
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:bg-[#16A34A]/90 group-hover:scale-110 transition-all duration-500">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-outfit)" }}>{video.title}</h3>
      </div>
    </div>
  )
}
