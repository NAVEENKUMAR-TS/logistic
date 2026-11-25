import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import {
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { mockLiveShipment } from '../../data/mockLogisticsData';
import StatusBadge from '../common/StatusBadge';

// Custom SVG Icons for Leaflet markers
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); font-weight: bold; font-size: 11px;">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const currentPosIcon = createCustomIcon('#2563eb', '🚚');
const destinationIcon = createCustomIcon('#10b981', '🏁');

export const ShipmentTracking: React.FC = () => {
  const shipment = mockLiveShipment;

  const steps = [
    { label: 'Order Placed', time: '07:15 AM' },
    { label: 'Picked Up', time: '08:30 AM' },
    { label: 'In Transit', time: '02:15 PM' },
    { label: 'Out for Delivery', time: 'Est. 05:30 PM' },
    { label: 'Delivered', time: 'Est. 06:45 PM' },
  ];

  const currentStep = shipment.progressStep; // 2

  const routePositions: [number, number][] = [
    [41.8781, -87.6298], // Chicago origin
    [shipment.coordinates.lat, shipment.coordinates.lng], // Nashville current
    [shipment.destinationCoordinates.lat, shipment.destinationCoordinates.lng], // Atlanta destination
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              Live Shipment Tracking
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight flex items-center gap-2">
            {shipment.trackingId}
          </h3>
        </div>

        <StatusBadge status={shipment.currentStatus} />
      </div>

      {/* Map Preview Container */}
      <div className="my-3.5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-48 w-full relative z-0">
        <MapContainer
          center={[shipment.coordinates.lat, shipment.coordinates.lng]}
          zoom={5}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[shipment.coordinates.lat, shipment.coordinates.lng]} icon={currentPosIcon}>
            <Popup>
              <strong>{shipment.trackingId}</strong>
              <br />
              Status: {shipment.currentStatus}
              <br />
              Driver: {shipment.driver.name}
            </Popup>
          </Marker>
          <Marker
            position={[shipment.destinationCoordinates.lat, shipment.destinationCoordinates.lng]}
            icon={destinationIcon}
          >
            <Popup>
              <strong>Destination Depot</strong>
              <br />
              {shipment.destination}
            </Popup>
          </Marker>
          <Polyline positions={routePositions} color="#3b82f6" weight={3} dashArray="6, 8" />
        </MapContainer>

        <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-2 rounded-lg text-xs border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between z-[400]">
          <span className="text-slate-600 dark:text-slate-300 truncate">
            <strong>Current Route:</strong> I-65 Southbound (Near Nashville)
          </span>
          <span className="text-[10px] bg-brand-500 text-white font-semibold px-2 py-0.5 rounded-sm flex-shrink-0">
            GPS Active
          </span>
        </div>
      </div>

      {/* Origin & Destination Metadata */}
      <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-500" /> Origin
          </span>
          <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
            {shipment.origin}
          </p>
          <span className="text-[11px] text-slate-500">{shipment.pickupTimestamp}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-500" /> Destination
          </span>
          <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
            {shipment.destination}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {shipment.expectedDeliveryTime}
          </span>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
          <span>Transit Milestones</span>
          <span className="text-[11px] text-brand-600 dark:text-brand-400">Step {currentStep + 1} of 5</span>
        </h4>

        <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {steps.map((st, i) => {
            const isCompleted = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={i} className="relative flex items-center justify-between text-xs">
                {/* Dot */}
                <div
                  className={`absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-brand-500 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </div>

                <span
                  className={`font-medium ${
                    isCurrent
                      ? 'text-brand-600 dark:text-brand-400 font-semibold'
                      : isCompleted
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {st.label}
                </span>

                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {st.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Information Card */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={shipment.driver.avatar}
            alt={shipment.driver.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                {shipment.driver.name}
              </h5>
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                ★ {shipment.driver.rating}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Unit {shipment.driver.vehiclePlate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${shipment.driver.phone}`}
            title="Call Driver"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 dark:hover:text-brand-400 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            type="button"
            title="Message Dispatch"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 dark:hover:text-brand-400 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracking;
