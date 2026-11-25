export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
};

export const getStatusBadgeColor = (status: string): { bg: string; text: string; dot: string } => {
  switch (status.toLowerCase()) {
    case 'delivered':
    case 'completed':
    case 'success':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        text: 'text-emerald-700 dark:text-emerald-400',
        dot: 'bg-emerald-500',
      };
    case 'in transit':
    case 'out for delivery':
    case 'dispatched':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-400',
        dot: 'bg-blue-500',
      };
    case 'pending':
    case 'warning':
    case 'picked up':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        text: 'text-amber-700 dark:text-amber-400',
        dot: 'bg-amber-500',
      };
    case 'delayed':
    case 'danger':
    case 'failed':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
        text: 'text-rose-700 dark:text-rose-400',
        dot: 'bg-rose-500',
      };
    default:
      return {
        bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        text: 'text-slate-700 dark:text-slate-300',
        dot: 'bg-slate-400',
      };
  }
};

