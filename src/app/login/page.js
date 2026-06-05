"use client"
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { ArrowRight, Mail, Lock, Loader2, Leaf, X, ArrowLeft } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotStep, setForgotStep] = useState(1)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotOtp, setForgotOtp] = useState("")
  const [forgotNewPassword, setForgotNewPassword] = useState("")
  const [forgotMessage, setForgotMessage] = useState("")
  const [forgotError, setForgotError] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotTimer, setForgotTimer] = useState(60)
  const [forgotCanResend, setForgotCanResend] = useState(false)

  
  useEffect(() => {
    let interval
    if (showForgotModal && forgotStep === 2 && forgotTimer > 0) {
      interval = setInterval(() => setForgotTimer(prev => prev - 1), 1000)
    } else if (forgotTimer === 0) {
      setForgotCanResend(true)
    }
    return () => clearInterval(interval)
  }, [showForgotModal, forgotStep, forgotTimer])

  const handleResendForgotOtp = async () => {
    if (!forgotCanResend) return
    setForgotLoading(true)
    setForgotError("")
    setForgotMessage("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP")
      setForgotTimer(60)
      setForgotCanResend(false)
      setForgotMessage("OTP resent successfully")
    } catch (err) {
      setForgotError(err.message || "Failed to resend OTP")
    } finally {
      setForgotLoading(false)
    }
  }


  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setForgotError("")
    setForgotMessage("")
    setForgotLoading(true)
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to send OTP")
      setForgotMessage(data.message || "OTP sent to your email")
      setForgotStep(2)
      setForgotTimer(60)
      setForgotCanResend(false)
    } catch (err) {
      setForgotError(err.message)
    } finally {
      setForgotLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setForgotError("")
    setForgotMessage("")
    setForgotLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, newPassword: forgotNewPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to reset password")
      
      setForgotMessage("Password reset successfully! You can now login.")
      setTimeout(() => {
        setShowForgotModal(false)
        setForgotStep(1)
        setForgotEmail("")
        setForgotOtp("")
        setForgotNewPassword("")
        setForgotMessage("")
      }, 3000)
    } catch (err) {
      setForgotError(err.message)
    } finally {
      setForgotLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const res = await login(formData.email, formData.password)
    if (res.success) {
      router.push(redirect)
    } else {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex bg-white relative overflow-hidden">
      <style jsx global>{`
        header, footer { display: none !important; }
      `}</style>
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-[#FAF8F5] pointer-events-none -z-10 hidden lg:block" />
      <div className="absolute top-40 left-40 w-96 h-96 bg-[#16A34A]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Left side: Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative bg-[#114D3C] overflow-hidden p-12 flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <img src="/images/wheat_background.png" alt="Wheat" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B382B] via-transparent to-[#0B382B]/80" />
        </div>
        
        <div className="relative z-10 text-white/80 self-end font-bold text-sm tracking-widest uppercase" style={{ fontFamily: "var(--font-outfit)" }}>
          Welcome Back
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-[#16A34A] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Leaf className="w-3 h-3" />
            100% Pure Veg
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
            Your favorite homely meals, just a click away.
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8" style={{ fontFamily: "var(--font-outfit)" }}>
            Log in to quickly re-order your favorites, track your current deliveries, and experience lightning-fast checkout.
          </p>
          <div className="flex gap-4">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border-2 border-[#114D3C] flex items-center justify-center font-bold text-[#114D3C]">4.9</div>
              <div className="w-12 h-12 rounded-full border-2 border-[#114D3C] bg-white overflow-hidden"><img src="/images/Plain-Roti.jpeg" className="w-full h-full object-cover"/></div>
              <div className="w-12 h-12 rounded-full border-2 border-[#114D3C] bg-white overflow-hidden"><img src="/images/Sabji-Roti.png" className="w-full h-full object-cover"/></div>
            </div>
            <div className="text-white text-sm flex flex-col justify-center font-medium">
              <span>Trusted by 10k+</span>
              <span className="text-white/60">happy customers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto relative z-10 custom-scrollbar">
        <div className="min-h-full flex items-center justify-center p-6 sm:p-12 lg:p-24">
          <div className="w-full max-w-md">
          <Link href="/" className="inline-flex mb-8 transform hover:-translate-x-1 transition-transform">
            <img src="/logo.jpeg" alt="Logo" className="h-12 w-auto object-contain rounded-xl shadow-sm border border-[#EAE5D9]" />
          </Link>
          
          {!showForgotModal ? (
            <>
              <h1 className="text-4xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>Log In</h1>
              <p className="text-[#73706A] mb-8" style={{ fontFamily: "var(--font-outfit)" }}>Welcome back! Please enter your details.</p>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium mb-6 flex items-center border border-red-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 mr-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: "var(--font-outfit)" }}>
                <div>
                  <label className="text-xs font-bold text-[#73706A] tracking-widest uppercase mb-2 block">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#C19B6C] group-focus-within:text-[#16A34A] transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-4 bg-[#FAF8F5] border border-[#EAE5D9] rounded-2xl text-[#2C3E35] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all font-medium"
                      placeholder="ramesh@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-[#73706A] tracking-widest uppercase block">Password</label>
                    <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs font-bold text-[#16A34A] hover:underline">Forgot Password?</button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#C19B6C] group-focus-within:text-[#16A34A] transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-11 pr-4 py-4 bg-[#FAF8F5] border border-[#EAE5D9] rounded-2xl text-[#2C3E35] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-[#114D3C] text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-[#0B382B] transition-all shadow-[0_8px_20px_rgba(17,77,60,0.2)] hover:shadow-[0_12px_25px_rgba(17,77,60,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>Log In <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-[#73706A] text-sm font-medium" style={{ fontFamily: "var(--font-outfit)" }}>
                Don't have an account?{' '}
                <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} className="text-[#16A34A] font-bold hover:underline">
                  Sign up for free
                </Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-[#114D3C] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>Reset Password</h1>
              <p className="text-[#73706A] mb-8" style={{ fontFamily: "var(--font-outfit)" }}>
                {forgotStep === 1 ? "Enter your email to receive an OTP." : "Enter the OTP sent to your email and your new password."}
              </p>

              {forgotError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium mb-6 flex items-center border border-red-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 mr-2" />
                  {forgotError}
                </div>
              )}
              {forgotMessage && (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm font-medium mb-6 flex items-center border border-green-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mr-2" />
                  {forgotMessage}
                </div>
              )}

              {forgotStep === 1 ? (
                <form onSubmit={handleForgotPassword} className="space-y-5" style={{ fontFamily: "var(--font-outfit)" }}>
                  <div>
                    <label className="text-xs font-bold text-[#73706A] tracking-widest uppercase mb-2 block">Email</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-4 py-4 bg-[#FAF8F5] border border-[#EAE5D9] rounded-2xl text-[#2C3E35] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all font-medium"
                      placeholder="ramesh@email.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-[#114D3C] text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-[#0B382B] transition-all shadow-[0_8px_20px_rgba(17,77,60,0.2)] hover:shadow-[0_12px_25px_rgba(17,77,60,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                  >
                    {forgotLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5" style={{ fontFamily: "var(--font-outfit)" }}>
                  <div>
                    <label className="text-xs font-bold text-[#73706A] tracking-widest uppercase mb-2 block">OTP</label>
                    <input
                      type="text"
                      required
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      className="w-full px-4 py-4 bg-[#FAF8F5] border border-[#EAE5D9] rounded-2xl text-[#2C3E35] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all font-medium tracking-widest"
                      placeholder="123456"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#73706A] tracking-widest uppercase mb-2 block">New Password</label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full px-4 py-4 bg-[#FAF8F5] border border-[#EAE5D9] rounded-2xl text-[#2C3E35] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-[#114D3C] text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-[#0B382B] transition-all shadow-[0_8px_20px_rgba(17,77,60,0.2)] hover:shadow-[0_12px_25px_rgba(17,77,60,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                  >
                    {forgotLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                  <div className="flex items-center justify-end text-sm text-[#73706A] mt-2">
                    <button
                      type="button"
                      onClick={handleResendForgotOtp}
                      disabled={!forgotCanResend || forgotLoading}
                      className={`text-[#16A34A] font-bold hover:underline ${!forgotCanResend ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {forgotTimer > 0 ? `Resend OTP in ${forgotTimer}s` : 'Resend OTP'}
                    </button>
                  </div>
                </form>
              )}
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => { setShowForgotModal(false); setForgotStep(1); setForgotMessage(""); setForgotError(""); }}
                  className="inline-flex items-center text-[#73706A] hover:text-[#114D3C] transition-colors font-medium text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="w-10 h-10 animate-spin text-[#16A34A]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
