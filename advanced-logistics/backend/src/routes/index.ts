import { RequestHandler, Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { adminAuthService } from '../services/adminAuth.service.js';
import { inventoryService } from '../services/inventory.service.js';
import { config } from '../config/index.js';

export const router = Router();
const asyncHandler = (handler: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
const inventoryReaders = ['admin', 'manager', 'dispatcher', 'warehouse_manager'];
const inventoryWriters = ['admin', 'manager', 'warehouse_manager'];

// Public Health Check
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Development Only: Provision test account via Supabase Admin API
if (config.nodeEnv !== 'production') {
  router.post('/api/dev/provision-test-user', async (req, res) => {
    const { email, password, serviceRoleKey } = req.body || {};
    const result = await adminAuthService.provisionTestAccount(
      email || 'admin.ailms@gmail.com',
      password || '12345678',
      serviceRoleKey
    );
    res.status(result.success ? 200 : 400).json(result);
  });
}

// Protected: Current authenticated user details
router.get('/api/auth/me', requireAuth, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user?.id,
      email: req.user?.email,
      role: req.userRole,
      lastSignIn: req.user?.last_sign_in_at,
    },
  });
});

// Protected: Logistics active shipments endpoint (Dispatcher / Manager / Admin)
router.get(
  '/api/logistics/shipments',
  requireAuth,
  requireRole(['admin', 'dispatcher', 'manager']),
  (req, res) => {
    res.status(200).json({
      shipments: [
        {
          id: 'SHP-9021',
          trackingNumber: 'TRK-98234-AILMS',
          origin: 'Port of Singapore (SGSIN)',
          destination: 'Port of Rotterdam (NLRTM)',
          status: 'In Transit',
          vessel: 'Atlantic Star IV',
        },
        {
          id: 'SHP-9022',
          trackingNumber: 'TRK-98235-AILMS',
          origin: 'Port of Busan (KRPUS)',
          destination: 'Port of Los Angeles (USLAX)',
          status: 'Customs Cleared',
          vessel: 'Pacific Voyager',
        },
      ],
      requestedBy: req.user?.email,
      role: req.userRole,
    });
  }
);

router.get(
  '/api/inventory/warehouses',
  requireAuth,
  requireRole(inventoryReaders),
  asyncHandler(async (_req, res) => {
    res.status(200).json({ warehouses: await inventoryService.listWarehouses() });
  })
);

router.post(
  '/api/inventory/warehouses',
  requireAuth,
  requireRole(inventoryWriters),
  asyncHandler(async (req, res) => {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
    const warehouse = await inventoryService.createWarehouse(body);
    res.status(201).json({ warehouse });
  })
);

router.get(
  '/api/inventory/products',
  requireAuth,
  requireRole(inventoryReaders),
  asyncHandler(async (_req, res) => {
    res.status(200).json({ products: await inventoryService.listProducts() });
  })
);

router.post(
  '/api/inventory/products',
  requireAuth,
  requireRole(inventoryWriters),
  asyncHandler(async (req, res) => {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
    const product = await inventoryService.createProduct(body);
    res.status(201).json({ product });
  })
);

router.get(
  '/api/inventory/stock',
  requireAuth,
  requireRole(inventoryReaders),
  asyncHandler(async (req, res) => {
    const warehouseId =
      typeof req.query.warehouseId === 'string' ? req.query.warehouseId : undefined;
    res.status(200).json({ stock: await inventoryService.listStock(warehouseId) });
  })
);

router.get(
  '/api/inventory/movements',
  requireAuth,
  requireRole(inventoryReaders),
  asyncHandler(async (_req, res) => {
    res.status(200).json({ movements: await inventoryService.listMovements() });
  })
);

router.post(
  '/api/inventory/adjustments',
  requireAuth,
  requireRole(inventoryWriters),
  asyncHandler(async (req, res) => {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
    const movement = await inventoryService.adjustStock(body);
    res.status(201).json({ movement });
  })
);

// Protected: Administrator-only system controls
router.get(
  '/api/admin/system',
  requireAuth,
  requireRole(['admin']),
  (req, res) => {
    res.status(200).json({
      systemStatus: 'Optimal',
      activeNodes: 12,
      databaseConnections: 8,
      administrator: req.user?.email,
    });
  }
);

export default router;
