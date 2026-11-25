import { Prisma } from '@prisma/client';
import { prisma } from '../database/client.js';

export class InventoryError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = 'InventoryError';
  }
}

const requiredText = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new InventoryError(`${field} is required`, 400);
  }
  return value.trim();
};

const nonNegativeInteger = (value: unknown, field: string, fallback = 0): number => {
  if (value === undefined && fallback !== undefined) return fallback;
  if (!Number.isSafeInteger(value) || Number(value) < 0) {
    throw new InventoryError(`${field} must be a non-negative integer`, 400);
  }
  return Number(value);
};

export class InventoryService {
  async listWarehouses() {
    return prisma.warehouse.findMany({ orderBy: { name: 'asc' } });
  }

  async createWarehouse(input: { code?: unknown; name?: unknown; location?: unknown }) {
    const code = requiredText(input.code, 'code').toUpperCase();
    const name = requiredText(input.name, 'name');
    const location =
      input.location === undefined || input.location === null || input.location === ''
        ? null
        : requiredText(input.location, 'location');

    return prisma.warehouse.create({ data: { code, name, location } });
  }

  async listProducts() {
    return prisma.inventoryProduct.findMany({ orderBy: { name: 'asc' } });
  }

  async createProduct(input: {
    sku?: unknown;
    name?: unknown;
    unit?: unknown;
    reorderLevel?: unknown;
  }) {
    const sku = requiredText(input.sku, 'sku').toUpperCase();
    const name = requiredText(input.name, 'name');
    const unit = input.unit === undefined ? 'unit' : requiredText(input.unit, 'unit');
    const reorderLevel = nonNegativeInteger(input.reorderLevel, 'reorderLevel');

    return prisma.inventoryProduct.create({
      data: { sku, name, unit, reorderLevel },
    });
  }

  async listStock(warehouseId?: string) {
    return prisma.inventoryBalance.findMany({
      where: warehouseId ? { warehouseId } : undefined,
      include: { product: true, warehouse: true },
      orderBy: [{ warehouse: { name: 'asc' } }, { product: { name: 'asc' } }],
    });
  }

  async listMovements() {
    return prisma.inventoryMovement.findMany({
      include: { product: true, warehouse: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async adjustStock(input: {
    warehouseId?: unknown;
    productId?: unknown;
    quantityChange?: unknown;
    note?: unknown;
  }) {
    const warehouseId = requiredText(input.warehouseId, 'warehouseId');
    const productId = requiredText(input.productId, 'productId');
    if (!Number.isSafeInteger(input.quantityChange) || Number(input.quantityChange) === 0) {
      throw new InventoryError('quantityChange must be a non-zero integer', 400);
    }
    const quantityChange = Number(input.quantityChange);
    const note =
      input.note === undefined || input.note === null || input.note === ''
        ? null
        : requiredText(input.note, 'note');

    try {
      return await prisma.$transaction(async (transaction) => {
        await transaction.inventoryBalance.upsert({
          where: { warehouseId_productId: { warehouseId, productId } },
          create: { warehouseId, productId, quantity: 0 },
          update: {},
        });

        const updated = await transaction.inventoryBalance.updateMany({
          where: {
            warehouseId,
            productId,
            ...(quantityChange < 0 ? { quantity: { gte: Math.abs(quantityChange) } } : {}),
          },
          data: { quantity: { increment: quantityChange } },
        });
        if (updated.count !== 1) {
          throw new InventoryError('Adjustment would make stock quantity negative', 409);
        }

        const movement = await transaction.inventoryMovement.create({
          data: { warehouseId, productId, quantityChange, note },
          include: { product: true, warehouse: true },
        });
        return movement;
      });
    } catch (error) {
      if (error instanceof InventoryError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new InventoryError('Warehouse or product was not found', 404);
      }
      throw error;
    }
  }
}

export const inventoryService = new InventoryService();
