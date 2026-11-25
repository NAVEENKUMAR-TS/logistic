CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "inventory_products" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'unit',
    "reorderLevel" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventory_products_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "inventory_products_reorderLevel_check" CHECK ("reorderLevel" >= 0)
);

CREATE TABLE "inventory_balances" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventory_balances_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "inventory_balances_quantity_check" CHECK ("quantity" >= 0)
);

CREATE TABLE "inventory_movements" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantityChange" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "inventory_movements_quantityChange_check" CHECK ("quantityChange" <> 0)
);

CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");
CREATE UNIQUE INDEX "inventory_products_sku_key" ON "inventory_products"("sku");
CREATE UNIQUE INDEX "inventory_balances_warehouseId_productId_key" ON "inventory_balances"("warehouseId", "productId");
CREATE INDEX "inventory_balances_productId_idx" ON "inventory_balances"("productId");
CREATE INDEX "inventory_movements_warehouseId_createdAt_idx" ON "inventory_movements"("warehouseId", "createdAt");
CREATE INDEX "inventory_movements_productId_createdAt_idx" ON "inventory_movements"("productId", "createdAt");

ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_productId_fkey" FOREIGN KEY ("productId") REFERENCES "inventory_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "inventory_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
