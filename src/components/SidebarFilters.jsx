import React from 'react';
import { Filter, Star, ChevronDown, Check } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function SidebarFilters({
  activeCategory,
  setActiveCategory,
  maxPrice,
  setMaxPrice,
  selectedRating,
  setSelectedRating,
  onlyAssured,
  setOnlyAssured,
  resetFilters
}) {
  return (
    <aside className="fk-sidebar-filters">
      <div className="fk-filter-header">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
          <Filter size={18} className="text-blue-600" /> Filters
        </h3>
        <button onClick={resetFilters} className="text-blue-600 text-xs font-semibold hover:underline">
          CLEAR ALL
        </button>
      </div>

      {/* Categories Filter Section */}
      <div className="fk-filter-section">
        <div className="fk-filter-title">
          <span>CATEGORIES</span>
        </div>
        <div className="fk-filter-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`fk-cat-filter-btn ${activeCategory === cat.id ? 'selected' : ''}`}
            >
              <span className="text-xs">{cat.id === 'all' ? '‹ All Categories' : `• ${cat.name}`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Flipcart Assured Checkbox */}
      <div className="fk-filter-section">
        <label className="fk-checkbox-row cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyAssured}
            onChange={(e) => setOnlyAssured(e.target.checked)}
            className="accent-blue-600 w-4 h-4 rounded cursor-pointer"
          />
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-gray-700">Flipcart</span>
            <span className="bg-yellow-400 text-blue-900 font-extrabold text-[10px] px-1.5 py-0.5 rounded italic">
              ✦ Assured
            </span>
          </div>
        </label>
      </div>

      {/* Price Slider */}
      <div className="fk-filter-section">
        <div className="fk-filter-title">
          <span>PRICE</span>
        </div>
        <div className="px-1 py-2">
          <input
            type="range"
            min="300"
            max="70000"
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium">
            <span>₹300</span>
            <span className="text-blue-700 font-bold">Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Customer Ratings Filter */}
      <div className="fk-filter-section">
        <div className="fk-filter-title">
          <span>CUSTOMER RATINGS</span>
        </div>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <label key={stars} className="fk-checkbox-row text-xs text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="ratingFilter"
                checked={selectedRating === stars}
                onChange={() => setSelectedRating(stars)}
                className="accent-blue-600"
              />
              <span className="flex items-center gap-1 font-medium">
                {stars} <Star size={12} className="fill-yellow-400 text-yellow-400" /> & above
              </span>
            </label>
          ))}
          <label className="fk-checkbox-row text-xs text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="ratingFilter"
              checked={selectedRating === 0}
              onChange={() => setSelectedRating(0)}
              className="accent-blue-600"
            />
            <span className="font-medium text-gray-500">Any Rating</span>
          </label>
        </div>
      </div>

      {/* Customer Support Banner */}
      <div className="fk-filter-help-card">
        <p className="text-xs text-gray-600 font-medium">Need Help?</p>
        <p className="text-xs font-bold text-blue-700 mt-0.5">24x7 Customer Support & Free Returns</p>
      </div>
    </aside>
  );
}
