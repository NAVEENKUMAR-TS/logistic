import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Check, CheckCircle2, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { supabase } from '../../lib/supabase';
import { AuthView } from '../../types/auth';

interface ResetPasswordPageProps {
  onNavigate: (view: AuthView | 'dashboard') => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meetsMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);
  const passwordsMatch = password && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetsMinLength || !passwordsMatch) return;
    setIsLoading(true);
    setError(null);

    try {
      const { error: updateErr } = await supabase.auth.updateUser({
        password,
      });

      if (updateErr) {
        setError(updateErr.message);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setIsSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password update failed.';
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      imageUrl="/assets/cargo-ship.jpg"
      imageAlt="Commercial container cargo vessel navigating ocean shipping route"
      imageCaption="Global Maritime Freight Operations • Encrypted Access Protocols"
      badgeText="4,820 Active Vessels"
    >
      <div className="flex flex-col h-full justify-between">
        <div className="my-auto">
          {!isSuccess ? (
            <>
              <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] dark:text-white tracking-tight">
                  Set New Password
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Ensure your new password meets enterprise supply chain security requirements.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075D66]/25 focus:border-[#075D66] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075D66]/25 focus:border-[#075D66] transition-all"
                    />
                  </div>
                </div>

                {/* Password Criteria Badges */}
                <div className="space-y-1.5 py-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                        meetsMinLength
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span className={meetsMinLength ? 'text-slate-800 dark:text-slate-200 font-medium' : ''}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                        hasNumberOrSymbol
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span className={hasNumberOrSymbol ? 'text-slate-800 dark:text-slate-200 font-medium' : ''}>
                      Includes a number or special character
                    </span>
                  </div>
                  {confirmPassword && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                          passwordsMatch
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span className={passwordsMatch ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-rose-600'}>
                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !meetsMinLength || !passwordsMatch}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#075D66] hover:bg-[#054950] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Update Password
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
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Password Successfully Reset
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Your credentials have been securely updated. You can now log into your logistics workspace.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#075D66] hover:bg-[#054950] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                Sign In With New Password
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cancel and Return to Sign In
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;

