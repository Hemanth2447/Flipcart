import React from 'react';
import { CheckCircle, Truck, Calendar, MapPin, PackageCheck, ShoppingBag, Download, ArrowRight } from 'lucide-react';

export default function OrderSuccessModal({ orderDetails, onClose }) {
  if (!orderDetails) return null;

  return (
    <div className="fk-modal-overlay" onClick={onClose}>
      <div className="fk-modal-container max-w-2xl p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header Banner */}
        <div className="bg-emerald-600 text-white p-6 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm animate-bounce">
            <CheckCircle size={40} className="text-white fill-emerald-500" />
          </div>
          <h2 className="text-2xl font-black">Order Placed Successfully!</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Thank you for shopping on Flipcart. Order ID: <span className="font-mono font-bold text-white">{orderDetails.orderId}</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 bg-white">
          {/* Tracking Timeline */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Delivery Status</h4>
            <div className="flex items-center justify-between relative px-2">
              <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 -z-0"></div>
              <div className="absolute top-4 left-6 w-1/3 h-1 bg-emerald-500 -z-0"></div>

              {/* Step 1 */}
              <div className="relative z-10 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto font-bold text-xs shadow-md">
                  ✓
                </div>
                <span className="text-[11px] font-bold text-gray-800 block mt-1.5">Order Confirmed</span>
                <span className="text-[10px] text-gray-400 block">Today, 9:26 AM</span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-500 flex items-center justify-center mx-auto font-bold text-xs">
                  <PackageCheck size={16} />
                </div>
                <span className="text-[11px] font-bold text-gray-700 block mt-1.5">Packed</span>
                <span className="text-[10px] text-gray-400 block">Expected 2:00 PM</span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 text-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 border-2 border-gray-300 flex items-center justify-center mx-auto font-bold text-xs">
                  <Truck size={16} />
                </div>
                <span className="text-[11px] font-medium text-gray-500 block mt-1.5">Shipped</span>
                <span className="text-[10px] text-gray-400 block">Tomorrow</span>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 text-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 border-2 border-gray-300 flex items-center justify-center mx-auto font-bold text-xs">
                  <Calendar size={16} />
                </div>
                <span className="text-[11px] font-medium text-gray-500 block mt-1.5">Delivered</span>
                <span className="text-[10px] text-emerald-600 font-bold block">Fri, Sep 5</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
            <div>
              <span className="text-gray-400 font-semibold block">PAYMENT METHOD</span>
              <span className="font-extrabold text-gray-800 text-sm block mt-0.5">{orderDetails.method}</span>
              <span className="text-[11px] text-gray-500 block">{orderDetails.detail}</span>
            </div>

            <div>
              <span className="text-gray-400 font-semibold block">DELIVERY ADDRESS</span>
              <span className="font-bold text-gray-800 block mt-0.5">Hemanth (Default)</span>
              <span className="text-[11px] text-gray-500 block">Flat 402, Sunshine Apts, Bengaluru - 560001</span>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Purchased Items</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
              {orderDetails.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt={item.title} className="w-9 h-9 object-cover rounded bg-white p-0.5 border" />
                    <div>
                      <span className="font-bold text-gray-800 block line-clamp-1">{item.title}</span>
                      <span className="text-[10px] text-gray-500">Qty: {item.quantity || 1}</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Paid */}
          <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            <span className="text-xs font-bold text-emerald-900 uppercase">Amount Paid</span>
            <span className="text-xl font-black text-emerald-700">₹{orderDetails.amount?.toLocaleString('en-IN')}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => alert(`Receipt PDF for ${orderDetails.orderId} generated successfully!`)}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-200 flex items-center justify-center gap-1.5"
            >
              <Download size={14} /> Download Invoice
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-blue-600 text-white font-extrabold text-xs rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1.5 shadow"
            >
              <ShoppingBag size={14} /> CONTINUE SHOPPING <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
