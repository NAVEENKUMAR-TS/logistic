import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { AuthView } from '../../types/auth';

interface SignUpPageProps {
  onNavigate: (view: AuthView | 'dashboard') => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);

    if (!agreeTerms) {
      setGeneralError('You must agree to the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    if (!name.trim()) {
      setGeneralError('Full name is required.');
      return;
    }

    if (!email.trim()) {
      setGeneralError('Work email is required.');
      return;
    }

    if (!password || password.length < 6) {
      setGeneralError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const { error, user } = await signUp(email, password, name);

      if (error) {
        setGeneralError(error.message);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      if (user) {
        setSuccessMessage('Registration successful! Please check your email inbox to verify your account.');
        setTimeout(() => {
          onNavigate('verify-email');
        }, 1500);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setGeneralError(message);
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      imageUrl="/assets/cargo-ship.jpg"
      imageAlt="Commercial container cargo vessel navigating ocean shipping route"
      imageCaption="Global Maritime Freight Operations • Multi-modal Supply Chain Coordination"
      badgeText="4,820 Active Vessels"
    >
      <div className="flex flex-col h-full justify-between">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] dark:text-white tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sign up to access your logistics management platform.
          </p>
        </div>

        {/* Global Error Banner */}
        {generalError && (
          <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{generalError}</span>
          </div>
        )}

        {/* Success Banner */}
        {successMessage && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full pl-10 pr-4 py-2 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075D66]/25 focus:border-[#075D66] transition-all"
              />
            </div>
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Work Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena.rostova@company.com"
                className="w-full pl-10 pr-4 py-2 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075D66]/25 focus:border-[#075D66] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Create Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-10 py-2 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075D66]/25 focus:border-[#075D66] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms & Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400 leading-relaxed select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#075D66] focus:ring-[#075D66]/30 cursor-pointer accent-[#075D66]"
              />
              <span>
                I agree to the{' '}
                <a href="#terms" className="text-[#075D66] dark:text-teal-400 font-semibold hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-[#075D66] dark:text-teal-400 font-semibold hover:underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !agreeTerms}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#075D66] hover:bg-[#054950] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#075D66]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-[#075D66] dark:text-teal-400 font-bold hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;
