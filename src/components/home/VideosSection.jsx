import VideoCard from '@/components/VideoCard'
import { X } from "lucide-react"

import { Skeleton } from '@/components/ui/Skeleton'

export default function VideosSection({ videos, loadingVideos, selectedVideo, setSelectedVideo }) {
  if (loadingVideos) {
    return (
      <section className="bg-white py-24 border-t border-[#E6DCCF]">
        <div className="container max-w-7xl">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="flex items-center gap-4 mb-3">
              <span className="w-12 h-[2px] bg-[#16A34A]/20"></span>
              <Skeleton className="h-4 w-32 rounded-full" />
              <span className="w-12 h-[2px] bg-[#16A34A]/20"></span>
            </div>
            <Skeleton className="h-12 w-80 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-[#EAE5D9]">
                <div className="relative aspect-video w-full bg-[#FAF8F5] animate-pulse">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center">
                       <div className="w-6 h-6 bg-[#EAE5D9] rounded-sm"></div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (videos.length === 0) return null;

  return (
    <section className="bg-white py-24 border-t border-[#E6DCCF]">
      <div className="container max-w-7xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="w-12 h-[2px] bg-[#16A34A]"></span>
            <span className="text-sm font-bold text-[#16A34A] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-outfit)" }}>Behind The Scenes</span>
            <span className="w-12 h-[2px] bg-[#16A34A]"></span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-playfair)" }}>See Us In Action</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} onClick={() => setSelectedVideo(video)} />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedVideo(null)}>
          <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
            <video
              src={`${process.env.NEXT_PUBLIC_API_URL}${selectedVideo.url}`}
              controls
              autoPlay
              className="w-full h-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  )
}
