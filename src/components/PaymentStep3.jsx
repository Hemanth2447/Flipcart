import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Lock, ShieldCheck, QrCode, Smartphone, CreditCard, 
  Banknote, Gift, ChevronUp, RefreshCw, AlertCircle, Sparkles, Check,
  ExternalLink, SmartphoneCharging, ShieldAlert, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentStep3({ 
  checkoutItems, 
  totalAmount, 
  onBackToCheckout, 
  onPaymentSuccess 
}) {
  const [selectedMethod, setSelectedMethod] = useState('qr'); // 'qr' | 'upi' | 'card' | 'emi' | 'cod' | 'giftcard'
  const [selectedUpiOption, setSelectedUpiOption] = useState('sentrypay'); // 'sentrypay' | 'gpay' | 'phonepe' | 'custom'
  const [customUpiId, setCustomUpiId] = useState('');
  
  // Captcha for COD
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('834');
  const [captchaError, setCaptchaError] = useState(false);

  // App Redirection & Detection Modal State
  const [redirectingApp, setRedirectingApp] = useState(null); // null | { name, scheme, icon, deepLink }
  const [appDetectedState, setAppDetectedState] = useState('checking'); // 'checking' | 'redirected' | 'not_found'
  
  // General Payment Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('');

  // QR Expiry Timer
  const [timerSeconds, setTimerSeconds] = useState(300);

  useEffect(() => {
    const code = Math.floor(100 + Math.random() * 900).toString();
    setCaptchaCode(code);
  }, []);

  useEffect(() => {
    if (selectedMethod === 'qr' && timerSeconds > 0) {
      const timer = setInterval(() => setTimerSeconds((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [selectedMethod, timerSeconds]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // UPI Deep Link Generator with Mobile App Detection
  const getUpiDeepLink = (appKey, upiVpa) => {
    const payeeVpa = upiVpa || 'flipcart.pay@bank';
    const payeeName = encodeURIComponent('Flipcart Online Shopping');
    const amount = totalAmount.toFixed(2);
    const txnNote = encodeURIComponent(`Flipcart Order Payment`);
    const txnId = 'FK' + Math.floor(100000000 + Math.random() * 900000000);

    const baseParams = `pa=${payeeVpa}&pn=${payeeName}&am=${amount}&cu=INR&tn=${txnNote}&tr=${txnId}`;

    if (appKey === 'sentrypay') {
      return {
        name: 'SentryPay',
        scheme: `sentrypay://pay?${baseParams}`,
        intentUrl: `intent://pay?${baseParams}#Intent;scheme=sentrypay;package=com.sentrypay;end`,
        webUrl: `https://sentrypay.com/pay?${baseParams}`,
        fallbackIntent: `upi://pay?${baseParams}`,
        icon: 'SentryPay',
        color: 'from-emerald-700 to-teal-800',
        badgeBg: 'bg-emerald-700'
      };
    } else if (appKey === 'gpay') {
      return {
        name: 'Google Pay (GPay)',
        scheme: `gpay://upi/pay?${baseParams}`,
        intentUrl: `intent://upi/pay?${baseParams}#Intent;scheme=gpay;package=com.google.android.apps.nfc.payment;end`,
        webUrl: `https://pay.google.com`,
        fallbackIntent: `upi://pay?${baseParams}`,
        icon: 'GPay',
        color: 'from-blue-600 to-emerald-600',
        badgeBg: 'bg-blue-600'
      };
    } else if (appKey === 'phonepe') {
      return {
        name: 'PhonePe',
        scheme: `phonepe://pay?${baseParams}`,
        intentUrl: `intent://pay?${baseParams}#Intent;scheme=phonepe;package=com.phonepe.app;end`,
        webUrl: `https://www.phonepe.com`,
        fallbackIntent: `upi://pay?${baseParams}`,
        icon: 'PhonePe',
        color: 'from-purple-700 to-indigo-800',
        badgeBg: 'bg-purple-700'
      };
    } else {
      return {
        name: 'UPI App',
        scheme: `upi://pay?${baseParams}`,
        intentUrl: `upi://pay?${baseParams}`,
        webUrl: `https://upi.org`,
        fallbackIntent: `upi://pay?${baseParams}`,
        icon: 'UPI',
        color: 'from-indigo-600 to-blue-700',
        badgeBg: 'bg-indigo-600'
      };
    }
  };

  // Handle Mobile App Checking & Redirection to Sentry Pay / UPI App (GPay, PhonePe, Sentry Pay)
  const handleUpiRedirection = (appKey) => {
    setSelectedUpiOption(appKey);
    const vpa = appKey === 'custom' ? customUpiId : 'flipcart.pay@bank';
    const appInfo = getUpiDeepLink(appKey, vpa);

    setRedirectingApp(appInfo);
    setAppDetectedState('checking');

    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isMobile = isAndroid || isIOS;

    // Trigger deep link attempt to open the native app on mobile
    try {
      if (isAndroid && appInfo.intentUrl) {
        window.location.href = appInfo.intentUrl;
      } else {
        window.location.href = appInfo.scheme;
      }
    } catch (err) {
      console.log('App launch trigger error:', err);
    }

    // Monitor whether app opens (window blur / visibility change / pagehide)
    let hasBlurred = false;
    const handleBlur = () => {
      hasBlurred = true;
    };
    const handleVisibility = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        hasBlurred = true;
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('pagehide', handleBlur);
    document.addEventListener('visibilitychange', handleVisibility);

    setTimeout(() => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('pagehide', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibility);

      if (hasBlurred) {
        // Mobile application detected & opened on the device
        setAppDetectedState('redirected');
      } else {
        // Mobile app not detected / not installed or running on desktop
        setAppDetectedState('not_found');
      }
    }, 2000);
  };

  // Complete Payment after redirect / simulation
  const handleCompletePaymentFromApp = (methodName, detailStr) => {
    setRedirectingApp(null);
    setIsProcessing(true);
    setProcessingMsg(`Verifying response from ${methodName}...`);

    setTimeout(() => {
      setProcessingMsg(`Bank authorization confirmed for ₹${totalAmount.toLocaleString('en-IN')}!`);
    }, 1500);

    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log('Confetti effect');
      }

      onPaymentSuccess({
        method: methodName,
        detail: detailStr,
        amount: totalAmount,
        orderId: 'OD' + Math.floor(100000000000 + Math.random() * 900000000000),
        items: checkoutItems
      });
    }, 2800);
  };

  const handlePayNow = (methodName, detailStr) => {
    if (selectedMethod === 'cod') {
      if (captchaInput !== captchaCode) {
        setCaptchaError(true);
        return;
      }
    }

    setCaptchaError(false);
    setIsProcessing(true);
    setProcessingMsg(`Initiating ${methodName}...`);

    setTimeout(() => {
      setProcessingMsg(`Verifying authorization with bank gateway...`);
    }, 1200);

    setTimeout(() => {
      setProcessingMsg(`Confirming payment of ₹${totalAmount.toLocaleString('en-IN')}...`);
    }, 2400);

    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log('Confetti effect');
      }

      onPaymentSuccess({
        method: methodName,
        detail: detailStr,
        amount: totalAmount,
        orderId: 'OD' + Math.floor(100000000000 + Math.random() * 900000000000),
        items: checkoutItems
      });
    }, 3600);
  };

  const mrpTotal = checkoutItems.reduce((s, i) => s + (i.originalPrice || 6999) * i.quantity, 0);
  const platformFee = 9;
  const mrpDiscount = Math.max(0, mrpTotal - (totalAmount - platformFee) - 100);

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-16 font-sans">
      {/* App Redirection & Detection Modal Overlay */}
      {redirectingApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-fadeIn">
            {/* Header */}
            <div className={`bg-gradient-to-r ${redirectingApp.color} text-white p-6 text-center relative`}>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
                {redirectingApp.icon === 'GPay' && <span className="font-black text-xl text-white">GPay</span>}
                {redirectingApp.icon === 'PhonePe' && <span className="font-extrabold text-xl text-white">पे</span>}
                {(redirectingApp.icon === 'SentryPay' || redirectingApp.icon === 'Sentry Pay') && <span className="text-2xl">🛡️</span>}
                {redirectingApp.icon === 'UPI' && <span className="font-black text-lg">UPI</span>}
              </div>
              <h3 className="text-xl font-extrabold">{redirectingApp.name}</h3>
              <p className="text-xs text-blue-100 mt-1">UPI Deep Link Payment Launcher</p>
            </div>

            {/* Content Body */}
            <div className="p-6 text-center">
              {appDetectedState === 'checking' && (
                <div className="space-y-4 py-2">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <SmartphoneCharging size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">
                      Checking for {redirectingApp.name} installed on your device...
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Attempting redirect to <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px] text-blue-700">{redirectingApp.scheme.substring(0, 30)}...</code>
                    </p>
                  </div>
                </div>
              )}

              {appDetectedState === 'redirected' && (
                <div className="space-y-4 py-2">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">
                      Redirected to {redirectingApp.name}!
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Complete payment in the {redirectingApp.name} app. Return to this tab after payment is authorized.
                    </p>
                  </div>

                  <button
                    onClick={() => handleCompletePaymentFromApp(redirectingApp.name, 'Authorized via Native App')}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase rounded-lg shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> CONFIRM PAYMENT COMPLETED IN APP
                  </button>
                </div>
              )}

              {appDetectedState === 'not_found' && (
                <div className="space-y-4 py-1">
                  <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">
                      {redirectingApp.name} App Not Automatically Detected
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      If you are on desktop or {redirectingApp.name} is not installed, you can trigger deep link manually, scan QR code, or complete via simulated response.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        window.location.href = redirectingApp.fallbackIntent;
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink size={14} /> Open {redirectingApp.name} App (Force Deep Link)
                    </button>

                    <button
                      onClick={() => handleCompletePaymentFromApp(redirectingApp.name, 'Simulated App Authorization')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={14} /> SIMULATE SUCCESSFUL APP PAYMENT (₹{totalAmount.toLocaleString('en-IN')})
                    </button>

                    <button
                      onClick={() => setRedirectingApp(null)}
                      className="w-full py-2 text-gray-500 hover:text-gray-800 text-xs font-semibold"
                    >
                      Cancel & Choose Another Method
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Blue Header Bar matching Flipkart Payment Header */}
      <header className="bg-[#2874f0] text-white py-3 px-4 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold italic text-2xl tracking-tighter text-white">
              Flipkart
            </span>
          </div>

          <div className="flex items-center gap-1 bg-blue-800/60 px-3 py-1 rounded text-xs font-semibold text-blue-100 border border-blue-400/30">
            <Lock size={12} className="text-yellow-300" />
            <span>100% Secure</span>
          </div>
        </div>
      </header>

      {/* Sub Header Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBackToCheckout}
            className="flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-blue-600 transition"
          >
            <ArrowLeft size={16} /> Complete Payment
          </button>
          <span className="text-xs font-extrabold text-blue-700">
            Total Payable: ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
        {isProcessing ? (
          /* Processing State Loader */
          <div className="bg-white rounded border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <ShieldCheck size={32} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">Processing Payment...</h3>
            <p className="text-sm font-semibold text-blue-600 mt-2 bg-blue-50 px-5 py-2 rounded-full border border-blue-200 shadow-sm">
              {processingMsg}
            </p>
            <p className="text-xs text-gray-400 mt-4">Please do not refresh or close this browser window.</p>
          </div>
        ) : (
          /* Main 3 Column / 2 Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column + Middle Panel Combined */}
            <div className="lg:col-span-2 bg-white rounded border border-gray-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[460px]">
              
              {/* Left Payment Option Menu */}
              <div className="bg-gray-50 border-r border-gray-200 p-2 space-y-1">
                {/* 1. Recommended / QR Code */}
                <button
                  onClick={() => setSelectedMethod('qr')}
                  className={`w-full text-left p-3 rounded-md flex items-center gap-3 transition ${
                    selectedMethod === 'qr'
                      ? 'bg-white text-blue-700 font-bold shadow-sm border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 font-medium'
                  }`}
                >
                  <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    👍
                  </div>
                  <div>
                    <span className="text-xs block font-bold">Recommended for You</span>
                    <span className="text-[10px] text-gray-500 block">Scan QR and Pay</span>
                  </div>
                </button>

                {/* 2. Pay by UPI */}
                <button
                  onClick={() => setSelectedMethod('upi')}
                  className={`w-full text-left p-3 rounded-md flex items-center justify-between transition ${
                    selectedMethod === 'upi'
                      ? 'bg-white text-blue-700 font-bold shadow-sm border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black flex-shrink-0">
                      UPI
                    </div>
                    <div>
                      <span className="text-xs block font-bold">UPI</span>
                      <span className="text-[10px] text-gray-500 block">Pay by any UPI app</span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-green-100 text-green-800 font-bold px-1 py-0.5 rounded">FAST</span>
                </button>

                {/* 3. Credit / Debit Card */}
                <button
                  onClick={() => setSelectedMethod('card')}
                  className={`w-full text-left p-3 rounded-md transition ${
                    selectedMethod === 'card'
                      ? 'bg-white text-blue-700 font-bold shadow-sm border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                      <CreditCard size={14} />
                    </div>
                    <div>
                      <span className="text-xs block font-bold">Credit / Debit / ATM Card</span>
                      <span className="text-[10px] text-gray-500 block">Add and secure cards</span>
                    </div>
                  </div>
                </button>

                {/* 4. EMI */}
                <button
                  onClick={() => setSelectedMethod('emi')}
                  className={`w-full text-left p-3 rounded-md transition ${
                    selectedMethod === 'emi'
                      ? 'bg-white text-blue-700 font-bold shadow-sm border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      📅
                    </div>
                    <div>
                      <span className="text-xs block font-bold">EMI</span>
                      <span className="text-[10px] text-gray-500 block">Credit Card EMI</span>
                    </div>
                  </div>
                </button>

                {/* 5. Cash on Delivery */}
                <button
                  onClick={() => setSelectedMethod('cod')}
                  className={`w-full text-left p-3 rounded-md transition ${
                    selectedMethod === 'cod'
                      ? 'bg-white text-blue-700 font-bold shadow-sm border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Banknote size={14} />
                    </div>
                    <div>
                      <span className="text-xs block font-bold">Cash on Delivery</span>
                    </div>
                  </div>
                </button>

                {/* 6. Flipkart Gift Card */}
                <button
                  onClick={() => setSelectedMethod('giftcard')}
                  className={`w-full text-left p-3 rounded-md transition ${
                    selectedMethod === 'giftcard'
                      ? 'bg-white text-blue-700 font-bold shadow-sm border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0">
                      <Gift size={14} />
                    </div>
                    <div>
                      <span className="text-xs block font-bold">Have a Flipkart Gift Card?</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Middle Active Panel View */}
              <div className="md:col-span-2 p-5 bg-white flex flex-col justify-between">

                {/* METHOD 1: SCAN QR AND PAY (Default / Recommended) */}
                {selectedMethod === 'qr' && (
                  <div className="text-center py-2 flex flex-col items-center justify-between h-full">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900 mb-1">Scan QR and Pay</h3>
                      <p className="text-xs text-gray-500 font-semibold mb-3">
                        AMOUNT <strong className="text-gray-900 text-sm">₹{totalAmount.toLocaleString('en-IN')}</strong>
                      </p>

                      {/* QR Display Card */}
                      <div className="relative inline-block bg-white p-4 rounded-xl border-2 border-dashed border-blue-400 shadow-md">
                        {/* Animated Scanner Line */}
                        <div className="absolute left-2 right-2 h-0.5 bg-blue-500 animate-pulse top-1/2"></div>
                        
                        <div className="w-44 h-44 bg-gray-900 p-2.5 rounded-lg flex items-center justify-center mx-auto relative overflow-hidden">
                          {/* Generated QR Code Graphic */}
                          <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                            <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 10h10v10H40zM50 40h20v10H50zM10 40h20v20H10zM40 70h20v20H40zM70 70h30v10H70zM80 90h20v10H80z" />
                            <rect x="42" y="42" width="16" height="16" fill="#2874f0" rx="3" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white px-2 py-1 rounded shadow-md border border-gray-200">
                              <span className="text-[10px] font-black text-blue-600 tracking-tighter">FK PAY</span>
                            </div>
                          </div>
                        </div>

                        {/* Show QR Code button label */}
                        <button className="mt-3 px-4 py-1 bg-blue-50 text-blue-700 rounded-full font-bold text-xs border border-blue-200 shadow-sm">
                          Show QR code
                        </button>
                      </div>

                      {/* App Logos under QR */}
                      <div className="mt-4 flex items-center justify-center gap-3">
                        <div className="px-2.5 py-1 bg-gray-100 rounded border text-xs font-bold flex items-center gap-1">
                          <span className="text-blue-500">G</span>
                          <span className="text-red-500">P</span>
                          <span className="text-yellow-500">a</span>
                          <span className="text-green-500">y</span>
                        </div>
                        <div className="px-2.5 py-1 bg-purple-700 text-white rounded text-xs font-bold">
                          पे PhonePe
                        </div>
                        <div className="px-2.5 py-1 bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1">
                          🛡️ SentryPay
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">or any other UPI app</p>
                    </div>

                    <div className="w-full mt-4">
                      <button
                        onClick={() => handlePayNow('QR Code Scan', 'Scanned via UPI App')}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase rounded shadow-md transition flex items-center justify-center gap-2"
                      >
                        <Sparkles size={16} /> SIMULATE QR SCAN & PAY ₹{totalAmount.toLocaleString('en-IN')}
                      </button>
                    </div>
                  </div>
                )}

                {/* METHOD 2: PAY BY UPI */}
                {selectedMethod === 'upi' && (
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 border-b pb-2 mb-4 flex justify-between items-center">
                      <span>Select UPI App for Redirection</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Zero Gateway Fee
                      </span>
                    </h3>

                    <div className="space-y-3 text-xs">
                      {/* SentryPay Option */}
                      <div 
                        onClick={() => handleUpiRedirection('sentrypay')}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition relative overflow-hidden ${
                          selectedUpiOption === 'sentrypay'
                            ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-sm'
                            : 'border-gray-200 hover:border-emerald-400 hover:bg-gray-50/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="upiOption"
                            checked={selectedUpiOption === 'sentrypay'}
                            onChange={() => handleUpiRedirection('sentrypay')}
                            className="accent-emerald-600 w-4 h-4 cursor-pointer"
                          />
                          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm text-base flex-shrink-0">
                            🛡️
                          </div>
                          <div>
                            <div className="font-extrabold text-gray-900 flex items-center gap-1.5 flex-wrap">
                              <span>SentryPay</span>
                              <span className="bg-emerald-600 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                RECOMMENDED
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-500 block mt-0.5">
                              Auto-detects SentryPay mobile app & opens payment page (same as GPay)
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <span className="font-extrabold text-emerald-700 block text-xs">₹50 OFF</span>
                          <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-100/80 px-1.5 py-0.5 rounded inline-block mt-0.5">
                            Open App
                          </span>
                        </div>
                      </div>

                      {/* Google Pay */}
                      <label 
                        onClick={() => setSelectedUpiOption('gpay')}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                          selectedUpiOption === 'gpay'
                            ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="upiOption"
                            checked={selectedUpiOption === 'gpay'}
                            onChange={() => setSelectedUpiOption('gpay')}
                            className="accent-blue-600"
                          />
                          <div className="w-8 h-8 rounded bg-white border border-gray-200 font-black text-xs flex items-center justify-center shadow-sm">
                            <span className="text-blue-500">G</span><span className="text-red-500">P</span><span className="text-yellow-500">a</span><span className="text-green-500">y</span>
                          </div>
                          <div>
                            <span className="font-extrabold text-gray-900 block">Google Pay (GPay)</span>
                            <span className="text-[10px] text-gray-500 block">Checks app availability & redirects to GPay</span>
                          </div>
                        </div>
                      </label>

                      {/* PhonePe */}
                      <label 
                        onClick={() => setSelectedUpiOption('phonepe')}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                          selectedUpiOption === 'phonepe'
                            ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="upiOption"
                            checked={selectedUpiOption === 'phonepe'}
                            onChange={() => setSelectedUpiOption('phonepe')}
                            className="accent-purple-600"
                          />
                          <div className="w-8 h-8 rounded bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                            पे
                          </div>
                          <div>
                            <span className="font-extrabold text-gray-900 block">PhonePe</span>
                            <span className="text-[10px] text-gray-500 block">Checks app availability & redirects to PhonePe</span>
                          </div>
                        </div>
                      </label>

                      {/* Custom UPI ID */}
                      <label 
                        onClick={() => setSelectedUpiOption('custom')}
                        className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition ${
                          selectedUpiOption === 'custom'
                            ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <input
                            type="radio"
                            name="upiOption"
                            checked={selectedUpiOption === 'custom'}
                            onChange={() => setSelectedUpiOption('custom')}
                            className="accent-blue-600 mt-1"
                          />
                          <div className="flex-1">
                            <span className="font-extrabold text-gray-900 block">Enter UPI ID / VPA</span>
                            <span className="text-[10px] text-gray-500 block">e.g. mobile@upi or username@okaxis</span>

                            {selectedUpiOption === 'custom' && (
                              <div className="mt-2">
                                <input
                                  type="text"
                                  placeholder="username@upi"
                                  value={customUpiId}
                                  onChange={(e) => setCustomUpiId(e.target.value)}
                                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>

                    <button
                      onClick={() => handleUpiRedirection(selectedUpiOption)}
                      className={`w-full mt-6 py-3 font-extrabold text-xs uppercase rounded shadow-md transition flex items-center justify-center gap-2 ${
                        selectedUpiOption === 'sentrypay'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'
                      }`}
                    >
                      {selectedUpiOption === 'sentrypay' ? (
                        <>
                          <ShieldCheck size={16} />
                          <span>PAY ₹{Math.max(1, totalAmount - 50).toLocaleString('en-IN')} VIA SENTRYPAY (OPENS APP)</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink size={14} />
                          <span>PAY ₹{totalAmount.toLocaleString('en-IN')} VIA {selectedUpiOption.toUpperCase()}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* METHOD 3: CASH ON DELIVERY */}
                {selectedMethod === 'cod' && (
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 border-b pb-2 mb-3">
                      Cash on Delivery (COD)
                    </h3>

                    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900 space-y-1">
                      <p className="font-bold flex items-center gap-1 text-amber-950">
                        <AlertCircle size={14} className="text-amber-600" /> Cash on Delivery Instructions:
                      </p>
                      <p>• Please keep exact cash of ₹{totalAmount.toLocaleString('en-IN')} ready for the delivery partner.</p>
                    </div>

                    {/* Captcha Box */}
                    <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <label className="text-xs font-bold text-gray-700 block mb-2">
                        Enter the code shown below:
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-800 text-yellow-400 font-mono text-lg font-bold tracking-widest px-3 py-1 rounded select-none flex items-center gap-2">
                          <span>{captchaCode}</span>
                          <button 
                            onClick={() => setCaptchaCode(Math.floor(100 + Math.random() * 900).toString())}
                            className="text-gray-400 hover:text-white"
                          >
                            <RefreshCw size={12} />
                          </button>
                        </div>

                        <input
                          type="text"
                          maxLength="3"
                          placeholder="Code"
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          className={`w-20 px-2 py-1.5 text-center text-base font-bold border rounded focus:outline-none ${
                            captchaError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-600'
                          }`}
                        />
                      </div>
                      {captchaError && (
                        <p className="text-xs text-red-600 font-bold mt-1">❌ Invalid code. Try again.</p>
                      )}
                    </div>

                    <button
                      onClick={() => handlePayNow('Cash on Delivery', 'Pay cash upon arrival')}
                      className="w-full mt-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase rounded shadow transition"
                    >
                      CONFIRM COD ORDER (₹{totalAmount.toLocaleString('en-IN')})
                    </button>
                  </div>
                )}

                {/* METHOD 4: CREDIT / DEBIT CARD */}
                {selectedMethod === 'card' && (
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 border-b pb-2 mb-3">
                      Credit / Debit / ATM Card
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="4532 •••• •••• 8912"
                          className="w-full p-2 border rounded focus:outline-none focus:border-blue-600"
                          defaultValue="4532 9812 3456 8912"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Valid Thru (MM/YY)</label>
                          <input
                            type="text"
                            placeholder="08/28"
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-600"
                            defaultValue="12/28"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength="3"
                            placeholder="•••"
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-600"
                            defaultValue="381"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePayNow('Credit/Debit Card', 'Visa Ending 8912')}
                      className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase rounded shadow transition"
                    >
                      PAY ₹{totalAmount.toLocaleString('en-IN')} NOW
                    </button>
                  </div>
                )}

                {/* METHOD 5: EMI */}
                {selectedMethod === 'emi' && (
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 border-b pb-2 mb-3">
                      Credit Card EMI
                    </h3>
                    <p className="text-xs text-gray-600">
                      Select your issuing bank to view flexible 3, 6, 9 or 12 month EMI plans.
                    </p>
                    <div className="mt-4 space-y-2 text-xs">
                      <select className="w-full p-2 border border-gray-300 rounded font-semibold text-gray-800">
                        <option>HDFC Bank Credit Card (No Cost EMI from ₹1,136/mo)</option>
                        <option>Axis Bank Credit Card (EMI from ₹1,150/mo)</option>
                        <option>ICICI Bank Credit Card (EMI from ₹1,160/mo)</option>
                        <option>SBI Card (EMI from ₹1,170/mo)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handlePayNow('Credit Card EMI', 'HDFC Bank EMI Plan')}
                      className="w-full mt-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase rounded shadow transition"
                    >
                      PROCEED WITH EMI
                    </button>
                  </div>
                )}

                {/* METHOD 6: GIFT CARD */}
                {selectedMethod === 'giftcard' && (
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 border-b pb-2 mb-3">
                      Flipkart Gift Card
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Voucher Number</label>
                        <input
                          type="text"
                          placeholder="Enter 16-digit voucher number"
                          className="w-full p-2 border rounded focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Voucher PIN</label>
                        <input
                          type="password"
                          placeholder="Enter 6-digit PIN"
                          className="w-full p-2 border rounded focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handlePayNow('Flipkart Gift Card', 'Voucher Applied')}
                      className="w-full mt-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs uppercase rounded shadow transition"
                    >
                      APPLY & PAY ₹{totalAmount.toLocaleString('en-IN')}
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Right Sidebar: Price Details matching Image 3 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded border border-gray-200 shadow-sm p-4 sticky top-20">
                <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-3">
                  Price Details
                </h3>

                <div className="mt-3 space-y-3 text-xs">
                  <div className="flex justify-between text-gray-800">
                    <span>MRP (incl. of all taxes)</span>
                    <span className="font-semibold">₹{mrpTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-gray-800">
                    <span className="flex items-center gap-1">
                      Fees <ChevronUp size={12} className="text-gray-400" />
                    </span>
                    <span className="font-semibold">₹{platformFee}</span>
                  </div>

                  <div className="flex justify-between text-gray-800">
                    <span className="text-gray-500 pl-3">Platform Fee</span>
                    <span className="font-semibold">₹9</span>
                  </div>

                  <div className="flex justify-between text-green-700 font-semibold">
                    <span className="flex items-center gap-1">
                      Discounts <ChevronUp size={12} className="text-green-600" />
                    </span>
                    <span>- ₹{(mrpDiscount + 100).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-green-700 pl-3">
                    <span>MRP Discount</span>
                    <span>- ₹{mrpDiscount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-green-700 pl-3">
                    <span>Coupons for you</span>
                    <span>- ₹100</span>
                  </div>

                  <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between text-sm font-extrabold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-blue-700 font-black">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* 5% Instant Discount Promo Card matching Image 3 */}
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-extrabold block text-emerald-800">5% instant discount</span>
                    <span className="text-[11px] text-emerald-700 block">Claim now with payment offers</span>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-100 px-1.5 py-1 rounded border border-emerald-300 text-[10px] font-bold text-emerald-800">
                    <span>💳</span>
                    <span>+3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
