import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download } from 'lucide-react';
import { mockMonthlyStats, mockYearlyStats } from '../../data/mockLogisticsData';
import { useTheme } from '../../hooks/useTheme';

export const DeliveryStatistics: React.FC = () => {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { theme } = useTheme();

  const data = period === 'monthly' ? mockMonthlyStats : mockYearlyStats;

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      {/* Header with Title and Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Delivery & Dispatch Statistics
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comparison between dispatched cargo and completed deliveries
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Toggle */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1 rounded-lg transition-all ${
                period === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setPeriod('yearly')}
              className={`px-3 py-1 rounded-lg transition-all ${
                period === 'yearly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Quarterly / Year
            </button>
          </div>

          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Quick Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase">Avg. Dispatched</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">6,120 <span className="text-xs font-normal text-slate-500">units/mo</span></p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase">Avg. Delivered</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">5,910 <span className="text-xs font-normal text-slate-500">units/mo</span></p>
        </div>
        <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400 uppercase">Fulfillment Efficiency</span>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">96.6% <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">target met</span></p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 11 }}
              tickFormatter={(val) => `${val / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
              formatter={(value: number) => [`${value.toLocaleString()} shipments`, '']}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
            />
            <Bar
              name="Dispatched"
              dataKey="dispatched"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              name="Delivered"
              dataKey="delivered"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeliveryStatistics;
