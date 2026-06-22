import Link from 'next/link'
import { Package, Loader2, ChevronRight, Clock, User, Phone } from 'lucide-react'

export default function OrderHistory({ orders, loadingOrders }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PREPARING': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'OUT_FOR_DELIVERY': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-[#FDFBF7] rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-[#E8E1D5] min-h-[600px]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#1A4D2E] font-playfair flex items-center gap-3">
          <Package className="w-7 h-7 text-[#8B5E3C]" /> Order History
        </h2>
        <span className="bg-[#FAF5E9] text-[#8B5E3C] font-bold px-4 py-2 rounded-xl text-sm border border-[#E8E1D5]">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      {loadingOrders ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#8B5E3C]">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="font-bold uppercase tracking-widest text-sm">Fetching your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto bg-[#FAF5E9] rounded-full flex items-center justify-center mb-6 border border-[#E8E1D5]">
            <Package className="w-10 h-10 text-[#8B5E3C]/50" />
          </div>
          <h3 className="text-2xl font-bold text-[#1A4D2E] font-playfair mb-2">No orders yet</h3>
          <p className="text-[#8B5E3C] mb-8">Looks like you haven't placed any orders with us.</p>
          <Link 
            href="/menu" 
            className="inline-flex items-center justify-center gap-2 bg-[#8B5E3C] text-white px-8 py-4 rounded-full font-bold hover:bg-[#734A2E] transition-all shadow-[0_8px_25px_rgba(139,94,60,0.25)] hover:-translate-y-1"
          >
            Start Ordering <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E8E1D5]/50">
                <div>
                  <p className="text-xs font-bold text-[#8B5E3C] uppercase tracking-widest mb-1">Order #{order.orderNumber}</p>
                  <p className="text-[#1A4D2E]/70 flex items-center gap-2 text-sm font-medium">
                    <Clock className="w-4 h-4" /> 
                    {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(order.orderStatus || order.status)}`}>
                  {(order.orderStatus || order.status)?.replace(/_/g, ' ') || 'UNKNOWN'}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="pb-4 border-b border-[#E8E1D5]/30 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-bold text-[#1A4D2E] text-base">{item.name || item.product?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-[#8B5E3C] mt-0.5">
                          Qty: {item.quantity} × ₹{item.price || item.priceAtOrder || 0}
                        </p>
                      </div>
                      <div className="font-bold text-[#1A4D2E]">
                        ₹{(((item.price || item.priceAtOrder) || 0) * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </div>
                    {item.addons && item.addons.length > 0 && (
                      <div className="mt-2 pl-3 border-l-2 border-[#8B5E3C]/20 space-y-1">
                        {item.addons.map((addon, aIdx) => (
                          <div key={aIdx} className="flex justify-between text-sm text-[#1A4D2E]/80">
                            <span>+ {addon.name} <span className="text-xs ml-1 opacity-70">(×{addon.quantity || 1})</span></span>
                            <span>₹{((addon.price || 0) * (addon.quantity || 1)).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Rejection / Delivery Info */}
              {order.status === 'CANCELLED' && order.rejectionReason && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
                  <p className="text-xs font-bold text-red-800 uppercase tracking-widest mb-1">Cancellation Reason</p>
                  <p className="text-red-600 text-sm">{order.rejectionReason}</p>
                </div>
              )}

              {order.assignedDeliveryBoy && (
                <div className="bg-[#FAF5E9] border border-[#E8E1D5] rounded-2xl p-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1A4D2E]/10 rounded-full flex items-center justify-center text-[#1A4D2E]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#8B5E3C] uppercase tracking-widest mb-0.5">Assigned Delivery Partner</p>
                      <p className="font-bold text-[#1A4D2E]">{order.assignedDeliveryBoy.name}</p>
                    </div>
                  </div>
                  {order.assignedDeliveryBoy.phone && (
                    <a 
                      href={`tel:${order.assignedDeliveryBoy.phone}`}
                      className="w-10 h-10 bg-[#1A4D2E] text-white rounded-full flex items-center justify-center hover:bg-[#11331e] shadow-md transition-colors shrink-0"
                      title="Call Delivery Partner"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}

              {/* Billing Summary */}
              <div className="bg-[#FDFBF7] border border-[#E8E1D5] rounded-2xl p-4 mb-2 text-sm space-y-2.5">
                <div className="flex justify-between text-[#1A4D2E]/80">
                  <span>Item Total</span>
                  <span>₹{(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#1A4D2E]/80">
                  <span>Delivery Charge</span>
                  <span>₹{(order.deliveryCharge || 0).toFixed(2)}</span>
                </div>
                <div className="pt-2.5 mt-2.5 border-t border-[#E8E1D5]/50 flex justify-between items-center text-[#1A4D2E]/80">
                  <span>Payment</span>
                  <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-700' : 'text-yellow-700'}`}>
                    {order.paymentStatus || 'PENDING'}
                  </span>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex justify-between items-center text-xs mt-1 text-[#1A4D2E]/60">
                    <span>Txn ID</span>
                    <span className="font-mono">{order.razorpayPaymentId}</span>
                  </div>
                )}
              </div>

              {/* Order Total */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E8E1D5]/50 mt-4">
                <p className="font-bold text-[#8B5E3C] uppercase tracking-widest text-sm">Total Paid</p>
                <p className="text-2xl font-normal text-[#1A4D2E]">₹{(order.totalAmount || 0).toFixed(2)}</p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
