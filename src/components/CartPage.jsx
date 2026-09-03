import React, { useState } from 'react';
import { Shield, Trash2, Bookmark, Zap, Tag, MapPin, ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CartPage({ cart, onUpdateQty, onRemove, onBuyNowItem, onPlaceOrder, onContinueShopping }) {
  const [activeTab, setActiveTab] = useState('flipkart'); // 'flipkart' | 'grocery'
  const [couponApplied, setCouponApplied] = useState(false);
  const [pincode, setPincode] = useState('600118');

  // Compute total MRP, fees, discounts
  const totalMRP = cart.reduce((sum, item) => sum + (item.originalPrice || item.price * 1.5) * item.quantity, 0);
  const rawTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const couponDiscount = couponApplied ? 340 : 0;
  const totalAmount = Math.max(0, rawTotal - couponDiscount);
  const fees = cart.length > 0 ? 308 : 0;
  const discounts = totalMRP - totalAmount;
  const savings = discounts;

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3">
        {/* Cart Top Tabs */}
        <div className="bg-white rounded-t-sm border-b border-gray-200 flex items-center shadow-sm">
          <button
            onClick={() => setActiveTab('flipkart')}
            className={`flex-1 py-3 text-center text-sm font-bold transition-all relative ${
              activeTab === 'flipkart' ? 'text-blue-600 font-extrabold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Flipkart ({cart.reduce((s, i) => s + i.quantity, 0)})
            {activeTab === 'flipkart' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('grocery')}
            className={`flex-1 py-3 text-center text-sm font-bold transition-all relative ${
              activeTab === 'grocery' ? 'text-blue-600 font-extrabold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grocery (15)
            {activeTab === 'grocery' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600"></span>
            )}
          </button>
        </div>

        {/* Deliver Address Bar */}
        <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center text-xs shadow-sm mb-3">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">From Saved Addresses</span>
          </div>

          <button 
            onClick={() => {
              const code = prompt('Enter your 6-digit delivery pincode:', pincode);
              if (code && code.trim()) setPincode(code.trim());
            }}
            className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded font-bold hover:bg-blue-50 transition"
          >
            Enter Delivery Pincode
          </button>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white p-12 text-center rounded shadow-sm border border-gray-200">
            <img 
              src="https://img1a.flixcart.com/www/linchpin/fk-cp-zion/img/missing-cart1_9ee0f2.png" 
              alt="Empty Cart" 
              className="w-44 mx-auto mb-4 opacity-80" 
            />
            <h3 className="text-base font-bold text-gray-800">Your cart is empty!</h3>
            <p className="text-xs text-gray-500 mt-1">Explore our wide range of products and add items to your cart.</p>
            <button
              onClick={onContinueShopping}
              className="mt-5 px-8 py-2.5 bg-blue-600 text-white font-bold rounded text-xs shadow hover:bg-blue-700 uppercase"
            >
              Shop Now
            </button>
          </div>
        ) : (
          /* Cart Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Left Items Section */}
            <div className="lg:col-span-2 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded border border-gray-200 shadow-sm p-4 transition hover:shadow">
                  {/* Badge */}
                  <div className="mb-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide">
                      Hot Deal
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Item Image */}
                    <div className="w-28 h-28 flex-shrink-0 bg-gray-50 rounded p-1 flex items-center justify-center mx-auto sm:mx-0 border">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 leading-snug hover:text-blue-600 cursor-pointer">
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

                      {/* Pricing Row */}
                      <div className="flex items-baseline gap-2.5 mt-2">
                        <span className="text-emerald-700 font-bold text-xs flex items-center">
                          ↓ {item.discount || '51% off'}
                        </span>
                        <span className="text-gray-400 text-xs line-through">
                          ₹{(item.originalPrice || item.price * 2).toLocaleString('en-IN')}
                        </span>
                        <span className="text-base font-extrabold text-gray-900">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Quantity Controller */}
                      <div className="mt-2.5 flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-700">
                          <span>Qty: </span>
                          <select
                            value={item.quantity}
                            onChange={(e) => onUpdateQty(item.id, Number(e.target.value))}
                            className="bg-transparent font-bold cursor-pointer outline-none ml-1 text-gray-900"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                        <span className="text-[11px] text-pink-600 font-bold">Only few left</span>
                      </div>

                      {/* Coupon Row */}
                      <div className="mt-3 bg-blue-50/70 border border-blue-200 rounded p-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                          <Tag size={14} className="text-blue-600 fill-blue-100" />
                          <span>Save extra <strong className="text-blue-800">₹340</strong> with Coupon</span>
                        </div>
                        <button
                          onClick={() => setCouponApplied(!couponApplied)}
                          className={`font-bold px-3 py-1 rounded text-[11px] transition ${
                            couponApplied ? 'bg-green-600 text-white' : 'text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {couponApplied ? '✓ Applied' : 'Apply'}
                        </button>
                      </div>

                      {/* Delivery Date */}
                      <p className="text-xs text-gray-600 mt-2 font-medium">
                        {item.deliveryDays || 'Delivery by Sep 11, Fri'}
                      </p>
                    </div>
                  </div>

                  {/* Item Actions Bar (Save for later / Remove / Buy this now) */}
                  <div className="border-t border-gray-200 mt-4 pt-3 flex items-center justify-around text-xs font-bold text-gray-700">
                    <button
                      onClick={() => alert(`Saved "${item.title}" for later!`)}
                      className="hover:text-blue-600 flex items-center gap-1 py-1"
                    >
                      <Bookmark size={14} /> Save for later
                    </button>

                    <span className="text-gray-300">|</span>

                    <button
                      onClick={() => onRemove(item.id)}
                      className="hover:text-red-600 flex items-center gap-1 py-1"
                    >
                      <Trash2 size={14} /> Remove
                    </button>

                    <span className="text-gray-300">|</span>

                    <button
                      onClick={() => onBuyNowItem(item)}
                      className="text-orange-600 font-extrabold hover:text-orange-700 flex items-center gap-1 py-1"
                    >
                      <Zap size={14} className="fill-orange-600 text-orange-600" /> Buy this now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Price Details Section */}
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
                    <span className="font-semibold">₹{fees.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-green-700 font-semibold">
                    <span className="flex items-center gap-1">
                      Discounts <ChevronDown size={12} className="text-green-600" />
                    </span>
                    <span>₹{discounts.toLocaleString('en-IN')}</span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span>Extra Coupon Discount</span>
                      <span>- ₹340</span>
                    </div>
                  )}

                  <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between text-sm font-extrabold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-gray-900 font-black">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Savings Banner */}
                <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-bold text-xs flex items-center gap-2">
                  <span className="text-base">🎉</span>
                  <span>You'll save ₹{(savings + couponDiscount).toLocaleString('en-IN')} on this order!</span>
                </div>

                {/* Security trust note */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-start gap-2.5 text-[11px] text-gray-500 leading-tight">
                  <Shield size={24} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Safe and secure payments. Easy returns. 100% Authentic products.</span>
                </div>

                {/* Place Order Sticky Bottom Action */}
                <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 line-through block">₹{totalMRP.toLocaleString('en-IN')}</span>
                    <span className="text-base font-extrabold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    onClick={onPlaceOrder}
                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black text-xs uppercase rounded shadow transition flex items-center gap-1"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
