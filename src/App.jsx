import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import BannerSlider from './components/BannerSlider';
import SidebarFilters from './components/SidebarFilters';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartPage from './components/CartPage';
import CheckoutStep2 from './components/CheckoutStep2';
import PaymentStep3 from './components/PaymentStep3';
import OrderSuccessModal from './components/OrderSuccessModal';
import { PRODUCTS } from './data/products';
import { Sparkles, Lock } from 'lucide-react';

export default function App() {
  // Page View Navigation State: 'catalog' | 'cart' | 'checkout' | 'payment'
  const [currentView, setCurrentView] = useState('catalog');

  // Filter States
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('popularity');
  const [maxPrice, setMaxPrice] = useState(70000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [onlyAssured, setOnlyAssured] = useState(false);

  // Cart State (Initialized with Asics GEL Running Shoes as requested in reference screenshots)
  const [cart, setCart] = useState([
    {
      ...PRODUCTS[0], // Asics GEL - RUN ADAPT Running Shoes
      quantity: 1
    }
  ]);

  // Selected Product for Detail Modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Checkout & Payment Items State
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutAmount, setCheckoutAmount] = useState(0);

  // Order Success Confirmation Modal State
  const [completedOrderDetails, setCompletedOrderDetails] = useState(null);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Reset Filters
  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSortOption('popularity');
    setMaxPrice(70000);
    setSelectedRating(0);
    setOnlyAssured(false);
  };

  // Cart Actions
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added "${product.title.substring(0, 24)}..." to Cart!`);
  };

  const handleUpdateQty = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast('Item removed from Cart');
  };

  // BUY NOW Flow: Triggers Step 2 Order Summary directly
  const handleBuyNowDirect = (product) => {
    setCheckoutItems([{ ...product, quantity: 1 }]);
    setCheckoutAmount(product.price);
    setSelectedProduct(null);
    setCurrentView('checkout'); // Step 2 (Order Summary)
  };

  // Place Order from Cart: Navigates to Step 2 Order Summary
  const handlePlaceOrderFromCart = () => {
    if (cart.length === 0) return;
    setCheckoutItems(cart);
    setCurrentView('checkout'); // Step 2 (Order Summary)
  };

  // Step 2 Continue -> Step 3 Payment Page
  const handleContinueToPayment = (items, amount) => {
    setCheckoutItems(items);
    setCheckoutAmount(amount);
    setCurrentView('payment'); // Step 3 (Payment Page)
  };

  // Payment Success Handler
  const handlePaymentSuccess = (orderDetails) => {
    setCart([]);
    setCurrentView('catalog');
    setCompletedOrderDetails(orderDetails);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(q);
        const brandMatch = item.brand.toLowerCase().includes(q);
        const catMatch = item.category.toLowerCase().includes(q);
        if (!titleMatch && !brandMatch && !catMatch) return false;
      }
      if (item.price > maxPrice) return false;
      if (selectedRating > 0 && item.rating < selectedRating) return false;
      if (onlyAssured && !item.isAssured) return false;
      return true;
    }).sort((a, b) => {
      if (sortOption === 'lowToHigh') return a.price - b.price;
      if (sortOption === 'highToLow') return b.price - a.price;
      if (sortOption === 'newest') return b.rating - a.rating;
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [activeCategory, searchQuery, maxPrice, selectedRating, onlyAssured, sortOption]);

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles size={16} className="text-yellow-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Flipkart Header Bar */}
      <Header
        searchQueries={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        openCart={() => setCurrentView('cart')}
        onLogoClick={() => setCurrentView('catalog')}
        onLoginClick={() => showToast('Demo Account Logged In as Hemanth')}
      />

      {/* VIEW 1: INDIVIDUAL CART PAGE (Matching Image 1) */}
      {currentView === 'cart' && (
        <CartPage
          cart={cart}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onBuyNowItem={handleBuyNowDirect}
          onPlaceOrder={handlePlaceOrderFromCart}
          onContinueShopping={() => setCurrentView('catalog')}
        />
      )}

      {/* VIEW 2: CHECKOUT STEP 2 ORDER SUMMARY (Matching Image 2) */}
      {currentView === 'checkout' && (
        <CheckoutStep2
          checkoutItems={checkoutItems}
          onContinueToPayment={handleContinueToPayment}
          onBackToCart={() => setCurrentView('cart')}
        />
      )}

      {/* VIEW 3: CHECKOUT STEP 3 COMPLETE PAYMENT (Matching Image 3) */}
      {currentView === 'payment' && (
        <PaymentStep3
          checkoutItems={checkoutItems}
          totalAmount={checkoutAmount}
          onBackToCheckout={() => setCurrentView('checkout')}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* VIEW 4: CATALOG HOME PAGE */}
      {currentView === 'catalog' && (
        <>
          {/* Category Icons Navigation Bar */}
          <CategoryNav
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {/* Hero Banner Slider */}
          <BannerSlider
            onShopNowClick={() => {
              setActiveCategory('all');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
          />

          {/* Main Catalog Content */}
          <main className="fk-main-layout flex-1">
            {/* Product Grid Area */}
            <section className="fk-product-section">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div>
                  <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <span>Home</span> &gt;{' '}
                    <span className="capitalize font-bold text-gray-800">
                      {activeCategory === 'all' ? 'All Products' : activeCategory}
                    </span>
                    <span className="text-gray-400 font-normal">
                      ({filteredProducts.length} items shown)
                    </span>
                  </div>
                </div>
              </div>

              {/* Sort Buttons Bar */}
              <div className="fk-sort-bar">
                <span className="font-bold text-gray-800 text-xs">Sort By</span>
                <button
                  onClick={() => setSortOption('popularity')}
                  className={`fk-sort-btn ${sortOption === 'popularity' ? 'active' : ''}`}
                >
                  Popularity
                </button>
                <button
                  onClick={() => setSortOption('lowToHigh')}
                  className={`fk-sort-btn ${sortOption === 'lowToHigh' ? 'active' : ''}`}
                >
                  Price -- Low to High
                </button>
                <button
                  onClick={() => setSortOption('highToLow')}
                  className={`fk-sort-btn ${sortOption === 'highToLow' ? 'active' : ''}`}
                >
                  Price -- High to Low
                </button>
                <button
                  onClick={() => setSortOption('newest')}
                  className={`fk-sort-btn ${sortOption === 'newest' ? 'active' : ''}`}
                >
                  Customer Rating
                </button>
              </div>

              {/* Product Cards Grid */}
              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-base font-bold text-gray-700">No products found matching your filter criteria.</p>
                  <p className="text-xs text-gray-500 mt-1">Try resetting the filters or searching for another term.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded hover:bg-blue-700"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="fk-product-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={setSelectedProduct}
                      onBuyNow={handleBuyNowDirect}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Sidebar Filters */}
            <SidebarFilters
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              onlyAssured={onlyAssured}
              setOnlyAssured={setOnlyAssured}
              resetFilters={resetFilters}
            />
          </main>
        </>
      )}

      {/* Footer Banner */}
      <footer className="bg-gray-900 text-gray-400 text-xs py-8 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h5 className="text-white font-bold uppercase mb-2">ABOUT</h5>
            <ul className="space-y-1">
              <li><a href="#contact" className="hover:underline">Contact Us</a></li>
              <li><a href="#about" className="hover:underline">About Us</a></li>
              <li><a href="#careers" className="hover:underline">Careers</a></li>
              <li><a href="#stories" className="hover:underline">Flipcart Stories</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold uppercase mb-2">HELP</h5>
            <ul className="space-y-1">
              <li><a href="#payments" className="hover:underline">Payments (UPI, QR, COD)</a></li>
              <li><a href="#shipping" className="hover:underline">Shipping & Delivery</a></li>
              <li><a href="#cancellation" className="hover:underline">Cancellation & Returns</a></li>
              <li><a href="#faq" className="hover:underline">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold uppercase mb-2">CONSUMER POLICY</h5>
            <ul className="space-y-1">
              <li><a href="#return-policy" className="hover:underline">Cancellation & Return Policy</a></li>
              <li><a href="#terms" className="hover:underline">Terms Of Use</a></li>
              <li><a href="#security" className="hover:underline">Security</a></li>
              <li><a href="#privacy" className="hover:underline">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold uppercase mb-2">PAYMENT METHODS</h5>
            <p className="text-[11px] leading-relaxed">
              Supports <span className="text-white font-semibold">Pay by UPI</span> (Google Pay, PhonePe, Sentry Pay), <span className="text-white font-semibold">Pay by QR Code</span>, and <span className="text-white font-semibold">Cash on Delivery (COD)</span>.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-gray-800 flex justify-between items-center text-[11px]">
          <span>© 2026 Flipcart Clone Demo. All rights reserved.</span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Lock size={12} /> 256-bit Secure Checkout Encryption
          </span>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onBuyNow={handleBuyNowDirect}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Order Success Confirmation Modal */}
      {completedOrderDetails && (
        <OrderSuccessModal
          orderDetails={completedOrderDetails}
          onClose={() => setCompletedOrderDetails(null)}
        />
      )}
    </div>
  );
}
