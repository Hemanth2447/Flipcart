import React, { useState, useEffect } from 'react';
import { 
  X, QrCode, ShieldCheck, CreditCard, Banknote, Smartphone, 
  CheckCircle2, ArrowRight, Lock, Sparkles, RefreshCw, AlertCircle,
  ExternalLink, SmartphoneCharging, ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentModal({ items, totalAmount, onClose, onPaymentSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi', 'qr', 'cod', 'card'
  const [selectedUpiOption, setSelectedUpiOption] = useState('sentrypay'); // 'gpay', 'phonepe', 'sentrypay', 'custom'
  const [customUpiId, setCustomUpiId] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('834');
  const [captchaError, setCaptchaError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(300);

  // App Redirection & Detection Modal State
  const [redirectingApp, setRedirectingApp] = useState(null);
  const [appDetectedState, setAppDetectedState] = useState('checking');

  // Generate random captcha code
  useEffect(() => {
    const code = Math.floor(100 + Math.random() * 900).toString();
    setCaptchaCode(code);
  }, []);

  // Timer for QR code expiry
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
        color: 'from-emerald-700 to-teal-800'
      };
    } else if (appKey === 'gpay') {
      return {
        name: 'Google Pay (GPay)',
        scheme: `gpay://upi/pay?${baseParams}`,
        intentUrl: `intent://upi/pay?${baseParams}#Intent;scheme=gpay;package=com.google.android.apps.nfc.payment;end`,
        webUrl: `https://pay.google.com`,
        fallbackIntent: `upi://pay?${baseParams}`,
        icon: 'GPay',
        color: 'from-blue-600 to-emerald-600'
      };
    } else if (appKey === 'phonepe') {
      return {
        name: 'PhonePe',
        scheme: `phonepe://pay?${baseParams}`,
        intentUrl: `intent://pay?${baseParams}#Intent;scheme=phonepe;package=com.phonepe.app;end`,
        webUrl: `https://www.phonepe.com`,
        fallbackIntent: `upi://pay?${baseParams}`,
        icon: 'PhonePe',
        color: 'from-purple-700 to-indigo-800'
      };
    } else {
      return {
        name: 'UPI App',
        scheme: `upi://pay?${baseParams}`,
        intentUrl: `upi://pay?${baseParams}`,
        webUrl: `https://upi.org`,
        fallbackIntent: `upi://pay?${baseParams}`,
        icon: 'UPI',
        color: 'from-indigo-600 to-blue-700'
      };
    }
  };

  // Trigger App Detection & Redirection to Sentry Pay / UPI App
  const handleUpiRedirection = (appKey) => {
    const vpa = appKey === 'custom' ? customUpiId : 'flipcart.merchant@upi';
    const appInfo = getUpiDeepLink(appKey, vpa);

    setRedirectingApp(appInfo);
    setAppDetectedState('checking');

    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    try {
      if (isAndroid && appInfo.intentUrl) {
        window.location.href = appInfo.intentUrl;
      } else {
        window.location.href = appInfo.scheme;
      }
    } catch (err) {
      console.log('Deep link trigger:', err);
    }

    let hasBlurred = false;
    const handleBlur = () => {
      hasBlurred = true;
    };
    window.addEventListener('blur', handleBlur);
    window.addEventListener('pagehide', handleBlur);

    setTimeout(() => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('pagehide', handleBlur);
      if (hasBlurred) {
        setAppDetectedState('redirected');
      } else {
        setAppDetectedState('not_found');
      }
    }, 2000);
  };

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
          particleCount: 100,
          spread: 70,
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
        items: items
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
      setProcessingMsg(`Verifying authorization with ${methodName}...`);
    }, 1200);

    setTimeout(() => {
      setProcessingMsg(`Confirming payment of ₹${totalAmount.toLocaleString('en-IN')}...`);
    }, 2400);

    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
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
        items: items
      });
    }, 3600);
  };

  return (
    <div className="fk-modal-overlay" onClick={onClose}>
      <div className="fk-modal-container max-w-3xl p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* App Redirection Overlay */}
        {redirectingApp && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100">
              <div className={`bg-gradient-to-r ${redirectingApp.color} text-white p-6 text-center`}>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-2 text-xl shadow-inner font-extrabold">
                  {redirectingApp.icon === 'GPay' && 'GPay'}
                  {redirectingApp.icon === 'PhonePe' && 'पे'}
                  {(redirectingApp.icon === 'SentryPay' || redirectingApp.icon === 'Sentry Pay') && '🛡️'}
                  {redirectingApp.icon === 'UPI' && 'UPI'}
                </div>
                <h3 className="text-lg font-extrabold">{redirectingApp.name}</h3>
                <p className="text-xs text-blue-100 mt-0.5">UPI App Launcher</p>
              </div>

              <div className="p-5 text-center">
                {appDetectedState === 'checking' && (
                  <div className="space-y-3 py-2">
                    <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <SmartphoneCharging size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900">
                        Checking if {redirectingApp.name} is installed...
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Attempting redirection to native app scheme...
                      </p>
                    </div>
                  </div>
                )}

                {appDetectedState === 'redirected' && (
                  <div className="space-y-3 py-2">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={28} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900">
                        Redirected to {redirectingApp.name}!
                      </h4>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        Complete authorization inside the {redirectingApp.name} app.
                      </p>
                    </div>

                    <button
                      onClick={() => handleCompletePaymentFromApp(redirectingApp.name, 'Authorized via Native App')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase rounded shadow transition"
                    >
                      CONFIRM PAYMENT COMPLETED IN APP
                    </button>
                  </div>
                )}

                {appDetectedState === 'not_found' && (
                  <div className="space-y-3 py-1">
                    <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900">
                        {redirectingApp.name} Not Automatically Launched
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        On desktop or unsupported devices, you can trigger deep link manually or simulate payment completion.
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => {
                          window.location.href = redirectingApp.fallbackIntent;
                        }}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded flex items-center justify-center gap-1"
                      >
                        <ExternalLink size={13} /> Open App (Deep Link)
                      </button>

                      <button
                        onClick={() => handleCompletePaymentFromApp(redirectingApp.name, 'Simulated App Authorization')}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded flex items-center justify-center gap-1"
                      >
                        <Sparkles size={13} /> SIMULATE SUCCESSFUL PAYMENT
                      </button>

                      <button
                        onClick={() => setRedirectingApp(null)}
                        className="w-full py-1.5 text-gray-500 hover:text-gray-800 text-[11px] font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} className="text-yellow-300" />
            <div>
              <h3 className="font-bold text-lg leading-tight">Flipcart Secure Checkout</h3>
              <p className="text-[11px] text-blue-100 flex items-center gap-1">
                <Lock size={10} /> 100% Encrypted & Safe Payments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] text-blue-100 uppercase font-semibold">Total Payable</span>
              <p className="text-lg font-black text-yellow-300">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <button onClick={onClose} className="text-white hover:opacity-80 p-1">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Processing State View */}
        {isProcessing ? (
          <div className="p-12 text-center bg-white flex flex-col items-center justify-center min-h-[350px]">
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <ShieldCheck size={32} className="text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">Processing Payment...</h4>
            <p className="text-sm font-semibold text-blue-600 mt-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
              {processingMsg}
            </p>
            <p className="text-xs text-gray-400 mt-4">Please do not refresh or close this window.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 min-h-[420px]">
            {/* Left Payment Option Tabs */}
            <div className="bg-gray-50 border-r border-gray-200 p-2 space-y-1">
              <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-3 py-2">
                PAYMENT OPTIONS
              </p>

              {/* UPI Tab */}
              <button
                onClick={() => setSelectedMethod('upi')}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition ${
                  selectedMethod === 'upi'
                    ? 'bg-white text-blue-700 font-bold shadow border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    UPI
                  </div>
                  <div>
                    <span className="text-xs block">Pay by UPI</span>
                    <span className="text-[10px] text-gray-400 block font-normal">GPay, PhonePe, Sentry Pay</span>
                  </div>
                </div>
                <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded">FAST</span>
              </button>

              {/* QR Code Tab */}
              <button
                onClick={() => setSelectedMethod('qr')}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition ${
                  selectedMethod === 'qr'
                    ? 'bg-white text-blue-700 font-bold shadow border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-blue-100 text-blue-700 flex items-center justify-center">
                    <QrCode size={16} />
                  </div>
                  <div>
                    <span className="text-xs block">Pay by QR Code</span>
                    <span className="text-[10px] text-gray-400 block font-normal">Scan & Pay via any app</span>
                  </div>
                </div>
              </button>

              {/* Cash on Delivery Tab */}
              <button
                onClick={() => setSelectedMethod('cod')}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition ${
                  selectedMethod === 'cod'
                    ? 'bg-white text-blue-700 font-bold shadow border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Banknote size={16} />
                  </div>
                  <div>
                    <span className="text-xs block">Cash on Delivery</span>
                    <span className="text-[10px] text-gray-400 block font-normal">Pay cash upon arrival</span>
                  </div>
                </div>
              </button>

              {/* Credit / Debit Card Tab */}
              <button
                onClick={() => setSelectedMethod('card')}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition ${
                  selectedMethod === 'card'
                    ? 'bg-white text-blue-700 font-bold shadow border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-purple-100 text-purple-700 flex items-center justify-center">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <span className="text-xs block">Credit / Debit Card</span>
                    <span className="text-[10px] text-gray-400 block font-normal">Visa, Mastercard, RuPay</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Right Panel Content */}
            <div className="md:col-span-2 p-5 bg-white flex flex-col justify-between">
              {/* TAB 1: PAY BY UPI */}
              {selectedMethod === 'upi' && (
                <div>
                  <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Smartphone size={16} className="text-blue-600" /> Select UPI App for Redirection
                    </h4>
                    <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                      <ShieldCheck size={14} /> Zero Fee
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Sentry Pay (Highlighted!) */}
                    <label 
                      onClick={() => handleUpiRedirection('sentrypay')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        selectedUpiOption === 'sentrypay'
                          ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="upiOption"
                          checked={selectedUpiOption === 'sentrypay'}
                          onChange={() => handleUpiRedirection('sentrypay')}
                          className="accent-emerald-600"
                        />
                        <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                          🛡️
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900 block flex items-center gap-1.5">
                            SentryPay
                            <span className="bg-emerald-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                              RECOMMENDED
                            </span>
                          </span>
                          <span className="text-[11px] text-gray-500 block">Auto-detects SentryPay mobile app & opens payment page (same as GPay) • Extra ₹50 OFF</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700">₹50 OFF</span>
                    </label>

                    {/* Google Pay (GPay) */}
                    <label 
                      onClick={() => setSelectedUpiOption('gpay')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
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
                        <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-blue-600 font-black text-sm flex items-center justify-center shadow-sm">
                          <span className="text-blue-500 font-extrabold">G</span><span className="text-red-500 font-extrabold">P</span><span className="text-yellow-500 font-extrabold">a</span><span className="text-green-500 font-extrabold">y</span>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900 block">Google Pay (GPay)</span>
                          <span className="text-[11px] text-gray-500 block">Checks GPay app availability & launches GPay</span>
                        </div>
                      </div>
                    </label>

                    {/* PhonePe */}
                    <label 
                      onClick={() => setSelectedUpiOption('phonepe')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
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
                        <div className="w-9 h-9 rounded-lg bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                          पे
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900 block">PhonePe</span>
                          <span className="text-[11px] text-gray-500 block">Checks PhonePe app availability & launches PhonePe</span>
                        </div>
                      </div>
                    </label>

                    {/* Custom UPI ID */}
                    <label 
                      onClick={() => setSelectedUpiOption('custom')}
                      className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition ${
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
                          <span className="text-sm font-bold text-gray-900 block">Enter UPI ID / VPA</span>
                          <span className="text-[11px] text-gray-500 block">e.g. mobile@upi or username@okaxis</span>

                          {selectedUpiOption === 'custom' && (
                            <div className="mt-2 flex gap-2">
                              <input
                                type="text"
                                placeholder="name@upi"
                                value={customUpiId}
                                onChange={(e) => setCustomUpiId(e.target.value)}
                                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={() => handleUpiRedirection(selectedUpiOption)}
                    className="w-full mt-6 py-3 bg-blue-600 text-white font-extrabold text-sm rounded-lg shadow-md hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} /> PAY ₹{totalAmount.toLocaleString('en-IN')} VIA {selectedUpiOption.toUpperCase()}
                  </button>
                </div>
              )}

              {/* TAB 2: PAY BY QR CODE */}
              {selectedMethod === 'qr' && (
                <div className="text-center py-2">
                  <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <QrCode size={16} className="text-blue-600" /> Pay by QR Code
                    </h4>
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Expires in: {formatTimer(timerSeconds)}
                    </span>
                  </div>

                  {/* QR Box */}
                  <div className="relative inline-block bg-white p-4 rounded-xl border-2 border-dashed border-blue-400 shadow-md">
                    <div className="absolute left-2 right-2 h-0.5 bg-blue-500 animate-pulse top-1/2"></div>
                    
                    <div className="w-44 h-44 bg-gray-900 p-2 rounded-lg flex items-center justify-center mx-auto relative overflow-hidden">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                        <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 10h10v10H40zM50 40h20v10H50zM10 40h20v20H10zM40 70h20v20H40zM70 70h30v10H70zM80 90h20v10H80z" />
                        <rect x="42" y="42" width="16" height="16" fill="#2874f0" rx="3" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white p-1 rounded shadow">
                          <span className="text-[10px] font-black text-blue-600 tracking-tighter">FK PAY</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-800 mt-2">Scan with GPay, PhonePe, Paytm, or Sentry Pay</p>
                    <p className="text-[11px] text-gray-500">Amount: ₹{totalAmount.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handlePayNow('QR Code Scan', 'Scanned via UPI App')}
                      className="w-full py-3 bg-emerald-600 text-white font-extrabold text-sm rounded-lg shadow-md hover:bg-emerald-700 flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} /> SIMULATE QR SCAN & PAY ₹{totalAmount.toLocaleString('en-IN')}
                    </button>
                    <p className="text-[11px] text-gray-400">Click the button above to simulate scanning the QR code on mobile.</p>
                  </div>
                </div>
              )}

              {/* TAB 3: CASH ON DELIVERY */}
              {selectedMethod === 'cod' && (
                <div>
                  <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Banknote size={16} className="text-amber-600" /> Cash on Delivery (COD)
                    </h4>
                    <span className="text-xs text-gray-500 font-semibold">Pay at your doorstep</span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <AlertCircle size={14} className="text-amber-600" /> Important COD Instructions:
                    </p>
                    <p>• Please keep exact cash change of ₹{totalAmount.toLocaleString('en-IN')} ready for the courier agent.</p>
                    <p>• ₹10 handling fee is waived for Flipcart Assured customers.</p>
                  </div>

                  <div className="mt-5 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Enter the 3-digit security code to prevent automated spam:
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-800 text-yellow-400 font-mono text-xl font-bold tracking-widest px-4 py-1.5 rounded shadow select-none flex items-center gap-2">
                        <span>{captchaCode}</span>
                        <button 
                          onClick={() => setCaptchaCode(Math.floor(100 + Math.random() * 900).toString())}
                          className="text-gray-400 hover:text-white"
                          title="Refresh Captcha"
                        >
                          <RefreshCw size={14} />
                        </button>
                      </div>

                      <input
                        type="text"
                        maxLength="3"
                        placeholder="Code"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        className={`w-24 px-3 py-2 text-center text-lg font-bold border rounded focus:outline-none ${
                          captchaError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {captchaError && (
                      <p className="text-xs text-red-600 font-bold mt-2">❌ Incorrect code entered. Please try again.</p>
                    )}
                  </div>

                  <button
                    onClick={() => handlePayNow('Cash on Delivery', 'Pay cash on arrival')}
                    className="w-full mt-6 py-3 bg-amber-600 text-white font-extrabold text-sm rounded-lg shadow-md hover:bg-amber-700 flex items-center justify-center gap-2"
                  >
                    CONFIRM COD ORDER (₹{totalAmount.toLocaleString('en-IN')}) <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* TAB 4: CREDIT / DEBIT CARD */}
              {selectedMethod === 'card' && (
                <div>
                  <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <CreditCard size={16} className="text-purple-600" /> Credit / Debit Card
                    </h4>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8912"
                        className="w-full p-2.5 border rounded focus:outline-none focus:border-blue-600"
                        defaultValue="4532 9812 3456 8912"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">Valid Thru (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="08/28"
                          className="w-full p-2.5 border rounded focus:outline-none focus:border-blue-600"
                          defaultValue="12/28"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength="3"
                          placeholder="•••"
                          className="w-full p-2.5 border rounded focus:outline-none focus:border-blue-600"
                          defaultValue="381"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePayNow('Credit/Debit Card', 'Visa Ending in 8912')}
                    className="w-full mt-6 py-3 bg-purple-600 text-white font-extrabold text-sm rounded-lg shadow-md hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    PAY ₹{totalAmount.toLocaleString('en-IN')} NOW <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
