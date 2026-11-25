import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { AuthView } from '../../types/auth';

interface ForgotPasswordPageProps {
  onNavigate: (view: AuthView | 'dashboard') => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetErr } = await resetPasswordForEmail(email);
      if (resetErr) {
        setError(resetErr.message);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset instructions.';
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      imageUrl="/assets/cargo-ship.jpg"
      imageAlt="Commercial container cargo vessel navigating ocean shipping route"
      imageCaption="Global Maritime Freight Operations • Secure Account Recovery"
      badgeText="4,820 Active Vessels"
    >
      <div className="flex flex-col h-full justify-between">
        <div className="my-auto">
          {!isSubmitted ? (
            <>
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] dark:text-white tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Enter your registered work email and we'll send you an encrypted verification link to reset your account password.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Registered Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.morgan@logix-supply.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075D66]/25 focus:border-[#075D66] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#075D66] hover:bg-[#054950] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#075D66]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Instructions
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Reset Link Dispatched
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  We've sent a password reset token to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>. Please check your inbox and spam folder.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('reset-password')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#075D66] hover:bg-[#054950] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  Proceed to Reset Password
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
