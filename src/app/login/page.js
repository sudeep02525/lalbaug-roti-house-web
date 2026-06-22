"use client"
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'
import axios from 'axios'

import LoginHero from '@/components/login/LoginHero'
import LoginForms from '@/components/login/LoginForms'

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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/forgot-password`, { email: forgotEmail }, { validateStatus: () => true })
      const data = res.data
      if (res.status !== 200 && res.status !== 201) throw new Error(data.message || "Failed to resend OTP")
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/forgot-password`, { email: forgotEmail }, { validateStatus: () => true })
      const data = res.data
      if (res.status !== 200 && res.status !== 201) throw new Error(data.message || "Failed to send OTP")
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/reset-password`, 
        { email: forgotEmail, otp: forgotOtp, newPassword: forgotNewPassword },
        { validateStatus: () => true }
      )
      const data = res.data
      if (res.status !== 200 && res.status !== 201) throw new Error(data.message || "Failed to reset password")
      
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
        main { padding-bottom: 0 !important; }
      `}</style>
      
      <LoginHero />
      
      <LoginForms 
        showForgotModal={showForgotModal}
        setShowForgotModal={setShowForgotModal}
        error={error}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        redirect={redirect}
        forgotStep={forgotStep}
        setForgotStep={setForgotStep}
        forgotError={forgotError}
        setForgotError={setForgotError}
        forgotMessage={forgotMessage}
        setForgotMessage={setForgotMessage}
        handleForgotPassword={handleForgotPassword}
        forgotEmail={forgotEmail}
        setForgotEmail={setForgotEmail}
        forgotLoading={forgotLoading}
        handleResetPassword={handleResetPassword}
        forgotOtp={forgotOtp}
        setForgotOtp={setForgotOtp}
        forgotNewPassword={forgotNewPassword}
        setForgotNewPassword={setForgotNewPassword}
        handleResendForgotOtp={handleResendForgotOtp}
        forgotCanResend={forgotCanResend}
        forgotTimer={forgotTimer}
      />
      
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
