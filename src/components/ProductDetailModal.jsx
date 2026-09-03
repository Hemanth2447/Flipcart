import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, Tag, Zap, ShoppingBag } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onBuyNow, onAddToCart }) {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colorOptions?.[0] || '');
  const [selectedCapacity, setSelectedCapacity] = useState(product.capacityOptions?.[0] || '');

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <div className="fk-modal-overlay" onClick={onClose}>
      <div className="fk-modal-container max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <button className="fk-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="fk-pdetail-grid">
          {/* Left Column: Gallery & Action Buttons */}
          <div className="fk-pdetail-left">
            <div className="fk-pdetail-thumbs">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`fk-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                >
                  <img src={imgUrl} alt="Thumbnail" />
                </button>
              ))}
            </div>

            <div className="fk-pdetail-main-img-box">
              <img 
                src={gallery[activeImageIndex]} 
                alt={product.title} 
                className="fk-pdetail-main-img" 
              />
            </div>
          </div>

          {/* Right Column: Product Specs & Buy Now */}
          <div className="fk-pdetail-right">
            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">{product.brand}</span>
            <h2 className="text-xl font-bold text-gray-900 mt-1 leading-snug">{product.title}</h2>

            {/* Ratings & Flipcart Assured */}
            <div className="flex items-center gap-3 mt-2">
              <div className="fk-rating-badge">
                <span>{product.rating}</span>
                <Star size={11} className="fill-white text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {product.reviewsCount.toLocaleString('en-IN')} Ratings & Reviews
              </span>
              {product.isAssured && (
                <div className="fk-assured-tag">
                  <span>✦ Assured</span>
                </div>
              )}
            </div>

            {/* Price Box */}
            <div className="fk-pdetail-price-box">
              <span className="text-2xl font-black text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              <span className="text-sm font-bold text-green-600">{product.discount}</span>
            </div>

            {/* Available Color Options */}
            {product.colorOptions && product.colorOptions.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-700 uppercase">Selected Color: <span className="text-blue-600 font-bold">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {product.colorOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border transition ${
                        selectedColor === c 
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Capacity / Size Options */}
            {product.capacityOptions && product.capacityOptions.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-bold text-gray-700 uppercase">Option / Size: <span className="text-blue-600 font-bold">{selectedCapacity}</span></p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {product.capacityOptions.map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setSelectedCapacity(cap)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border transition ${
                        selectedCapacity === cap 
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Available Bank Offers */}
            {product.offers && (
              <div className="mt-4 bg-green-50/70 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-bold text-green-800 flex items-center gap-1">
                  <Tag size={13} /> Available Offers
                </p>
                <ul className="mt-1 space-y-1">
                  {product.offers.map((off, i) => (
                    <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                      <span className="text-green-600 font-bold">•</span> {off}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Specs */}
            {product.specs && (
              <div className="mt-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-1.5">Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded border border-gray-200">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-gray-500 font-medium">{k}:</span>{' '}
                      <span className="font-semibold text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Big Action Buttons */}
            <div className="fk-pdetail-actions">
              <button 
                className="fk-btn-lg-cart"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
              >
                <ShoppingBag size={18} /> ADD TO CART
              </button>
              <button 
                className="fk-btn-lg-buynow"
                onClick={() => {
                  onBuyNow(product);
                  onClose();
                }}
              >
                <Zap size={18} className="fill-blue-900" /> BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
