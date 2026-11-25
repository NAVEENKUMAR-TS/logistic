import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import { mockFinancialData } from '../../data/mockLogisticsData';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';
import { useTheme } from '../../hooks/useTheme';

export const FinancialOverview: React.FC = () => {
  const fin = mockFinancialData;
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const netProfit = fin.totalRevenue - fin.totalExpenditure;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Logistics Financial Performance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational freight expenditure vs. billable revenue
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <ArrowUpRight className="w-3.5 h-3.5" />
          +{fin.growthPercentage}% YoY
        </div>
      </div>

      {/* Primary KPI Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase">
            Total Shipping Revenue
          </span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(fin.totalRevenue)}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 inline-block">
            +18.4% volume growth
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase">
            Logistics Expenditure
          </span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(fin.totalExpenditure)}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 inline-block">
            Fuel, tolls, & fleet overhead
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-100/60 dark:border-brand-900/40">
          <span className="text-[11px] font-medium text-brand-800 dark:text-brand-300 uppercase">
            Net Margin / Shipped Units
          </span>
          <p className="text-xl font-bold text-brand-700 dark:text-brand-300 mt-1">
            {formatCurrency(netProfit)}
          </p>
          <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium mt-0.5 inline-block">
            {formatCompactNumber(fin.shippedQuantity)} units delivered
          </span>
        </div>
      </div>

      {/* Mini Trend Area Chart */}
      <div className="h-44 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={fin.monthlyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorExpenditure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 11 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 11 }}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Area
              type="monotone"
              name="Revenue"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              name="Expenditure"
              dataKey="expenditure"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpenditure)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialOverview;
