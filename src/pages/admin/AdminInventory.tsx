import React, { useEffect, useState } from 'react';
import { Boxes, AlertTriangle, CheckCircle2, ArrowUpRight, Search, RefreshCw } from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { useCurrency } from '../../context/LanguageCurrencyContext';

export const AdminInventory: React.FC = () => {
  const { formatMoney } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRestock = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    try {
      await api.updateProduct(product.id, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
      );
    } catch (err) {
      console.error('Failed to update stock', err);
    }
  };

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStockAlert).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const filtered = products.filter((p) => {
    if (filter === 'low' && !(p.stock > 0 && p.stock <= p.minStockAlert)) return false;
    if (filter === 'out' && p.stock > 0) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Warehouse Inventory & Stock Alerts</h2>
          <p className="text-xs text-slate-500">
            Monitor central warehouse levels and execute 1-click batch restocks.
          </p>
        </div>

        <button
          onClick={loadInventory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* KPI Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
          }`}
        >
          <span className={`text-[11px] font-semibold uppercase tracking-wider block ${filter === 'all' ? 'text-slate-400' : 'text-slate-500'}`}>
            Total Tracked SKUs
          </span>
          <span className="text-2xl font-bold mt-1 block">{products.length} Items</span>
        </button>

        <button
          onClick={() => setFilter('low')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filter === 'low'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
          }`}
        >
          <span className={`text-[11px] font-semibold uppercase tracking-wider block ${filter === 'low' ? 'text-amber-200' : 'text-amber-600'}`}>
            Low Stock Warnings (≤ Threshold)
          </span>
          <span className="text-2xl font-bold mt-1 block">{lowStockCount} Items</span>
        </button>

        <button
          onClick={() => setFilter('out')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filter === 'out'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
          }`}
        >
          <span className={`text-[11px] font-semibold uppercase tracking-wider block ${filter === 'out' ? 'text-rose-200' : 'text-rose-600'}`}>
            Out of Stock
          </span>
          <span className="text-2xl font-bold mt-1 block">{outOfStockCount} Items</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items for restock..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md text-xs"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filtered.length} products
        </span>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Product Name & SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Alert Threshold</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const isOut = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= p.minStockAlert;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">SKU: {p.sku}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-900">{formatMoney(p.price)}</td>
                    <td className="p-3">
                      <span className={`font-mono text-sm font-bold ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-900'}`}>
                        {p.stock} <span className="text-[11px] font-normal text-slate-500">{p.unit}</span>
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono">{p.minStockAlert} {p.unit}</td>
                    <td className="p-3">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Reorder Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Adequate
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleQuickRestock(p, 10)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-colors"
                          title="Add 10 units"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleQuickRestock(p, 50)}
                          className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-semibold border border-sky-200 transition-colors"
                          title="Add 50 units"
                        >
                          +50
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
