"use client"
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

import OrderSuccessReceipt from '@/components/order-success/OrderSuccessReceipt'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id') || 'ORD_UNKNOWN'
  const oid = searchParams.get('oid')
  const total = searchParams.get('total') || '0'
  const addr = searchParams.get('addr') || 'N/A'
  const paymentId = searchParams.get('paymentId') || ''

  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (oid) {
      import('axios').then(axios => {
        axios.default.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${oid}`, { validateStatus: () => true })
          .then(res => {
            if (res.status === 200 || res.status === 201) {
              setOrderDetails(res.data.data)
            }
          })
          .catch(err => console.error(err))
          .finally(() => setLoading(false))
      })
    } else {
      setLoading(false)
    }
  }, [oid])

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="w-24 h-24 bg-[var(--success)]/10 text-[var(--success)] rounded-full flex items-center justify-center mb-8 animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      
      <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)] text-center">Order Confirmed!</h1>
      <p className="text-[var(--muted-foreground)] mb-12 text-center max-w-md">
        Thank you for choosing Lalbaug Roti House. Your hot, fresh food is being prepared and will reach you shortly.
      </p>
      
      <OrderSuccessReceipt 
        orderId={orderId}
        orderDetails={orderDetails}
        paymentId={paymentId}
        total={total}
        addr={addr}
      />
      
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
