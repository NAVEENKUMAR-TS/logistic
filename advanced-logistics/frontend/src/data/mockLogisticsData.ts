import {
  KPICardData,
  MonthlyDeliveryStat,
  FinancialMetric,
  VehicleStats,
  ShipmentTrackingInfo,
  ActivityItem,
  NotificationItem,
} from '../types/logistics';

/**
 * DEMONSTRATION / MOCK DATA FOR PHASE 2 FRONTEND DASHBOARD
 * Clearly isolated and designed to match future logistics API schemas.
 */

export const mockKpiData: KPICardData[] = [
  {
    title: 'Total Orders',
    value: '45,280',
    change: '+12.5%',
    isPositive: true,
    subtext: 'vs. last month',
    icon: 'Package',
  },
  {
    title: 'Active Shipments',
    value: '1,842',
    change: '+8.2%',
    isPositive: true,
    subtext: 'currently in transit',
    icon: 'Truck',
  },
  {
    title: 'Delivered Shipments',
    value: '42,910',
    change: '+98.6%',
    isPositive: true,
    subtext: 'on-time fulfillment rate',
    icon: 'CheckCircle',
  },
];

export const mockMonthlyStats: MonthlyDeliveryStat[] = [
  { month: 'Jan', dispatched: 3200, delivered: 3050 },
  { month: 'Feb', dispatched: 3800, delivered: 3650 },
  { month: 'Mar', dispatched: 4500, delivered: 4320 },
  { month: 'Apr', dispatched: 4100, delivered: 3980 },
  { month: 'May', dispatched: 5200, delivered: 5050 },
  { month: 'Jun', dispatched: 5800, delivered: 5620 },
  { month: 'Jul', dispatched: 6400, delivered: 6200 },
  { month: 'Aug', dispatched: 6100, delivered: 5950 },
  { month: 'Sep', dispatched: 7100, delivered: 6880 },
  { month: 'Oct', dispatched: 7600, delivered: 7420 },
  { month: 'Nov', dispatched: 8200, delivered: 7950 },
  { month: 'Dec', dispatched: 9100, delivered: 8850 },
];

export const mockYearlyStats: MonthlyDeliveryStat[] = [
  { month: '2023 Q1', dispatched: 11500, delivered: 11020 },
  { month: '2023 Q2', dispatched: 15100, delivered: 14650 },
  { month: '2023 Q3', dispatched: 19600, delivered: 19030 },
  { month: '2023 Q4', dispatched: 24900, delivered: 24220 },
  { month: '2024 Q1', dispatched: 18200, delivered: 17800 },
  { month: '2024 Q2', dispatched: 22400, delivered: 21950 },
  { month: '2024 Q3', dispatched: 26800, delivered: 26100 },
  { month: '2024 Q4', dispatched: 31200, delivered: 30450 },
];

export const mockFinancialData: FinancialMetric = {
  totalExpenditure: 284500,
  totalRevenue: 548200,
  shippedQuantity: 128400,
  growthPercentage: 14.8,
  monthlyTrend: [
    { month: 'Jun', revenue: 42000, expenditure: 24000 },
    { month: 'Jul', revenue: 48000, expenditure: 26500 },
    { month: 'Aug', revenue: 45000, expenditure: 25000 },
    { month: 'Sep', revenue: 53000, expenditure: 28000 },
    { month: 'Oct', revenue: 58000, expenditure: 29500 },
    { month: 'Nov', revenue: 64000, expenditure: 32000 },
  ],
};

export const mockVehicleStats: VehicleStats = {
  totalVehicles: 142,
  activeVehicles: 118,
  onRoute: 96,
  utilizationRate: 83.1,
  weeklyPerformanceScore: 94.5,
};

export const mockLiveShipment: ShipmentTrackingInfo = {
  trackingId: 'TRK-89241-US',
  origin: 'Hub 04 - Chicago, IL',
  destination: 'Logistics Depot - Atlanta, GA',
  currentStatus: 'In Transit',
  pickupTimestamp: 'Nov 12, 2026 - 08:30 AM',
  inTransitTimestamp: 'Nov 12, 2026 - 02:15 PM',
  expectedDeliveryTime: 'Today, 06:45 PM',
  coordinates: {
    lat: 36.1627, // Nashville (midpoint along I-65/I-24 route)
    lng: -86.7816,
  },
  destinationCoordinates: {
    lat: 33.749, // Atlanta
    lng: -84.388,
  },
  progressStep: 2, // 0: Placed, 1: Picked Up, 2: In Transit, 3: Out for Delivery, 4: Delivered
  driver: {
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 382-9912',
    vehiclePlate: 'IL-9842-TR',
    rating: 4.9,
  },
};

export const mockActivities: ActivityItem[] = [
  {
    id: 'ACT-1001',
    type: 'status_change',
    title: 'Shipment TRK-89241-US in transit',
    description: 'Departed Nashville distribution sorting hub towards Atlanta Depot.',
    timestamp: '12 mins ago',
    trackingId: 'TRK-89241-US',
    status: 'In Transit',
    location: 'Nashville, TN',
  },
  {
    id: 'ACT-1002',
    type: 'status_change',
    title: 'Express Delivery Confirmed',
    description: 'Delivered & signed by customer Sarah Jenkins at Bay 4.',
    timestamp: '34 mins ago',
    trackingId: 'TRK-89190-TX',
    status: 'Completed',
    location: 'Dallas, TX',
  },
  {
    id: 'ACT-1003',
    type: 'delayed',
    title: 'Weather Delay Alert',
    description: 'Heavy snowfall on Interstate 90 causing 45m transit delay.',
    timestamp: '1 hour ago',
    trackingId: 'TRK-88934-NY',
    status: 'Delayed',
    location: 'Buffalo, NY',
  },
  {
    id: 'ACT-1004',
    type: 'dispatched',
    title: 'Warehouse Batch Dispatched',
    description: '480 pallets loaded onto Freightliner Cascadia Unit #42.',
    timestamp: '2 hours ago',
    trackingId: 'TRK-88802-OH',
    status: 'In Transit',
    location: 'Columbus, OH',
  },
  {
    id: 'ACT-1005',
    type: 'driver_assigned',
    title: 'Driver Assignment Updated',
    description: 'Elena Rostova assigned to regional distribution route #18.',
    timestamp: '3 hours ago',
    trackingId: 'TRK-88741-PA',
    status: 'Pending',
    location: 'Philadelphia, PA',
  },
  {
    id: 'ACT-1006',
    type: 'order_created',
    title: 'Bulk Manifest Created',
    description: 'Order #ORD-77402 generated for Global Tech Supply Chain.',
    timestamp: '4 hours ago',
    trackingId: 'TRK-88690-CA',
    status: 'Pending',
    location: 'Long Beach, CA',
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    title: 'Delayed Freight Notice',
    message: 'Shipment TRK-88934-NY delayed by winter storm conditions.',
    time: '15m ago',
    read: false,
    type: 'danger',
  },
  {
    id: 'NOTIF-02',
    title: 'Warehouse Capacity Alert',
    message: 'Central Facility B is operating at 92% bay utilization.',
    time: '1h ago',
    read: false,
    type: 'warning',
  },
  {
    id: 'NOTIF-03',
    title: 'Customs Clearance Approved',
    message: 'Container manifest C-9024 cleared Port of Newark.',
    time: '3h ago',
    read: true,
    type: 'success',
  },
];

