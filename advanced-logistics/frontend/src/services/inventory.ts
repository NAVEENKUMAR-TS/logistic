export interface Warehouse {
  id: string;
  code: string;
  name: string;
  location: string | null;
}

export interface InventoryProduct {
  id: string;
  sku: string;
  name: string;
  unit: string;
  reorderLevel: number;
}

export interface InventoryStock {
  id: string;
  quantity: number;
  product: InventoryProduct;
  warehouse: Warehouse;
}

export interface InventoryMovement {
  id: string;
  quantityChange: number;
  note: string | null;
  createdAt: string;
  product: InventoryProduct;
  warehouse: Warehouse;
}

interface InventoryResponse<T> {
  [key: string]: T;
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const request = async <T>(
  path: string,
  accessToken: string,
  init?: RequestInit
): Promise<T> => {
  const response = await fetch(`${apiUrl}/api/inventory/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  const payload = (await response.json()) as { message?: string } & T;
  if (!response.ok) {
    throw new Error(payload.message || `Inventory request failed (${response.status})`);
  }
  return payload;
};

export const inventoryApi = {
  warehouses: (token: string) => request<InventoryResponse<Warehouse[]>>('warehouses', token),
  products: (token: string) => request<InventoryResponse<InventoryProduct[]>>('products', token),
  stock: (token: string) => request<InventoryResponse<InventoryStock[]>>('stock', token),
  movements: (token: string) => request<InventoryResponse<InventoryMovement[]>>('movements', token),
  createWarehouse: (token: string, data: { code: string; name: string; location?: string }) =>
    request<InventoryResponse<Warehouse>>('warehouses', token, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  createProduct: (
    token: string,
    data: { sku: string; name: string; unit: string; reorderLevel: number }
  ) =>
    request<InventoryResponse<InventoryProduct>>('products', token, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  adjustStock: (
    token: string,
    data: { warehouseId: string; productId: string; quantityChange: number; note?: string }
  ) =>
    request<InventoryResponse<InventoryMovement>>('adjustments', token, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
