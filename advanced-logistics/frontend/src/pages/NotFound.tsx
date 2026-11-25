import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onBackToDashboard: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onBackToDashboard }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 border border-slate-200/80 dark:border-slate-800 text-center max-w-md mx-auto my-12">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
        Page Not Found
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        The requested logistics view does not exist or has been relocated.
      </p>
      <button
        onClick={onBackToDashboard}
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;

