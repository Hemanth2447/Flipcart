import React, { useState, useEffect } from 'react';
import { HERO_BANNERS } from '../data/products';
import { ChevronLeft, ChevronRight, Tag, ArrowRight } from 'lucide-react';

export default function BannerSlider({ onShopNowClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);

  const banner = HERO_BANNERS[currentSlide];

  return (
    <div className="fk-hero-slider-wrapper">
      <div 
        className="fk-hero-banner"
        style={{ background: banner.bgGradient }}
      >
        <div className="fk-banner-content">
          <div className="fk-banner-tag">
            <Tag size={13} className="mr-1 inline" /> {banner.tag}
          </div>
          <h2 className="fk-banner-title">{banner.title}</h2>
          <p className="fk-banner-subtitle">{banner.subtitle}</p>
          <div className="fk-banner-offer">
            <span>💳 {banner.bankOffer}</span>
          </div>
          <button className="fk-banner-btn" onClick={onShopNowClick}>
            Shop Essentials <ArrowRight size={16} className="ml-1 inline" />
          </button>
        </div>

        {/* Decorative graphic elements */}
        <div className="fk-banner-graphic">
          <div className="fk-graphic-badge">
            <span className="text-3xl font-extrabold text-yellow-300">MIN. 70%</span>
            <span className="text-xs uppercase tracking-wider text-white font-bold">DISCOUNT OFF</span>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button onClick={prevSlide} className="fk-slide-nav prev" aria-label="Previous Slide">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextSlide} className="fk-slide-nav next" aria-label="Next Slide">
          <ChevronRight size={20} />
        </button>

        {/* Slide Indicators */}
        <div className="fk-slide-dots">
          {HERO_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`fk-dot ${idx === currentSlide ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
