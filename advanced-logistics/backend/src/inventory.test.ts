import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const transaction = {
    inventoryBalance: {
      upsert: vi.fn(),
      updateMany: vi.fn(),
    },
    inventoryMovement: {
      create: vi.fn(),
    },
  };
  return {
    transaction,
    warehouseCreate: vi.fn(),
    productCreate: vi.fn(),
    $transaction: vi.fn(
      async (callback: (tx: typeof transaction) => Promise<unknown>) => callback(transaction)
    ),
  };
});

vi.mock('./database/client.js', () => ({
  prisma: {
    warehouse: { create: mocks.warehouseCreate },
    inventoryProduct: { create: mocks.productCreate },
    $transaction: mocks.$transaction,
  },
}));

import { InventoryError, InventoryService } from './services/inventory.service.js';

describe('InventoryService', () => {
  const service = new InventoryService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects invalid warehouse data before writing to the database', async () => {
    await expect(service.createWarehouse({ code: ' ', name: 'North Depot' })).rejects.toMatchObject({
      statusCode: 400,
      message: 'code is required',
    });
    expect(mocks.warehouseCreate).not.toHaveBeenCalled();
  });

  it('does not record an adjustment that would make stock negative', async () => {
    mocks.transaction.inventoryBalance.upsert.mockResolvedValue({});
    mocks.transaction.inventoryBalance.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.adjustStock({
        warehouseId: 'warehouse-1',
        productId: 'product-1',
        quantityChange: -2,
      })
    ).rejects.toBeInstanceOf(InventoryError);

    expect(mocks.transaction.inventoryMovement.create).not.toHaveBeenCalled();
    expect(mocks.transaction.inventoryBalance.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ quantity: { gte: 2 } }),
      })
    );
  });

  it('updates stock and records a movement together for a valid adjustment', async () => {
    const movement = { id: 'movement-1', quantityChange: 5 };
    mocks.transaction.inventoryBalance.upsert.mockResolvedValue({});
    mocks.transaction.inventoryBalance.updateMany.mockResolvedValue({ count: 1 });
    mocks.transaction.inventoryMovement.create.mockResolvedValue(movement);

    await expect(
      service.adjustStock({
        warehouseId: 'warehouse-1',
        productId: 'product-1',
        quantityChange: 5,
      })
    ).resolves.toEqual(movement);

    expect(mocks.transaction.inventoryBalance.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: { quantity: { increment: 5 } } })
    );
    expect(mocks.transaction.inventoryMovement.create).toHaveBeenCalledTimes(1);
  });
});
