import React, { useState } from 'react';
import { Clock, Lock, ArrowRight, UserCheck } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { AuthView } from '../../types/auth';

interface SessionExpiredPageProps {
  onNavigate: (view: AuthView | 'dashboard') => void;
}

export const SessionExpiredPage: React.FC<SessionExpiredPageProps> = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReauth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('dashboard');
    }, 600);
  };

  return (
    <AuthLayout
      imageUrl="/assets/cargo-ship.jpg"
      imageAlt="Automated supply chain operations center"
      imageCaption="Automated Session Timeout • Protecting Critical Fleet Telemetry"
      badgeText="Security Inactivity Lock"
    >
      <div className="flex flex-col h-full justify-between">
        <div className="my-auto py-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] dark:text-white tracking-tight">
              Session Timed Out
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Your platform session expired due to inactivity. Enter your password to resume exactly where you left off.
            </p>
          </div>

          {/* User Profile Pill */}
          <div className="p-3 mb-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Alex Morgan"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#075D66]/20"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Alex Morgan</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">alex.morgan@logix-supply.com</p>
              </div>
            </div>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>

          {/* Quick Unlock Form */}
          <form onSubmit={handleReauth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to unlock"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075D66]/25 focus:border-[#075D66] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-2.5 px-4 rounded-xl bg-[#075D66] hover:bg-[#054950] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Unlock Session
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Not Alex Morgan?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-[#075D66] dark:text-teal-400 font-bold hover:underline"
          >
            Sign in as different user
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SessionExpiredPage;

