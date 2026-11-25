import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  onUnauthenticated: () => void;
  onUnauthorized?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  onUnauthenticated,
  onUnauthorized,
}) => {
  const { session, user, userRole, isLoading, isAuthenticated } = useAuth();

  // 1. Loading screen while Supabase confirms session
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#EAF2F4] dark:bg-slate-900 transition-colors">
        <div className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-[#075D66] dark:text-teal-400">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#172B3A] dark:text-white">
              Validating Credentials
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verifying cryptographic session with Supabase Auth...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated check: No valid session or user exists
  if (!isAuthenticated || !session || !user) {
    onUnauthenticated();
    return null;
  }

  // 3. Role-based check if roles are enforced
  if (requiredRole && requiredRole.length > 0) {
    const hasRole = requiredRole.includes(userRole);
    if (!hasRole) {
      if (onUnauthorized) {
        onUnauthorized();
        return null;
      }
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl p-6 border border-rose-200 dark:border-rose-900/40 shadow-lg text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Access Denied</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your role ({userRole}) does not have permission to view this partition.
            </p>
          </div>
        </div>
      );
    }
  }

  // 4. Authenticated & authorized
  return <>{children}</>;
};

export default ProtectedRoute;

