import React from 'react';
import { Package, Truck, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';
import { KPICardData } from '../../types/logistics';

interface StatCardProps {
  data: KPICardData;
}

export const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Package':
        return <Package className="w-6 h-6 text-brand-600 dark:text-brand-400" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'CheckCircle':
        return <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Package className="w-6 h-6 text-brand-600 dark:text-brand-400" />;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case 'Package':
        return 'bg-brand-50 dark:bg-brand-950/60 ring-1 ring-brand-100 dark:ring-brand-900/50';
      case 'Truck':
        return 'bg-indigo-50 dark:bg-indigo-950/60 ring-1 ring-indigo-100 dark:ring-indigo-900/50';
      case 'CheckCircle':
        return 'bg-emerald-50 dark:bg-emerald-950/60 ring-1 ring-emerald-100 dark:ring-emerald-900/50';
      default:
        return 'bg-brand-50 dark:bg-brand-950/60 ring-1 ring-brand-100 dark:ring-brand-900/50';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {data.title}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {data.value}
          </h3>
        </div>

        <div className={`p-3 rounded-xl ${getIconBg(data.icon)}`}>
          {getIcon(data.icon)}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md ${
              data.isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
            }`}
          >
            {data.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {data.change}
          </span>
          <span className="text-slate-500 dark:text-slate-400 truncate">{data.subtext}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

