import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { AuthView } from '../../types/auth';

interface UnauthorizedPageProps {
  onNavigate: (view: AuthView | 'dashboard') => void;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({ onNavigate }) => {
  const [requested, setRequested] = useState(false);

  return (
    <AuthLayout
      imageUrl="/assets/cargo-ship.jpg"
      imageAlt="High security intermodal freight logistics terminal"
      imageCaption="Role-Based Access Control (RBAC) • Enterprise Security Perimeter"
      badgeText="Access Restricted"
    >
      <div className="flex flex-col h-full justify-between">
        <div className="my-auto py-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[11px] font-bold tracking-wider uppercase mb-2">
              403 Forbidden
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] dark:text-white tracking-tight">
              Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Your account lacks the clearance privileges required to enter this logistics partition. All access attempts are logged for compliance.
            </p>
          </div>

          {/* Security metadata box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-2 mb-6">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Required Role:</span>
              <strong className="text-slate-800 dark:text-slate-200">Global Fleet Administrator</strong>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Your Assigned Role:</span>
              <strong className="text-slate-800 dark:text-slate-200">Regional Logistics Viewer</strong>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Security Policy:</span>
              <span className="font-mono text-[11px]">RBAC-RULE-SEC-984</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {!requested ? (
              <button
                type="button"
                onClick={() => setRequested(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#075D66] hover:bg-[#054950] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Request Role Elevation
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                Access Elevation Request Submitted to Security Admin
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Return to Safe Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Need to switch profile?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-[#075D66] dark:text-teal-400 font-bold hover:underline"
          >
            Sign in with another account
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default UnauthorizedPage;
