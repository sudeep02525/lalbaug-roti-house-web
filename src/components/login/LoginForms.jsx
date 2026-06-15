import { ArrowRight, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginForms({
  showForgotModal,
  setShowForgotModal,
  error,
  handleSubmit,
  formData,
  setFormData,
  loading,
  redirect,
  forgotStep,
  setForgotStep,
  forgotError,
  setForgotError,
  forgotMessage,
  setForgotMessage,
  handleForgotPassword,
  forgotEmail,
  setForgotEmail,
  forgotLoading,
  handleResetPassword,
  forgotOtp,
  setForgotOtp,
  forgotNewPassword,
  setForgotNewPassword,
  handleResendForgotOtp,
  forgotCanResend,
  forgotTimer
}) {
  return (
    <div className="w-full lg:w-1/2 h-full overflow-y-auto relative z-10 custom-scrollbar">
      <div className="min-h-full flex items-center justify-center p-6 sm:p-12 lg:p-24">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center text-[#73706A] hover:text-[#114D3C] transition-colors font-bold text-sm mb-8 hover:-translate-x-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="mb-8">
            <img src="/logo.jpeg" alt="Logo" className="h-12 w-auto object-contain rounded-xl shadow-sm border border-[#EAE5D9]" />
          </div>
        
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
  )
}
