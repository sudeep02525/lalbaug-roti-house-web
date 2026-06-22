import { Star, X } from "lucide-react"

import { Skeleton } from '@/components/ui/Skeleton'

export default function ReviewsSection({ 
  reviews, 
  loadingReviews,
  showReviewModal, 
  setShowReviewModal, 
  reviewForm, 
  setReviewForm, 
  handleReviewSubmit, 
  submittingReview 
}) {
  if (loadingReviews) {
    return (
      <section className="bg-white py-24 relative overflow-hidden border-t border-[#E6DCCF]">
        <div className="container max-w-7xl relative z-10 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-12 h-[2px] bg-[#16A34A]/20"></span>
                <Skeleton className="h-10 w-64 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-40 rounded-md mt-4" />
            </div>
            <Skeleton className="h-12 w-48 rounded-full" />
          </div>
        </div>
        <div className="w-full relative">
          <div className="flex overflow-hidden gap-6 px-4 md:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2))] pb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#FAF8F5] p-8 rounded-3xl min-w-[320px] max-w-[320px] md:min-w-[400px] md:max-w-[400px] shrink-0 border border-[#EAE5D9] shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(j => <Skeleton key={j} className="w-5 h-5 rounded-full" />)}
                  </div>
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <div className="flex items-center gap-4 mt-auto">
                  <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-1 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) return null;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((a, r) => a + (r.rating || 5), 0) / reviews.length)
    : 0;
  const displayRating = averageRating.toFixed(1);
  const roundedRating = Math.max(0, Math.min(5, Math.round(averageRating)));

  return (
    <>
      {/* ── CUSTOMER REVIEWS (PREMIUM CAROUSEL) ── */}
      <section className="bg-white py-24 relative overflow-hidden border-t border-[#E6DCCF]">
        <div className="container max-w-7xl relative z-10 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-12 h-[2px] bg-[#16A34A]"></span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-playfair)" }}>Real Feedback</h2>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex gap-1">
                  {[...Array(roundedRating)].map((_, i) => (
                    <Star key={`full-${i}`} className="w-5 h-5 text-[#16A34A] fill-[#16A34A]" />
                  ))}
                  {[...Array(5 - roundedRating)].map((_, i) => (
                    <Star key={`empty-${i}`} className="w-5 h-5 text-[#E6DCCF]" />
                  ))}
                </div>
                <p className="text-lg font-bold text-[#8B5A2B]" style={{ fontFamily: "var(--font-outfit)" }}>
                  {displayRating} / 5.0
                  <span className="font-normal text-sm ml-2">({reviews.length} Reviews)</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#114D3C] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#16A34A] hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_20px_rgba(17,77,60,0.2)] shrink-0"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              <Star className="w-4 h-4 text-white fill-white" />
              Write a Review
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Carousel */}
        <div className="w-full relative">
          <div className="flex overflow-x-auto gap-6 px-4 md:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2))] pb-12 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            
            {reviews.map((t, i) => (
              <div 
                key={i} 
                className="bg-[#FAF8F5] p-8 rounded-3xl min-w-[320px] max-w-[320px] md:min-w-[400px] md:max-w-[400px] shrink-0 snap-center border border-[#EAE5D9] shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[...Array(t.rating || 5)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 text-[#16A34A] fill-[#16A34A]" />
                    ))}
                    {[...Array(5 - (t.rating || 5))].map((_, j) => (
                      <Star key={j} className="w-5 h-5 text-[#E6DCCF]" />
                    ))}
                  </div>
                  {/* Quote Icon watermark */}
                  <span className="text-6xl text-[#16A34A] opacity-10 absolute top-4 right-6 font-serif leading-none">"</span>
                </div>
                
                <p className="text-[#114D3C] text-lg leading-relaxed mb-8 italic min-h-[80px]" style={{ fontFamily: "var(--font-playfair)" }}>"{t.comment}"</p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-[#16A34A] text-xl border border-[#E6DCCF] shadow-sm">
                    {t.name?.[0]?.toUpperCase() || 'G'}
                  </div>
                  <div>
                    <p className="font-bold text-[#114D3C]" style={{ fontFamily: "var(--font-outfit)" }}>{t.name}</p>
                    <p className="text-xs text-[#8B5A2B] font-medium mt-0.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-outfit)" }}>
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Verified Customer"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}>
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="absolute top-6 right-6 text-[#8B5A2B] hover:text-[#114D3C] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-[#114D3C] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Share Your Experience</h3>
                <p className="text-[#8B5A2B]" style={{ fontFamily: "var(--font-outfit)" }}>We'd love to hear about your meal!</p>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#114D3C] mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Your Name</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full bg-[#FAF8F5] border border-[#E6DCCF] rounded-xl px-4 py-3 text-[#114D3C] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#114D3C] mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className="focus:outline-none"
                      >
                        <Star className={`w-8 h-8 transition-colors ${reviewForm.rating >= star ? 'text-[#16A34A] fill-[#16A34A]' : 'text-[#E6DCCF]'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#114D3C] mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Your Comment</label>
                  <textarea
                    required
                    maxLength={500}
                    rows={4}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    className="w-full bg-[#FAF8F5] border border-[#E6DCCF] rounded-xl px-4 py-3 text-[#114D3C] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all resize-none"
                    placeholder="The food was amazing..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-[#16A34A] text-white font-bold py-4 rounded-xl hover:bg-[#15803D] transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(22,163,74,0.3)]"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
