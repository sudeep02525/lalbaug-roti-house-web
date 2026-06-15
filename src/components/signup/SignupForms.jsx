import { ArrowRight, User, Mail, Lock, Phone, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignupForms({
  step,
  formData,
  setFormData,
  handleSubmit,
  handleVerifyOtp,
  otp,
  setOtp,
  handleResendOtp,
  canResend,
  timer,
  loading,
  redirect,
  otpMessage,
  error,
  otpError
}) {
  return (
    <div className="w-full lg:w-1/2 h-full overflow-y-auto relative z-10 custom-scrollbar">
      <div className="min-h-full flex items-center justify-center p-6 sm:p-12 lg:p-12 xl:p-16">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center text-[#73706A] hover:text-[#114D3C] transition-colors font-bold text-sm mb-6 lg:mb-8 hover:-translate-x-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="mb-6 lg:mb-8">
            <img
              src="/logo.jpeg"
              alt="Logo"
              className="h-10 lg:h-12 w-auto object-contain rounded-xl shadow-sm border border-[#EAE5D9]"
            />
          </div>
          <h1
            className="text-3xl lg:text-4xl font-bold text-[#114D3C] mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {step === "form" ? "Create Account" : "Verify OTP"}
          </h1>
          <p
            className="text-[#73706A] mb-6"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {step === "form"
              ? "Join Lalbaug Roti House for the fastest checkout and fresh daily meals."
              : `Enter the OTP sent to ${formData.email}`}
          </p>

          {/* Global messages */}
          {otpMessage && (
            <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm font-medium mb-6 flex flex-col border border-green-100">
              <span>{otpMessage}</span>
              {step === "otp" && otpMessage.includes("OTP") && (
                <span className="mt-1.5 text-xs text-green-800 font-normal">
                  *If you don't see the email in your Inbox, please check your{" "}
                  <strong>Spam</strong> or <strong>Junk</strong> folder.
                </span>
              )}
            </div>
          )}
          {(error || otpError) && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium mb-6 flex items-center border border-red-100">
              <span>{error || otpError}</span>
            </div>
          )}

          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#C19B6C] group-focus-within:text-[#16A34A] transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#EAE5D9] rounded-2xl text-[#2C3E35] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all font-medium"
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#C19B6C] group-focus-within:text-[#16A34A] transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#EAE5D9] rounded-2xl text-[#2C3E35] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all font-medium"
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#C19B6C] group-focus-within:text-[#16A34A] transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="Phone"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setFormData({ ...formData, phone: val });
                  }}
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#EAE5D9] rounded-2xl text-[#2C3E35] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all font-medium"
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#C19B6C] group-focus-within:text-[#16A34A] transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#EAE5D9] rounded-2xl text-[#2C3E35] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#114D3C] text-white py-3.5 px-8 rounded-2xl font-bold text-lg hover:bg-[#0B382B] transition-all shadow-[0_8px_20px_rgba(17,77,60,0.2)] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#C19B6C] group-focus-within:text-[#16A34A] transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#EAE5D9] rounded-2xl text-[#2C3E35] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all font-medium"
                />
              </div>
              <div className="flex items-center justify-end text-sm text-[#73706A]">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || loading}
                  className={`text-[#16A34A] font-bold hover:underline ${!canResend ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#114D3C] text-white py-3.5 px-8 rounded-2xl font-bold text-lg hover:bg-[#0B382B] transition-all shadow-[0_8px_20px_rgba(17,77,60,0.2)] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          )}

          <p
            className="mt-6 text-center text-[#73706A] text-sm font-medium"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-[#16A34A] font-bold hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
