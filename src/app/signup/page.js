"use client"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"
import axios from "axios"

import SignupHero from "@/components/signup/SignupHero"
import SignupForms from "@/components/signup/SignupForms"

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState("form") // 'form' or 'otp'
  const [otp, setOtp] = useState("")
  const [otpMessage, setOtpMessage] = useState("")
  const [otpError, setOtpError] = useState("")
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let interval
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    } else if (timer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setOtpMessage("")
    setOtpError("")
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
      )
      const data = res.data
      if (res.status !== 200 && res.status !== 201) throw new Error(data.message || "Failed to send OTP")
      setOtpMessage(data.message || "OTP sent to your email")
      setStep("otp")
      setTimer(60)
      setCanResend(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setOtpError("")
    setOtpMessage("")
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
      )
      const data = res.data
      if (res.status !== 200 && res.status !== 201) throw new Error(data.message || "Verification failed")

      setOtpMessage("Sign up successful! Redirecting to login...")

      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`)
      }, 2000)
    } catch (err) {
      setOtpError(err.message)
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!canResend) return
    setLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      }, { validateStatus: () => true })
      setTimer(60)
      setCanResend(false)
      setOtpMessage("OTP resent successfully")
    } catch (err) {
      setOtpError("Failed to resend OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex bg-white relative overflow-hidden">
      <style jsx global>{`
        header,
        footer {
          display: none !important;
        }
        main { padding-bottom: 0 !important; }
      `}</style>
      
      <SignupHero />
      
      <SignupForms 
        step={step}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleVerifyOtp={handleVerifyOtp}
        otp={otp}
        setOtp={setOtp}
        handleResendOtp={handleResendOtp}
        canResend={canResend}
        timer={timer}
        loading={loading}
        redirect={redirect}
        otpMessage={otpMessage}
        error={error}
        otpError={otpError}
      />
      
    </div>
  )
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
  )
}
