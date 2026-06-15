import { Card, CardContent } from '@/components/ui/card'
import { Package, MapPin, CreditCard } from 'lucide-react'

export default function OrderSuccessReceipt({ orderId, orderDetails, paymentId, total, addr }) {
  return (
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

        {orderDetails?.deliveryOtp && (
          <div className="bg-[var(--accent)]/10 border-b border-[var(--border)] p-6 text-center">
            <p className="text-sm text-[var(--muted-foreground)] mb-1 uppercase tracking-wider font-bold">Delivery OTP</p>
            <div className="text-4xl tracking-[0.2em] font-extrabold text-[var(--accent)]">{orderDetails.deliveryOtp}</div>
            <p className="text-xs text-[var(--muted-foreground)] mt-2 max-w-xs mx-auto">Please share this 4-digit code with the delivery executive to receive your order.</p>
          </div>
        )}
        
        <div className="p-6 md:p-8 space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Payment Details</h3>
              <p className="text-[var(--muted-foreground)] text-sm mb-1">Status: <span className="text-[var(--success)] font-medium">Paid via Razorpay</span></p>
              {paymentId && <p className="text-[var(--muted-foreground)] text-sm mb-2">Txn ID: <span className="font-mono">{paymentId}</span></p>}
              <p className="font-bold text-xl mt-1 text-[var(--foreground)]">Total: ₹{total}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Delivery Address</h3>
              <p className="text-[var(--muted-foreground)] leading-relaxed">{orderDetails?.address?.addressLine1 || addr}</p>
              {orderDetails?.address?.landmark && (
                <p className="text-[var(--muted-foreground)] text-sm">Landmark: {orderDetails.address.landmark}</p>
              )}
              {orderDetails?.address?.phone && (
                <p className="text-[var(--muted-foreground)] text-sm">Phone: {orderDetails.address.phone}</p>
              )}
            </div>
          </div>

          {orderDetails && orderDetails.items && orderDetails.items.length > 0 && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-lg mb-4">Itemized Bill</h3>
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{item.name}</p>
                        <p className="text-sm text-[var(--muted-foreground)]">Quantity: {item.quantity}</p>
                        {item.addons && item.addons.length > 0 && (
                          <p className="text-xs text-[var(--muted-foreground)] mt-1">
                            Addons: {item.addons.map(a => a.name).join(', ')}
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-[var(--foreground)]">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                  
                  <div className="pt-4 mt-4 border-t border-[var(--border)]">
                    <div className="flex justify-between text-sm text-[var(--muted-foreground)] mb-2">
                      <span>Subtotal</span>
                      <span>₹{orderDetails.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--muted-foreground)] mb-2">
                      <span>Delivery Charge</span>
                      <span>₹{orderDetails.deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-[var(--foreground)] mt-4">
                      <span>Total Paid</span>
                      <span>₹{orderDetails.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
