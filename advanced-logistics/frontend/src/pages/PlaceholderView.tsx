import React from 'react';
import { Layers, ArrowLeft, Clock } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  onBackToDashboard: () => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  title,
  onBackToDashboard,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center max-w-2xl mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-4">
        <Layers className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold mb-3">
        <Clock className="w-3.5 h-3.5" />
        Phase 2 Architecture Shell
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
        This navigation destination is registered in the enterprise shell. Its domain business logic, dedicated data pipelines, and operational workflows are scheduled for implementation in subsequent phases.
      </p>

      <button
        onClick={onBackToDashboard}
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard Overview
      </button>
    </div>
  );
};

export default PlaceholderView;

