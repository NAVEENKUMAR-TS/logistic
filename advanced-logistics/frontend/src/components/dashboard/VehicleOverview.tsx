import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { mockVehicleStats } from '../../data/mockLogisticsData';

export const VehicleOverview: React.FC = () => {
  const stats = mockVehicleStats;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Fleet & Vehicle Utilization
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational status of long-haul and regional fleet
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
          <Truck className="w-5 h-5" />
        </div>
      </div>

      {/* Utilization Rate Progress Bar */}
      <div className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Current Fleet Utilization
          </span>
          <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
            {stats.utilizationRate}%
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-600 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${stats.utilizationRate}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2">
          <span>Optimal Target: 80-85%</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Within Healthy Capacity</span>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase">
            Total Fleet
          </span>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {stats.totalVehicles}
          </p>
          <span className="text-[10px] text-slate-500">Registered units</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
          <span className="text-[10px] font-medium text-emerald-800 dark:text-emerald-400 uppercase">
            Active
          </span>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
            {stats.activeVehicles}
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Ready/Standby</span>
        </div>

        <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
          <span className="text-[10px] font-medium text-blue-800 dark:text-blue-400 uppercase">
            On Route
          </span>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-0.5">
            {stats.onRoute}
          </p>
          <span className="text-[10px] text-blue-600 dark:text-blue-400">In Transit</span>
        </div>
      </div>

      {/* Weekly Performance Score Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Weekly Inspection & Compliance:
          </span>
        </div>
        <span className="font-bold text-slate-900 dark:text-white">
          {stats.weeklyPerformanceScore}% Satisfactory
        </span>
      </div>
    </div>
  );
};

export default VehicleOverview;
