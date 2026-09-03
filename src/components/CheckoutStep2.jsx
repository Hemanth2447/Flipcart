import React, { useState } from 'react';
import { Check, ChevronDown, PackageCheck, Shield, Sparkles } from 'lucide-react';

export default function CheckoutStep2({ checkoutItems, onContinueToPayment, onBackToCart }) {
  const [items, setItems] = useState(checkoutItems || []);

  // Compute pricing
  const totalMRP = items.reduce((sum, i) => sum + (i.originalPrice || 6999) * i.quantity, 0);
  const itemsPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const fees = 9;
  const discounts = Math.max(0, totalMRP - itemsPrice);
  const totalAmount = itemsPrice + fees;
  const totalSavings = discounts;

  const handleUpdateQty = (id, newQty) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-16 font-sans">
      {/* Top Stepper Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Step 1: Address (Completed) */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToCart}>
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              ✓
            </div>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Address</span>
          </div>

          <div className="flex-1 h-[2px] bg-blue-600 mx-4"></div>

          {/* Step 2: Order Summary (Active) */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow ring-2 ring-blue-300">
              2
            </div>
            <span className="text-xs font-black text-blue-700 uppercase tracking-wide">Order Summary</span>
          </div>

          <div className="flex-1 h-[2px] bg-gray-300 mx-4"></div>

          {/* Step 3: Payment */}
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Payment</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Address & Order Summary Items */}
          <div className="lg:col-span-2 space-y-3">
            {/* Delivery Address Card */}
            <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Deliver to:
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-gray-900">Hemanth</span>
                    <span className="bg-gray-200 text-gray-700 font-bold text-[10px] px-1.5 py-0.5 rounded uppercase">
                      HOME
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 max-w-xl leading-relaxed">
                    15 elango street vivekananda nagar kodungaiyur, Venkatesapuram, Kalamegam Street, Vivekananda Nagar, Kodungaiyur, Chennai 600118
                  </p>
                  <p className="text-xs font-bold text-gray-800 mt-1.5">
                    9043091556
                  </p>
                </div>

                <button 
                  onClick={() => alert('Address change modal (Demo address retained)')}
                  className="px-4 py-1.5 border border-gray-300 text-blue-600 font-bold text-xs rounded hover:bg-blue-50 transition"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Selected Product Items List */}
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded border border-gray-200 shadow-sm p-4">
                {/* Hot Deal Tag */}
                <div className="mb-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide">
                    Hot Deal
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded p-1 flex items-center justify-center border mx-auto sm:mx-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.sizeInfo || `Size: ${item.capacityOptions?.[0] || '8'}, ${item.colorOptions?.[0] || 'Black'}`}
                    </p>

                    {/* Rating & Assured */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="bg-green-700 text-white text-[11px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <span>{item.rating || 3.9}</span>
                        <span>★</span>
                      </div>
                      <span className="text-xs text-gray-500">({item.reviewsCount || 334})</span>
                      {item.isAssured && (
                        <span className="italic font-black text-blue-600 text-xs flex items-center gap-0.5">
                          <span className="text-yellow-500">✦</span> Assured
                        </span>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-700">
                        <span>Qty: </span>
                        <select
                          value={item.quantity}
                          onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
                          className="bg-transparent font-bold cursor-pointer outline-none ml-1 text-gray-900"
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-emerald-700 font-bold text-xs">
                          ↓ {item.discount || '51% off'}
                        </span>
                        <span className="text-gray-400 text-xs line-through">
                          ₹{(item.originalPrice || 6999).toLocaleString('en-IN')}
                        </span>
                        <span className="text-base font-extrabold text-gray-900">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Delivery Estimate */}
                    <p className="text-xs text-gray-600 mt-2 font-medium">
                      {item.deliveryDays || 'Delivery by Sep 11, Fri'}
                    </p>
                  </div>
                </div>

                {/* Open Box Delivery Section */}
                <div className="mt-4 pt-3 border-t border-gray-100 bg-amber-50/60 border border-amber-200/80 rounded p-3 text-xs text-amber-900">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <span className="text-lg">📦</span>
                    <span>Rest assured with Open Box Delivery</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                    Delivery agent will open the package so you can check for correct product, damage or missing items. Share OTP to confirm.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Price Details & Continue Action */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded border border-gray-200 shadow-sm p-4 sticky top-20">
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-3">
                Price Details
              </h3>

              <div className="mt-3 space-y-3 text-xs">
                <div className="flex justify-between text-gray-800">
                  <span>MRP (incl. of all taxes)</span>
                  <span className="font-semibold">₹{totalMRP.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-gray-800">
                  <span className="flex items-center gap-1">
                    Fees <ChevronDown size={12} className="text-gray-400" />
                  </span>
                  <span className="font-semibold">₹{fees}</span>
                </div>

                <div className="flex justify-between text-green-700 font-semibold">
                  <span className="flex items-center gap-1">
                    Discounts <ChevronDown size={12} className="text-green-600" />
                  </span>
                  <span>₹{discounts.toLocaleString('en-IN')}</span>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between text-sm font-extrabold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-gray-900 font-black">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Savings Banner */}
              <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-bold text-xs flex items-center gap-2">
                <span className="text-base">🎉</span>
                <span>You'll save ₹{totalSavings.toLocaleString('en-IN')} on this order!</span>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="mt-6 pt-3 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 line-through block">₹{totalMRP.toLocaleString('en-IN')}</span>
                  <span className="text-base font-extrabold text-gray-900 flex items-center gap-1">
                    ₹{totalAmount.toLocaleString('en-IN')} <span className="text-[11px] text-gray-400 font-normal">ⓘ</span>
                  </span>
                </div>

                <button
                  onClick={() => onContinueToPayment(items, totalAmount)}
                  className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black text-xs uppercase rounded shadow transition flex items-center gap-1"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
