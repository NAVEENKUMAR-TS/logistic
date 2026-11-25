import React, { useState, useRef } from 'react';
import { MailCheck, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { AuthView } from '../../types/auth';

interface EmailVerificationPageProps {
  onNavigate: (view: AuthView | 'dashboard') => void;
}

export const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ onNavigate }) => {
  const [digits, setDigits] = useState(['5', '8', '2', '9', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('dashboard');
    }, 600);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <AuthLayout
      imageUrl="/assets/cargo-ship.jpg"
      imageAlt="High-seas container shipping and transport fleet"
      imageCaption="Two-Factor Security Verification • Authorized Dispatch Terminal"
      badgeText="Identity Verification"
    >
      <div className="flex flex-col h-full justify-between">
        <div className="my-auto py-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#075D66] dark:text-teal-400 flex items-center justify-center mb-4">
            <MailCheck className="w-6 h-6" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] dark:text-white tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              We've dispatched a 6-digit confirmation security code to your work email. Enter it below to activate your session.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            {/* 6 Digit Input Boxes */}
            <div className="flex justify-between gap-2 max-w-sm mx-auto">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-12 sm:w-13 sm:h-13 text-center text-lg sm:text-xl font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#075D66]/25 focus:border-[#075D66] transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || digits.some((d) => !d)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#075D66] hover:bg-[#054950] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Verify & Enter Platform
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
            Didn't receive the verification email?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-[#075D66] dark:text-teal-400 font-semibold hover:underline inline-flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerificationPage;

