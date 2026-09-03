import React from 'react';
import { X, Trash2, ShieldCheck, Zap, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartModal({ cart, onClose, onUpdateQty, onRemove, onProceedToCheckout }) {
  if (!cart) return null;

  const totalMRP = cart.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = totalMRP - totalAmount;

  return (
    <div className="fk-modal-overlay" onClick={onClose}>
      <div className="fk-modal-container max-w-3xl p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h3 className="font-bold text-lg">My Cart ({cart.reduce((s, i) => s + i.quantity, 0)} Items)</h3>
          </div>
          <button onClick={onClose} className="text-white hover:opacity-80 p-1">
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={36} />
            </div>
            <h4 className="text-lg font-bold text-gray-800">Your Cart is Empty!</h4>
            <p className="text-xs text-gray-500 mt-1">Explore our categories and add items to your cart.</p>
            <button 
              onClick={onClose} 
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-bold rounded text-xs shadow hover:bg-blue-700"
            >
              SHOP NOW
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Cart Items List */}
            <div className="md:col-span-2 p-4 max-h-[60vh] overflow-y-auto space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 bg-white p-3 border rounded-lg hover:shadow-sm transition">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-contain rounded bg-gray-50 p-1" />
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-gray-800 line-clamp-2">{item.title}</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">{item.brand}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-gray-400 line-through">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                      <span className="text-xs font-bold text-green-600">{item.discount}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controller */}
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                        <button 
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="px-3 py-0.5 text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-red-500 text-xs font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Details Breakdown */}
            <div className="p-4 bg-gray-50 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-gray-500 uppercase border-b pb-2 tracking-wider">
                  PRICE DETAILS
                </h4>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-700">
                    <span>Price ({cart.length} items)</span>
                    <span>₹{totalMRP.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Discount Savings</span>
                    <span>- ₹{totalDiscount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Charges</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="border-t border-dashed border-gray-300 pt-2 flex justify-between text-sm font-black text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-blue-700">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-4 p-2.5 bg-green-100/60 border border-green-300 rounded text-[11px] text-green-800 font-bold text-center">
                  🎉 You will save ₹{totalDiscount.toLocaleString('en-IN')} on this order!
                </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={onProceedToCheckout}
                  className="w-full py-3 bg-orange-500 text-white font-extrabold rounded-md shadow-md hover:bg-orange-600 text-sm flex items-center justify-center gap-2 transition"
                >
                  PLACE ORDER <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
