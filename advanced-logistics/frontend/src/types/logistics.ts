export interface KPICardData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  icon: string;
}

export interface MonthlyDeliveryStat {
  month: string;
  dispatched: number;
  delivered: number;
}

export interface FinancialMetric {
  totalExpenditure: number;
  totalRevenue: number;
  shippedQuantity: number;
  growthPercentage: number;
  monthlyTrend: {
    month: string;
    revenue: number;
    expenditure: number;
  }[];
}

export interface VehicleStats {
  totalVehicles: number;
  activeVehicles: number;
  onRoute: number;
  utilizationRate: number;
  weeklyPerformanceScore: number;
}

export interface ShipmentTrackingInfo {
  trackingId: string;
  origin: string;
  destination: string;
  currentStatus: 'Order Placed' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Delayed';
  pickupTimestamp: string;
  inTransitTimestamp: string;
  expectedDeliveryTime: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  destinationCoordinates: {
    lat: number;
    lng: number;
  };
  progressStep: number; // 0 to 4
  driver: {
    name: string;
    avatar: string;
    phone: string;
    vehiclePlate: string;
    rating: number;
  };
}

export type ActivityType = 'order_created' | 'dispatched' | 'status_change' | 'driver_assigned' | 'delayed';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  trackingId: string;
  status: 'Completed' | 'In Transit' | 'Pending' | 'Warning' | 'Delayed';
  location: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'danger';
}

