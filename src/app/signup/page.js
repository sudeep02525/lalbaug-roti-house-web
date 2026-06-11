"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import axios from "axios";
import {
  ArrowRight,
  User,
  Mail,
  Lock,
  Phone,
  Loader2,
  Leaf,
  ArrowLeft,
} from "lucide-react";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // 'form' or 'otp'
  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOtpMessage("");
    setOtpError("");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/signup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        },
        { validateStatus: () => true }
      );
      const data = res.data;
      if (res.status !== 200 && res.status !== 201) throw new Error(data.message || "Failed to send OTP");
      setOtpMessage(data.message || "OTP sent to your email");
      setStep("otp");
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOtpError("");
    setOtpMessage("");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/verify-otp`,
        {
          email: formData.email,
          otp,
          name: formData.name,
          password: formData.password,
          phone: formData.phone,
        },
        { validateStatus: () => true }
      );
      const data = res.data;
      if (res.status !== 200 && res.status !== 201) throw new Error(data.message || "Verification failed");

      setOtpMessage("Sign up successful! Redirecting to login...");

      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      }, 2000);
    } catch (err) {
      setOtpError(err.message);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      }, { validateStatus: () => true });
      setTimer(60);
      setCanResend(false);
      setOtpMessage("OTP resent successfully");
    } catch (err) {
      setOtpError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white relative overflow-hidden">
      <style jsx global>{`
        header,
        footer {
          display: none !important;
        }
      `}</style>
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FAF8F5] pointer-events-none -z-10 hidden lg:block" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#16A34A]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#C19B6C]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Left side: Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative bg-[#114D3C] overflow-hidden p-12 flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/wheat_background.png"
            alt="Wheat"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B382B] via-transparent to-[#0B382B]/80" />
        </div>
        <div
          className="relative z-10 text-white/80 self-end font-bold text-sm tracking-widest uppercase"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Lalbaug Roti House
        </div>
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-[#16A34A] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Leaf className="w-3 h-3" />
            100% Pure Veg
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Fresh meals delivered to your door.
          </h2>
          <p
            className="text-white/80 text-lg leading-relaxed mb-8"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Sign up to save your addresses, track past orders, and checkout in
            seconds. Fresh, handmade rotis await!
          </p>
          <div className="flex gap-4">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border-2 border-[#114D3C] flex items-center justify-center font-bold text-[#114D3C]">
                4.9
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-[#114D3C] bg-white overflow-hidden">
                <img
                  src="/images/Plain-Roti.jpeg"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-[#114D3C] bg-white overflow-hidden">
                <img
                  src="/images/Sabji-Roti.png"
                  className="w-full h-full object-cover"
                />
              </div>
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
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
          <Loader2 className="w-10 h-10 animate-spin text-[#16A34A]" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
