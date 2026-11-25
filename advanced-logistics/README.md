# Advanced Intelligent Logistics - Management System

An enterprise logistics and supply chain management platform designed with modern, resilient architecture.

---

## Phases Overview

- **Phase 0:** Architecture Skeleton (Node.js/Express Backend, React/Vite Frontend)
- **Phase 1:** Data Layer (Supabase PostgreSQL + Prisma ORM)
- **Phase 2:** Logistics Dashboard & Frontend Interface (React + Tailwind CSS + Recharts + Leaflet)
- **Phase 3:** Warehouse & Inventory Management

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Environment Variables (`.env`)
Ensure your `.env` file in the project root includes your Supabase project credentials and PostgreSQL connection string:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Frontend Configuration
VITE_API_URL=http://localhost:4000

# Supabase API Configuration
SUPABASE_URL=https://mjvuaxppjynytpkhbiox.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key

# Supabase PostgreSQL Connection String (Prisma)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.mjvuaxppjynytpkhbiox.supabase.co:5432/postgres"
```

---

## Running the Application

### Frontend Dashboard (Phase 2)
```bash
# From project root:
cd frontend
npm run dev
# The dashboard opens at http://localhost:3000
```

Available Frontend Scripts:
- `npm run dev`: Starts the Vite development server on port 3000
- `npm run build`: Type-checks and builds optimized production bundle
- `npm run lint`: Runs ESLint with TypeScript rules

### Backend & Database (Phase 1)
```bash
# Apply pending Prisma migrations
npm run db:migrate

# Seed initial users, items, and ratings (idempotent)
npm run db:seed

# Run database & backend tests
npm test
```

### Warehouse & Inventory (Phase 3)
After applying migrations, open **Inventory Management** from the dashboard sidebar. Users with the `admin`, `manager`, or `warehouse_manager` role can create warehouses and products and record stock adjustments; `dispatcher` users have read-only inventory access.

Inventory quantities are non-negative whole-number units. Each adjustment updates the warehouse balance and records a movement in the same database transaction. To use the API directly, all routes require a Supabase bearer token:

- `GET /api/inventory/warehouses`, `POST /api/inventory/warehouses`
- `GET /api/inventory/products`, `POST /api/inventory/products`
- `GET /api/inventory/stock` (optional `warehouseId` query parameter)
- `GET /api/inventory/movements` (most recent 50)
- `POST /api/inventory/adjustments` (`warehouseId`, `productId`, non-zero `quantityChange`, optional `note`)

---

## Phase 2: Frontend Dashboard Architecture

```
frontend/src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx             # Collapsible enterprise navigation (Main, Intelligence, System)
│   │   ├── Header.tsx              # Search, notifications, theme toggle, breadcrumbs, user profile
│   │   └── DashboardLayout.tsx     # Shell layout wrapper
│   │
│   ├── dashboard/
│   │   ├── StatCard.tsx            # KPI metric cards (Total Orders, Active Shipments, Deliveries)
│   │   ├── DeliveryStatistics.tsx  # Dual-series Recharts bar chart with period filters
│   │   ├── ShipmentTracking.tsx    # Live Leaflet tracking panel, progress timeline, driver card
│   │   ├── FinancialOverview.tsx   # Revenue vs expenditure metrics and area trend chart
│   │   ├── VehicleOverview.tsx     # Fleet registered/active/on-route counts & utilization bar
│   │   └── RecentActivities.tsx    # Event stream table with status filters and pagination
│   │
│   └── common/
│       ├── SearchBar.tsx           # Global search input with shortcuts
│       ├── NotificationPanel.tsx   # Unread notifications drawer with mark-as-read
│       ├── ThemeToggle.tsx         # Dark / Light mode toggle
│       └── StatusBadge.tsx         # Color-coded logistics status badges
│
├── pages/
│   ├── Dashboard.tsx               # Main logistics operational dashboard view
│   ├── InventoryManagement.tsx     # Phase 3 stock, catalog, and movement workflows
│   ├── PlaceholderView.tsx         # Phase 2 navigation shell placeholder destinations
│   └── NotFound.tsx
│
├── hooks/
│   └── useTheme.tsx                # Context provider for Light and Dark themes
├── data/
│   └── mockLogisticsData.ts        # Isolated demonstration data for all operational metrics
├── types/
│   └── logistics.ts                # TypeScript definitions for logistics metrics and events
├── services/
│   └── inventory.ts                # Authenticated inventory API client
└── utils/
    └── formatters.ts               # Currency, number, and status styling helpers
```
