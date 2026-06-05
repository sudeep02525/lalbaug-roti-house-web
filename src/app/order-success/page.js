"use client"
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Package, MapPin, CreditCard } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id') || 'ORD_UNKNOWN'
  const total = searchParams.get('total') || '0'
  const addr = searchParams.get('addr') || 'N/A'

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="w-24 h-24 bg-[var(--success)]/10 text-[var(--success)] rounded-full flex items-center justify-center mb-8 animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      
      <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)] text-center">Order Confirmed!</h1>
      <p className="text-[var(--muted-foreground)] mb-12 text-center max-w-md">
        Thank you for choosing Lalbaug Roti House. Your hot, fresh food is being prepared and will reach you shortly.
      </p>
      
      <Card className="w-full max-w-2xl overflow-hidden border-t-4 border-t-[var(--success)] shadow-lg mb-8">
        <CardContent className="p-0">
          <div className="p-6 border-b border-[var(--border)] bg-[var(--muted)]/50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Order Number</p>
                <p className="text-xl font-bold font-mono">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--muted-foreground)]">Order Status</p>
                <p className="text-lg font-bold text-[var(--accent)]">Preparing</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Payment Status</h3>
                <p className="text-[var(--muted-foreground)]">Paid Successfully via Razorpay</p>
                <p className="font-bold text-xl mt-1">₹{total}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Delivery Address</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">{addr}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">Back to Home</Button>
        </Link>
        <Link href="/menu">
          <Button size="lg" className="w-full sm:w-auto">Order More</Button>
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Suspense fallback={<div className="container mx-auto py-20 text-center">Loading Receipt...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
