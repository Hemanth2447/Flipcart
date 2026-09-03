import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Zap, Sparkles } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct, onBuyNow, onAddToCart }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="fk-product-card">
      {/* Badge Banner */}
      <div className="fk-card-badge-container">
        {product.isBestseller && (
          <span className="fk-badge bestseller">Bestseller</span>
        )}
        {product.isSponsored && (
          <span className="fk-badge sponsored">Sponsored</span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        className={`fk-wishlist-btn ${isWishlisted ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsWishlisted(!isWishlisted);
        }}
        aria-label="Wishlist"
      >
        <Heart size={16} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
      </button>

      {/* Product Image */}
      <div className="fk-product-img-wrapper" onClick={() => onSelectProduct(product)}>
        <img 
          src={product.image} 
          alt={product.title} 
          className="fk-product-img"
          loading="lazy"
        />
      </div>

      {/* Card Info */}
      <div className="fk-card-info" onClick={() => onSelectProduct(product)}>
        <span className="fk-brand-tag">{product.brand}</span>
        <h4 className="fk-product-title" title={product.title}>
          {product.title}
        </h4>

        {/* Rating and Flipcart Assured */}
        <div className="fk-rating-row">
          <div className="fk-rating-badge">
            <span>{product.rating}</span>
            <Star size={11} className="fill-white text-white" />
          </div>
          <span className="fk-reviews-count">({product.reviewsCount.toLocaleString('en-IN')})</span>

          {product.isAssured && (
            <div className="fk-assured-tag" title="Flipcart Assured Quality Check">
              <span>✦ Assured</span>
            </div>
          )}
        </div>

        {/* Price & Discount */}
        <div className="fk-price-row">
          <span className="fk-current-price">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="fk-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          <span className="fk-discount-tag">{product.discount}</span>
        </div>

        {/* Delivery note */}
        <div className="fk-delivery-tag">
          <span>{product.deliveryDays}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fk-card-actions">
        <button 
          className="fk-btn-cart"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
        >
          <ShoppingBag size={14} /> Add Cart
        </button>

        <button 
          className="fk-btn-buynow"
          onClick={(e) => {
            e.stopPropagation();
            onBuyNow(product);
          }}
        >
          <Zap size={14} className="fill-blue-900" /> Buy Now
        </button>
      </div>
    </div>
  );
}
