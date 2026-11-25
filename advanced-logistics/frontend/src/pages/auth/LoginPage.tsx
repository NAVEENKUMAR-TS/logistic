import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { AuthView } from '../../types/auth';

interface LoginPageProps {
  onNavigate: (view: AuthView | 'dashboard') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Please enter a valid email address.';
      }
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, session, code } = await signIn(email, password);

      if (error || !session) {
        let displayMessage = error?.message || 'Authentication failed. Please try again.';

        if (error?.message === 'Invalid login credentials' || code === 'invalid_credentials') {
          displayMessage = `Invalid credentials: Account not found or password incorrect for "${email}". Ensure the user has been created in your Supabase project.`;
        } else if (error?.message === 'Email not confirmed' || code === 'email_not_confirmed') {
          displayMessage = `Email unconfirmed: Supabase requires email verification for "${email}". Please confirm the user in your Supabase console under Authentication → Users.`;
        } else if (error?.message?.toLowerCase().includes('rate limit')) {
          displayMessage = 'Too many requests: Supabase email rate limit exceeded. Please wait a few minutes.';
        } else if (error?.message?.toLowerCase().includes('failed to fetch')) {
          displayMessage = 'Network error: Unable to connect to Supabase Auth servers. Please check your internet connection.';
        }

        setGeneralError(displayMessage);
        setIsLoading(false);
        return;
      }

      // Successful authentication with a real Supabase session
      setIsLoading(false);
      onNavigate('dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during login.';
      setGeneralError(message);
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setGeneralError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        setGeneralError(`${provider.toUpperCase()} sign-in failed: ${error.message}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'OAuth sign in failed';
      setGeneralError(message);
    }
  };

  return (
    <AuthLayout
      imageUrl="/assets/cargo-ship.jpg"
      imageAlt="Large container freight ship navigating ocean shipping lane"
      imageCaption="Global Maritime Operations • Automated Fleet Routing & Port Synchronization"
      badgeText="4,820 Active Vessels"
    >
      <div className="flex flex-col h-full justify-between">
        {/* Welcome Headings */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] dark:text-white tracking-tight">
            Hello, Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Sign in to access your logistics management platform.
          </p>
        </div>

        {/* Global Error Banner */}
        {generalError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{generalError}</span>
          </div>
        )}

        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="your.email@company.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/70 dark:bg-slate-800/60 border ${
                  fieldErrors.email
                    ? 'border-rose-500 dark:border-rose-500 focus:ring-rose-500/25'
                    : 'border-slate-200 dark:border-slate-700/80 focus:ring-[#075D66]/25 focus:border-[#075D66]'
                } rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-50/70 dark:bg-slate-800/60 border ${
                  fieldErrors.password
                    ? 'border-rose-500 dark:border-rose-500 focus:ring-rose-500/25'
                    : 'border-slate-200 dark:border-slate-700/80 focus:ring-[#075D66]/25 focus:border-[#075D66]'
                } rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Primary Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#075D66] hover:bg-[#054950] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#075D66]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#075D66] focus:ring-[#075D66]/30 cursor-pointer accent-[#075D66]"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-[#075D66] dark:text-teal-400 hover:underline font-semibold"
            >
              Forgot Password ?
            </button>
          </div>

          {/* Social Auth Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700/80" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
                Or sign in with
              </span>
            </div>
          </div>

          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-xs font-semibold shadow-2xs cursor-pointer"
            >
              {/* Google G Logo SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn('apple')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-xs font-semibold shadow-2xs cursor-pointer"
            >
              {/* Apple Logo SVG */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-6.19-9.35-11.05-20.02-14.58-32-3.53-11.97-5.3-23.11-5.3-33.42 0-14.48 3.59-26.23 10.77-35.26 7.18-9.03 16.21-13.62 27.09-13.78 4.89 0 10.33 1.25 16.32 3.75 5.99 2.5 9.77 3.81 11.34 3.93 1.8.12 5.86-1.29 12.18-4.22 6.32-2.93 11.83-4.25 16.53-3.96 12.51.78 22.25 5.34 29.23 13.68-10.88 6.64-16.2 15.65-15.96 27.03.24 9.14 3.74 16.85 10.5 23.12 6.76 6.27 14.88 9.94 24.36 11.01-2.12 6.53-4.73 13.1-7.83 19.72zM119.22 31.84c0-7.39 2.66-14.45 7.98-21.18 5.32-6.73 11.93-10.66 19.82-11.8.12 1.03.18 1.94.18 2.74 0 7.27-2.78 14.33-8.34 21.18-5.56 6.85-12.28 10.77-20.16 11.75-.48-.91-.72-1.79-.72-2.69z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>
        </form>

        {/* Development Testing Credentials Panel (Development Only) */}
        {import.meta.env.DEV && (
          <div className="mt-5 p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#075D66] dark:text-teal-400" />
                Dev Test Account
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin.ailms@gmail.com');
                  setPassword('12345678');
                  setFieldErrors({});
                  setGeneralError(null);
                }}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#075D66] hover:bg-[#054950] text-white transition-colors cursor-pointer"
              >
                Fill Credentials
              </button>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono space-y-0.5">
              <div>
                Email: <span className="text-teal-800 dark:text-teal-300 font-bold">admin.ailms@gmail.com</span>
              </div>
              <div>
                Password: <span className="text-teal-800 dark:text-teal-300 font-bold">12345678</span> <span className="text-slate-500 font-sans">(Role: admin)</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Link */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="text-[#075D66] dark:text-teal-400 font-bold hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
