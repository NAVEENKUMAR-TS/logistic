import React from 'react';
import StatCard from '../components/dashboard/StatCard';
import DeliveryStatistics from '../components/dashboard/DeliveryStatistics';
import ShipmentTracking from '../components/dashboard/ShipmentTracking';
import FinancialOverview from '../components/dashboard/FinancialOverview';
import VehicleOverview from '../components/dashboard/VehicleOverview';
import RecentActivities from '../components/dashboard/RecentActivities';
import { mockKpiData } from '../data/mockLogisticsData';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Primary KPI Cards Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockKpiData.map((kpi, idx) => (
          <StatCard key={idx} data={kpi} />
        ))}
      </section>

      {/* 2. Main Dashboard Layout: Content Grid + Right Tracking Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left / Center Major Analytics Column (8 cols on XL) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Delivery Statistics Chart */}
          <DeliveryStatistics />

          {/* Secondary Financial & Vehicle Metric Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialOverview />
            <VehicleOverview />
          </div>

          {/* Recent Logistics Activities Stream */}
          <RecentActivities />
        </div>

        {/* Right Side Live Shipment Tracking Panel (4 cols on XL) */}
        <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-20">
          <ShipmentTracking />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

