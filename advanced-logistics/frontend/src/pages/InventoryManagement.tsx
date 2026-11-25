import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { AlertTriangle, ArrowDown, ArrowUp, Boxes, LoaderCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  InventoryMovement,
  InventoryProduct,
  InventoryStock,
  Warehouse,
  inventoryApi,
} from '../services/inventory';

const panelClass =
  'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900';
const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white';
const buttonClass =
  'inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50';

export const InventoryManagement: React.FC = () => {
  const { session, userRole } = useAuth();
  const canAdjust = ['admin', 'manager', 'warehouse_manager'].includes(userRole);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [stock, setStock] = useState<InventoryStock[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const refresh = useCallback(async () => {
    if (!session?.access_token) return;
    setError('');
    try {
      const [warehouseResult, productResult, stockResult, movementResult] = await Promise.all([
        inventoryApi.warehouses(session.access_token),
        inventoryApi.products(session.access_token),
        inventoryApi.stock(session.access_token),
        inventoryApi.movements(session.access_token),
      ]);
      setWarehouses(warehouseResult.warehouses);
      setProducts(productResult.products);
      setStock(stockResult.stock);
      setMovements(movementResult.movements);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load inventory');
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const submit = async (
    event: FormEvent<HTMLFormElement>,
    action: () => Promise<unknown>,
    successMessage: string
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    setError('');
    setNotice('');
    setSaving(true);
    try {
      await action();
      form.reset();
      setNotice(successMessage);
      await refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Inventory update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        Loading inventory…
      </div>
    );
  }

  const totalUnits = stock.reduce((total, balance) => total + balance.quantity, 0);
  const lowStockCount = stock.filter(
    (balance) => balance.quantity <= balance.product.reorderLevel
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Inventory overview</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Stock levels by warehouse, with an auditable adjustment history.
          </p>
        </div>
        <button type="button" className={buttonClass} onClick={() => void refresh()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {notice}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className={panelClass}>
          <p className="text-sm text-slate-500 dark:text-slate-400">Warehouses</p>
          <p className="mt-2 text-2xl font-bold">{warehouses.length}</p>
        </div>
        <div className={panelClass}>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tracked products</p>
          <p className="mt-2 text-2xl font-bold">{products.length}</p>
        </div>
        <div className={panelClass}>
          <p className="text-sm text-slate-500 dark:text-slate-400">Units on hand</p>
          <p className="mt-2 text-2xl font-bold">{totalUnits.toLocaleString()}</p>
        </div>
      </section>

      {lowStockCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {lowStockCount} stock balance{lowStockCount === 1 ? '' : 's'} at or below reorder level.
        </div>
      )}

      {canAdjust && (
        <section className="grid gap-5 xl:grid-cols-3">
          <form
            className={`${panelClass} space-y-3`}
            onSubmit={(event) => {
              const form = event.currentTarget;
              const data = new FormData(form);
              void submit(
                event,
                () =>
                  inventoryApi.createWarehouse(session!.access_token, {
                    code: String(data.get('code')),
                    name: String(data.get('name')),
                    location: String(data.get('location') || ''),
                  }),
                'Warehouse added.'
              );
            }}
          >
            <h3 className="font-semibold">Add warehouse</h3>
            <input className={inputClass} name="code" placeholder="Warehouse code" required maxLength={32} />
            <input className={inputClass} name="name" placeholder="Warehouse name" required maxLength={120} />
            <input className={inputClass} name="location" placeholder="Location (optional)" maxLength={160} />
            <button className={buttonClass} disabled={saving} type="submit">Add warehouse</button>
          </form>

          <form
            className={`${panelClass} space-y-3`}
            onSubmit={(event) => {
              const data = new FormData(event.currentTarget);
              void submit(
                event,
                () =>
                  inventoryApi.createProduct(session!.access_token, {
                    sku: String(data.get('sku')),
                    name: String(data.get('name')),
                    unit: String(data.get('unit') || 'unit'),
                    reorderLevel: Number(data.get('reorderLevel') || 0),
                  }),
                'Product added.'
              );
            }}
          >
            <h3 className="font-semibold">Add product</h3>
            <input className={inputClass} name="sku" placeholder="SKU" required maxLength={64} />
            <input className={inputClass} name="name" placeholder="Product name" required maxLength={160} />
            <div className="grid grid-cols-2 gap-3">
              <input className={inputClass} name="unit" placeholder="Unit (e.g. pallet)" defaultValue="unit" required maxLength={24} />
              <input className={inputClass} name="reorderLevel" type="number" min="0" step="1" placeholder="Reorder level" defaultValue="0" required />
            </div>
            <button className={buttonClass} disabled={saving} type="submit">Add product</button>
          </form>

          <form
            className={`${panelClass} space-y-3`}
            onSubmit={(event) => {
              const data = new FormData(event.currentTarget);
              void submit(
                event,
                () =>
                  inventoryApi.adjustStock(session!.access_token, {
                    warehouseId: String(data.get('warehouseId')),
                    productId: String(data.get('productId')),
                    quantityChange: Number(data.get('quantityChange')),
                    note: String(data.get('note') || ''),
                  }),
                'Stock adjustment recorded.'
              );
            }}
          >
            <h3 className="font-semibold">Adjust stock</h3>
            <select className={inputClass} name="warehouseId" required defaultValue="">
              <option value="" disabled>Select warehouse</option>
              {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name} ({warehouse.code})</option>)}
            </select>
            <select className={inputClass} name="productId" required defaultValue="">
              <option value="" disabled>Select product</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.sku})</option>)}
            </select>
            <input className={inputClass} name="quantityChange" type="number" step="1" required placeholder="Quantity change (e.g. 12 or -3)" />
            <input className={inputClass} name="note" placeholder="Reason / reference (optional)" maxLength={240} />
            <button className={buttonClass} disabled={saving || !warehouses.length || !products.length} type="submit">
              Record adjustment
            </button>
          </form>
        </section>
      )}

      {!canAdjust && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You have read-only access. Contact an administrator or warehouse manager to make stock changes.
        </p>
      )}

      <section className={panelClass}>
        <div className="mb-4 flex items-center gap-2">
          <Boxes className="h-5 w-5 text-brand-600" />
          <h3 className="font-semibold">Stock by warehouse</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800">
              <tr><th className="pb-3 pr-4">Product</th><th className="pb-3 pr-4">Warehouse</th><th className="pb-3 pr-4">On hand</th><th className="pb-3">Reorder level</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stock.map((balance) => (
                <tr key={balance.id}>
                  <td className="py-3 pr-4"><span className="font-medium">{balance.product.name}</span><span className="ml-2 text-xs text-slate-500">{balance.product.sku}</span></td>
                  <td className="py-3 pr-4">{balance.warehouse.name}</td>
                  <td className={`py-3 pr-4 font-semibold ${balance.quantity <= balance.product.reorderLevel ? 'text-amber-600 dark:text-amber-400' : ''}`}>{balance.quantity.toLocaleString()} {balance.product.unit}</td>
                  <td className="py-3">{balance.product.reorderLevel.toLocaleString()} {balance.product.unit}</td>
                </tr>
              ))}
              {stock.length === 0 && <tr><td className="py-8 text-center text-slate-500" colSpan={4}>No stock balances yet. Add a warehouse and product, then record an adjustment.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className={panelClass}>
        <h3 className="mb-4 font-semibold">Recent movements</h3>
        <div className="space-y-3">
          {movements.map((movement) => {
            const positive = movement.quantityChange > 0;
            const MovementIcon = positive ? ArrowUp : ArrowDown;
            return (
              <div key={movement.id} className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${positive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'}`}>
                  <MovementIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{movement.product.name} · {movement.warehouse.name}</p>
                  <p className="truncate text-xs text-slate-500">{movement.note || 'Stock adjustment'} · {new Date(movement.createdAt).toLocaleString()}</p>
                </div>
                <span className={`text-sm font-semibold ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>{positive ? '+' : ''}{movement.quantityChange}</span>
              </div>
            );
          })}
          {movements.length === 0 && <p className="py-4 text-sm text-slate-500">No inventory movements recorded yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default InventoryManagement;
