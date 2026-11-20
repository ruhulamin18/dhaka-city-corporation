'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PaymentProviderMethod, PaymentReceipt, PaymentTransaction } from '@/types/payment';
import { PaymentGatewayService } from '@/services/payment/payment-gateway';
import { PaymentService } from '@/services/payment/payment-service';
import {
  Lock,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Printer,
  Smartphone,
  CreditCard,
  Building,
} from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
  paymentMethod: PaymentProviderMethod;
  onPaymentSuccess: (receipt: PaymentReceipt) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = (props) => {
  if (!props.isOpen || !props.transaction) return null;
  return <PaymentGatewayModalInner key={props.transaction.id} {...props} transaction={props.transaction} />;
};

const PaymentGatewayModalInner: React.FC<PaymentGatewayModalProps & { transaction: PaymentTransaction }> = ({
  onClose,
  transaction,
  paymentMethod,
  onPaymentSuccess,
}) => {
  const { language } = useApp();

  const [step, setStep] = useState<'DETAILS' | 'OTP' | 'VERIFYING' | 'SUCCESS' | 'ERROR'>('DETAILS');
  const [walletOrCardNumber, setWalletOrCardNumber] = useState(transaction.payerPhone || '01700000000');
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [completedReceipt, setCompletedReceipt] = useState<PaymentReceipt | null>(null);
  const [gatewayTxId, setGatewayTxId] = useState('');

  const handleInitiateOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletOrCardNumber.trim()) {
      setErrorMessage(language === 'bn' ? 'সঠিক নম্বর প্রদান করুন' : 'Please provide a valid account/phone number');
      return;
    }
    setErrorMessage('');
    try {
      const initRes = await PaymentGatewayService.initiateSession(
        transaction.transactionReference,
        transaction.amount,
        paymentMethod
      );
      setGatewayTxId(initRes.gatewayTransactionId);
      setStep('OTP');
    } catch {
      setErrorMessage(language === 'bn' ? 'গেটওয়ে সেশন শুরু করা সম্ভব হয়নি।' : 'Failed to initialize gateway session.');
    }
  };

  const handleVerifyOtpAndCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setErrorMessage(language === 'bn' ? 'সঠিক ৪-৬ অঙ্কের ওটিপি কোড লিখুন' : 'Enter a valid 4-6 digit OTP code');
      return;
    }

    setStep('VERIFYING');
    setErrorMessage('');

    try {
      // 1. Verify with Gateway
      const verification = await PaymentGatewayService.verifyGatewayCallback(
        gatewayTxId,
        transaction.amount,
        paymentMethod
      );

      // 2. Finalize Transaction & Issue Official DSCC Receipt
      const result = await PaymentService.completePayment(transaction.id, {
        gatewayTransactionId: verification.gatewayTransactionId,
        bankOrWalletRef: verification.bankOrWalletRef,
        authorizationCode: verification.authorizationCode,
      });

      setCompletedReceipt(result.receipt);
      setStep('SUCCESS');
      onPaymentSuccess(result.receipt);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'Payment verification failed');
      setStep('ERROR');
    }
  };

  const getMethodTheme = () => {
    switch (paymentMethod) {
      case 'bkash':
        return {
          name: 'bKash Payment Gateway',
          color: 'bg-[#D12053]',
          textColor: 'text-[#D12053]',
          borderColor: 'border-[#D12053]',
        };
      case 'nagad':
        return {
          name: 'Nagad Secure Payment',
          color: 'bg-[#F26522]',
          textColor: 'text-[#F26522]',
          borderColor: 'border-[#F26522]',
        };
      case 'rocket':
        return {
          name: 'DBBL Rocket Gateway',
          color: 'bg-[#8B237F]',
          textColor: 'text-[#8B237F]',
          borderColor: 'border-[#8B237F]',
        };
      case 'card':
        return {
          name: 'SSLCOMMERZ Secure Card Gateway',
          color: 'bg-[#0F4C81]',
          textColor: 'text-[#0F4C81]',
          borderColor: 'border-[#0F4C81]',
        };
      default:
        return {
          name: 'Ekpay Central Bank Gateway',
          color: 'bg-emerald-800',
          textColor: 'text-emerald-800',
          borderColor: 'border-emerald-800',
        };
    }
  };

  const theme = getMethodTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Gateway Header */}
        <div className={`${theme.color} text-white px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80 font-semibold">
                {theme.name}
              </p>
              <h3 className="text-sm font-bold text-white leading-tight">
                Dhaka City Corporation Revenue Portal
              </h3>
            </div>
          </div>
          {step !== 'VERIFYING' && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Order Summary Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 font-medium">
              {language === 'bn' ? 'লেনদেন রেফারেন্স: ' : 'Transaction Ref: '}
            </span>
            <span className="font-mono font-bold text-slate-800">
              {transaction.transactionReference}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 font-medium">{language === 'bn' ? 'মোট বিল: ' : 'Amount: '}</span>
            <span className="text-base font-extrabold text-emerald-800 font-mono">
              ৳{transaction.amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {/* STEP 1: Account / Wallet Info */}
          {step === 'DETAILS' && (
            <form onSubmit={handleInitiateOtp} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <p>
                  {language === 'bn'
                    ? 'সরকারি পেমেন্ট গেটওয়েতে আপনার তথ্য সুরক্ষিত থাকে। সিটি কর্পোরেশন কখনই আপনার পিন বা গোপন পাসওয়ার্ড সংরক্ষণ করে না।'
                    : 'Your information is secured via Government Payment Gateway. The City Corporation never stores your PIN or secret password.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {paymentMethod === 'card'
                    ? language === 'bn' ? '১৬-সংখ্যার কার্ড নম্বর বা মোবাইল *' : '16-Digit Card Number or Mobile *'
                    : language === 'bn' ? `${theme.name} ওয়ালেট নম্বর *` : `${theme.name} Wallet Account *`}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    {paymentMethod === 'card' ? (
                      <CreditCard className="w-4 h-4" />
                    ) : paymentMethod === 'internet_banking' ? (
                      <Building className="w-4 h-4" />
                    ) : (
                      <Smartphone className="w-4 h-4" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={walletOrCardNumber}
                    onChange={(e) => setWalletOrCardNumber(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                  />
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {errorMessage}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm ${theme.color} hover:opacity-95 transition-opacity flex items-center justify-center space-x-2 cursor-pointer shadow-md`}
                >
                  <span>{language === 'bn' ? 'ওটিপি পাঠান ও অগ্রসর হন' : 'Send OTP & Proceed'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: One-Time Password Verification */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtpAndCapture} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 items-center justify-center mb-1">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? 'নিরাপত্তা ওটিপি যাচাই' : 'Enter Security OTP'}
                </h4>
                <p className="text-xs text-slate-600">
                  {language === 'bn'
                    ? `আপনার নিবন্ধিত নম্বরে (${walletOrCardNumber.slice(0, 4)}***${walletOrCardNumber.slice(-3)}) একটি ৬-সংখ্যার যাচাইকরণ কোড পাঠানো হয়েছে`
                    : `A 6-digit verification code has been dispatched to ${walletOrCardNumber.slice(0, 4)}***${walletOrCardNumber.slice(-3)}`}
                </p>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 text-center mb-2">
                  {language === 'bn' ? 'ওটিপি কোড লিখুন (পরীক্ষার জন্য: 123456)' : 'Enter OTP Code (Test Code: 123456)'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-xl font-bold font-mono py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  autoFocus
                  required
                />
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-center">
                  {errorMessage}
                </p>
              )}

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('DETAILS')}
                  className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  {language === 'bn' ? 'ফিরে যান' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={otpCode.length < 4}
                  className={`w-2/3 py-2.5 px-4 rounded-xl text-white font-bold text-sm ${
                    otpCode.length >= 4 ? `${theme.color} cursor-pointer shadow-md` : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  {language === 'bn' ? 'পরিশোধ নিশ্চিত করুন' : 'Confirm & Authorize'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Cryptographic Verification in progress */}
          {step === 'VERIFYING' && (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'লেনদেন যাচাই ও নিষ্পত্তি হচ্ছে...' : 'Verifying Transaction Settlement...'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'অনুগ্রহ করে ব্রাউজার বন্ধ করবেন না বা রিলোড করবেন না। বাংলাদেশ ব্যাংক পেমেন্ট নেটওয়ার্কের সাথে সংযোগ স্থাপিত হচ্ছে।'
                  : 'Please do not refresh or close the browser window. Securing settlement with central treasury network.'}
              </p>
            </div>
          )}

          {/* STEP 4: Success Receipt */}
          {step === 'SUCCESS' && completedReceipt && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-950">
                  {language === 'bn' ? 'পরিশোধ সফলভাবে সম্পন্ন হয়েছে!' : 'Payment Completed Successfully!'}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {language === 'bn'
                    ? 'সরকারি ট্রেজারিতে আপনার অর্থ নিরাপদে জমা হয়েছে এবং ডিজিটাল রসিদ ইস্যু করা হয়েছে।'
                    : 'Funds credited to city treasury & official government receipt issued.'}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'bn' ? 'রশিদ নম্বর:' : 'Receipt No:'}</span>
                  <span className="font-mono font-bold text-emerald-800">{completedReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'bn' ? 'গেটাওয়ে ট্রানজেকশন:' : 'Gateway Trx ID:'}</span>
                  <span className="font-mono text-slate-700">{completedReceipt.gatewayTransactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'bn' ? 'পরিশোধিত অর্থ:' : 'Amount Paid:'}</span>
                  <span className="font-bold text-slate-900">৳{completedReceipt.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.href = `/online-payment/receipt?no=${completedReceipt.receiptNumber}`;
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'bn' ? 'রশিদ দেখুন ও প্রিন্ট করুন' : 'View & Print Receipt'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Screen */}
          {step === 'ERROR' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'লেনদেন ব্যর্থ হয়েছে' : 'Payment Failed'}
              </h4>
              <p className="text-xs text-rose-600">{errorMessage}</p>
              <button
                type="button"
                onClick={() => setStep('DETAILS')}
                className="py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                {language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
