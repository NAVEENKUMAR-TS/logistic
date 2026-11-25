import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { mockActivities } from '../../data/mockLogisticsData';
import { ActivityType } from '../../types/logistics';
import StatusBadge from '../common/StatusBadge';

export const RecentActivities: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  const filtered = mockActivities.filter((act) => {
    if (filter === 'all') return true;
    return act.status.toLowerCase() === filter.toLowerCase();
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'order_created':
        return <Package className="w-4 h-4 text-brand-600 dark:text-brand-400" />;
      case 'dispatched':
        return <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'status_change':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'driver_assigned':
        return <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'delayed':
        return <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Package className="w-4 h-4 text-slate-500" />;
    }
  };

  const getActivityIconBg = (type: ActivityType) => {
    switch (type) {
      case 'order_created':
        return 'bg-brand-50 dark:bg-brand-950/50';
      case 'dispatched':
        return 'bg-blue-50 dark:bg-blue-950/50';
      case 'status_change':
        return 'bg-emerald-50 dark:bg-emerald-950/50';
      case 'driver_assigned':
        return 'bg-indigo-50 dark:bg-indigo-950/50';
      case 'delayed':
        return 'bg-rose-50 dark:bg-rose-950/50';
      default:
        return 'bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      {/* Header with Title and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Recent Logistics Activities
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time operational event stream across all transport hubs
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {['all', 'in transit', 'completed', 'delayed'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setFilter(opt);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
                filter === opt
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="my-2 divide-y divide-slate-100 dark:divide-slate-800/60">
        {currentItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No activities matching this filter.
          </div>
        ) : (
          currentItems.map((act) => (
            <div
              key={act.id}
              className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${getActivityIconBg(
                    act.type
                  )}`}
                >
                  {getActivityIcon(act.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {act.title}
                    </h5>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {act.trackingId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {act.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span>{act.timestamp}</span>
                    <span>•</span>
                    <span>{act.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <StatusBadge status={act.status} size="sm" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing {currentItems.length > 0 ? startIndex + 1 : 0} to{' '}
          {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} events
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-1 font-semibold text-slate-800 dark:text-slate-200">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
