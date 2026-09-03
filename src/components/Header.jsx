import React from 'react';
import { Search, ShoppingCart, User, ChevronDown, MapPin, Sparkles } from 'lucide-react';

export default function Header({ searchQueries, setSearchQuery, cartCount, openCart, onLoginClick, onLogoClick }) {
  return (
    <header className="fk-header">
      <div className="fk-header-container">
        {/* Logo Section */}
        <div className="fk-logo-group" onClick={onLogoClick}>
          <div className="fk-brand-logo">
            <span className="fk-brand-text">Flipcart</span>
            <span className="fk-brand-sub">
              Explore <span className="fk-plus">Plus</span>
              <Sparkles size={11} className="inline ml-0.5 text-yellow-400 fill-yellow-400" />
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="fk-search-box">
          <input
            type="text"
            className="fk-search-input"
            placeholder="Search for Products, Brands and More"
            value={searchQueries}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="fk-search-btn" aria-label="Search">
            <Search size={18} />
          </button>
        </div>

        {/* Action Items */}
        <div className="fk-header-actions">
          <button className="fk-login-btn" onClick={onLoginClick}>
            <User size={16} />
            <span>Login</span>
            <ChevronDown size={14} className="ml-1 opacity-70" />
          </button>

          <a href="#become-seller" className="fk-header-link hide-mobile">
            Become a Seller
          </a>

          <div className="fk-more-dropdown hide-mobile">
            <span>More</span>
            <ChevronDown size={14} className="ml-1" />
          </div>

          <button className="fk-cart-btn" onClick={openCart}>
            <div className="relative flex items-center">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="fk-cart-badge">{cartCount}</span>
              )}
            </div>
            <span className="font-semibold text-sm">Cart</span>
          </button>
        </div>
      </div>

      {/* Sub Header Location Bar */}
      <div className="fk-sub-bar">
        <div className="fk-sub-bar-container">
          <div className="fk-location-info">
            <MapPin size={14} className="text-blue-600 mr-1.5" />
            <span className="font-bold text-gray-700">600118</span>
            <span className="text-gray-500 ml-1">Select delivery location &gt;</span>
          </div>
          <div className="fk-top-services">
            <span className="fk-service-chip active">⚡ Minutes</span>
            <span className="fk-service-chip">✈️ Travel</span>
            <span className="fk-service-chip">🛒 Grocery</span>
          </div>
        </div>
      </div>
    </header>
  );
}
