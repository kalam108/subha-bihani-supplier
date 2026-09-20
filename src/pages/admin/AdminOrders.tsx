import React, { useEffect, useState } from 'react';
import { ShoppingCart, Search, Eye, CheckCircle2, Truck, RefreshCw, X, FileText } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { useCurrency } from '../../context/LanguageCurrencyContext';

export const AdminOrders: React.FC = () => {
  const { formatMoney } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'ALL' && o.orderStatus !== filterStatus) return false;
    if (
      search &&
      !o.orderNumber.toLowerCase().includes(search.toLowerCase()) &&
      !o.customerName.toLowerCase().includes(search.toLowerCase()) &&
      !(o.shippingAddress || o.deliveryAddress).toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const statuses: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'READY',
    'OUT_FOR_DELIVERY',
    'COMPLETED',
    'CANCELLED',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Order Management & Fulfillment</h2>
          <p className="text-xs text-slate-500">
            Track customer procurement requests, progress dispatch states, and review billing invoices.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, customer, address..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white text-slate-700"
            >
              <option value="ALL">All Orders ({orders.length})</option>
              {statuses.map((st) => (
                <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Quick Transition</th>
                <th className="p-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-900">{o.customerName}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{o.city}</div>
                  </td>
                  <td className="p-3 text-slate-500 whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-medium text-slate-700">{o.items.length} items</td>
                  <td className="p-3 font-bold text-slate-900">{formatMoney(o.totalAmount)}</td>
                  <td className="p-3">
                    <span className="text-[11px] text-slate-600 font-medium">
                      {o.paymentMethod.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3">
                    <StatusBadge status={o.orderStatus} />
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                      className="px-2 py-1 text-[11px] font-semibold border border-slate-300 rounded bg-white text-slate-800"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-sky-700"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 space-y-4 animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-medium">Order Detail</span>
                <h3 className="font-bold font-mono text-lg text-slate-900">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <div>
                <strong className="text-slate-800 block">Customer Information:</strong>
                <span>{selectedOrder.customerName}</span>
                <span className="block text-slate-500 font-mono">{selectedOrder.customerPhone}</span>
                <span className="block text-slate-500">{selectedOrder.customerEmail}</span>
              </div>
              <div>
                <strong className="text-slate-800 block">Dispatch Location:</strong>
                <span>{selectedOrder.shippingAddress || selectedOrder.deliveryAddress}</span>
                <span className="block text-slate-500">{selectedOrder.city}</span>
                {selectedOrder.notes && (
                  <span className="block text-slate-600 italic mt-1">&ldquo;{selectedOrder.notes}&rdquo;</span>
                )}
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Order Manifest
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{it.productName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        SKU: {it.sku} • {it.quantity} {it.unit || 'pcs'} × {formatMoney(it.price)}
                      </div>
                    </div>
                    <div className="font-bold text-slate-900">
                      {formatMoney(it.quantity * it.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100">
              <span className="text-slate-700">Total Invoice Amount (inc. 13% VAT):</span>
              <span className="text-base text-slate-900">{formatMoney(selectedOrder.totalAmount)}</span>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-md font-semibold text-slate-600 hover:bg-slate-100 text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-md font-semibold bg-slate-900 hover:bg-sky-700 text-white text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Print Official Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
